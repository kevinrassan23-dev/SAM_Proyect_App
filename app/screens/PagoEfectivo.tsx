import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { styles } from "../../styles/PagoEfectivoStyle";

function PagoEfectivo() {
  const { total: totalParam } = useLocalSearchParams<{ total: string }>();
  const TOTAL = parseFloat(totalParam || '0');
  const { t } = useTranslation();


  const [importe, setImporte] = useState('');

  const handleAceptar = () => {
    const value = parseFloat(importe.replace(',', '.')) || 0;
    if (value >= TOTAL) {
      router.push({ pathname: "/screens/Confirmacion" });
    } else {
      Alert.alert(t("PagoEfectivo.ALERT1"), t("PagoEfectivo.ALERT2"));
    }
  };

  const handleVolver = () => {
    router.push({ pathname: "/screens/FormaPago" });
  };
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.titleText}>{t("PagoEfectivo.EFECTIVO")}</Text>
      </View>

      {/* Total Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>{t("PagoEfectivo.TOTAL")}</Text>
        <Text style={styles.totalAmount}>${TOTAL.toFixed(2)}</Text>
      </View>

      {/* Form Section */}
      <View style={styles.formSection}>
        <Text style={styles.inputLabel}>{t("PagoEfectivo.INGRESAR")}</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          value={importe}
          onChangeText={setImporte}
          placeholder="0.00"
        />
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        <Pressable style={styles.button} onPress={handleAceptar}>
          <Text style={styles.buttonText}>{t("PagoEfectivo.ACEPTAR")}</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.buttonSecondary]} onPress={handleVolver}>
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>{t("PagoEfectivo.VOLVER")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default PagoEfectivo;