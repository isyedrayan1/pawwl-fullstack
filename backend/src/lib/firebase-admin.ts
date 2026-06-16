import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';

const serviceAccountPath = path.resolve(process.cwd(), '.firebase-service-account.json');

let auth: any = null;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // 1. Enterprise Solution: Parse the JSON string directly from the Environment Variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    initializeApp({
      credential: cert(serviceAccount),
    });
    console.log('[auth] Firebase Admin initialized via Environment Variable');
  } else {
    // 2. Local Fallback: Look for the file on your local machine
    initializeApp({
      credential: cert(serviceAccountPath),
    });
    console.log('[auth] Firebase Admin initialized via local JSON file');
  }
  
  auth = getAuth();
} catch (error: any) {
  console.error('[auth] Failed to initialize Firebase Admin. Auth will be disabled.', error.message);
}

export { auth };
