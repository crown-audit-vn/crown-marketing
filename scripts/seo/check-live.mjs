#!/usr/bin/env node
/**
 * Kiểm tra production: robots.txt, sitemap.xml, crown-seo trên homepage.
 */
import { setTimeout as delay } from "node:timers/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { siteByFolder, sites } from "../sites.mjs";
import { liveSeoProbes } from "./live-probes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SEO_MARKER = "crown-seo:start";

/**
 * @typedef {{ domain: string, check: string, ok: boolean, detail: string }} LiveRow
 */

/**
 * @param {string} url
 * @returns {Promise<{ status: number, body: string }>}
 */
async function fetchText(url) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": "crown-marketing-seo-check/1.0" },
  });
  const body = await res.text();
  return { status: res.status, body };
}

/**
 * @param {string} domain
 * @returns {Promise<LiveRow[]>}
 */
async function checkOneDomain(domain) {
  /** @type {LiveRow[]} */
  const rows = [];

  const robotsUrl = `https://${domain}/robots.txt`;
  try {
    const robots = await fetchText(robotsUrl);
    const ok =
      robots.status === 200 &&
      robots.body.includes("User-agent") &&
      robots.body.includes(`https://${domain}/sitemap.xml`);
    rows.push({
      domain,
      check: "robots.txt",
      ok,
      detail: ok ? "200" : `HTTP ${robots.status}`,
    });
  } catch (err) {
    rows.push({
      domain,
      check: "robots.txt",
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
    });
  }

  const sitemapUrl = `https://${domain}/sitemap.xml`;
  try {
    const sm = await fetchText(sitemapUrl);
    const ok =
      sm.status === 200 &&
      sm.body.includes("<urlset") &&
      sm.body.includes(`https://${domain}`);
    rows.push({
      domain,
      check: "sitemap.xml",
      ok,
      detail: ok ? "200" : `HTTP ${sm.status}`,
    });
  } catch (err) {
    rows.push({
      domain,
      check: "sitemap.xml",
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
    });
  }

  const homeUrl = `https://${domain}/`;
  try {
    const home = await fetchText(homeUrl);
    const ok = home.status === 200 && home.body.includes(SEO_MARKER);
    rows.push({
      domain,
      check: "crown-seo (/)",
      ok,
      detail: ok ? "200 + marker" : `HTTP ${home.status}, thiếu crown-seo`,
    });
  } catch (err) {
    rows.push({
      domain,
      check: "crown-seo (/)",
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
    });
  }

  const llmsUrl = `https://${domain}/llms.txt`;
  try {
    const llms = await fetchText(llmsUrl);
    const ok = llms.status === 200 && llms.body.length > 20 && llms.body.includes("http");
    rows.push({
      domain,
      check: "llms.txt",
      ok,
      detail: ok ? "200" : `HTTP ${llms.status}`,
    });
  } catch (err) {
    rows.push({
      domain,
      check: "llms.txt",
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
    });
  }

  return rows;
}

/**
 * @param {string} domain
 * @param {string} path
 * @returns {Promise<LiveRow>}
 */
async function checkProbePath(domain, path) {
  const url = `https://${domain}${path}`;
  const label = `crown-seo (${path})`;
  try {
    const res = await fetchText(url);
    let ok = res.status === 200 && res.body.includes(SEO_MARKER);
    let detail = ok ? "200 + marker" : `HTTP ${res.status}, thiếu crown-seo`;
    if (ok && path.includes("/insights/") && path !== "/insights") {
      if (!res.body.includes('"datePublished"')) {
        ok = false;
        detail = "thiếu datePublished trong JSON-LD";
      } else if (!res.body.includes('data-crown-lcp="hero"')) {
        ok = false;
        detail = "thiếu preload LCP hero";
      }
    }
    return {
      domain,
      check: label,
      ok,
      detail,
    };
  } catch (err) {
    return {
      domain,
      check: label,
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * @param {{ folders?: string[], retries?: number, delayMs?: number }} [options]
 * @returns {Promise<{ ok: boolean, rows: LiveRow[] }>}
 */
export async function checkLiveSeo({
  folders,
  retries = 3,
  delayMs = 5000,
} = {}) {
  const list = folders?.length
    ? folders.map((f) => siteByFolder.get(f)).filter(Boolean)
  : sites;

  /** @type {LiveRow[]} */
  let rows = [];

  for (let attempt = 1; attempt <= retries; attempt++) {
    rows = [];
    for (const { domain } of list) {
      rows.push(...(await checkOneDomain(domain)));
    }
    const probeDomains = new Set(list.map((s) => s.domain));
    for (const { domain, paths } of liveSeoProbes) {
      if (!probeDomains.has(domain)) continue;
      for (const path of paths) {
        rows.push(await checkProbePath(domain, path));
      }
    }
    const allOk = rows.every((r) => r.ok);
    if (allOk) return { ok: true, rows };
    if (attempt < retries) {
      console.warn(
        `\nLive check chưa pass (lần ${attempt}/${retries}) — chờ ${delayMs / 1000}s (CDN Vercel)…\n`
      );
      await delay(delayMs);
    }
  }

  return { ok: rows.every((r) => r.ok), rows };
}

function printGscReminder() {
  console.log(
    `\n${"─".repeat(60)}\n` +
      "Google Search Console:\n" +
      "  npm run seo:gsc\n" +
      "  → Submit sitemap (API hoặc dry-run xem URL).\n"
  );
}

/**
 * @param {{ folders?: string[], retries?: number, delayMs?: number }} [options]
 * @returns {Promise<number>}
 */
export async function runCheckLiveCli(options = {}) {
  const scope = options.folders?.length
    ? options.folders.join(", ")
    : `${sites.length} site`;

  console.log(`\n${"═".repeat(60)}\nKiểm tra SEO production — ${scope}\n`);

  const { ok, rows } = await checkLiveSeo(options);

  const col = (s, n) => String(s).padEnd(n);
  console.log(`${col("Domain", 28)} ${col("Check", 18)} ${col("OK", 4)} Detail`);
  console.log("─".repeat(70));
  for (const r of rows) {
    console.log(
      `${col(r.domain, 28)} ${col(r.check, 18)} ${col(r.ok ? "✓" : "✗", 4)} ${r.detail}`
    );
  }

  if (ok) {
    console.log(`\n✓ PASS — production khớp checklist SEO.\n`);
    printGscReminder();
    return 0;
  }

  console.error(
    `\n✗ FAIL — một hoặc nhiều URL production chưa đúng. ` +
      `Chờ vài phút rồi: npm run seo:check:live\n`
  );
  printGscReminder();
  return 1;
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const folders = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const retriesArg = process.argv.find((a) => a.startsWith("--retries="));
  const retries = retriesArg ? Number(retriesArg.split("=")[1]) : 3;
  runCheckLiveCli({
    folders: folders.length ? folders : undefined,
    retries,
  }).then((code) => process.exit(code));
}