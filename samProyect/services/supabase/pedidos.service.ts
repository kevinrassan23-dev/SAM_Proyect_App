// ============================================
// services/supabase/pedidos.service.ts
// ============================================

import { supabase } from '@/config/supabaseClient';
import { carritoService } from './carrito.service';

export const pedidosService = {

  async crearPedidoCompleto(
    dni: string,
    tipoPaciente: string,
    metodoPago: string,
    descuentoAplicado: number,
    totalOriginal: number,
    totalDescuentos: number,
    totalFinal: number
  ): Promise<{ exito: boolean; pedidoId?: string; mensaje: string }> {
    try {
      console.log("📦 Creando pedido completo...");

      const { data: pedido, error: errorPedido } = await supabase
        .from('Pedidos')
        .insert({
          DNI_Paciente: dni,
          Tipo_Paciente: tipoPaciente,
          Descuento_Aplicado: descuentoAplicado,
          Precio_Total: totalFinal,
          total_original: totalOriginal,
          total_descuentos: totalDescuentos,
          metodo_pago: metodoPago,
          Estado: 'procesando'
        })
        .select();

      if (errorPedido) {
        console.error("❌ Error creando pedido:", errorPedido);
        return { exito: false, mensaje: 'Error al crear el pedido' };
      }

      const pedidoId = pedido[0].ID_Pedido;
      console.log("✅ Pedido creado:", pedidoId);

      const carrito = await carritoService.obtenerCarrito(dni);

      const itemsParaInsertar = carrito.map(item => ({
        ID_Pedido: pedidoId,
        ID_Medicamento: item.ID_Medicamento,
        Cantidad: item.cantidad,
        Precio_Unitario: item.precio_original,
        Subtotal: item.precio_final * item.cantidad,
        descuento_porcentaje: descuentoAplicado,
        precio_final: item.precio_final * item.cantidad
      }));

      const { error: errorItems } = await supabase
        .from('pedido_medicamentos')
        .insert(itemsParaInsertar);

      if (errorItems) {
        console.error("❌ Error creando items:", errorItems);
        return { exito: false, mensaje: 'Error al guardar items del pedido' };
      }

      console.log("✅ Items del pedido guardados");

      const codigoTransaccion = `SAM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const { error: errorTransaccion } = await supabase
        .from('transacciones')
        .insert({
          ID_Pedido: pedidoId,
          dni_paciente: dni,
          monto: totalFinal,
          metodo_pago: metodoPago,
          estado: 'iniciada',
          codigo_transaccion: codigoTransaccion,
          detalles: {}
        });

      if (errorTransaccion) {
        console.error("❌ Error creando transacción:", errorTransaccion);
        return { exito: false, mensaje: 'Error al crear la transacción' };
      }

      console.log("✅ Transacción creada");

      const { error: errorHistorial } = await supabase
        .from('historial_pedidos')
        .insert({
          ID_Pedido: pedidoId,
          estado_anterior: null,
          estado_nuevo: 'procesando',
          cambio_por: 'sistema',
          descripcion: 'Pedido creado desde la app móvil'
        });

      if (errorHistorial) {
        console.error("❌ Error creando historial:", errorHistorial);
      }

      console.log("✅ Historial registrado");

      return { exito: true, pedidoId: pedidoId.toString(), mensaje: 'Pedido creado exitosamente' };

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return { exito: false, mensaje: error.message };
    }
  },

  async completarPedido(pedidoId: string): Promise<boolean> {
    try {
      const { error: errorPedido } = await supabase
        .from('Pedidos')
        .update({
          Estado: 'completado',
          updated_at: new Date()
        })
        .eq('ID_Pedido', pedidoId);

      if (errorPedido) return false;

      const { error: errorTransaccion } = await supabase
        .from('transacciones')
        .update({
          estado: 'completada',
          fecha_completacion: new Date()
        })
        .eq('ID_Pedido', pedidoId);

      if (errorTransaccion) return false;

      const { error: errorHistorial } = await supabase
        .from('historial_pedidos')
        .insert({
          ID_Pedido: pedidoId,
          estado_anterior: 'procesando',
          estado_nuevo: 'completado',
          cambio_por: 'sistema',
          descripcion: 'Pago procesado exitosamente'
        });

      if (errorHistorial) return false;

      console.log("✅ Pedido completado");
      return true;

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return false;
    }
  },

  async cancelarPedido(pedidoId: string, motivo: string): Promise<boolean> {
    try {
      const { error: errorPedido } = await supabase
        .from('Pedidos')
        .update({
          Estado: 'cancelado',
          updated_at: new Date()
        })
        .eq('ID_Pedido', pedidoId);

      if (errorPedido) return false;

      const { error: errorTransaccion } = await supabase
        .from('transacciones')
        .update({
          estado: 'fallida',
          error_mensaje: motivo
        })
        .eq('ID_Pedido', pedidoId);

      if (errorTransaccion) return false;

      const { error: errorHistorial } = await supabase
        .from('historial_pedidos')
        .insert({
          ID_Pedido: pedidoId,
          estado_anterior: 'procesando',
          estado_nuevo: 'cancelado',
          cambio_por: 'sistema',
          descripcion: motivo
        });

      if (errorHistorial) return false;

      console.log("✅ Pedido cancelado");
      return true;

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return false;
    }
  },

  async obtenerPedido(pedidoId: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('Pedidos')
        .select(`
          *,
          pedido_medicamentos (*)
        `)
        .eq('ID_Pedido', pedidoId)
        .single();

      if (error) {
        console.error("❌ Error:", error);
        return null;
      }

      return data;
    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return null;
    }
  }
};