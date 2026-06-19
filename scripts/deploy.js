import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Retrieve commit message from arguments
const commitMessage = process.argv.slice(2).join(' ').trim();

if (!commitMessage) {
  console.error('\x1b[31mError: You must provide a commit message!\x1b[0m');
  console.log('Usage: npm run deploy -- "Your commit message here"');
  process.exit(1);
}

try {
  console.log('\n\x1b[36m=== 1. Building Frontend Locally ===\x1b[0m');
  execSync('npm run frontend:build', { cwd: rootDir, stdio: 'inherit' });

  console.log('\n\x1b[36m=== 2. Staging Files (git add .) ===\x1b[0m');
  execSync('git add .', { cwd: rootDir, stdio: 'inherit' });

  console.log('\n\x1b[36m=== 3. Committing Changes ===\x1b[0m');
  execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { cwd: rootDir, stdio: 'inherit' });

  console.log('\n\x1b[36m=== 4. Pushing to GitHub (git push) ===\x1b[0m');
  execSync('git push', { cwd: rootDir, stdio: 'inherit' });

  console.log('\n\x1b[32m✔ Successfully built and deployed to GitHub!\x1b[0m\n');
} catch (error) {
  console.error('\n\x1b[31m❌ Deployment failed:\x1b[0m', error.message);
  process.exit(1);
}
