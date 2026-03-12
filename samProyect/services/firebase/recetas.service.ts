// ============================================
// services/firebase/recetas.service.ts
// ============================================

import { db } from '@/config/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const recetasService = {

  async obtenerPorDNI(dni: string): Promise<any[]> {
    try {
      console.log("📋 Buscando recetas para DNI:", dni);
      
      const q = query(
        collection(db, 'RECETAS'),
        where('DNI_Paciente', '==', dni.toUpperCase()),
        where('Activo', '==', true)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("❌ Sin recetas activas");
        return [];
      }

      const recetas = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log("✅ Recetas encontradas:", recetas.length);
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

  async obtenerDetallesReceta(dni: string): Promise<{
    tieneReceta: boolean;
    recetas: any[];
    afecciones?: string;
  }> {
    try {
      const recetas = await this.obtenerPorDNI(dni);

      if (recetas.length === 0) {
        return { tieneReceta: false, recetas: [] };
      }

      return {
        tieneReceta: true,
        recetas,
        afecciones: recetas[0].Afecciones
      };

    } catch (error: any) {
      console.error("❌ Error:", error.message);
      return { tieneReceta: false, recetas: [] };
    }
  }
};