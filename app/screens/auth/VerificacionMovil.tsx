import { firebaseConfig } from "@/config/firebaseConfig";
import { pacientesService, phoneAuthService } from "@/services/firebase";
import { styles } from "@/styles/screens/auth/VerificacionMovilStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

function VerificacionMovil() {
  const params = useLocalSearchParams<{
    cartilla: string;
    dni: string;
    nombre: string;
    tipo: string;
    telefono: string;
  }>();

  const { t } = useTranslation();
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
      console.log(`[${new Date().toLocaleTimeString()}] Validando últimos 4 dígitos...`);

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
          setError(`${t("VerificacionMovil.ERROR1")} ${nuevosIntentos} ${t("VerificacionMovil.ERROR12")}`);
        }
        setLoading(false);
        return;
      }

      console.log(`[${new Date().toLocaleTimeString()}] Dígitos válidos, iniciando ReCAPTCHA...`);

      try {
        const otpResult = await phoneAuthService.generarOTP(
          params.telefono,
          recaptchaVerifier.current
        );

        if (otpResult.exito) {
          console.log(`[${new Date().toLocaleTimeString()}] SMS enviado`);
          router.push({
            pathname: "/screens/auth/VerificacionOTP",
            params: { ...params },
          });
        }
        // Nota: Si no hay éxito o se cancela, el 'finally' se encargará de quitar el loading
      } catch (e: any) {
        console.log(`[${new Date().toLocaleTimeString()}] ReCAPTCHA cancelado o error`);
      }

    } catch (e: any) {
      console.log(`[${new Date().toLocaleTimeString()}] Error:`, e.message);
      setError(t("VerificacionMovil.ERROR2"));
    } finally {
      // ✅ Siempre quitamos el loading al terminar el proceso (igual que IngresarCartilla)
      setLoading(false);
    }
  };

  const cancelar = () => {
    // ✅ Si está cargando, no permitimos interactuar
    if (loading) return;

    Alert.alert(
      t("VerificacionMovil.DESEASSALIR"),
      t("VerificacionMovil.PERDERPROGRESO"),
      [
        {
          text: t("VerificacionMovil.PERMANECERAQUÍ"),
          style: "cancel",
        },
        {
          text: t("VerificacionMovil.SALIR"),
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

      <Text style={styles.title}>{t("VerificacionMovil.INGRESAR")}</Text>

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
          {t("VerificacionMovil.BLOQUEADO")} {segundosBloqueo}s
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
              ? `${t("VerificacionMovil.BLOQ")} ${formatearTiempo(segundosBloqueo)}`
              : loading
                ? t("VerificacionMovil.VALIDANDO")
                : t("VerificacionMovil.ACEPTAR")}
          </Text>
        </Pressable>

        <Pressable style={[styles.button, styles.buttonCancel]} onPress={cancelar} disabled={loading}>
          <Text style={styles.buttonText}>{t("VerificacionMovil.CANCELAR")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default VerificacionMovil;