import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { prisma } from "./lib/prisma.js";
import { env } from "./lib/env.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudflare R2 client initialization for direct key control
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.r2AccessKeyId,
    secretAccessKey: env.r2SecretAccessKey,
  },
});

// Root products folder path
const productsBaseDir = path.resolve(__dirname, "../products");

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function runMigration() {
  console.log("--------------------------------------------------");
  console.log("Starting Image Migration to Cloudflare R2...");
  console.log(`Searching products directory: ${productsBaseDir}`);
  console.log("--------------------------------------------------");

  if (!fs.existsSync(productsBaseDir)) {
    console.error(`Error: Products directory does not exist at ${productsBaseDir}`);
    process.exit(1);
  }

  // 1. Fetch all products
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products total in the database.`);

  let totalMigratedProducts = 0;
  let totalMigratedImages = 0;

  for (const product of products) {
    const images = parseJsonArray(product.images);
    const imagePaths = parseJsonArray(product.imagePaths);
    
    // Combine both list sources to find unique local paths
    const combinedPaths = Array.from(new Set([...images, ...imagePaths]));
    
    // Filter paths starting with /products/ and NOT already migrated to http/https
    const localPaths = combinedPaths.filter(
      p => p.startsWith("/products/") && !p.startsWith("http")
    );

    if (localPaths.length === 0) {
      continue;
    }

    console.log(`Product: "${product.name}" (${product.id}) has ${localPaths.length} local images to migrate.`);

    const newUrlsMap: Record<string, string> = {};
    let successCount = 0;

    for (const localPath of localPaths) {
      // localPath is like: "/products/1175/1.webp"
      // Remove leading slash for key and resolve local path
      const key = localPath.startsWith("/") ? localPath.substring(1) : localPath;
      const filePath = path.join(productsBaseDir, "..", localPath);

      if (!fs.existsSync(filePath)) {
        console.warn(`  [Warning] Local file not found on disk at: ${filePath}. Skipping.`);
        continue;
      }

      try {
        console.log(`  Uploading ${key} to R2...`);
        const fileBuffer = fs.readFileSync(filePath);
        
        // Simple content type mapping
        const ext = path.extname(key).toLowerCase();
        let contentType = "image/jpeg";
        if (ext === ".png") contentType = "image/png";
        else if (ext === ".webp") contentType = "image/webp";
        else if (ext === ".avif") contentType = "image/avif";
        else if (ext === ".gif") contentType = "image/gif";

        // Upload directly to preserve folder structure (e.g. products/1175/1.webp)
        await r2Client.send(
          new PutObjectCommand({
            Bucket: env.r2BucketName,
            Key: key,
            Body: fileBuffer,
            ContentType: contentType,
          })
        );

        const newR2Url = `${env.r2PublicUrl}/${key}`;
        newUrlsMap[localPath] = newR2Url;
        successCount++;
        totalMigratedImages++;
        console.log(`    Successfully uploaded. R2 URL: ${newR2Url}`);
      } catch (err: any) {
        console.error(`  [Error] Failed to upload ${key} to R2:`, err.message);
      }
    }

    if (successCount > 0) {
      // Map existing array items to the new URLs
      const updatedImages = images.map(p => newUrlsMap[p] || p);
      const updatedImagePaths = imagePaths.map(p => newUrlsMap[p] || p);

      // Update in database
      await prisma.product.update({
        where: { id: product.id },
        data: {
          images: JSON.stringify(updatedImages),
          imagePaths: JSON.stringify(updatedImagePaths),
        },
      });

      console.log(`  Successfully updated database records for "${product.name}".`);
      totalMigratedProducts++;
    }
  }

  console.log("--------------------------------------------------");
  console.log("Migration Complete!");
  console.log(`Total Products Updated: ${totalMigratedProducts}`);
  console.log(`Total Images Migrated to R2: ${totalMigratedImages}`);
  console.log("--------------------------------------------------");
}

runMigration()
  .catch((err) => {
    console.error("Migration fatal error:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
