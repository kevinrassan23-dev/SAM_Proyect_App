import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE_PEDIDOS = 'rate_limit_pedidos';
const CLAVE_SESION = 'rate_limit_sesion_id';
const MAX_PEDIDOS_POR_NOMBRE = 2;
// 1 hora
const DURACION_BLOQUEO_MS = 3600 * 1000;

interface RegistroPedido {
  nombreNormalizado: string;
  timestamps: number[];
  expiraEn: number;
  // Identificador único (DNI o debug_user)
  sesionId: string;
}

export const rateLimitService = {

  /**
   * Establece el ID de la sesión actual en el almacenamiento local
   */
  async iniciarSesion(sesionId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(CLAVE_SESION, sesionId);
      console.log(`[${new Date().toLocaleTimeString()}] [rateLimit] Sesión iniciada: ${sesionId}`);
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [rateLimit] Error al iniciar sesión:`, error.message);
    }
  },

  /**
   * Recupera el ID de sesión activo, devolviendo 'debug_user' si no existe ninguno
   */
  async obtenerSesionId(): Promise<string> {
    const stored = await AsyncStorage.getItem(CLAVE_SESION);
    return stored ?? 'debug_user';
  },

  /**
   * Limpia registros previos de debug e inicia una sesión limpia con el nuevo ID (DNI)
   */
  async resetearSesion(nuevoId: string): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(CLAVE_PEDIDOS);
      if (raw) {
        const registros: RegistroPedido[] = JSON.parse(raw);
        // Eliminamos rastros de sesiones de prueba para no mezclar límites
        const limpios = registros.filter(r => r.sesionId !== 'debug_user');
        await AsyncStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(limpios));
      }
      await this.iniciarSesion(nuevoId);
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [rateLimit] Error al resetear sesión:`, error.message);
    }
  },

  /**
   * Registra la compra de medicamentos y activa el bloqueo si se alcanza el máximo permitido
   */
  async registrarPedido(nombresMedicamentos: string[]): Promise<void> {
    try {
      const sesionId = await this.obtenerSesionId();
      const raw = await AsyncStorage.getItem(CLAVE_PEDIDOS);
      const registros: RegistroPedido[] = raw ? JSON.parse(raw) : [];
      const ahora = Date.now();

      nombresMedicamentos.forEach(nombre => {
        const normalizado = nombre.toLowerCase().trim();
        const existente = registros.find(
          r => r.nombreNormalizado === normalizado && r.sesionId === sesionId
        );

        if (existente) {
          existente.timestamps.push(ahora);
          if (existente.timestamps.length >= MAX_PEDIDOS_POR_NOMBRE) {
            existente.expiraEn = ahora + DURACION_BLOQUEO_MS;
          }
        } else {
          registros.push({
            nombreNormalizado: normalizado,
            timestamps: [ahora],
            expiraEn: ahora + DURACION_BLOQUEO_MS,
            sesionId
          });
        }
      });

      await AsyncStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(registros));
      console.log(`[${new Date().toLocaleTimeString()}] [rateLimit] Pedido registrado para sesión: ${sesionId}`);
    } catch (error: any) {
      console.error(`[${new Date().toLocaleTimeString()}] [rateLimit] Error registrando pedido:`, error.message);
    }
  },

  /**
   * Retorna un Set con los nombres de medicamentos que tienen un bloqueo activo
   */
  async obtenerNombresBloqueados(): Promise<Set<string>> {
    try {
      const sesionId = await this.obtenerSesionId();
      const raw = await AsyncStorage.getItem(CLAVE_PEDIDOS);
      if (!raw) return new Set();

      const registros: RegistroPedido[] = JSON.parse(raw);
      const ahora = Date.now();

      const bloqueados = registros
        .filter(r => 
          r.sesionId === sesionId && 
          r.timestamps.length >= MAX_PEDIDOS_POR_NOMBRE && 
          r.expiraEn > ahora
        )
        .map(r => r.nombreNormalizado);

      return new Set(bloqueados);
    } catch (error: any) {
      return new Set();
    }
  },

  /**
   * Mantenimiento: elimina del almacenamiento local los bloqueos cuya fecha ya expiró
   */
  async limpiarExpirados(): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(CLAVE_PEDIDOS);
      if (!raw) return;
      const ahora = Date.now();
      const vigentes = (JSON.parse(raw) as RegistroPedido[]).filter(r => r.expiraEn > ahora);
      await AsyncStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(vigentes));
    } catch (error: any) {}
  }
};