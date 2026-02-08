/**
 * Aquí van los métodos para obtener los datos
 * de la tabla medicamentos en supabase:
 * 
 * EJEMPLO: Obtenemos un medicamento por ID de la tabla de 'MEDICAMENTOS' ->
 * 
 * export const getMedicamentoById = async (id) => {
 * const { data, error } = await supabase
 *      .from('medicamentos')
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
//import { supabase } from '../../config/supabaseClient';