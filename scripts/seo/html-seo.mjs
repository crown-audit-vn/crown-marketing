const SEO_START = "<!-- crown-seo:start -->";
const SEO_END = "<!-- crown-seo:end -->";

/**
 * @param {string} html
 */
export function stripLegacyCanonical(html) {
  return html.replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, "");
}

/**
 * @param {string} html
 */
export function removeSeoBlock(html) {
  const re = new RegExp(
    `${SEO_START}[\\s\\S]*?${SEO_END}\\s*`,
    "i"
  );
  return html.replace(re, "");
}

/**
 * @param {string} html
 * @returns {string | null}
 */
export function parseTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  if (!m) return null;
  return decodeEntities(m[1].trim());
}

/**
 * @param {string} html
 * @returns {string | null}
 */
export function parseDescription(html) {
  const m = html.match(
    /<meta[^>]+name=["']description["'][^>]*>/i
  );
  if (!m) return null;
  const tag = m[0];
  const contentMatch = tag.match(/content=["']([^"']*)["']/i);
  if (!contentMatch) return null;
  return decodeEntities(contentMatch[1].trim());
}

/**
 * @param {string} s
 */
function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * @param {string} s
 */
export function escapeAttr(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/**
 * @param {object} opts
 * @param {string} opts.canonicalUrl
 * @param {string} opts.title
 * @param {string} opts.description
 * @param {string} opts.ogImage
 * @param {string} opts.siteName
 * @param {string} opts.ogLocale
 * @param {"website" | "article"} opts.ogType
 * @param {object[]} opts.jsonLd
 */
export function buildSeoBlock(opts) {
  const title = escapeAttr(opts.title);
  const description = escapeAttr(opts.description);
  const canonical = escapeAttr(opts.canonicalUrl);
  const ogImage = escapeAttr(opts.ogImage);

  const jsonLdScripts = opts.jsonLd
    .map(
      (obj) =>
        `<script type="application/ld+json">${JSON.stringify(obj)}</script>`
    )
    .join("\n");

  return `${SEO_START}
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="${opts.ogType}">
<meta property="og:site_name" content="${escapeAttr(opts.siteName)}">
<meta property="og:locale" content="${escapeAttr(opts.ogLocale)}">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${ogImage}">
${jsonLdScripts}
${SEO_END}`;
}

/**
 * @param {string} html
 * @param {string} block
 */
export function injectSeoBlock(html, block) {
  const descMatch = html.match(
    /(<meta[^>]+name=["']description["'][^>]*>\s*)/i
  );
  if (descMatch) {
    const idx = html.indexOf(descMatch[0]) + descMatch[0].length;
    return `${html.slice(0, idx)}\n${block}\n${html.slice(idx)}`;
  }

  const titleMatch = html.match(/(<title>[^<]*<\/title>\s*)/i);
  if (titleMatch) {
    const idx = html.indexOf(titleMatch[0]) + titleMatch[0].length;
    return `${html.slice(0, idx)}\n${block}\n${html.slice(idx)}`;
  }

  const headEnd = html.indexOf("</head>");
  if (headEnd === -1) return html;
  return `${html.slice(0, headEnd)}\n${block}\n${html.slice(headEnd)}`;
}

/**
 * @param {string} html
 * @param {string} lang
 */
export function setHtmlLang(html, lang) {
  return html.replace(
    /<html\s+lang=["'][^"']*["']/i,
    `<html lang="${lang}"`
  );
}