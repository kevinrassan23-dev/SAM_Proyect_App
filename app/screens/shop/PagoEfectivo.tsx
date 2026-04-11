import { styles } from "@/styles/screens/shop/PagoEfectivoStyle";
import theme from "@/theme/Theme";
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Alert, Pressable, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

function PagoEfectivo() {
  const { total: totalParam, medicamentos: medicamentosParam, carrito: carritoParam } = useLocalSearchParams<{
    total: string;
    medicamentos?: string;
    carrito?: string;
  }>();

  const TOTAL = parseFloat(totalParam || '0');
  const [importe, setImporte] = useState('');

  // --- LÓGICA ADICIONAL ---
  const handleChangeText = (text: string) => {
    // 1. Normalizamos: coma por punto y solo permitimos números y un punto
    const formatted = text.replace(',', '.').replace(/[^0-9.]/g, '');

    // 2. Validamos que no haya más de un punto decimal
    if (formatted.split('.').length <= 2) {
      const numValue = parseFloat(formatted);

      // 3. LA CLAVE: 
      // Si está vacío, lo permitimos para que puedan borrar.
      // Si es un número, validamos que sea menor o igual a 1000.
      if (formatted === '' || (!isNaN(numValue) && numValue < 1000)) {

        // OPCIONAL: Limitar a 2 decimales para que no pongan 20.2555
        if (formatted.includes('.')) {
          const [entero, decimal] = formatted.split('.');
          if (decimal.length <= 2) {
            setImporte(formatted);
          }
        } else {
          setImporte(formatted);
        }
      }
    }
  };

  const handleAceptar = () => {
    const value = parseFloat(importe.replace(',', '.')) || 0;
    if (value >= TOTAL) {
      router.push({
        pathname: "/screens/shop/Confirmacion",
        params: {
          total: TOTAL.toString(),
          metodo: "efectivo",
          // ── NUEVO: Pasamos el importe real introducido por el usuario
          pagado: value.toFixed(2),
          medicamentos: medicamentosParam || '',
          carrito: carritoParam || '',
        }
      });
    } else {
      Alert.alert(t("PagoEfectivo.ALERT1"), t("PagoEfectivo.ALERT2"));
    }
  };

    const handleVolver = () => {
      router.push({ pathname: "/screens/shop/FormaPago", params: { total: TOTAL.toString(), medicamentos: medicamentosParam, carrito: carritoParam } });
    };

  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.headerSection}>
          <Text style={styles.titleText}>{t("PagoEfectivo.EFECTIVO")}</Text>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>{t("PagoEfectivo.TOTAL")}</Text>
          <Text style={styles.totalAmount}>{TOTAL.toFixed(2)}€</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.inputLabel}>{t("PagoEfectivo.INGRESAR")}:</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            keyboardType="decimal-pad"
            value={importe}
            onChangeText={handleChangeText}
            placeholder="0.00"
            outlineColor={theme.colors.success}
            activeOutlineColor={theme.colors.success}
            textColor="#000"
          />
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable style={styles.button} onPress={handleAceptar}>
          <Text style={styles.buttonText}>{t("PagoEfectivo.ACEPTAR")}</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleVolver}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>{t("PagoEfectivo.VOLVER")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default PagoEfectivo;