/**
 * Upload SVG illustrations to Tencent Cloud COS.
 *
 * Usage:
 *   npx tsx scripts/upload-illustrations.ts [article-slug]
 *
 * Directory structure (local):
 *   illustrations/
 *     what-is-claude/
 *       cover.svg
 *       diagram-1.svg
 *       diagram-2.svg
 *     choose-model/
 *       cover.svg
 *       ...
 *
 * COS key structure:
 *   illustrations/{article-slug}/cover.svg
 *   illustrations/{article-slug}/diagram-1.svg
 *
 * If article-slug is provided, only uploads that article's illustrations.
 * Otherwise, uploads all illustrations found under illustrations/.
 *
 * Environment variables required:
 *   TENCENT_SECRET_ID, TENCENT_SECRET_KEY, TENCENT_COS_BUCKET, TENCENT_COS_REGION
 */

import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { join } from "path";
import COS from "cos-nodejs-sdk-v5";
import { config } from "dotenv";

// Load env from web app (where Tencent credentials are configured)
config({ path: join(process.cwd(), "apps/web/.env") });
config({ path: join(process.cwd(), "apps/web/.env.local") });

const ILLUSTRATIONS_DIR = join(process.cwd(), "illustrations");

function getCOS(): COS {
  return new COS({
    SecretId: process.env.TENCENT_SECRET_ID!,
    SecretKey: process.env.TENCENT_SECRET_KEY!,
  });
}

async function uploadFile(
  cos: COS,
  localPath: string,
  cosKey: string,
): Promise<string> {
  const bucket = process.env.TENCENT_COS_BUCKET!;
  const region = process.env.TENCENT_COS_REGION!;
  const buffer = readFileSync(localPath);

  await new Promise<void>((resolve, reject) => {
    cos.putObject(
      {
        Bucket: bucket,
        Region: region,
        Key: cosKey,
        Body: buffer,
        ContentType: "image/svg+xml",
      },
      (err) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });

  return `https://${bucket}.cos.${region}.myqcloud.com/${cosKey}`;
}

async function uploadArticleIllustrations(
  cos: COS,
  slug: string,
): Promise<number> {
  const dir = join(ILLUSTRATIONS_DIR, slug);

  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    console.log(`  SKIP: ${slug} (no illustrations directory)`);
    return 0;
  }

  const files = readdirSync(dir).filter((f) => f.endsWith(".svg"));

  if (files.length === 0) {
    console.log(`  SKIP: ${slug} (no SVG files)`);
    return 0;
  }

  let uploaded = 0;
  for (const file of files) {
    const localPath = join(dir, file);
    const cosKey = `illustrations/${slug}/${file}`;
    const url = await uploadFile(cos, localPath, cosKey);
    console.log(`  UPLOAD: ${cosKey} → ${url}`);
    uploaded++;
  }

  return uploaded;
}

async function main() {
  const targetSlug = process.argv[2];

  // Validate env
  for (const key of [
    "TENCENT_SECRET_ID",
    "TENCENT_SECRET_KEY",
    "TENCENT_COS_BUCKET",
    "TENCENT_COS_REGION",
  ]) {
    if (!process.env[key]) {
      console.error(`Missing environment variable: ${key}`);
      process.exit(1);
    }
  }

  if (!existsSync(ILLUSTRATIONS_DIR)) {
    console.error(
      `Illustrations directory not found: ${ILLUSTRATIONS_DIR}`,
    );
    console.error("Create it and add SVG files organized by article slug.");
    process.exit(1);
  }

  const cos = getCOS();
  let totalUploaded = 0;

  if (targetSlug) {
    console.log(`Uploading illustrations for: ${targetSlug}`);
    totalUploaded = await uploadArticleIllustrations(cos, targetSlug);
  } else {
    const slugDirs = readdirSync(ILLUSTRATIONS_DIR).filter((d) =>
      statSync(join(ILLUSTRATIONS_DIR, d)).isDirectory(),
    );
    console.log(
      `Uploading illustrations for ${slugDirs.length} articles...`,
    );

    for (const slug of slugDirs) {
      const count = await uploadArticleIllustrations(cos, slug);
      totalUploaded += count;
    }
  }

  console.log(`\nDone: ${totalUploaded} files uploaded.`);
}

main().catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});
