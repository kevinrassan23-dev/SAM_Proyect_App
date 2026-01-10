/**
 * Aquí van los métodos para obtener los datos
 * de la tabla administradores en supabase:
 * 
 * EJEMPLO: Obtenemos un medicamento por ID de la tabla de 'ADMINISTRADORES' ->
 * 
 * export const getAdminById = async (id) => {
 * const { data, error } = await supabase
 *      .from('administradores')
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