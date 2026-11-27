#!/usr/bin/env node
/**
 * Ping IndexNow after deploy (optional — needs INDEXNOW_KEY on each host).
 *
 *   npm run seo:indexnow -- --dry-run
 *   npm run seo:indexnow
 *
 * Env: INDEXNOW_KEY — verification key file must exist at https://{domain}/{key}.txt
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { sites } from "../sites.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");
const API = "https://api.indexnow.org/indexnow";

/**
 * @param {string[]} argv
 */
function parseArgs(argv) {
  let dryRun = false;
  for (const a of argv) {
    if (a === "--dry-run") dryRun = true;
  }
  return { dryRun };
}

/**
 * @param {string} domain
 */
function sitemapUrls(domain) {
  const path = join(root, "sites", siteFolderForDomain(domain), "sitemap.xml");
  if (!existsSync(path)) return [];
  const xml = readFileSync(path, "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

/** @type {Map<string, string>} */
const domainToFolder = new Map(sites.map((s) => [s.domain, s.folder]));

/**
 * @param {string} domain
 */
function siteFolderForDomain(domain) {
  const f = domainToFolder.get(domain);
  if (!f) throw new Error(`Unknown domain: ${domain}`);
  return f;
}

/**
 * @param {string} key
 * @param {string} host
 * @param {string[]} urlList
 * @param {boolean} dryRun
 */
async function submitHost(key, host, urlList, dryRun) {
  if (!urlList.length) {
    console.warn(`[${host}] sitemap trống — bỏ qua`);
    return;
  }
  const body = {
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: urlList.slice(0, 10_000),
  };
  if (dryRun) {
    console.log(`[${host}] dry-run — ${urlList.length} URL (key ${key})`);
    return;
  }
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  if (res.ok || res.status === 202) {
    console.log(`[${host}] IndexNow OK (${res.status}) — ${urlList.length} URL`);
    return;
  }
  const text = await res.text();
  console.error(`[${host}] IndexNow FAIL HTTP ${res.status}: ${text.slice(0, 200)}`);
}

async function main() {
  const { dryRun } = parseArgs(process.argv.slice(2));
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) {
    console.log(
      "Bỏ qua IndexNow — chưa đặt INDEXNOW_KEY (cần file xác minh trên từng domain)."
    );
    process.exit(0);
  }

  let failed = false;
  for (const { domain } of sites) {
    try {
      await submitHost(key, domain, sitemapUrls(domain), dryRun);
    } catch (err) {
      failed = true;
      console.error(`[${domain}]`, err instanceof Error ? err.message : err);
    }
  }
  process.exit(failed ? 1 : 0);
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main();
}