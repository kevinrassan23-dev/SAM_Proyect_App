import * as React from "react";
import { useState, useEffect } from "react";
import { View, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../styles/PagoNFCStyle";
import theme from "../../theme/Theme";

function PagoNFC() {
    const { total: totalParam } = useLocalSearchParams<{ total: string }>();
    const TOTAL = parseFloat(totalParam || "0");
    const safeTotal = TOTAL.toFixed(2);

    const [pagoAceptado, setPagoAceptado] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (pagoAceptado) {
            timer = setTimeout(() => {
                router.push({
                    pathname: "/screens/Confirmacion",
                    params: { total: TOTAL.toString(), metodo: "nfc" },
                });
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [pagoAceptado]);

    const handleEscanear = () => {
        setPagoAceptado(true);
    };

    const handleVolver = () => {
        router.push({
            pathname: "/screens/FormaPago",
            params: { total: TOTAL.toString() },
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Pago sin contacto</Text>
            </View>

            {/* Total */}
            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>{safeTotal} €</Text>
            </View>

            {/* Contenido central */}
            <View style={styles.centerContent}>
                {!pagoAceptado ? (
                    <>
                        <View style={styles.iconCircle}>
                            <MaterialIcons
                                name="contactless"
                                size={72}
                                color={theme.colors.secondary}
                            />
                        </View>

                        <Text style={styles.instructionText}>
                            Acerca tu tarjeta o dispositivo al terminal para
                            pagar
                        </Text>

                        <Pressable
                            style={({ pressed }) => [
                                styles.scanBtn,
                                { opacity: pressed ? 0.85 : 1 },
                            ]}
                            onPress={handleEscanear}
                        >
                            <MaterialIcons
                                name="contactless"
                                size={22}
                                color="#fff"
                            />
                            <Text style={styles.scanBtnText}>Escanear</Text>
                        </Pressable>
                    </>
                ) : (
                    <>
                        <View style={styles.successCircle}>
                            <MaterialIcons
                                name="check-circle"
                                size={80}
                                color={theme.colors.primary}
                            />
                        </View>

                        <Text style={styles.successText}>¡Pago aceptado!</Text>
                        <Text style={styles.redirectText}>
                            Redirigiendo en unos segundos...
                        </Text>
                    </>
                )}
            </View>

            {/* Botones secundarios */}
            {!pagoAceptado && (
                <View style={styles.secondaryButtons}>
                    <Pressable
                        style={styles.secondaryBtn}
                        onPress={handleVolver}
                    >
                        <MaterialIcons
                            name="arrow-back"
                            size={18}
                            color={theme.colors.secondary}
                        />
                        <Text style={styles.secondaryBtnText}>Volver</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.secondaryBtn, styles.cancelBtn]}
                        onPress={() => router.push("/screens/Home")}
                    >
                        <MaterialIcons
                            name="cancel"
                            size={18}
                            color="#d82215"
                        />
                        <Text
                            style={[
                                styles.secondaryBtnText,
                                styles.cancelText,
                            ]}
                        >
                            Cancelar pedido
                        </Text>
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    );
}

export default PagoNFC;