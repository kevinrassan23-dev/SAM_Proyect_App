import { styles } from "@/styles/screens/shop/FormaPagoStyle";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import "@/language/config/ConfigIdiomas";
import { Alert, Pressable, Text, View } from "react-native";

function FormaPago() {
  // --- RECUPERACIÓN DE PARÁMETROS ---
  const { 
    total, medicamentos, carrito, tieneReceta, 
    medicamentosReceta, dni, telefono 
  } = useLocalSearchParams<{
    total: string;
    medicamentos?: string;
    carrito?: string;
    tieneReceta?: string;
    medicamentosReceta?: string;
    dni?: string;
    telefono?: string;
  }>();

  const { t } = useTranslation();
  const TOTAL_NUM = parseFloat(total || '0');
  
  // Límite legal: No se permite efectivo para importes >= 1000€
  const ES_EFECTIVO_DESHABILITADO = TOTAL_NUM >= 1000;

  // --- NAVEGACIÓN ---
  const efectivo = () => {
    if (ES_EFECTIVO_DESHABILITADO) return;
    router.push({ pathname: "/screens/shop/PagoEfectivo", params: { total, medicamentos, carrito } });
  };

  const NFC = () => router.push({ pathname: "/screens/shop/PagoNFC", params: { total, medicamentos, carrito } });
  const tarjeta = () => router.push({ pathname: "/screens/shop/PagoTarjeta", params: { total, medicamentos, carrito } });

  const Volver = () => {
    router.replace({
      pathname: "/screens/shop/Hall",
      params: { carrito, tieneReceta, medicamentosReceta, dni, telefono },
    });
  };

  /**
   * Muestra alerta antes de salir para evitar pérdida de progreso
   */
  const cancelar = () => {
    Alert.alert(
      t("FormaPago.DESEASSALIR"),
      t("FormaPago.PERDERPROGRESO"),
      [
        { text: t("FormaPago.PERMANECERAQUÍ"), style: "cancel" },
        {
          text: t("FormaPago.SALIR"),
          style: "destructive",
          onPress: () => router.replace("/screens/home/Home"),
        },
      ]
    );
  };

  // --- ESTRUCTURA DE INTERFAZ (UI) ---
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("FormaPago.SELCMETPAG")}</Text>

      <View style={styles.formaPagoContainer}>
        
        {/* Botón Efectivo: Dinámico según importe */}
        <Pressable 
          style={[
            styles.button, 
            ES_EFECTIVO_DESHABILITADO && { opacity: 0.4, backgroundColor: '#ccc' }
          ]} 
          disabled={ES_EFECTIVO_DESHABILITADO} 
          onPress={efectivo}
        >
          <Text style={styles.buttonText}>
            {t("FormaPago.EFECTIVO")} {ES_EFECTIVO_DESHABILITADO && t(" (No disponible)")}
          </Text>
        </Pressable>

        {/* Métodos Digitales */}
        <Pressable style={styles.button} onPress={NFC}>
          <Text style={styles.buttonText}>{t("FormaPago.PAGONFC")}</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={tarjeta}>
          <Text style={styles.buttonText}>{t("FormaPago.TARJETA")}</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={Volver}>
          <Text style={styles.buttonText}>{t("FormaPago.VOLVER")}</Text>
        </Pressable>

        {/* Botón de cancelar pedido */}
        <Pressable style={styles.buttonVolver} onPress={cancelar}>
          <Text style={styles.buttonText}>{t("FormaPago.CANCELAR")}</Text>
        </Pressable>

      </View>
    </View>
  );
}

export default FormaPago;