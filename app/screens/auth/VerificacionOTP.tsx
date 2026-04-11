import { phoneAuthService } from '@/services/firebase';
import { styles } from '@/styles/screens/auth/VerificacionOTPStyle';
import theme from '@/theme/Theme';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Alert, Pressable, TextInput, View } from 'react-native';
import { Text } from 'react-native-paper';

function VerificacionOTP() {
  const { dni, nombre, tipo, cartilla, telefono } = useLocalSearchParams<{
    dni: string;
    nombre: string;
    tipo: string;
    cartilla: string;
    telefono: string;
  }>();

  const { t } = useTranslation();

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
      console.log(`[${new Date().toLocaleTimeString()}] Entrando a VerificacionOTP`);

      intervalRef.current = setInterval(() => {
        setTiempoExpiracion((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            Alert.alert(
              t("VerificacionOTP.ALERT1"),
              t("VerificacionOTP.ALERT12"),
              [{ text: t("VerificacionOTP.OK"), onPress: () => volverAlInicio() }]
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Cuando SALGAS de la pantalla
      return () => {
        console.log(`[${new Date().toLocaleTimeString()}] Saliendo de VerificacionOTP - Limpiando timer`);
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
      setError(t("VerificacionOTP.ERROR1"));
      return;
    }

    setLoading(true);
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Verificando OTP...`);
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

          Alert.alert(t("VerificacionOTP.ALERT21"), t("VerificacionOTP.ALERT22"), [
            { text: t("VerificacionOTP.OK"), onPress: () => volverAlInicio() }
          ]);
        } else {
          setError(`${t("VerificacionOTP.ERROR21")} ${nuevoIntento} ${t("VerificacionOTP.ERROR22")} ${MAX_INTENTOS}`);
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

      Alert.alert(t("VerificacionOTP.BIENVENIDO"), `${t("VerificacionOTP.HOLA")} ${nombre.split(' ')[0]} 👋`, [
        {
          text: t("VerificacionOTP.OK"),
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
      setError(t("VerificacionOTP.ERROR3"));
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
      <Text style={styles.title}>{t("VerificacionOTP.SMS")}</Text>
      <Text style={styles.instruction}>{t("VerificacionOTP.CODIGO")}</Text>

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
          {t("VerificacionOTP.EXPIRA")} {formatearTiempo(tiempoExpiracion)}
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
          <Text style={styles.buttonText}>{loading ? t("VerificacionOTP.VALIDANDO") : t("VerificacionOTP.ACEPTAR")}</Text>
        </Pressable>

      </View>
    </View>
  );
}

export default VerificacionOTP;