/**
 * Per-site SEO defaults (primary language, brand name for OG).
 * @typedef {{
 *   lang: string,
 *   ogLocale: string,
 *   siteName: string,
 *   includeOrgSchema: boolean,
 *   hreflang?: string[],
 *   alternateOgLocales?: string[],
 * }} SiteSeoMeta
 */

/** @type {Record<string, SiteSeoMeta>} */
export const siteSeoByFolder = {
  www: {
    lang: "en",
    ogLocale: "en_US",
    siteName: "Crown Audit & Advisory Việt Nam",
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

/** NAP taken only from existing site footers. */
export const organizationAddresses = [
  {
    "@type": "PostalAddress",
    name: "Head Office",
    streetAddress: "No. 7, Alley 699, Truong Dinh Street, Hoang Mai Ward",
    addressLocality: "Hanoi",
    addressCountry: "VN",
    telephone: "+84-904-501-512",
  },
  {
    "@type": "PostalAddress",
    name: "Hanoi Office",
    streetAddress:
      "7th Floor, VIC Building, 18 Nguy Nhu Kon Tum Street, Thanh Xuan",
    addressLocality: "Hanoi",
    addressCountry: "VN",
    telephone: "+84-559-468-888",
  },
  {
    "@type": "PostalAddress",
    name: "HCM Office",
    streetAddress:
      "13 N2 Street, Jamona Golden Silk Residential Area, 16/9 Bui Van Ba Street, Quarter 10, Tan Thuan Ward",
    addressLocality: "Ho Chi Minh City",
    addressCountry: "VN",
    telephone: "+84-948-737-868",
  },
];

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
  name: "Crown Audit & Advisory Việt Nam",
  legalName: "Crown Audit and Advisory Co., Ltd.",
  alternateName: ["Crown Audit & Advisory", "Crown"],
  url: "https://crown.com.vn",
  logo: "https://crown.com.vn/assets/crown-logo-green.png",
  image: "https://crown.com.vn/assets/crown-og-share.jpg",
  email: "info@crown.com.vn",
  telephone: "+84-904-501-512",
  address: organizationAddresses[0],
  location: organizationAddresses.map((addr) => ({
    "@type": "Place",
    name: addr.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: addr.streetAddress,
      addressLocality: addr.addressLocality,
      addressCountry: addr.addressCountry,
    },
    telephone: addr.telephone,
  })),
  contactPoint: organizationAddresses.map((addr) => ({
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: addr.telephone,
    email: "info@crown.com.vn",
    areaServed: "VN",
    availableLanguage: ["en", "vi"],
    name: addr.name,
  })),
  /** Add LinkedIn / other profiles here when marketing confirms public URLs. */
  sameAs: ["https://www.facebook.com/tamdoanhgroup"],
};
