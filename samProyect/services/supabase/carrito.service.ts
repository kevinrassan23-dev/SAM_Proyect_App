// ============================================
// services/supabase/carrito.service.ts
// ============================================

import { supabase } from '@/config/supabaseClient';
import { descuentosService } from './descuentos.service';
import { medicamentosService } from './medicamentos.service';

export const carritoService = {

  async agregarAlCarrito(
    dni: string,
    medicamentoId: string,
    cantidad: number
  ): Promise<{ exito: boolean; mensaje: string }> {
    try {
      console.log("🛒 Agregando al carrito:", medicamentoId);

      const medicamento = await medicamentosService.obtenerPorID(medicamentoId);
      if (!medicamento) {
        return { exito: false, mensaje: 'Medicamento no encontrado' };
      }

      const { data, error } = await supabase
        .from('carrito')
        .insert({
          dni_paciente: dni,
          ID_Medicamento: medicamentoId,
          cantidad,
          precio_original: medicamento.Precio,
          descuento_aplicado: 0,
          precio_final: medicamento.Precio,
          requiere_receta: medicamento.Tipo.includes('con_receta')
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

  async calcularTotal(dni: string, tipoPaciente?: string): Promise<any> {
    try {
      const carrito = await this.obtenerCarrito(dni);

      if (carrito.length === 0) {
        return {
          totalOriginal: 0,
          totalDescuentos: 0,
          totalFinal: 0,
          items: 0,
          carrito: [],
          porcentajeDescuento: 0
        };
      }

      const descuento = tipoPaciente
        ? await descuentosService.obtenerPorTipoPaciente(tipoPaciente)
        : { Porcentaje: 0 };

      const porcentaje = descuento?.Porcentaje || 0;

      let totalOriginal = 0;
      let totalDescuentos = 0;
      let totalFinal = 0;

      carrito.forEach(item => {
        const subtotal = item.precio_original * item.cantidad;
        const descuentoMonto = (subtotal * porcentaje) / 100;

        totalOriginal += subtotal;
        totalDescuentos += descuentoMonto;
        totalFinal += subtotal - descuentoMonto;
      });

      return {
        totalOriginal: parseFloat(totalOriginal.toFixed(2)),
        totalDescuentos: parseFloat(totalDescuentos.toFixed(2)),
        totalFinal: parseFloat(totalFinal.toFixed(2)),
        porcentajeDescuento: porcentaje,
        items: carrito.length,
        carrito
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

      if (error) return false;
      return true;

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

      if (error) return false;
      console.log("✅ Carrito limpiado");
      return true;

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return false;
    }
  }
};