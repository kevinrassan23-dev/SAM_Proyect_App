import { phoneAuthService } from '@/services/firebase';
import { styles } from '@/styles/screens/auth/VerificacionOTPStyle';
import theme from '@/theme/Theme';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import "@/language/config/ConfigIdiomas";
import { Alert, Pressable, TextInput, View } from 'react-native';
import { Text } from 'react-native-paper';

function VerificacionOTP() {
  // --- HOOKS Y ESTADOS ---
  const params = useLocalSearchParams<{ 
    dni: string; 
    nombre: string; 
    cartilla: string;
    telefono: string;
    tipo: string;
  }>();
  const { t } = useTranslation();
  const [codigoOTP, setCodigoOTP] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tiempoExpiracion, setTiempoExpiracion] = useState(300);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** Control del ciclo de vida del temporizador de 5 minutos */
  useFocusEffect(
    React.useCallback(() => {
      console.log(`[${new Date().toLocaleTimeString()}] OTP activo. Timer iniciado.`);
      intervalRef.current = setInterval(() => {
        setTiempoExpiracion((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            router.replace("/screens/auth/IngresarCartilla");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [])
  );

  /** Valida el OTP y sincroniza datos de recetas antes de entrar al Hall */
  const handleVerificarOTP = async () => {
    const ts = new Date().toLocaleTimeString();
    if (codigoOTP.length !== 6) return;

    setLoading(true);
    try {
      console.log(`[${ts}] Verificando código en Firebase...`);
      const resultado = await phoneAuthService.verificarOTP(codigoOTP);

      if (!resultado.valido) {
        console.log(`[${ts}] Código OTP inválido.`);
        setError(t("VerificacionOTP.ERROR21"));
        setLoading(false);
        return;
      }

      console.log(`[${ts}] Autenticación exitosa. Cargando datos de farmacia.`);
      const { recetasService } = await import('@/services/firebase/recetas');
      const medData = await recetasService.obtenerMedicamentosReceta(params.dni);
      
      const listaNombres = medData.map((m: any) => m.nombre).filter((n: string) => n?.trim() !== '');
      router.push({
          pathname: '/screens/shop/Hall',
          params: { 
              ...params,
              tieneReceta: listaNombres.length > 0 ? 'true' : 'false',
              medicamentosReceta: listaNombres.join(','),
          }
      });
    } catch (e: any) {
      console.error(`[${ts}] Error crítico:`, e.message);
      setError(t("VerificacionOTP.ERROR3"));
    } finally {
      setLoading(false);
    }
  };

  // --- ESTRUCTURA DE INTERFAZ (UI) ---
  return (
    <View style={styles.container}>
      {/* Encabezado informativo */}
      <Text style={styles.title}>{t("VerificacionOTP.SMS")}</Text>
      <Text style={styles.instruction}>{t("VerificacionOTP.CODIGO")}</Text>

      {/* Input de código de 6 dígitos */}
      <TextInput
        placeholder="000000"
        value={codigoOTP}
        onChangeText={text => setCodigoOTP(text.replace(/[^0-9]/g, ''))}
        style={styles.input}
        maxLength={6}
        keyboardType="numeric"
        editable={!loading}
      />

      {/* Sección de estado: Timer y Errores */}
      <View style={{ height: 80, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>
          {t("VerificacionOTP.EXPIRA")} {Math.floor(tiempoExpiracion/60)}:{(tiempoExpiracion%60).toString().padStart(2,'0')}
        </Text>
        {error !== '' && <Text style={{ color: theme.colors.error, marginTop: 10 }}>{error}</Text>}
      </View>

      {/* Botón de acción final */}
      <View style={styles.buttonsContainer}>
        <Pressable 
          style={[styles.button, (loading || codigoOTP.length !== 6) && { opacity: 0.5 }]} 
          onPress={handleVerificarOTP}
        >
          <Text style={styles.buttonText}>{loading ? t("VerificacionOTP.VALIDANDO") : t("VerificacionOTP.ACEPTAR")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default VerificacionOTP;