import { db } from '@/config/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const pacientesService = {

  /**
   * Busca un paciente por su número de cartilla sanitaria
   */
  async obtenerPorCartilla(cartilla: string): Promise<any | null> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] [pacientesService] Buscando por cartilla: ${cartilla}`);
      
      const q = query(collection(db, 'PACIENTES'), where('Num_Cartilla', '==', cartilla));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log(`[${new Date().toLocaleTimeString()}] [pacientesService] Cartilla no encontrada`);
        return null;
      }

      const paciente = snapshot.docs[0].data();
      return paciente;
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [pacientesService] Error en obtenerPorCartilla:`, error.message);
      return null;
    }
  },

  /**
   * Busca un paciente por su DNI (Normaliza a mayúsculas)
   */
  async obtenerPorDNI(dni: string): Promise<any | null> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] [pacientesService] Buscando por DNI: ${dni}`);
      
      const q = query(collection(db, 'PACIENTES'), where('DNI', '==', dni.toUpperCase()));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return null;

      return snapshot.docs[0].data();
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [pacientesService] Error en obtenerPorDNI:`, error.message);
      return null;
    }
  },

  /**
   * Busca un paciente por su número de teléfono
   */
  async obtenerPorTelefono(telefono: string): Promise<any | null> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] [pacientesService] Buscando por teléfono: ${telefono}`);
      
      const q = query(collection(db, 'PACIENTES'), where('Num_Telefono', '==', telefono));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return null;

      return snapshot.docs[0].data();
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [pacientesService] Error en obtenerPorTelefono:`, error.message);
      return null;
    }
  },

  /**
   * Validación cruzada de Cartilla + DNI y estado activo
   */
  async validarPorCartillaDNI(cartilla: string, dni: string): Promise<{ valido: boolean; paciente?: any; error?: string }> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] [pacientesService] Iniciando validación Cartilla+DNI`);

      const paciente = await this.obtenerPorCartilla(cartilla);

      if (!paciente) return { valido: false, error: "Cartilla no encontrada" };
      if (paciente.DNI !== dni.toUpperCase()) return { valido: false, error: "DNI no coincide con la cartilla" };
      if (!paciente.Activo) return { valido: false, error: "Paciente no está activo" };

      console.log(`[${new Date().toLocaleTimeString()}] [pacientesService] Validación Cartilla+DNI exitosa`);
      return { valido: true, paciente };
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [pacientesService] Error validación Cartilla+DNI:`, error.message);
      return { valido: false, error: error.message };
    }
  },

  /**
   * Validación completa de identidad: DNI, Cartilla y Teléfono
   */
  async validarPacienteCompleto(dni: string, cartilla: string, telefono: string): Promise<{ valido: boolean; paciente?: any; error?: string }> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] [pacientesService] Iniciando validación completa`);

      const paciente = await this.obtenerPorDNI(dni);

      if (!paciente) return { valido: false, error: "DNI no encontrado" };
      if (paciente.Num_Cartilla !== cartilla) return { valido: false, error: "Cartilla no coincide" };
      if (paciente.Num_Telefono !== telefono) return { valido: false, error: "Teléfono no coincide" };
      if (!paciente.Activo) return { valido: false, error: "Paciente inactivo" };

      return { valido: true, paciente };
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [pacientesService] Error validación completa:`, error.message);
      return { valido: false, error: error.message };
    }
  },

  /**
   * Búsqueda estricta por cartilla (con trim y normalización)
   */
  async obtenerCartillaCompleta(cartilla: string): Promise<any | null> {
    try {
      const valor = cartilla.toUpperCase().trim();
      console.log(`[${new Date().toLocaleTimeString()}] [pacientesService] Buscando cartilla completa: ${valor}`);

      const q = query(collection(db, 'PACIENTES'), where('Num_Cartilla', '==', valor));
      const snapshot = await getDocs(q);

      return snapshot.empty ? null : snapshot.docs[0].data();
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [pacientesService] Error en obtenerCartillaCompleta:`, error.message);
      return null;
    }
  },

  /**
   * Validación Cartilla + Teléfono (Añade prefijo +34 automáticamente)
   */
  async validarPorCartillaYTelefono(cartilla: string, telefono: string): Promise<{ valido: boolean; paciente?: any; error?: string }> {
    try {
      const paciente = await this.obtenerCartillaCompleta(cartilla);
      if (!paciente) return { valido: false, error: "Cartilla no encontrada" };

      const telefonoCompleto = `+34${telefono.trim()}`;
      if (paciente.Num_Telefono !== telefonoCompleto) return { valido: false, error: "Teléfono no coincide" };
      if (!paciente.Activo) return { valido: false, error: "Paciente inactivo" };

      return { valido: true, paciente };
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [pacientesService] Error validación Cartilla+Tel:`, error.message);
      return { valido: false, error: error.message };
    }
  },
};