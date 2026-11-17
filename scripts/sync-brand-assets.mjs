#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { sites } from "./sites.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

/** Source files in assets/logo → stable deploy names under each site's assets folder */
const BRAND_FILES = [
  { from: "assets/logo/crown-wordmark-white-on-black.png", name: "crown-logo-header.png" },
  { from: "assets/logo/crown-icon-green-on-black.png", name: "crown-favicon.png" },
  { from: "assets/logo/crown-wordmark-green-on-black.png", name: "crown-logo-green.png" },
  { from: "assets/seo/crown-og-share.jpg", name: "crown-og-share.jpg" },
];

const FAVICON_SNIPPET = `<link href="/assets/crown-favicon.png" rel="icon" type="image/png"/>
<link href="/assets/crown-favicon.png" rel="apple-touch-icon"/>`;

function copyBrandToSite(siteDir) {
  const assetsDir = join(siteDir, "assets");
  mkdirSync(assetsDir, { recursive: true });
  for (const { from, name } of BRAND_FILES) {
    const src = resolve(root, from);
    if (!existsSync(src)) {
      throw new Error(`Thiếu file logo: ${from}`);
    }
    copyFileSync(src, join(assetsDir, name));
  }
}

/**
 * @param {string} html
 */
function patchHtml(html) {
  let next = html;

  const replaceImgDataSrc = (className, assetPath) => {
    const pattern = new RegExp(
      `(class="[^"]*\\b${className}\\b[^"]*"[^>]*\\bsrc=")data:image/[^"]+(")|(\\bsrc=")data:image/[^"]+("[^>]*class="[^"]*\\b${className}\\b)`,
      "gi"
    );
    next = next.replace(pattern, (match, g1, g2, g3, g4) => {
      if (g1 && g2) return `${g1}${assetPath}${g2}`;
      if (g3 && g4) return `${g3}${assetPath}${g4}`;
      return match;
    });
  };

  replaceImgDataSrc("brand-logo-image", "/assets/crown-logo-header.png");
  replaceImgDataSrc("crownup-left-logo", "/assets/crown-logo-green.png");
  replaceImgDataSrc("crownup-logo-img", "/assets/crown-logo-green.png");

  next = next.replace(
    /<link\s+href="data:image\/[^"]+"\s+rel="icon"[^>]*\/?>/gi,
  `<link href="/assets/crown-favicon.png" rel="icon" type="image/png"/>`
  );

  if (!/\brel=["']icon["']/i.test(next)) {
    next = next.replace(
      /(<meta[^>]+name=["']viewport["'][^>]*\/>)/i,
      `$1\n${FAVICON_SNIPPET}`
    );
  }

  const crownPartner = next.replace(
    /(<div class="partner-logo-mark crown">\s*<img[^>]*\bsrc=")data:image\/[^"]+(")/gi,
    `$1/assets/crown-logo-header.png$2`
  );
  next = crownPartner;

  return next;
}

function walkHtmlFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === "assets" || entry === ".vercel") continue;
      walkHtmlFiles(full, out);
    } else if (entry.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

let htmlChanged = 0;
let sitesSynced = 0;

for (const { folder } of sites) {
  const siteDir = resolve(root, "sites", folder);
  if (!existsSync(siteDir)) continue;
  copyBrandToSite(siteDir);
  sitesSynced += 1;

  for (const file of walkHtmlFiles(siteDir)) {
    const before = readFileSync(file, "utf8");
    const after = patchHtml(before);
    if (after !== before) {
      writeFileSync(file, after, "utf8");
      htmlChanged += 1;
      console.log(`  updated ${relative(root, file)}`);
    }
  }
}

console.log(`\nĐã copy logo vào ${sitesSynced} site, cập nhật ${htmlChanged} file HTML.`);