/**
 * Captures every screen of the flow into docs/screenshots/ (or --out), at 1280px (or --width).
 * Start the app first (npm run dev), then: npm run screenshots (--url for another server).
 * With MOCK_YOUCAM=true every try-on is the same saved sample and no units are spent; with live
 * renders a full run costs about 30 units. --full captures whole pages instead of the first screen.
 */
import { chromium, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { parseArgs } from "node:util";

const { values: args } = parseArgs({
  options: {
    url: { type: "string", default: "http://localhost:3000" },
    out: { type: "string", default: "docs/screenshots" },
    width: { type: "string", default: "1280" },
    full: { type: "boolean", default: false },
  },
});
const url = args.url;
const OUT = args.out;
const WIDTH = Number(args.width);
const SLOW = 240_000; // the style agent streams its first look in 20 to 50 s, longer on a cold dev server

async function shot(page: Page, name: string, { settle = true } = {}) {
  // The style stream keeps the network busy, so the loading shot skips the idle wait
  if (settle) await page.waitForLoadState("networkidle").catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" }); // dev badge
  await page.waitForTimeout(800); // let entrance motion settle
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: args.full });
  console.log(`  ${name}.png`);
}

async function backToLooks(page: Page) {
  // Broad pattern covers swap, compare, prep, browse back buttons
  const back = page.getByRole("button", { name: /Back to your looks|Keep This Swap|Keep the current/i }).first();
  const isVis = await back.isVisible().catch(() => false);
  if (isVis) await back.click();
  else {
    // fallback: click the back arrow text on prep / browse
    const arrow = page.getByRole("button", { name: /← Your looks|← /i }).first();
    if (await arrow.isVisible().catch(() => false)) await arrow.click();
  }
  await page.getByRole("button", { name: /Swap/i }).first().waitFor({ timeout: 20_000 }).catch(() => {});
  await page.evaluate(() => window.scrollTo(0, 0));
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: 900 },
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: false,
    reducedMotion: "reduce",
  });
  page.setDefaultTimeout(60_000);
  console.log(`Capturing ${url} at ${WIDTH}px into ${OUT}`);

  // Home
  await page.goto(url);
  await shot(page, "home");

  // Photo
  await page.goto(`${url}/style?o=date`);
  await page.locator("input[type=file]").setInputFiles("fixtures/selfies/demo.jpg");
  await page.getByRole("button", { name: "Use This Photo" }).waitFor({ state: "visible", timeout: 30_000 });
  await shot(page, "photo");

  // Occasion
  await page.getByRole("button", { name: "Use This Photo" }).click();
  await page.getByRole("heading", { level: 1, name: /occasion/i }).waitFor();
  // Tier buttons use aria-pressed; click the Mid-range one
  await page.getByRole("button", { name: /Mid-range/i }).click();
  await shot(page, "occasion");

  // Loading
  await page.getByRole("button", { name: "Style me" }).click();
  await page.waitForTimeout(3_000);
  await shot(page, "loading", { settle: false });

  // Looks — wait for Swap button to appear (means looks + renders are ready)
  await page.getByRole("button", { name: "Swap" }).first().waitFor({ timeout: SLOW });
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, "looks");

  // Compare prices
  await page.getByRole("button", { name: "Compare prices" }).first().click();
  await page.getByRole("button", { name: /Wear this version|Use this tier/i }).first().waitFor({ timeout: SLOW });
  await shot(page, "compare");
  await page.getByRole("button", { name: /Back to your looks/i }).click();
  await page.getByRole("button", { name: "Swap" }).first().waitFor({ timeout: 20_000 });
  await page.evaluate(() => window.scrollTo(0, 0));

  // Swap
  await page.getByRole("button", { name: "Swap" }).first().click();
  await page.locator("button[aria-pressed]").first().waitFor({ timeout: SLOW });
  await shot(page, "swap");
  await page.getByRole("button", { name: "Keep This Swap" }).click();
  await page.getByRole("button", { name: "Swap" }).first().waitFor({ timeout: 20_000 });
  await page.evaluate(() => window.scrollTo(0, 0));

  // Prep plan
  await page.getByRole("button", { name: "Your night-before prep plan" }).click();
  await page.getByRole("heading", { level: 1, name: /night before/i }).waitFor();
  await shot(page, "prep");
  await page.getByRole("button", { name: /Back to your looks/i }).click();
  await page.getByRole("button", { name: "Swap" }).first().waitFor({ timeout: 20_000 });
  await page.evaluate(() => window.scrollTo(0, 0));

  // Cart — do before browse so we don't need to navigate back from /catalog
  await page.getByRole("button", { name: /Add Look to Cart/i }).first().click();
  const cart = page.getByRole("heading", { level: 1, name: /Your Cart/i });
  if (!(await cart.isVisible().catch(() => false))) {
    const viewCart = page.getByRole("button", { name: /View cart/i }).first();
    if (await viewCart.isVisible().catch(() => false)) await viewCart.click();
  }
  await cart.waitFor();
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, "cart");

  // Browse — navigate away last; wide layout uses a <Link> to /catalog
  await page.goBack();
  await page.getByRole("button", { name: "Swap" }).first().waitFor({ timeout: 20_000 });
  await page.getByRole("link", { name: "Browse Every Piece" }).click();
  await page.getByText(/\d+ pieces/).first().waitFor({ timeout: 20_000 });
  await shot(page, "browse");

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
