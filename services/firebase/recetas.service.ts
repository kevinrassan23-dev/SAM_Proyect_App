// ============================================
// services/firebase/recetas.service.ts
// ============================================

import { db } from '@/config/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const recetasService = {

  async obtenerPorDNI(dni: string): Promise<any[]> {
    try {
      console.log("📋 Buscando recetas del paciente:", dni);

      const snapshot = await getDocs(
        query(
          collection(db, 'RECETAS'),
          where('DNI_Paciente', '==', dni.trim())
        )
      );

      console.log("🔍 Recetas encontradas:", snapshot.docs.length);

      // ✅ SIN FILTRO Activo - simplemente retorna todas las recetas encontradas
      const recetas = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log("📄 Documento:", {
          DNI: data.DNI_Paciente,
          medicamentos: data.medicamentos_recetados,
        });
        return data;
      });

      console.log(`✅ Recetas activas: ${recetas.length}`);
      recetas.forEach(r => {
        console.log(`   - Medicamentos: ${r.medicamentos_recetados}`);
      });

      return recetas;

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return [];
    }
  },

  async tieneRecetaActiva(dni: string): Promise<boolean> {
    try {
      const recetas = await this.obtenerPorDNI(dni);
      return recetas.length > 0;
    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return false;
    }
  },

  async obtenerMedicamentosReceta(dni: string): Promise<any[]> {
    try {
      console.log("💊 Obteniendo medicamentos de receta para DNI:", dni);

      // 1. Obtener recetas del paciente
      const recetas = await this.obtenerPorDNI(dni);

      if (recetas.length === 0) {
        console.log("❌ Sin recetas para este paciente");
        return [];
      }

      // 2. Recopilar nombres de medicamentos
      const nombresRecetados = new Set<string>();

      recetas.forEach(receta => {
        console.log("📝 Procesando receta:", receta.medicamentos_recetados);

        if (receta.medicamentos_recetados) {
          if (typeof receta.medicamentos_recetados === 'string') {
            const nombre = receta.medicamentos_recetados.toLowerCase().trim();
            console.log(`   ➜ Agregando: "${nombre}"`);
            nombresRecetados.add(nombre);
          } else if (Array.isArray(receta.medicamentos_recetados)) {
            receta.medicamentos_recetados.forEach((nombre: string) => {
              const nombreNorm = nombre.toLowerCase().trim();
              console.log(`   ➜ Agregando: "${nombreNorm}"`);
              nombresRecetados.add(nombreNorm);
            });
          }
        }
      });

      console.log("📝 Nombres finales:", Array.from(nombresRecetados));

      // 3. Obtener todos los medicamentos
      const { medicamentosService } = await import('@/services/supabase/medicamentos.service');
      const todosMedicamentos = await medicamentosService.obtenerTodos();

      // 4. Filtrar por nombre
      const medicamentosRecetados: any[] = [];

      todosMedicamentos.forEach(med => {
        const nombreNorm = med.nombre.toLowerCase().trim();
        if (nombresRecetados.has(nombreNorm)) {
          console.log("✅ Medicamento encontrado:", med.nombre);
          medicamentosRecetados.push(med);
        }
      });

      console.log("✅ Total medicamentos:", medicamentosRecetados.length);
      return medicamentosRecetados;

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return [];
    }
  }
};