/**
 * Path-based locale helpers shared by SEO, redirects, and switcher patches.
 */

/** @type {Record<string, "vi" | "en">} */
export const primaryLangByFolder = {
  www: "vi",
  cons: "vi",
  fas: "vi",
  up: "vi",
  acc: "en",
  audit: "en",
  tax: "en",
  esg: "en",
};

/** @type {Record<string, "vi" | "en">} */
export const primaryLangByHost = {
  "crown.com.vn": "vi",
  "www.crown.com.vn": "vi",
  "cons.crown.com.vn": "vi",
  "fas.crown.com.vn": "vi",
  "up.crown.com.vn": "vi",
  "acc.crown.com.vn": "en",
  "audit.crown.com.vn": "en",
  "tax.crown.com.vn": "en",
  "esg.crown.com.vn": "en",
};

/**
 * @param {string} pathname
 */
export function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/**
 * @param {string} pathname
 * @param {"vi" | "en"} primaryLang
 */
export function logicalPath(pathname, primaryLang) {
  const alt = primaryLang === "vi" ? "en" : "vi";
  const p = normalizePath(pathname);
  if (p === `/${alt}`) return "/";
  if (p.startsWith(`/${alt}/`)) return p.slice(alt.length + 1);
  return p;
}

/**
 * @param {string} pathname
 * @returns {"vi" | "en" | null}
 */
export function localeFromPath(pathname) {
  const p = normalizePath(pathname);
  if (p === "/en" || p.startsWith("/en/")) return "en";
  if (p === "/vi" || p.startsWith("/vi/")) return "vi";
  return null;
}

/**
 * @param {string} pathname
 * @param {"vi" | "en"} targetLang
 * @param {"vi" | "en"} primaryLang
 */
export function localePath(pathname, targetLang, primaryLang) {
  const logical = logicalPath(pathname, primaryLang);
  if (targetLang === primaryLang) return logical;
  return logical === "/" ? `/${targetLang}` : `/${targetLang}${logical}`;
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
 * Returns null when no redirect is needed (already the right path, or unknown lang).
 *
 * @param {string} pathname
 * @param {string | null | undefined} langParam
 * @param {"vi" | "en"} primaryLang
 * @returns {string | null}
 */
export function redirectLangQuery(pathname, langParam, primaryLang) {
  if (langParam !== "en" && langParam !== "vi") return null;
  const dest = localePath(pathname, langParam, primaryLang);
  const current = normalizePath(pathname);
  if (normalizePath(dest) === current) {
    // Still redirect so the query string is dropped.
    return dest;
  }
  return dest;
}
