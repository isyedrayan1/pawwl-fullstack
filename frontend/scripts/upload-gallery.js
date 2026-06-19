import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { S3Client, PutObjectCommand, ListBucketsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env credentials from backend
dotenv.config({ path: path.resolve(__dirname, "../../backend/.env") });

const r2AccountId = process.env.R2_ACCOUNT_ID;
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

// New frontend public domain provided
const r2PublicUrl = "https://pub-5d58ad108d93401eaa1c5d97111289f7.r2.dev";

if (!r2AccountId || !r2AccessKeyId || !r2SecretAccessKey) {
  console.error("Error: Missing R2 credentials in backend/.env!");
  process.exit(1);
}

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
  },
});

const assetsDir = path.resolve(__dirname, "../src/assets");
const outputJsonPath = path.resolve(__dirname, "../src/data/gallery-links.json");

// Helper to recursively find files
function getFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFilesRecursively(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

async function main() {
  console.log("Connecting to Cloudflare R2...");
  
  // 1. Verify bucket name spelling
  const bucketsResult = await r2Client.send(new ListBucketsCommand({}));
  const buckets = bucketsResult.Buckets?.map(b => b.Name) || [];
  
  // Choose either pawwlfront or pawwlfornt based on what actually exists in the account
  let targetBucket = "pawwlfront";
  if (buckets.includes("pawwlfornt")) {
    targetBucket = "pawwlfornt";
  } else if (buckets.includes("pawwlfront")) {
    targetBucket = "pawwlfront";
  } else {
    // Fallback to pawwlfront
    console.warn(`Warning: Could not find pawwlfront or pawwlfornt in R2 buckets list: ${buckets.join(", ")}. Using default 'pawwlfront'.`);
  }
  
  console.log(`Using bucket: "${targetBucket}"`);

  // 2. Locate files to upload
  const galleryDir = path.join(assetsDir, "gallery");
  const newGalleryDir = path.join(assetsDir, "Newgallery");

  const filesToUpload = [];
  if (fs.existsSync(galleryDir)) {
    getFilesRecursively(galleryDir, filesToUpload);
  }
  if (fs.existsSync(newGalleryDir)) {
    getFilesRecursively(newGalleryDir, filesToUpload);
  }

  // Filter out any backup files ending in -old.webp
  const activeFiles = filesToUpload.filter(
    (filePath) => !filePath.toLowerCase().endsWith("-old.webp")
  );

  console.log(`Found ${activeFiles.length} files to upload.`);

  const r2Urls = [];

  for (const filePath of activeFiles) {
    // Determine the key relative to src/assets (e.g. gallery/1.webp or Newgallery/image.png)
    const relativePath = path.relative(assetsDir, filePath).replace(/\\/g, "/");
    const fileBuffer = fs.readFileSync(filePath);

    // Map MIME types
    const ext = path.extname(filePath).toLowerCase();
    let contentType = "image/jpeg";
    if (ext === ".png") contentType = "image/png";
    else if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".gif") contentType = "image/gif";
    else if (ext === ".mp4") contentType = "video/mp4";
    else if (ext === ".webm") contentType = "video/webm";
    else if (ext === ".mov") contentType = "video/quicktime";

    try {
      console.log(`Uploading ${relativePath}...`);
      await r2Client.send(
        new PutObjectCommand({
          Bucket: targetBucket,
          Key: relativePath,
          Body: fileBuffer,
          ContentType: contentType,
        })
      );
      
      const fileUrl = `${r2PublicUrl}/${relativePath}`;
      r2Urls.push(fileUrl);
      console.log(`  Uploaded successfully -> ${fileUrl}`);
    } catch (err) {
      console.error(`  [Error] Failed to upload ${relativePath}:`, err.message);
    }
  }

  // Sort URLs to keep masonry layout stable
  r2Urls.sort((a, b) => {
    const nameA = a.split("/").pop() || "";
    const nameB = b.split("/").pop() || "";
    return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: "base" });
  });

  // Exclude non-webp duplicate images if a webp exists (mimicking original code filter)
  const finalUrls = r2Urls.filter((src, index, self) => {
    if (src.toLowerCase().endsWith(".webp")) return true;
    const isImage = src.match(/\.(jpeg|jpg|png)$/i);
    if (isImage) {
      const basePath = src.split(".").slice(0, -1).join(".");
      const hasWebp = self.some(
        (other) => other.toLowerCase().endsWith(".webp") && other.startsWith(basePath)
      );
      return !hasWebp;
    }
    if (src.toLowerCase().endsWith(".mov")) {
      const basePath = src.split(".").slice(0, -1).join(".");
      const hasMp4 = self.some(
        (other) => other.toLowerCase().endsWith(".mp4") && other.startsWith(basePath)
      );
      return !hasMp4;
    }
    return true;
  });

  // Ensure output directory exists
  const outputDir = path.dirname(outputJsonPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 3. Write data file
  fs.writeFileSync(outputJsonPath, JSON.stringify(finalUrls, null, 2));
  console.log(`--------------------------------------------------`);
  console.log(`Gallery links saved successfully to: ${outputJsonPath}`);
  console.log(`Total active gallery assets: ${finalUrls.length}`);
  console.log(`--------------------------------------------------`);
}

main().catch(console.error);
