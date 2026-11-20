/**
 * @param {string} domain
 * @param {string} urlPath e.g. /, /about, /vi/about
 * @param {{ lang: string, ogLocale: string }} siteMeta
 */
import {
  absoluteUrl,
  localeFromPath,
  localePath,
  logicalPath as logicalPathFromLocale,
} from "./locale-path.mjs";

export function resolveLocalePageMeta(domain, urlPath, siteMeta) {
  const primary = siteMeta.lang ?? "en";
  const pageLocale = localeFromPath(urlPath) ?? primary;

  const viUrl = absoluteUrl(domain, localePath(urlPath, "vi", primary));
  const enUrl = absoluteUrl(domain, localePath(urlPath, "en", primary));
  const xDefault = enUrl;

  const ogLocale = pageLocale === "vi" ? "vi_VN" : "en_US";
  const alternateOgLocales = [pageLocale === "vi" ? "en_US" : "vi_VN"];

  return {
    canonicalUrl: absoluteUrl(domain, urlPath),
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
 * Strip /en or /vi prefix for page kind (insights article).
 * @param {string} urlPath
 * @param {string} [primaryLang]
 */
export function logicalPath(urlPath, primaryLang) {
  return logicalPathFromLocale(urlPath, primaryLang);
}
