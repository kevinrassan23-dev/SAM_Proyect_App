// ============================================
// services/supabase/medicamentos.service.ts
// ============================================

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

const mapearMedicamento = (m: any): Medicamento => ({
  id: m.ID_Medicamento,
  nombre: m.Nombre,
  marca: m.Marca,
  precio: parseFloat(m.Precio),
  familia: m.Familia,
  descripcion: m.Descripcion,
  stock: m.Stock,
  tipo: m.Tipo || [],
  img_medicamento: m.img_medicamento,
});

export const medicamentosService = {

  // ✅ Obtener TODOS los medicamentos
  async obtenerTodos(): Promise<Medicamento[]> {
    try {
      console.log("📊 Obteniendo TODOS los medicamentos...");

      const { data, error } = await supabase
        .from('Medicamentos')
        .select('*')
        .eq('Activo', true);

      if (error) {
        console.error("❌ Error Supabase:", error.message);
        return [];
      }

      console.log("✅ Total medicamentos en Supabase:", data?.length);
      return (data || []).map(mapearMedicamento);

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return [];
    }
  },

  async obtenerSinReceta(): Promise<Medicamento[]> {
    try {
      console.log("💊 Obteniendo medicamentos SIN receta...");

      const { data, error } = await supabase
        .from('Medicamentos')
        .select('*')
        .eq('Activo', true)
        .contains('Tipo', ['sin_receta']);

      if (error) {
        console.error("❌ Error:", error.message);
        return [];
      }

      console.log("✅ Medicamentos sin receta:", data?.length);
      return (data || []).map(mapearMedicamento);

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return [];
    }
  },

  async obtenerConReceta(): Promise<Medicamento[]> {
    try {
      console.log("📋 Obteniendo medicamentos CON receta...");

      const { data, error } = await supabase
        .from('Medicamentos')
        .select('*')
        .eq('Activo', true)
        .contains('Tipo', ['con_receta']);

      if (error) {
        console.error("❌ Error:", error.message);
        return [];
      }

      console.log("✅ Medicamentos con receta:", data?.length);
      return (data || []).map(mapearMedicamento);

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return [];
    }
  },

  async actualizarStock(id: string, cantidadARestar: number): Promise<void> {
    try {
      // 1. Obtener el stock actual directamente de la base de datos
      const { data, error: fetchError } = await supabase
        .from('Medicamentos')
        .select('Stock')
        .eq('ID_Medicamento', id)
        .single();

      if (fetchError) throw fetchError;

      const stockActual = data.Stock || 0;
      const nuevoStock = stockActual - cantidadARestar;

      // 2. Realizar el update con el nuevo valor calculado
      const { error: updateError } = await supabase
        .from('Medicamentos')
        .update({ Stock: nuevoStock })
        .eq('ID_Medicamento', id);

      if (updateError) throw updateError;

      console.log(`✅ Stock actualizado para ID ${id}: ${stockActual} -> ${nuevoStock}`);
    } catch (error: any) {
      console.error("❌ Error actualizando stock en Supabase:", error.message);
      throw error;
    }
  },

};