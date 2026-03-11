import { supabase } from '../../config/supabaseClient';

export interface Medicamento {
  id: string;
  nombre: string;
  marca: string;
  precio: number;
  familia: string;
  descripcion?: string;
  stock?: number;
  tipo: string[];
  img_medicamento?: string;
}

export const getMedicamentosSinReceta = async (): Promise<Medicamento[]> => {
  const { data, error } = await supabase
    .from('Medicamentos')
    .select('*')
    .eq('Activo', true)
    .contains('Tipo', ['sin_receta']);

  if (error) throw new Error('Error al cargar medicamentos: ' + error.message);

  return (data || []).map((m: any) => ({
    id: m.ID_Medicamento,
    nombre: m.Nombre,
    marca: m.Marca,
    precio: parseFloat(m.Precio),
    familia: m.Familia,
    descripcion: m.Descripcion,
    stock: m.Stock,
    tipo: m.Tipo,
    img_medicamento: m.img_medicamento,
  }));
};