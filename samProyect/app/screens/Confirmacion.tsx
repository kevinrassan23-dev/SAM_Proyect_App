import React, { useEffect, useState } from "react";
import { View, Text} from "react-native";
import {router} from "expo-router";
import LottieView from "lottie-react-native";
import { styles } from "../../styles/ConfirmacionStyle";


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
                return "✅Pedido generado correctamente";
            case 3:
                return "Procesando pedido...";
            case 4:
                return "✅Pedido procesado correctamente";
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
            <View style={styles.content}>
            <Text style={styles.titulo}>Estado del pedido:</Text>

            <View style={styles.box}>
                <Text style={styles.texto}>{textoProceso()}</Text>

                {proceso < 6 && (
                    <LottieView
                        source={require("../../assets/lottie/barcodeScanner.json")}
                        autoPlay
                        loop
                        style={styles.scanner}
                    />
                )}

                {proceso === 6 && (
                    <Text style={styles.check}>✔</Text>
                )}
            </View>
        </View>
        </View>
    );
}

export default Confirmacion;