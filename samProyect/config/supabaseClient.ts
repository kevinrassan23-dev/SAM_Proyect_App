/**
 * NOS CONECTAMOS A LA API DE SUPABASE:
 * 
 * EJEMPLO:
 * 
 * import { createClient } from '@supabase/supabase-js';
 * 
 * const SUPABASE_URL = 'https://xxxx.supabase.co';
 * const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6...';
 * 
 * export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
 * 
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('SUPABASE_URL:', supabaseUrl); 
console.log('SUPABASE_KEY:', supabaseKey ? 'existe' : 'NO EXISTE'); 

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan variables de entorno: EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);