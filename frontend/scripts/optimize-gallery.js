import sharp from 'sharp';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';

// Directories to process
const searchPaths = ['src/assets/Newgallery'];
const outputBaseDirName = 'optimized';

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function optimize() {
  console.log(chalk.blue.bold('\n🚀 Starting In-Place Media Compression...'));
  console.log(chalk.gray('Strategy: Original -> [name]-old.webp | Compressed -> [name].webp\n'));
  
  for (const inputBaseDir of searchPaths) {
    if (!(await fs.pathExists(inputBaseDir))) {
        console.log(chalk.red(`❌ Folder not found: ${inputBaseDir}`));
        continue;
    }

    console.log(chalk.magenta(`📂 Scanning folder: ${inputBaseDir}`));

    // Find all webp files, but ignore the ones we've already renamed to -old
    const files = await glob(`${inputBaseDir}/**/*.webp`, {
      ignore: [`**/*-old.webp`, `**/node_modules/**`]
    });
    
    console.log(chalk.gray(`Found ${files.length} potential files to compress.\n`));

    for (const file of files) {
      const oldSize = (await fs.stat(file)).size;
      
      // Only compress if it's actually large (> 1MB) to avoid re-compressing small icons
      if (oldSize < 1024 * 1024) {
          continue;
      }

      const ext = path.extname(file);
      const dir = path.dirname(file);
      const baseName = path.basename(file, ext);
      const oldFilePath = path.join(dir, `${baseName}-old${ext}`);

      // If -old version already exists, skip to avoid overwriting or infinite loops
      if (await fs.pathExists(oldFilePath)) {
          console.log(chalk.gray(`⏭️  Already have old version for: ${baseName}${ext}`));
          continue;
      }

      console.log(chalk.cyan(`📦 Processing: ${baseName}${ext} (${formatSize(oldSize)})`));
      
      try {
        // 1. Move original to -old
        await fs.move(file, oldFilePath);
        
        // 2. Compress the -old file into the original filename
        await sharp(oldFilePath)
          .webp({ quality: 90, effort: 6, smartSubsample: true })
          .toFile(file);

        const newSize = (await fs.stat(file)).size;
        const saved = ((oldSize - newSize) / oldSize * 100).toFixed(1);
        console.log(chalk.green(`✅ Success: ${baseName}${ext} (${formatSize(newSize)}, -${saved}%)`));
      } catch (err) {
        console.error(chalk.red(`❌ Error processing ${baseName}:`), err.message);
        // If it failed, try to move the original back if it was moved
        if (await fs.pathExists(oldFilePath) && !(await fs.pathExists(file))) {
            await fs.move(oldFilePath, file);
        }
      }
    }
  }

  console.log(chalk.blue.bold('\n✨ All assets compressed in-place!'));
  console.log(chalk.yellow('No code changes needed as filenames were preserved.'));
}

optimize().catch(console.error);
