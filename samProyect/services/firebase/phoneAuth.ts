import { auth } from '@/config/firebaseConfig';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

let verificationId: string = '';

export const phoneAuthService = {
  
  /**
   * Inicia el proceso de envío de SMS mediante Firebase
   */
  async generarOTP(telefono: string, recaptchaVerifier: any): Promise<any> {
    try {
      if (!telefono || !recaptchaVerifier) throw new Error('Parámetros insuficientes para SMS');

      console.log(`[${new Date().toLocaleTimeString()}] [phoneAuth] Solicitando SMS para: ${telefono}`);

      const provider = new PhoneAuthProvider(auth);
      verificationId = await provider.verifyPhoneNumber(telefono, recaptchaVerifier);

      console.log(`[${new Date().toLocaleTimeString()}] [phoneAuth] Verificación enviada exitosamente`);
      return { exito: true, verificationId };

    } catch (error: any) {
      const isCancel = error.code === 'auth/captcha-check-failed' || error.message?.includes('cancel');
      console.log(`[${new Date().toLocaleTimeString()}] [phoneAuth] Info: ${isCancel ? 'Cancelado por usuario' : error.code}`);
      
      return { exito: false, mensaje: error.message, code: error.code };
    }
  },

  /**
   * Valida el código OTP recibido y loguea al usuario
   */
  async verificarOTP(codigoOTP: string): Promise<any> {
    try {
      if (!verificationId) throw new Error('Sesión de verificación expirada');
      if (!codigoOTP || codigoOTP.length !== 6) throw new Error('Código inválido');

      const credential = PhoneAuthProvider.credential(verificationId, codigoOTP);
      const resultado = await signInWithCredential(auth, credential);

      console.log(`[${new Date().toLocaleTimeString()}] [phoneAuth] Identidad confirmada para UID: ${resultado.user.uid}`);
      verificationId = ''; 

      return { valido: true, usuario: resultado.user, mensaje: 'OK' };
    } catch (error: any) {
      console.log(`[${new Date().toLocaleTimeString()}] [phoneAuth] Fallo en OTP: ${error.code}`);
      return { valido: false, mensaje: error.message };
    }
  },

  /**
   * Cierra la sesión activa en Firebase Auth
   */
  async logout(): Promise<void> {
    try {
      await auth.signOut();
      verificationId = '';
      console.log(`[${new Date().toLocaleTimeString()}] [phoneAuth] Sesión cerrada`);
    } catch (error: any) {
      console.log(`[${new Date().toLocaleTimeString()}] [phoneAuth] Info Logout:`, error.message);
    }
  },

  getCurrentUser() { return auth.currentUser; },

  resetVerification(): void { verificationId = ''; }
};