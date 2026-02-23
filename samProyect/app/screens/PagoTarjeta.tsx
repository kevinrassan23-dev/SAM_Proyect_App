import * as React from 'react';
import { useState } from 'react';
import { View, Alert, Pressable } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';

import { styles } from "../../styles/PagoTarjetaStyle";

function PagoTarjeta() {
  const { total: totalParam } = useLocalSearchParams<{ total: string }>();
  const TOTAL = parseFloat(totalParam || '0');
  const [pin, setPin] = useState('');


  const Volver = () => {
    router.push({ pathname: "/screens/FormaPago"});
  }

  const handleAceptar = () => {
    if (pin.length === 4) {
      router.push({ pathname: "/screens/Confirmacion" });
    } else {
      Alert.alert('PIN incompleto', 'Por favor, ingrese exactamente 4 dígitos.');
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
        <Text style={styles.titleText}>Pago con Tarjeta</Text>
      </View>

      {/* Total Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>TOTAL A PAGAR</Text>
        <Text style={styles.totalAmount}>${TOTAL.toFixed(2)}</Text>
      </View>

      {/* Form Section */}
      <View style={styles.formSection}>
        <Text style={styles.inputLabel}>Ingrese el PIN de su tarjeta</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          secureTextEntry
          value={pin}
          onChangeText={handlePinChange}
          placeholder="••••"
        />
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        <Pressable style={styles.button} onPress={handleAceptar}>
          <Text style={styles.buttonText}>ACEPTAR</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.buttonSecondary]} onPress={handleVolver}>
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>VOLVER</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default PagoTarjeta;