/** Default Open Graph image (deployed under each site's /assets/). */
export const DEFAULT_OG_ASSET = "/assets/crown-og-share.jpg";

/**
 * Hero image on Crown Insights articles.
 * @param {string} html
 * @returns {string | null}
 */
export function parseArticleHeroImage(html) {
  return parseArticleHeroMeta(html)?.src ?? null;
}

/**
 * @param {string} html
 * @returns {{ src: string, width?: number, height?: number, lcp: boolean } | null}
 */
export function parseArticleHeroMeta(html) {
  const block = html.match(
    /<figure[^>]*class=["'][^"']*ins-hero-photo[^"']*["'][^>]*>[\s\S]*?<img([^>]+)>/i
  );
  if (!block) {
    const loose = html.match(
      /class=["']ins-hero-photo["'][^>]*>[\s\S]*?<img([^>]+)>/i
    );
    if (!loose) return null;
    return heroMetaFromAttrs(loose[1]);
  }
  return heroMetaFromAttrs(block[1]);
}

/**
 * @param {string} attrs
 */
function heroMetaFromAttrs(attrs) {
  const srcM = attrs.match(/\bsrc=["']([^"']+)["']/i);
  if (!srcM) return null;
  const src = decodeEntities(srcM[1]);
  let width = readIntAttr(attrs, "width");
  let height = readIntAttr(attrs, "height");
  if (!width || !height) {
    const dims = dimensionsFromSrc(src);
    width = width ?? dims?.width;
    height = height ?? dims?.height;
  }
  const lcp = /fetchpriority\s*=\s*["']high["']/i.test(attrs);
  return { src, width, height, lcp };
}

/**
 * @param {string} attrs
 * @param {string} name
 */
function readIntAttr(attrs, name) {
  const m = attrs.match(new RegExp(`\\b${name}\\s*=\\s*["']?(\\d+)`, "i"));
  return m ? Number(m[1]) : undefined;
}

/**
 * @param {string} src
 */
function dimensionsFromSrc(src) {
  const wM = src.match(/[?&]w=(\d+)/i);
  if (!wM) return null;
  const width = Number(wM[1]);
  if (!width) return null;
  const height = Math.round((width * 933) / 1400);
  return { width, height };
}

/**
 * @param {string} domain
 * @param {string | null | undefined} raw
 */
export function resolveOgImageUrl(domain, raw) {
  if (!raw) return `https://${domain}${DEFAULT_OG_ASSET}`;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;
  if (raw.startsWith("/")) return `https://${domain}${raw}`;
  return `https://${domain}/${raw}`;
}

/**
 * @param {string} s
 */
function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}