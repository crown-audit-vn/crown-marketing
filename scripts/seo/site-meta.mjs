/**
 * Per-site SEO defaults (primary language, brand name for OG).
 * @typedef {{
 *   lang: string,
 *   ogLocale: string,
 *   siteName: string,
 *   includeOrgSchema: boolean,
 *   /** Client i18n on page: hint crawlers/social with hreflang on same URL *\/ 
 *   hreflang?: string[],
 *   alternateOgLocales?: string[],
 * }} SiteSeoMeta
 */

/** @type {Record<string, SiteSeoMeta>} */
export const siteSeoByFolder = {
  www: {
    lang: "en",
    ogLocale: "en_US",
    siteName: "Crown Audit & Advisory",
    includeOrgSchema: true,
    hreflang: ["vi", "en"],
    alternateOgLocales: ["vi_VN"],
  },
  audit: {
    lang: "en",
    ogLocale: "en_US",
    siteName: "Crown Audit",
    includeOrgSchema: false,
    hreflang: ["vi", "en"],
    alternateOgLocales: ["vi_VN"],
  },
  cons: {
    lang: "en",
    ogLocale: "en_US",
    siteName: "Crown Construction",
    includeOrgSchema: false,
    hreflang: ["vi", "en"],
    alternateOgLocales: ["vi_VN"],
  },
  acc: {
    lang: "en",
    ogLocale: "en_US",
    siteName: "Crown Accounting",
    includeOrgSchema: false,
    hreflang: ["vi", "en"],
    alternateOgLocales: ["vi_VN"],
  },
  tax: {
    lang: "en",
    ogLocale: "en_US",
    siteName: "Crown Tax",
    includeOrgSchema: false,
    hreflang: ["vi", "en"],
    alternateOgLocales: ["vi_VN"],
  },
  fas: {
    lang: "en",
    ogLocale: "en_US",
    siteName: "Crown FAS",
    includeOrgSchema: false,
    hreflang: ["vi", "en"],
    alternateOgLocales: ["vi_VN"],
  },
  esg: {
    lang: "en",
    ogLocale: "en_US",
    siteName: "Crown ESG",
    includeOrgSchema: false,
    hreflang: ["vi", "en"],
    alternateOgLocales: ["vi_VN"],
  },
  up: {
    lang: "en",
    ogLocale: "en_US",
    siteName: "Crown Up",
    includeOrgSchema: false,
    hreflang: ["vi", "en"],
    alternateOgLocales: ["vi_VN"],
  },
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Crown Audit & Advisory",
  url: "https://crown.com.vn",
  logo: "https://crown.com.vn/assets/crown-logo-green.png",
  sameAs: [],
};
