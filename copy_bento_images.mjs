import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const destDir = path.join(__dirname, 'frontend/src/assets/home/servbento');

const images = [
  {
    src: path.join(__dirname, 'backend/products/1176/1.webp'),
    dest: path.join(destDir, 'card3_product.webp')
  },
  {
    src: path.join(__dirname, 'backend/products/1005/AW_BL37_3D_Bellotta_Tuna_ToppingShrimp_N__Pouch_Front_150D1V7_Revise.webp'),
    dest: path.join(destDir, 'card4_product.webp')
  },
  {
    src: path.join(__dirname, 'backend/products/1011/Frame_344685036_1800x1800.webp'),
    dest: path.join(destDir, 'card5_product.webp')
  },
  {
    src: path.join(__dirname, 'backend/products/1018/Gnawlers_23.webp'),
    dest: path.join(destDir, 'card6_product.webp')
  }
];

images.forEach(img => {
  if (fs.existsSync(img.src)) {
    fs.copyFileSync(img.src, img.dest);
    console.log(`Copied ${path.basename(img.src)} to ${img.dest}`);
  } else {
    console.error(`Source not found: ${img.src}`);
  }
});

const componentFile = path.join(__dirname, 'frontend/src/components/FeaturedProducts.tsx');
let content = fs.readFileSync(componentFile, 'utf8');

// Replace the backend URLs with local imports
content = content.replace('import bentolast from "@/assets/home/servbento/bentolast.svg";', 
`import bentolast from "@/assets/home/servbento/bentolast.svg";
import card3img from "@/assets/home/servbento/card3_product.webp";
import card4img from "@/assets/home/servbento/card4_product.webp";
import card5img from "@/assets/home/servbento/card5_product.webp";
import card6img from "@/assets/home/servbento/card6_product.webp";`);

content = content.replace('// Card 3 — Whiskas Tuna & White Fish (1176)\nconst card3img = `${API_BASE}/products/1176/1.webp`;', '// Card 3 local import');
content = content.replace('// Card 4 — Bellotta Shrimp Jelly Pouch (1005)\nconst card4img = `${API_BASE}/products/1005/AW_BL37_3D_Bellotta_Tuna_ToppingShrimp_N__Pouch_Front_150D1V7_Revise.webp`;', '// Card 4 local import');
content = content.replace('// Card 5 — Creamy Treat Bonito Tubes (1011)\nconst card5img = `${API_BASE}/products/1011/Frame_344685036_1800x1800.webp`;', '// Card 5 local import');
content = content.replace('// Card 6 — Crunchy & Tender Chicken Jerky (1018)\nconst card6img = `${API_BASE}/products/1018/Gnawlers_23.webp`;', '// Card 6 local import');

fs.writeFileSync(componentFile, content, 'utf8');
console.log('Updated FeaturedProducts.tsx to use local images!');
