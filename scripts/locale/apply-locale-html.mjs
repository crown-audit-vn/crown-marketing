import { parseHTML } from "linkedom";
import { extractConstObject } from "./extract-translations.mjs";

/**
 * @param {string} original
 * @param {string} language
 * @param {Record<string, Record<string, string>> | null} translations
 */
function translateByMap(original, language, translations) {
  if (!translations) return original;
  const normalize = (s) => s.replace(/\s+/g, " ").trim();
  const n = normalize(original);
  const direct = translations[n] ?? translations[original];
  if (direct?.[language]) return direct[language];

  for (const [key, map] of Object.entries(translations)) {
    if (typeof map !== "object" || !map) continue;
    if (normalize(key) === n && map[language]) return map[language];
    if (normalize(String(map.vi ?? "")) === n && map[language]) {
      return map[language];
    }
    if (normalize(String(map.en ?? "")) === n && map[language]) {
      return map[language];
    }
  }
  return original;
}

/**
 * Apply a locale to HTML for static prerender (vi / en).
 * @param {string} html
 * @param {"vi" | "en"} locale
 * @param {{ title?: string, description?: string } | null} headlineOverride
 */
export function applyLocaleToHtml(html, locale, headlineOverride = null) {
  const I18N = extractConstObject(html, "I18N");
  const translations = extractConstObject(html, "translations");

  const { document } = parseHTML(html);
  // Keep entity-separated text (for example "M&A") as one translation unit.
  document.normalize();

  for (const el of document.querySelectorAll("[data-i18n]")) {
    const key = el.getAttribute("data-i18n");
    if (!key || !I18N?.[key]) continue;
    const entry = I18N[key];
    const next =
      typeof entry === "object" && entry !== null && locale in entry ?
        String(entry[locale])
      : null;
    if (next) el.textContent = next;
  }

  if (locale === "en") document.body?.classList.add("lang-en");
  if (locale === "vi") document.body?.classList.remove("lang-en");

  const titleEl = document.querySelector("title");
  if (titleEl?.textContent) {
    titleEl.textContent =
      headlineOverride?.title ??
      translateByMap(titleEl.textContent, locale, translations);
  }

  const metaDesc = document.querySelector('meta[name="description"]');
  const descContent = metaDesc?.getAttribute("content");
  if (metaDesc && descContent) {
    metaDesc.setAttribute(
      "content",
      headlineOverride?.description ??
        translateByMap(descContent, locale, translations)
    );
  }

  const walker = document.createTreeWalker(
    document.body ?? document,
    4 /* NodeFilter.SHOW_TEXT */
  );
  /** @type {Text | null} */
  let node;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (!parent || parent.closest("script,style,noscript")) continue;
    const raw = node.nodeValue;
    if (!raw?.trim()) continue;
    const next = translateByMap(raw, locale, translations);
    if (next !== raw) node.nodeValue = next;
  }

  for (const el of document.querySelectorAll(
    "[placeholder],[aria-label],[title],[alt]"
  )) {
    for (const attr of ["placeholder", "aria-label", "title", "alt"]) {
      const val = el.getAttribute(attr);
      if (!val) continue;
      el.setAttribute(attr, translateByMap(val, locale, translations));
    }
  }

  document.documentElement.setAttribute("lang", locale);
  document.documentElement.setAttribute("data-crown-locale", locale);

  let out = `<!DOCTYPE html>\n${document.documentElement.outerHTML}`;

  out = out.replace(
    /let\s+currentLang\s*=\s*['"][^'"]+['"]/,
    `let currentLang='${locale}'`
  );
  out = out.replace(
    /let\s+locale\s*=\s*['"][^'"]+['"]/,
    `let locale='${locale}'`
  );

  return out;
}
