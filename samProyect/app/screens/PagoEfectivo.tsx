import * as React from 'react';
import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import customTheme from '../theme/Theme';
import { useNavigation } from '@react-navigation/native';

export default function PagoEfectivo() {
  const navigation = useNavigation<any>();
  const [importe, setImporte] = useState('');

  // VALOR FIJO POR AHORA (RECIBIR DESDE HALL.TSX)
  const TOTAL = 100; // <-- REEMPLAZAR POR VARIABLE DE HALL.TSX

  const handleAceptar = () => {
    const value = parseFloat(importe.replace(',', '.')) || 0;
    if (value >= TOTAL) {
      navigation.navigate('Confirmacion.tsx');
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
        activeOutlineColor={customTheme.colors.primary}
      />

      <View style={styles.buttons}>
        <View style={styles.button}>
          <Button mode="contained" onPress={handleAceptar} buttonColor={customTheme.colors.secondary}>
            Aceptar
          </Button>
        </View>
        <View style={styles.button}>
          <Button mode="contained" onPress={() => navigation.navigate('FormaPago') } buttonColor={customTheme.colors.secondary}>
            Volver
          </Button>
        </View>
      </View> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: customTheme.spacing(2.5),
    justifyContent: 'center',
    backgroundColor: customTheme.colors.background,
  },
  MainText: {
    fontSize: customTheme.fontSize.large,
    color: customTheme.colors.primary,
    fontWeight: 'bold',
    marginBottom: customTheme.spacing(2.5),
    textAlign: 'center',
  },
  input: {
    borderRadius: 6,
    marginBottom: customTheme.spacing(2.5),
  },
  buttons: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  button: {
    width: '100%',
    marginVertical: customTheme.spacing(0.75),
  },
});