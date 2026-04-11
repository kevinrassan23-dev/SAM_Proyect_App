import { recetasService } from "@/services/firebase/recetas";
import { medicamentosService } from "@/services/supabase/medicamentos";
import { styles } from "@/styles/screens/shop/ConfirmacionStyle";
import { router, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { pedidosService } from "../../../services/supabase/pedidos";

function Confirmacion() {
    const { 
        total: totalParam, 
        metodo: metodoParam,
        pagado: pagadoParam,
        medicamentos: medicamentosParam,
        carrito: carritoParam 
    } = useLocalSearchParams<{ 
        total: string; 
        metodo?: string;
        pagado?: string;
        medicamentos?: string;
        carrito?: string;
    }>();

    const TOTAL = parseFloat(totalParam || '0');
    const metodoPago = metodoParam || 'desconocido';

    const [proceso, setProceso] = useState(1);
    const [pedidoId, setPedidoId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Solo calculamos cambio si el método es efectivo
    const esEfectivo = metodoParam === "efectivo";
    const PAGADO = esEfectivo ? parseFloat(pagadoParam || '0') : 0;
    // toFixed(2) garantiza que el cambio tenga exactamente 2 decimales
    const cambio = esEfectivo ? parseFloat((PAGADO - TOTAL).toFixed(2)) : 0;
    
    const { t } = useTranslation();

    useEffect(() => {
        let cancelled = false;

        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

        const run = async () => {
            setProceso(1);

            const resultado = await pedidosService.crearPedidoCompleto(
                t("Confirmacion.DESCONOCIDO"),
                t("Confirmacion.DESCONOCIDO"),
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

            // ✅ NUEVO: Restar Stock y Desactivar Recetas al generarse el pedido
            try {
                const itemsAlCarrito = JSON.parse(carritoParam || '[]');
                
                for (const item of itemsAlCarrito) {
                    // 1. Resta stock en Supabase para TODOS los items (con y sin receta)
                    await medicamentosService.actualizarStock(
                        item.medicamento.id, 
                        item.cantidad
                    );

                    // 2. Si tiene idReceta es un medicamento con receta — bloqueamos localmente 1 hora
                    // Eliminamos el if (medicamentosParam...) que podía fallar por diferencias de texto
                    if (item.medicamento.idReceta) {
                        await recetasService.bloquearRecetaLocal(
                            item.medicamento.idReceta,
                            [item.medicamento.id]
                        );
                    }
                }
            } catch (err) {
                console.error(`[${new Date().toLocaleTimeString()}] Error al actualizar inventario/recetas:`, err);
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
                    setError(t("Confirmacion.ERROR"));
                    setProceso(0);
                    return;
                }
            }

            setProceso(4);
            await delay(5000);
            if (cancelled) return;

            // Si pagó en efectivo y el cambio es mayor a 0, mostramos el paso del cambio
            if (esEfectivo && cambio > 0) {
                setProceso(5);
                await delay(5000);
                if (cancelled) return;
            }

            setProceso(6);
            await delay(5000);
            if (cancelled) return;

            setProceso(7);
            await delay(3000);
            if (cancelled) return;

            router.push({
                pathname: "/screens/home/Home",
                params: {
                    medicamentosComprados: medicamentosParam || '',
                    carrito: carritoParam || '',
                },
            });
        };

        run();

        return () => {
            cancelled = true;
        };
    }, [TOTAL, metodoPago, medicamentosParam, carritoParam]);

    // En textoProceso(), añade el caso para mostrar el cambio:
    const textoProceso = () => {
        if (error) return `❌ ${error}`;
        switch (proceso) {
            case 1: return t("Confirmacion.GENERAR");
            case 2: return t("Confirmacion.GENERADO");
            case 3: return t("Confirmacion.PROCESANDO");
            case 4: return t("Confirmacion.PROCESADO");
            // ── NUEVO: Solo aparece si pagó en efectivo y hay cambio a devolver
            case 5: return esEfectivo && cambio > 0 ? `${t("Confirmacion.DEVOLVER")}: ${cambio.toFixed(2)} €` : "";
            case 6: return t("Confirmacion.LISTO");
            case 7: return t("Confirmacion.ENTREGADO");
            default: return "";
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.titulo}>{t("Confirmacion.ESTADO")}</Text>
                <View style={styles.box}>
                    <Text style={styles.texto}>{textoProceso()}</Text>

                    {proceso === 5 && <Text style={styles.texto}>🫴💰</Text>}

                    {pedidoId && !error && (
                        <Text style={[styles.texto, { fontSize: 14, marginTop: 6 }]}>
                            {t("Confirmacion.ID")}: {pedidoId}
                        </Text>
                    )}

                    {!error && proceso < 7 && (
                        <LottieView
                            source={require("@/assets/lottie/barcodeScanner.json")}
                            autoPlay
                            loop
                            style={styles.scanner}
                        />
                    )}

                    {!error && proceso === 7 && (
                        <Text style={styles.check}>✔</Text>
                    )}

                    {error && (
                        <Pressable onPress={() => router.push("/screens/home/Home")}>
                            <Text style={[styles.texto, { marginTop: 16 }]}>{t("VOLVER")}</Text>
                        </Pressable>
                    )}
                </View>
            </View>
        </View>
    );
}

export default Confirmacion;