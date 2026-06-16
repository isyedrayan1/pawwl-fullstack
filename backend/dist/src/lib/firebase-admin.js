import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';
const serviceAccountPath = path.resolve(process.cwd(), '.firebase-service-account.json');
try {
    initializeApp({
        credential: cert(serviceAccountPath),
    });
    console.log('[auth] Firebase Admin initialized successfully');
}
catch (error) {
    console.error('[auth] Failed to initialize Firebase Admin:', error);
}
export const auth = getAuth();
