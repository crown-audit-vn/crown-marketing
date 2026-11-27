#!/usr/bin/env node
/**
 * Technical performance pass for all 8 static sites.
 *
 * Safe to re-run. Does not change visible copy, titles, meta descriptions,
 * headings, or layout. Does not add pages, service indexes, or internal-link
 * blocks. Does not write redirect rules to vercel.json.
 *
 * Run: node scripts/seo/apply-perf.mjs
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  cpSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { writeTextIfChanged } from "../fs-write-if-changed.mjs";
import { sites } from "../sites.mjs";
import { writeSiteVercelJson } from "./legacy-redirects.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");

const HERO_PHOTO_ID = {
  www: "38385774",
  audit: "8297478",
  acc: "36733326",
  tax: "7693699",
  esg: "33363579",
  cons: "29299826",
  fas: "7845282",
};

/** Native or capped widths available for each site's hero (never upscaled). */
const HERO_WIDTHS = {
  www: [800, 1280, 1920],
  audit: [800, 1280, 1920],
  acc: [800, 1280, 1920],
  tax: [800, 1280, 1920],
  esg: [800, 1280, 1920],
  cons: [800, 1280, 1920],
  fas: [800, 1280, 1920],
  up: [800, 1280, 1916],
};

function heroMaxWidth(folder) {
  const widths = HERO_WIDTHS[folder] || [1920];
  return widths[widths.length - 1];
}

function heroOneXWidth(folder) {
  const widths = HERO_WIDTHS[folder] || [1280];
  return widths.includes(1280) ? 1280 : heroMaxWidth(folder);
}

/** CSS image-set: 1x uses 1280 (sharp at desktop 1x), 2x uses native max (≤1920, never upscaled). */
function heroImageSet(folder) {
  const x1 = heroOneXWidth(folder);
  const x2 = heroMaxWidth(folder);
  return (
    `image-set(` +
    `url("/assets/images/hero-lcp-${x1}.avif") type("image/avif") 1x, ` +
    `url("/assets/images/hero-lcp-${x2}.avif") type("image/avif") 2x, ` +
    `url("/assets/images/hero-lcp-${x1}.webp") type("image/webp") 1x, ` +
    `url("/assets/images/hero-lcp-${x2}.webp") type("image/webp") 2x)`
  );
}

function heroSrcset(folder, ext) {
  return (HERO_WIDTHS[folder] || [1920])
    .map((w) => `/assets/images/hero-lcp-${w}.${ext} ${w}w`)
    .join(", ");
}

/** Match CSS image-set() 1x/2x so preload and the background pick the same file. */
function heroDensitySrcset(folder) {
  const x1 = heroOneXWidth(folder);
  const x2 = heroMaxWidth(folder);
  return `/assets/images/hero-lcp-${x1}.avif 1x, /assets/images/hero-lcp-${x2}.avif 2x`;
}

/** www, cons and fas already used media=print onload in 0b1e5cb. */
const PREEXISTING_ASYNC_CSS = new Set(["www", "cons", "fas"]);

function stripPrintOnload(tag) {
  return tag
    .replace(/\s*media=["']print["']/i, "")
    .replace(/\s*onload="this\.media='all'"/i, "")
    .replace(/\s*onload='this\.media="all"'/i, "");
}

const FONT_PRELOAD_EN = [
  "/assets/fonts/inter-latin.woff2",
  "/assets/fonts/playfair-display-latin.woff2",
  "/assets/fonts/playfair-display-latin-italic.woff2",
];
const FONT_PRELOAD_VI = [
  "/assets/fonts/inter-latin.woff2",
  "/assets/fonts/inter-vietnamese.woff2",
  "/assets/fonts/playfair-display-latin.woff2",
  "/assets/fonts/playfair-display-latin-italic.woff2",
  "/assets/fonts/playfair-display-vietnamese.woff2",
  "/assets/fonts/playfair-display-vietnamese-italic.woff2",
];

const SHARED_FONTS = join(root, "shared/perf-fonts");
const SHARED_HEROES = join(root, "shared/perf-heroes");
const DIMS_FILE = join(root, "shared/perf-image-dims.json");

function walkHtml(dir, acc = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === "assets" || ent.name === ".git") {
      continue;
    }
    const p = join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(p, acc);
    else if (ent.isFile() && ent.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

function isViPage(relPosix) {
  return /(?:^|\/)vi\//.test(relPosix);
}

function isHomePage(relPosix) {
  return /^(vi\/)?index\.html$/.test(relPosix);
}

function normalizeSrc(src) {
  return String(src || "").replace(/&amp;/g, "&");
}

function loadDims() {
  if (!existsSync(DIMS_FILE)) return {};
  return JSON.parse(readFileSync(DIMS_FILE, "utf8"));
}

function lookupRemoteDims(dims, src) {
  const key = normalizeSrc(src);
  if (dims[key]) return dims[key];
  // allow lookup without query-encoding differences
  for (const [k, v] of Object.entries(dims)) {
    if (normalizeSrc(k) === key) return v;
  }
  return null;
}

function readU32(buf, offset, le = false) {
  return le ? buf.readUInt32LE(offset) : buf.readUInt32BE(offset);
}

function sizeFromImageBuffer(buf, ext) {
  if (ext === ".png" || (buf.length > 24 && buf[0] === 0x89 && buf[1] === 0x50)) {
    if (buf.length < 24) return null;
    return { width: readU32(buf, 16), height: readU32(buf, 20) };
  }
  if (ext === ".svg" || (buf.length > 16 && buf.toString("utf8", 0, 64).includes("<svg"))) {
    const text = buf.toString("utf8");
    const vb = text.match(/\bviewBox=["']\s*[-0-9.]+\s+[-0-9.]+\s+([0-9.]+)\s+([0-9.]+)/i);
    if (vb) return { width: Math.round(Number(vb[1])), height: Math.round(Number(vb[2])) };
    const w = text.match(/<svg[^>]*\bwidth=["']([0-9.]+)/i);
    const h = text.match(/<svg[^>]*\bheight=["']([0-9.]+)/i);
    if (w && h) return { width: Math.round(Number(w[1])), height: Math.round(Number(h[1])) };
    return null;
  }
  if (ext === ".webp" || (buf.length > 16 && buf.toString("ascii", 0, 4) === "RIFF")) {
    // VP8X
    if (buf.toString("ascii", 8, 12) === "WEBP") {
      const chunk = buf.toString("ascii", 12, 16);
      if (chunk === "VP8X" && buf.length >= 30) {
        const w = 1 + buf[24] + (buf[25] << 8) + (buf[26] << 16);
        const h = 1 + buf[27] + (buf[28] << 8) + (buf[29] << 16);
        return { width: w, height: h };
      }
      if (chunk === "VP8 " && buf.length >= 30) {
        // lossy: 26-29 have 16-bit minus sync, actually width at 26
        const w = buf.readUInt16LE(26) & 0x3fff;
        const h = buf.readUInt16LE(28) & 0x3fff;
        return { width: w, height: h };
      }
      if (chunk === "VP8L" && buf.length >= 25) {
        const bits = buf.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
    }
  }
  if (ext === ".jpg" || ext === ".jpeg") {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) break;
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      // SOF0/2
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  }
  return null;
}

function sizeFromLocalAsset(siteDir, src, cache) {
  const pathOnly = normalizeSrc(src).split("?")[0];
  if (!pathOnly.startsWith("/assets/")) return null;
  if (cache[pathOnly]) return cache[pathOnly];
  const file = join(siteDir, pathOnly.replace(/^\//, ""));
  if (!existsSync(file)) return null;
  const buf = readFileSync(file);
  const size = sizeFromImageBuffer(buf, extname(file).toLowerCase());
  if (size) cache[pathOnly] = size;
  return size;
}

function copyAssets() {
  for (const site of sites) {
    const heroSrc = join(SHARED_HEROES, site.folder);
    if (existsSync(heroSrc)) {
      const heroDest = join(root, "sites", site.folder, "assets", "images");
      mkdirSync(heroDest, { recursive: true });
      for (const name of readdirSync(heroSrc)) {
        if (!/^hero-lcp-\d+\.(avif|webp)$/.test(name)) continue;
        cpSync(join(heroSrc, name), join(heroDest, name));
      }
    }
  }
}

function replaceHeroBackgrounds(html, folder) {
  const id = HERO_PHOTO_ID[folder];
  if (!id) return html;
  const re = new RegExp(
    String.raw`url\(\s*(['"]?)https://images\.pexels\.com/photos/${id}/[^)'"]+?\1\s*\)`,
    "gi"
  );
  return html.replace(re, heroImageSet(folder));
}

function stripGoogleFontLinks(html) {
  return html
    .replace(/\s*<link\b[^>]*href="https:\/\/fonts\.googleapis\.com"[^>]*>/gi, "")
    .replace(/\s*<link\b[^>]*href="https:\/\/fonts\.gstatic\.com"[^>]*>/gi, "")
    .replace(/\s*<link\b[^>]*href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+"[^>]*>/gi, "");
}

function restoreDeferredLeadScript(html) {
  // defer moved consultation-leads-client.js past FCP and added TBT.
  // Restore the 0b1e5cb blocking script; it is small first-party JS.
  return html.replace(
    /<script\b([^>]*\bsrc=["'][^"']*consultation-leads-client\.js[^"']*["'][^>]*)>/gi,
    (full, attrs) => `<script${attrs.replace(/\s*\bdefer\b/gi, "")}>`
  );
}

function delayThirdPartyWidgets(html) {
  // Official Zalo/Messenger SDKs only. In-page FAB <a> links stay visible.
  const widgetSrc =
    /<script\b([^>]*\bsrc=["'][^"']*(?:connect\.facebook\.net|zalo-chat-widget|sp\.zalo\.me|facebook\.com\/[^"']*sdk)[^"']*["'][^>]*)>\s*<\/script>/gi;
  return html.replace(widgetSrc, (full) => {
    if (full.includes("data-crown-widget-delay")) return full;
    const src = (full.match(/\bsrc=["']([^"']+)["']/i) || [])[1];
    if (!src) return full;
    return `<script data-crown-widget-delay="1">
(function(){function l(){if(document.querySelector('script[data-crown-widget-src="${src.replace(/"/g, "")}"]'))return;var s=document.createElement('script');s.src="${src.replace(/"/g, "")}";s.async=true;s.dataset.crownWidgetSrc="${src.replace(/"/g, "")}";document.head.appendChild(s);}
if('requestIdleCallback' in window)requestIdleCallback(l,{timeout:4000});
else setTimeout(l,2000);
['pointerdown','keydown','touchstart'].forEach(function(ev){window.addEventListener(ev,l,{once:true,passive:true});});})();
</script>`;
  });
}

function enhanceFaStylesheet(html, folder) {
  return html.replace(
    /(<noscript>)?<link\b([^>]*font-awesome[^>]*)>/gi,
    (full, noscript, attrs) => {
      if (noscript) return full;
      if (PREEXISTING_ASYNC_CSS.has(folder)) {
        if (!/\bmedia=/.test(attrs || "")) {
          return full.replace(
            /\brel=["']stylesheet["']/,
            'rel="stylesheet" media="print" onload="this.media=\'all\'"'
          );
        }
        return full;
      }
      return stripPrintOnload(full);
    }
  );
}

function ensureFaNoscript(html) {
  const fa = [...html.matchAll(/<link\b[^>]*font-awesome[^>]*>/gi)]
    .map((m) => m[0])
    .find((tag) => !/media=["']print["']/.test(tag) || !tag.includes("noscript"));
  const hrefSource = html.match(/<link\b[^>]*font-awesome[^>]*>/i);
  if (!hrefSource) return html;
  const href = (hrefSource[0].match(/\bhref=["']([^"']+)["']/i) || [])[1];
  if (!href) return html;
  const tag = `<noscript><link rel="stylesheet" href="${href}"></noscript>`;
  if (/<noscript>\s*<link\b[^>]*font-awesome[^>]*>\s*<\/noscript>/i.test(html)) {
    return html.replace(
      /<noscript>\s*<link\b[^>]*font-awesome[^>]*>\s*<\/noscript>/gi,
      tag
    );
  }
  // Attach after the first (non-noscript) FA stylesheet.
  const first = hrefSource[0];
  return html.replace(first, `${first}\n${tag}`);
}

function enhanceGoogleFontStylesheet(html, folder) {
  return html.replace(
    /<link\b([^>]*fonts\.googleapis\.com\/css2[^>]*)>/gi,
    (full) => {
      if (PREEXISTING_ASYNC_CSS.has(folder)) {
        if (/\bmedia=/.test(full)) return full;
        return full.replace(
          /\brel=["']stylesheet["']/,
          'rel="stylesheet" media="print" onload="this.media=\'all\'"'
        );
      }
      return stripPrintOnload(full);
    }
  );
}

function lcpPreloadTag(lcp) {
  if (!lcp || !(lcp.densitySrcset || lcp.srcset || lcp.href)) return "";
  const typeAttr = lcp.type ? ` type="${lcp.type}"` : "";
  const href = lcp.href || "";
  const cross = /^https?:\/\//i.test(href) ? ' crossorigin="anonymous"' : "";
  let srcset = "";
  let hrefAttr = "";
  if (lcp.densitySrcset) {
    // 1x/2x must match CSS image-set. Omit href so it cannot fetch a second candidate.
    srcset = ` imagesrcset="${lcp.densitySrcset}"`;
  } else if (lcp.srcset) {
    // <picture> heroes (up): keep w-descriptors, omit href to avoid a double fetch.
    srcset = ` imagesrcset="${lcp.srcset}" imagesizes="${lcp.sizes || "100vw"}"`;
  } else {
    hrefAttr = ` href="${lcp.href}"`;
  }
  return `<link rel="preload" as="image"${hrefAttr} fetchpriority="high"${typeAttr}${srcset}${cross} data-crown-lcp="hero">`;
}

function fontAndLcpHead(html, { lcp, folder }) {
  // Do not self-host UI fonts: metric differences (especially italic)
  // change wrapping. Keep the original Google Fonts CSS.
  html = html.replace(/\n?\[object Object\]\s*/g, "");
  html = html.replace(/\s*<link rel="preload" href="\/assets\/fonts\/[^"]+" as="font" type="font\/woff2" crossorigin>/g, "");
  html = html.replace(/\s*<style id="crown-fonts">[\s\S]*?<\/style>/g, "");
  html = enhanceGoogleFontStylesheet(html, folder);
  // Always refresh the LCP preload so a previous w-descriptor tag is replaced.
  html = html.replace(/\s*<link rel="preload"[^>]*data-crown-lcp="hero"[^>]*>/gi, "");
  const lcpTag = lcpPreloadTag(lcp);
  if (!lcpTag) return html;
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${lcpTag}\n</head>`);
  }
  return lcpTag + html;
}

function patchImgTag(tag, { siteDir, dims, localCache, isLcp }) {
  const src = (tag.match(/\bsrc=["']([^"']+)["']/i) || [])[1];
  if (!src) return tag;
  let next = tag;
  const hasW = /\bwidth\s*=/.test(next);
  const hasH = /\bheight\s*=/.test(next);
  if (!hasW || !hasH) {
    const size =
      lookupRemoteDims(dims, src) || sizeFromLocalAsset(siteDir, src, localCache);
    if (size) {
      if (!hasW) next = next.replace(/<img\b/i, `<img width="${size.width}"`);
      if (!hasH) next = next.replace(/<img\b/i, `<img height="${size.height}"`);
    }
  }
  if (isLcp) {
    if (!/\bfetchpriority\s*=/.test(next)) {
      next = next.replace(/<img\b/i, `<img fetchpriority="high"`);
    }
    // In-viewport LCP must not be lazy.
    if (/\bloading=["']lazy["']/i.test(next)) {
      next = next.replace(/\sloading=["']lazy["']/i, ' loading="eager"');
    } else if (!/\bloading=/.test(next)) {
      next = next.replace(/<img\b/i, `<img loading="eager"`);
    }
    if (!/\bdecoding=/.test(next)) {
      next = next.replace(/<img\b/i, `<img decoding="async"`);
    }
  } else {
    const isHeaderLogo =
      /brand-logo-image/.test(next) && /crown-logo-header/.test(src);
    // First header logo stays eager; footer logo (already lazy) and other images lazy.
    const inHeader = false; // decided by caller via isLcp / isHeaderEager
    if (!/\bdecoding=/.test(next)) {
      next = next.replace(/<img\b/i, `<img decoding="async"`);
    }
    if (!/\bloading=/.test(next) && !isHeaderLogo) {
      next = next.replace(/<img\b/i, `<img loading="lazy"`);
    }
    // Footer header-logo is already lazy on some pages; first remains eager.
  }
  return next;
}

function findLcpImgIndex(tags, html, relPosix, folder) {
  // Prefer a clearly marked hero photo.
  for (let i = 0; i < tags.length; i++) {
    const t = tags[i];
    if (/\bfetchpriority\s*=\s*["']high["']/i.test(t)) return i;
    if (/\bclass=["'][^"']*(?:hero-photo|ins-hero)/i.test(t)) return i;
  }
  // Up homepage uses .hero-photo (already caught). Other homes use CSS backgrounds.
  return -1;
}

function patchAllImages(html, ctx) {
  const tags = [];
  const re = /<img\b[^>]*>/gi;
  let m;
  const found = [];
  while ((m = re.exec(html))) found.push({ start: m.index, end: m.index + m[0].length, tag: m[0] });
  const lcpIndex = findLcpImgIndex(
    found.map((x) => x.tag),
    html,
    ctx.relPosix,
    ctx.folder
  );
  // Header logo: first crown-logo-header stays eager; later ones lazy.
  let seenHeaderLogo = false;
  let out = "";
  let cursor = 0;
  found.forEach((item, i) => {
    out += html.slice(cursor, item.start);
    let tag = item.tag;
    const src = (tag.match(/\bsrc=["']([^"']+)["']/i) || [])[1] || "";
    const isHeaderLogo = /crown-logo-header/.test(src);
    const isLcp = i === lcpIndex;
    tag = patchImgTag(tag, { ...ctx, isLcp });
    if (isHeaderLogo) {
      if (!seenHeaderLogo) {
        seenHeaderLogo = true;
        if (/\bloading=["']lazy["']/i.test(tag)) {
          tag = tag.replace(/\sloading=["']lazy["']/i, ' loading="eager"');
        } else if (!/\bloading=/.test(tag)) {
          tag = tag.replace(/<img\b/i, `<img loading="eager"`);
        }
      } else if (!/\bloading=/.test(tag)) {
        tag = tag.replace(/<img\b/i, `<img loading="lazy"`);
      }
    }
    out += tag;
    cursor = item.end;
  });
  out += html.slice(cursor);
  return out;
}

function wrapUpHeroPicture(html, folder) {
  if (folder !== "up") return html;
  if (html.includes("hero-lcp-") && html.includes("<picture>")) return html;
  const avif = heroSrcset(folder, "avif");
  const webp = heroSrcset(folder, "webp");
  return html.replace(
    /<img([^>]*class=["'][^"']*hero-photo[^"']*["'][^>]*)>/gi,
    (full, attrs) => {
      // Keep original src as the fallback (existing webp). Do not touch object-fit/position CSS.
      return `<picture><source type="image/avif" srcset="${avif}" sizes="100vw"><source type="image/webp" srcset="${webp}" sizes="100vw"><img${attrs}></picture>`;
    }
  );
}

function detectLcpHref(html, folder, relPosix) {
  if (isHomePage(relPosix) && HERO_PHOTO_ID[folder]) {
    return {
      href: `/assets/images/hero-lcp-${heroMaxWidth(folder)}.avif`,
      type: "image/avif",
      densitySrcset: heroDensitySrcset(folder),
    };
  }
  if (isHomePage(relPosix) && folder === "up") {
    const max = heroMaxWidth(folder);
    return {
      href: `/assets/images/hero-lcp-${max}.avif`,
      type: "image/avif",
      srcset: heroSrcset(folder, "avif"),
      sizes: "100vw",
    };
  }
  const high = html.match(/<img\b[^>]*\bfetchpriority\s*=\s*["']high["'][^>]*>/i);
  const hero = html.match(/<img\b[^>]*class=["'][^"']*(?:hero-photo|ins-hero)[^"']*["'][^>]*>/i);
  const tag = (high || hero || [])[0];
  if (!tag) return { href: null, type: null };
  const src = (tag.match(/\bsrc=["']([^"']+)["']/i) || [])[1];
  return { href: src ? src.replace(/&amp;/g, "&") : null, type: null };
}

function withPreservedNewlines(original, next) {
  const usesCrlf = original.includes("\r\n");
  next = next.replace(/\r\n/g, "\n");
  if (usesCrlf) next = next.replace(/\n/g, "\r\n");
  return next;
}

function scanDanglingServices(html, rel, report) {
  // Ignore middleware/comments; flag published href/src/loc/canonical/@id.
  const re =
    /(?:href|src|content|srcset)\s*=\s*["'][^"']*\/services\/[^"']*["']/gi;
  const jsonld = /\/services\/[a-z0-9-/]+/gi;
  const hits = html.match(re) || [];
  // JSON-LD script bodies
  const extra = [];
  if (/application\/ld\+json/i.test(html) && /\/services\//.test(html)) {
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
    for (const b of blocks) {
      const found = b[1].match(/https?:\/\/[^"\s]+\/services\/[^"\s]+/g) || [];
      extra.push(...found);
    }
  }
  if (hits.length || extra.length) {
    report.push({ file: rel, hrefs: hits, jsonld: extra });
  }
}

function applyHtml(file, folder, dims, localCache, report) {
  const original = readFileSync(file, "utf8");
  const relPosix = relative(join(root, "sites", folder), file).replaceAll("\\", "/");
  let html = original;

  html = replaceHeroBackgrounds(html, folder);
  html = wrapUpHeroPicture(html, folder);
  html = enhanceFaStylesheet(html, folder);
  html = ensureFaNoscript(html);
  html = restoreDeferredLeadScript(html);
  html = delayThirdPartyWidgets(html);
  html = patchAllImages(html, { siteDir: join(root, "sites", folder), dims, localCache, folder, relPosix });

  const lcp = detectLcpHref(html, folder, relPosix);
  html = fontAndLcpHead(html, { vi: isViPage(relPosix), lcp, folder });

  scanDanglingServices(html, `${folder}/${relPosix}`, report);

  const next = withPreservedNewlines(original, html);
  const changed = next !== original;
  if (changed) writeTextIfChanged(file, next);
  return changed;
}

function scanTextAsset(file, rel, report) {
  if (!existsSync(file)) return;
  const text = readFileSync(file, "utf8");
  const hits = text.match(/https?:\/\/[^"'<\s]+\/services\/[^"'<\s]+/g) || [];
  if (hits.length) report.push({ file: rel, hrefs: hits, jsonld: [] });
}

function main() {
  const dims = loadDims();
  copyAssets();

  const serviceReport = [];
  let changedFiles = 0;
  for (const site of sites) {
    const siteDir = join(root, "sites", site.folder);
    const localCache = {};
    const files = walkHtml(siteDir);
    for (const file of files) {
      if (applyHtml(file, site.folder, dims, localCache, serviceReport)) changedFiles += 1;
    }
    for (const name of ["sitemap.xml", "robots.txt", "llms.txt"]) {
      scanTextAsset(join(siteDir, name), `${site.folder}/${name}`, serviceReport);
    }
    writeSiteVercelJson(site.folder);
  }

  console.log(`apply-perf: updated ${changedFiles} HTML files across ${sites.length} sites`);
  if (serviceReport.length) {
    console.log("DANGLING /services/ references:");
    console.log(JSON.stringify(serviceReport, null, 2));
  } else {
    console.log("No published /services/ dangling references found.");
  }
}

main();
