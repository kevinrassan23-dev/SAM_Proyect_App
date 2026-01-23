import * as React from 'react';
import { useState } from 'react';
import { View, StyleSheet, Alert, Image, SafeAreaView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import customTheme from '../theme/Theme';
import { useNavigation } from '@react-navigation/native';

export default function PagoTarjeta() {
  const navigation = useNavigation<any>();
  const [pin, setPin] = useState('');

  // VALOR FIJO POR AHORA (RECIBIR DESDE HALL.TSX)
  const TOTAL = 100; // <-- REEMPLAZAR POR VARIABLE DE HALL.TSX

  const handleAceptar = () => {
    if (pin.length === 4) {
      navigation.navigate('Confirmacion.tsx');
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
    <SafeAreaView style={styles.safeArea}>
      {/* Contenedor del Logo - Posicionado arriba a la derecha */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/images/sam logo.png')} 
          style={styles.logo} 
        />
      </View>

      {/* Contenedor del Contenido - Centrado en el espacio restante */}
      <View style={styles.content}>
        <Text style={styles.MainText}>Total a pagar: ${TOTAL.toFixed(2)}</Text>

        <Text style={styles.MainText}>Ingrese el PIN de su tarjeta</Text>
        
        <TextInput
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          secureTextEntry={true}
          value={pin}
          onChangeText={handlePinChange}
          placeholder="...."
          placeholderTextColor="#ccc"
          activeOutlineColor={customTheme.colors.primary}
        />

        <View style={styles.buttons}>
          <View style={styles.button}>
            <Button 
              mode="contained" 
              onPress={handleAceptar} 
              buttonColor={customTheme.colors.secondary}
            >
              Aceptar
            </Button>
          </View>
          <View style={styles.button}>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('FormaPago.tsx')} 
              buttonColor={customTheme.colors.secondary}
            >
              Volver
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: customTheme.colors.background,
  },
  logoContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: customTheme.spacing(2.5),
    paddingTop: customTheme.spacing(2),
    width: '100%',
  },
  logo: {
    width: 120,
    height: 60,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    padding: customTheme.spacing(2.5),
    justifyContent: 'center',
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
    textAlign: 'center',
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