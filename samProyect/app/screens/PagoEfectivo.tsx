import * as React from "react";
import { useState } from "react";
import { View, Alert, Pressable, TextInput } from "react-native";
import { Text } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../styles/PagoEfectivoStyle";
import theme from "../../theme/Theme";

function PagoEfectivo() {
    const { total: totalParam } = useLocalSearchParams<{ total: string }>();
    const TOTAL = parseFloat(totalParam || "0");
    const safeTotal = TOTAL.toFixed(2);

    const [importe, setImporte] = useState("");

    const handleAceptar = () => {
        const value = parseFloat(importe.replace(",", ".")) || 0;
        if (value >= TOTAL) {
            router.push({
                pathname: "/screens/Confirmacion",
                params: { total: TOTAL.toString(), metodo: "efectivo" },
            });
        } else {
            Alert.alert(
                "Pago insuficiente",
                "No se puede procesar el pago: el importe es menor al total."
            );
        }
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
                <Text style={styles.title}>Pago en Efectivo</Text>
            </View>

            {/* Total */}
            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>{safeTotal} €</Text>
            </View>

            {/* Formulario centrado */}
            <View style={styles.centerContent}>
                <View style={styles.iconCircle}>
                    <MaterialIcons name="payments" size={72} color="#16C172" />
                </View>

                <Text style={styles.inputLabel}>
                    Ingresa el importe entregado
                </Text>

                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={importe}
                    onChangeText={setImporte}
                    placeholder="0.00 €"
                    placeholderTextColor={theme.colors.textPrimary + "66"}
                />

                <Pressable
                    style={({ pressed }) => [
                        styles.acceptBtn,
                        { opacity: pressed ? 0.85 : 1 },
                    ]}
                    onPress={handleAceptar}
                >
                    <MaterialIcons name="check-circle" size={22} color="#fff" />
                    <Text style={styles.acceptBtnText}>Confirmar pago</Text>
                </Pressable>
            </View>

            {/* Botones secundarios */}
            <View style={styles.secondaryButtons}>
                <Pressable style={styles.secondaryBtn} onPress={handleVolver}>
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
                    <MaterialIcons name="cancel" size={18} color="#d82215" />
                    <Text style={[styles.secondaryBtnText, styles.cancelText]}>
                        Cancelar pedido
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
export default PagoEfectivo;