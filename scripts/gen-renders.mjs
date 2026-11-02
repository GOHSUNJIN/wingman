/**
 * Generates specific renders with specific models.
 * Run: node scripts/gen-renders.mjs
 */
import { readFileSync, writeFileSync } from "fs";
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

async function ycReq(method, path, body) {
  const res = await fetch(`${YOUCAM_BASE}${path}`, {
    method,
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json) throw new Error(`YouCam ${method} ${path}: ${res.status} ${JSON.stringify(json)}`);
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

async function main() {
  // Each job: { modelFile, garmentUrl, outFile, label }
  const jobs = [
    {
      label: "lookbook-1 (Velvet Jacket) — model 17050139",
      modelFile: "scripts/model-17050139.jpg",
      garmentUrl: "https://cdn.shopify.com/s/files/1/0249/8576/products/pixelcut_248.png?v=1668148281&width=1600",
      outFile: "public/home/lookbook-1.jpg",
    },
    {
      label: "lookbook-3 (Navy Blazer) — model 40529623",
      modelFile: "scripts/model-40529623.jpg",
      garmentUrl: "https://cdn.shopify.com/s/files/1/0092/1944/0718/files/IMG_0778.jpg?v=1760441747&width=1600",
      outFile: "public/home/lookbook-3.jpg",
    },
    {
      label: "fit-check (Navy Blazer) — model 40529614",
      modelFile: "scripts/model-40529614.jpg",
      garmentUrl: "https://cdn.shopify.com/s/files/1/0092/1944/0718/files/IMG_0778.jpg?v=1760441747&width=1600",
      outFile: "public/home/fit-check-render.jpg",
    },
  ];

  for (const job of jobs) {
    console.log(`\n── ${job.label}`);
    try {
      const modelBytes = readFileSync(path.join(ROOT, job.modelFile));
      console.log(`  Uploading model (${Math.round(modelBytes.length / 1024)}KB)…`);
      const fileId = await uploadModel(modelBytes, path.basename(job.modelFile));
      console.log(`  Running try-on…`);
      const renderUrl = await tryOn(fileId, job.garmentUrl);
      console.log(`\n  Downloading render…`);
      const renderRes = await fetch(renderUrl);
      const renderBytes = Buffer.from(await renderRes.arrayBuffer());
      writeFileSync(path.join(ROOT, job.outFile), renderBytes);
      console.log(`  ✓ ${job.outFile} (${Math.round(renderBytes.length / 1024)}KB)`);
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
    }
  }
  console.log("\nDone.");
}

main().catch(e => { console.error(e); process.exit(1); });
