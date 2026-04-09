import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
    Pressable,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../styles/FormaPagoStyle";

type PaymentMethod = {
    id: string;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    color: string;
    route: string;
};

export default function FormaPago() {
    const { total } = useLocalSearchParams<{ total: string }>();
    const safeTotal = Number(total || 0).toFixed(2);

    const methods: PaymentMethod[] = [
        {
            id: "efectivo",
            label: "Efectivo",
            icon: "payments",
            color: "#16C172",
            route: "/screens/PagoEfectivo",
        },
        {
            id: "contactless",
            label: "Pago sin contacto (Tarjeta o NFC)",
            icon: "contactless",
            color: "#9525D7",
            route: "/screens/PagoNFC",
        },
    ];

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Método de pago</Text>
            </View>

            {/* Total */}
            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>{safeTotal} €</Text>
            </View>


            {/* Opciones centradas */}
            <View style={styles.centerContent}>
                <Text style={styles.title}>
                Selecciona cómo deseas realizar el pago
            </Text>
                <View style={styles.row}>
                    {methods.map((method) => (
                        <Pressable
                            key={method.id}
                            onPress={() =>
                                router.push({
                                    pathname: method.route as any,
                                    params: { total },
                                })
                            }
                            style={({ pressed }) => [
                                styles.cardFilled,
                                {
                                    backgroundColor: method.color,
                                    opacity: pressed ? 0.85 : 1,
                                },
                            ]}
                        >
                            <MaterialIcons
                                name={method.icon}
                                size={55}
                                color="#fff"
                            />
                            <Text style={styles.cardFilledText}>
                                {method.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Botones abajo */}
            <View style={styles.secondaryButtons}>
                <Pressable
                    style={styles.secondaryBtn}
                    onPress={() => router.push("/screens/Hall")}
                >
                    <MaterialIcons name="store" size={18} color="#9525D7" />
                    <Text style={styles.secondaryBtnText}>
                        Volver a la tienda
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.secondaryBtn, styles.cancelBtn]}
                    onPress={() => router.push("/screens/Home")}
                >
                    <MaterialIcons name="cancel" size={18} color="#d82215" />
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
        </SafeAreaView>
    );
}