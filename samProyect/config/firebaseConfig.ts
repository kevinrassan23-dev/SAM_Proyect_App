import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;

const timestamp = () => new Date().toLocaleTimeString();

console.log(`[${timestamp()}] [Firebase-Env] API_KEY: ${apiKey ? ' OK' : ' FALTANTE'}`);
console.log(`[${timestamp()}] [Firebase-Env] PROJECT_ID: ${projectId ?? ' FALTANTE'}`);
console.log(`[${timestamp()}] [Firebase-Env] APP_ID: ${appId ?? ' FALTANTE'}`);

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

const app = initializeApp(firebaseConfig);
console.log(`[${timestamp()}] [Firebase] Instancia de App creada.`);

export const db = getFirestore(app);
console.log(`[${timestamp()}] [Firebase] Firestore inicializado.`);

export const functions = getFunctions(app, 'europe-west1');
console.log(`[${timestamp()}] [Firebase] Cloud Functions inicializado (europe-west1).`);

export const auth = getAuth(app);
console.log(`[${timestamp()}] [Firebase] Auth inicializado.`);

console.log(`[${timestamp()}] [Firebase] App inicializada correctamente en región europe-west1`);

export { firebaseConfig };