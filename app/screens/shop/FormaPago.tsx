import { styles } from "@/styles/screens/shop/FormaPagoStyle";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, Text, View } from "react-native";

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
            t("FormaPago.DESEASSALIR"),
            t("FormaPago.PERDERPROGRESO"),
            [
                {
                    text: t("FormaPago.PERMANECERAQUÍ"),
                    style: "cancel",
                },
                {
                    text: t("FormaPago.SALIR"),
                    style: "destructive",
                    // Cambiamos push por replace para limpiar el historial
                    onPress: () => router.replace("/screens/home/Home"),
                },
            ],
            { cancelable: true }
        );
    };

    const { t } = useTranslation();

    const TOTAL = parseFloat(total || '0');
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t("FormaPago.SELCMETPAG")}</Text>

            <View style={styles.formaPagoContainer}>
                <Pressable style={[styles.button, TOTAL >= 1000 && { opacity: 0.4 }]} disabled={TOTAL >= 1000} onPress={efectivo}>
                    <Text style={styles.buttonText}>{t("FormaPago.EFECTIVO")}</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={NFC}>
                    <Text style={styles.buttonText}>{t("FormaPago.PAGONFC")}</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={tarjeta}>
                    <Text style={styles.buttonText}>{t("FormaPago.TARJETA")}</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={Volver}>
                    <Text style={styles.buttonText}>{t("FormaPago.VOLVER")}</Text>
                </Pressable>

                <Pressable style={styles.buttonVolver} onPress={cancelar}>
                    <Text style={styles.buttonText}>{t("FormaPago.CANCELAR")}</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default FormaPago;