import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import {router} from "expo-router";
import customTheme from "../theme/Theme"
import LottieView from "lottie-react-native";


function Confirmacion() {

    const [proceso, setProceso] = useState(1);

    useEffect(() => {
        const timers = [

            // Cambiamos al proceso 2 despues de 8s
            setTimeout(() => setProceso(2), 8000),

            // Cambiamos al proceso 3 despues de +4s
            setTimeout(() => setProceso(3), 12000),

            // Cambiamos al proceso 4 despues de +8s 
            setTimeout(() => setProceso(4), 20000),

            // Cambiamos al proceso 5 despues de +4s
            setTimeout(() => setProceso(5), 24000),

            // Cambiamos al proceso 6 despues de +8s
            setTimeout(() => setProceso(6), 32000),

            // Regresamos a Home despues de +8s
            setTimeout(() => {
                router.push("/screens/Home");
            }, 40000),
        ];

        // Una vez terminado todos los procesos, limpiamos
        return () => timers.forEach(clearTimeout);
    }, []);

    const textoProceso = () => {
        switch (proceso) {
            case 1:
                return "Generando pedido...";
            case 2:
                return "Pedido generado correctamente";
            case 3:
                return "Procesando pedido...";
            case 4:
                return "Pedido procesado correctamente";
            case 5:
                return "Pedido listo para entregar...";
            case 6:
                return "Pedido entregado";
            default:
                return "";
        }
    };

    return(

        <View style={styles.container}>
            <Text style={styles.titulo}>Estado del pedido:</Text>
    
            <View style={styles.box}>
                {/* Texto dinámico según proceso */}
                <Text style={styles.texto}>
                    {textoProceso()}
                </Text>

                {/* Animación visible durante todos los procesos */}
                {proceso < 6 && (
                    <LottieView
                        source={require("../assets/lottie/barcodeScanner.json")}
                        autoPlay
                        loop
                        style={styles.scanner}
                    />
                )}

                {/* Check visible durante la finalización de cada proceso */}
                {(proceso === 2 || proceso === 4 || proceso === 6) && (
                    <Text style={styles.check}>✔</Text>
                )}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: customTheme.spacing(2),
        backgroundColor: customTheme.colors.background,
    },

    titulo: {
        fontSize: customTheme.fontSize.title,
        fontWeight: "bold",
        color: customTheme.colors.primary,
        marginBottom: customTheme.spacing(2),
        textAlign: "center",
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: customTheme.colors.background,
        borderWidth: 2,
        borderColor: customTheme.colors.secondary,
        padding: customTheme.spacing(2),
        borderRadius: 12,
        marginBottom: customTheme.spacing(2),
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },

    box: {
        alignItems: "center",
        justifyContent: "center",
        padding: customTheme.spacing(4),
        borderRadius: 18,
        borderWidth: 2,
        borderColor: customTheme.colors.secondary,
        marginTop: customTheme.spacing(4),
    },

    scanner: {
        width: 150,
        height: 150,
        resizeMode: "contain",
    },

    texto: {
        fontSize: customTheme.fontSize.normal,
        color: customTheme.colors.primary,
        marginBottom: customTheme.spacing(3),
        textAlign: "center",
        fontWeight: "500",
    },

    check: {
        fontSize: customTheme.fontSize.large,
        fontWeight: "bold",
        color: customTheme.colors.secondary,
    }
});

export default Confirmacion;