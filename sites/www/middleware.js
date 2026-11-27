/**
 * Edge Middleware: one 308 to the canonical path, with the lang query stripped.
 * Keep this file in sync with scripts/seo/locale-redirect.mjs (write-middleware.mjs).
 */

const WWW_LEGACY = {
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

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

function logicalPath(pathname) {
  const p = normalizePath(pathname);
  for (const prefix of ["en", "vi"]) {
    if (p === `/${prefix}`) return "/";
    if (p.startsWith(`/${prefix}/`)) return p.slice(prefix.length + 1);
  }
  return p;
}

function localeFromPath(pathname) {
  const p = normalizePath(pathname);
  if (p === "/vi" || p.startsWith("/vi/")) return "vi";
  return "en";
}

function localePath(pathname, targetLang) {
  const logical = logicalPath(pathname);
  if (targetLang === "en") return logical;
  return logical === "/" ? "/vi" : `/vi${logical}`;
}

function isWwwSiteHost(host) {
  return host === "crown.com.vn" || host === "www.crown.com.vn";
}

/**
 * @param {URL} url
 * @returns {URL | null}
 */
function resolveRedirect(url) {
  const incomingHost = url.hostname.toLowerCase();
  const destHost =
    incomingHost === "www.crown.com.vn" ? "crown.com.vn" : incomingHost;

  const langParam = url.searchParams.get("lang");
  const hasLang = langParam === "en" || langParam === "vi";
  const path = normalizePath(url.pathname);
  const logical = logicalPath(path);
  const pathLocale = localeFromPath(path);
  const targetLang = hasLang ? langParam : pathLocale;

  let destPath = path;
  let destHash = "";
  /** @type {string | null} */
  let absolute = null;
  let changed = false;

  if (isWwwSiteHost(incomingHost) && WWW_LEGACY[logical]) {
    const mapped = WWW_LEGACY[logical][targetLang];
    if (mapped.startsWith("http://") || mapped.startsWith("https://")) {
      absolute = mapped;
    } else {
      const hashIdx = mapped.indexOf("#");
      if (hashIdx !== -1) {
        destPath = normalizePath(mapped.slice(0, hashIdx)) || "/";
        destHash = mapped.slice(hashIdx);
      } else {
        destPath = normalizePath(mapped);
      }
    }
    changed = true;
  } else if (hasLang) {
    destPath = localePath(path, langParam);
    changed = true;
  } else if (path === "/en" || path.startsWith("/en/")) {
    destPath = logicalPath(path);
    changed = true;
  }

  if (destHost !== incomingHost) changed = true;
  if (!changed) return null;

  url.searchParams.delete("lang");

  if (absolute) {
    const abs = new URL(absolute);
    for (const [key, value] of url.searchParams.entries()) {
      if (!abs.searchParams.has(key)) abs.searchParams.append(key, value);
    }
    return abs;
  }

  const next = new URL(url.toString());
  next.hostname = destHost;
  next.pathname = destPath === "/" ? "/" : destPath;
  next.hash = destHash;
  return next;
}

export const config = {
  matcher: ["/", "/((?!assets/|_vercel/|.*\\..*).*)"],
};

export default function middleware(request) {
  const dest = resolveRedirect(new URL(request.url));
  if (!dest) return;
  return Response.redirect(dest, 308);
}
