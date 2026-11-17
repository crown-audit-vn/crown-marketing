#!/usr/bin/env node
/**
 * Sync Crown team member modal (CSS, markup, JS) from sites/www into other
 * marketing sites that have #team .team-card[data-member].
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { sites } from "./sites.mjs";
import { siteSeoByFolder } from "./seo/site-meta.mjs";
import { writeTextIfChanged } from "./fs-write-if-changed.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

/** @param {string} html */
function extractTeamModalBundles(html) {
  const style = html.match(
    /<style id="crown-team-member-modal">[\s\S]*?<\/style>/
  )?.[0];
  const script = html.match(
    /<script id="crown-team-member-modal">[\s\S]*?<\/script>/
  )?.[0];
  const modal = html.match(
    /<div class="team-modal" hidden id="teamMemberModal">[\s\S]*?<\/div>\n<\/div>\n(?=<div class="bot-panel"|<!-- ===== Floating quick-contact widgets ===== -->)/
  )?.[0];
  if (!style || !script || !modal) {
    throw new Error("Could not extract team modal bundles from sites/www/index.html");
  }
  return { style, modal: modal.trimEnd(), script };
}

/** @param {string} html */
function stripExisting(html) {
  return html
  .replace(/<style id="crown-team-member-modal">[\s\S]*?<\/style>\n?/g, "")
  .replace(
    /<div class="team-modal" hidden id="teamMemberModal">[\s\S]*?<\/div>\n<\/div>\n?/g,
    ""
  )
  .replace(/<script id="crown-team-member-modal">[\s\S]*?<\/script>\n?/g, "");
}

/** @param {string} html @param {string} style */
function insertStyle(html, style) {
  if (html.includes('id="crown-team-member-modal"')) return html;
  const anchor = "</style>\n<style";
  const idx = html.indexOf('id="crown-team-ten-2026"');
  if (idx === -1) {
    throw new Error("Missing crown-team-ten-2026 style block");
  }
  const closeIdx = html.indexOf("</style>", idx);
  if (closeIdx === -1) throw new Error("Unclosed crown-team-ten-2026 block");
  const insertAt = closeIdx + "</style>".length;
  return `${html.slice(0, insertAt)}\n${style}\n${html.slice(insertAt)}`;
}

/** @param {string} html @param {string} modal */
function insertModal(html, modal) {
  if (html.includes('id="teamMemberModal"')) return html;
  const markers = [
    "<!-- ===== Floating quick-contact widgets ===== -->",
    '<div class="bot-panel"',
  ];
  for (const marker of markers) {
    const i = html.indexOf(marker);
    if (i !== -1) return `${html.slice(0, i)}${modal}\n${html.slice(i)}`;
  }
  return html.replace("</body>", `${modal}\n</body>`);
}

/** @param {string} html @param {string} script */
function insertScript(html, script) {
  if (html.includes('id="crown-team-member-modal"') && html.includes("teamMemberModal")) {
    // style id shares name with script id — detect script separately
  }
  if (/<script id="crown-team-member-modal">/.test(html)) return html;
  return html.replace("</body>", `${script}\n</body>`);
}

/** @param {string} siteDir @param {string} primaryLang */
function isAlternateLocaleDir(relDir, primaryLang) {
  const alt = primaryLang === "vi" ? "en" : "vi";
  if (!relDir || relDir === ".") return false;
  return relDir.split(/[/\\]/)[0] === alt;
}

/** @param {string} siteDir @param {string} primaryLang @returns {string[]} */
function discoverPrimaryIndexHtml(siteDir, primaryLang) {
  /** @type {string[]} */
  const files = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) {
        if (name === "assets" || name === ".vercel") continue;
        const rel = relative(siteDir, full);
        if (isAlternateLocaleDir(rel, primaryLang)) continue;
        walk(full);
      } else if (name === "index.html") {
        files.push(full);
      }
    }
  };
  walk(siteDir);
  return files;
}

const wwwHtml = readFileSync(join(root, "sites", "www", "index.html"), "utf8");
const bundles = extractTeamModalBundles(wwwHtml);

let updated = 0;
let skipped = 0;

for (const { folder } of sites) {
  if (folder === "up") continue;
  const seo = siteSeoByFolder[folder];
  if (!seo) continue;
  const siteDir = join(root, "sites", folder);
  if (!existsSync(siteDir)) continue;

  for (const file of discoverPrimaryIndexHtml(siteDir, seo.lang)) {
    let html = readFileSync(file, "utf8");
    if (!html.includes('id="team"') || !html.includes("data-member=")) {
      skipped += 1;
      continue;
    }

    const next = insertScript(
      insertModal(insertStyle(stripExisting(html), bundles.style), bundles.modal),
      bundles.script
    );

    if (writeTextIfChanged(file, next)) {
      updated += 1;
      console.log(`[patch] ${relative(root, file)}`);
    }
  }
}

console.log(`Team modal sync complete (${updated} updated, ${skipped} skipped without #team).`);