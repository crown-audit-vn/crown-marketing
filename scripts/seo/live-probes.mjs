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
  { domain: "audit.crown.com.vn", paths: ["/vi"] },
  { domain: "tax.crown.com.vn", paths: ["/vi"] },
  { domain: "cons.crown.com.vn", paths: ["/vi"] },
  { domain: "acc.crown.com.vn", paths: ["/vi"] },
  { domain: "fas.crown.com.vn", paths: ["/vi"] },
  { domain: "esg.crown.com.vn", paths: ["/vi"] },
  { domain: "up.crown.com.vn", paths: ["/vi"] },
];