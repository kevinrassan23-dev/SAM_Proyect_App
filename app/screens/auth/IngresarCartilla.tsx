import { pacientesService } from '@/services/firebase';
import { styles } from '@/styles/screens/auth/IngresarCartillaStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Pressable, TextInput, View } from 'react-native';
import { Text } from 'react-native-paper';

function IngresarCartilla() {
  const [ultimos4, setUltimos4] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [segundosBloqueo, setSegundosBloqueo] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const MAX_INTENTOS = 3;
  const TIEMPO_BLOQUEO = 60;
  const { t } = useTranslation();

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
        console.error(`[${new Date().toLocaleTimeString()}] Error:`, err);
      }
    };

    revisarBloqueo();
  }, []);

  // ✅ ACTUALIZADO: Timer con reseteo de intentos
  useEffect(() => {
    if (segundosBloqueo <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSegundosBloqueo(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);

          // ✅ Cuando se cumple el bloqueo, resetear intentos
          setIntentos(0);
          guardarIntentos(0);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [segundosBloqueo]);

  useEffect(() => {
    const cargarIntentos = async () => {
      try {
        const stored = await AsyncStorage.getItem('intentos_cartilla');
        if (stored) {
          setIntentos(parseInt(stored, 10));
        }
      } catch (err) {
        console.error(`[${new Date().toLocaleTimeString()}] Error:`, err);
      }
    };

    cargarIntentos();

    if (inputRef.current && segundosBloqueo === 0) {
      inputRef.current.focus();
    }
  }, [segundosBloqueo]);

  const guardarIntentos = async (nuevoIntento: number) => {
    try {
      await AsyncStorage.setItem('intentos_cartilla', nuevoIntento.toString());
    } catch (err) {
      console.error(`[${new Date().toLocaleTimeString()}] Error:`, err);
    }
  };

  const handleValidar = async () => {
    setError('');

    if (segundosBloqueo > 0) {
      setError(`${t("IngresarCartilla.ERROR1")} ${formatearTiempo(segundosBloqueo)}`);
      return;
    }

    if (ultimos4.length !== 4) {
      setError(t("IngresarCartilla.ERROR2"));
      return;
    }

    setLoading(true);

    try {
      console.log(`[${new Date().toLocaleTimeString()}] Buscando cartilla...`);

      const paciente = await pacientesService.obtenerPorUltimos4Digitos(ultimos4);

      if (!paciente) {
        const nuevoIntento = intentos + 1;
        setIntentos(nuevoIntento);
        await guardarIntentos(nuevoIntento);
        setUltimos4('');

        if (nuevoIntento >= MAX_INTENTOS) {
          const expiracion = Date.now() + TIEMPO_BLOQUEO * 1000;
          await AsyncStorage.setItem(
            'bloqueo_cartilla',
            JSON.stringify({ expiracion })
          );
          setSegundosBloqueo(TIEMPO_BLOQUEO);
        } else {
          setError(`${t("IngresarCartilla.ERROR31")} ${nuevoIntento} ${t("IngresarCartilla.ERROR32")}`);
        }

        setLoading(false);
        return;
      }

      console.log(`[${new Date().toLocaleTimeString()}] Cartilla encontrada:`, paciente.Nombre_Paciente);

      await AsyncStorage.removeItem('intentos_cartilla');
      await AsyncStorage.removeItem('bloqueo_cartilla');
      setIntentos(0);

      if (!paciente.Num_Telefono || !paciente.Num_Telefono.trim()) {
        console.log(`[${new Date().toLocaleTimeString()}] Sin teléfono, a Hall`);

        const { recetasService } = await import('@/services/firebase');
        const medicamentosRecetaData = await recetasService.obtenerMedicamentosReceta(
          paciente.DNI
        );

        const nombresMedicamentos = medicamentosRecetaData
          .map((m: any) => m.nombre)
          .filter((nombre: string) => nombre && nombre.trim() !== '');

        router.push({
          pathname: '/screens/shop/Hall',
          params: {
            dni: paciente.DNI,
            nombre: paciente.Nombre_Paciente,
            tipo: paciente.Tipo_Paciente,
            cartilla: paciente.Num_Cartilla,
            telefono: '',
            tieneReceta: medicamentosRecetaData.length > 0 ? 'true' : 'false',
            medicamentosReceta: nombresMedicamentos.join(','),
          },
        });
        return;
      }

      console.log(`[${new Date().toLocaleTimeString()}] A verificación de teléfono`);

      router.push({
        pathname: '/screens/auth/VerificacionMovil',
        params: {
          dni: paciente.DNI,
          nombre: paciente.Nombre_Paciente,
          tipo: paciente.Tipo_Paciente,
          cartilla: paciente.Num_Cartilla,
          telefono: paciente.Num_Telefono,
        },
      });

    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error:', error.message`);
      setError(t("IngresarCartilla.ERROR4"));
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    router.push('/screens/shop/Hall');
  };

  const formatearTiempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${minutos}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("IngresarCartilla.INGRESAR")}</Text>

      <TextInput
        ref={inputRef}
        placeholder={t("IngresarCartilla.EJ")}
        value={ultimos4}
        onChangeText={text => setUltimos4(text.toUpperCase())}
        style={[
          styles.input,
        ]}
        maxLength={4}
        editable={!loading}
        placeholderTextColor="#ccc"
      />

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {segundosBloqueo > 0 && (
        <Text style={styles.timerText}>{t("IngresarCartilla.BLOQUEADO")} {segundosBloqueo}s
        </Text>
      )}

      <View style={styles.VerificacionMovilContainer}>
        <Pressable
          style={[
            styles.button,
            (loading || ultimos4.length !== 4 || segundosBloqueo > 0) && {
              opacity: 0.5,
            },
          ]}
          onPress={handleValidar}
          disabled={loading || ultimos4.length !== 4 || segundosBloqueo > 0}
        >
          <Text style={styles.buttonText}>
            {segundosBloqueo > 0
              ? `${t("IngresarCartilla.BLOQ")} ${formatearTiempo(segundosBloqueo)}`
              : loading
                ? t("IngresarCartilla.VALIDANDO")
                : t("IngresarCartilla.ACEPTAR")}
          </Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleVolver} disabled={loading}>
          <Text style={styles.buttonText}>{t("IngresarCartilla.VOLVER")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default IngresarCartilla;