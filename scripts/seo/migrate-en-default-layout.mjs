#!/usr/bin/env node
/**
 * One-shot layout migration: move English /en/* to the unprefixed root and
 * move the original Vietnamese source pages under /vi/. Safe to re-run
 * (skips a site when /en is absent or /vi already exists).
 *
 * Usage: node scripts/seo/migrate-en-default-layout.mjs
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");
const FOLDERS = ["www", "cons", "fas", "up"];

/**
 * @param {string} src
 * @param {string} dest
 */
function moveFile(src, dest) {
  mkdirSync(dirname(dest), { recursive: true });
  if (existsSync(dest)) rmSync(dest);
  renameSync(src, dest);
}

/**
 * @param {string} fromDir
 * @param {string} toDir
 */
function moveDirContents(fromDir, toDir) {
  mkdirSync(toDir, { recursive: true });
  for (const name of readdirSync(fromDir)) {
    const from = join(fromDir, name);
    const to = join(toDir, name);
    if (statSync(from).isDirectory()) {
      moveDirContents(from, to);
      rmSync(from, { recursive: true, force: true });
    } else {
      moveFile(from, to);
    }
  }
}

/**
 * @param {string} dir
 * @param {string} siteDir
 * @param {string[]} acc
 */
function walkSourceHtml(dir, siteDir, acc) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (name === "assets" || name === ".vercel") continue;
      const rel = relative(siteDir, full);
      const first = rel.split(/[\\/]/)[0];
      if (first === "en" || first === "vi" || first === "__vi_tmp__") continue;
      walkSourceHtml(full, siteDir, acc);
    } else if (name === "index.html") {
      acc.push(full);
    }
  }
}

/**
 * @param {string} folder
 */
function migrate(folder) {
  const siteDir = resolve(root, "sites", folder);
  const enRoot = join(siteDir, "en");
  const viRoot = join(siteDir, "vi");
  if (!existsSync(enRoot)) {
    console.log(`[${folder}] no /en tree, skip`);
    return;
  }
  if (existsSync(viRoot)) {
    console.log(`[${folder}] /vi already exists, skip`);
    return;
  }

  const tmp = join(siteDir, "__vi_tmp__");
  if (existsSync(tmp)) rmSync(tmp, { recursive: true, force: true });

  /** @type {string[]} */
  const sources = [];
  walkSourceHtml(siteDir, siteDir, sources);
  for (const src of sources) {
    moveFile(src, join(tmp, relative(siteDir, src)));
  }

  moveDirContents(enRoot, siteDir);
  rmSync(enRoot, { recursive: true, force: true });
  moveDirContents(tmp, viRoot);
  rmSync(tmp, { recursive: true, force: true });
  console.log(`[${folder}] English at /, Vietnamese at /vi/ (${sources.length} vi page(s))`);
}

for (const folder of FOLDERS) migrate(folder);
