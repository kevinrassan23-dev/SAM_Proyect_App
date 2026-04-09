import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { View, Alert, Pressable, Image } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { styles } from "@/styles/screens/shop/PagoTarjetaStyle";
import theme from "@/theme/Theme";

function PagoTarjeta() {
  const { total: totalParam, medicamentos: medicamentosParam, carrito: carritoParam } = useLocalSearchParams<{ 
        total: string;
        medicamentos?: string;
        carrito?: string;
  }>();
  const TOTAL = parseFloat(totalParam || '0');
  const [pin, setPin] = useState('');
  const [escaneoActivo, setEscaneoActivo] = useState(false);
  const [escaneoExitoso, setEscaneoExitoso] = useState(false);
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    let timerAnimacion: ReturnType<typeof setTimeout>;
    let timerExito: ReturnType<typeof setTimeout>;

    if (escaneoActivo && !escaneoExitoso) {
      timerAnimacion = setTimeout(() => {
        setEscaneoExitoso(true);
      }, 10000);
    }

    if (escaneoExitoso) {
      timerExito = setTimeout(() => {
        router.push({
          pathname: "/screens/shop/Confirmacion",
          params: {
            total: TOTAL.toString(),
            metodo: "tarjeta",
            medicamentos: medicamentosParam || '',
            carrito: carritoParam || '',
          }
        });
      }, 5000);
    }

    return () => {
      clearTimeout(timerAnimacion);
      clearTimeout(timerExito);
    };
  }, [escaneoActivo, escaneoExitoso, medicamentosParam, carritoParam]);

  const handleAceptar = () => {
    if (pin.length === 4) {
      router.push({ 
        pathname: "/screens/shop/Confirmacion", 
        params: { 
          total: TOTAL.toString(), 
          metodo: "tarjeta",
          medicamentos: medicamentosParam || '',
          carrito: carritoParam || '',
        } 
      });
    } else {
      Alert.alert('PIN incompleto', 'Por favor, ingresa los 4 dígitos.');
    }
  };

  const handlePinChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 4) {
      setPin(cleaned);
    }
  };

  const handleEscanearTarjeta = () => {
    console.log(' Iniciando escaneo de tarjeta...');
    setEscaneoActivo(true);
  };

  const handleVolver = () => {
    if (escaneoActivo) {
      setEscaneoActivo(false);
      setEscaneoExitoso(false);
      return;
    }
    router.push({ 
      pathname: "/screens/shop/FormaPago", 
      params: { total: TOTAL.toString(), medicamentos: medicamentosParam, carrito: carritoParam, } 
    });
  };

  if (escaneoActivo) {
    return (
      <View style={styles.container}>
      {!escaneoExitoso ? (
        <>
          <View style={styles.headerSection}>
            <Text style={styles.titleText}>Escanear Tarjeta</Text>
          </View>

          {/* CONTENEDOR CENTRAL: Ahora incluye la animación Y el texto */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LottieView
              ref={lottieRef}
              source={require('@/assets/lottie/TargetScan.json')}
              autoPlay
              loop={true}
              style={{ width: 200, height: 200 }} 
            />
            
            {/* EL TEXTO AHORA ESTÁ AQUÍ DENTRO, JUSTO DEBAJO DE LA ANIMACIÓN */}
            <Text style={styles.instructionText}>
              Acerca tu tarjeta bancaria al lector
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <Pressable style={[styles.buttonSelect, styles.buttonSecondary]} onPress={handleVolver}>
              <Text style={[styles.buttonText, styles.buttonTextSecondary]}>CANCELAR</Text>
            </Pressable>
          </View>
        </>
        ) : (
          <>
            <View style={styles.headerSection}>
              <Text style={styles.titleText}>Pago con tarjeta</Text>
            </View>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={require('@/assets/images/payment_success.png')}
                style={{ width: 180, height: 180, resizeMode: 'contain' }}
              />
            </View>

            <Text style={[styles.titleText, { marginBottom: 8 }]}>
              Escaneo exitoso
            </Text>
            <Text style={styles.instructionText}>
              Redirigiendo en unos segundos...
            </Text>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.headerSection}>
          <Text style={styles.titleText}>
            {escaneoActivo ? (escaneoExitoso ? "¡Escaneo Exitoso!" : "Escanear Tarjeta") : "Pago con Tarjeta"}
          </Text>
        </View>

        {!escaneoActivo ? (
          <>
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>TOTAL A PAGAR</Text>
              <Text style={styles.totalAmount}>{TOTAL.toFixed(2)}€</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Ingrese el PIN de su tarjeta</Text>
              <TextInput
                mode="outlined"
                style={styles.input}
                contentStyle={styles.inputContent}
                outlineStyle={styles.outlineStyle}
                keyboardType="numeric"
                placeholder="Ej: 1234"
                secureTextEntry
                maxLength={4}
                value={pin}
                onChangeText={handlePinChange}
                outlineColor={theme.colors.success}
                activeOutlineColor={theme.colors.success}
              />
            </View>
          </>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {escaneoExitoso ? (
              <Image
                source={require('@/assets/images/payment_success.png')}
                style={{ width: 180, height: 180, resizeMode: 'contain' }}
              />
            ) : (
              <LottieView
                ref={lottieRef}
                source={require('@/assets/lottie/TargetScan.json')}
                autoPlay
                loop
                style={{ width: 250, height: 250 }}
              />
            )}
            <Text style={styles.instructionText}>
              {escaneoExitoso ? "Redirigiendo en unos segundos..." : "Acerca tu tarjeta bancaria al lector"}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        {!escaneoActivo ? (
          <>
            <Pressable style={styles.button} onPress={handleAceptar}>
              <Text style={styles.buttonText}>ACEPTAR</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonScan]} onPress={handleEscanearTarjeta}>
              <Text style={styles.buttonText}>ESCANEAR TARJETA</Text>
            </Pressable>
          </>
        ) : null}

        <Pressable style={[styles.button, styles.buttonSecondary]} onPress={handleVolver}>
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            {escaneoActivo && !escaneoExitoso ? "CANCELAR" : "VOLVER"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default PagoTarjeta;