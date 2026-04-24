import { descuentosService } from '@/services/supabase/descuentos';
import { pacientesService } from './pacientes';
import { recetasService } from './recetas';

export const validacionService = {

  /**
   * Valida formato de cartilla: 8 dígitos + 1 letra
   */
  validarFormatoCartilla(cartilla: string): { valido: boolean; error: string } {
    if (!cartilla?.trim()) return { valido: false, error: "Campo obligatorio" };
    const regex = /^[0-9]{8}[A-Z]$/;
    return regex.test(cartilla.trim().toUpperCase()) 
      ? { valido: true, error: "" } 
      : { valido: false, error: "Formato: 8 números + 1 letra" };
  },

  /**
   * Valida PIN/Contraseña de 4 dígitos
   */
  validarFormatoContraseña(pass: string): { valido: boolean; error: string } {
    if (!pass?.trim()) return { valido: false, error: "Campo obligatorio" };
    const regex = /^[0-9]{4}$/;
    return regex.test(pass.trim()) 
      ? { valido: true, error: "" } 
      : { valido: false, error: "Debe ser de 4 dígitos" };
  },

  /**
   * Recopila toda la información necesaria del paciente en una sola llamada
   */
  async obtenerDatosPacienteCompleto(dni: string): Promise<any> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] [validacionService] Recopilando perfil completo DNI: ${dni}`);

      const paciente = await pacientesService.obtenerPorDNI(dni);
      if (!paciente) return { error: 'Paciente no encontrado' };

      const [recetas, medicamentosReceta, descuento] = await Promise.all([
        recetasService.obtenerPorDNI(dni),
        recetasService.obtenerMedicamentosReceta(dni),
        descuentosService.obtenerPorTipoPaciente(paciente.Tipo_Paciente)
      ]);

      return {
        paciente,
        recetas,
        medicamentosReceta,
        descuento,
        tieneReceta: recetas.length > 0
      };
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [validacionService] Error:`, error.message);
      return { error: error.message };
    }
  }
};