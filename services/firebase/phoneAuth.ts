import { auth } from '@/config/firebaseConfig';
import {
  PhoneAuthProvider,
  signInWithCredential,
} from 'firebase/auth';

let verificationId: string = '';

export const phoneAuthService = {
  /**
   * Enviar OTP por SMS
   * @param telefono - Número con código país (+34666666667)
   * @param recaptchaVerifier - Ref del FirebaseRecaptchaVerifierModal de Expo
   */
  async generarOTP(telefono: string, recaptchaVerifier: any): Promise<any> {
    try {
      if (!telefono) {
        throw new Error('Teléfono requerido');
      }

      if (!recaptchaVerifier) {
        throw new Error('ReCAPTCHA verifier no disponible');
      }

      console.log(`[${new Date().toLocaleTimeString()}] Solicitando código para: ${telefono}`);

      const provider = new PhoneAuthProvider(auth);
      
      verificationId = await provider.verifyPhoneNumber(
        telefono,
        recaptchaVerifier
      );

      console.log(`[${new Date().toLocaleTimeString()}] Proceso de verificación iniciado`);

      return { exito: true, verificationId };
    } catch (error: any) {
      // ✅ ELIMINADO EL LOG DE ERROR: Solo registramos que se canceló o falló sin alarmar
      const isCancel = error.code === 'auth/captcha-check-failed' || error.message?.includes('cancel');
      
      if (isCancel) {
        console.log(`[${new Date().toLocaleTimeString()}] Verificación cancelada por el usuario`);
      } else {
        console.log(`[${new Date().toLocaleTimeString()}] Info Firebase SMS:`, error.code);
      }

      return {
        exito: false,
        mensaje: error.message || 'Error al enviar SMS',
        code: error.code,
      };
    }
  },

  /**
   * Verificar código OTP de 6 dígitos
   */
  async verificarOTP(codigoOTP: string): Promise<any> {
    try {
      if (!verificationId) {
        throw new Error('No hay sesión activa.');
      }

      if (!codigoOTP || codigoOTP.length !== 6) {
        throw new Error('Código no válido');
      }

      const credential = PhoneAuthProvider.credential(
        verificationId,
        codigoOTP
      );

      const resultado = await signInWithCredential(auth, credential);

      console.log(`[${new Date().toLocaleTimeString()}] Identidad confirmada`);
      verificationId = ''; 

      return {
        valido: true,
        usuario: resultado.user,
        mensaje: 'Verificación completada',
      };
    } catch (error: any) {
      // ✅ CAMBIADO: console.error por un log discreto
      console.log(`[${new Date().toLocaleTimeString()}] Intento de OTP fallido:`, error.code);
      return {
        valido: false,
        mensaje: error.message || 'Código incorrecto',
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await auth.signOut();
      verificationId = '';
      console.log(`[${new Date().toLocaleTimeString()}] Sesión finalizada`);
    } catch (error: any) {
      // ✅ SILENCIADO: Solo log informativo
      console.log(`[${new Date().toLocaleTimeString()}] Info Logout:`, error.message);
    }
  },

  getCurrentUser() {
    return auth.currentUser;
  },

  resetVerification(): void {
    verificationId = '';
  },
};