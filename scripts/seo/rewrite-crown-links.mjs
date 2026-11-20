/**
 * Rewrite in-page hrefs so they match the page locale after English became
 * the unprefixed default. Preserves origin for cross-subdomain Crown links.
 */
import {
  localePath,
  primaryLangByHost,
} from "./locale-path.mjs";

const ASSET_EXT =
  /\.(css|js|mjs|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|eot|pdf|xml|txt|map|json)$/i;

/**
 * @param {string} host
 * @param {string} pageHost
 */
function isSameCrownSite(host, pageHost) {
  if (host === pageHost) return true;
  if (
    (host === "www.crown.com.vn" && pageHost === "crown.com.vn") ||
    (host === "crown.com.vn" && pageHost === "www.crown.com.vn")
  ) {
    return true;
  }
  return false;
}

/**
 * @param {string} href
 * @param {"vi" | "en"} pageLocale
 * @param {string} pageHost
 */
export function rewriteOneHref(href, pageLocale, pageHost) {
  const raw = href.trim();
  if (!raw) return href;
  const lower = raw.toLowerCase();
  if (
    lower.startsWith("mailto:") ||
    lower.startsWith("tel:") ||
    lower.startsWith("javascript:") ||
    lower.startsWith("data:")
  ) {
    return href;
  }
  if (raw.startsWith("#")) return href;

  let url;
  try {
    url = new URL(raw, `https://${pageHost}/`);
  } catch {
    return href;
  }

  const host = url.hostname;
  if (!primaryLangByHost[host]) return href;

  const path = url.pathname || "/";
  if (path.startsWith("/assets/") || ASSET_EXT.test(path)) return href;

  url.searchParams.delete("lang");
  url.pathname = localePath(path, pageLocale);

  const pathPart = `${url.pathname}${url.search}${url.hash}`;
  const wasAbsolute =
    /^(https?:)?\/\//i.test(raw) || raw.toLowerCase().startsWith("https:");

  if (isSameCrownSite(host, pageHost) && !wasAbsolute) {
    return pathPart;
  }

  const origin = `${url.protocol}//${host}`;
  if (url.pathname === "/" && !url.search && !url.hash) {
    return wasAbsolute ? `${origin}/` : "/";
  }
  return `${origin}${pathPart}`;
}

/**
 * Rewrite href attributes outside script/style/noscript blocks.
 *
 * @param {string} html
 * @param {"vi" | "en"} pageLocale
 * @param {string} pageHost
 */
export function rewriteCrownHrefs(html, pageLocale, pageHost) {
  const parts = html.split(/(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<noscript\b[^>]*>[\s\S]*?<\/noscript>)/i);
  return parts
    .map((part) => {
      if (/^<(script|style|noscript)\b/i.test(part)) return part;
      return part.replace(/\s(href)=(")([^"]*)(")/gi, (m, attr, q1, href, q2) => {
        const next = rewriteOneHref(href, pageLocale, pageHost);
        return ` ${attr}=${q1}${next}${q2}`;
      });
    })
    .join("");
}
