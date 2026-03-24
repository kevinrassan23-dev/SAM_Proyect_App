// ============================================
// app/screens/VerificacionMovil.tsx
// ============================================

import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { Pressable, Text, TextInput, View, Alert } from "react-native";
import { pacientesService } from "@/services/firebase/pacientes.service";
import { recetasService } from "@/services/firebase/recetas.service";
import { styles } from "../../styles/VerificacionMovilStyle";

function VerificacionMovil() {
  const { cartilla } = useLocalSearchParams<{ cartilla: string }>();

  const [TLF, setTLF] = useState("");
  const [Error, setError] = useState("");
  const [Verificar, setVerificar] = useState(false);

  // ✅ Validar que cartilla existe
  useEffect(() => {
    console.log("📋 VerificacionMovil - Cartilla recibida:", cartilla);
    if (!cartilla || cartilla.trim() === "") {
      Alert.alert("Error", "No se recibió la cartilla. Por favor, vuelve atrás.");
      router.back();
    }
  }, [cartilla]);

  const cambios = (text: string) => {
    // ✅ Solo permitir números y máximo 4 caracteres
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length <= 4) {
      setTLF(cleaned);
    }
  };

  const aceptar = async () => {
    setVerificar(true);
    setError("");

    // ✅ Validar que ingresó 4 dígitos
    if (TLF.length !== 4) {
      setError("Por favor ingresa exactamente 4 dígitos");
      setVerificar(false);
      return;
    }

    if (!cartilla || cartilla.trim() === "") {
      setError("Error: Cartilla no encontrada");
      setVerificar(false);
      return;
    }

    try {
      console.log("🔐 Validando Cartilla + Teléfono");
      console.log("Cartilla:", cartilla);
      console.log("Últimos 4 dígitos:", TLF);

      // ✅ Validar cartilla y teléfono
      const VERIFICACION = await pacientesService.validarPorCartillaYTelefono(
        cartilla.trim(),
        TLF
      );

      if (!VERIFICACION.valido) {
        setError("No se ha podido verificar su número de teléfono, intentelo de nuevo");
        setVerificar(false);
        return;
      }

      const paciente = VERIFICACION.paciente;
      const nombre = paciente.Nombre_Paciente.split(" ")[0];

      console.log("✅ Validación exitosa:", nombre);

      // ✅ Obtener medicamentos de receta
      console.log("💊 Obteniendo medicamentos de receta para DNI:", paciente.DNI);

      const medicamentosRecetaData = await recetasService.obtenerMedicamentosReceta(
        paciente.DNI
      );

      console.log("💊 Medicamentos de receta obtenidos:", medicamentosRecetaData);

      const nombresMedicamentos = medicamentosRecetaData
        .map(m => m.nombre)
        .filter(nombre => nombre && nombre.trim() !== "");

      console.log("📝 Nombres de medicamentos:", nombresMedicamentos);

      const tieneRecetaActiva = medicamentosRecetaData.length > 0;

      console.log("📋 ¿Tiene receta?:", tieneRecetaActiva);

      // ✅ Mostrar alert
      Alert.alert(
        "✅ Bienvenido",
        `Hola, ${nombre} 👋`,
        [
          {
            text: "OK",
            onPress: () => {
              // ✅ Navegar a Hall con todos los parámetros
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

    } catch (e: any) {
      console.error("❌ Error:", e.message);
      setError(e.message || "Error en la verificación");
    } finally {
      setVerificar(false);
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
      <Text style={styles.title}>Ingresa los últimos 4 dígitos de tu número de teléfono</Text>

      <View style={styles.view1} />

      <TextInput
        placeholder="••••"
        value={TLF}
        onChangeText={cambios}
        style={styles.input}
        secureTextEntry={true}
        maxLength={4}
        keyboardType="numeric"
        editable={!Verificar}
      />

      {Error !== "" && (
        <Text style={styles.error}>{Error}</Text>
      )}

      <View style={styles.view2} />

      <View style={styles.VerificacionMovilContainer}>
        <Pressable
          style={styles.button}
          onPress={aceptar}
          disabled={Verificar || TLF.length !== 4}
        >
          <Text style={styles.buttonText}>
            {Verificar ? "VERIFICANDO..." : "ACEPTAR"}
          </Text>
        </Pressable>

        <Pressable style={[styles.buttonVolver]} onPress={volver} disabled={Verificar}>
          <Text style={styles.buttonText}>VOLVER</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default VerificacionMovil;