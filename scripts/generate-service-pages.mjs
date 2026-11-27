#!/usr/bin/env node
/**
 * Generate EN + VI service pages that reuse each site's header, footer and CSS.
 * Disabled by default — requires explicit approval (CROWN_GENERATE_SERVICE_PAGES=1).
 * Run from repo root: CROWN_GENERATE_SERVICE_PAGES=1 node scripts/generate-service-pages.mjs
 */
import { existsSync, mkdirSync, readFileSync } from "node:fs";

if (process.env.CROWN_GENERATE_SERVICE_PAGES !== "1") {
  console.log(
    "skip: service page generation is off (set CROWN_GENERATE_SERVICE_PAGES=1 to enable)"
  );
  process.exit(0);
}
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeTextIfChanged } from "./fs-write-if-changed.mjs";
import { serviceCatalog } from "./seo/service-catalog.mjs";
import { sites, siteByFolder } from "./sites.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const PAGE_CSS = `
<style id="crown-svc-page">
.svc-page{background:var(--cream,#FAFAF8);color:var(--ink,#111);font-family:Inter,system-ui,sans-serif;}
.svc-wrap{max-width:880px;margin:0 auto;padding:32px 24px 72px;}
.svc-crumbs{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:13px;color:var(--muted,#5B6660);margin:16px 0 28px;}
.svc-crumbs a{color:var(--navy-700,#1E4E30);text-decoration:none;}
.svc-crumbs a:hover{text-decoration:underline;}
.svc-kicker{letter-spacing:.08em;text-transform:uppercase;font-size:12px;font-weight:700;color:var(--gold-600,#1F6B3F);margin:0 0 10px;}
.svc-page h1{font-family:"Playfair Display",Georgia,serif;font-size:clamp(2rem,4vw,3rem);line-height:1.15;margin:0 0 16px;color:var(--navy-800,#163823);}
.svc-lead{font-size:1.125rem;line-height:1.7;color:var(--muted,#5B6660);margin:0 0 32px;}
.svc-page h2{font-family:"Playfair Display",Georgia,serif;font-size:1.5rem;margin:36px 0 12px;color:var(--navy-800,#163823);}
.svc-page p{line-height:1.75;margin:0 0 16px;}
.svc-related,.svc-cross,.svc-faq,.svc-cta{margin-top:48px;padding-top:28px;border-top:1px solid var(--line,#E3E3DE);}
.svc-cards{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));}
.svc-card{display:block;padding:18px 20px;border:1px solid var(--line,#E3E3DE);border-radius:var(--radius,14px);background:#fff;text-decoration:none;color:inherit;box-shadow:var(--shadow,none);}
.svc-card:hover{border-color:var(--gold-500,#2F8C55);}
.svc-card strong{display:block;color:var(--navy-800,#163823);margin-bottom:6px;}
.svc-cta a.btn-svc{display:inline-block;margin-top:8px;padding:12px 20px;background:var(--navy-800,#163823);color:#fff;border-radius:999px;text-decoration:none;font-weight:600;}
.svc-faq details{border-bottom:1px solid var(--line,#E3E3DE);padding:12px 0;}
.svc-faq summary{cursor:pointer;font-weight:600;color:var(--navy-800,#163823);}
.svc-faq details p{margin:10px 0 4px;}
</style>
`;

function splitChrome(html) {
  const headerClose = html.search(/<\/header>/i);
  const footerOpen = html.search(/<footer[\s>]/i);
  if (headerClose < 0 || footerOpen < 0) {
    throw new Error("Could not find header/footer");
  }
  return {
    before: html.slice(0, headerClose + "</header>".length),
    after: html.slice(footerOpen),
  };
}

function setTitleDesc(html, title, description) {
  let out = html;
  if (/<title[^>]*>[\s\S]*?<\/title>/i.test(out)) {
    out = out.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  }
  if (/<meta[^>]+name=["']description["'][^>]*>/i.test(out)) {
    out = out.replace(
      /<meta[^>]+name=["']description["'][^>]*>/i,
      `<meta name="description" content="${esc(description)}">`
    );
  } else {
    out = out.replace(
      /<\/title>/i,
      `</title>\n<meta name="description" content="${esc(description)}">`
    );
  }
  return out;
}

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fixHeaderLinks(html, locale) {
  const home = locale === "vi" ? "/vi" : "/";
  return html.replace(
    /href="#([^"]+)"/g,
    (_m, id) => `href="${home}#${id}"`
  );
}

function injectCss(html) {
  if (html.includes("id=\"crown-svc-page\"")) return html;
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `${PAGE_CSS}</head>`);
  return PAGE_CSS + html;
}

function lookupService(folder, slug) {
  const site = serviceCatalog[folder];
  return site?.services.find((s) => s.slug === slug) ?? null;
}

function relatedHref(folder, rel, locale) {
  if (rel.includes("/")) {
    const [other, slug] = rel.split("/");
    const meta = siteByFolder.get(other);
    if (!meta) return null;
    const path = locale === "vi" ? `/vi/services/${slug}` : `/services/${slug}`;
    return { href: `https://${meta.domain}${path}`, external: true, folder: other, slug };
  }
  const path = locale === "vi" ? `/vi/services/${rel}` : `/services/${rel}`;
  return { href: path, external: false, folder, slug: rel };
}

const CROSS = [
  { folder: "www", en: "Crown homepage", vi: "Trang chủ Crown" },
  { folder: "audit", en: "Crown Audit", vi: "Crown Audit" },
  { folder: "acc", en: "Crown Accounting", vi: "Crown Accounting" },
  { folder: "tax", en: "Crown Tax", vi: "Crown Tax" },
  { folder: "cons", en: "Crown Construction", vi: "Crown Construction" },
  { folder: "fas", en: "Crown FAS", vi: "Crown FAS" },
  { folder: "esg", en: "Crown ESG", vi: "Crown ESG" },
  { folder: "up", en: "Crown Up", vi: "Crown Up" },
];

function buildMain(folder, service, locale) {
  const copy = service[locale];
  const siteMeta = siteByFolder.get(folder);
  const brand = locale === "vi" ? serviceCatalog[folder].brandVi : serviceCatalog[folder].brandEn;
  const homePath = locale === "vi" ? "/vi" : "/";
  const servicesAnchor = locale === "vi" ? "/vi#dichvu" : "/#dichvu";
  const contact = locale === "vi"
    ? serviceCatalog[folder].contactPath.replace("/#", "/vi#")
    : serviceCatalog[folder].contactPath;
  const crumbHome = locale === "vi" ? "Trang chủ" : "Home";
  const crumbServices = locale === "vi" ? "Dịch vụ" : "Services";
  const relatedTitle = locale === "vi" ? "Dịch vụ liên quan" : "Related services";
  const crossTitle = locale === "vi" ? "Dịch vụ khác của Crown" : "Other Crown services";
  const faqTitle = locale === "vi" ? "Câu hỏi thường gặp" : "Frequently asked questions";
  const ctaTitle = locale === "vi" ? "Trao đổi về nhu cầu của bạn" : "Discuss your needs";
  const ctaBody = locale === "vi"
    ? "Liên hệ Crown để thống nhất phạm vi phù hợp. Chúng tôi không đưa ra kết luận trước khi trao đổi với doanh nghiệp."
    : "Contact Crown to agree a suitable scope. We do not reach conclusions before discussing your business’s situation.";
  const ctaLabel = locale === "vi" ? "Liên hệ tư vấn" : "Request a consultation";

  const crumbs = `
<nav class="svc-crumbs" aria-label="${locale === "vi" ? "Đường dẫn" : "Breadcrumb"}">
  <a href="${homePath}">${esc(crumbHome)}</a>
  <span aria-hidden="true">/</span>
  <a href="${servicesAnchor}">${esc(crumbServices)}</a>
  <span aria-hidden="true">/</span>
  <span>${esc(copy.h1)}</span>
</nav>`;

  const sections = copy.sections
    .map((s) => `<h2>${esc(s.h2)}</h2>\n<p>${esc(s.p)}</p>`)
    .join("\n");

  const relatedCards = service.related
    .map((rel) => {
      const info = relatedHref(folder, rel, locale);
      if (!info) return "";
      const target = lookupService(info.folder, info.slug);
      const label = target ? target[locale].h1 : rel;
      const hint = target ? target[locale].lead : "";
      return `<a class="svc-card" href="${esc(info.href)}"><strong>${esc(label)}</strong>${hint ? `<span>${esc(hint)}</span>` : ""}</a>`;
    })
    .join("\n");

  const crossCards = CROSS.filter((c) => c.folder !== folder)
    .map((c) => {
      const meta = siteByFolder.get(c.folder);
      if (!meta) return "";
      const href =
        c.folder === "www"
          ? locale === "vi"
            ? "https://crown.com.vn/vi"
            : "https://crown.com.vn/"
          : locale === "vi"
            ? `https://${meta.domain}/vi`
            : `https://${meta.domain}/`;
      return `<a class="svc-card" href="${esc(href)}"><strong>${esc(locale === "vi" ? c.vi : c.en)}</strong></a>`;
    })
    .join("\n");

  const faqs = (copy.faqs || [])
    .map(
      (f) =>
        `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`
    )
    .join("\n");

  return `
<main class="svc-page" data-svc-folder="${esc(folder)}" data-svc-slug="${esc(service.slug)}" data-svc-locale="${esc(locale)}">
  <div class="svc-wrap">
    ${crumbs}
    <p class="svc-kicker">${esc(copy.kicker || brand)}</p>
    <h1>${esc(copy.h1)}</h1>
    <p class="svc-lead">${esc(copy.lead)}</p>
    ${sections}
    <section class="svc-related">
      <h2>${esc(relatedTitle)}</h2>
      <div class="svc-cards">${relatedCards}</div>
    </section>
    <section class="svc-cross">
      <h2>${esc(crossTitle)}</h2>
      <div class="svc-cards">${crossCards}</div>
    </section>
    ${faqs ? `<section class="svc-faq"><h2>${esc(faqTitle)}</h2>${faqs}</section>` : ""}
    <section class="svc-cta">
      <h2>${esc(ctaTitle)}</h2>
      <p>${esc(ctaBody)}</p>
      <a class="btn-svc" href="${esc(contact)}">${esc(ctaLabel)}</a>
    </section>
  </div>
</main>
`;
}


const INDEX_CSS = `
<style id="crown-svc-index">
.svc-index-section{padding:clamp(72px,8vw,110px) 0;background:var(--cream,var(--audit-paper,#F6F4EF));}
.svc-index{color:var(--ink,#16281f);}
.services>.svc-index{margin-top:clamp(36px,5vw,64px);padding-top:clamp(36px,5vw,64px);border-top:1px solid var(--line,#E3E3DE);}
.svc-index .svc-index-head{max-width:680px;margin:0 auto 36px;text-align:center;}
.svc-index .svc-index-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:var(--gold-600,var(--champagne-500,#1F6B3F));margin:0 0 16px;}
.svc-index .svc-index-eyebrow::before{content:"";width:26px;height:2px;background:currentColor;display:inline-block;}
.svc-index .svc-index-head h2{font-family:"Playfair Display",Georgia,serif;font-size:clamp(28px,3.4vw,40px);line-height:1.25;margin:0 0 16px;color:var(--navy-800,#163823)!important;font-weight:600;}
.svc-index .svc-index-head p{margin:0 auto;max-width:620px;color:var(--muted,#5B6660);font-size:16px;line-height:1.7;}
.svc-index .svc-index-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin:0;padding:0;list-style:none;}
.svc-index .svc-index-card{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;min-width:0;padding:20px 22px;background:#fff;border:1px solid var(--line,#E3E3DE);border-radius:var(--radius,14px);text-decoration:none!important;color:var(--navy-800,#163823)!important;font-weight:600;font-size:15.5px;line-height:1.45;box-shadow:var(--shadow,0 1px 2px rgba(16,40,28,.05));transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;}
.svc-index .svc-index-card:hover,.svc-index .svc-index-card:focus-visible{transform:translateY(-4px);border-color:var(--gold-500,#2F8C55);box-shadow:0 10px 24px rgba(22,56,35,.08);}
.svc-index .svc-index-card>span{min-width:0;}
.svc-index .svc-index-card i{flex-shrink:0;margin-top:4px;color:var(--gold-600,#1F6B3F);font-size:12px;transition:transform .2s;}
.svc-index .svc-index-card:hover i{transform:translateX(4px);}
@media (max-width:640px){
  .svc-index .svc-index-grid{grid-template-columns:1fr;}
  .services>.svc-index{margin-top:32px;padding-top:32px;}
  .svc-index .svc-index-card{padding:16px 18px;font-size:15px;}
  .svc-index-section{padding:56px 0;}
}
</style>
`;

function injectIndexCss(html) {
  if (/<style id="crown-svc-index">[\s\S]*?<\/style>/.test(html)) {
    return html.replace(/<style id="crown-svc-index">[\s\S]*?<\/style>/, INDEX_CSS.trim());
  }
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `${INDEX_CSS}</head>`);
  return INDEX_CSS + html;
}

function stripServiceIndex(html) {
  return html
    .replace(/<section class="svc-index-section"[^>]*>[\s\S]*?<\/section>/g, "")
    .replace(/<nav class="svc-index"[\s\S]*?<\/nav>/g, "");
}

function findSectionClose(html, id) {
  const re = new RegExp(`<section[^>]*id="${id}"[^>]*>`, "i");
  const m = html.match(re);
  if (!m || m.index == null) return -1;
  let depth = 1;
  let pos = m.index + m[0].length;
  const lower = html.toLowerCase();
  while (depth > 0 && pos < html.length) {
    const open = lower.indexOf("<section", pos);
    const close = lower.indexOf("</section>", pos);
    if (close < 0) return -1;
    if (open >= 0 && open < close) {
      depth += 1;
      pos = open + 8;
    } else {
      depth -= 1;
      if (depth === 0) return close;
      pos = close + 10;
    }
  }
  return -1;
}

function buildServiceIndexBlock(folder, locale, { wrapSection } = { wrapSection: false }) {
  const catalog = serviceCatalog[folder];
  const title = locale === "vi" ? "Xem trang từng dịch vụ" : "Explore each service";
  const eyebrow = locale === "vi" ? "Trang dịch vụ" : "Service pages";
  const lead =
    locale === "vi"
      ? "Mở trang riêng của từng dịch vụ để xem phạm vi, cách tiếp cận và các dịch vụ liên quan."
      : "Open a dedicated page for each service, including scope, approach and related offerings.";
  const cards = catalog.services
    .map((s) => {
      const href = locale === "vi" ? `/vi/services/${s.slug}` : `/services/${s.slug}`;
      return `<a class="svc-index-card" href="${href}"><span>${esc(s[locale].h1)}</span><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>`;
    })
    .join("");
  const nav = `<nav class="svc-index" data-svc-index="${folder}" aria-label="${esc(title)}"><div class="container"><div class="svc-index-head"><div class="svc-index-eyebrow">${esc(eyebrow)}</div><h2>${esc(title)}</h2><p>${esc(lead)}</p></div><div class="svc-index-grid">${cards}</div></div></nav>`;
  if (wrapSection) {
    return `<section class="svc-index-section" id="svc-pages">${nav}</section>`;
  }
  return nav;
}

function injectHomepageServiceIndex(folder) {
  const catalog = serviceCatalog[folder];
  if (!catalog) return;
  for (const locale of ["en", "vi"]) {
    const rel = locale === "vi" ? join("vi", "index.html") : "index.html";
    const file = join(root, "sites", folder, rel);
    if (!existsSync(file)) continue;
    let html = readFileSync(file, "utf8");
    html = stripServiceIndex(html);
    html = injectIndexCss(html);
    const closeAt = findSectionClose(html, "dichvu");
    if (closeAt >= 0) {
      const block = buildServiceIndexBlock(folder, locale, { wrapSection: false });
      html = `${html.slice(0, closeAt)}\n${block}\n${html.slice(closeAt)}`;
    } else {
      const block = buildServiceIndexBlock(folder, locale, { wrapSection: true });
      const tuvan = html.search(/<section[^>]*id="tuvan"[^>]*>/i);
      if (tuvan >= 0) html = `${html.slice(0, tuvan)}${block}\n${html.slice(tuvan)}`;
      else html = html.replace(/<footer/i, `${block}\n<footer`);
    }
    writeTextIfChanged(file, html);
    console.log(`[${folder}] linked service index on ${locale} homepage`);
  }
}

function generateSite(folder) {
  const catalog = serviceCatalog[folder];
  if (!catalog) return 0;
  const siteDir = resolve(root, "sites", folder);
  const enSrc = readFileSync(join(siteDir, "index.html"), "utf8");
  const viSrcPath = join(siteDir, "vi", "index.html");
  const viSrc = existsSync(viSrcPath) ? readFileSync(viSrcPath, "utf8") : enSrc;
  const enChrome = splitChrome(enSrc);
  const viChrome = splitChrome(viSrc);
  let count = 0;
  for (const service of catalog.services) {
    for (const locale of ["en", "vi"]) {
      const chrome = locale === "vi" ? viChrome : enChrome;
      const copy = service[locale];
      const relDir =
        locale === "vi"
          ? join("vi", "services", service.slug)
          : join("services", service.slug);
      const outDir = join(siteDir, relDir);
      mkdirSync(outDir, { recursive: true });
      let head = setTitleDesc(chrome.before, copy.title, copy.description);
      head = injectCss(head);
      head = fixHeaderLinks(head, locale);
      const html = `${head}\n${buildMain(folder, service, locale)}\n${chrome.after}`;
      writeTextIfChanged(join(outDir, "index.html"), html);
      count += 1;
    }
  }
  return count;
}

const args = process.argv.slice(2).filter((a) => a !== "--index-only");
const arg = args[0] ?? "all";
const targets =
  arg === "all"
    ? Object.keys(serviceCatalog)
    : [arg];

const indexOnly = process.argv.includes("--index-only");
let total = 0;
for (const folder of targets.filter((t) => t !== "--index-only")) {
  if (!siteByFolder.has(folder)) {
    console.error(`Unknown site ${folder}`);
    process.exitCode = 1;
    continue;
  }
  if (indexOnly) {
    injectHomepageServiceIndex(folder);
    continue;
  }
  const n = generateSite(folder);
  injectHomepageServiceIndex(folder);
  console.log(`[${folder}] generated ${n} service pages`);
  total += n;
}
if (indexOnly) console.log("done: homepage service indexes only");
else console.log(`done: ${total} pages`);
