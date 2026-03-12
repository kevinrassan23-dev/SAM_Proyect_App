// ============================================
// services/supabase/descuentos.service.ts
// ============================================

import { supabase } from '@/config/supabaseClient';

export const descuentosService = {

  async obtenerPorTipoPaciente(tipoPaciente: string): Promise<any | null> {
    try {
      console.log("💰 Obteniendo descuento para:", tipoPaciente);
      
      const { data, error } = await supabase
        .from('Descuentos')
        .select('*')
        .eq('Tipo_Paciente', tipoPaciente)
        .single();

      if (error) {
        console.log("ℹ️ No hay descuento especial");
        return { Porcentaje: 0, limite_mensual: null };
      }

      console.log("✅ Descuento encontrado:", data.Porcentaje + '%');
      return data;

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return { Porcentaje: 0, limite_mensual: null };
    }
  },

  async obtenerTodos(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('Descuentos')
        .select('*');

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