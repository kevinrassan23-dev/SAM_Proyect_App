import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Image, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import customTheme from '../../theme/Theme';
import { useNavigation } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { styles } from "../../styles/PagoNFCStyle";

function PagoNFC() {
  const navigation = useNavigation<any>();
  const { total: totalParam } = useLocalSearchParams<{ total: string }>();
  const TOTAL = parseFloat(totalParam || '0');
  const [pagoAceptado, setPagoAceptado] = useState(false);

  useEffect(() => {
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

  const handleVolver = () => {
    router.push({ pathname: "/screens/FormaPago" });
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.titleText}>Pago con NFC</Text>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {!pagoAceptado ? (
          <>
            {/* Total Card */}
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>TOTAL A PAGAR</Text>
              <Text style={styles.totalAmount}>${TOTAL.toFixed(2)}</Text>
            </View>

            {/* NFC Image */}
            <View style={styles.imagePlaceholder}>
              <Image source={require('../../assets/images/nfc_scan.png')} style={styles.image} />
            </View>

            {/* Instruction Text */}
            <Text style={styles.instructionText}>Acerque su dispositivo al terminal para pagar</Text>
          </>
        ) : (
          <View style={styles.successContainer}>
            {/* Success Image */}
            <View style={styles.imagePlaceholder}>
              <Image source={require('../../assets/images/payment_success.png')} style={styles.image} />
            </View>
            <Text style={styles.successText}>¡Pago Aceptado!</Text>
            <Text style={styles.redirectText}>Redirigiendo en unos segundos...</Text>
          </View>
        )}
      </View>

      {/* Buttons Section */}
      {!pagoAceptado && (
        <View style={styles.buttons}>
          <Pressable style={styles.button} onPress={handleEscanear}>
            <Text style={styles.buttonText}>ESCANEAR</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonSecondary]} onPress={handleVolver}>
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>VOLVER</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default PagoNFC;