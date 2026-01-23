import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import customTheme from "../theme/Theme";

function VerificacionMovil() {
    const [CODIGO, SETCODIGO] = useState({
        Codigo: '',
    });

    const cambios = (e: any) => {
        SETCODIGO(CODIGO => ({
            ...CODIGO,
            Codigo: e
        }));
    }

    const aceptar = () => {
        router.push("/screens/Hall")
    }

    const volver = () => {
        router.push("/screens/VerificacionChoice")
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>INGRESE EL CODIGO QUE SE LE HA ENVIADO</Text>

            <View style={{ height: customTheme.spacing(2) }} />

            <TextInput placeholder="Codigo" value={CODIGO.Codigo} onChangeText={cambios} style={styles.input} secureTextEntry={true} />

            <View style={{ height: customTheme.spacing(4) }} />

            <View style={{ flexDirection: 'column', gap: customTheme.spacing(2), justifyContent: "center", alignItems: "center", }}>

                <Pressable style={styles.button} onPress={aceptar}>
                    <Text style={styles.buttonText}>ACEPTAR</Text>
                </Pressable>

                <Pressable style={[styles.button]} onPress={volver}>
                    <Text style={styles.buttonText}>VOLVER</Text>
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
    input: {
        width: "80%",
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: customTheme.colors.success,
        borderRadius: 8,
        padding: customTheme.spacing(1.5),
        fontSize: customTheme.fontSize.normal,
        color: customTheme.colors.textPrimary,
        marginBottom: customTheme.spacing(2),
    },
});

export default VerificacionMovil;