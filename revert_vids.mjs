import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'frontend/src');
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

const srcFiles = walkSync(srcDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

for (const srcFile of srcFiles) {
  let content = fs.readFileSync(srcFile, 'utf8');
  if (content.includes('_compressed.mp4')) {
    content = content.replaceAll('_compressed.mp4', '.mp4');
    fs.writeFileSync(srcFile, content, 'utf8');
    console.log(`Reverted videos in ${path.basename(srcFile)}`);
  }
}

const allFiles = walkSync(assetsDir);
for (const file of allFiles) {
  if (file.endsWith('_compressed.mp4')) {
    fs.unlinkSync(file);
    console.log(`Deleted inefficient compression: ${path.basename(file)}`);
  }
}
