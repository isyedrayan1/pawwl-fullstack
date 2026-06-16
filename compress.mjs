import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const assetsDir = path.join(__dirname, 'frontend/src/assets');
const srcDir = path.join(__dirname, 'frontend/src');

// Walk through directory recursively
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

// Filter files
const mp4Files = allFiles.filter(f => f.endsWith('.mp4') && !f.includes('_compressed') && fs.statSync(f).size > 1024 * 1024);
const webpFiles = allFiles.filter(f => f.endsWith('.webp') && !f.includes('-old') && !f.includes('_compressed') && fs.statSync(f).size > 500 * 1024); // only larger than 500KB

const replaceMap = [];

async function compressImage(file) {
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  const dir = path.dirname(file);
  const newFile = path.join(dir, `${base}_compressed${ext}`);
  
  console.log(`Compressing image: ${path.basename(file)}`);
  await sharp(file)
    .webp({ quality: 85 })
    .toFile(newFile);
    
  replaceMap.push({ old: path.basename(file), new: path.basename(newFile) });
}

function compressVideo(file) {
  return new Promise((resolve, reject) => {
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    const dir = path.dirname(file);
    const newFile = path.join(dir, `${base}_compressed${ext}`);
    
    console.log(`Compressing video: ${path.basename(file)}...`);
    ffmpeg(file)
      .outputOptions([
        '-c:v libx264',
        '-crf 23',
        '-preset fast',
        '-c:a aac',
        '-b:a 128k'
      ])
      .save(newFile)
      .on('end', () => {
        console.log(`Finished video: ${path.basename(file)}`);
        replaceMap.push({ old: path.basename(file), new: path.basename(newFile) });
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error compressing ${path.basename(file)}`, err);
        reject(err);
      });
  });
}

async function run() {
  console.log(`Found ${mp4Files.length} large videos and ${webpFiles.length} large images.`);
  
  for (const img of webpFiles) {
    await compressImage(img);
  }
  
  for (const vid of mp4Files) {
    await compressVideo(vid);
  }
  
  console.log('--- Updating Code References ---');
  const srcFiles = walkSync(srcDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
  
  for (const srcFile of srcFiles) {
    let content = fs.readFileSync(srcFile, 'utf8');
    let changed = false;
    for (const mapping of replaceMap) {
      if (content.includes(mapping.old)) {
        content = content.replaceAll(mapping.old, mapping.new);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(srcFile, content, 'utf8');
      console.log(`Updated references in ${path.basename(srcFile)}`);
    }
  }
  
  console.log('All compression and code updates finished successfully!');
}

run().catch(console.error);
