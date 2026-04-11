import { styles } from "@/styles/screens/shop/PagoTarjetaStyle";
import theme from "@/theme/Theme";
import { router, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Alert, Image, Pressable, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

function PagoTarjeta() {
  const { total: totalParam, medicamentos: medicamentosParam, carrito: carritoParam } = useLocalSearchParams<{
    total: string;
    medicamentos?: string;
    carrito?: string;
  }>();
  const TOTAL = parseFloat(totalParam || '0');
  const [pin, setPin] = useState('');
  const [escaneoActivo, setEscaneoActivo] = useState(false);
  const [escaneoExitoso, setEscaneoExitoso] = useState(false);
  const lottieRef = useRef<LottieView>(null);
  const { t } = useTranslation();

  useEffect(() => {
    let timerAnimacion: ReturnType<typeof setTimeout>;
    let timerExito: ReturnType<typeof setTimeout>;

    if (escaneoActivo && !escaneoExitoso) {
      timerAnimacion = setTimeout(() => {
        setEscaneoExitoso(true);
      }, 10000);
    }

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

    return () => {
      clearTimeout(timerAnimacion);
      clearTimeout(timerExito);
    };
  }, [escaneoActivo, escaneoExitoso, medicamentosParam, carritoParam]);

  const handleAceptar = () => {
    if (pin.length === 4) {
      router.push({
        pathname: "/screens/shop/Confirmacion",
        params: {
          total: TOTAL.toString(),
          metodo: "tarjeta",
          medicamentos: medicamentosParam || '',
          carrito: carritoParam || '',
        }
      });
    } else {
      Alert.alert(t("PagoTarjeta.ALERT1"), t("PagoTarjeta.ALERT2"));
    }
  };

  const handlePinChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 4) {
      setPin(cleaned);
    }
  };

  const handleEscanearTarjeta = () => {
    console.log(`[${new Date().toLocaleTimeString()}] Iniciando escaneo de tarjeta...`);
    setEscaneoActivo(true);
  };

  const handleVolver = () => {
    if (escaneoActivo) {
      setEscaneoActivo(false);
      setEscaneoExitoso(false);
      return;
    }
    router.push({
      pathname: "/screens/shop/FormaPago",
      params: { total: TOTAL.toString(), medicamentos: medicamentosParam, carrito: carritoParam, }
    });
  };

  if (escaneoActivo) {
    return (
      <View style={styles.container}>
        {!escaneoExitoso ? (
          <>
            <View style={styles.headerSection}>
              <Text style={styles.titleText}>{t("PagoTarjeta.ESCANEARTARJETA")}</Text>
            </View>

            {/* CONTENEDOR CENTRAL: Ahora incluye la animación Y el texto */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <LottieView
                ref={lottieRef}
                source={require('@/assets/lottie/TargetScan.json')}
                autoPlay
                loop={true}
                style={{ width: 200, height: 200 }}
              />

              {/* EL TEXTO AHORA ESTÁ AQUÍ DENTRO, JUSTO DEBAJO DE LA ANIMACIÓN */}
              <Text style={styles.instructionText}>
                {t("PagoTarjeta.ACERCATARJETALECTOR")}
              </Text>
            </View>

            <View style={styles.buttonsContainer}>
              <Pressable style={[styles.buttonSelect, styles.buttonSecondary]} onPress={handleVolver}>
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>{t("PagoTarjeta.CANCELAR")}</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <View style={styles.headerSection}>
              <Text style={styles.titleText}>{t("PagoTarjeta.TARJETA")}</Text>
            </View>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={require('@/assets/images/payment_success.png')}
                style={{ width: 180, height: 180, resizeMode: 'contain' }}
              />
            </View>

            <Text style={[styles.titleText, { marginBottom: 8 }]}>
              {t("PagoTarjeta.ESCANEOEXITOSO")}
            </Text>
            <Text style={styles.instructionText}>
              {t("PagoTarjeta.REDIRIGIR")}
            </Text>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.headerSection}>
          <Text style={styles.titleText}>
            {escaneoActivo ? (escaneoExitoso ? t("PagoTarjeta.ESCANEOEXITOSO") : t("PagoTarjeta.ESCANEARTARJETA")) : t("PagoTarjeta.TARJETA")}
          </Text>
        </View>

        {!escaneoActivo ? (
          <>
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>{t("PagoTarjeta.TOTAL")}</Text>
              <Text style={styles.totalAmount}>{TOTAL.toFixed(2)}€</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>{t("PagoTarjeta.PIN")}</Text>
              <TextInput
                mode="outlined"
                style={styles.input}
                contentStyle={styles.inputContent}
                outlineStyle={styles.outlineStyle}
                keyboardType="numeric"
                placeholder={t("PagoTarjeta.EJ")}
                secureTextEntry
                maxLength={4}
                value={pin}
                onChangeText={handlePinChange}
                outlineColor={theme.colors.success}
                activeOutlineColor={theme.colors.success}
              />
            </View>
          </>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {escaneoExitoso ? (
              <Image
                source={require('@/assets/images/payment_success.png')}
                style={{ width: 180, height: 180, resizeMode: 'contain' }}
              />
            ) : (
              <LottieView
                ref={lottieRef}
                source={require('@/assets/lottie/TargetScan.json')}
                autoPlay
                loop
                style={{ width: 250, height: 250 }}
              />
            )}
            <Text style={styles.instructionText}>
              {escaneoExitoso ? t("PagoTarjeta.REDIRIGIR") : t("PagoTarjeta.ACERCATARJETALECTOR")}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        {!escaneoActivo ? (
          <>
            <Pressable style={styles.button} onPress={handleAceptar}>
              <Text style={styles.buttonText}>{t("PagoTarjeta.ACEPTAR")}</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonScan]} onPress={handleEscanearTarjeta}>
              <Text style={styles.buttonText}>{t("PagoTarjeta.ESCANEARTARJETA")}</Text>
            </Pressable>
          </>
        ) : null}

        <Pressable style={[styles.button, styles.buttonSecondary]} onPress={handleVolver}>
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            {escaneoActivo && !escaneoExitoso ? t("PagoTarjeta.CANCELAR") : t("PagoTarjeta.VOLVER")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default PagoTarjeta;