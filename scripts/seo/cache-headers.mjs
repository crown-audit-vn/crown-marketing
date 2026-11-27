/**
 * Cache headers for each static site's vercel.json.
 *
 * Hashed/versioned assets (self-hosted fonts and hero-lcp.*) get a long
 * immutable cache. Other /assets files are not content-hashed, so they use
 * a short max-age plus stale-while-revalidate. HTML, sitemaps and robots
 * always revalidate.
 *
 * Never put redirect rules here: Vercel redirects run before Edge Middleware
 * and would break the ?lang= locale hop.
 *
 * More specific Cache-Control rules must come AFTER the general /assets
 * rule, otherwise Vercel applies the last matching source and the
 * immutable hero/font policy is overridden.
 */

/** @typedef {{ source: string, headers: { key: string, value: string }[] }} VercelHeader */

/** @type {VercelHeader[]} */
export const SITE_CACHE_HEADERS = [
  {
    source: "/assets/:path*",
    headers: [
      {
        key: "Cache-Control",
        value: "public, max-age=86400, stale-while-revalidate=604800",
      },
    ],
  },
  {
    source: "/assets/fonts/:path*",
    headers: [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ],
  },
  {
    source: "/assets/images/hero-lcp-:path*",
    headers: [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ],
  },
  {
    source: "/((?!assets/).*)",
    headers: [
      {
        key: "Cache-Control",
        value: "public, max-age=0, must-revalidate",
      },
    ],
  },
];
