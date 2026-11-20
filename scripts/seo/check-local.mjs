#!/usr/bin/env node
/**
 * Kiểm tra SEO trong thư mục sites/ (trước commit / sau prepare:deploy).
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { siteByFolder, sites } from "../sites.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");

const REQUIRED_IN_HTML = [
  "crown-seo:start",
  "crown-seo:end",
  'rel="canonical"',
  'hreflang="x-default"',
  'property="og:image"',
  "application/ld+json",
  'name="twitter:card"',
];

/**
 * @typedef {{ file: string, detail: string }} SeoIssue
 */

/**
 * @param {string} [target] site folder or "all"
 * @returns {{ ok: boolean, htmlCount: number, issues: SeoIssue[] }}
 */
export function checkLocalSeo(target = "all") {
  /** @type {SeoIssue[]} */
  const issues = [];
  let htmlCount = 0;

  const targets =
    target === "all" ? sites : [siteByFolder.get(target)].filter(Boolean);

  if (target !== "all" && !siteByFolder.has(target)) {
    return {
      ok: false,
      htmlCount: 0,
      issues: [{ file: target, detail: "site folder không hợp lệ" }],
    };
  }

  /**
   * @param {string} dir
   * @param {string} relPrefix
   */
  function walkHtml(dir, relPrefix) {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      const rel = relPrefix ? `${relPrefix}/${name}` : name;
      if (statSync(p).isDirectory()) walkHtml(p, rel);
      else if (name.endsWith(".html")) {
        htmlCount++;
        const text = readFileSync(p, "utf8");
        for (const token of REQUIRED_IN_HTML) {
          if (!text.includes(token)) {
            issues.push({ file: rel, detail: `thiếu: ${token}` });
          }
        }
        const m = text.match(/<link rel="canonical" href="([^"]+)"/);
        if (m?.[1]?.includes("localhost")) {
          issues.push({ file: rel, detail: `canonical localhost: ${m[1]}` });
        }
        const cans = text.match(/rel="canonical"/g);
        if (cans && cans.length > 1) {
          issues.push({
            file: rel,
            detail: `canonical trùng (${cans.length})`,
          });
        }
        const domainMatch = rel.match(/^sites[/\\]([^/\\]+)[/\\]/);
        const folderName = domainMatch?.[1];
        const site = folderName && targets.find((t) => t.folder === folderName);
        if (site && m?.[1]) {
          const parts = rel.split(/[\\/]/);
          const after = parts.slice(2, -1);
          const htmlDir = after.filter((s) => s !== "");
          const urlPath = htmlDir.length === 0 ? "/" : `/${htmlDir.join("/")}`;
          const expected =
            urlPath === "/" ? `https://${site.domain}/` : `https://${site.domain}${urlPath}`;
          if (m[1] !== expected) {
            issues.push({
              file: rel,
              detail: `self-canonical sai: ${m[1]} (kỳ vọng ${expected})`,
            });
          }
          const ogUrl = text.match(/property="og:url" content="([^"]+)"/);
          if (ogUrl && ogUrl[1] !== m[1]) {
            issues.push({ file: rel, detail: `og:url ${ogUrl[1]} != canonical` });
          }
          const altPrefix =
            urlPath === "/en" || urlPath.startsWith("/en/") ? "en"
            : urlPath === "/vi" || urlPath.startsWith("/vi/") ? "vi"
            : null;
          const htmlLang = text.match(/<html\b[^>]*\slang="([^"]+)"/);
          const expectLang =
            altPrefix ??
            (folderName === "www" || folderName === "cons" || folderName === "fas" || folderName === "up"
              ? "vi"
              : "en");
          if (htmlLang && htmlLang[1] !== expectLang) {
            issues.push({
              file: rel,
              detail: `html lang=${htmlLang[1]} (kỳ vọng ${expectLang})`,
            });
          }
        }
      }
    }
  }

  for (const { folder, domain } of targets) {
    const siteDir = join(root, "sites", folder);
    if (!existsSync(siteDir)) continue;
    walkHtml(siteDir, `sites/${folder}`);

    const sm = join(siteDir, "sitemap.xml");
    const rb = join(siteDir, "robots.txt");
    if (!existsSync(sm)) {
      issues.push({ file: folder, detail: "thiếu sitemap.xml" });
    } else {
      const xml = readFileSync(sm, "utf8");
      const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]);
      if (locs.some((u) => !u.startsWith(`https://${domain}`))) {
        issues.push({ file: `${folder}/sitemap.xml`, detail: "loc sai domain" });
      }
      if (xml.includes("localhost")) {
        issues.push({ file: `${folder}/sitemap.xml`, detail: "localhost trong sitemap" });
      }
      if (!xml.includes("xmlns:xhtml") || !xml.includes("xhtml:link")) {
        issues.push({ file: `${folder}/sitemap.xml`, detail: "thiếu xhtml:link hreflang" });
      }
      if (!xml.includes("<lastmod>")) {
        issues.push({ file: `${folder}/sitemap.xml`, detail: "thiếu lastmod" });
      }
    }
    if (!existsSync(rb)) {
      issues.push({ file: folder, detail: "thiếu robots.txt" });
    } else {
      const rt = readFileSync(rb, "utf8");
      if (!rt.includes(`https://${domain}/sitemap.xml`)) {
        issues.push({ file: `${folder}/robots.txt`, detail: "thiếu dòng Sitemap" });
      }
    }
    const og = join(siteDir, "assets", "crown-og-share.jpg");
    if (!existsSync(og)) {
      issues.push({ file: folder, detail: "thiếu assets/crown-og-share.jpg" });
    }
  }

  return { ok: issues.length === 0, htmlCount, issues };
}

/**
 * @param {string} [target]
 * @returns {number} exit code
 */
export function runCheckLocalCli(target = "all") {
  const { ok, htmlCount, issues } = checkLocalSeo(target);

  console.log(`Kiểm tra SEO local — ${target === "all" ? `${sites.length} site` : target}`);
  console.log(`HTML: ${htmlCount}`);

  if (ok) {
    console.log("\n✓ PASS — SEO local ổn.\n");
    return 0;
  }

  console.error(`\n✗ FAIL — ${issues.length} vấn đề:\n`);
  for (const i of issues.slice(0, 40)) {
    console.error(`  • ${i.file}: ${i.detail}`);
  }
  if (issues.length > 40) {
    console.error(`  … +${issues.length - 40} nữa`);
  }
  console.error("");
  return 1;
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const target = process.argv[2] ?? "all";
  process.exit(runCheckLocalCli(target));
}