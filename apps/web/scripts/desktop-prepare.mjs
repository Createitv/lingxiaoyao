/**
 * Patches source files for Next.js static export (output: 'export') compatibility.
 * Run BEFORE `next build` in the desktop build pipeline.
 * CI workspaces are disposable, so no restore step is needed.
 *
 * Strategy: aggressively remove server-dependent routes and patch remaining
 * pages for fully-static rendering.
 */
import { readFileSync, writeFileSync, rmSync, unlinkSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = join(__dirname, "..", "app");

let actions = 0;

function removeDir(rel) {
  const abs = join(appDir, rel);
  if (existsSync(abs)) {
    rmSync(abs, { recursive: true, force: true });
    actions++;
    console.log(`  rm -rf ${rel}/`);
  }
}

function removeFile(rel) {
  const abs = join(appDir, rel);
  try { unlinkSync(abs); actions++; console.log(`  rm     ${rel}`); } catch { /* skip */ }
}

function patch(rel, transform) {
  const abs = join(appDir, rel);
  try {
    const src = readFileSync(abs, "utf8");
    const out = transform(src);
    if (out !== src) { writeFileSync(abs, out); actions++; console.log(`  patch  ${rel}`); }
  } catch { /* skip */ }
}

function insertAfterImports(src, line) {
  const lines = src.split("\n");
  let last = -1;
  for (let i = 0; i < lines.length; i++) { if (/^import\s/.test(lines[i])) last = i; }
  if (last === -1) return src;
  lines.splice(last + 1, 0, line);
  return lines.join("\n");
}

console.log("desktop-prepare: patching for static export...\n");

// ═══════════════════════════════════════════════════════════════════
// 1. Remove entire directories that are server-only / need auth+DB
// ═══════════════════════════════════════════════════════════════════
removeDir("api");
removeDir("(admin)");
removeDir("dashboard");
removeDir("payment");
removeDir("courses/[slug]/[chapter]");

// ═══════════════════════════════════════════════════════════════════
// 2. Remove OG image files (incompatible with static export)
// ═══════════════════════════════════════════════════════════════════
removeFile("opengraph-image.tsx");
removeFile("articles/[slug]/opengraph-image.tsx");
removeFile("courses/[slug]/opengraph-image.tsx");

// ═══════════════════════════════════════════════════════════════════
// 3. Replace "force-dynamic" → "force-static"
// ═══════════════════════════════════════════════════════════════════
for (const f of ["courses/page.tsx", "search/page.tsx"]) {
  patch(f, (src) =>
    src.replace('export const dynamic = "force-dynamic"', 'export const dynamic = "force-static"')
  );
}

// ═══════════════════════════════════════════════════════════════════
// 4. Add force-static to pages using headers()/cookies()
// ═══════════════════════════════════════════════════════════════════
for (const f of ["articles/page.tsx"]) {
  patch(f, (src) => {
    if (src.includes("export const dynamic")) return src;
    return insertAfterImports(src, '\nexport const dynamic = "force-static";');
  });
}

// ═══════════════════════════════════════════════════════════════════
// 5. Fix sitemap.ts — replace revalidate with force-static
// ═══════════════════════════════════════════════════════════════════
patch("sitemap.ts", (src) =>
  src.replace(/export const revalidate = \d+;/, 'export const dynamic = "force-static";')
);

console.log(`\ndesktop-prepare: ${actions} action(s) completed`);
