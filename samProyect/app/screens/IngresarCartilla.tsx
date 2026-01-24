import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import customTheme from "../theme/Theme";

function IngresarCartilla() {
    
    const [numeroCartilla, setNumeroCartilla] = useState("");
    const [error, setError] = useState("");

    const onChangeCartilla = (text: string) => {
        setNumeroCartilla(text);
    };

    const aceptar = () => {
        router.push("/screens/VerificacionChoice");
    };

    const cancelar = () => {
        router.push("/screens/Hall");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                Ingrese el número de su cartilla sanitaria
            </Text>

            <TextInput
                placeholder="Nº Cartilla"
                value={numeroCartilla}
                onChangeText={onChangeCartilla}
                style={styles.input}
            />

            {error !== "" && (
                <Text style={styles.error}>{error}</Text>
            )}

            <View style={{ flexDirection: "column", gap: customTheme.spacing(2) }}>
                <Pressable style={styles.button} onPress={aceptar}>
                    <Text style={styles.buttonText}>ACEPTAR</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={cancelar}>
                    <Text style={styles.buttonText}>
                        VOLVER A LA TIENDA
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: customTheme.spacing(2),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: customTheme.colors.background,
    },
    label: {
        fontSize: customTheme.fontSize.normal,
        fontWeight: "600",
        marginBottom: customTheme.spacing(1),
        color: customTheme.colors.primary,
    },
    input: {
        width: "100%",
        backgroundColor: customTheme.colors.background,
        borderWidth: 2,
        borderColor: customTheme.colors.success,
        borderRadius: 8,
        padding: customTheme.spacing(1.5),
        fontSize: customTheme.fontSize.normal,
        color: customTheme.colors.textPrimary,
        marginBottom: customTheme.spacing(2),
    },

    button: {
        backgroundColor: customTheme.colors.secondary,
        flexDirection: "row",
        width: "80%",
        paddingVertical: customTheme.spacing(2),
        borderRadius: 10,
        marginBottom: customTheme.spacing(1),
        alignItems: "center",
        justifyContent: "center",
    },

    buttonText: {
        color: customTheme.colors.textSecondary,
        fontSize: customTheme.fontSize.normal,
        fontWeight: "bold",
        flex: 1,
        textAlign:"center",
    },

    error: {
        color: customTheme.colors.error,
        fontSize: customTheme.fontSize.small,
        marginBottom: customTheme.spacing(1),
        textAlign: "center",
    },
});

export default IngresarCartilla;