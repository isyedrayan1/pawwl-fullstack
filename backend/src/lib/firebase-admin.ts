import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';

import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Possible locations for the file (works for both local and Hostinger production)
const possiblePaths = [
  path.resolve(process.cwd(), '.firebase-service-account.json'),
  path.resolve(process.cwd(), 'backend', '.firebase-service-account.json'),
  path.resolve(__dirname, '../../../../.firebase-service-account.json'),
  path.resolve(__dirname, '../../../../backend/.firebase-service-account.json')
];

let serviceAccountPath = possiblePaths[0];
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    serviceAccountPath = p;
    break;
  }
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
