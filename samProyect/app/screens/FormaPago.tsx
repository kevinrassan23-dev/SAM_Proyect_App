import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../../styles/FormaPagoStyle";

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

            <View style={styles.formaPagoContainer}>
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

                <Pressable style={styles.buttonVolver} onPress={cancelar}>
                    <Text style={styles.buttonText}>CANCELAR PEDIDO</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default FormaPago;