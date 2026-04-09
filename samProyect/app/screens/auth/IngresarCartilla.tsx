import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '@/styles/screens/auth/IngresarCartillaStyle';
import { pacientesService } from '@/services/firebase';

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
        console.error('❌ Error:', err);
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
        console.error('❌ Error:', err);
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
      console.error('❌ Error:', err);
    }
  };

  const handleValidar = async () => {
    setError('');

    if (segundosBloqueo > 0) {
      setError(`Sistema bloqueado. Intenta en ${formatearTiempo(segundosBloqueo)}`);
      return;
    }

    if (ultimos4.length !== 4) {
      setError('Ingresa exactamente 4 dígitos');
      return;
    }

    setLoading(true);

    try {
      console.log('🔍 Buscando cartilla...');

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
          setError(
            `Cartilla no encontrada. Intento ${nuevoIntento} de 3.`
          );
        }

        setLoading(false);
        return;
      }

      console.log('✅ Cartilla encontrada:', paciente.Nombre_Paciente);

      await AsyncStorage.removeItem('intentos_cartilla');
      await AsyncStorage.removeItem('bloqueo_cartilla');
      setIntentos(0);

      if (!paciente.Num_Telefono || !paciente.Num_Telefono.trim()) {
        console.log('⚠️ Sin teléfono, a Hall');

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

      console.log('📱 A verificación de teléfono');

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
      console.error('❌ Error:', error.message);
      setError('Error en la búsqueda');
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
      <Text style={styles.title}>Ingresa los últimos 4 dígitos de tu cartilla</Text>

      <TextInput
        ref={inputRef}
        placeholder="Ej: 123A"
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
        <Text style={styles.timerText}>
          Sistema bloqueado {segundosBloqueo}s
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
              ? `BLOQUEADO ${formatearTiempo(segundosBloqueo)}`
              : loading
                ? 'VALIDANDO...'
                : 'ACEPTAR'}
          </Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleVolver} disabled={loading}>
          <Text style={styles.buttonText}>VOLVER</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default IngresarCartilla;