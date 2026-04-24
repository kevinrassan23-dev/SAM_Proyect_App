import { supabase } from '@/config/supabaseClient';

export const descuentosService = {

  /**
   * Busca el porcentaje de descuento asociado a la categoría del paciente (ej: Pensionista)
   */
  async obtenerPorTipoPaciente(tipoPaciente: string): Promise<any | null> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] [descuentosService] Consultando beneficio para: ${tipoPaciente}`);
      
      const { data, error } = await supabase
        .from('Descuentos')
        .select('*')
        .eq('Tipo_Paciente', tipoPaciente)
        .single();

      if (error) {
        console.log(`[${new Date().toLocaleTimeString()}] [descuentosService] Sin descuentos específicos aplicables`);
        return { Porcentaje: 0, limite_mensual: null };
      }

      return data;
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [descuentosService] Error:`, error.message);
      return { Porcentaje: 0, limite_mensual: null };
    }
  },

  /**
   * Retorna el listado maestro de todas las categorías de descuento
   */
  async obtenerTodos(): Promise<any[]> {
    try {
      const { data, error } = await supabase.from('Descuentos').select('*');
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [descuentosService] Error al listar descuentos:`, error.message);
      return [];
    }
  }
};