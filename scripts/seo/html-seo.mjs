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
 * @param {{ code: string, href: string }[] | undefined} opts.hreflangLinks
 * @param {string[] | undefined} opts.alternateOgLocales
 * @param {{ width?: number, height?: number } | undefined} opts.ogImageSize
 * @param {string | undefined} opts.articlePublishedTime ISO 8601 date (articles)
 * @param {string | undefined} opts.articleModifiedTime ISO 8601 date (articles)
 */
export function buildSeoBlock(opts) {
  const title = escapeAttr(opts.title);
  const description = escapeAttr(opts.description);
  const canonical = escapeAttr(opts.canonicalUrl);
  const ogImage = escapeAttr(opts.ogImage);

  const hreflangTags = (opts.hreflangLinks ?? [])
    .map(
      ({ code, href }) =>
        `<link rel="alternate" hreflang="${escapeAttr(code)}" href="${escapeAttr(href)}">`
    )
    .join("\n");

  const ogLocaleAlt = (opts.alternateOgLocales ?? [])
    .map(
      (locale) =>
        `<meta property="og:locale:alternate" content="${escapeAttr(locale)}">`
    )
    .join("\n");

  const ogImageSize =
    opts.ogImageSize?.width && opts.ogImageSize?.height ?
      `<meta property="og:image:width" content="${opts.ogImageSize.width}">
<meta property="og:image:height" content="${opts.ogImageSize.height}">`
    : "";

  const jsonLdScripts = opts.jsonLd
    .map(
      (obj) =>
        `<script type="application/ld+json">${JSON.stringify(obj)}</script>`
    )
    .join("\n");

  const articleOgMeta =
    opts.ogType === "article" && opts.articlePublishedTime
      ? `<meta property="article:published_time" content="${escapeAttr(opts.articlePublishedTime)}">
<meta property="article:modified_time" content="${escapeAttr(opts.articleModifiedTime ?? opts.articlePublishedTime)}">`
      : "";

  return `${SEO_START}
<link rel="canonical" href="${canonical}">
${hreflangTags}
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="${opts.ogType}">
<meta property="og:site_name" content="${escapeAttr(opts.siteName)}">
<meta property="og:locale" content="${escapeAttr(opts.ogLocale)}">
${ogLocaleAlt}
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${ogImage}">
${ogImageSize}
${articleOgMeta}
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
 * Cập nhật block SEO tại chỗ (idempotent — không thêm dòng trống mỗi lần chạy).
 *
 * @param {string} html
 * @param {string} block
 */
export function replaceOrInjectSeoBlock(html, block) {
  const re = new RegExp(
    `${SEO_START}[\\s\\S]*?${SEO_END}`,
    "i"
  );
  if (re.test(html)) {
    return html.replace(re, block);
  }
  return injectSeoBlock(html, block);
}

/**
 * @param {string} html
 * @param {string} lang
 */
export function setHtmlLang(html, lang) {
  return html.replace(/<html\b[^>]*>/i, (tag) => {
    let out = /\slang=["'][^"']*["']/.test(tag)
      ? tag.replace(/\slang=["'][^"']*["']/, ` lang="${lang}"`)
      : tag.replace(/<html/i, `<html lang="${lang}"`);
    if (/\sdata-crown-locale=/.test(out)) {
      out = out.replace(
        /data-crown-locale=["'][^"']*["']/,
        `data-crown-locale="${lang}"`
      );
    } else {
      out = out.replace(/<html/i, `<html data-crown-locale="${lang}"`);
    }
    return out;
  });
}