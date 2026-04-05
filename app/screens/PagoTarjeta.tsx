import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

import { useTranslation } from 'react-i18next';
import { styles } from "../../styles/PagoTarjetaStyle";

function PagoTarjeta() {
  const { t } = useTranslation();
  const { total: totalParam } = useLocalSearchParams<{ total: string }>();
  const TOTAL = parseFloat(totalParam || '0');
  const [pin, setPin] = useState('');

  const handleAceptar = () => {
    try {
      if (pin.length === 4) {
        router.push({ pathname: "/screens/Confirmacion", params: { total: TOTAL.toString(), metodo: "tarjeta" } });
      } else {
        Alert.alert(t("PagoTarjeta.ALERT1"), t("PagoTarjeta.ALERT1"));
      }
    } catch (e: any) {
      console.log(new Date().toLocaleTimeString(), +" "+ e?.message);
    }
  };

  const handlePinChange = (text: string) => {
    // Solo permitir números y máximo 4 caracteres
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 4) {
      setPin(cleaned);
    }
  };

  const handleVolver = () => {
    router.push({ pathname: "/screens/FormaPago" });
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.titleText}>{t("PagoTarjeta.TARJETA")}</Text>
      </View>

      {/* Total Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>{t("PagoTarjeta.TOTAL")}</Text>
        <Text style={styles.totalAmount}>${TOTAL.toFixed(2)}</Text>
      </View>

      {/* Form Section */}
      <View style={styles.formSection}>
        <Text style={styles.inputLabel}>{t("PagoTarjeta.PIN")}</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          secureTextEntry
          value={pin}
          onChangeText={handlePinChange}
        />
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        <Pressable style={styles.button} onPress={handleAceptar}>
          <Text style={styles.buttonText}>{t("PagoTarjeta.ACEPTAR")}</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.buttonSecondary]} onPress={handleVolver}>
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>{t("PagoTarjeta.VOLVER")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default PagoTarjeta;