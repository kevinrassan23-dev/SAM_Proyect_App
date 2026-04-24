import { db } from '@/config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, query, where } from 'firebase/firestore';

const CLAVE_BLOQUEADAS = 'recetas_bloqueadas';

interface RecetaBloqueada {
  idReceta: string;
  idsMedicamentos: string[];
  expiraEn: number;
}

export const recetasService = {

  /**
   * Registra un bloqueo de 1 hora en el dispositivo local para evitar compras duplicadas
   */
  async bloquearRecetaLocal(idReceta: string, idsMedicamentos: string[]): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(CLAVE_BLOQUEADAS);
      const existentes: RecetaBloqueada[] = raw ? JSON.parse(raw) : [];
      const expiraEn = Date.now() + 3600 * 1000;

      const actualizado = [
        ...existentes.filter(r => r.idReceta !== idReceta),
        { idReceta, idsMedicamentos, expiraEn }
      ];

      await AsyncStorage.setItem(CLAVE_BLOQUEADAS, JSON.stringify(actualizado));
      console.log(`[${new Date().toLocaleTimeString()}] [recetasService] Bloqueo local guardado hasta: ${new Date(expiraEn).toLocaleTimeString()}`);
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [recetasService] Error bloqueo local:`, error.message);
    }
  },

  /**
   * Retorna lista de IDs de medicamentos bloqueados por compras recientes
   */
  async obtenerMedicamentosBloqueados(): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(CLAVE_BLOQUEADAS);
      if (!raw) return [];

      const todas: RecetaBloqueada[] = JSON.parse(raw);
      const ahora = Date.now();

      return todas.filter(r => r.expiraEn > ahora).flatMap(r => r.idsMedicamentos);
    } catch (error: any) {
      return [];
    }
  },

  /**
   * Limpia registros de bloqueo expirados de la memoria local
   */
  async limpiarBloqueosCaducados(): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(CLAVE_BLOQUEADAS);
      if (!raw) return;

      const ahora = Date.now();
      const vigentes = (JSON.parse(raw) as RecetaBloqueada[]).filter(r => r.expiraEn > ahora);
      await AsyncStorage.setItem(CLAVE_BLOQUEADAS, JSON.stringify(vigentes));
    } catch (error: any) {}
  },

  /**
   * Obtiene recetas activas desde Firestore para un paciente específico
   */
  async obtenerPorDNI(dni: string): Promise<any[]> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] [recetasService] Consultando recetas para DNI: ${dni}`);
      const q = query(collection(db, 'RECETAS'), where('DNI_Paciente', '==', dni.trim()));
      const snapshot = await getDocs(q);

      return snapshot.docs
        .map(ds => ({ id: ds.id, ...ds.data() }))
        .filter((r: any) => r.Activa === true);
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [recetasService] Error en obtenerPorDNI:`, error.message);
      return [];
    }
  },

  /**
   * Obtiene y cruza los medicamentos de las recetas del paciente con el stock de Supabase.
   * ── Usa Medicamentos_Recetados (mayúscula) que es el campo real de Firestore.
   * ── Soporta tanto string simple como array de strings separados por comas.
   */
  async obtenerMedicamentosReceta(dni: string): Promise<any[]> {
    try {
      const recetas = await this.obtenerPorDNI(dni);
      if (recetas.length === 0) return [];

      const nombresRecetados = new Set<string>();

      recetas.forEach(r => {
        // ── Campo con mayúscula tal como está en Firestore
        const raw = r.Medicamentos_Recetados;
        if (!raw) return;

        // ── Soporta string con comas ("Med1, Med2") o array directo
        const lista: string[] = Array.isArray(raw)
          ? raw
          : raw.split(',').map((n: string) => n.trim());

        lista
          .filter((n: string) => n && n.trim() !== '')
          .forEach((n: string) => nombresRecetados.add(n.toLowerCase().trim()));
      });

      if (nombresRecetados.size === 0) return [];

      const { medicamentosService } = await import('@/services/supabase/medicamentos');
      const todosMeds = await medicamentosService.obtenerTodos();

      return todosMeds
        .filter(m => m.nombre && nombresRecetados.has(m.nombre.toLowerCase().trim()))
        .map(m => {
          const rOrig = recetas.find(r => {
            const raw = r.Medicamentos_Recetados;
            if (!raw) return false;

            const list: string[] = Array.isArray(raw)
              ? raw
              : raw.split(',').map((n: string) => n.trim());

            return list.some((ln: string) =>
              ln && ln.toLowerCase().trim() === m.nombre.toLowerCase().trim()
            );
          });
          return { ...m, idReceta: rOrig?.id };
        });
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [recetasService] Error en obtenerMedicamentosReceta:`, error.message);
      return [];
    }
  }
};