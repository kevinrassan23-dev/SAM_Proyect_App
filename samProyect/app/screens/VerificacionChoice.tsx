import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import customTheme from "../theme/Theme";

function VerificacionChoice() {

    const DNI = () => {
        router.push({ pathname: "/screens/VerificacionDNI"});
    }

    const Teléfono = () => {
        router.push({ pathname: "/screens/VerificacionMovil"});
    }

    const Volver = () => {
        router.push({ pathname: "/screens/Hall"});
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>¿COMO DESEA VERIFICARSE?</Text>

            <View style={{ flexDirection: 'column', gap: customTheme.spacing(2), justifyContent: "center", alignItems: "center", }}>
                <Pressable style={styles.button} onPress={DNI}>
                    <Text style={styles.buttonText}>USAR DNI</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={Teléfono}>
                    <Text style={styles.buttonText}>USAR TELÉFONO</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={Volver}>
                    <Text style={styles.buttonText}>VOLVER A LA TIENDA</Text>
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
    title: {
        fontSize: customTheme.fontSize.title,
        fontWeight: "bold",
        color: customTheme.colors.primary,
        marginVertical: customTheme.spacing(3),
        textAlign: "center",
    },

    button: {
        backgroundColor: customTheme.colors.secondary,
        width: "80%",
        flexDirection: "row",
        paddingVertical: customTheme.spacing(2),
        borderRadius: 10,
        marginBottom: customTheme.spacing(2),
        alignItems: "center",
        justifyContent: "center",
    },

    buttonText: {
        color: customTheme.colors.textSecondary,
        fontSize: customTheme.fontSize.large,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
});

export default VerificacionChoice;