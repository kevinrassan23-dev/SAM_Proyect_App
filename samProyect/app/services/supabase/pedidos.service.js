/**
 * Aquí van los métodos para obtener los datos
 * de la tabla pedidos en supabase:
 * 
 * EJEMPLO: Obtenemos un pedido por ID de la tabla de 'PEDIDOS' ->
 * 
 * export const getPedidoById = async (id) => {
 * const { data, error } = await supabase
 *      .from('pedidos')
 *      .select('*')
 *      .eq('id', id)
 *      .single();
 * 
 * if (error) throw error;
 *      return data;
 * };
 * 
 * OPERACIONES: GET, POST, PUT, DELETE, etc...
 * 
 */
import { supabase } from '../../config/supabaseClient';