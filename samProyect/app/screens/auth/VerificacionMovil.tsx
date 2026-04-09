import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig } from "@/config/firebaseConfig";
import { pacientesService } from "@/services/firebase";
import { phoneAuthService } from "@/services/firebase";
import { styles } from "@/styles/screens/auth/VerificacionMovilStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";

function VerificacionMovil() {
  const params = useLocalSearchParams<{
    cartilla: string;
    dni: string;
    nombre: string;
    tipo: string;
    telefono: string;
  }>();

  const recaptchaVerifier = useRef(null);

  const [TLF, setTLF] = useState("");
  const [Error, setError] = useState("");
  // ✅ Cambiado Verificar por loading para ser igual a IngresarCartilla
  const [loading, setLoading] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [segundosBloqueo, setSegundosBloqueo] = useState(0);

  // --- LÓGICA DE BLOQUEO TEMPORAL ---
  useEffect(() => {
    const revisarBloqueo = async () => {
      const stored = await AsyncStorage.getItem(`bloqueo_4digitos_${params.cartilla}`);
      if (stored) {
        const { expiracion } = JSON.parse(stored);
        const ahora = Date.now();
        if (ahora < expiracion) {
          setSegundosBloqueo(Math.round((expiracion - ahora) / 1000));
        } else {
          await AsyncStorage.removeItem(`bloqueo_4digitos_${params.cartilla}`);
        }
      }
    };
    if (params.cartilla) revisarBloqueo();
  }, [params.cartilla]);

  useEffect(() => {
    if (segundosBloqueo <= 0) return;
    const interval = setInterval(() => {
      setSegundosBloqueo(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [segundosBloqueo]);

  const cambios = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length <= 4) setTLF(cleaned);
  };

  const formatearTiempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${minutos}:${secs.toString().padStart(2, '0')}`;
  };

  // --- FUNCIÓN PRINCIPAL ---
  const aceptar = async () => {
    // ✅ Bloqueo de seguridad igual a IngresarCartilla
    if (loading || segundosBloqueo > 0) return;

    setLoading(true);
    setError("");

    try {
      console.log("🔍 Validando últimos 4 dígitos...");

      const VERIFICACION = await pacientesService.validarPorCartillaYTelefono(
        params.cartilla.trim(),
        TLF
      );

      if (!VERIFICACION.valido) {
        const nuevosIntentos = intentos + 1;
        setIntentos(nuevosIntentos);

        if (nuevosIntentos >= 3) {
          const expiracion = Date.now() + 60000;
          await AsyncStorage.setItem(
            `bloqueo_4digitos_${params.cartilla}`,
            JSON.stringify({ expiracion })
          );
          setSegundosBloqueo(60);
          setIntentos(0);
          setError(""); // Limpio para que se vea solo el timer
        } else {
          setError(`Dígitos incorrectos. Intento ${nuevosIntentos} de 3`);
        }
        setLoading(false);
        return;
      }

      console.log("🔐 Dígitos válidos, iniciando ReCAPTCHA...");

      try {
        const otpResult = await phoneAuthService.generarOTP(
          params.telefono,
          recaptchaVerifier.current
        );

        if (otpResult.exito) {
          console.log("✅ SMS enviado");
          router.push({
            pathname: "/screens/auth/VerificacionOTP",
            params: { ...params },
          });
        }
        // Nota: Si no hay éxito o se cancela, el 'finally' se encargará de quitar el loading
      } catch (e: any) {
        console.log(" ReCAPTCHA cancelado o error");
      }

    } catch (e: any) {
      console.log("⚠️ Error:", e.message);
      setError("Error de conexión");
    } finally {
      // ✅ Siempre quitamos el loading al terminar el proceso (igual que IngresarCartilla)
      setLoading(false);
    }
  };

  const cancelar = () => {
    // ✅ Si está cargando, no permitimos interactuar
    if (loading) return;

    Alert.alert(
      "¿Deseas salir?",
      "Al cerrar la sesión, perderás el progreso de tu identificación teniendo que iniciarlo de nuevo.",
      [
        {
          text: "Permanecer aquí",
          style: "cancel",
        },
        {
          text: "Salir",
          style: "destructive",
          // Usamos replace para limpiar el historial de navegación
          onPress: () => router.replace("/screens/auth/IngresarCartilla"),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true}
        languageCode="es"
      />

      <Text style={styles.title}>Ingresa los últimos 4 dígitos de tu teléfono</Text>

      <TextInput
        placeholder="••••"
        value={TLF}
        onChangeText={cambios}
        style={[
          styles.input,
        ]}
        secureTextEntry={true}
        maxLength={4}
        keyboardType="numeric"
      />

      {segundosBloqueo > 0 && (
        <Text style={styles.timerText}>
          Sistema bloqueado {segundosBloqueo}s
        </Text>
      )}

      {Error !== "" && segundosBloqueo === 0 && (
        <Text style={styles.error}>{Error}</Text>
      )}

      <View style={styles.VerificacionMovilContainer}>
        <Pressable
          style={[
            styles.button,
            (loading || TLF.length !== 4 || segundosBloqueo > 0) && {
              opacity: 0.5,
            },
          ]}
          onPress={aceptar}
          disabled={loading || TLF.length !== 4 || segundosBloqueo > 0}
        >
          <Text style={styles.buttonText}>
            {segundosBloqueo > 0
              ? `BLOQUEADO ${formatearTiempo(segundosBloqueo)}`
              : loading
                ? 'VALIDANDO...'
                : 'ACEPTAR'}
          </Text>
        </Pressable>

        <Pressable style={[styles.button, styles.buttonCancel]} onPress={cancelar} disabled={loading}>
          <Text style={styles.buttonText}>CANCELAR</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default VerificacionMovil;