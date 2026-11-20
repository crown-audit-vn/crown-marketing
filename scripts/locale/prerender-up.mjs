/**
 * Crown Up uses data-vi / data-en spans instead of translations JSON.
 * @param {string} html
 * @param {"vi" | "en"} locale
 */
export function applyUpLocale(html, locale, override = null) {
  let out = html.replace(/<html\s+[^>]*>/, (tag) => {
    let next = tag.replace(/\slang="[^"]*"/, ` lang="${locale}"`);
    if (/data-crown-locale=/.test(next)) {
      next = next.replace(/data-crown-locale="[^"]*"/, `data-crown-locale="${locale}"`);
    } else {
      next = next.replace("<html", `<html data-crown-locale="${locale}"`);
    }
    return next;
  });

  if (locale === "en") {
    if (!/\blang-en\b/.test(out)) {
      out = out.replace(/<body([^>]*)>/, (m, attrs) => {
        if (/class=/.test(attrs)) {
          return m.replace(/class=["']([^"']*)["']/, 'class="$1 lang-en"');
        }
        return `<body${attrs} class="lang-en">`;
      });
    }
    out = out.replace(
      /<title>([^<]*)<\/title>/,
      "<title>Crown Up — Business Acceleration Program | Tam Doanh · Crown · Koru</title>"
    );
    out = out.replace(/<button class="active" id="btn-vi"/, `<button class="" id="btn-vi"`);
    out = out.replace(/<button class="" id="btn-en"/, `<button class="active" id="btn-en"`);
  } else {
    out = out.replace(/ class="([^"]*)\blang-en\b([^"]*)"/, (m, a, b) => {
      const cls = `${a}${b}`.replace(/\s+/g, " ").trim();
      return cls ? ` class="${cls}"` : "";
    });
    out = out.replace(/<button class="active" id="btn-en"/, `<button class="" id="btn-en"`);
    out = out.replace(/<button class="" id="btn-vi"/, `<button class="active" id="btn-vi"`);
  }

  if (override?.description) {
    out = out.replace(
      /<meta[^>]+name=["']description["'][^>]*>/i,
      `<meta content="${override.description.replace(/"/g, "&quot;")}" name="description"/>`
    );
  }
  if (override?.title) {
    out = out.replace(/<title>([^<]*)<\/title>/, `<title>${override.title}</title>`);
  }
  return out;
}
