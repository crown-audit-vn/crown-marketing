/**
 * Title/description overrides when JSON i18n không khớp <title>.
 * Key: `${folder}|${logicalPath}` với logicalPath `/` hoặc `/about`, …
 */
export const HEADLINE_OVERRIDES = {
  "www|/": {
    en: {
      title:
        "Crown Audit & Advisory | Audit, Tax, Accounting, Financial Advisory & ESG",
      description:
        "Crown Audit & Advisory provides independent audit, tax, accounting, corporate finance and ESG advisory services for businesses in Vietnam.",
    },
  },
  "up|/": {
    en: {
      description:
        "Crown Up is a business acceleration program by Tam Doanh Group, Crown Audit & Advisory and Koru Capital — audit, tax, finance and capital strategy.",
    },
  },
};

/**
 * @param {string} folder
 * @param {string} logicalPath
 * @param {"vi" | "en"} locale
 */
export function headlineOverride(folder, logicalPath, locale) {
  const key = `${folder}|${logicalPath === "/" ? "/" : logicalPath}`;
  return HEADLINE_OVERRIDES[key]?.[locale] ?? null;
}