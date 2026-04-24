import { supabase } from '@/config/supabaseClient';
import { descuentosService } from './descuentos';

export const carritoService = {

  /**
   * Recupera todos los artículos del carrito para un paciente específico
   */
  async obtenerCarrito(dni: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('carrito')
        .select('*')
        .eq('dni_paciente', dni);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [carritoService] Error al obtener carrito:`, error.message);
      return [];
    }
  },

  /**
   * Inserta un nuevo medicamento en el carrito calculando precios base
   */
  async agregarAlCarrito(dni: string, medicamento: any, cantidad: number = 1): Promise<{ exito: boolean; mensaje: string }> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] [carritoService] Agregando producto ID: ${medicamento.id}`);

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

      if (error) throw error;

      console.log(`[${new Date().toLocaleTimeString()}] [carritoService] Producto añadido con éxito`);
      return { exito: true, mensaje: 'Agregado correctamente' };
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [carritoService] Error al agregar:`, error.message);
      return { exito: false, mensaje: error.message };
    }
  },

  /**
   * Calcula el desglose financiero del carrito aplicando el descuento por tipo de paciente
   */
  async calcularTotal(dni: string, tipoPaciente?: string): Promise<any> {
    try {
      const carrito = await this.obtenerCarrito(dni);

      if (carrito.length === 0) {
        return { totalOriginal: 0, totalDescuentos: 0, totalFinal: 0, porcentajeDescuento: 0 };
      }

      // Obtención de tasa de descuento aplicable
      const descuento = tipoPaciente ? await descuentosService.obtenerPorTipoPaciente(tipoPaciente) : null;
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
      console.error(`[${new Date().toLocaleTimeString()}] [carritoService] Error en cálculo de totales:`, error.message);
      return null;
    }
  },

  /**
   * Elimina un ítem específico del carrito por su ID único
   */
  async eliminarDelCarrito(carritoId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('carrito').delete().eq('id', carritoId);
      return !error;
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [carritoService] Error al eliminar ítem:`, error.message);
      return false;
    }
  },

  /**
   * Vacía por completo el carrito de un paciente tras finalizar una compra o por solicitud
   */
  async limpiarCarrito(dni: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('carrito').delete().eq('dni_paciente', dni);
      if (!error) console.log(`[${new Date().toLocaleTimeString()}] [carritoService] Carrito vaciado para DNI: ${dni}`);
      return !error;
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [carritoService] Error al limpiar carrito:`, error.message);
      return false;
    }
  }
};