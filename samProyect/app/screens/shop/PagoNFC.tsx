import { styles } from "@/styles/screens/shop/PagoNFCStyle";
import { useNavigation } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import "@/language/config/ConfigIdiomas";
import { Image, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import { AudioService } from "@/services/AudioService";

function PagoNFC() {
  // --- PARÁMETROS Y ESTADO ---
  const navigation = useNavigation<any>();
  const { total: totalParam, medicamentos: medicamentosParam, carrito: carritoParam } = useLocalSearchParams<{
    total: string;
    medicamentos?: string;
    carrito?: string;
  }>();

  const TOTAL = parseFloat(totalParam || '0');
  const [pagoAceptado, setPagoAceptado] = useState(false);
  const { t } = useTranslation();

  // --- EFECTOS ---
  /**
   * Una vez aceptado el pago, espera 5 segundos y redirige a la pantalla de confirmación final
   */
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (pagoAceptado) {
      timer = setTimeout(() => {
        router.push({
          pathname: "/screens/shop/Confirmacion",
          params: {
            total: TOTAL.toString(),
            metodo: "nfc",
            medicamentos: medicamentosParam || '',
            carrito: carritoParam || '',
          }
        });
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [pagoAceptado, medicamentosParam, carritoParam]);

  // --- MANEJADORES ---
  /**
   * Simula el escaneo NFC disparando un sonido de feedback
   */
  const handleEscanear = async () => {
    await AudioService.playBeep(); // Audio centralizado
    setPagoAceptado(true);
  };

  const handleVolver = () => {
    router.push({ 
      pathname: "/screens/shop/FormaPago", 
      params: { total: TOTAL.toString(), medicamentos: medicamentosParam, carrito: carritoParam } 
    });
  };

  // --- UI ---
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.titleText}>{t("PagoNFC.PAGONFC")}</Text>

        {!pagoAceptado ? (
          /* Estado: Esperando lectura NFC */
          <>
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>{t("PagoNFC.TOTAL")}</Text>
              <Text style={styles.totalAmount}>{TOTAL.toFixed(2)}€</Text>
            </View>

            <View style={styles.imagePlaceholder}>
              <Image source={require('@/assets/images/nfc_scan.png')} style={styles.image} />
            </View>

            <Text style={styles.instructionText}>{t("PagoNFC.ACERCAR")}</Text>
          </>
        ) : (
          /* Estado: Pago realizado con éxito */
          <View style={styles.successContainer}>
            <View style={styles.imagePlaceholder}>
              <Image source={require('@/assets/images/payment_success.png')} style={styles.image} />
            </View>
            <Text style={styles.successText}>{t("PagoNFC.ACEPTADO")}</Text>
            <Text style={styles.redirectText}>{t("PagoNFC.REDIRIGIR")}</Text>
          </View>
        )}
      </View>

      {/* Botones de acción (Solo visibles si no se ha completado el pago) */}
      {!pagoAceptado && (
        <View style={styles.buttons}>
          <Pressable style={styles.button} onPress={handleEscanear}>
            <Text style={styles.buttonText}>{t("PagoNFC.ESCANEAR")}</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonSecondary]} onPress={handleVolver}>
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>{t("PagoNFC.VOLVER")}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default PagoNFC;