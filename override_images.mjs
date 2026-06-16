import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, 'frontend/src/assets');

function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      filelist.push(dirFile);
    }
  }
  return filelist;
}

const allFiles = walkSync(assetsDir);
let replacedCount = 0;

for (const file of allFiles) {
  if (file.endsWith('_compressed.webp')) {
    const originalFile = file.replace('_compressed.webp', '.webp');
    // Overwrite the original file with the compressed one
    fs.renameSync(file, originalFile);
    replacedCount++;
  }
}

console.log(`Successfully overwrote ${replacedCount} original images with their highly-optimized versions!`);
