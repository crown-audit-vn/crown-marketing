/**
 * Path-based locale helpers shared by SEO, redirects, and switcher patches.
 *
 * English is the default (unprefixed) language on every Crown site.
 * Vietnamese lives under /vi. A leftover /en prefix is treated as English
 * and should 308 to the unprefixed equivalent.
 */

/** @type {Record<string, "vi" | "en">} */
export const primaryLangByFolder = {
  www: "en",
  cons: "en",
  fas: "en",
  up: "en",
  acc: "en",
  audit: "en",
  tax: "en",
  esg: "en",
};

/** @type {Record<string, "vi" | "en">} */
export const primaryLangByHost = {
  "crown.com.vn": "en",
  "www.crown.com.vn": "en",
  "cons.crown.com.vn": "en",
  "fas.crown.com.vn": "en",
  "up.crown.com.vn": "en",
  "acc.crown.com.vn": "en",
  "audit.crown.com.vn": "en",
  "tax.crown.com.vn": "en",
  "esg.crown.com.vn": "en",
};

export const CROWN_HOSTS = Object.keys(primaryLangByHost);

/**
 * @param {string} pathname
 */
export function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/**
 * Strip a locale prefix (/en or /vi) to get the logical page path.
 * Both prefixes are stripped so leftover /en URLs collapse correctly
 * after English became the unprefixed default.
 *
 * @param {string} pathname
 * @param {"vi" | "en"} [_primaryLang]
 */
export function logicalPath(pathname, _primaryLang = "en") {
  const p = normalizePath(pathname);
  for (const prefix of ["en", "vi"]) {
    if (p === `/${prefix}`) return "/";
    if (p.startsWith(`/${prefix}/`)) return p.slice(prefix.length + 1);
  }
  return p;
}

/**
 * @param {string} pathname
 * @returns {"vi" | "en" | null} null means the unprefixed default (English)
 */
export function localeFromPath(pathname) {
  const p = normalizePath(pathname);
  if (p === "/en" || p.startsWith("/en/")) return "en";
  if (p === "/vi" || p.startsWith("/vi/")) return "vi";
  return null;
}

/**
 * Build the path for a target language. English is always unprefixed.
 *
 * @param {string} pathname
 * @param {"vi" | "en"} targetLang
 * @param {"vi" | "en"} [_primaryLang]
 */
export function localePath(pathname, targetLang, _primaryLang = "en") {
  const logical = logicalPath(pathname);
  if (targetLang !== "en" && targetLang !== "vi") return logical;
  if (targetLang === "en") return logical;
  return logical === "/" ? "/vi" : `/vi${logical}`;
}

/**
 * @param {string} domain
 * @param {string} path
 */
export function absoluteUrl(domain, path) {
  if (path === "/") return `https://${domain}/`;
  return `https://${domain}${path}`;
}

/**
 * Redirect a ?lang=en|vi URL to the path-based locale URL in one hop.
 * Returns null when no redirect is needed (unknown lang).
 * Always returns the destination path when lang is en|vi so the query is dropped.
 *
 * @param {string} pathname
 * @param {string | null | undefined} langParam
 * @param {"vi" | "en"} [primaryLang]
 * @returns {string | null}
 */
export function redirectLangQuery(pathname, langParam, primaryLang = "en") {
  if (langParam !== "en" && langParam !== "vi") return null;
  return localePath(pathname, langParam, primaryLang);
}

/**
 * @param {string} pathname
 * @returns {string | null} unprefixed equivalent when path starts with /en
 */
export function redirectRetiredEnPrefix(pathname) {
  const p = normalizePath(pathname);
  if (p === "/en" || p.startsWith("/en/")) return logicalPath(p);
  return null;
}
