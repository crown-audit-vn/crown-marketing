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
    lang: "vi",
    ogLocale: "vi_VN",
    siteName: "Crown Audit & Advisory",
    includeOrgSchema: true,
    hreflang: ["vi", "en"],
    alternateOgLocales: ["en_US"],
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
    lang: "vi",
    ogLocale: "vi_VN",
    siteName: "Crown Construction",
    includeOrgSchema: false,
    hreflang: ["vi", "en"],
    alternateOgLocales: ["en_US"],
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
    lang: "vi",
    ogLocale: "vi_VN",
    siteName: "Crown FAS",
    includeOrgSchema: false,
    hreflang: ["vi", "en"],
    alternateOgLocales: ["en_US"],
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
    lang: "vi",
    ogLocale: "vi_VN",
    siteName: "Crown Up",
    includeOrgSchema: false,
    hreflang: ["vi", "en"],
    alternateOgLocales: ["en_US"],
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