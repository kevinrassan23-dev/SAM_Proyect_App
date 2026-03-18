// ============================================
// services/supabase/carrito.service.ts (SIMPLIFICADO)
// ============================================

import { supabase } from '@/config/supabaseClient';
import { descuentosService } from './descuentos.service';

export const carritoService = {

  async obtenerCarrito(dni: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('carrito')
        .select('*')
        .eq('dni_paciente', dni);

      if (error) {
        console.error("❌ Error:", error.message);
        return [];
      }

      return data || [];

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return [];
    }
  },

  async agregarAlCarrito(
    dni: string,
    medicamento: any,
    cantidad: number = 1
  ): Promise<{ exito: boolean; mensaje: string }> {
    try {
      console.log("🛒 Agregando al carrito:", medicamento.id);

      const { error } = await supabase
        .from('carrito')
        .insert({
          dni_paciente: dni,
          ID_Medicamento: medicamento.id,
          cantidad,
          precio_original: medicamento.precio,
          precio_final: medicamento.precio * cantidad,
          requiere_receta: medicamento.tipo.includes('con_receta')
        });

      if (error) {
        console.error("❌ Error:", error.message);
        return { exito: false, mensaje: 'Error al agregar al carrito' };
      }

      console.log("✅ Agregado al carrito");
      return { exito: true, mensaje: 'Agregado correctamente' };

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return { exito: false, mensaje: error.message };
    }
  },

  async calcularTotal(dni: string, tipoPaciente?: string): Promise<any> {
    try {
      const carrito = await this.obtenerCarrito(dni);

      if (carrito.length === 0) {
        return {
          totalOriginal: 0,
          totalDescuentos: 0,
          totalFinal: 0,
          porcentajeDescuento: 0
        };
      }

      const descuento = tipoPaciente
        ? await descuentosService.obtenerPorTipoPaciente(tipoPaciente)
        : null;

      const porcentaje = descuento?.Porcentaje || 0;

      let totalOriginal = 0;
      let totalDescuentos = 0;

      carrito.forEach(item => {
        const subtotal = item.precio_original * item.cantidad;
        totalOriginal += subtotal;
        totalDescuentos += (subtotal * porcentaje) / 100;
      });

      const totalFinal = totalOriginal - totalDescuentos;

      return {
        totalOriginal: parseFloat(totalOriginal.toFixed(2)),
        totalDescuentos: parseFloat(totalDescuentos.toFixed(2)),
        totalFinal: parseFloat(totalFinal.toFixed(2)),
        porcentajeDescuento: porcentaje
      };

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return null;
    }
  },

  async eliminarDelCarrito(carritoId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('carrito')
        .delete()
        .eq('id', carritoId);

      return !error;

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return false;
    }
  },

  async limpiarCarrito(dni: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('carrito')
        .delete()
        .eq('dni_paciente', dni);

      if (!error) console.log("✅ Carrito limpiado");
      return !error;

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return false;
    }
  }
};