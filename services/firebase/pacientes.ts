// ============================================
// services/firebase/pacientes.service.ts
// ============================================

import { db } from '@/config/firebaseConfig';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';

export const pacientesService = {

  async obtenerPorCartilla(cartilla: string): Promise<any | null> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Buscando paciente por cartilla:`, cartilla);
      
      const q = query(
        collection(db, 'PACIENTES'),
        where('Num_Cartilla', '==', cartilla)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log(`[${new Date().toLocaleTimeString()}] Cartilla no encontrada`);
        return null;
      }

      const paciente = snapshot.docs[0].data();
      console.log(`[${new Date().toLocaleTimeString()}] Paciente encontrado:`, paciente.Nombre_Paciente);
      return paciente;

    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error:`, error.message);
      return null;
    }
  },

  async obtenerPorDNI(dni: string): Promise<any | null> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Buscando paciente por DNI:`, dni);
      
      const q = query(
        collection(db, 'PACIENTES'),
        where('DNI', '==', dni.toUpperCase())
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log(`[${new Date().toLocaleTimeString()}] DNI no encontrado`);
        return null;
      }

      const paciente = snapshot.docs[0].data();
      console.log(`[${new Date().toLocaleTimeString()}] Paciente encontrado:`, paciente.Nombre_Paciente);
      return paciente;

    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error:`, error.message);
      return null;
    }
  },

  async obtenerPorTelefono(telefono: string): Promise<any | null> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Buscando paciente por teléfono:`, telefono);
      
      const q = query(
        collection(db, 'PACIENTES'),
        where('Num_Telefono', '==', telefono)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log(`[${new Date().toLocaleTimeString()}] Teléfono no encontrado`);
        return null;
      }

      const paciente = snapshot.docs[0].data();
      console.log(`[${new Date().toLocaleTimeString()}] Paciente encontrado:`, paciente.Nombre_Paciente);
      return paciente;

    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error:`, error.message);
      return null;
    }
  },

  // ✅ NUEVA: Validar por Cartilla + DNI
  async validarPorCartillaDNI(cartilla: string, dni: string): Promise<{
    valido: boolean;
    paciente?: any;
    error?: string;
  }> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Validando Cartilla + DNI`);

      const paciente = await this.obtenerPorCartilla(cartilla);

      if (!paciente) {
        return { valido: false, error: "Cartilla no encontrada" };
      }

      if (paciente.DNI !== dni.toUpperCase()) {
        return { valido: false, error: "DNI no coincide con la cartilla" };
      }

      if (!paciente.Activo) {
        return { valido: false, error: "Paciente no está activo" };
      }

      console.log(`[${new Date().toLocaleTimeString()}] Cartilla + DNI validados correctamente`);
      return { valido: true, paciente };

    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error:`, error.message);
      return { valido: false, error: error.message };
    }
  },

  // ✅ NUEVA: Validar por Cartilla + Últimos 4 dígitos de Teléfono
  async validarPorCartillaYTelefono(cartilla: string, ultimosDigitos: string): Promise<{
    valido: boolean;
    paciente?: any;
    error?: string;
  }> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Validando Cartilla + Teléfono`);

      const paciente = await this.obtenerPorCartilla(cartilla);

      if (!paciente) {
        return { valido: false, error: "Cartilla no encontrada" };
      }

      const telefonoPaciente = (paciente.Num_Telefono || "").slice(-4);
      
      if (telefonoPaciente !== ultimosDigitos) {
        return { valido: false, error: "Teléfono no coincide con la cartilla" };
      }

      if (!paciente.Activo) {
        return { valido: false, error: "Paciente no está activo" };
      }

      console.log(`[${new Date().toLocaleTimeString()}] Cartilla + Teléfono validados correctamente`);
      return { valido: true, paciente };

    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error:`, error.message);
      return { valido: false, error: error.message };
    }
  },

  // ✅ NUEVA: Validar por Cartilla + Contraseña
  async validarPorCartillaYContraseña(cartilla: string, contraseña: string): Promise<{
    valido: boolean;
    paciente?: any;
    error?: string;
  }> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Validando Cartilla + Contraseña`);

      const paciente = await this.obtenerPorCartilla(cartilla);

      if (!paciente) {
        return { valido: false, error: "Cartilla no encontrada" };
      }

      if (!paciente.contrasena_dispensador) {
        return { valido: false, error: "Este paciente no tiene contraseña configurada" };
      }

      if (paciente.contrasena_dispensador !== contraseña) {
        return { valido: false, error: "Contraseña incorrecta" };
      }

      if (!paciente.Activo) {
        return { valido: false, error: "Paciente no está activo" };
      }

      console.log(`[${new Date().toLocaleTimeString()}] Cartilla + Contraseña validados correctamente`);
      return { valido: true, paciente };

    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error:`, error.message);
      return { valido: false, error: error.message };
    }
  },

  // ✅ ANTIGUA (mantenida para compatibilidad)
  async validarPacienteCompleto(dni: string, cartilla: string, telefono: string): Promise<{
    valido: boolean;
    paciente?: any;
    error?: string;
  }> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Validando paciente completo`);

      const paciente = await this.obtenerPorDNI(dni);

      if (!paciente) {
        return { valido: false, error: "DNI no encontrado" };
      }

      if (paciente.Num_Cartilla !== cartilla) {
        return { valido: false, error: "Cartilla no coincide con el DNI" };
      }

      if (paciente.Num_Telefono !== telefono) {
        return { valido: false, error: "Teléfono no coincide con el DNI" };
      }

      if (!paciente.Activo) {
        return { valido: false, error: "Paciente no está activo" };
      }

      console.log(`[${new Date().toLocaleTimeString()}] Paciente validado correctamente`);
      return { valido: true, paciente };

    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error:`, error.message);
      return { valido: false, error: error.message };
    }
  },

  async obtenerPorUltimos4Digitos(ultimos4: string): Promise<any | null> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Buscando por últimos 4 dígitos:`, ultimos4);

      const q = query(
        collection(db, 'PACIENTES'),
        limit(100)
      );

      const querySnapshot = await getDocs(q);

      // Filtrar en cliente
      for (const doc of querySnapshot.docs) {
        const paciente = doc.data();
        if (paciente.Num_Cartilla?.slice(-4).toUpperCase() === ultimos4.toUpperCase()) {
          console.log(`[${new Date().toLocaleTimeString()}] Encontrado:`, paciente.Nombre_Paciente);
          return paciente;
        }
      }

      console.log(`[${new Date().toLocaleTimeString()}] No encontrado`);
      return null;
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] Error:`, error.message);
      return null;
    }
  }
};