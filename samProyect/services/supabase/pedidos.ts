import { supabase } from '@/config/supabaseClient';

export const pedidosService = {

  /**
   * Ejecuta el flujo transaccional de creación de pedido y registro de pago iniciado.
   * Los ítems del carrito se gestionan directamente en Confirmacion.tsx.
   */
  async crearPedidoCompleto(
    dni: string, tipoPaciente: string, metodoPago: string,
    descuentoAplicado: number, totalOriginal: number, totalDescuentos: number, totalFinal: number
  ): Promise<{ exito: boolean; pedidoId?: string; mensaje: string }> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] [pedidosService] Iniciando creación de pedido...`);

      // 1. Cabecera del pedido
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

      if (errorPedido) throw errorPedido;
      const pedidoId = pedido[0].ID_Pedido;

      // 2. Registro de transacción financiera
      const codigoTransaccion = `SAM-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      await supabase.from('transacciones').insert({
        ID_Pedido: pedidoId,
        dni_paciente: dni,
        monto: totalFinal,
        metodo_pago: metodoPago,
        estado: 'iniciada',
        codigo_transaccion: codigoTransaccion
      });

      // 3. Auditoría de estados
      await supabase.from('historial_pedidos').insert({
        ID_Pedido: pedidoId,
        estado_nuevo: 'procesando',
        cambio_por: 'sistema',
        descripcion: 'Pedido creado desde App Móvil'
      });

      console.log(`[${new Date().toLocaleTimeString()}] [pedidosService] Pedido ${pedidoId} registrado correctamente`);
      return { exito: true, pedidoId: pedidoId.toString(), mensaje: 'Éxito' };

    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [pedidosService] Fallo crítico en creación de pedido:`, error.message);
      return { exito: false, mensaje: error.message };
    }
  },

  /**
   * Actualiza el pedido y su transacción a estado exitoso.
   */
  async completarPedido(pedidoId: string): Promise<boolean> {
    try {
      const ahora = new Date();
      await supabase.from('Pedidos').update({ Estado: 'completado', updated_at: ahora }).eq('ID_Pedido', pedidoId);
      await supabase.from('transacciones').update({ estado: 'completada', fecha_completacion: ahora }).eq('ID_Pedido', pedidoId);

      await supabase.from('historial_pedidos').insert({
        ID_Pedido: pedidoId,
        estado_anterior: 'procesando',
        estado_nuevo: 'completado',
        cambio_por: 'sistema',
        descripcion: 'Pago procesado'
      });

      console.log(`[${new Date().toLocaleTimeString()}] [pedidosService] Pedido ${pedidoId} marcado como COMPLETADO`);
      return true;
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [pedidosService] Error al completar:`, error.message);
      return false;
    }
  },

  /**
   * Cancela el pedido y registra el motivo del fallo.
   */
  async cancelarPedido(pedidoId: string, motivo: string): Promise<boolean> {
    try {
      await supabase.from('Pedidos').update({ Estado: 'cancelado', updated_at: new Date() }).eq('ID_Pedido', pedidoId);
      await supabase.from('transacciones').update({ estado: 'fallida', error_mensaje: motivo }).eq('ID_Pedido', pedidoId);

      await supabase.from('historial_pedidos').insert({
        ID_Pedido: pedidoId,
        estado_anterior: 'procesando',
        estado_nuevo: 'cancelado',
        cambio_por: 'sistema',
        descripcion: motivo
      });

      return true;
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [pedidosService] Error al cancelar:`, error.message);
      return false;
    }
  },

  /**
   * Recupera la información detallada de un pedido.
   */
  async obtenerPedido(pedidoId: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('Pedidos')
        .select('*')
        .eq('ID_Pedido', pedidoId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [pedidosService] Error en consulta de pedido:`, error.message);
      return null;
    }
  },

  /**
   * Recupera las últimas 200 transacciones ordenadas por fecha descendente.
   */
  async obtenerTransacciones(): Promise<any[]> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Consultando últimas transacciones`);
      const { data, error } = await supabase
        .from('transacciones')
        .select('*')
        .order('fecha_inicio', { ascending: false })
        .limit(200);

      if (error) throw error;
      console.log(`[${new Date().toLocaleTimeString()}] Se han recuperado ${data?.length || 0} transacciones.`);
      return data ?? [];
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Error al obtener transacciones:`, error.message);
      throw error;
    }
  },
};