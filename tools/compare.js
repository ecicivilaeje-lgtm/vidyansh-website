/*
 * Dev tool: compares a page of the original Next.js site (localhost:3100) with the PHP port (localhost:8100).
 * Usage: NODE_PATH=/opt/node22/lib/node_modules node tools/compare.js /courses [width=1440] [outDir=/tmp/compare]
 * Writes next-*.png and php-*.png (full page) and prints a diff of the visible text of <body>,
 * plus console errors and horizontal overflow on each.
 */
const { chromium } = require("playwright");
const fs = require("fs");

const path = process.argv[2] || "/";
const width = parseInt(process.argv[3] || "1440", 10);
const out = process.argv[4] || "/tmp/compare";
fs.mkdirSync(out, { recursive: true });
const name = (path.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "home") + "-" + width;

async function grab(browser, base, label) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  const res = await page.goto(base + path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(400);
  const text = await page.evaluate(() => document.body.innerText.replace(/[ \t]+/g, " ").split("\n").map((l) => l.trim()).filter(Boolean));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.screenshot({ path: `${out}/${label}-${name}.png`, fullPage: true });
  await page.close();
  return { status: res.status(), errors, text, overflow, height };
}

(async () => {
  const browser = await chromium.launch();
  const a = await grab(browser, "http://localhost:3100", "next");
  const b = await grab(browser, "http://localhost:8100", "php");
  await browser.close();
  console.log(`status next=${a.status} php=${b.status}  height next=${a.height} php=${b.height}  overflow next=${a.overflow} php=${b.overflow}`);
  if (a.errors.length) console.log("next console errors:", a.errors);
  if (b.errors.length) console.log("php console errors:", b.errors);
  // Line diff (order-aware, simple LCS).
  const A = a.text, B = b.text;
  const n = A.length, m = B.length;
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  let i = 0, j = 0, diffs = [];
  while (i < n || j < m) {
    if (i < n && j < m && A[i] === B[j]) { i++; j++; }
    else if (j < m && (i === n || dp[i][j + 1] >= dp[i + 1][j])) diffs.push("+ php:  " + B[j++]);
    else diffs.push("- next: " + A[i++]);
  }
  console.log(diffs.length ? `text differences (${diffs.length}):\n` + diffs.slice(0, 80).join("\n") : "text identical");
  console.log(`screenshots: ${out}/next-${name}.png ${out}/php-${name}.png`);
})();
