// ============================================
// app/screens/VerificacionContraseña.tsx
// ============================================

import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { styles } from "@/styles/IngresarCartillaStyle";
import { pacientesService } from "@/services/firebase/pacientes.service";
import { recetasService } from "@/services/firebase/recetas.service";
import { validacionService } from "@/services/firebase/validacion.service";

function VerificacionContraseña() {
  const { cartilla } = useLocalSearchParams<{ cartilla: string }>();
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!cartilla) {
      Alert.alert("Error", "No se recibió la cartilla. Por favor, vuelve atrás.");
      router.back();
    }
  }, [cartilla]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleValidar = async () => {
    setError("");

    if (!cartilla) {
      setError("Error: Cartilla no encontrada");
      return;
    }

    if (!contraseña.trim()) {
      setError("Por favor ingresa la contraseña");
      return;
    }

    const validacionCartilla = validacionService.validarFormatoCartilla(cartilla);
    if (!validacionCartilla.valido) {
      setError(validacionCartilla.error);
      return;
    }

    const validacionContraseña = validacionService.validarFormatoContraseña(contraseña);
    if (!validacionContraseña.valido) {
      setError(validacionContraseña.error);
      return;
    }

    setLoading(true);
    try {
      console.log("🔐 Validando contraseña...");
      console.log("Cartilla:", cartilla);

      const resultado = await pacientesService.validarPorCartillaYContraseña(
        cartilla,
        contraseña
      );

      if (!resultado.valido) {
        setError(resultado.error || "Validación fallida");
        setContraseña("");
        setLoading(false);
        return;
      }

      const paciente = resultado.paciente;
      const nombre = paciente.Nombre_Paciente.split(" ")[0];

      console.log("✅ Validación exitosa:", nombre);

      // ✅ NUEVO: Obtener medicamentos de receta directamente
      console.log("💊 Obteniendo medicamentos de receta para DNI:", paciente.DNI);
      
      const medicamentosRecetaData = await recetasService.obtenerMedicamentosReceta(paciente.DNI);
      
      console.log("💊 Medicamentos de receta obtenidos:", medicamentosRecetaData);
      console.log("📊 Total medicamentos:", medicamentosRecetaData.length);

      // ✅ IMPORTANTE: Extraer solo los nombres
      const nombresMedicamentos = medicamentosRecetaData
        .map(m => m.nombre)
        .filter(nombre => nombre && nombre.trim() !== "");

      console.log("📝 Nombres de medicamentos:", nombresMedicamentos);
      console.log("🔗 String final:", nombresMedicamentos.join(","));

      const tieneRecetaActiva = medicamentosRecetaData.length > 0;

      console.log("📋 ¿Tiene receta?:", tieneRecetaActiva);

      Alert.alert(
        "✅ Bienvenido",
        `Hola, ${nombre} 👋`,
        [
          {
            text: "OK",
            onPress: () => {
              // ✅ Pasar medicamentosReceta correctamente
              router.push({
                pathname: "/screens/Hall",
                params: {
                  dni: paciente.DNI,
                  nombre: paciente.Nombre_Paciente,
                  tipo: paciente.Tipo_Paciente,
                  cartilla: paciente.Num_Cartilla,
                  tieneReceta: tieneRecetaActiva ? "true" : "false",
                  medicamentosReceta: nombresMedicamentos.length > 0 
                    ? nombresMedicamentos.join(",") 
                    : "",
                }
              });
            }
          }
        ]
      );

    } catch (error: any) {
      console.error("❌ Error:", error);
      setError(error.message || "Error en la validación");
    } finally {
      setLoading(false);
    }
  };

  const volver = () => {
    // ✅ Volver a VerificacionChoice PASANDO la cartilla
    router.push({
      pathname: "/screens/VerificacionChoice",
      params: { cartilla: cartilla?.trim() || "" }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Ingresa tu contraseña (4 dígitos)
      </Text>

      <TextInput
        ref={inputRef}
        placeholder="••••"
        value={contraseña}
        onChangeText={setContraseña}
        style={styles.input}
        maxLength={4}
        keyboardType="numeric"
        editable={!loading}
        secureTextEntry={true}
      />

      {error !== "" && (
        <Text style={styles.error}>{error}</Text>
      )}

      <View style={{ flexDirection: "column", gap: 8, width: "100%", alignItems: "center" }}>
        <Pressable style={styles.button} onPress={handleValidar} disabled={loading || contraseña.length !== 4}>
          <Text style={styles.buttonText}>
            {loading ? "Validando..." : "ACEPTAR"}
          </Text>
        </Pressable>

        <Pressable style={styles.buttonVolver} onPress={volver} disabled={loading}>
          <Text style={styles.buttonText}>
            VOLVER
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default VerificacionContraseña;