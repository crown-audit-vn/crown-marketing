/**
 * Crown Up uses data-vi / data-en spans instead of translations JSON.
 * @param {string} html
 * @param {"vi" | "en"} locale
 */
export function applyUpLocale(html, locale, override = null) {
  if (locale !== "en") return html;
  let out = html.replace(/<html\s+[^>]*>/, (tag) => {
    let next = tag.replace(/\slang="[^"]*"/, ' lang="en"');
    if (/data-crown-locale=/.test(next)) {
      next = next.replace(/data-crown-locale="[^"]*"/, 'data-crown-locale="en"');
    } else {
      next = next.replace("<html", '<html data-crown-locale="en"');
    }
    return next;
  });
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
  if (override?.description) {
    out = out.replace(
      /<meta[^>]+name=["']description["'][^>]*>/i,
      `<meta content="${override.description.replace(/"/g, "&quot;")}" name="description"/>`
    );
  }
  return out;
}