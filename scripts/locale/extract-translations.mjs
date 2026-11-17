/**
 * Extract `const NAME = { ... };` object literals from inline scripts (brace-balanced).
 * @param {string} html
 * @param {string} constName
 * @returns {Record<string, unknown> | null}
 */
export function extractConstObject(html, constName) {
  const re = new RegExp(`const\\s+${constName}\\s*=\\s*`);
  const start = html.search(re);
  if (start === -1) return null;

  const braceStart = html.indexOf("{", start);
  if (braceStart === -1) return null;

  let depth = 0;
  let inString = null;
  let escape = false;

  for (let i = braceStart; i < html.length; i++) {
    const ch = html[i];
    if (inString) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = ch;
      continue;
    }
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        const literal = html.slice(braceStart, i + 1);
        try {
          return Function(`"use strict"; return (${literal});`)();
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}