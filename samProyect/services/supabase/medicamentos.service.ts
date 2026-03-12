// ============================================
// services/supabase/medicamentos.service.ts
// ============================================

import { supabase } from '@/config/supabaseClient';

export const medicamentosService = {

  async obtenerTodos(): Promise<any[]> {
    try {
      console.log("📊 Obteniendo todos los medicamentos...");
      
      const { data, error } = await supabase
        .from('Medicamentos')
        .select('*')
        .eq('Activo', true);

      if (error) {
        console.error("❌ Error:", error.message);
        return [];
      }

      console.log("✅ Medicamentos obtenidos:", data?.length);
      return data || [];

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return [];
    }
  },

  async obtenerSinReceta(): Promise<any[]> {
    try {
      console.log("💊 Obteniendo medicamentos sin receta...");
      
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
      return data || [];

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return [];
    }
  },

  async obtenerConReceta(): Promise<any[]> {
    try {
      console.log("📋 Obteniendo medicamentos con receta...");
      
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
      return data || [];

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return [];
    }
  },

  async obtenerPorID(id: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('Medicamentos')
        .select('*')
        .eq('ID_Medicamento', id)
        .single();

      if (error) {
        console.error("❌ Error:", error.message);
        return null;
      }

      return data;

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return null;
    }
  },

  async buscar(termino: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('Medicamentos')
        .select('*')
        .eq('Activo', true)
        .or(`Nombre.ilike.%${termino}%,Marca.ilike.%${termino}%`);

      if (error) {
        console.error("❌ Error:", error.message);
        return [];
      }

      return data || [];

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return [];
    }
  }
};