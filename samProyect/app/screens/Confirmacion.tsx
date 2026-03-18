import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { styles } from "../../styles/ConfirmacionStyle";
import { pedidosService } from "../../services/supabase/pedidos.service";


function Confirmacion() {
    const { total: totalParam, metodo: metodoParam } = useLocalSearchParams<{ total: string; metodo?: string }>();
    const TOTAL = parseFloat(totalParam || '0');
    const metodoPago = metodoParam || 'desconocido';

    const [proceso, setProceso] = useState(1);
    const [pedidoId, setPedidoId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

        const run = async () => {
            setProceso(1);

            const resultado = await pedidosService.crearPedidoCompleto(
                'Desconocido',
                'Desconocido',
                metodoPago,
                0,
                TOTAL,
                0,
                TOTAL
            );

            if (cancelled) return;

            if (!resultado.exito) {
                setError(resultado.mensaje);
                setProceso(0);
                return;
            }

            setPedidoId(resultado.pedidoId ?? null);
            setProceso(2);

            await delay(5000);
            if (cancelled) return;

            setProceso(3);
            if (resultado.pedidoId) {
                const completado = await pedidosService.completarPedido(resultado.pedidoId);
                if (cancelled) return;

                if (!completado) {
                    setError("No se pudo completar el pedido");
                    setProceso(0);
                    return;
                }
            }

            setProceso(4);
            await delay(5000);
            if (cancelled) return;

            setProceso(5);
            await delay(5000);
            if (cancelled) return;

            setProceso(6);
            await delay(5000);
            if (cancelled) return;

            router.push("/screens/Home");
        };

        run();

        return () => {
            cancelled = true;
        };
    }, [TOTAL, metodoPago]);

    const textoProceso = () => {
        if (error) return `❌ ${error}`;

        switch (proceso) {
            case 1:
                return "Generando pedido...";
            case 2:
                return "✅ Pedido generado correctamente";
            case 3:
                return "Procesando pedido...";
            case 4:
                return "✅ Pedido procesado correctamente";
            case 5:
                return "Pedido listo para entregar...";
            case 6:
                return "Pedido entregado";
            default:
                return "";
        }
    };


    return (

        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.titulo}>Estado del pedido:</Text>

                <View style={styles.box}>
                    <Text style={styles.texto}>{textoProceso()}</Text>

                    {pedidoId && !error && (
                        <Text style={[styles.texto, { fontSize: 14, marginTop: 6 }]}>ID del pedido: {pedidoId}</Text>
                    )}

                    {!error && proceso < 6 && (
                        <LottieView
                            source={require("../../assets/lottie/barcodeScanner.json")}
                            autoPlay
                            loop
                            style={styles.scanner}
                        />
                    )}

                    {!error && proceso === 6 && (
                        <Text style={styles.check}>✔</Text>
                    )}

                    {error && (
                        <Pressable onPress={() => router.push("/screens/Home")}> 
                            <Text style={[styles.texto, { marginTop: 16 }]}>Volver a inicio</Text>
                        </Pressable>
                    )}
                </View>
            </View>
        </View>
    );
}

export default Confirmacion;