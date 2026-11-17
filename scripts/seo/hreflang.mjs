/**
 * @param {string} domain
 * @param {string} urlPath e.g. /, /about, /en/about
 * @param {{ lang: string, ogLocale: string }} siteMeta
 */
export function resolveLocalePageMeta(domain, urlPath, siteMeta) {
  const primary = siteMeta.lang;
  const altPrefix = primary === "vi" ? "en" : "vi";

  const isAlt =
    urlPath === `/${altPrefix}` || urlPath.startsWith(`/${altPrefix}/`);

  const basePath =
    isAlt ?
      urlPath === `/${altPrefix}` ?
        "/"
      : urlPath.slice(altPrefix.length + 1)
    : urlPath;

  const baseSuffix = basePath === "/" ? "" : basePath;

  const viUrl =
    primary === "vi" ?
      absolute(domain, basePath)
    : absolute(domain, `/vi${baseSuffix}`);

  const enUrl =
    primary === "en" ?
      absolute(domain, basePath)
    : absolute(domain, `/en${baseSuffix}`);

  const xDefault = primary === "vi" ? viUrl : enUrl;
  const pageLocale = isAlt ? (primary === "vi" ? "en" : "vi") : primary;
  const ogLocale = pageLocale === "vi" ? "vi_VN" : "en_US";
  const alternateOgLocales = [pageLocale === "vi" ? "en_US" : "vi_VN"];

  return {
    canonicalUrl: absolute(domain, urlPath),
    pageLocale,
    ogLocale,
    alternateOgLocales,
    hreflangLinks: [
      { code: "vi", href: viUrl },
      { code: "en", href: enUrl },
      { code: "x-default", href: xDefault },
    ],
  };
}

/**
 * @param {string} domain
 * @param {string} path
 */
function absolute(domain, path) {
  if (path === "/") return `https://${domain}/`;
  return `https://${domain}${path}`;
}

/**
 * Strip /en or /vi prefix for page kind (insights article).
 * @param {string} urlPath
 * @param {string} primaryLang
 */
export function logicalPath(urlPath, primaryLang) {
  const alt = primaryLang === "vi" ? "en" : "vi";
  if (urlPath === `/${alt}`) return "/";
  if (urlPath.startsWith(`/${alt}/`)) return urlPath.slice(alt.length + 1);
  return urlPath;
}