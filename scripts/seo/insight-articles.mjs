/**
 * Published / modified dates for Crown Insights (logical slug under /insights/:slug).
 * datePublished from first git add; update dateModified when content materially changes.
 */

/** @typedef {{ datePublished: string, dateModified?: string }} InsightDates */

/** @type {Record<string, InsightDates>} */
export const insightArticleDates = {
  "capital-construction-audit": { datePublished: "2026-11-15" },
  "cit-finalization": { datePublished: "2026-11-27" },
  "esg-green-finance": { datePublished: "2026-11-15" },
  "fdi-financial-statement-audit": { datePublished: "2026-11-27" },
  "fdi-tax-compliance": { datePublished: "2026-11-15" },
  "financial-scenario-planning": { datePublished: "2026-11-15" },
  "financial-statement-audit": { datePublished: "2026-11-15" },
  "ma-due-diligence": { datePublished: "2026-11-15" },
  "preparing-financial-records": { datePublished: "2026-11-15" },
  "two-ring-defense-accounting": { datePublished: "2026-11-15" },
};

/**
 * @param {string} logicalPath e.g. /insights/fdi-tax-compliance
 * @returns {InsightDates | null}
 */
export function insightDatesForPath(logicalPath) {
  const m = logicalPath.match(/^\/insights\/([^/]+)$/);
  if (!m) return null;
  return insightArticleDates[m[1]] ?? null;
}