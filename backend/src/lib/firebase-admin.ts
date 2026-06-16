import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';

import fs from 'fs';

let serviceAccountPath = path.resolve(process.cwd(), '.firebase-service-account.json');
if (!fs.existsSync(serviceAccountPath)) {
  serviceAccountPath = path.resolve(process.cwd(), 'backend', '.firebase-service-account.json');
}

let auth: any = null;
try {
  initializeApp({
    credential: cert(serviceAccountPath),
  });
  console.log('[auth] Firebase Admin initialized successfully via local JSON file');
  
  auth = getAuth();
} catch (error: any) {
  console.error('[auth] Failed to initialize Firebase Admin. Auth will be disabled.', error.message);
}

export { auth };
