import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Verificación de credenciales en consola para depuración
console.log(`[${new Date().toLocaleTimeString()}] [Supabase] URL: ${supabaseUrl}`); 
console.log(`[${new Date().toLocaleTimeString()}] [Supabase] Key: ${supabaseKey ? 'Cargada correctamente ' : 'NO EXISTE '}`); 

/**
 * Validación de seguridad: el cliente no se inicializa si faltan las variables esenciales
 */
if (!supabaseUrl || !supabaseKey) {
  const errorMsg = 'Faltan variables de entorno: EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_ANON_KEY';
  console.error(`[${new Date().toLocaleTimeString()}] [Supabase] Error crítico: ${errorMsg}`);
  throw new Error(errorMsg);
}

// Inicialización del cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

console.log(`[${new Date().toLocaleTimeString()}] [Supabase] Cliente creado y exportado`);