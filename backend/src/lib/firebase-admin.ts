import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';

const serviceAccountPath = path.resolve(process.cwd(), '.firebase-service-account.json');

let auth: any = null;
try {
  initializeApp({
    credential: cert(serviceAccountPath),
  });
  auth = getAuth();
  console.log('[auth] Firebase Admin initialized successfully');
} catch (error: any) {
  console.error('[auth] Failed to initialize Firebase Admin. Auth will be disabled.', error.message);
}

export { auth };
