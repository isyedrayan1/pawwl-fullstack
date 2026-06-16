import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';

import { env } from './env.js';

const serviceAccountPath = path.resolve(process.cwd(), '.firebase-service-account.json');

let auth: any = null;
try {
  if (env.firebaseProjectId && env.firebaseClientEmail && env.firebasePrivateKey) {
    // 1. Production Mode: Construct the credential from 3 safe Environment Variables
    initializeApp({
      credential: cert({
        projectId: env.firebaseProjectId,
        clientEmail: env.firebaseClientEmail,
        // The private key might have literal '\n' characters from the env variable, so we convert them to actual newlines
        privateKey: env.firebasePrivateKey.replace(/\\n/g, '\n'),
      }),
    });
    console.log('[auth] Firebase Admin initialized via 3 Safe Environment Variables');
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
