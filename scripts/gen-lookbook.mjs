/**
 * Generates 3 real YouCam try-on renders for the homepage lookbook.
 * Run: node scripts/gen-lookbook.mjs
 * Outputs: public/home/lookbook-1.jpg, lookbook-2.jpg, lookbook-3.jpg
 * Prints product details so lookbook.tsx can be updated.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// ── 1. Load env ────────────────────────────────────────────────────────────
function loadEnv() {
  const raw = readFileSync(path.join(ROOT, ".env.local"), "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const clean = line.trim();
    if (!clean || clean.startsWith("#")) continue;
    const eq = clean.indexOf("=");
    if (eq < 0) continue;
    const key = clean.slice(0, eq).trim();
    let val = clean.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    // Strip inline comments
    const commentIdx = val.indexOf(" #");
    if (commentIdx >= 0) val = val.slice(0, commentIdx).trim();
    env[key] = val;
  }
  return env;
}

const ENV = loadEnv();
const YOUCAM_API_KEY = ENV.YOUCAM_API_KEY;
const SUPABASE_URL = ENV.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = ENV.SUPABASE_SERVICE_ROLE_KEY;
const YOUCAM_BASE = "https://yce-api-01.makeupar.com";

if (!YOUCAM_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing env vars. Check .env.local");
  process.exit(1);
}

// ── 2. YouCam helpers ──────────────────────────────────────────────────────
async function ycRequest(method, path, body) {
  const res = await fetch(`${YOUCAM_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${YOUCAM_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json) throw new Error(`YouCam ${method} ${path}: HTTP ${res.status} ${JSON.stringify(json)}`);
  return json;
}

async function uploadToYouCam(imageBytes, fileName, contentType = "image/jpeg") {
  console.log(`  → Registering file ${fileName} (${Math.round(imageBytes.length / 1024)}KB)…`);
  const created = await ycRequest("POST", "/s2s/v2.0/file", {
    files: [{ content_type: contentType, file_name: fileName, file_size: imageBytes.length }],
  });
  const file = created.data.files[0];
  const put = file?.requests[0];
  if (!file || !put) throw new Error("YouCam File API returned no upload URL");

  console.log(`  → Uploading bytes…`);
  const upRes = await fetch(put.url, {
    method: put.method,
    headers: put.headers,
    body: new Uint8Array(imageBytes),
  });
  if (!upRes.ok) throw new Error(`File upload failed: HTTP ${upRes.status}`);
  console.log(`  ✓ file_id: ${file.file_id}`);
  return file.file_id;
}

async function runClothTryOn(srcFileId, refFileUrl) {
  console.log(`  → Creating clothes try-on task…`);
  const taskRes = await ycRequest("POST", "/s2s/v2.0/task/cloth-v3", {
    src_file_id: srcFileId,
    ref_file_url: refFileUrl,
    garment_category: "auto",
  });
  const taskId = taskRes.data?.task_id;
  if (!taskId) throw new Error(`No task_id in response: ${JSON.stringify(taskRes)}`);
  console.log(`  → Task ID: ${taskId} — polling…`);

  const started = Date.now();
  let delay = 2000;
  while (Date.now() - started < 120_000) {
    await new Promise((r) => setTimeout(r, delay));
    const poll = await ycRequest("GET", `/s2s/v2.0/task/cloth-v3/${encodeURIComponent(taskId)}`);
    const status = poll.data?.task_status;
    console.log(`    status: ${status}`);
    if (status === "success") {
      const url = findResultUrl(poll.data?.results);
      if (!url) throw new Error("No result URL in poll response");
      return url;
    }
    if (status === "error") throw new Error(`Task error: ${poll.data?.error_message || poll.data?.error}`);
    delay = Math.min(Math.round(delay * 1.4), 6000);
  }
  throw new Error("Task timed out after 120s");
}

function findResultUrl(results) {
  if (!results || typeof results !== "object") return null;
  if (Array.isArray(results)) {
    for (const item of results) { const u = findResultUrl(item); if (u) return u; }
    return null;
  }
  if (typeof results.url === "string") return results.url;
  for (const v of Object.values(results)) { const u = findResultUrl(v); if (u) return u; }
  return null;
}

// ── 3. Download image bytes ────────────────────────────────────────────────
async function downloadBytes(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status} from ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

// ── 4. Main ────────────────────────────────────────────────────────────────
async function main() {
  const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Query 3 formal/smart-casual products with a wedding occasion and good images
  console.log("\n── Fetching products from Supabase…");
  const { data: products, error } = await db
    .from("products")
    .select("id, name, store_name, price, category, image, url, formality, occasions, colour, tier")
    .eq("in_stock", true)
    .in("formality", ["formal", "smart-casual"])
    .in("category", ["top", "outerwear", "bottom"])
    .not("image", "is", null)
    .neq("image", "")
    .order("price", { ascending: false })
    .limit(50);

  if (error) { console.error("Supabase error:", error); process.exit(1); }
  if (!products?.length) { console.error("No products found"); process.exit(1); }

  console.log(`Found ${products.length} candidate products`);

  // Pick 3 visually distinct products at different price points
  // Prefer ones tagged with wedding, or formal tops/outerwear
  const weddingProducts = products.filter(
    (p) => Array.isArray(p.occasions) && p.occasions.includes("wedding")
  );
  const pool = weddingProducts.length >= 3 ? weddingProducts : products;

  // Pick 3 from different stores, spread across price tiers
  const sorted = [...pool].sort((a, b) => b.price - a.price);
  const deduped = [];
  const seenStores = new Set();
  // First pass: one from luxury tier
  for (const p of sorted) {
    if (deduped.length >= 1) break;
    if (!seenStores.has(p.store_name) && p.tier === "luxury") {
      deduped.push(p); seenStores.add(p.store_name);
    }
  }
  // Second pass: one from mid tier
  for (const p of sorted) {
    if (deduped.length >= 2) break;
    if (!seenStores.has(p.store_name) && p.tier === "mid") {
      deduped.push(p); seenStores.add(p.store_name);
    }
  }
  // Third pass: one from budget tier or any remaining store
  for (const p of sorted) {
    if (deduped.length >= 3) break;
    if (!seenStores.has(p.store_name)) {
      deduped.push(p); seenStores.add(p.store_name);
    }
  }
  // Fallback: fill any remaining slots without store dedup
  for (const p of sorted) {
    if (deduped.length >= 3) break;
    if (!deduped.some((d) => d.id === p.id)) deduped.push(p);
  }
  const chosen = deduped.slice(0, 3);

  console.log("\nChosen products:");
  chosen.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name} — ${p.store_name} — S$${p.price} — ${p.category} — ${p.colour}`);
    console.log(`     image: ${p.image}`);
  });

  // Full-body standing Asian man in formal suit, plain grey background, studio
  const MODEL_URL =
    "https://images.pexels.com/photos/14348504/pexels-photo-14348504.jpeg?auto=compress&cs=tinysrgb&h=1890&dpr=1";
  console.log("\n── Downloading model photo…");
  const modelBytes = await downloadBytes(MODEL_URL);
  console.log(`✓ Model photo: ${Math.round(modelBytes.length / 1024)}KB`);

  console.log("\n── Uploading model photo to YouCam…");
  const faceFileId = await uploadToYouCam(modelBytes, "model.jpg");

  // Process each look
  const outDir = path.join(ROOT, "public", "home");
  mkdirSync(outDir, { recursive: true });

  const results = [];
  for (let i = 0; i < chosen.length; i++) {
    const product = chosen[i];
    const lookNum = i + 1;
    console.log(`\n── Look ${lookNum}: ${product.name}`);

    try {
      console.log(`  → Garment URL: ${product.image}`);
      const renderUrl = await runClothTryOn(faceFileId, product.image);

      console.log(`  ✓ Render URL: ${renderUrl}`);
      console.log(`  → Downloading render…`);
      const renderBytes = await downloadBytes(renderUrl);
      const outPath = path.join(outDir, `lookbook-${lookNum}.jpg`);
      writeFileSync(outPath, renderBytes);
      console.log(`  ✓ Saved to public/home/lookbook-${lookNum}.jpg (${Math.round(renderBytes.length / 1024)}KB)`);

      results.push({
        lookNum,
        name: product.name,
        storeName: product.store_name,
        price: product.price,
        category: product.category,
        colour: product.colour,
        url: product.url,
        imagePath: `/home/lookbook-${lookNum}.jpg`,
      });
    } catch (err) {
      console.error(`  ✗ Look ${lookNum} failed: ${err.message}`);
      results.push({ lookNum, error: err.message, product });
    }
  }

  console.log("\n══════════════════════════════════════════");
  console.log("RESULTS — paste into lookbook.tsx:");
  console.log("══════════════════════════════════════════");
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => { console.error(err); process.exit(1); });
