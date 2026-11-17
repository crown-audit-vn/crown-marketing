#!/usr/bin/env node
/**
 * Decode data:image/*;base64,... in HTML to binary files (lossless — no re-encode).
 * Canonical sources: assets/images/<site>/ and shared assets/images/team/.
 * Deploy copies land under sites/<site>/assets/images/ (and team/ when shared).
 */
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { sites } from "./sites.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const MIME_TO_EXT = {
  png: "png",
  webp: "webp",
  jpeg: "jpg",
  jpg: "jpg",
  gif: "gif",
  "svg+xml": "svg",
};

/** @param {string} name */
function slugMemberName(name) {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * @param {string} html
 * @param {number} dataUriStartIndex
 */
function semanticNameForDataUri(html, dataUriStartIndex) {
  const before = html.slice(Math.max(0, dataUriStartIndex - 1200), dataUriStartIndex);

  const memberMatch = before.match(/data-member="([^"]+)"/g);
  if (memberMatch && /\bteam-photo\b|\bteam-card\b/.test(before)) {
    const last = memberMatch[memberMatch.length - 1];
    const name = last.match(/data-member="([^"]+)"/)[1];
    return { scope: "team", base: slugMemberName(name) };
  }

  if (/\bclass="[^"]*\bhero-photo\b/.test(before)) return { scope: "site", base: "hero-background" };
  if (/\bclass="[^"]*\bcapability-wheel\b/.test(before)) return { scope: "site", base: "capability-wheel" };
  if (/partner-logo-mark\s+koru|logo-item\s+koru|alt="Koru Capital"/i.test(before)) {
    return { scope: "site", base: "partner-koru" };
  }
  if (/partner-logo-mark\s+tamdoanh|logo-item\s+tamdoanh|alt="Tâm Doanh Group"/i.test(before)) {
    if (/footer-partner-logos|class="logo-item tamdoanh"/i.test(before) && /logo-item\s+tamdoanh/.test(before)) {
      return { scope: "site", base: "partner-tamdoanh-footer" };
    }
    return { scope: "site", base: "partner-tamdoanh" };
  }
  if (/footer-partner-logos[\s\S]{0,120}logo-item\s+crown|class="logo-item crown"/i.test(before)) {
    return { scope: "site", base: "partner-crown-footer" };
  }
  if (/partner-logo-mark\s+crown|logo-item\s+crown/i.test(before)) {
    return { scope: "site", base: "partner-crown" };
  }

  return null;
}

/**
 * @param {string} html
 * @param {{ siteFolder: string }} ctx
 */
function replaceDataUrisInHtml(html, ctx) {
  const { siteFolder } = ctx;
  const siteCanonical = resolve(root, "assets", "images", siteFolder);
  const teamCanonical = resolve(root, "assets", "images", "team");
  const siteDeploy = resolve(root, "sites", siteFolder, "assets", "images");
  const teamDeploy = resolve(siteDeploy, "team");

  mkdirSync(siteCanonical, { recursive: true });
  mkdirSync(teamCanonical, { recursive: true });
  mkdirSync(siteDeploy, { recursive: true });
  mkdirSync(teamDeploy, { recursive: true });

  /** @type {Map<string, { path: string, publicPath: string }>} */
  const hashToDeploy = new Map();
  /** @type {Map<string, string>} semantic key → hash */
  const semanticToHash = new Map();

  const re = /data:image\/([a-zA-Z0-9+.-]+);base64,([A-Za-z0-9+/=]+)/g;
  const matches = [...html.matchAll(re)];
  const refCount = matches.length;

  for (const match of matches) {
    const [full, mimeSub, b64] = match;
    const ext = MIME_TO_EXT[mimeSub] ?? mimeSub.replace("+xml", "");
    const buf = Buffer.from(b64, "base64");
    const hash = createHash("sha256").update(buf).digest("hex").slice(0, 16);

    if (hashToDeploy.has(hash)) continue;

    const semantic = semanticNameForDataUri(html, match.index);
    let scope = "site";
    let baseName = `image-${hash}`;

    if (semantic) {
      scope = semantic.scope;
      baseName = semantic.base;
      const semanticKey = `${scope}:${baseName}`;
      const prev = semanticToHash.get(semanticKey);
      if (prev && prev !== hash) baseName = `${semantic.base}-${hash.slice(0, 6)}`;
      else semanticToHash.set(semanticKey, hash);
    }

    const filename = `${baseName}.${ext}`;
    const isTeam = scope === "team";
    const canonicalPath = join(isTeam ? teamCanonical : siteCanonical, filename);
    const deployPath = join(isTeam ? teamDeploy : siteDeploy, filename);
    const publicPath = isTeam ? `/assets/images/team/${filename}` : `/assets/images/${filename}`;

    writeFileSync(canonicalPath, buf);
    copyFileSync(canonicalPath, deployPath);
    hashToDeploy.set(hash, { path: deployPath, publicPath });
  }

  let next = html;
  for (const match of matches) {
    const [full] = match;
    const buf = Buffer.from(match[2], "base64");
    const hash = createHash("sha256").update(buf).digest("hex").slice(0, 16);
    const { publicPath } = hashToDeploy.get(hash);
    next = next.split(full).join(publicPath);
  }

  return { html: next, uniqueImages: hashToDeploy.size, refs: refCount };
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

/**
 * @param {string} siteFolder
 */
export function extractSiteDataUriImages(siteFolder) {
  const siteDir = resolve(root, "sites", siteFolder);
  if (!existsSync(siteDir)) throw new Error(`Không tìm thấy sites/${siteFolder}`);

  const files = walkHtmlFiles(siteDir);
  let totalUnique = 0;
  let totalRefs = 0;
  let changedFiles = 0;

  for (const file of files) {
    const before = readFileSync(file, "utf8");
    if (!/data:image\//i.test(before)) continue;

    const result = replaceDataUrisInHtml(before, { siteFolder });
    totalUnique += result.uniqueImages;
    totalRefs += result.refs;

    if (result.html !== before) {
      writeFileSync(file, result.html, "utf8");
      changedFiles += 1;
      console.log(`  updated ${relative(root, file)} (${result.refs} refs)`);
    }
  }

  return { siteFolder, changedFiles, totalRefs, totalUnique };
}

function main() {
  const arg = process.argv[2];
  const targets = arg && arg !== "all" ? [arg] : sites.map((s) => s.folder);

  let grandRefs = 0;
  for (const folder of targets) {
    console.log(`\n[${folder}]`);
    const out = extractSiteDataUriImages(folder);
    grandRefs += out.totalRefs;
    if (!out.changedFiles) console.log("  (không còn data URI ảnh)");
  }

  console.log(`\nHoàn tất — đã xử lý ${targets.length} site, ${grandRefs} tham chiếu ảnh.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main();
}