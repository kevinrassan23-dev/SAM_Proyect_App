import * as React from 'react';
import { useState } from 'react';
import { View, Alert, Pressable } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { router } from 'expo-router';
import { styles } from "../../styles/PagoEfectivoStyle";

function PagoEfectivo() {

const Aceptar = () => {
  router.push({ pathname: "/screens/Confirmacion"});
}

const Volver = () => {
  router.push({ pathname: "/screens/FormaPago"});
}


  const [importe, setImporte] = useState('');

  // VALOR FIJO POR AHORA (RECIBIR DESDE HALL.TSX)
  const TOTAL = 100; // <-- REEMPLAZAR POR VARIABLE DE HALL.TSX

  const handleAceptar = () => {
    const value = parseFloat(importe.replace(',', '.')) || 0;
    if (value >= TOTAL) {
      Aceptar();
    } else {
      Alert.alert('Pago insuficiente', 'No se puede procesar el pago: el importe es menor al total.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.MainText}>Total a pagar: ${TOTAL.toFixed(2)}</Text>

      <Text style={styles.MainText}>Ingresa el importe</Text>
      <TextInput
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
        value={importe}
        onChangeText={setImporte}
        placeholder="0.00"
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

export default PagoEfectivo;