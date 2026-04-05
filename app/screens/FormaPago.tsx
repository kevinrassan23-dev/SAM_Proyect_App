import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { styles } from "../../styles/FormaPagoStyle";

function FormaPago() {
    const { t } = useTranslation();
    const { total } = useLocalSearchParams<{ total: string }>();

    const efectivo = () => {
        router.push({ pathname: "/screens/PagoEfectivo", params: { total } });
    }

    const NFC = () => {
        router.push({ pathname: "/screens/PagoNFC", params: { total } });
    }

    const tarjeta = () => {
        router.push({ pathname: "/screens/PagoTarjeta", params: { total } });
    }

    const Volver = () => {
        router.push({ pathname: "/screens/Hall" });
    }

    const cancelar = () => {
        router.push("/screens/Home")
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>{t("FormaPago.SELCMETPAG")}</Text>

            <View style={styles.formaPagoContainer}>
                <Pressable style={styles.button} onPress={efectivo}>
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