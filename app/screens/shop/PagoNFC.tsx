import { styles } from "@/styles/screens/shop/PagoNFCStyle";
import { useNavigation } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Image, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';

function PagoNFC() {
  const navigation = useNavigation<any>();
  const { total: totalParam, medicamentos: medicamentosParam, carrito: carritoParam } = useLocalSearchParams<{
    total: string;
    medicamentos?: string;
    carrito?: string;
  }>();
  const TOTAL = parseFloat(totalParam || '0');
  const [pagoAceptado, setPagoAceptado] = useState(false);
  const { t } = useTranslation();

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
  }, [pagoAceptado, navigation, medicamentosParam, carritoParam]);

  const handleEscanear = () => {
    setPagoAceptado(true);
  };

  const handleVolver = () => {
    router.push({ pathname: "/screens/shop/FormaPago", params: { total: TOTAL.toString(), medicamentos: medicamentosParam, carrito: carritoParam } });
  };

  return (
    <View style={styles.container}>

      <View style={styles.content}>
        <Text style={styles.titleText}>{t("PagoNFC.PAGONFC")}</Text>
        {!pagoAceptado ? (
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
          <View style={styles.successContainer}>
            <View style={styles.imagePlaceholder}>
              <Image source={require('@/assets/images/payment_success.png')} style={styles.image} />
            </View>
            <Text style={styles.successText}>{t("PagoNFC.ACEPTADO")}</Text>
            <Text style={styles.redirectText}>{t("PagoNFC.REDIRIGIR")}</Text>
          </View>
        )}
      </View>

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