import { recetasService } from "@/services/firebase/recetas";
import { medicamentosService } from "@/services/supabase/medicamentos";
import { styles } from "@/styles/screens/shop/ConfirmacionStyle";
import { router, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/language/config/ConfigIdiomas";
import { Pressable, Text, View } from "react-native";
import { pedidosService } from "../../../services/supabase/pedidos";

function Confirmacion() {
  // --- PARÁMETROS Y LÓGICA DE CÁLCULO ---
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

  const { t } = useTranslation();
  const TOTAL = parseFloat(totalParam || '0');
  const metodoPago = metodoParam || 'desconocido';
  const esEfectivo = metodoParam === "efectivo";
  const PAGADO = esEfectivo ? parseFloat(pagadoParam || '0') : 0;
  const cambio = esEfectivo ? parseFloat((PAGADO - TOTAL).toFixed(2)) : 0;

  // --- ESTADOS DE PROCESO ---
  const [proceso, setProceso] = useState(1);
  const [pedidoId, setPedidoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- EFECTO PRINCIPAL DE PROCESAMIENTO ---
  useEffect(() => {
    let cancelled = false;
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const run = async () => {
      setProceso(1); // Paso 1: Generar pedido en base de datos

      const resultado = await pedidosService.crearPedidoCompleto(
        t("Confirmacion.DESCONOCIDO"),
        t("Confirmacion.DESCONOCIDO"),
        metodoPago,
        0, TOTAL, 0, TOTAL
      );

      if (cancelled) return;

      if (!resultado.exito) {
        setError(resultado.mensaje);
        setProceso(0);
        return;
      }

      // --- ACTUALIZACIÓN DE INVENTARIO Y RECETAS ---
      try {
        const itemsAlCarrito = JSON.parse(carritoParam || '[]');
        const nombresComprados = itemsAlCarrito.map((i: any) => i.medicamento.nombre);
        
        for (const item of itemsAlCarrito) {
          // 1. Descontar stock general
          await medicamentosService.actualizarStock(item.medicamento.id, item.cantidad);

          // 2. Si es medicamento recetado, bloquearlo localmente
          if (item.medicamento.idReceta) {
            await recetasService.bloquearRecetaLocal(item.medicamento.idReceta, [item.medicamento.id]);
          }
        }

        // 3. Registrar en Rate Limit (Supabase)
        const { rateLimitService } = await import('@/services/supabase/retelimitPedidos');
        await rateLimitService.registrarPedido(nombresComprados);

      } catch (err) {
        console.error("Error en inventario:", err);
      }

      setPedidoId(resultado.pedidoId ?? null);
      setProceso(2); // Paso 2: Pedido generado con éxito

      await delay(5000);
      if (cancelled) return;

      setProceso(3); // Paso 3: Dispensando...
      if (resultado.pedidoId) {
        await pedidosService.completarPedido(resultado.pedidoId);
      }

      setProceso(4); // Paso 4: Procesado
      await delay(5000);

      // --- GESTIÓN DE DEVOLUCIÓN (EFECTIVO) ---
      if (esEfectivo && cambio > 0) {
        setProceso(5);
        await delay(5000);
      }

      setProceso(6); // Paso 6: Listo para recoger
      await delay(5000);

      setProceso(7); // Paso 7: Entregado
      await delay(3000);

      // Finalización: Volver a inicio
      router.push({
        pathname: "/screens/home/Home",
        params: { medicamentosComprados: medicamentosParam || '', carrito: carritoParam || '' }
      });
    };

    run();
    return () => { cancelled = true; };
  }, []);

  // --- HELPER DE TEXTO DINÁMICO ---
  const textoProceso = () => {
    if (error) return ` ${error}`;
    switch (proceso) {
      case 1: return t("Confirmacion.GENERAR");
      case 2: return t("Confirmacion.GENERADO");
      case 3: return t("Confirmacion.PROCESANDO");
      case 4: return t("Confirmacion.PROCESADO");
      case 5: return `${t("Confirmacion.DEVOLVER")}: ${cambio.toFixed(2)} €`;
      case 6: return t("Confirmacion.LISTO");
      case 7: return t("Confirmacion.ENTREGADO");
      default: return "";
    }
  };

  // --- ESTRUCTURA DE INTERFAZ (UI) ---
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.titulo}>{t("Confirmacion.ESTADO")}</Text>
        
        <View style={styles.box}>
          {/* Mensaje de estado actual */}
          <Text style={styles.texto}>{textoProceso()}</Text>

          {/* Iconos visuales para devolución de dinero */}
          {proceso === 5 && <Text style={styles.texto}>🫴💰</Text>}

          {/* Identificador del pedido */}
          {pedidoId && !error && (
            <Text style={[styles.texto, { fontSize: 14, marginTop: 6 }]}>
              {t("Confirmacion.ID")}: {pedidoId}
            </Text>
          )}

          {/* Animación Lottie (Cargando/Escaneando) */}
          {!error && proceso < 7 && (
            <LottieView
              source={require("@/assets/lottie/barcodeScanner.json")}
              autoPlay loop
              style={styles.scanner}
            />
          )}

          {/* Feedback Final de Éxito */}
          {!error && proceso === 7 && (
            <Text style={styles.check}>✔</Text>
          )}

          {/* Manejo de Error: Botón de retorno */}
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