import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, StyleSheet, Image, SafeAreaView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import customTheme from '../../theme/Theme';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { styles } from "../../styles/PagoNFCStyle";

function PagoNFC() {
  const navigation = useNavigation<any>();
  const [pagoAceptado, setPagoAceptado] = useState(false);

  // VALOR FIJO POR AHORA (RECIBIR DESDE HALL.TSX)
  const TOTAL = 100; // <-- REEMPLAZAR POR VARIABLE DE HALL.TSX

  useEffect(() => {

    // CUIDADO CON ESTO
    let timer: ReturnType<typeof setTimeout>;

    if (pagoAceptado) {
      timer = setTimeout(() => {
        router.push({ pathname: "/screens/Confirmacion" });
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [pagoAceptado, navigation]);

  const handleEscanear = () => {
    setPagoAceptado(true);
  };

  return (
    <View style={styles.container}>

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
                  ESCANEAR
                </Button>
              </View>
              <View style={styles.button}>
                <Button 
                  mode="contained" 
                  onPress={() => router.push({ pathname: "/screens/FormaPago"})} 
                  buttonColor={customTheme.colors.secondary}
                >
                  VOLVER
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
    </View>
  );
}

export default PagoNFC;