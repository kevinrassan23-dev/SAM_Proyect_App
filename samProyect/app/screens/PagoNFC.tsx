import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, StyleSheet, Image, SafeAreaView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import customTheme from '../theme/Theme';
import { useNavigation } from '@react-navigation/native';

export default function PagoNFC() {
  const navigation = useNavigation<any>();
  const [pagoAceptado, setPagoAceptado] = useState(false);

  // VALOR FIJO POR AHORA (RECIBIR DESDE HALL.TSX)
  const TOTAL = 100; // <-- REEMPLAZAR POR VARIABLE DE HALL.TSX

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pagoAceptado) {
      timer = setTimeout(() => {
        navigation.navigate('Confirmacion.tsx');
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [pagoAceptado, navigation]);

  const handleEscanear = () => {
    setPagoAceptado(true);
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
        {!pagoAceptado ? (
          <>
            <Text style={styles.MainText}>Total a pagar: ${TOTAL.toFixed(2)}</Text>
            
            <View style={styles.imagePlaceholder}>
              {<Image source={require('../../assets/images/nfc_scan.png')} style={styles.image} />}
            </View>

            <Text style={styles.instructionText}>Acerque su dispositivo al terminal para pagar</Text>

            <View style={styles.buttons}>
              <View style={styles.button}>
                <Button 
                  mode="contained" 
                  onPress={handleEscanear} 
                  buttonColor={customTheme.colors.secondary}
                >
                  Escanear
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
          </>
        ) : (
          <View style={styles.successContainer}>
            <View style={styles.imagePlaceholder}>
              {<Image source={require('../../assets/images/payment_success.png')} style={styles.image} />}
            </View>
            <Text style={styles.successText}>¡Pago Aceptado!</Text>
            <Text style={styles.redirectText}>Redirigiendo en unos segundos...</Text>
          </View>
        )}
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
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  MainText: {
    fontSize: customTheme.fontSize.large,
    color: customTheme.colors.primary,
    fontWeight: 'bold',
    marginBottom: customTheme.spacing(4),
    textAlign: 'center',
  },
  instructionText: {
    fontSize: customTheme.fontSize.normal,
    color: customTheme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: customTheme.spacing(4),
  },
  successText: {
    fontSize: customTheme.fontSize.title,
    color: customTheme.colors.primary,
    fontWeight: 'bold',
    marginTop: customTheme.spacing(2),
    textAlign: 'center',
  },
  redirectText: {
    fontSize: customTheme.fontSize.small,
    color: '#666',
    marginTop: customTheme.spacing(1),
    textAlign: 'center',
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: customTheme.spacing(4),
    borderColor: customTheme.colors.primary,
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#999',
    fontSize: 12,
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
