import { firebaseConfig } from "@/config/firebaseConfig";
import { pacientesService, phoneAuthService } from "@/services/firebase";
import { styles } from "@/styles/screens/auth/VerificacionMovilStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/language/config/ConfigIdiomas";
import { Pressable, Text, TextInput, View, Image } from "react-native";

function VerificacionMovil() {
  // --- CONFIGURACIÓN Y ESTADOS ---
  const params = useLocalSearchParams<{ 
    dni: string; 
    nombre: string; 
    cartilla: string;
    telefono: string;
    tipo: string;
  }>();
  const { t } = useTranslation();
  const recaptchaVerifier = useRef(null);

  const [TLF, setTLF] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [segundosBloqueo, setSegundosBloqueo] = useState(0);

  /** Revisa si existe bloqueo persistente por fallos previos */
  useEffect(() => {
    const revisar = async () => {
      const stored = await AsyncStorage.getItem(`bloqueo_4digitos_${params.cartilla}`);
      if (stored) {
        const { expiracion } = JSON.parse(stored);
        const ahora = Date.now();
        if (ahora < expiracion) setSegundosBloqueo(Math.round((expiracion - ahora) / 1000));
      }
    };
    revisar();
  }, [params.cartilla]);

  /** Contador del temporizador de bloqueo */
  useEffect(() => {
    if (segundosBloqueo <= 0) return;
    const interval = setInterval(() => setSegundosBloqueo(prev => (prev <= 1 ? 0 : prev - 1)), 1000);
    return () => clearInterval(interval);
  }, [segundosBloqueo]);

  /** Ejecuta la validación de dígitos y el envío del SMS de Firebase */
  const aceptar = async () => {
    if (loading || segundosBloqueo > 0) return;
    const ts = new Date().toLocaleTimeString();
    setLoading(true);

    try {
      console.log(`[${ts}] Validando teléfono para cartilla: ${params.cartilla}`);
      const res = await pacientesService.validarPorCartillaYTelefono(params.cartilla, TLF);

      if (!res.valido) {
        console.log(`[${ts}] Teléfono incorrecto.`);
        setError(t("VerificacionMovil.ERROR1"));
        setLoading(false);
        return;
      }

      console.log(`[${ts}] Validado. Enviando SMS OTP...`);
      const otp = await phoneAuthService.generarOTP(params.telefono, recaptchaVerifier.current);
      if (otp.exito) router.push({ 
          pathname: "/screens/auth/VerificacionOTP", 
          params: { 
              ...params,                    
              dni: res.paciente?.DNI ?? '',    
              nombre: res.paciente?.Nombre_Paciente ?? '',
              tipo: res.paciente?.Tipo_Paciente ?? '',
          } 
      });

    } catch (e: any) {
      console.error(`[${ts}] Error:`, e.message);
      setError(t("VerificacionMovil.ERROR2"));
    } finally {
      setLoading(false);
    }
  };

  // --- ESTRUCTURA DE INTERFAZ (UI) ---
  return (
    <View style={styles.container}>
      {/* Componente Invisible de Firebase para ReCAPTCHA */}
      <FirebaseRecaptchaVerifierModal 
        ref={recaptchaVerifier} 
        firebaseConfig={firebaseConfig} 
        attemptInvisibleVerification={true} 
      />

      <Text style={styles.title}>{t("VerificacionMovil.INGRESAR")}</Text>
      
      <Image 
        source={require('@/assets/images/tlfLogo.webp')} 
        style={{ width: '85%', height: 160, resizeMode: 'contain', marginBottom: 24 }} 
      />

      {/* Campo de entrada de teléfono */}
      <TextInput 
        placeholder="Tu_teléfono" 
        value={TLF} 
        onChangeText={v => setTLF(v.replace(/[^0-9]/g, "").slice(0, 9))} 
        style={styles.input} 
        keyboardType="numeric" 
      />

      {/* Feedback de Bloqueo/Error */}
      {segundosBloqueo > 0 && <Text style={styles.timerText}>{t("VerificacionMovil.BLOQUEADO")} {segundosBloqueo}s</Text>}
      {error !== "" && <Text style={styles.error}>{error}</Text>}

      {/* Botones principales */}
      <View style={styles.VerificacionMovilContainer}>
        <Pressable 
          style={[styles.button, (loading || TLF.length !== 9 || segundosBloqueo > 0) && { opacity: 0.5 }]} 
          onPress={aceptar}
        >
          <Text style={styles.buttonText}>{loading ? t("VerificacionMovil.VALIDANDO") : t("VerificacionMovil.ACEPTAR")}</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.buttonCancel]} onPress={() => router.replace("/screens/auth/IngresarCartilla")}>
          <Text style={styles.buttonText}>{t("VerificacionMovil.CANCELAR")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default VerificacionMovil;