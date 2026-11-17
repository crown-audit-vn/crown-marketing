/** Default Open Graph image (deployed under each site's /assets/). */
export const DEFAULT_OG_ASSET = "/assets/crown-og-share.jpg";

/**
 * Hero image on Crown Insights articles.
 * @param {string} html
 * @returns {string | null}
 */
export function parseArticleHeroImage(html) {
  const block = html.match(
    /class=["']ins-hero-photo["'][^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["']/i
  );
  if (block) return decodeEntities(block[1]);
  const alt = html.match(
    /<figure[^>]*class=["'][^"']*ins-hero-photo[^"']*["'][^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["']/i
  );
  if (alt) return decodeEntities(alt[1]);
  return null;
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