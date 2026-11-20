#!/usr/bin/env node
/**
 * Build vercel.json redirects: old crowna-website paths + ?lang=en|vi → path locales.
 * Run: node scripts/seo/legacy-redirects.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeTextIfChanged } from "../fs-write-if-changed.mjs";
import { sites } from "../sites.mjs";
import { localePath, primaryLangByFolder } from "./locale-path.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");

/**
 * @typedef {{ source: string, destination: string, permanent?: boolean, has?: object[] }} VercelRedirect
 */

/**
 * Old crowna-website paths on the main site, including locale prefixes
 * so ?lang= and /vi/... do not chain through an intermediate 404.
 *
 * @type {VercelRedirect[]}
 */
export const wwwLegacyRedirects = [
  { source: "/tuyen-dung", destination: "/career", permanent: true },
  { source: "/en/tuyen-dung", destination: "/career", permanent: true },
  { source: "/vi/tuyen-dung", destination: "/vi/career", permanent: true },

  { source: "/news", destination: "/insights", permanent: true },
  { source: "/en/news", destination: "/insights", permanent: true },
  { source: "/vi/news", destination: "/vi/insights", permanent: true },

  { source: "/contact", destination: "/#contact", permanent: true },
  { source: "/en/contact", destination: "/#contact", permanent: true },
  { source: "/vi/contact", destination: "/vi#contact", permanent: true },

  { source: "/services", destination: "/#services", permanent: true },
  { source: "/en/services", destination: "/#services", permanent: true },
  { source: "/vi/services", destination: "/vi#services", permanent: true },

  // Service lines → current subdomain (English default, no chains).
  { source: "/services/accounting", destination: "https://acc.crown.com.vn/", permanent: true },
  { source: "/en/services/accounting", destination: "https://acc.crown.com.vn/", permanent: true },
  { source: "/vi/services/accounting", destination: "https://acc.crown.com.vn/vi", permanent: true },

  { source: "/services/audit-assurance", destination: "https://audit.crown.com.vn/", permanent: true },
  { source: "/en/services/audit-assurance", destination: "https://audit.crown.com.vn/", permanent: true },
  { source: "/vi/services/audit-assurance", destination: "https://audit.crown.com.vn/vi", permanent: true },

  { source: "/services/internal-audit", destination: "https://audit.crown.com.vn/", permanent: true },
  { source: "/en/services/internal-audit", destination: "https://audit.crown.com.vn/", permanent: true },
  { source: "/vi/services/internal-audit", destination: "https://audit.crown.com.vn/vi", permanent: true },

  { source: "/services/financial-advisory", destination: "https://fas.crown.com.vn/", permanent: true },
  { source: "/en/services/financial-advisory", destination: "https://fas.crown.com.vn/", permanent: true },
  { source: "/vi/services/financial-advisory", destination: "https://fas.crown.com.vn/vi", permanent: true },

  { source: "/services/tax-advisory", destination: "https://tax.crown.com.vn/", permanent: true },
  { source: "/en/services/tax-advisory", destination: "https://tax.crown.com.vn/", permanent: true },
  { source: "/vi/services/tax-advisory", destination: "https://tax.crown.com.vn/vi", permanent: true },

  { source: "/services/risk-compliance", destination: "https://esg.crown.com.vn/", permanent: true },
  { source: "/en/services/risk-compliance", destination: "https://esg.crown.com.vn/", permanent: true },
  { source: "/vi/services/risk-compliance", destination: "https://esg.crown.com.vn/vi", permanent: true },
];


/**
 * Explicit one-hop maps for legacy paths that also have ?lang=.
 * Destination already includes the target locale.
 *
 * @type {Array<{ source: string, lang: "en" | "vi", destination: string }>}
 */
export const wwwLegacyLangHints = [
  { source: "/tuyen-dung", lang: "en", destination: "/career" },
  { source: "/tuyen-dung", lang: "vi", destination: "/vi/career" },
  { source: "/en/tuyen-dung", lang: "en", destination: "/career" },
  { source: "/en/tuyen-dung", lang: "vi", destination: "/vi/career" },
  { source: "/vi/tuyen-dung", lang: "en", destination: "/career" },
  { source: "/vi/tuyen-dung", lang: "vi", destination: "/vi/career" },

  { source: "/news", lang: "en", destination: "/insights" },
  { source: "/news", lang: "vi", destination: "/vi/insights" },
  { source: "/en/news", lang: "en", destination: "/insights" },
  { source: "/en/news", lang: "vi", destination: "/vi/insights" },
  { source: "/vi/news", lang: "en", destination: "/insights" },
  { source: "/vi/news", lang: "vi", destination: "/vi/insights" },

  { source: "/contact", lang: "en", destination: "/#contact" },
  { source: "/contact", lang: "vi", destination: "/vi#contact" },
  { source: "/en/contact", lang: "en", destination: "/#contact" },
  { source: "/en/contact", lang: "vi", destination: "/vi#contact" },
  { source: "/vi/contact", lang: "en", destination: "/#contact" },
  { source: "/vi/contact", lang: "vi", destination: "/vi#contact" },

  { source: "/services", lang: "en", destination: "/#services" },
  { source: "/services", lang: "vi", destination: "/vi#services" },
  { source: "/en/services", lang: "en", destination: "/#services" },
  { source: "/en/services", lang: "vi", destination: "/vi#services" },
  { source: "/vi/services", lang: "en", destination: "/#services" },
  { source: "/vi/services", lang: "vi", destination: "/vi#services" },

  { source: "/services/accounting", lang: "en", destination: "https://acc.crown.com.vn/" },
  { source: "/services/accounting", lang: "vi", destination: "https://acc.crown.com.vn/vi" },
  { source: "/en/services/accounting", lang: "en", destination: "https://acc.crown.com.vn/" },
  { source: "/en/services/accounting", lang: "vi", destination: "https://acc.crown.com.vn/vi" },
  { source: "/vi/services/accounting", lang: "en", destination: "https://acc.crown.com.vn/" },
  { source: "/vi/services/accounting", lang: "vi", destination: "https://acc.crown.com.vn/vi" },

  { source: "/services/audit-assurance", lang: "en", destination: "https://audit.crown.com.vn/" },
  { source: "/services/audit-assurance", lang: "vi", destination: "https://audit.crown.com.vn/vi" },
  { source: "/en/services/audit-assurance", lang: "en", destination: "https://audit.crown.com.vn/" },
  { source: "/en/services/audit-assurance", lang: "vi", destination: "https://audit.crown.com.vn/vi" },
  { source: "/vi/services/audit-assurance", lang: "en", destination: "https://audit.crown.com.vn/" },
  { source: "/vi/services/audit-assurance", lang: "vi", destination: "https://audit.crown.com.vn/vi" },

  { source: "/services/internal-audit", lang: "en", destination: "https://audit.crown.com.vn/" },
  { source: "/services/internal-audit", lang: "vi", destination: "https://audit.crown.com.vn/vi" },
  { source: "/en/services/internal-audit", lang: "en", destination: "https://audit.crown.com.vn/" },
  { source: "/en/services/internal-audit", lang: "vi", destination: "https://audit.crown.com.vn/vi" },
  { source: "/vi/services/internal-audit", lang: "en", destination: "https://audit.crown.com.vn/" },
  { source: "/vi/services/internal-audit", lang: "vi", destination: "https://audit.crown.com.vn/vi" },

  { source: "/services/financial-advisory", lang: "en", destination: "https://fas.crown.com.vn/" },
  { source: "/services/financial-advisory", lang: "vi", destination: "https://fas.crown.com.vn/vi" },
  { source: "/en/services/financial-advisory", lang: "en", destination: "https://fas.crown.com.vn/" },
  { source: "/en/services/financial-advisory", lang: "vi", destination: "https://fas.crown.com.vn/vi" },
  { source: "/vi/services/financial-advisory", lang: "en", destination: "https://fas.crown.com.vn/" },
  { source: "/vi/services/financial-advisory", lang: "vi", destination: "https://fas.crown.com.vn/vi" },

  { source: "/services/tax-advisory", lang: "en", destination: "https://tax.crown.com.vn/" },
  { source: "/services/tax-advisory", lang: "vi", destination: "https://tax.crown.com.vn/vi" },
  { source: "/en/services/tax-advisory", lang: "en", destination: "https://tax.crown.com.vn/" },
  { source: "/en/services/tax-advisory", lang: "vi", destination: "https://tax.crown.com.vn/vi" },
  { source: "/vi/services/tax-advisory", lang: "en", destination: "https://tax.crown.com.vn/" },
  { source: "/vi/services/tax-advisory", lang: "vi", destination: "https://tax.crown.com.vn/vi" },

  { source: "/services/risk-compliance", lang: "en", destination: "https://esg.crown.com.vn/" },
  { source: "/services/risk-compliance", lang: "vi", destination: "https://esg.crown.com.vn/vi" },
  { source: "/en/services/risk-compliance", lang: "en", destination: "https://esg.crown.com.vn/" },
  { source: "/en/services/risk-compliance", lang: "vi", destination: "https://esg.crown.com.vn/vi" },
  { source: "/vi/services/risk-compliance", lang: "en", destination: "https://esg.crown.com.vn/" },
  { source: "/vi/services/risk-compliance", lang: "vi", destination: "https://esg.crown.com.vn/vi" },
];


/**
 * @param {"en" | "vi"} lang
 * @returns {VercelRedirect["has"]}
 */
function langQuery(lang) {
  return [{ type: "query", key: "lang", value: lang }];
}


/**
 * Leftover /en and /en/:path* after English became the unprefixed default.
 * Lang query variants come first so /en/about?lang=vi is one hop to /vi/about.
 *
 * @returns {VercelRedirect[]}
 */
export function retiredEnPrefixRedirects() {
  /** @type {VercelRedirect[]} */
  return [
    {
      source: "/en",
      has: langQuery("en"),
      destination: "/",
      permanent: true,
    },
    {
      source: "/en/:path*",
      has: langQuery("en"),
      destination: "/:path*",
      permanent: true,
    },
    {
      source: "/en",
      has: langQuery("vi"),
      destination: "/vi",
      permanent: true,
    },
    {
      source: "/en/:path*",
      has: langQuery("vi"),
      destination: "/vi/:path*",
      permanent: true,
    },
    { source: "/en", destination: "/", permanent: true },
    { source: "/en/:path*", destination: "/:path*", permanent: true },
  ];
}

/**
 * Generic ?lang=en|vi → path-based locale, more specific /en or /vi first
 * to avoid /en/about?lang=en → /en/en/about.
 *
 * @param {"vi" | "en"} primaryLang
 * @returns {VercelRedirect[]}
 */
export function langQueryRedirects(primaryLang) {
  const alt = primaryLang === "vi" ? "en" : "vi";
  /** @type {VercelRedirect[]} */
  const rules = [];

  // Already on the alternate prefix.
  rules.push(
    {
      source: `/${alt}`,
      has: langQuery(alt),
      destination: `/${alt}`,
      permanent: true,
    },
    {
      source: `/${alt}/:path*`,
      has: langQuery(alt),
      destination: `/${alt}/:path*`,
      permanent: true,
    },
    {
      source: `/${alt}`,
      has: langQuery(primaryLang),
      destination: "/",
      permanent: true,
    },
    {
      source: `/${alt}/:path*`,
      has: langQuery(primaryLang),
      destination: "/:path*",
      permanent: true,
    },
  );

  // Default-locale (unprefixed) paths.
  rules.push(
    {
      source: "/",
      has: langQuery(alt),
      destination: `/${alt}`,
      permanent: true,
    },
    {
      source: "/:path*",
      has: langQuery(alt),
      destination: `/${alt}/:path*`,
      permanent: true,
    },
    {
      source: "/",
      has: langQuery(primaryLang),
      destination: "/",
      permanent: true,
    },
    {
      source: "/:path*",
      has: langQuery(primaryLang),
      destination: "/:path*",
      permanent: true,
    },
  );

  return rules;
}

/**
 * @param {string} folder
 * @returns {VercelRedirect[]}
 */
export function redirectsForFolder(folder) {
  const primary = primaryLangByFolder[folder];
  if (!primary) throw new Error(`Unknown folder: ${folder}`);

  /** @type {VercelRedirect[]} */
  const rules = [];

  if (folder === "www") {
    for (const hint of wwwLegacyLangHints) {
      rules.push({
        source: hint.source,
        has: langQuery(hint.lang),
        destination: hint.destination,
        permanent: true,
      });
    }
    rules.push(...wwwLegacyRedirects);
  }

  rules.push(...retiredEnPrefixRedirects());
  rules.push(...langQueryRedirects(primary));
  return rules;
}

/**
 * @param {VercelRedirect} rule
 */
function ruleKey(rule) {
  const has = (rule.has ?? [])
    .map((h) => `${h.type}:${h.key}=${h.value}`)
    .join(",");
  return `${rule.source}::${has}`;
}

/**
 * @param {string} folder
 */
export function writeSiteVercelJson(folder) {
  const siteDir = join(root, "sites", folder);
  const file = join(siteDir, "vercel.json");
  const existing = existsSync(file)
    ? JSON.parse(readFileSync(file, "utf8"))
    : {};

  const generated = redirectsForFolder(folder);
  const seen = new Set(generated.map(ruleKey));
  const extras = (existing.redirects ?? []).filter((r) => {
    if (seen.has(ruleKey(r))) return false;
    const src = r.source ?? "";
    // Drop leftover vi-primary "strip /vi" rules now that /vi is a real locale tree.
    if (src === "/vi" || src.startsWith("/vi/") || src.startsWith("/vi:")) return false;
    return true;
  });

  const next = {
    cleanUrls: existing.cleanUrls ?? true,
    trailingSlash: existing.trailingSlash ?? false,
    ignoreCommand:
      existing.ignoreCommand ?? "bash ../../scripts/should-build.sh",
    redirects: [...generated, ...extras],
  };

  writeTextIfChanged(file, `${JSON.stringify(next, null, 2)}\n`);
}

/**
 * Resolve a request against the generated rules (for the local preview server).
 * First match wins. Query values other than lang are preserved by the server.
 *
 * @param {VercelRedirect[]} rules
 * @param {string} pathname
 * @param {URLSearchParams} search
 * @returns {{ destination: string, status: number } | null}
 */
export function matchRedirect(rules, pathname, search) {
  const path = pathname === "" ? "/" : pathname;
  for (const rule of rules) {
    if (rule.has) {
      const ok = rule.has.every((cond) => {
        if (cond.type !== "query") return false;
        return search.get(cond.key) === cond.value;
      });
      if (!ok) continue;
    } else if (search.has("lang") && (search.get("lang") === "en" || search.get("lang") === "vi")) {
      // A path-only rule must not steal a request that a later ?lang= rule
      // would send somewhere else in one hop. Skip unless this source is an
      // exact legacy path handled above (those are listed first with `has`).
      // Path-only rules still apply when lang is absent or is an other locale.
    }

    const params = matchSource(rule.source, path);
    if (!params) continue;
    return {
      destination: applyParams(rule.destination, params),
      status: rule.permanent === false ? 307 : 308,
    };
  }
  return null;
}

/**
 * @param {string} source
 * @param {string} pathname
 * @returns {Record<string, string> | null}
 */
export function matchSource(source, pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const src = source.replace(/\/+$/, "") || "/";
  if (src === path) return {};
  if (src.endsWith("/:path*")) {
    const prefix = src.slice(0, -"/:path*".length) || "";
    if (path === prefix) return { path: "" };
    if (path.startsWith(`${prefix}/`)) {
      return { path: path.slice(prefix.length + 1) };
    }
    return null;
  }
  if (src.includes("/:")) {
    const srcParts = src.split("/").filter(Boolean);
    const pathParts = path.split("/").filter(Boolean);
    if (srcParts.length !== pathParts.length) return null;
    /** @type {Record<string, string>} */
    const params = {};
    for (let i = 0; i < srcParts.length; i++) {
      if (srcParts[i].startsWith(":")) {
        params[srcParts[i].slice(1)] = pathParts[i];
      } else if (srcParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  }
  return null;
}

/**
 * @param {string} destination
 * @param {Record<string, string>} params
 */
function applyParams(destination, params) {
  let out = destination;
  if ("path" in params) {
    out = out.replace(":path*", params.path);
    out = out.replace(/\/+$/, "") || "/";
  }
  for (const [key, value] of Object.entries(params)) {
    if (key === "path") continue;
    out = out.replaceAll(`:${key}`, value);
  }
  return out;
}

/**
 * Like matchRedirect, but path-only rules still apply when ?lang= is present
 * if no earlier `has` rule matched. Used after the full rule list (legacy lang
 * hints first, then path-only legacy, then generic lang query).
 *
 * @param {VercelRedirect[]} rules
 * @param {string} pathname
 * @param {URLSearchParams} search
 */
export function resolveRedirect(rules, pathname, search) {
  return matchRedirect(rules, pathname, search);
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const arg = process.argv[2] ?? "all";
  const targets = arg === "all" ? sites.map((s) => s.folder) : [arg];
  for (const folder of targets) {
    writeSiteVercelJson(folder);
    console.log(`[${folder}] wrote vercel.json redirects`);
  }
}
