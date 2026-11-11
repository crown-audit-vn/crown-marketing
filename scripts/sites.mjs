/** @typedef {{ folder: string, port: number, domain: string }} CrownSite */

/** @type {CrownSite[]} */
export const sites = [
  { folder: "www", port: 5000, domain: "crown.com.vn" },
  { folder: "audit", port: 5001, domain: "audit.crown.com.vn" },
  { folder: "cons", port: 5002, domain: "cons.crown.com.vn" },
  { folder: "acc", port: 5003, domain: "acc.crown.com.vn" },
  { folder: "tax", port: 5004, domain: "tax.crown.com.vn" },
  { folder: "fas", port: 5005, domain: "fas.crown.com.vn" },
  { folder: "esg", port: 5006, domain: "esg.crown.com.vn" },
  { folder: "up", port: 5007, domain: "up.crown.com.vn" },
];

export const siteByFolder = new Map(sites.map((s) => [s.folder, s]));
