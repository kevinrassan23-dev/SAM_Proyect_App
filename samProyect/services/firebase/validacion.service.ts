// ============================================
// services/firebase/validacion.service.ts
// ============================================

import { pacientesService } from './pacientes.service';
import { recetasService } from './recetas.service';
import { medicamentosService } from '@/services/supabase/medicamentos.service';
import { descuentosService } from '@/services/supabase/descuentos.service';

export const validacionService = {

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