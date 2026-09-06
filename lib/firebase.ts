import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let rawConfig: any = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "genai-academy-504808",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || "1:122874706722:web:a21a70136cc871f251c37b",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || "genai-academy-504808.firebaseapp.com",
  firestoreDatabaseId: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || process.env.FIREBASE_DATABASE_ID || "ai-studio-7870bce0-985b-40b5-8d10-e069e644a452",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || "genai-academy-504808.firebasestorage.app",
  messagingSenderId: "122874706722"
};

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const localConfig = require("../firebase-applet-config.json");
  if (localConfig) {
    rawConfig = { ...rawConfig, ...localConfig };
  }
} catch {
  // Gracefully fallback when building in Docker / Cloud Build
}

const firebaseConfig = rawConfig;

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore with the provisioned database ID
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || 'default');

/**
 * Dynamically fetches Cloud Run secrets / server config from /api/firebase-config
 * to update client-side Firebase app if the initial apiKey was unconfigured.
 */
export async function ensureClientFirebaseConfig(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  
  const currentKey = (app.options as any)?.apiKey;
  if (currentKey && currentKey !== "YOUR_FIREBASE_API_KEY") {
    return true; // Already configured
  }

  try {
    const res = await fetch("/api/firebase-config");
    if (res.ok) {
      const serverConfig = await res.json();
      if (serverConfig?.apiKey && serverConfig.apiKey !== "YOUR_FIREBASE_API_KEY") {
        (app.options as any).apiKey = serverConfig.apiKey;
        if (serverConfig.authDomain) (app.options as any).authDomain = serverConfig.authDomain;
        if (serverConfig.projectId) (app.options as any).projectId = serverConfig.projectId;
        return true;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch dynamic server Firebase config:", err);
  }
  return false;
}

export { app, auth, db, GoogleAuthProvider };
