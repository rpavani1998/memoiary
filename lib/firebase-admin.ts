import { getApps, initializeApp, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.GCP_PROJECT || "genai-academy-504808";
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const localConfig = require("../firebase-applet-config.json");
  if (localConfig?.projectId) {
    projectId = localConfig.projectId;
  }
} catch {
  // Gracefully fallback when building in Docker / Cloud Build
}

// Initialize Admin SDK modularly
const app = getApps().length === 0
  ? initializeApp({ projectId })
  : getApp();

export const adminAuth = getAuth(app);

/**
 * Extracts and verifies the Firebase Auth ID Token from the Request Authorization header.
 * Returns the decoded token containing uid, email, etc., or null if verification fails.
 */
export async function verifyUserToken(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const idToken = authHeader.split("Bearer ")[1];
    if (!idToken) {
      return null;
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying Firebase Auth ID token:", error);
    return null;
  }
}
