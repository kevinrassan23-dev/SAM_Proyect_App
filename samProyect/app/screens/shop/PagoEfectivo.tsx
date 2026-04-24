import { styles } from "@/styles/screens/shop/PagoEfectivoStyle";
import theme from "@/theme/Theme";
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import "@/language/config/ConfigIdiomas";
import { Alert, Pressable, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

function PagoEfectivo() {
  // --- PARÁMETROS Y ESTADOS ---
  const { total: totalParam, medicamentos: medicamentosParam, carrito: carritoParam } = useLocalSearchParams<{
    total: string;
    medicamentos?: string;
    carrito?: string;
  }>();

  const { t } = useTranslation();
  const TOTAL = parseFloat(totalParam || '0');
  const [importe, setImporte] = useState('');

  // --- LÓGICA DE VALIDACIÓN ---
  /**
   * Formatea la entrada del usuario: permite solo números, 1 punto decimal 
   * y un máximo de 2 decimales e importe inferior a 1000.
   */
  const handleChangeText = (text: string) => {
    const formatted = text.replace(',', '.').replace(/[^0-9.]/g, '');

    if (formatted.split('.').length <= 2) {
      const numValue = parseFloat(formatted);

      if (formatted === '' || (!isNaN(numValue) && numValue < 1000)) {
        if (formatted.includes('.')) {
          const [, decimal] = formatted.split('.');
          if (decimal.length <= 2) setImporte(formatted);
        } else {
          setImporte(formatted);
        }
      }
    }
  };

  /**
   * Verifica que el importe entregado cubra el total de la compra
   */
  const handleAceptar = () => {
    const value = parseFloat(importe.replace(',', '.')) || 0;
    if (value >= TOTAL) {
      router.push({
        pathname: "/screens/shop/Confirmacion",
        params: {
          total: TOTAL.toString(),
          metodo: "efectivo",
          pagado: value.toFixed(2), // Enviamos el importe exacto pagado
          medicamentos: medicamentosParam || '',
          carrito: carritoParam || '',
        }
      });
    } else {
      Alert.alert(t("PagoEfectivo.ALERT1"), t("PagoEfectivo.ALERT2"));
    }
  };

  const handleVolver = () => {
    router.push({ 
      pathname: "/screens/shop/FormaPago", 
      params: { total: TOTAL.toString(), medicamentos: medicamentosParam, carrito: carritoParam } 
    });
  };

  // --- ESTRUCTURA DE INTERFAZ (UI) ---
  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        
        {/* Cabecera */}
        <View style={styles.headerSection}>
          <Text style={styles.titleText}>{t("PagoEfectivo.EFECTIVO")}</Text>
        </View>

        {/* Tarjeta de Resumen de Pago */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>{t("PagoEfectivo.TOTAL")}</Text>
          <Text style={styles.totalAmount}>{TOTAL.toFixed(2)}€</Text>
        </View>

        {/* Formulario de Entrada */}
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

      {/* Footer de Navegación */}
      <View style={styles.buttonsContainer}>
        <Pressable style={styles.button} onPress={handleAceptar}>
          <Text style={styles.buttonText}>{t("PagoEfectivo.ACEPTAR")}</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleVolver}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            {t("PagoEfectivo.VOLVER")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default PagoEfectivo;