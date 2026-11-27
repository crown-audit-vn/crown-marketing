/**
 * One-hop locale and legacy URL resolution used by Edge Middleware
 * and unit tests. Destinations never keep a `lang` query parameter.
 */
import {
  localeFromPath,
  localePath,
  logicalPath,
  normalizePath,
  redirectLangQuery,
  redirectRetiredEnPrefix,
} from "./locale-path.mjs";

/** @typedef {{ en: string, vi: string }} LocaleDest */

/**
 * Legacy crowna-website paths on the main site. Values may be a path,
 * a path with a hash, or an absolute URL on a service subdomain.
 *
 * @type {Record<string, LocaleDest>}
 */
export const wwwLegacyByLogicalPath = {
  "/tuyen-dung": { en: "/career", vi: "/vi/career" },
  "/news": { en: "/insights", vi: "/vi/insights" },
  "/contact": { en: "/#contact", vi: "/vi#contact" },
  "/services": { en: "/#services", vi: "/vi#services" },
  "/services/accounting": {
    en: "https://acc.crown.com.vn/",
    vi: "https://acc.crown.com.vn/vi",
  },
  "/services/audit-assurance": {
    en: "https://audit.crown.com.vn/",
    vi: "https://audit.crown.com.vn/vi",
  },
  "/services/internal-audit": {
    en: "https://audit.crown.com.vn/",
    vi: "https://audit.crown.com.vn/vi",
  },
  "/services/financial-advisory": {
    en: "https://fas.crown.com.vn/",
    vi: "https://fas.crown.com.vn/vi",
  },
  "/services/tax-advisory": {
    en: "https://tax.crown.com.vn/",
    vi: "https://tax.crown.com.vn/vi",
  },
  "/services/risk-compliance": {
    en: "https://esg.crown.com.vn/",
    vi: "https://esg.crown.com.vn/vi",
  },
};

/**
 * @param {string} hostname
 */
export function canonicalHost(hostname) {
  const host = String(hostname || "")
    .replace(/:\d+$/, "")
    .toLowerCase();
  if (host === "www.crown.com.vn") return "crown.com.vn";
  return host;
}

/**
 * @param {string} hostname
 */
export function isWwwSiteHost(hostname) {
  const host = String(hostname || "")
    .replace(/:\d+$/, "")
    .toLowerCase();
  return host === "crown.com.vn" || host === "www.crown.com.vn";
}

/**
 * @param {string} mapped
 * @returns {{ path: string, hash: string, absolute: string | null }}
 */
function splitMapped(mapped) {
  if (mapped.startsWith("http://") || mapped.startsWith("https://")) {
    return { path: "/", hash: "", absolute: mapped };
  }
  const hashIdx = mapped.indexOf("#");
  if (hashIdx !== -1) {
    const base = mapped.slice(0, hashIdx);
    return {
      path: normalizePath(base) || "/",
      hash: mapped.slice(hashIdx),
      absolute: null,
    };
  }
  return { path: normalizePath(mapped), hash: "", absolute: null };
}

/**
 * Resolve a request to a single 308 (or null if the URL is already canonical).
 * The `lang` query is always stripped when present and equal to en|vi.
 *
 * @param {{ hostname?: string, pathname: string, search?: string }} req
 * @returns {{ location: string, status: 308 } | null}
 */
export function resolveLocaleRedirect(req) {
  const hostname = req.hostname || "crown.com.vn";
  const incomingHost = String(hostname)
    .replace(/:\d+$/, "")
    .toLowerCase();
  const destHost = canonicalHost(incomingHost);
  const search = req.search || "";
  const input = new URL(
    `https://${incomingHost}${normalizePath(req.pathname) || "/"}${
      search.startsWith("?") || search === "" ? search : `?${search}`
    }`
  );

  const langParam = input.searchParams.get("lang");
  const hasLang = langParam === "en" || langParam === "vi";
  const path = normalizePath(input.pathname);
  const logical = logicalPath(path);
  const pathLocale = localeFromPath(path) === "vi" ? "vi" : "en";
  const targetLang = hasLang ? langParam : pathLocale;

  let destPath = path;
  let destHash = "";
  /** @type {string | null} */
  let absolute = null;
  let changed = false;

  if (isWwwSiteHost(incomingHost) && wwwLegacyByLogicalPath[logical]) {
    const mapped = wwwLegacyByLogicalPath[logical][targetLang];
    const parts = splitMapped(mapped);
    if (parts.absolute) {
      absolute = parts.absolute;
    } else {
      destPath = parts.path;
      destHash = parts.hash;
    }
    changed = true;
  } else if (hasLang) {
    destPath = redirectLangQuery(path, langParam) ?? path;
    changed = true;
  } else {
    const retired = redirectRetiredEnPrefix(path);
    if (retired !== null) {
      destPath = retired;
      changed = true;
    }
  }

  if (destHost !== incomingHost) changed = true;

  input.searchParams.delete("lang");
  const qs = input.searchParams.toString();

  if (!changed) return null;

  if (absolute) {
    const abs = new URL(absolute);
    // Preserve non-lang query params on cross-host jumps.
    for (const [key, value] of input.searchParams.entries()) {
      if (!abs.searchParams.has(key)) abs.searchParams.append(key, value);
    }
    return { location: abs.toString(), status: 308 };
  }

  const pathPart = destPath === "/" ? "/" : destPath;
  const queryPart = qs ? `?${qs}` : "";
  const sameHost = destHost === incomingHost;
  const location = sameHost
    ? `${pathPart}${queryPart}${destHash}`
    : `https://${destHost}${pathPart}${queryPart}${destHash}`;

  return { location, status: 308 };
}

export { localePath, logicalPath, normalizePath };
