import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Pressable, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { styles } from '@/styles/screens/auth/VerificacionOTPStyle';
import { phoneAuthService } from '@/services/firebase';
import theme from '@/theme/Theme';

function VerificacionOTP() {
  const { dni, nombre, tipo, cartilla, telefono } = useLocalSearchParams<{
    dni: string;
    nombre: string;
    tipo: string;
    cartilla: string;
    telefono: string;
  }>();

  const [codigoOTP, setCodigoOTP] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [tiempoExpiracion, setTiempoExpiracion] = useState(300); // 5 minutos
  
  const inputRef = useRef<TextInput>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null); // ✅ NUEVO

  const MAX_INTENTOS = 3;

  // ✅ NUEVO: Usar useFocusEffect para limpiar cuando salgas
  useFocusEffect(
    React.useCallback(() => {
      // Cuando ENTRAS a la pantalla
      console.log('📱 Entrando a VerificacionOTP');

      intervalRef.current = setInterval(() => {
        setTiempoExpiracion((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            Alert.alert(
              "Tiempo agotado",
              "Por seguridad, debes iniciar el proceso de nuevo.",
              [{ text: "OK", onPress: () => volverAlInicio() }]
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Cuando SALGAS de la pantalla
      return () => {
        console.log('❌ Saliendo de VerificacionOTP - Limpiando timer');
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, [])
  );

  const volverAlInicio = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    router.replace("/screens/auth/IngresarCartilla");
  };

  const handleVerificarOTP = async () => {
    setError('');
    if (codigoOTP.length !== 6) {
      setError('Ingresa los 6 dígitos');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Verificando OTP...');
      const resultado = await phoneAuthService.verificarOTP(codigoOTP);

      if (!resultado.valido) {
        const nuevoIntento = intentosFallidos + 1;
        setIntentosFallidos(nuevoIntento);

        if (nuevoIntento >= MAX_INTENTOS) {
          // ✅ Limpiar timer antes de navegar
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          Alert.alert("Acceso Denegado", "Demasiados intentos fallidos.", [
            { text: "OK", onPress: () => volverAlInicio() }
          ]);
        } else {
          setError(`Código incorrecto. Intento ${nuevoIntento} de ${MAX_INTENTOS}`);
        }
        setLoading(false);
        return;
      }

      // Proceso de éxito
      const { recetasService } = await import('@/services/firebase');
      const medicamentosRecetaData = await recetasService.obtenerMedicamentosReceta(dni);
      const listaNombres = Array.isArray(medicamentosRecetaData)
        ? medicamentosRecetaData.map((m: any) => m.nombre).filter((n: string) => n?.trim() !== '')
        : [];

      // ✅ Limpiar timer antes de navegar
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      Alert.alert('✅ Bienvenido', `Hola, ${nombre.split(' ')[0]} 👋`, [
        {
          text: 'OK',
          onPress: () => {
            router.push({
              pathname: '/screens/shop/Hall',
              params: {
                dni, nombre, tipo, cartilla, telefono,
                tieneReceta: listaNombres.length > 0 ? 'true' : 'false',
                medicamentosReceta: listaNombres.join(','),
              },
            });
          },
        },
      ]);
    } catch (e: any) {
      setError('Error de verificación');
    } finally {
      if (loading) setLoading(false);
    }
  };

  const formatearTiempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${minutos}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificación SMS</Text>
      <Text style={styles.instruction}>Ingresa el código de 6 dígitos</Text>

      <TextInput
        ref={inputRef}
        placeholder="000000"
        value={codigoOTP}
        onChangeText={text => setCodigoOTP(text.replace(/[^0-9]/g, ''))}
        style={styles.input}
        maxLength={6}
        keyboardType="numeric"
        editable={!loading}
      />

      <View style={{ height: 80, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.colors.secondary, fontWeight: 'bold', fontSize: 16 }}>
          Expira en: {formatearTiempo(tiempoExpiracion)}
        </Text>
        {error !== '' && (
          <Text style={{ color: theme.colors.error, fontWeight: 'bold', marginTop: 10 }}>
            {error}
          </Text>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, (loading || codigoOTP.length !== 6) && { opacity: 0.5 }]}
          onPress={handleVerificarOTP}
          disabled={loading || codigoOTP.length !== 6}
        >
          <Text style={styles.buttonText}>{loading ? 'VALIDANDO...' : 'ACEPTAR'}</Text>
        </Pressable>

      </View>
    </View>
  );
}

export default VerificacionOTP;