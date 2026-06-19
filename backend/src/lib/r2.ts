import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "./env.js";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.r2AccessKeyId,
    secretAccessKey: env.r2SecretAccessKey,
  },
});

/**
 * Uploads a file buffer to Cloudflare R2
 * @param fileBuffer - Raw buffer of the file
 * @param originalName - Original filename
 * @param contentType - MIME type of the file
 */
export async function uploadToR2(
  fileBuffer: Buffer,
  originalName: string,
  contentType: string
): Promise<string> {
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `products/${Date.now()}-${sanitizedName}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: env.r2BucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    })
  );

  return `${env.r2PublicUrl}/${key}`;
}

/**
 * Deletes an object from Cloudflare R2 based on its URL
 * @param fileUrl - Full public URL of the object
 */
export async function deleteFromR2(fileUrl: string): Promise<void> {
  // Extract key from URL
  const marker = `/${env.r2BucketName}/`;
  let key = "";
  if (fileUrl.includes(marker)) {
    key = fileUrl.split(marker)[1];
  } else {
    // If it is the public custom domain or direct public URL
    const urlObj = new URL(fileUrl);
    key = urlObj.pathname.startsWith("/") ? urlObj.pathname.substring(1) : urlObj.pathname;
  }

  if (!key) return;

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: env.r2BucketName,
      Key: key,
    })
  );
}
