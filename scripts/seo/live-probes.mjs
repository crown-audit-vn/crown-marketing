/**
 * Extra production URLs to verify after deploy (beyond robots / sitemap / home).
 * Paths are checked for HTTP 200 and crown-seo marker.
 */

/** @typedef {{ domain: string, paths: string[] }} LiveProbeSite */

/** @type {LiveProbeSite[]} */
export const liveSeoProbes = [
  {
    domain: "crown.com.vn",
    paths: ["/insights/fdi-tax-compliance", "/about"],
  },
  {
    domain: "audit.crown.com.vn",
    paths: ["/services/financial-statement-audit"],
  },
  {
    domain: "tax.crown.com.vn",
    paths: ["/services/transfer-pricing"],
  },
  {
    domain: "cons.crown.com.vn",
    paths: ["/services/settlement-audit"],
  },
  {
    domain: "acc.crown.com.vn",
    paths: ["/services/management-accounting"],
  },
  {
    domain: "fas.crown.com.vn",
    paths: ["/services/financial-due-diligence"],
  },
  {
    domain: "esg.crown.com.vn",
    paths: ["/services/sustainability-reporting"],
  },
  {
    domain: "up.crown.com.vn",
    paths: ["/services/capabilities"],
  },
];