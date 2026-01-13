import * as React from 'react';
import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import customTheme from '../theme/Theme';
import { useNavigation } from '@react-navigation/native';

export default function PagoEfectivo() {
  const navigation = useNavigation<any>();
  const [importe, setImporte] = useState('');

  // Fixed total for now (will come from Hall in the future)
  const TOTAL = 1000; // <-- replace with prop or context when available

  const handleAceptar = () => {
    const value = parseFloat(importe.replace(',', '.')) || 0;
    if (value >= TOTAL) {
      navigation.navigate('Confirmacion');
    } else {
      Alert.alert('Pago insuficiente', 'No se puede procesar el pago: el importe es menor al total.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.totalText}>Total a pagar: ${TOTAL.toFixed(2)}</Text>

      <Text style={styles.label}>Ingresa el importe</Text>
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
          <Button mode="contained" onPress={handleAceptar} buttonColor={customTheme.colors.primary}>
            Aceptar
          </Button>
        </View>
        <View style={styles.button}>
          <Button mode="outlined" onPress={() => navigation.navigate('FormaPago')}>
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
  totalText: {
    fontSize: customTheme.fontSize.large,
    color: customTheme.colors.primary,
    fontWeight: 'bold',
    marginBottom: customTheme.spacing(2.5),
    textAlign: 'center',
  },
  label: {
    fontSize: customTheme.fontSize.normal,
    color: customTheme.colors.textPrimary,
    marginBottom: customTheme.spacing(1),
  },
  input: {
    borderRadius: 6,
    marginBottom: customTheme.spacing(2.5),
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: customTheme.spacing(0.75),
  },
});