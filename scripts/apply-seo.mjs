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
import { rewriteCrownHrefs } from "./seo/rewrite-crown-links.mjs";
import { siteSeoByFolder } from "./seo/site-meta.mjs";
import { pageMeta } from "./seo/page-meta.mjs";
import {
  buildJsonLd,
  extractFaq,
  extractInsightIndexItems,
} from "./seo/jsonld.mjs";
import {
  DEFAULT_OG_ASSET,
  parseArticleHeroMeta,
  resolveOgImageUrl,
} from "./seo/resolve-og-image.mjs";
import { logicalPath, resolveLocalePageMeta } from "./seo/hreflang.mjs";
import { insightDatesForPath } from "./seo/insight-articles.mjs";
import { gitLastModifiedDate, maxIsoDate } from "./seo/insight-git-dates.mjs";

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
  if (folder === "www" && logical === "/insights") return "insights-index";
  if (logical === "/services" || logical.startsWith("/services/")) return "service";
  return logical === "/" ? "home" : "page";
}

/**
 * @param {string} html
 * @param {string} title
 * @param {string} description
 */
function applyTitleDescription(html, title, description) {
  let out = html;
  if (title && /<title[^>]*>[\s\S]*?<\/title>/i.test(out)) {
    out = out.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  }
  if (description) {
    if (/<meta[^>]+name=["']description["'][^>]*>/i.test(out)) {
      out = out.replace(
        /<meta[^>]+name=["']description["'][^>]*>/i,
        `<meta name="description" content="${escapeAttr(description)}">`
      );
    }
  }
  return out;
}

/**
 * Replace the visible text of the first H1, keeping inner markup wrappers when possible.
 * @param {string} html
 * @param {string} h1
 */
function applyH1(html, h1) {
  if (!h1) return html;
  return html.replace(/<h1([^>]*)>[\s\S]*?<\/h1>/i, `<h1$1>${escapeHtml(h1)}</h1>`);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(s) {
  return escapeHtml(s).replaceAll('"', "&quot;");
}

/**
 * @param {string} domain
 * @param {string} urlPath
 * @param {string} primaryLang
 * @param {string} title
 * @param {"vi" | "en"} pageLocale
 */
function breadcrumbsFor(domain, urlPath, primaryLang, title, pageLocale) {
  const logical = logicalPath(urlPath, primaryLang);
  const origin = `https://${domain}`;
  const homePath = pageLocale === "vi" ? "/vi" : "/";
  const homeName = pageLocale === "vi" ? "Trang chủ" : "Home";
  /** @type {{ name: string, url: string }[]} */
  const items = [{ name: homeName, url: `${origin}${homePath === "/" ? "/" : homePath}` }];
  if (logical === "/") return items;

  const parts = logical.split("/").filter(Boolean);
  let acc = "";
  for (let i = 0; i < parts.length; i++) {
    acc += `/${parts[i]}`;
    const isLast = i === parts.length - 1;
    const localePath =
      pageLocale === "vi" ? (acc === "/" ? "/vi" : `/vi${acc}`) : acc;
    const name =
      isLast
        ? title.replace(/\s*\|\s*Crown.*$/i, "").trim()
        : parts[i] === "services"
          ? pageLocale === "vi" ? "Dịch vụ" : "Services"
          : parts[i] === "insights"
            ? pageLocale === "vi" ? "Góc nhìn" : "Insights"
            : parts[i] === "about"
              ? pageLocale === "vi" ? "Về chúng tôi" : "About"
              : parts[i] === "career"
                ? pageLocale === "vi" ? "Tuyển dụng" : "Careers"
                : parts[i];
    items.push({ name, url: `${origin}${localePath}` });
  }
  return items;
}

/**
 * Clear wins: async Font Awesome, preload header logo when present.
 * @param {string} html
 */
function applyCwvHints(html) {
  let out = html;
  out = out.replace(
    /<link href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/[^"]+" rel="stylesheet">/i,
    (m) => {
      if (m.includes("media=")) return m;
      return m
        .replace(
          'rel="stylesheet"',
          'rel="stylesheet" media="print" onload="this.media=\'all\'"'
        );
    }
  );

  out = out.replace(
    /<link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+" rel="stylesheet">/i,
    (m) => {
      if (m.includes("media=")) return m;
      return m.replace(
        'rel="stylesheet"',
        'rel="stylesheet" media="print" onload="this.media=\'all\'"'
      );
    }
  );

  if (!out.includes('rel="preload"') || !out.includes("crown-logo-header.png")) {
    if (
      out.includes("/assets/crown-logo-header.png") &&
      !out.includes('href="/assets/crown-logo-header.png" rel="preload"') &&
      !out.includes('rel="preload" href="/assets/crown-logo-header.png"')
    ) {
      out = out.replace(
        /(<link href="https:\/\/fonts\.gstatic\.com" rel="preconnect"[^>]*>)/i,
        `$1\n<link rel="preload" href="/assets/crown-logo-header.png" as="image">`
      );
    }
  }
  return out;
}

/**
 * Non-LCP images: lazy + async decode on article heroes when fetchpriority is not set.
 * @param {string} html
 */
function applyArticleImageHints(html) {
  return html.replace(
    /<figure class="ins-hero-photo">\s*<img([^>]*)>/gi,
    (full, attrs) => {
      const lcp = /fetchpriority\s*=\s*["']high["']/i.test(attrs);
      let a = attrs;
      if (!lcp && !/\sloading=/.test(a)) a += ` loading="lazy"`;
      if (!/\sdecoding=/.test(a)) a += ` decoding="async"`;
      const meta = heroMetaFromAttrsForPatch(a);
      if (meta?.width && !/\bwidth=/.test(a)) a += ` width="${meta.width}"`;
      if (meta?.height && !/\bheight=/.test(a)) a += ` height="${meta.height}"`;
      return `<figure class="ins-hero-photo"><img${a}>`;
    }
  );
}

/**
 * @param {string} attrs
 */
function heroMetaFromAttrsForPatch(attrs) {
  const srcM = attrs.match(/\bsrc=["']([^"']+)["']/i);
  if (!srcM) return null;
  const wM = attrs.match(/\bwidth\s*=\s*["']?(\d+)/i);
  const hM = attrs.match(/\bheight\s*=\s*["']?(\d+)/i);
  if (wM && hM) {
    return { width: Number(wM[1]), height: Number(hM[1]) };
  }
  const wQ = srcM[1].match(/[?&]w=(\d+)/i);
  if (!wQ) return null;
  const width = Number(wQ[1]);
  return { width, height: Math.round((width * 933) / 1400) };
}

/**
 * Preload likely LCP hero (insights).
 * @param {string} html
 * @param {string | null} imageUrl absolute or site-relative
 */
function applyArticleLcpPreload(html, imageUrl) {
  if (!imageUrl) return html;
  const href = escapeAttr(imageUrl);
  const cross = /^https?:\/\//i.test(imageUrl) ? ' crossorigin="anonymous"' : "";
  const tag = `<link rel="preload" as="image" href="${href}" fetchpriority="high"${cross} data-crown-lcp="hero">`;
  const preloadRe =
    /<link\s+rel="preload"\s+as="image"[^>]*data-crown-lcp="hero"[^>]*>\s*/i;
  if (preloadRe.test(html)) {
    return html.replace(preloadRe, `${tag}\n`);
  }
  const anchor = html.match(
    /(<link href="https:\/\/fonts\.gstatic\.com" rel="preconnect"[^>]*>)/i
  );
  if (anchor) {
    return html.replace(anchor[0], `${anchor[0]}\n${tag}`);
  }
  return html.replace(/<head[^>]*>/i, (h) => `${h}\n${tag}`);
}

/**
 * @param {string} domain
 * @param {string} folder
 * @param {{ loc: string }[]} sitemapEntries
 * @param {string} siteName
 */
function writeLlmsTxt(domain, folder, sitemapEntries, siteName) {
  const siteDir = resolve(root, "sites", folder);
  const locs = sitemapEntries.map((e) => e.loc).sort();

  let body;
  if (folder === "www") {
    const insights = locs.filter(
      (u) => u.includes("/insights/") && !/\/insights\/?$/.test(u)
    );
    const services = [
      "https://audit.crown.com.vn/",
      "https://tax.crown.com.vn/",
      "https://acc.crown.com.vn/",
      "https://cons.crown.com.vn/",
      "https://fas.crown.com.vn/",
      "https://esg.crown.com.vn/",
      "https://up.crown.com.vn/",
    ];
    body = `# Crown Audit & Advisory Việt Nam

> Independent audit, tax, accounting, corporate finance and ESG advisory in Vietnam.

## Main site
- https://${domain}/

## Insights
${insights.map((u) => `- ${u}`).join("\n")}

## Service sites
${services.map((u) => `- ${u}`).join("\n")}
`;
  } else {
    const pages = locs.filter((u) => {
      const path = u.replace(`https://${domain}`, "");
      return path === "/" || path === "/vi";
    });
    body = `# ${siteName}

> https://${domain}/ — Crown service site (Vietnam).

## Key URLs
${pages.map((u) => `- ${u}`).join("\n")}

## Group
- https://crown.com.vn/
`;
  }

  writeTextIfChanged(join(siteDir, "llms.txt"), body);
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

  /** @type {{ loc: string, priority: string, changefreq: string, lastmod: string, hreflangLinks: { code: string, href: string }[] }[]} */
  const sitemapEntries = [];

  for (const htmlPath of htmlFiles) {
    const originalHtml = readFileSync(htmlPath, "utf8");
    let html = originalHtml;
    const urlPath = urlPathFromHtml(siteDir, htmlPath);
    const localeMeta = resolveLocalePageMeta(meta.domain, urlPath, seoMeta);
    const canonicalUrl = localeMeta.canonicalUrl;
    const kind = pageKind(folder, urlPath, seoMeta.lang);
    const logical = logicalPath(urlPath, seoMeta.lang);
    const override = pageMeta(folder, logical, localeMeta.pageLocale);

    if (override?.title || override?.description) {
      html = applyTitleDescription(
        html,
        override.title ?? parseTitle(html) ?? seoMeta.siteName,
        override.description ?? parseDescription(html) ?? ""
      );
    }
    if (override?.h1) {
      html = applyH1(html, override.h1);
    }

    const title = parseTitle(html) ?? seoMeta.siteName;
    const description = parseDescription(html) ?? "";

    const heroMeta = kind === "article" ? parseArticleHeroMeta(html) : null;
    const heroSrc = heroMeta?.src ?? null;
    const ogImage = heroSrc
      ? resolveOgImageUrl(meta.domain, heroSrc)
      : defaultOgImage;
    let ogImageSize =
      ogImage === defaultOgImage ? { width: 1200, height: 675 } : undefined;
    if (heroMeta?.width && heroMeta?.height) {
      ogImageSize = { width: heroMeta.width, height: heroMeta.height };
    }

    html = stripLegacyCanonical(html);
    html = setHtmlLang(html, localeMeta.pageLocale);
    html = rewriteCrownHrefs(html, localeMeta.pageLocale, meta.domain);
    html = applyCwvHints(html);
    if (kind === "article") {
      html = applyArticleImageHints(html);
      if (heroMeta?.lcp && heroSrc) {
        const preloadUrl = /^https?:\/\//i.test(heroSrc)
          ? heroSrc
          : resolveOgImageUrl(meta.domain, heroSrc);
        html = applyArticleLcpPreload(html, preloadUrl);
      }
    }

    const insightDates =
      folder === "www" && kind === "article"
        ? insightDatesForPath(logical)
        : null;
    if (folder === "www" && kind === "article" && !insightDates) {
      throw new Error(
        `Thiếu ngày insight trong insight-articles.mjs: ${logical} (${htmlPath})`
      );
    }
    const datePublished = insightDates?.datePublished;
    const gitMod = kind === "article" ? gitLastModifiedDate(root, htmlPath) : null;
    const dateModified = maxIsoDate(
      maxIsoDate(insightDates?.dateModified, gitMod),
      datePublished
    );

    const faqs = extractFaq(html);
    const itemList =
      kind === "insights-index" ? extractInsightIndexItems(html) : undefined;
    const breadcrumbs = breadcrumbsFor(
      meta.domain,
      urlPath,
      seoMeta.lang,
      title,
      localeMeta.pageLocale
    );

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
      articlePublishedTime: datePublished,
      articleModifiedTime: dateModified,
      jsonLd: buildJsonLd({
        kind,
        canonicalUrl,
        title,
        description,
        domain: meta.domain,
        siteName: seoMeta.siteName,
        pageLocale: localeMeta.pageLocale,
        includeOrgSchema: Boolean(seoMeta.includeOrgSchema),
        ogImage: kind === "article" ? ogImage : undefined,
        breadcrumbs,
        faqs,
        serviceName: kind === "service" ? title.replace(/\s*\|\s*Crown.*$/i, "").trim() : undefined,
        serviceType: kind === "service" ? title.replace(/\s*\|\s*Crown.*$/i, "").trim() : undefined,
        datePublished,
        dateModified,
        itemList,
      }),
    });

    html = replaceOrInjectSeoBlock(html, block);
    writeTextIfChanged(htmlPath, html);

    const priority =
      urlPath === "/" ? "1.0" : kind === "article" ? "0.7" : kind === "service" ? "0.8" : "0.8";
    const changefreq =
      kind === "article" ? "monthly" : urlPath === "/" ? "weekly" : "monthly";

    const lastmod = statSync(htmlPath).mtime.toISOString().slice(0, 10);

    sitemapEntries.push({
      loc: canonicalUrl,
      priority,
      changefreq,
      lastmod,
      hreflangLinks: localeMeta.hreflangLinks,
    });
  }

  sitemapEntries.sort((a, b) => {
    if (a.loc === `https://${meta.domain}/`) return -1;
    if (b.loc === `https://${meta.domain}/`) return 1;
    return a.loc.localeCompare(b.loc);
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries
  .map((e) => {
    const alts = (e.hreflangLinks ?? [])
      .map(
        (l) =>
          `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${l.href}"/>`
      )
      .join("\n");
    return `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
${alts}
  </url>`;
  })
  .join("\n")}
</urlset>
`;

  writeTextIfChanged(join(siteDir, "sitemap.xml"), sitemapXml);

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://${meta.domain}/sitemap.xml
`;

  writeTextIfChanged(join(siteDir, "robots.txt"), robotsTxt);

  writeLlmsTxt(meta.domain, folder, sitemapEntries, seoMeta.siteName);

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
    if (err.stack) console.error(err.stack);
  }
}

process.exit(failed ? 1 : 0);
