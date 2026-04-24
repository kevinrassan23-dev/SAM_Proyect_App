import { pacientesService } from '@/services/firebase';
import { styles } from '@/styles/screens/auth/IngresarCartillaStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import "@/language/config/ConfigIdiomas";
import { Pressable, TextInput, View, Image } from 'react-native';
import { Text } from 'react-native-paper';

function IngresarCartilla() {
  // --- ESTADOS Y REFERENCIAS ---
  const [digitos16, setDigitos16] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [segundosBloqueo, setSegundosBloqueo] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const MAX_INTENTOS = 3;
  const TIEMPO_BLOQUEO = 60;
  const { t } = useTranslation();

  // --- EFECTOS DE INICIALIZACIÓN Y BLOQUEO ---

  /** Recupera el estado de bloqueo almacenado en disco */
  useEffect(() => {
    const revisarBloqueo = async () => {
      try {
        const stored = await AsyncStorage.getItem('bloqueo_cartilla');
        if (stored) {
          const { expiracion } = JSON.parse(stored);
          const ahora = Date.now();
          if (ahora < expiracion) {
            setSegundosBloqueo(Math.round((expiracion - ahora) / 1000));
          } else {
            await AsyncStorage.removeItem('bloqueo_cartilla');
          }
        }
      } catch (err) {
        console.error(`[${new Date().toLocaleTimeString()}] Error AsyncStorage:`, err);
      }
    };
    revisarBloqueo();
  }, []);

  /** Maneja el contador regresivo del bloqueo temporal */
  useEffect(() => {
    if (segundosBloqueo <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setSegundosBloqueo(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIntentos(0);
          guardarIntentos(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [segundosBloqueo]);

  /** Carga intentos previos y enfoca el input al desbloquear */
  useEffect(() => {
    const cargarIntentos = async () => {
      const stored = await AsyncStorage.getItem('intentos_cartilla');
      if (stored) setIntentos(parseInt(stored, 10));
    };
    cargarIntentos();
    if (inputRef.current && segundosBloqueo === 0) inputRef.current.focus();
  }, [segundosBloqueo]);

  const guardarIntentos = async (num: number) => {
    await AsyncStorage.setItem('intentos_cartilla', num.toString());
  };

  /** Procesa la búsqueda del paciente en Firebase y redirige según perfil */
  const handleValidar = async () => {
    setError('');
    const ts = new Date().toLocaleTimeString();
    if (segundosBloqueo > 0 || digitos16.length !== 16) return;

    setLoading(true);
    try {
      console.log(`[${ts}] Validando cartilla: ${digitos16}`);
      const paciente = await pacientesService.obtenerCartillaCompleta(digitos16);

      if (!paciente) {
        // Lógica de fallo de intentos
        const nuevoIntento = intentos + 1;
        setIntentos(nuevoIntento);
        await guardarIntentos(nuevoIntento);
        if (nuevoIntento >= MAX_INTENTOS) {
          const exp = Date.now() + TIEMPO_BLOQUEO * 1000;
          await AsyncStorage.setItem('bloqueo_cartilla', JSON.stringify({ expiracion: exp }));
          setSegundosBloqueo(TIEMPO_BLOQUEO);
        } else {
          setError(`${t("IngresarCartilla.ERROR31")} ${nuevoIntento} / ${MAX_INTENTOS}`);
        }
        setLoading(false);
        return;
      }

      // Éxito: Navegación según disponibilidad de teléfono
      console.log(`[${ts}] Paciente localizado: ${paciente.Nombre_Paciente}`);
      await AsyncStorage.removeItem('intentos_cartilla');
      
      if (!paciente.Num_Telefono?.trim()) {
        console.log(`[${ts}] Sin teléfono vinculado, acceso directo.`);
        router.push({ pathname: '/screens/home/Home', params: { dni: paciente.DNI, nombre: paciente.Nombre_Paciente, cartilla: paciente.Num_Cartilla } });
      } else {
        router.push({ pathname: '/screens/auth/VerificacionMovil', params: { ...paciente, cartilla: paciente.Num_Cartilla, telefono: paciente.Num_Telefono } });
      }
    } catch (e: any) {
      console.error(`[${ts}] Error servicio:`, e.message);
      setError(t("IngresarCartilla.ERROR4"));
    } finally {
      setLoading(false);
    }
  };

  const formatearTiempo = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  // --- ESTRUCTURA DE INTERFAZ (UI) ---
  return (
    <View style={styles.container}>
      {/* Encabezado e Imagen descriptiva */}
      <Text style={styles.title}>{t("IngresarCartilla.INGRESAR")}</Text>
      <Image 
        source={require('@/assets/images/Tarjeta-sanitaria.png')} 
        style={{ width: '85%', height: 160, resizeMode: 'contain', marginBottom: 24 }} 
      />

      {/* Campo de entrada de texto */}
      <TextInput
        ref={inputRef}
        placeholder={t("Ej: BBBBBBBBB1234567")}
        value={digitos16}
        onChangeText={text => setDigitos16(text.toUpperCase())}
        style={styles.input}
        maxLength={16}
        editable={!loading}
      />

      {/* Mensajes de feedback (Error o Bloqueo) */}
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      {segundosBloqueo > 0 && <Text style={styles.timerText}>{t("IngresarCartilla.BLOQUEADO")} {segundosBloqueo}s</Text>}

      {/* Botonera de navegación */}
      <View style={styles.VerificacionMovilContainer}>
        <Pressable 
          style={[styles.button, (loading || digitos16.length !== 16 || segundosBloqueo > 0) && { opacity: 0.5 }]} 
          onPress={handleValidar} 
          disabled={loading || digitos16.length !== 16 || segundosBloqueo > 0}
        >
          <Text style={styles.buttonText}>
            {segundosBloqueo > 0 ? `${t("IngresarCartilla.BLOQ")} ${formatearTiempo(segundosBloqueo)}` : loading ? t("IngresarCartilla.VALIDANDO") : t("IngresarCartilla.ACEPTAR")}
          </Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => router.push('/screens/home/Home')} disabled={loading}>
          <Text style={styles.buttonText}>{t("IngresarCartilla.VOLVER")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default IngresarCartilla;