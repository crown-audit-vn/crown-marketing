#!/usr/bin/env node
/**
 * Static locale mirrors for hreflang: English-primary sites → sites/<name>/vi/...
 *
 * www, cons, fas and up keep a committed Vietnamese /vi tree (the original
 * source pages after the English-default migration). Those trees are not
 * overwritten by a reverse prerender.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  unlinkSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { sites } from "./sites.mjs";
import { siteSeoByFolder } from "./seo/site-meta.mjs";
import { headlineOverride } from "./seo/locale-headlines.mjs";
import { writeTextIfChanged } from "./fs-write-if-changed.mjs";
import { applyLocaleToHtml } from "./locale/apply-locale-html.mjs";
import { applyUpLocale } from "./locale/prerender-up.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

/** @type {Set<string>} */
const PRESERVE_ALTERNATE = new Set(["www", "cons", "fas", "up"]);

/** @param {string} siteDir @param {string} relDir */
function isAlternateLocaleDir(relDir, primaryLang) {
  const alt = primaryLang === "vi" ? "en" : "vi";
  if (!relDir || relDir === ".") return false;
  const first = relDir.split(/[/\\]/)[0];
  return first === alt;
}

/**
 * @param {string} siteDir
 * @param {string} htmlPath
 * @param {string} targetLocale
 */
function outputPath(siteDir, htmlPath, targetLocale) {
  const rel = relative(siteDir, dirname(htmlPath));
  if (!rel || rel === ".") return join(siteDir, targetLocale, "index.html");
  return join(siteDir, targetLocale, rel, "index.html");
}

/**
 * @param {string} siteDir
 * @param {string} primaryLang
 * @returns {string[]}
 */
function discoverSourceHtml(siteDir, primaryLang) {
  /** @type {string[]} */
  const files = [];

  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) {
        if (name === "assets" || name === ".vercel" || name === "services") continue;
        const rel = relative(siteDir, full);
        if (isAlternateLocaleDir(rel, primaryLang)) continue;
        walk(full);
      } else if (name === "index.html") {
        const rel = relative(siteDir, dirname(full));
        if (!isAlternateLocaleDir(rel, primaryLang)) files.push(full);
      }
    }
  };

  walk(siteDir);
  return files.sort();
}

/**
 * @param {string} altRoot
 * @param {Set<string>} keepFiles
 */
function pruneStaleMirrorFiles(altRoot, keepFiles) {
  if (!existsSync(altRoot)) return;

  const stale = [];

  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) {
        walk(full);
      } else if (name === "index.html" && !keepFiles.has(full)) {
        stale.push(full);
      }
    }
  };

  walk(altRoot);
  for (const file of stale) {
    unlinkSync(file);
  }
}

/**
 * @param {string} folder
 */
function prerenderSite(folder) {
  const seo = siteSeoByFolder[folder];
  if (!seo) throw new Error(`No SEO meta for ${folder}`);
  const primaryLang = seo.lang;
  const targetLocale = primaryLang === "vi" ? "en" : "vi";

  const siteDir = resolve(root, "sites", folder);
  if (!existsSync(siteDir)) throw new Error(`Missing sites/${folder}`);

  const altRoot = join(siteDir, targetLocale);

  if (PRESERVE_ALTERNATE.has(folder) && existsSync(join(altRoot, "index.html"))) {
    console.log(
      `[${folder}] keeping committed /${targetLocale}/ tree (not regenerated)`
    );
    return;
  }

  const sources = discoverSourceHtml(siteDir, primaryLang);
  /** @type {Set<string>} */
  const expectedDests = new Set();
  let written = 0;

  for (const src of sources) {
    const html = readFileSync(src, "utf8");
    const hasI18n =
      /const\s+translations\s*=/.test(html) || /const\s+I18N\s*=/.test(html);
    const isUpBilingual = folder === "up" && /data-vi/.test(html);

    if (!hasI18n && !isUpBilingual) continue;

    const logicalPath =
      relative(siteDir, dirname(src)) === "." ?
        "/"
      : `/${relative(siteDir, dirname(src)).replace(/\\/g, "/")}`;

    const localized =
      isUpBilingual && !hasI18n ?
        applyUpLocale(
          html,
          targetLocale,
          headlineOverride(folder, logicalPath, targetLocale)
        )
      : applyLocaleToHtml(
          html,
          targetLocale,
          headlineOverride(folder, logicalPath, targetLocale)
        );
    const dest = outputPath(siteDir, src, targetLocale);
    expectedDests.add(dest);
    mkdirSync(dirname(dest), { recursive: true });
    if (writeTextIfChanged(dest, localized)) written += 1;
  }

  if (expectedDests.size === 0) {
    if (existsSync(altRoot)) rmSync(altRoot, { recursive: true, force: true });
  } else {
    pruneStaleMirrorFiles(altRoot, expectedDests);
  }

  const mirrorCount = expectedDests.size;
  const delta =
    written > 0 ? `, cập nhật ${written} file` : mirrorCount > 0 ? "" : "";
  console.log(
    `[${folder}] ${mirrorCount} mirror page(s) → /${targetLocale}/ (${primaryLang} primary)${delta}`
  );
}

const arg = process.argv[2] ?? "all";
const targets = arg === "all" ? sites.map((s) => s.folder) : [arg];

let failed = false;
for (const folder of targets) {
  try {
    prerenderSite(folder);
  } catch (err) {
    failed = true;
    console.error(`[${folder}] ${err.message}`);
  }
}

process.exit(failed ? 1 : 0);
