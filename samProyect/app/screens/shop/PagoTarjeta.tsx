import { styles } from "@/styles/screens/shop/PagoTarjetaStyle";
import theme from "@/theme/Theme";
import { router, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import "@/language/config/ConfigIdiomas";
import { Image, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import { AudioService } from "@/services/AudioService";

function PagoTarjeta() {
  // --- PARÁMETROS Y ESTADO ---
  const { total: totalParam, medicamentos: medicamentosParam, carrito: carritoParam } = useLocalSearchParams<{
    total: string;
    medicamentos?: string;
    carrito?: string;
  }>();

  const TOTAL = parseFloat(totalParam || '0');
  const [escaneoExitoso, setEscaneoExitoso] = useState(false);
  const lottieRef = useRef<LottieView>(null);
  const { t } = useTranslation();

  // --- EFECTOS ---
  useEffect(() => {
    let timerExito: ReturnType<typeof setTimeout>;

    if (escaneoExitoso) {
      timerExito = setTimeout(() => {
        router.push({
          pathname: "/screens/shop/Confirmacion",
          params: {
            total: TOTAL.toString(),
            metodo: "tarjeta",
            medicamentos: medicamentosParam || '',
            carrito: carritoParam || '',
          }
        });
      }, 5000);
    }
    return () => clearTimeout(timerExito);
  }, [escaneoExitoso, medicamentosParam, carritoParam]);

  // --- MANEJADORES ---
  const handleEscanearTarjeta = async () => {
    // Si la compra es total >= 50€, requerimos autenticación por PIN
    if (TOTAL >= 50) {
      router.push({
        pathname: "/screens/auth/AuthPin",
        params: {
          total: TOTAL.toString(),
          medicamentos: medicamentosParam || '',
          carrito: carritoParam || '',
        }
      });
      return;
    }

    // Si es total < 50€, simulamos éxito directo
    await AudioService.playBeep();
    setEscaneoExitoso(true);
  };

  const handleVolver = () => {
    router.push({
      pathname: "/screens/shop/FormaPago",
      params: { total: TOTAL.toString(), medicamentos: medicamentosParam, carrito: carritoParam }
    });
  };

  // --- UI: ESTADO EXITOSO ---
  if (escaneoExitoso) {
    return (
      <View style={styles.container}>
        <View style={styles.successContent}>
          <View style={styles.headerSectionSuccess}>
            <Text style={styles.titleText}>{t("PagoTarjeta.TARJETA")}</Text>
          </View>
          <Image
            source={require('@/assets/images/payment_success.png')}
            style={{ width: 180, height: 180, resizeMode: 'contain' }}
          />
          <Text style={styles.successTitle}>{t("PagoTarjeta.ESCANEOEXITOSO")}</Text>
          <Text style={styles.instructionText}>{t("PagoTarjeta.REDIRIGIR")}</Text>
        </View>
      </View>
    );
  }

  // --- UI: PANTALLA PRINCIPAL (ESPERANDO TARJETA) ---
  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.headerSection}>
          <Text style={styles.titleText}>{t("PagoTarjeta.TARJETA")}</Text>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>{t("PagoTarjeta.TOTAL")}</Text>
          <Text style={styles.totalAmount}>{TOTAL.toFixed(2)}€</Text>
        </View>

        {/* Contenedor de Animación Lottie */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LottieView
            ref={lottieRef}
            source={require('@/assets/lottie/TargetScan.json')}
            autoPlay loop
            style={{ width: 220, height: 220 }}
          />

          {/* Mensajes de instrucción condicionales */}
          {TOTAL < 50 ? (
            <Text style={styles.instructionText}>
              {t("PagoTarjeta.ACERCATARJETALECTOR")}
            </Text>
          ) : (
            <Text style={[styles.instructionText, { color: theme.colors.secondary, marginTop: 12 }]}>
              {t("PagoTarjeta.AVISO_PIN")}
            </Text>
          )}
        </View>
      </View>

      {/* Botones para escanear y volver */}
      <View style={styles.buttonsContainer}>
        <Pressable style={[styles.button, styles.buttonScan]} onPress={handleEscanearTarjeta}>
          <Text style={styles.buttonText}>{t("PagoTarjeta.ESCANEARTARJETA")}</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.buttonSecondary]} onPress={handleVolver}>
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>{t("PagoTarjeta.VOLVER")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default PagoTarjeta;