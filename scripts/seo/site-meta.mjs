/**
 * Per-site SEO defaults (primary language, brand name for OG).
 * @typedef {{ lang: string, ogLocale: string, siteName: string, includeOrgSchema: boolean }} SiteSeoMeta
 */

/** @type {Record<string, SiteSeoMeta>} */
export const siteSeoByFolder = {
  www: {
    lang: "vi",
    ogLocale: "vi_VN",
    siteName: "Crown Audit & Advisory",
    includeOrgSchema: true,
  },
  audit: {
    lang: "en",
    ogLocale: "en_US",
    siteName: "Crown Audit",
    includeOrgSchema: false,
  },
  cons: {
    lang: "vi",
    ogLocale: "vi_VN",
    siteName: "Crown Construction",
    includeOrgSchema: false,
  },
  acc: {
    lang: "en",
    ogLocale: "en_US",
    siteName: "Crown Accounting",
    includeOrgSchema: false,
  },
  tax: {
    lang: "en",
    ogLocale: "en_US",
    siteName: "Crown Tax",
    includeOrgSchema: false,
  },
  fas: {
    lang: "vi",
    ogLocale: "vi_VN",
    siteName: "Crown FAS",
    includeOrgSchema: false,
  },
  esg: {
    lang: "en",
    ogLocale: "en_US",
    siteName: "Crown ESG",
    includeOrgSchema: false,
  },
  up: {
    lang: "vi",
    ogLocale: "vi_VN",
    siteName: "Crown Up",
    includeOrgSchema: false,
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