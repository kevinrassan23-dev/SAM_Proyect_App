import { supabase } from '@/config/supabaseClient';

export interface Medicamento {
  id: string;
  nombre: string;
  marca: string;
  precio: number;
  familia: string;
  descripcion?: string;
  stock?: number;
  tipo: string[];
  img_medicamento?: string;
}

/**
 * Normaliza los nombres de campos de la base de datos a la interfaz de la aplicación
 */
const mapearMedicamento = (m: any): Medicamento => ({
  id: m.ID_Medicamento,
  nombre: m.Nombre,
  marca: m.Marca,
  precio: parseFloat(m.Precio),
  familia: m.Familia,
  descripcion: m.Descripcion,
  stock: m.Stock,
  tipo: typeof m.Tipo === 'string' ? [m.Tipo] : (m.Tipo || []),
  img_medicamento: m.img_medicamento,
});

export const medicamentosService = {

  /**
   * Obtiene todos los medicamentos marcados como activos
   */
  async obtenerTodos(): Promise<Medicamento[]> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] [medicamentosService] Cargando catálogo completo...`);
      const { data, error } = await supabase.from('Medicamentos').select('*').eq('Activo', true);

      if (error) throw error;
      return (data || []).map(mapearMedicamento);
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [medicamentosService] Error:`, error.message);
      return [];
    }
  },

  /**
   * Filtra medicamentos de venta libre
   */
  async obtenerSinReceta(): Promise<Medicamento[]> {
      try {
        const { data, error } = await supabase
          .from('Medicamentos')
          .select('*')
          .eq('Activo', true)
          .ilike('Tipo', '%sin_receta%'); 
        if (error) throw error;
        return (data || []).map(mapearMedicamento);
      } catch (error: any) {
        console.error(`[${new Date().toLocaleTimeString()}] [medicamentosService] Error en consulta sin receta:`, error.message);
        return [];
      }
  },

  /**
   * Filtra medicamentos con receta
   */
  async obtenerConReceta(): Promise<Medicamento[]> {
      try {
        const { data, error } = await supabase
          .from('Medicamentos')
          .select('*')
          .eq('Activo', true)
          .ilike('Tipo', '%con_receta%'); // ← texto parcial
        if (error) throw error;
        return (data || []).map(mapearMedicamento);
      } catch (error: any) {
        console.error(`[${new Date().toLocaleTimeString()}] [medicamentosService] Error en consulta con receta:`, error.message);
        return [];
      }
  },

  /**
   * Actualiza el inventario restando la cantidad vendida
   */
  async actualizarStock(id: string, cantidadARestar: number): Promise<void> {
    try {
      const { data, error: fetchError } = await supabase
        .from('Medicamentos')
        .select('Stock')
        .eq('ID_Medicamento', id)
        .single();

      if (fetchError) throw fetchError;

      const nuevoStock = (data.Stock || 0) - cantidadARestar;

      const { error: updateError } = await supabase
        .from('Medicamentos')
        .update({ Stock: nuevoStock })
        .eq('ID_Medicamento', id);

      if (updateError) throw updateError;

      console.log(`[${new Date().toLocaleTimeString()}] [medicamentosService] Stock actualizado ID ${id} a ${nuevoStock}`);
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [medicamentosService] Fallo al actualizar stock:`, error.message);
      throw error;
    }
  },
};