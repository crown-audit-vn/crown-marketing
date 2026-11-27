/**
 * JSON-LD builders and a lightweight schema.org type check.
 */
import { organizationSchema } from "./site-meta.mjs";

const SCHEMA_TYPES = new Set([
  "Organization",
  "ProfessionalService",
  "LocalBusiness",
  "Place",
  "PostalAddress",
  "ContactPoint",
  "WebPage",
  "WebSite",
  "Article",
  "Service",
  "BreadcrumbList",
  "ListItem",
  "FAQPage",
  "Question",
  "Answer",
  "ImageObject",
  "Country",
]);

/**
 * @param {unknown} node
 * @param {string[]} issues
 * @param {string} path
 */
export function validateJsonLd(node, issues = [], path = "$") {
  if (Array.isArray(node)) {
    node.forEach((item, i) => validateJsonLd(item, issues, `${path}[${i}]`));
    return issues;
  }
  if (!node || typeof node !== "object") return issues;
  const types = node["@type"];
  if (types) {
    const list = Array.isArray(types) ? types : [types];
    for (const t of list) {
      if (!SCHEMA_TYPES.has(t)) issues.push(`${path}: unknown @type ${t}`);
    }
  }
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("@")) continue;
    if (value && typeof value === "object") {
      validateJsonLd(value, issues, `${path}.${key}`);
    }
  }
  return issues;
}

/**
 * @param {string} html
 * @returns {{ q: string, a: string }[]}
 */
export function extractFaq(html) {
  const section = html.match(/<section class="svc-faq"[\s\S]*?<\/section>/i);
  if (!section) return [];
  /** @type {{ q: string, a: string }[]} */
  const items = [];
  const re = /<details>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/gi;
  let m;
  while ((m = re.exec(section[0]))) {
    const q = m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    const a = m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (q && a) items.push({ q, a });
  }
  return items;
}

/**
 * @param {{
 *   kind: string,
 *   canonicalUrl: string,
 *   title: string,
 *   description: string,
 *   domain: string,
 *   siteName: string,
 *   pageLocale: string,
 *   includeOrgSchema: boolean,
 *   ogImage?: string,
 *   breadcrumbs?: { name: string, url: string }[],
 *   faqs?: { q: string, a: string }[],
 *   serviceName?: string,
 *   serviceType?: string,
 *   datePublished?: string,
 *   dateModified?: string,
 * }} p
 */
export function buildJsonLd(p) {
  /** @type {object[]} */
  const blocks = [];

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: p.title,
    description: p.description,
    url: p.canonicalUrl,
    inLanguage: p.pageLocale,
    isPartOf: {
      "@type": "WebSite",
      name: p.siteName,
      url: `https://${p.domain}`,
    },
  };
  blocks.push(webPage);

  if (p.kind === "home") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: p.siteName,
      url: `https://${p.domain}/`,
      inLanguage: p.pageLocale,
      publisher: {
        "@type": "Organization",
        name: organizationSchema.name,
        url: organizationSchema.url,
      },
    });
    if (p.includeOrgSchema) {
      blocks.push({ ...organizationSchema });
    } else {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: p.siteName,
        url: `https://${p.domain}/`,
        parentOrganization: {
          "@type": "Organization",
          name: organizationSchema.name,
          url: organizationSchema.url,
          ...(organizationSchema.sameAs?.length
            ? { sameAs: organizationSchema.sameAs }
            : {}),
        },
        address: organizationSchema.address,
        telephone: organizationSchema.telephone,
        email: organizationSchema.email,
      });
    }
  }

  if (p.kind === "article") {
    /** @type {Record<string, unknown>} */
    const article = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: p.title.replace(/\s*\|\s*Crown.*$/i, "").trim(),
      description: p.description,
      mainEntityOfPage: p.canonicalUrl,
      url: p.canonicalUrl,
      inLanguage: p.pageLocale,
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
    if (p.ogImage) article.image = [p.ogImage];
    if (p.datePublished) article.datePublished = p.datePublished;
    if (p.dateModified) article.dateModified = p.dateModified;
    else if (p.datePublished) article.dateModified = p.datePublished;
    blocks.push(article);
  }

  if (p.kind === "service") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: p.serviceName || p.title,
      description: p.description,
      url: p.canonicalUrl,
      serviceType: p.serviceType || p.serviceName || p.title,
      provider: {
        "@type": "Organization",
        name: p.includeOrgSchema ? organizationSchema.name : p.siteName,
        url: p.includeOrgSchema ? organizationSchema.url : `https://${p.domain}/`,
        parentOrganization: p.includeOrgSchema
          ? undefined
          : {
              "@type": "Organization",
              name: organizationSchema.name,
              url: organizationSchema.url,
            },
      },
      areaServed: {
        "@type": "Country",
        name: "Vietnam",
      },
    });
  }

  if (p.breadcrumbs && p.breadcrumbs.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: p.breadcrumbs.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

  if (p.faqs && p.faqs.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: p.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    });
  }

  for (const block of blocks) {
    const issues = validateJsonLd(block);
    if (issues.length) {
      throw new Error(`Invalid JSON-LD (${p.canonicalUrl}): ${issues.join("; ")}`);
    }
  }

  return blocks;
}

