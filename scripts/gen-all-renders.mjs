/**
 * Generates hero + lookbook renders with specific models.
 * Lookbook cards: model 40529623 (younger man)
 * Hero cards: model 17050139 (man with glasses / red velvet)
 * Run: node scripts/gen-all-renders.mjs
 */
import { readFileSync, writeFileSync, copyFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

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
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    const ci = val.indexOf(" #");
    if (ci >= 0) val = val.slice(0, ci).trim();
    env[key] = val;
  }
  return env;
}

const ENV = loadEnv();
const YOUCAM_BASE = "https://yce-api-01.makeupar.com";
const KEY = ENV.YOUCAM_API_KEY;

async function ycReq(method, p, body) {
  const res = await fetch(`${YOUCAM_BASE}${p}`, {
    method,
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json) throw new Error(`YouCam ${method} ${p}: ${res.status} ${JSON.stringify(json)}`);
  return json;
}

async function uploadModel(bytes, name) {
  const reg = await ycReq("POST", "/s2s/v2.0/file", {
    files: [{ content_type: "image/jpeg", file_name: name, file_size: bytes.length }],
  });
  const file = reg.data.files[0];
  const put = file.requests[0];
  const up = await fetch(put.url, { method: put.method, headers: put.headers, body: new Uint8Array(bytes) });
  if (!up.ok) throw new Error(`Upload failed: ${up.status}`);
  return file.file_id;
}

async function tryOn(srcFileId, refFileUrl) {
  const task = await ycReq("POST", "/s2s/v2.0/task/cloth-v3", {
    src_file_id: srcFileId, ref_file_url: refFileUrl, garment_category: "auto",
  });
  const taskId = task.data.task_id;
  let delay = 2000;
  const start = Date.now();
  while (Date.now() - start < 120_000) {
    await new Promise(r => setTimeout(r, delay));
    const poll = await ycReq("GET", `/s2s/v2.0/task/cloth-v3/${encodeURIComponent(taskId)}`);
    const s = poll.data?.task_status;
    process.stdout.write(`  ${s} `);
    if (s === "success") {
      const url = findUrl(poll.data.results);
      if (!url) throw new Error("No result URL");
      return url;
    }
    if (s === "error") throw new Error(poll.data?.error_message || poll.data?.error);
    delay = Math.min(Math.round(delay * 1.4), 6000);
  }
  throw new Error("Timeout");
}

function findUrl(r) {
  if (!r || typeof r !== "object") return null;
  if (Array.isArray(r)) { for (const x of r) { const u = findUrl(x); if (u) return u; } return null; }
  if (typeof r.url === "string") return r.url;
  for (const v of Object.values(r)) { const u = findUrl(v); if (u) return u; }
  return null;
}

const GARMENTS = {
  velvet:    "https://cdn.shopify.com/s/files/1/0249/8576/products/pixelcut_248.png?v=1668148281&width=1600",
  pinstripe: "https://cdn.shopify.com/s/files/1/0774/2062/6207/files/bennett-brown-pinstripe-classic-double-breasted-suit-01.jpg?v=1791460689",
  navy:      "https://cdn.shopify.com/s/files/1/0092/1944/0718/files/IMG_0778.jpg?v=1760441747&width=1600",
};

async function main() {
  // Copy model-17050139.jpg → public/home/hero-selfie.jpg (the "before" selfie for hero)
  const selfieSrc = path.join(ROOT, "scripts", "model-17050139.jpg");
  const selfieDst = path.join(ROOT, "public", "home", "hero-selfie.jpg");
  copyFileSync(selfieSrc, selfieDst);
  console.log("✓ Copied hero-selfie.jpg");

  // Upload both model photos
  console.log("\n── Uploading model-40529623 (lookbook)…");
  const m3Bytes = readFileSync(path.join(ROOT, "scripts", "model-40529623.jpg"));
  const m3Id = await uploadModel(m3Bytes, "model-40529623.jpg");
  console.log(`  file_id: ${m3Id}`);

  console.log("\n── Uploading model-17050139 (hero)…");
  const m1Bytes = readFileSync(path.join(ROOT, "scripts", "model-17050139.jpg"));
  const m1Id = await uploadModel(m1Bytes, "model-17050139.jpg");
  console.log(`  file_id: ${m1Id}`);

  const jobs = [
    // Lookbook: model 40529623 for all 3
    { label: "lookbook-1 (velvet) — model 40529623",   fileId: m3Id, garment: GARMENTS.velvet,    out: "public/home/lookbook-1.jpg" },
    { label: "lookbook-2 (pinstripe) — model 40529623", fileId: m3Id, garment: GARMENTS.pinstripe, out: "public/home/lookbook-2.jpg" },
    // lookbook-3 already uses model 40529623 — skip to save units
    // Hero: model 17050139 for all 3
    { label: "hero-1 (velvet) — model 17050139",        fileId: m1Id, garment: GARMENTS.velvet,    out: "public/home/hero-1.jpg" },
    { label: "hero-2 (pinstripe) — model 17050139",     fileId: m1Id, garment: GARMENTS.pinstripe, out: "public/home/hero-2.jpg" },
    { label: "hero-3 (navy) — model 17050139",          fileId: m1Id, garment: GARMENTS.navy,      out: "public/home/hero-3.jpg" },
  ];

  for (const job of jobs) {
    console.log(`\n── ${job.label}`);
    try {
      console.log(`  Running try-on…`);
      const renderUrl = await tryOn(job.fileId, job.garment);
      console.log(`\n  Downloading…`);
      const buf = Buffer.from(await (await fetch(renderUrl)).arrayBuffer());
      writeFileSync(path.join(ROOT, job.out), buf);
      console.log(`  ✓ ${job.out} (${Math.round(buf.length / 1024)}KB)`);
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
    }
  }

  console.log("\nDone.");
}

main().catch(e => { console.error(e); process.exit(1); });
