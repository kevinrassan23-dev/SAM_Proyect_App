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

return (
  <View style={styles.container}>
    <Text style={styles.MainText}>
      Total a pagar: ${TOTAL.toFixed(2)}
    </Text>

    <Text style={styles.MainText}>
      Ingrese el PIN de su tarjeta
    </Text>

    <TextInput
      mode="outlined"
      style={styles.input}
      keyboardType="numeric"
      secureTextEntry
      value={pin}
      onChangeText={handlePinChange}
      placeholder="Ej: 1234"
      activeOutlineColor={styles.Outline.color}
    />

    <Pressable style={styles.button} onPress={handleAceptar}>
      <Text style={styles.buttonText}>ACEPTAR</Text>
    </Pressable>

    <Pressable style={styles.button} onPress={Volver}>
      <Text style={styles.buttonText}>VOLVER</Text>
    </Pressable>
  </View>
);
}

export default PagoTarjeta;