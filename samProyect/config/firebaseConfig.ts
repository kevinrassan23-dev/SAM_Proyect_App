import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

console.log("🔍 Firebase Config:");
console.log("✅ PROJECT_ID:", firebaseConfig.projectId ? "ENCONTRADO" : "❌ NO ENCONTRADO");
console.log("✅ API_KEY:", firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 20) + "..." : "❌ NO ENCONTRADO");
console.log("✅ AUTH_DOMAIN:", firebaseConfig.authDomain ? "ENCONTRADO" : "❌ NO ENCONTRADO");

if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
  throw new Error("❌ FALTAN VARIABLES DE ENTORNO EN .env.local");
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log("✅ Firebase inicializado correctamente");
console.log("📍 Proyecto:", firebaseConfig.projectId);
