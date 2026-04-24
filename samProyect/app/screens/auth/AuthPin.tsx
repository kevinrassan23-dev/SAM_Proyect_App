import React, { useState } from 'react';
import { View, Alert, Pressable } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from "react-i18next";
import { styles } from "@/styles/screens/auth/AuthPinStyle";
import theme from "@/theme/Theme";

function AuthPin() {
  // --- HOOKS Y ESTADOS ---
  const { t } = useTranslation();
  const { total, medicamentos, carrito } = useLocalSearchParams<{
    total: string;
    medicamentos?: string;
    carrito?: string;
  }>();

  const [pin, setPin] = useState('');
  const TOTAL = parseFloat(total || '0');

  // --- LÓGICA DE NEGOCIO ---

  /**
   * Valida la longitud del PIN y navega a la pantalla de confirmación exitosa.
   */
  const handleAceptarPin = () => {
    const ts = new Date().toLocaleTimeString();
    if (pin.length === 4) {
      console.log(`[${ts}] PIN validado. Redirigiendo a Confirmación.`);
      router.push({
        pathname: "/screens/shop/Confirmacion",
        params: {
          total: total,
          metodo: "tarjeta",
          medicamentos: medicamentos || '',
          carrito: carrito || '',
        }
      });
    } else {
      console.log(`[${ts}] Intento fallido: PIN incompleto.`);
      Alert.alert(t("AuthPin.ALERT1"), t("AuthPin.ALERT2"));
    }
  };

  /**
   * Cancela la operación y devuelve al usuario a la selección de método de pago.
   */
  const handleCancelar = () => {
    Alert.alert(
      t("AuthPin.CANCELAR_TITULO"), 
      t("AuthPin.CANCELAR_MSG"),
      [
        { text: t("AuthPin.NO"), style: "cancel" },
        {
          text: t("AuthPin.SI"),
          onPress: () => {
            console.log(`[${new Date().toLocaleTimeString()}] Flujo cancelado por usuario.`);
            router.push({
              pathname: "/screens/shop/FormaPago",
              params: { total, medicamentos: medicamentos || '', carrito: carrito || '' }
            });
          },
        },
      ]
    );
  };

  // --- ESTRUCTURA DE INTERFAZ (UI) ---
  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        
        {/* SECCIÓN SUPERIOR: Información de pago */}
        <View>
          <View style={styles.headerSection}>
            <Text style={styles.titleText}>{t("AuthPin.TITULO")}</Text>
          </View>

          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>{t("AuthPin.TOTAL")}</Text>
            <Text style={styles.totalAmount}>{TOTAL.toFixed(2)}€</Text>
          </View>

          {/* FORMULARIO: Input de seguridad */}
          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>{t("AuthPin.INPUT_LABEL")}</Text>
            <TextInput
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.outlineStyle}
              contentStyle={styles.inputContent}
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
              value={pin}
              onChangeText={(v) => setPin(v.replace(/[^0-9]/g, ''))}
              outlineColor={theme.colors.success}
              activeOutlineColor={theme.colors.success}
              textColor={theme.colors.textPrimary}
              autoFocus={true}
            />
          </View>
        </View>

        {/* SECCIÓN INFERIOR: Botonera principal */}
        <View style={styles.buttonsContainer}>
          <Pressable style={styles.button} onPress={handleAceptarPin}>
            <Text style={styles.buttonText}>{t("AuthPin.ACEPTAR")}</Text>
          </Pressable>

          <Pressable style={[styles.button, styles.buttonSecondary]} onPress={handleCancelar}>
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
              {t("AuthPin.CANCELAR_BTN")}
            </Text>
          </Pressable>
        </View>

      </View>
    </View>
  );
}

export default AuthPin;