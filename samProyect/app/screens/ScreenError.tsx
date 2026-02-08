import React from "react";
import { View, Text, StyleSheet, Button, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import LottieView from "lottie-react-native";
import { styles } from "../../styles/ScreenErrorStyle";

function ScreenError() {
    const { codigo, mensaje, reference } = useLocalSearchParams();

    // Obtenemos los mensajes de referencia según el tipo de error.
    const getErrorMessage = () => {
        switch (codigo) {
            // Errores 4xx (Cliente)
            case "400":
                return "Solicitud no válida. Por favor, revise los datos de su pedido nuevamente.";
            case "404":
                return "El sitio solicitado no se encuentra.";
            case "408":
                return "La solicitud tardó demasiado. Inténtelo de nuevo.";
            case "409":
                return "Hubo un conflicto con su solicitud de pedido.";
            case "422":
                return "Los datos no coinciden. Por favor, revise nuevamente la información ingresada.";
            case "429":
                return "Servidor saturado. Espere un momento e inténtelo nuevamente.";

            // Errores 5xx (Servidor)
            case "500":
                return "Error interno del servidor. Inténtelo más tarde.";
            case "502":
                return "Error de conexión con el servidor.";
            case "503":
                return "Servicio temporalmente no disponible.";
            case "504":
                return "Tiempo de espera agotado para esta solicitud.";
            default:
                return mensaje || "Ha ocurrido un error inesperado.";
        }
    };

    const getAnimationError = () => require("../../assets/lottie/ErrorIcon.json");

    return(
        <View style={styles.container}>

            {/* Animación de Lottie */}
            <LottieView
                source={getAnimationError()}
                autoPlay
                loop
                style={styles.lottie}
            />

            {/* Código de error */}
            <Text style={styles.codigo}>{codigo || "ERROR"}</Text>

            {/* Mensaje amigable */}
            <Text style={styles.mensaje}>{getErrorMessage()}</Text>

            {/* Referencia para soporte */}
            <Text style={styles.ref}>
                Reference: {reference || "N/A"}
            </Text>

            {/* Botón para volver al inicio */}
            <Pressable style={styles.button} onPress={() => router.push("/screens/Hall")}>
                <Text style={styles.buttonText}>VOLVER</Text>
            </Pressable>
        </View>
    );
}

export default ScreenError;