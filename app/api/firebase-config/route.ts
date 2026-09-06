import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getValidString(val: string | undefined, fallback: string): string {
  if (!val || val === "undefined" || val === "null" || val === "YOUR_FIREBASE_API_KEY" || val.trim() === "") {
    return fallback;
  }
  return val;
}

export async function GET() {
  let localConfig: any = {};
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    localConfig = require("@/firebase-applet-config.json");
  } catch {
    // Optional local file fallback
  }

  const config = {
    apiKey: getValidString(process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY || localConfig.apiKey, "AIzaSyDPdnip1YIn3ZL-POrzRiSrSZ3h6Nd9KFQ"),
    authDomain: getValidString(process.env.FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || localConfig.authDomain, "genai-academy-504808.firebaseapp.com"),
    projectId: getValidString(process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || localConfig.projectId, "genai-academy-504808"),
    appId: getValidString(process.env.FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID || localConfig.appId, "1:122874706722:web:a21a70136cc871f251c37b"),
    firestoreDatabaseId: getValidString(process.env.FIREBASE_DATABASE_ID || process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || localConfig.firestoreDatabaseId, "ai-studio-7870bce0-985b-40b5-8d10-e069e644a452"),
    storageBucket: getValidString(process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket, "genai-academy-504808.firebasestorage.app"),
    messagingSenderId: "122874706722"
  };

  return NextResponse.json(config);
}
