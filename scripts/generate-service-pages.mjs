#!/usr/bin/env node
/**
 * Generate EN + VI service pages that reuse each site's header, footer and CSS.
 * Run from repo root: node scripts/generate-service-pages.mjs
 */
import { existsSync, mkdirSync, readFileSync } from "node:fs";
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


function injectHomepageServiceIndex(folder) {
  const catalog = serviceCatalog[folder];
  if (!catalog) return;
  for (const locale of ["en", "vi"]) {
    const rel = locale === "vi" ? join("vi", "index.html") : "index.html";
    const file = join(root, "sites", folder, rel);
    if (!existsSync(file)) continue;
    let html = readFileSync(file, "utf8");
    const marker = `data-svc-index="${folder}"`;
    html = html.replace(/<nav class="svc-index"[\s\S]*?<\/nav>/, "");
    const title = locale === "vi" ? "Xem trang từng dịch vụ" : "Explore each service";
    const links = catalog.services
      .map((s) => {
        const href = locale === "vi" ? `/vi/services/${s.slug}` : `/services/${s.slug}`;
        return `<li><a href="${href}">${esc(s[locale].h1)}</a></li>`;
      })
      .join("");
    const block = `<nav class="svc-index" ${marker} aria-label="${esc(title)}"><h2>${esc(title)}</h2><ul>${links}</ul></nav>`;
    // Place just before the services section closes when possible.
    if (/id="dichvu"/.test(html)) {
      html = html.replace(/id="dichvu"([^>]*)>/, (m) => `${m}`);
      // insert after the opening tag of the services section
      html = html.replace(
        /(<section[^>]*id="dichvu"[^>]*>)/i,
        `$1\n${block}\n`
      );
    } else {
      html = html.replace(/<footer/i, `${block}\n<footer`);
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

const arg = process.argv[2] ?? "all";
const targets =
  arg === "all"
    ? Object.keys(serviceCatalog)
    : [arg];

let total = 0;
for (const folder of targets) {
  if (!siteByFolder.has(folder)) {
    console.error(`Unknown site ${folder}`);
    process.exitCode = 1;
    continue;
  }
  const n = generateSite(folder);
  injectHomepageServiceIndex(folder);
  console.log(`[${folder}] generated ${n} service pages`);
  total += n;
}
console.log(`done: ${total} pages`);
