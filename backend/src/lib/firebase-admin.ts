import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';

import { env } from './env.js';

const serviceAccountPath = path.resolve(process.cwd(), '.firebase-service-account.json');

let auth: any = null;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // 1. Production Mode: Decode the safe Base64 string back into JSON
    const jsonString = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf8');
    const serviceAccount = JSON.parse(jsonString);
    initializeApp({
      credential: cert(serviceAccount),
    });
    console.log('[auth] Firebase Admin initialized via Safe Base64 Environment Variable');
  } else {
    // 2. Local Development Mode: Use the file on disk
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
