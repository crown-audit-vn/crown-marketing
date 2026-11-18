#!/usr/bin/env node
/**
 * Sync enquiry success/error modals (CSS, markup, JS) from sites/www into all
 * marketing sites that use CrownConsultationLeads.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { sites } from "./sites.mjs";
import { writeTextIfChanged } from "./fs-write-if-changed.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const wwwIndex = join(root, "sites", "www", "index.html");

/** @param {string} html */
function extractBundles(html) {
  const enquiryCss = html.match(
    /(\.enquiry-success-modal\{[\s\S]*?\.enquiry-error-modal \.team-modal__close\{[^}]+\})/
  )?.[1];
  const modalShellCss = html.match(
    /(body\.team-modal-open\{overflow:hidden\}[\s\S]*?@keyframes teamModalPanel\{to\{opacity:1;transform:none\}\})/
  )?.[1];
  const modalsMarkup = html
    .match(
      /<div class="team-modal enquiry-success-modal" hidden id="enquirySuccessModal">[\s\S]*?(?=<!-- ===== Floating quick-contact widgets ===== -->|<a class="fab-call")/
    )?.[0]
    ?.trimEnd();
  const scriptStart = html.indexOf("let enquirySuccessLastFocus = null;");
  const scriptEnd = html.indexOf("async function crownComposeEnquiry(form)");
  const scriptBody =
    scriptStart >= 0 && scriptEnd > scriptStart
      ? html.slice(scriptStart, scriptEnd).trimEnd()
      : "";
  if (!enquiryCss || !modalShellCss || !modalsMarkup || !scriptBody) {
    throw new Error("Could not extract enquiry modal bundles from sites/www/index.html");
  }
  return {
    enquiryCss,
    modalShellCss,
    modalsMarkup,
    scriptBody,
  };
}

const bundles = extractBundles(readFileSync(wwwIndex, "utf8"));

const STYLE_OPEN = '<style id="crown-enquiry-modals">';
const STYLE_CLOSE = "</style>";
const SCRIPT_OPEN = '<script id="crown-enquiry-modals">';
const SCRIPT_CLOSE = "</script>";

/** @param {string} html */
function stripExisting(html) {
  return html
    .replace(/<style id="crown-enquiry-modals">[\s\S]*?<\/style>\n?/g, "")
    .replace(
      /<div class="team-modal enquiry-success-modal" hidden id="enquirySuccessModal">[\s\S]*?(?=<!-- ===== Floating quick-contact widgets ===== -->|<a class="fab-call")/g,
      ""
    )
    .replace(/<script id="crown-enquiry-modals">[\s\S]*?<\/script>\n?/g, "");
}

/**
 * @param {string} html
 * @param {string} enquiryCss
 * @param {string} modalShellCss
 */
function ensureStyles(html, enquiryCss, modalShellCss) {
  if (html.includes('id="crown-enquiry-modals"')) return html;
  const teamStyle = html.match(/<style id="crown-team-member-modal">([\s\S]*?)<\/style>/);
  if (teamStyle) {
    const inner = teamStyle[1];
    if (inner.includes(".enquiry-success-modal")) return html;
    const keyframesIdx = inner.indexOf("@keyframes teamModalBackdrop");
    const insertAt = keyframesIdx >= 0 ? keyframesIdx : inner.length;
    const nextInner =
      inner.slice(0, insertAt) + "\n" + enquiryCss + "\n" + inner.slice(insertAt);
    return html.replace(
      /<style id="crown-team-member-modal">[\s\S]*?<\/style>/,
      `<style id="crown-team-member-modal">${nextInner}</style>`
    );
  }
  const block = `${STYLE_OPEN}\n${modalShellCss}\n${enquiryCss}\n${STYLE_CLOSE}`;
  const headClose = html.indexOf("</head>");
  if (headClose === -1) throw new Error("Missing </head>");
  return `${html.slice(0, headClose)}\n${block}\n${html.slice(headClose)}`;
}

/** @param {string} html @param {string} modals */
function insertModals(html, modals) {
  if (html.includes('id="enquirySuccessModal"')) return html;
  const markers = [
    "<!-- ===== Floating quick-contact widgets ===== -->",
    '<a aria-label="Gọi ngay cho Crown"',
    '<a aria-label="Call Crown Audit"',
    '<a aria-label="Call Crown"',
    '<div class="fab-stack"',
    '<a class="fab-call"',
  ];
  for (const marker of markers) {
    const i = html.indexOf(marker);
    if (i !== -1) return `${html.slice(0, i)}${modals}\n${html.slice(i)}`;
  }
  return html.replace("</body>", `${modals}\n</body>`);
}

/** @param {string} html @param {string} scriptBody */
function insertScript(html, scriptBody) {
  if (html.includes('id="crown-enquiry-modals"')) return html;
  if (html.includes("function crownShowEnquirySuccess")) return html;
  const tag = `${SCRIPT_OPEN}\n${scriptBody}\n${SCRIPT_CLOSE}\n`;
  if (html.includes('id="crown-site-contact-forms"')) {
    return html.replace(
      /<script id="crown-site-contact-forms">/,
      `${tag}<script id="crown-site-contact-forms">`
    );
  }
  if (html.includes("consultation-leads-client.js")) {
    return html.replace(
      /<script src="\/assets\/consultation-leads-client\.js"><\/script>/,
      `${tag}<script src="/assets/consultation-leads-client.js"></script>`
    );
  }
  return html.replace("</body>", `${tag}</body>`);
}

/** @param {string} dir */
function indexHtmlFiles(dir) {
  /** @type {string[]} */
  const files = [];
  if (!existsSync(dir)) return files;
  const rootIdx = join(dir, "index.html");
  if (existsSync(rootIdx)) files.push(rootIdx);
  for (const sub of ["en", "vi"]) {
    const p = join(dir, sub, "index.html");
    if (existsSync(p)) files.push(p);
  }
  return files;
}

/**
 * @param {string} [onlyFolder]
 * @returns {number}
 */
export function patchEnquiryModals(onlyFolder) {
  const targetSites = onlyFolder
    ? sites.filter((s) => s.folder === onlyFolder)
    : sites.filter((s) => s.folder !== "www");

  let updated = 0;
  for (const site of targetSites) {
    const siteDir = resolve(root, "sites", site.folder);
    for (const file of indexHtmlFiles(siteDir)) {
      const before = readFileSync(file, "utf8");
      if (
        !before.includes("consultation-leads-client.js") &&
        !before.includes('id="tuvanForm"') &&
        !before.includes('id="contactForm"')
      ) {
        continue;
      }
      let html = stripExisting(before);
      html = ensureStyles(html, bundles.enquiryCss, bundles.modalShellCss);
      html = insertModals(html, bundles.modalsMarkup);
      html = insertScript(html, bundles.scriptBody);
      if (writeTextIfChanged(file, html)) updated += 1;
    }
  }
  return updated;
}

function main() {
  const only = process.argv[2];
  if (only && !sites.some((s) => s.folder === only)) {
    console.error(`Unknown site folder: ${only}`);
    process.exit(1);
  }
  const n = patchEnquiryModals(only);
  console.log(`enquiry-modals sync: ${n} HTML file(s) updated`);
}

const entry = process.argv[1] && resolve(process.argv[1]);
if (entry && import.meta.url === pathToFileURL(entry).href) {
  main();
}