// ============================================
// services/firebase/validacion.service.ts
// ============================================

import { descuentosService } from '@/services/supabase/descuentos.service';
import { pacientesService } from './pacientes.service';
import { recetasService } from './recetas.service';

export const validacionService = {

  // ✅ NUEVA: Validar formato de cartilla (8 números + 1 letra)
  validarFormatoCartilla(cartilla: string): { valido: boolean; error?: string } {
    if (!cartilla || !cartilla.trim()) {
      return { valido: false, error: "La cartilla no puede estar vacía" };
    }

    const cartillaLimpia = cartilla.trim().toUpperCase();
    const regex = /^[0-9]{8}[A-Z]$/;

    if (!regex.test(cartillaLimpia)) {
      return { 
        valido: false, 
        error: "Formato inválido. Debe ser: 8 números + 1 letra (ej: 12345678P)" 
      };
    }

    return { valido: true };
  },

  // ✅ NUEVA: Validar formato de DNI (8 números + 1 letra con validación)
  validarFormatoDNI(dni: string): { valido: boolean; error?: string } {
    if (!dni || !dni.trim()) {
      return { valido: false, error: "El DNI no puede estar vacío" };
    }

    const dniLimpio = dni.trim().toUpperCase();
    const regex = /^[0-9]{8}[A-Z]$/;

    if (!regex.test(dniLimpio)) {
      return { 
        valido: false, 
        error: "Formato inválido. Debe ser: 8 números + 1 letra (ej: 12345678Z)" 
      };
    }

    // ✅ Validar letra correcta del DNI
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    const numero = parseInt(dniLimpio.substring(0, 8));
    const letraCorrecta = letras[numero % 23];

    if (dniLimpio[8] !== letraCorrecta) {
      return { 
        valido: false, 
        error: "DNI inválido: la letra no es correcta" 
      };
    }

    return { valido: true };
  },

  // ✅ NUEVA: Validar formato de teléfono
  validarFormatoTelefono(telefono: string): { valido: boolean; error?: string } {
    if (!telefono || !telefono.trim()) {
      return { valido: false, error: "El teléfono no puede estar vacío" };
    }

    const telefonoLimpio = telefono.trim().replace(/\s/g, "");
    const regex = /^[0-9]{9,15}$/;

    if (!regex.test(telefonoLimpio)) {
      return { 
        valido: false, 
        error: "Formato inválido. Debe ser un número de 9 a 15 dígitos" 
      };
    }

    return { valido: true };
  },

  // ✅ NUEVA: Validar contraseña dispensador (4 dígitos)
  validarFormatoContraseña(contraseña: string): { valido: boolean; error?: string } {
    if (!contraseña || !contraseña.trim()) {
      return { valido: false, error: "La contraseña no puede estar vacía" };
    }

    const contraseñaLimpia = contraseña.trim();
    const regex = /^[0-9]{4}$/;

    if (!regex.test(contraseñaLimpia)) {
      return { 
        valido: false, 
        error: "Formato inválido. Debe ser exactamente 4 dígitos" 
      };
    }

    return { valido: true };
  },

  // ✅ EXISTENTE: Validar paciente completo
  async validarPacienteCompleto(dni: string, cartilla: string, telefono: string): Promise<{
    valido: boolean;
    paciente?: any;
    mensaje: string;
  }> {
    try {
      console.log("🔍 Validando paciente completo");

      const resultado = await pacientesService.validarPacienteCompleto(dni, cartilla, telefono);

      if (!resultado.valido) {
        return {
          valido: false,
          mensaje: resultado.error || 'Validación fallida'
        };
      }

      console.log("✅ Paciente validado correctamente");
      return {
        valido: true,
        paciente: resultado.paciente,
        mensaje: 'Paciente validado correctamente'
      };

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return {
        valido: false,
        mensaje: error.message
      };
    }
  },

  // ✅ EXISTENTE: Obtener datos completos del paciente
  async obtenerDatosPaciente(dni: string): Promise<{
    paciente?: any;
    recetas?: any[];
    descuento?: any;
    tieneReceta?: boolean;
    error?: string;
  }> {
    try {
      console.log("📊 Obteniendo datos completos del paciente");

      const paciente = await pacientesService.obtenerPorDNI(dni);
      if (!paciente) {
        return { error: 'Paciente no encontrado' };
      }

      const recetas = await recetasService.obtenerPorDNI(dni);
      const tieneReceta = recetas.length > 0;

      const descuento = await descuentosService.obtenerPorTipoPaciente(paciente.Tipo_Paciente);

      return {
        paciente,
        recetas,
        descuento,
        tieneReceta
      };

    } catch (error: any) {
      return { error: error.message };
    }
  },

  // ✅ EXISTENTE: Validar medicamento para paciente
  async validarMedicamentoParaPaciente(
    dni: string,
    medicamentoId: string,
    requiereReceta: boolean
  ): Promise<{
    puedeComprar: boolean;
    razon?: string;
  }> {
    try {
      console.log("💊 Validando medicamento para paciente");

      if (!requiereReceta) {
        console.log("✅ Medicamento sin receta");
        return { puedeComprar: true };
      }

      const tieneReceta = await recetasService.tieneRecetaActiva(dni);

      if (!tieneReceta) {
        return {
          puedeComprar: false,
          razon: 'Este medicamento requiere receta. El paciente no tiene recetas activas.'
        };
      }

      console.log("✅ Medicamento autorizado");
      return { puedeComprar: true };

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return {
        puedeComprar: false,
        razon: error.message
      };
    }
  }
};