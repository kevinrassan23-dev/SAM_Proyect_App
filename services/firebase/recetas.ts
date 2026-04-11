// ============================================
// services/firebase/recetas.service.ts
// ============================================

import { db } from '@/config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDocs, query, Timestamp, updateDoc, where } from 'firebase/firestore';

// ─────────────────────────────────────────────
// Clave de AsyncStorage para persistir bloqueos
// ─────────────────────────────────────────────
const CLAVE_BLOQUEADAS = 'recetas_bloqueadas';

// Estructura de cada bloqueo guardado localmente
interface RecetaBloqueada {
  idReceta: string;       // ID del documento en Firestore
  idsMedicamentos: string[]; // IDs de los medicamentos bloqueados
  expiraEn: number;       // Date.now() + 1 hora en ms
}

export const recetasService = {

  // ─────────────────────────────────────────────
  // BLOQUEO LOCAL: Llama esto desde Confirmación
  // al finalizar el pedido. Guarda el bloqueo 1 hora
  // en AsyncStorage sin tocar Firebase.
  // ─────────────────────────────────────────────
  async bloquearRecetaLocal(idReceta: string, idsMedicamentos: string[]): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(CLAVE_BLOQUEADAS);
      const existentes: RecetaBloqueada[] = raw ? JSON.parse(raw) : [];

      // 1 hora desde ahora en milisegundos
      const expiraEn = Date.now() + 3600 * 1000;

      // Si ya existía un bloqueo para esta receta lo reemplazamos,
      // si no existía lo añadimos
      const actualizado: RecetaBloqueada[] = [
        ...existentes.filter(r => r.idReceta !== idReceta),
        { idReceta, idsMedicamentos, expiraEn }
      ];

      await AsyncStorage.setItem(CLAVE_BLOQUEADAS, JSON.stringify(actualizado));
      console.log(`[${new Date().toLocaleTimeString()}] Receta bloqueada localmente hasta:`, new Date(expiraEn).toLocaleTimeString());
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error al bloquear receta local:`, error.message);
    }
  },

  // ─────────────────────────────────────────────
  // CONSULTA LOCAL: Llama esto desde Hall al cargar
  // para saber qué medicamentos mostrar como disabled.
  // Devuelve solo los IDs cuyo bloqueo no ha expirado.
  // ─────────────────────────────────────────────
  async obtenerMedicamentosBloqueados(): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(CLAVE_BLOQUEADAS);
      if (!raw) return [];

      const todas: RecetaBloqueada[] = JSON.parse(raw);
      const ahora = Date.now();

      // Filtramos bloqueos vigentes y aplanamos sus IDs de medicamentos
      return todas
        .filter(r => r.expiraEn > ahora)
        .flatMap(r => r.idsMedicamentos);
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error al leer bloqueos locales:`, error.message);
      return [];
    }
  },

  // ─────────────────────────────────────────────
  // LIMPIEZA: Elimina bloqueos ya expirados de
  // AsyncStorage. Llámalo al iniciar Hall para no
  // acumular entradas antiguas.
  // ─────────────────────────────────────────────
  async limpiarBloqueosCaducados(): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(CLAVE_BLOQUEADAS);
      if (!raw) return;

      const todas: RecetaBloqueada[] = JSON.parse(raw);
      const ahora = Date.now();

      // Solo conservamos los que siguen dentro de la hora de bloqueo
      const vigentes = todas.filter(r => r.expiraEn > ahora);
      await AsyncStorage.setItem(CLAVE_BLOQUEADAS, JSON.stringify(vigentes));
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error al limpiar bloqueos caducados:`, error.message);
    }
  },

  async obtenerPorDNI(dni: string): Promise<any[]> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Buscando recetas del paciente:`, dni);

      const snapshot = await getDocs(
        query(
          collection(db, 'RECETAS'),
          where('DNI_Paciente', '==', dni.trim())
        )
      );

      // Solo devolvemos recetas donde Activa === true (booleano).
      // El bloqueo temporal de 1 hora tras la compra se gestiona
      // únicamente con AsyncStorage, sin campos extra en Firestore.
      const recetas = snapshot.docs
        .map(docSnapshot => ({ id: docSnapshot.id, ...docSnapshot.data() }))
        .filter((receta: any) => receta.Activa === true);

      return recetas;

    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error:`, error.message);
      return [];
    }
  },

  // Reservado para cuando quieras escribir en Firebase.
  // Por ahora no se llama desde ningún sitio.
  async desactivarReceta(idReceta: string): Promise<void> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Bloqueando receta por 1 hora en Firebase...`);
      const docRef = doc(db, 'RECETAS', idReceta);

      const ahoraS = Math.floor(Date.now() / 1000);
      const unaHoraDespues = new Timestamp(ahoraS + 3600, 0);

      await updateDoc(docRef, {
        Activa: false,
        fecha_uso: Timestamp.now(),
        expira_en: unaHoraDespues,
        updatedAt: Timestamp.now()
      });

      console.log(`[${new Date().toLocaleTimeString()}] Receta desactivada en Firebase`);
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error al desactivar receta:`, error.message);
    }
  },

  async tieneRecetaActiva(dni: string): Promise<boolean> {
    try {
      const recetas = await this.obtenerPorDNI(dni);
      return recetas.length > 0;
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error:`, error.message);
      return false;
    }
  },

  async obtenerMedicamentosReceta(dni: string): Promise<any[]> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Obteniendo medicamentos de receta para DNI:`, dni);

      const recetas = await this.obtenerPorDNI(dni);

      if (recetas.length === 0) {
        console.log(`[${new Date().toLocaleTimeString()}] Sin recetas activas para este paciente`);
        return [];
      }

      const nombresRecetados = new Set<string>();

      recetas.forEach(receta => {
        if (receta.medicamentos_recetados) {
          // medicamentos_recetados puede ser string o array de strings
          const meds = Array.isArray(receta.medicamentos_recetados)
            ? receta.medicamentos_recetados
            : [receta.medicamentos_recetados];

          meds.forEach((nombre: string) => {
            nombresRecetados.add(nombre.toLowerCase().trim());
          });
        }
      });

      const { medicamentosService } = await import('@/services/supabase/medicamentos');
      const todosMedicamentos = await medicamentosService.obtenerTodos();

      const medicamentosRecetados: any[] = [];

      todosMedicamentos.forEach(med => {
        const nombreNorm = med.nombre.toLowerCase().trim();
        if (nombresRecetados.has(nombreNorm)) {
          // Inyectamos el idReceta para usarlo en bloquearRecetaLocal
          // desde la pantalla de Confirmación
          const recetaOriginal = recetas.find(r => {
            const rMeds = Array.isArray(r.medicamentos_recetados)
              ? r.medicamentos_recetados.map((n: string) => n.toLowerCase())
              : [r.medicamentos_recetados.toLowerCase()];
            return rMeds.includes(nombreNorm);
          });

          medicamentosRecetados.push({
            ...med,
            idReceta: recetaOriginal?.id
          });
        }
      });

      return medicamentosRecetados;

    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error:`, error.message);
      return [];
    }
  }
};