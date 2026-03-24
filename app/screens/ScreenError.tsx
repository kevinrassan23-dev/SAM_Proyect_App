import { router, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { styles } from "../../styles/ScreenErrorStyle";

function ScreenError() {
    const { t } = useTranslation();
    const { codigo, mensaje, reference } = useLocalSearchParams();

    // Obtenemos los mensajes de referencia según el tipo de error.
    const getErrorMessage = () => {
        switch (codigo) {
            // Errores 4xx (Cliente)
            case "400":
                return t("ScreenError.400");
            case "404":
                return t("ScreenError.404");
            case "406":
                return t("ScreenError.406");
            case "408":
                return t("ScreenError.408");
            case "409":
                return t("ScreenError.409");
            case "422":
                return t("ScreenError.422");
            case "429":
                return t("ScreenError.429");

            // Errores 5xx (Servidor)
            case "500":
                return t("ScreenError.500");
            case "502":
                return t("ScreenError.502");
            case "503":
                return t("ScreenError.503");
            case "504":
                return t("ScreenError.504");
            default:
                return mensaje || t("ScreenError.ERRORINES");
        }
    };

    const getAnimationError = () => require("../../assets/lottie/ErrorIcon.json");

    return (
        <View style={styles.container}>

            {/* Animación de Lottie */}
            <LottieView
                source={getAnimationError()}
                autoPlay
                loop
                style={styles.lottie}
            />

            {/* Código de error */}
            <Text style={styles.codigo}>{codigo || t("ScreenError.ERROR")}</Text>

            {/* Mensaje de error */}
            <Text style={styles.mensaje}>{getErrorMessage()}</Text>

            {/* Referencia para soporte */}
            <Text style={styles.ref}>
                {t("ScreenError.REFERENCE")}: {reference || t("ScreenError.N/A")}
            </Text>

            {/* Botón para volver al inicio */}
            <Pressable style={styles.button} onPress={() => router.push("/screens/Hall")}>
                <Text style={styles.buttonText}>{t("ScreenError.VOLVER")}</Text>
            </Pressable>
        </View>
    );
}

export default ScreenError;