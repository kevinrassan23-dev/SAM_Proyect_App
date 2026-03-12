import * as React from 'react';
import { useState } from 'react';
import { View, Alert, Pressable } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { styles } from "../../styles/PagoEfectivoStyle";

function PagoEfectivo() {
  const { total: totalParam } = useLocalSearchParams<{ total: string }>();
  const TOTAL = parseFloat(totalParam || '0');

const Aceptar = () => {
  router.push({ pathname: "/screens/Confirmacion"});
}

const Volver = () => {
  router.push({ pathname: "/screens/FormaPago"});
}


  const [importe, setImporte] = useState('');

  const handleAceptar = () => {
    const value = parseFloat(importe.replace(',', '.')) || 0;
    if (value >= TOTAL) {
      router.push({ pathname: "/screens/Confirmacion" });
    } else {
      Alert.alert('Pago insuficiente', 'No se puede procesar el pago: el importe es menor al total.');
    }
  };

  const handleVolver = () => {
    router.push({ pathname: "/screens/FormaPago" });
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.titleText}>Pago en Efectivo</Text>
      </View>

      {/* Total Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>TOTAL A PAGAR</Text>
        <Text style={styles.totalAmount}>${TOTAL.toFixed(2)}</Text>
      </View>

      {/* Form Section */}
      <View style={styles.formSection}>
        <Text style={styles.inputLabel}>Ingrese el monto a pagar</Text>
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
          <Text style={styles.buttonText}>ACEPTAR</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.buttonSecondary]} onPress={handleVolver}>
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>VOLVER</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default PagoEfectivo;