#!/usr/bin/env node
/**
 * Apply SEO tags to static HTML, generate robots.txt and sitemap.xml per site.
 * Run: node scripts/apply-seo.mjs [site-folder|all]
 */
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { siteByFolder, sites } from "./sites.mjs";
import { writeTextIfChanged } from "./fs-write-if-changed.mjs";
import {
  buildSeoBlock,
  parseDescription,
  parseTitle,
  replaceOrInjectSeoBlock,
  setHtmlLang,
  stripLegacyCanonical,
} from "./seo/html-seo.mjs";
import {
  organizationSchema,
  siteSeoByFolder,
} from "./seo/site-meta.mjs";
import {
  DEFAULT_OG_ASSET,
  parseArticleHeroImage,
  resolveOgImageUrl,
} from "./seo/resolve-og-image.mjs";
import { logicalPath, resolveLocalePageMeta } from "./seo/hreflang.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

/**
 * @param {string} siteDir
 * @returns {string[]}
 */
function discoverHtmlFiles(siteDir) {
  /** @type {string[]} */
  const files = [];

  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) walk(full);
      else if (name === "index.html") files.push(full);
    }
  };

  walk(siteDir);
  return files.sort();
}

/**
 * @param {string} siteDir
 * @param {string} htmlPath
 */
function urlPathFromHtml(siteDir, htmlPath) {
  const relDir = relative(siteDir, dirname(htmlPath));
  if (!relDir || relDir === ".") return "/";
  const segments = relDir.split(/[/\\]/).filter(Boolean);
  return `/${segments.join("/")}`;
}

/**
 * @param {string} domain
 * @param {string} path
 */
function absoluteUrl(domain, path) {
  const origin = `https://${domain}`;
  if (path === "/") return `${origin}/`;
  return `${origin}${path}`;
}

/**
 * @param {string} folder
 * @param {string} urlPath
 */
/**
 * @param {string} folder
 * @param {string} urlPath
 * @param {string} primaryLang
 */
function pageKind(folder, urlPath, primaryLang) {
  const logical = logicalPath(urlPath, primaryLang);
  if (
    folder === "www" &&
    logical.startsWith("/insights/") &&
    logical !== "/insights"
  )
    return "article";
  return logical === "/" ? "home" : "page";
}

/**
 * @param {object} p
 */
function buildJsonLd(p) {
  const {
    kind,
    canonicalUrl,
    title,
    description,
    domain,
    siteName,
    seoMeta,
    ogImage,
  } = p;

  /** @type {object[]} */
  const blocks = [];

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: canonicalUrl,
    inLanguage: seoMeta.lang,
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: `https://${domain}`,
    },
  };
  blocks.push(webPage);

  if (kind === "home") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteName,
      url: `https://${domain}/`,
      inLanguage: seoMeta.lang,
      publisher: {
        "@type": "Organization",
        name: organizationSchema.name,
        url: organizationSchema.url,
      },
    });
    if (seoMeta.includeOrgSchema) {
      blocks.push({ ...organizationSchema });
    } else {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteName,
        url: `https://${domain}/`,
        parentOrganization: {
          "@type": "Organization",
          name: organizationSchema.name,
          url: organizationSchema.url,
        },
      });
    }
  }

  if (kind === "article") {
    /** @type {Record<string, unknown>} */
    const article = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title.replace(/\s*\|\s*Crown\s*$/i, ""),
      description,
      mainEntityOfPage: canonicalUrl,
      url: canonicalUrl,
      inLanguage: seoMeta.lang,
      author: {
        "@type": "Organization",
        name: organizationSchema.name,
      },
      publisher: {
        "@type": "Organization",
        name: organizationSchema.name,
        logo: {
          "@type": "ImageObject",
          url: organizationSchema.logo,
        },
      },
    };
    if (ogImage) article.image = [ogImage];
    blocks.push(article);
  }

  return blocks;
}

/**
 * @param {string} folder
 */
function applySite(folder) {
  const meta = siteByFolder.get(folder);
  if (!meta) throw new Error(`Unknown site: ${folder}`);

  const seoMeta = siteSeoByFolder[folder];
  if (!seoMeta) throw new Error(`Missing SEO config for: ${folder}`);

  const siteDir = resolve(root, "sites", folder);
  if (!existsSync(siteDir)) throw new Error(`Missing sites/${folder}`);

  const htmlFiles = discoverHtmlFiles(siteDir);
  const defaultOgImage = resolveOgImageUrl(meta.domain, DEFAULT_OG_ASSET);

  /** @type {{ loc: string, priority: string, changefreq: string }[]} */
  const sitemapEntries = [];

  for (const htmlPath of htmlFiles) {
    const originalHtml = readFileSync(htmlPath, "utf8");
    let html = originalHtml;
    const urlPath = urlPathFromHtml(siteDir, htmlPath);
    const localeMeta = resolveLocalePageMeta(meta.domain, urlPath, seoMeta);
    const canonicalUrl = localeMeta.canonicalUrl;
    const kind = pageKind(folder, urlPath, seoMeta.lang);

    const title = parseTitle(html) ?? seoMeta.siteName;
    const description = parseDescription(html) ?? "";

    const heroSrc = kind === "article" ? parseArticleHeroImage(html) : null;
    const ogImage = heroSrc ?
      resolveOgImageUrl(meta.domain, heroSrc)
    : defaultOgImage;
    const ogImageSize =
      ogImage === defaultOgImage ?
        { width: 1200, height: 675 }
      : undefined;

    html = stripLegacyCanonical(html);
    html = setHtmlLang(html, localeMeta.pageLocale);

    const block = buildSeoBlock({
      canonicalUrl,
      title,
      description,
      ogImage,
      ogImageSize,
      siteName: seoMeta.siteName,
      ogLocale: localeMeta.ogLocale,
      hreflangLinks: localeMeta.hreflangLinks,
      alternateOgLocales: localeMeta.alternateOgLocales,
      ogType: kind === "article" ? "article" : "website",
      jsonLd: buildJsonLd({
        kind,
        canonicalUrl,
        title,
        description,
        domain: meta.domain,
        siteName: seoMeta.siteName,
        seoMeta: { ...seoMeta, lang: localeMeta.pageLocale },
        ogImage: kind === "article" ? ogImage : undefined,
      }),
    });

    html = replaceOrInjectSeoBlock(html, block);
    writeTextIfChanged(htmlPath, html);

    const priority =
      urlPath === "/" ? "1.0" : kind === "article" ? "0.7" : "0.8";
    const changefreq =
      kind === "article" ? "monthly" : urlPath === "/" ? "weekly" : "monthly";

    sitemapEntries.push({
      loc: canonicalUrl,
      priority,
      changefreq,
    });
  }

  sitemapEntries.sort((a, b) => {
    if (a.loc === `https://${meta.domain}/`) return -1;
    if (b.loc === `https://${meta.domain}/`) return 1;
    return a.loc.localeCompare(b.loc);
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  writeTextIfChanged(join(siteDir, "sitemap.xml"), sitemapXml);

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://${meta.domain}/sitemap.xml
`;

  writeTextIfChanged(join(siteDir, "robots.txt"), robotsTxt);

  console.log(
    `[${folder}] ${htmlFiles.length} HTML, sitemap.xml + robots.txt → https://${meta.domain}`
  );
}

const arg = process.argv[2] ?? "all";
const targets =
  arg === "all" ? sites.map((s) => s.folder) : [arg];

let failed = false;
for (const folder of targets) {
  try {
    applySite(folder);
  } catch (err) {
    failed = true;
    console.error(`[${folder}] ${err.message}`);
  }
}

process.exit(failed ? 1 : 0);