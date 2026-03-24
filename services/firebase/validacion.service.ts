// ============================================
// services/firebase/validacion.service.ts (COMPLETO)
// ============================================

import { pacientesService } from './pacientes.service';
import { recetasService } from './recetas.service';
import { descuentosService } from '@/services/supabase/descuentos.service';

export const validacionService = {

  validarFormatoCartilla(cartilla: string): { valido: boolean; error: string } {
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

    return { valido: true, error: "" };
  },

  validarFormatoContraseña(contraseña: string): { valido: boolean; error: string } {
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

    return { valido: true, error: "" };
  },

  // ✅ NUEVO: Obtener datos completos del paciente
  async obtenerDatosPacienteCompleto(dni: string): Promise<{
    paciente?: any;
    recetas?: any[];
    medicamentosReceta?: string[];
    descuento?: any;
    tieneReceta?: boolean;
    error?: string;
  }> {
    try {
      console.log("📊 Obteniendo datos completos del paciente:", dni);

      const paciente = await pacientesService.obtenerPorDNI(dni);
      if (!paciente) {
        return { error: 'Paciente no encontrado' };
      }

      const recetas = await recetasService.obtenerPorDNI(dni);
      const tieneReceta = recetas.length > 0;
      const medicamentosReceta = await recetasService.obtenerMedicamentosReceta(dni);
      const descuento = await descuentosService.obtenerPorTipoPaciente(paciente.Tipo_Paciente);

      return {
        paciente,
        recetas,
        medicamentosReceta,
        descuento,
        tieneReceta
      };

    } catch (error: any) {
      return { error: error.message };
    }
  }
};