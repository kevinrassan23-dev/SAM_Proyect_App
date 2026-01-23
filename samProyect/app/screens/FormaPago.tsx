import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import customTheme from "../theme/Theme";

function FormaPago() {

    const efectivo = () => {
        router.push({ pathname: "/screens/PagoEfectivo"});
    }

    const NFC = () => {
        router.push({ pathname: "/screens/PagoNFC"});
    }

    const tarjeta = () => {
        router.push({ pathname: "/screens/PagoTarjeta"});
    }

    const Volver = () => {
        router.push({ pathname: "/screens/Hall"});
    }

    const cancelar = () => {
        router.push("/screens/Home")
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>¿CÓMO DESEA PAGAR?</Text>

            <View style={{ flexDirection: 'column', gap: customTheme.spacing(2), justifyContent: "center", alignItems: "center", }}>
                <Pressable style={styles.button} onPress={efectivo}>
                    <Text style={styles.buttonText}>EFECTIVO</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={NFC}>
                    <Text style={styles.buttonText}>PAGO NFC</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={tarjeta}>
                    <Text style={styles.buttonText}>TARJETA</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={Volver}>
                    <Text style={styles.buttonText}>VOLVER A LA TIENDA</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={cancelar}>
                    <Text style={styles.buttonText}>CANCELAR PEDIDO</Text>
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

export default FormaPago;