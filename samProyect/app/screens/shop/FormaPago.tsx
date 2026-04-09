import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { styles } from "@/styles/screens/shop/FormaPagoStyle";

function FormaPago() {
    // Recibimos los parámetros. Nota: 'carrito' debería venir ya como JSON string desde Hall
    const { total, medicamentos, carrito } = useLocalSearchParams<{ 
        total: string;
        medicamentos?: string; // El string "id:cant"
        carrito?: string;      // El JSON string completo
    }>();

    const efectivo = () => {
        router.push({ pathname: "/screens/shop/PagoEfectivo", params: { total, medicamentos, carrito } });
    }

    const NFC = () => {
        router.push({ pathname: "/screens/shop/PagoNFC", params: { total, medicamentos, carrito } });
    }

    const tarjeta = () => {
        router.push({ pathname: "/screens/shop/PagoTarjeta", params: { total, medicamentos, carrito } });
    }

    const Volver = () => {
        // Al no haber restado nada en la DB, simplemente regresamos
        // El Hall cargará el stock real de la DB y le restará lo que hay en 'carrito' visualmente
        router.replace({ 
            pathname: "/screens/shop/Hall", 
            params: { carrito: carrito } 
        });
    }

    const cancelar = () => {
        Alert.alert(
            "¿Deseas salir?",
            "Al cerrar la sesión, perderás el progreso de tu compra.",
            [
                {
                    text: "Permanecer aquí",
                    style: "cancel",
                },
                {
                    text: "Salir",
                    style: "destructive",
                    // ✅ Cambiamos push por replace para limpiar el historial
                    onPress: () => router.replace("/screens/home/Home"),
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selecciona un método de pago</Text>

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