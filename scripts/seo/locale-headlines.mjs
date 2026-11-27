/**
 * Title/description overrides. Delegates to page-meta.mjs (single source).
 */
import { PAGE_META, pageMeta } from "./page-meta.mjs";

export { PAGE_META as HEADLINE_OVERRIDES, pageMeta };

/**
 * @param {string} folder
 * @param {string} logicalPath
 * @param {"vi" | "en"} locale
 */
export function headlineOverride(folder, logicalPath, locale) {
  return pageMeta(folder, logicalPath, locale);
}
