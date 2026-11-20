#!/usr/bin/env node
/**
 * Crawl local preview servers: every sitemap URL, ?lang= variants, and old paths.
 * Usage: node scripts/seo/verify-local.mjs
 * Env: BASE_PORT (default 5100). Sites use BASE_PORT + index in scripts/sites.mjs.
 */
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { sites } from "../sites.mjs";
import { primaryLangByFolder, localePath, normalizePath, localeFromPath, logicalPath, primaryLangByHost } from "./locale-path.mjs";
import { wwwLegacyRedirects, wwwLegacyLangHints } from "./legacy-redirects.mjs";
import { rewriteOneHref } from "./rewrite-crown-links.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");
const basePort = Number(process.env.BASE_PORT ?? 5100);

/**
 * @param {string} url
 * @param {{ method?: string, maxHops?: number }} [opts]
 */
async function fetchHop(url, opts = {}) {
  const method = opts.method ?? "GET";
  const res = await fetch(url, { method, redirect: "manual" });
  const location = res.headers.get("location");
  let body = "";
  const type = res.headers.get("content-type") || "";
  if (method === "GET" && type.includes("html") && res.status === 200) {
    body = await res.text();
  } else {
    await res.arrayBuffer();
  }
  return { status: res.status, location, body, type };
}

/**
 * Follow at most one redirect to a 200. Fail on chains, 404, 500.
 * @param {string} start
 */
async function checkRedirectOrPage(start, expectFinalPath) {
  const first = await fetchHop(start);
  if (first.status === 200) {
    return { start, hops: 0, status: 200, final: start, body: first.body };
  }
  if (![301, 302, 307, 308].includes(first.status) || !first.location) {
    return { start, hops: 0, status: first.status, final: start, error: `unexpected status ${first.status}` };
  }
  const dest = new URL(first.location, start);
  const second = await fetchHop(dest.href);
  if (second.status !== 200) {
    return {
      start,
      hops: 1,
      status: second.status,
      final: dest.href,
      error: `redirected to ${dest.pathname} then ${second.status}`,
    };
  }
  if (expectFinalPath && normalizePath(dest.pathname) !== normalizePath(expectFinalPath)) {
    return {
      start,
      hops: 1,
      status: 200,
      final: dest.href,
      error: `expected ${expectFinalPath}, got ${dest.pathname}`,
    };
  }
  return { start, hops: 1, status: 200, final: dest.href, body: second.body };
}

/**
 * @param {string} html
 * @param {string} canonical
 * @param {string} lang
 */
function seoIssues(html, canonical, lang) {
  /** @type {string[]} */
  const issues = [];
  const canon = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  if (!canon) issues.push("missing canonical");
  else if (canon[1] !== canonical) issues.push(`canonical ${canon[1]} != ${canonical}`);
  const ogUrl = html.match(/<meta\s+property="og:url"\s+content="([^"]+)"/i);
  if (ogUrl && ogUrl[1] !== canonical) issues.push(`og:url ${ogUrl[1]} != canonical`);
  const htmlLang = html.match(/<html\b[^>]*\slang="([^"]+)"/i);
  if (!htmlLang) issues.push("missing html lang");
  else if (htmlLang[1] !== lang) issues.push(`html lang=${htmlLang[1]} != ${lang}`);
  for (const code of ["vi", "en", "x-default"]) {
    if (!html.includes(`hreflang="${code}"`)) issues.push(`missing hreflang ${code}`);
  }
  if (/noindex/i.test(html) && !/max-image-preview/.test(html)) {
    issues.push("noindex present");
  } else if (/\bnoindex\b/i.test(html.replace(/max-image-preview:large/g, ""))) {
    const robots = html.match(/name="robots"[^>]*content="([^"]+)"/i);
    if (robots?.[1]?.toLowerCase().includes("noindex")) issues.push("noindex on real page");
  }
  return issues;
}

function originFor(folder) {
  const idx = sites.findIndex((s) => s.folder === folder);
  return `http://127.0.0.1:${basePort + idx}`;
}

function sitemapLocs(folder) {
  const xml = readFileSync(join(root, "sites", folder, "sitemap.xml"), "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

/** @type {string[]} */
const failures = [];
let checked = 0;
let pagesOk = 0;
let redirectsOk = 0;

for (const { folder, domain } of sites) {
  const origin = originFor(folder);
  const primary = primaryLangByFolder[folder];
  const locs = sitemapLocs(folder);

  for (const loc of locs) {
    const url = new URL(loc);
    const pageUrl = origin + url.pathname;
    const lang =
      url.pathname === "/en" || url.pathname.startsWith("/en/") ?
        "en"
      : url.pathname === "/vi" || url.pathname.startsWith("/vi/") ?
        "vi"
      : primary;
    const result = await checkRedirectOrPage(pageUrl);
    checked += 1;
    if (result.error || result.status !== 200 || result.hops !== 0) {
      failures.push(`${folder} ${url.pathname}: expected 200 direct, got hops=${result.hops} status=${result.status} ${result.error ?? ""}`);
      continue;
    }
    const issues = seoIssues(result.body, loc, lang);
    if (issues.length) {
      failures.push(`${folder} ${url.pathname}: ${issues.join("; ")}`);
      continue;
    }
    pagesOk += 1;

    // ?lang= variants should be a single hop to the matching locale path.
    for (const langParam of ["en", "vi"]) {
      const destPath = localePath(url.pathname, langParam, primary);
      const start = `${pageUrl}?lang=${langParam}`;
      const hop = await checkRedirectOrPage(start, destPath);
      checked += 1;
      if (hop.error || hop.status !== 200 || hop.hops !== 1) {
        failures.push(`${folder} ${url.pathname}?lang=${langParam}: hops=${hop.hops} status=${hop.status} ${hop.error ?? ""}`);
      } else {
        redirectsOk += 1;
      }
    }
  }
}

// Old crowna-website paths on www only.
const wwwOrigin = originFor("www");
for (const rule of wwwLegacyRedirects) {
  if (rule.source.includes(":")) {
    // Skip parameterized templates; covered by a sample below.
    continue;
  }
  const start = wwwOrigin + rule.source;
  const expect = rule.destination.startsWith("http")
    ? null
    : rule.destination.split("#")[0] || "/";
  const first = await fetchHop(start);
  checked += 1;
  if (![301, 302, 307, 308].includes(first.status) || !first.location) {
    failures.push(`legacy ${rule.source}: status ${first.status}`);
    continue;
  }
  const dest = new URL(first.location, start);
  if (rule.destination.startsWith("http")) {
    if (dest.href.replace(/\/$/, "") !== rule.destination.replace(/\/$/, "")) {
      failures.push(`legacy ${rule.source}: got ${dest.href}, expected ${rule.destination}`);
      continue;
    }
    redirectsOk += 1;
    continue;
  }
  const destPath = dest.pathname + (dest.hash || "");
  const expectedFull = rule.destination;
  if (normalizePath(dest.pathname) !== normalizePath(expect) || (expectedFull.includes("#") && dest.hash !== `#${expectedFull.split("#")[1]}`)) {
    failures.push(`legacy ${rule.source}: got ${dest.pathname}${dest.hash}, expected ${rule.destination}`);
    continue;
  }
  if (dest.origin.startsWith("http://127.0.0.1")) {
    const second = await fetchHop(dest.origin + dest.pathname);
    if (second.status !== 200) {
      failures.push(`legacy ${rule.source}: target ${dest.pathname} is ${second.status}`);
      continue;
    }
  }
  redirectsOk += 1;
}

// Sample parameterized insight + a few lang hints
const sampleLegacyLang = wwwLegacyLangHints.filter((h) => !h.source.includes(":"));
for (const hint of sampleLegacyLang) {
  const start = `${wwwOrigin}${hint.source}?lang=${hint.lang}`;
  const first = await fetchHop(start);
  checked += 1;
  if (![301, 302, 307, 308].includes(first.status) || !first.location) {
    failures.push(`legacy ${hint.source}?lang=${hint.lang}: status ${first.status}`);
    continue;
  }
  const dest = new URL(first.location, start);
  if (hint.destination.startsWith("http")) {
    if (dest.href.replace(/\/$/, "") !== hint.destination.replace(/\/$/, "")) {
      failures.push(`legacy ${hint.source}?lang=${hint.lang}: got ${dest.href}`);
      continue;
    }
    redirectsOk += 1;
    continue;
  }
  const expectPath = hint.destination.split("#")[0] || "/";
  if (normalizePath(dest.pathname) !== normalizePath(expectPath)) {
    failures.push(`legacy ${hint.source}?lang=${hint.lang}: got ${dest.pathname}, expected ${expectPath}`);
    continue;
  }
  redirectsOk += 1;
}

const viInsight = `${wwwOrigin}/vi/insights/fdi-tax-compliance`;
const viPage = await checkRedirectOrPage(viInsight);
checked += 1;
if (viPage.error || viPage.status !== 200 || viPage.hops !== 0) {
  failures.push(`/vi/insights/:slug expected 200 direct, hops=${viPage.hops} status=${viPage.status} ${viPage.error ?? ""}`);
} else {
  pagesOk += 1;
}

const retiredEn = [
  ["/en", "/"],
  ["/en/about", "/about"],
  ["/en/insights/fdi-tax-compliance", "/insights/fdi-tax-compliance"],
];
for (const [src, dest] of retiredEn) {
  const hop = await checkRedirectOrPage(`${wwwOrigin}${src}`, dest);
  checked += 1;
  if (hop.error || hop.hops !== 1) {
    failures.push(`${src} → ${dest}: ${hop.error ?? `hops=${hop.hops}`}`);
  } else {
    redirectsOk += 1;
  }
}

// Crawl every href on every sitemap page of every site.
const folderByHost = Object.fromEntries(sites.map((s) => [s.domain, s.folder]));
folderByHost["www.crown.com.vn"] = "www";

for (const { folder, domain } of sites) {
  const origin = originFor(folder);
  const primary = primaryLangByFolder[folder];
  for (const loc of sitemapLocs(folder)) {
    const url = new URL(loc);
    const pageUrl = origin + url.pathname;
    const pageLocale = localeFromPath(url.pathname) ?? primary;
    const page = await fetchHop(pageUrl);
    checked += 1;
    if (page.status !== 200) {
      failures.push(`crawl ${folder} ${url.pathname}: status ${page.status}`);
      continue;
    }
    const hrefs = [...page.body.matchAll(/\shref="([^"]+)"/gi)].map((m) => m[1]);
    for (const href of hrefs) {
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue;
      let resolved;
      try {
        resolved = new URL(href, `https://${domain}${url.pathname}`);
      } catch {
        continue;
      }
      if (!primaryLangByHost[resolved.hostname]) continue;
      if (resolved.pathname.startsWith("/assets/")) continue;
      const expected = rewriteOneHref(href, pageLocale, domain);
      let expectedUrl;
      try {
        expectedUrl = new URL(expected, `https://${domain}${url.pathname}`);
      } catch {
        failures.push(`crawl ${folder} ${url.pathname}: bad expected href ${href} → ${expected}`);
        continue;
      }
      const hrefLogical = logicalPath(resolved.pathname);
      const pageLogical = logicalPath(url.pathname);
      const hrefLang = localeFromPath(resolved.pathname) ?? "en";
      const isSwitcher =
        resolved.hostname === domain &&
        hrefLogical === pageLogical &&
        hrefLang !== pageLocale;
      const gotPath = resolved.pathname.replace(/\/+$/, "") || "/";
      const expPath = expectedUrl.pathname.replace(/\/+$/, "") || "/";
      if (!isSwitcher && (resolved.hostname !== expectedUrl.hostname || gotPath !== expPath)) {
        failures.push(`crawl ${folder} ${url.pathname}: href ${href} should be ${expected} (locale ${pageLocale})`);
        continue;
      }
      const fetchPath = isSwitcher ? resolved.pathname : expectedUrl.pathname;
      const fetchHost = isSwitcher ? resolved.hostname : expectedUrl.hostname;
      const targetFolder = folderByHost[isSwitcher ? resolved.hostname : expectedUrl.hostname];
      if (!targetFolder) continue;
      const targetOrigin = originFor(targetFolder);
      const target = await fetchHop(targetOrigin + (isSwitcher ? resolved.pathname : expectedUrl.pathname));
      checked += 1;
      if (target.status !== 200) {
        failures.push(`crawl ${folder} ${url.pathname}: ${isSwitcher ? resolved.hostname + resolved.pathname : expectedUrl.hostname + expectedUrl.pathname} → ${target.status}`);
      }
    }
  }
}

console.log(`Checked ${checked} URLs (${pagesOk} sitemap pages, ${redirectsOk} redirects)`);
if (failures.length) {
  console.error(`\nFAIL — ${failures.length} issue(s):\n`);
  for (const f of failures.slice(0, 60)) console.error(`  • ${f}`);
  if (failures.length > 60) console.error(`  … +${failures.length - 60} more`);
  process.exit(1);
}
console.log("PASS");
