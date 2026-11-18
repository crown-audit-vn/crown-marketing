import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const CSS_SNIPPET = `
footer .footer-shared-email{margin-top:6px;padding-top:14px;border-top:1px solid rgba(255,255,255,.12)}
footer .footer-shared-email__label{margin:0 0 8px;font-size:12px;font-weight:700;color:#fff;line-height:1.45}
footer .footer-shared-email .footer-contact-row{margin-bottom:0}
`.trim();

const SVG_ENVELOPE =
  '<div class="footer-contact-row"><svg class="footer-contact-icon footer-icon-envelope" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-9 6a2 2 0 0 1-2 0L2 7"/></svg><a href="mailto:info@crown.com.vn">info@crown.com.vn</a></div>';

const SVG_ENVELOPE_EN = SVG_ENVELOPE.replace('rx="2"/>', 'rx="2" />');

const FA_ENVELOPE_ROW =
  '<div class="footer-contact-row"><i aria-hidden="true" class="fa-regular fa-envelope"></i><a href="mailto:info@crown.com.vn">info@crown.com.vn</a></div>';

const REMOVE_SVG_ROW =
  /<div class="footer-contact-row"><svg\b[^>]*\bfooter-icon-envelope\b[^>]*>(?:[^<]|<(?!<\/svg>))*<\/svg><a href="mailto:info@crown\.com\.vn">info@crown\.com\.vn<\/a><\/div>/;

const REMOVE_FA_ROW =
  /<div class="footer-contact-row"><i aria-hidden="true" class="fa-regular fa-envelope"><\/i><a href="mailto:info@crown\.com\.vn">info@crown\.com\.vn<\/a><\/div>\s*/;

function sharedBlock({ bilingual, english }) {
  if (bilingual) {
    return `<div class="footer-shared-email"><p class="footer-shared-email__label"><span data-vi="">Email liên hệ</span><span data-en="">Contact email</span></p>${FA_ENVELOPE_ROW}</div>`;
  }
  const row = english ? SVG_ENVELOPE_EN : SVG_ENVELOPE;
  const label = english ? 'Contact email' : 'Email liên hệ';
  return `<div class="footer-shared-email"><p class="footer-shared-email__label">${label}</p>${row}</div>`;
}

function sharedBlockFa({ english, bilingual }) {
  if (bilingual) return sharedBlock({ bilingual: true });
  const label = english ? 'Contact email' : 'Email liên hệ';
  return `<div class="footer-shared-email"><p class="footer-shared-email__label">${label}</p>${FA_ENVELOPE_ROW}</div>`;
}

function pageKind(filePath, content) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  const bilingual = rel.startsWith('sites/up/');
  const enPath = /\/en\//.test(rel);
  const esgRootEn = rel === 'sites/esg/index.html';
  const english =
    enPath ||
    esgRootEn ||
    (/<strong>Head Office<\/strong>/.test(content) &&
      !/<strong>Trụ sở chính<\/strong>/.test(content) &&
      !bilingual);
  const usesFa = REMOVE_FA_ROW.test(content) || (bilingual && content.includes('fa-regular fa-envelope'));
  return { bilingual, english, usesFa: usesFa || bilingual };
}

const CSS_MARKERS = [
  'footer .footer-col:has(.footer-addr){min-width:0}',
  'footer .footer-contact-row > a:focus-visible{outline:2px solid var(--gold-400);outline-offset:3px;}',
];

function injectCss(content) {
  if (content.includes('footer .footer-shared-email{')) return content;
  for (const marker of CSS_MARKERS) {
    if (content.includes(marker)) {
      return content.replace(marker, `${marker}\n${CSS_SNIPPET}`);
    }
  }
  return content;
}

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const hasSharedHtml = content.includes('class="footer-shared-email"');
  const hasSharedCss = content.includes('footer .footer-shared-email{');
  if (hasSharedHtml && hasSharedCss) {
    return { filePath, status: 'skip-present' };
  }

  const kind = pageKind(filePath, content);
  const block = kind.usesFa
    ? sharedBlockFa(kind)
    : sharedBlock(kind);

  let next = content;

  if (!hasSharedHtml) {
    if (REMOVE_SVG_ROW.test(next)) {
      next = next.replace(REMOVE_SVG_ROW, '');
    } else if (REMOVE_FA_ROW.test(next)) {
      next = next.replace(REMOVE_FA_ROW, '');
    } else if (!kind.bilingual) {
      return { filePath, status: 'skip-no-row' };
    }

    const insertPatterns = [
      /(0948 737 868<\/a><\/div><\/div>)(<\/div>\s*<div class="footer-col">)/,
      /(0948 737 868<\/a><\/div>\s*<\/div>\s*)(<\/div>\s*<div class="footer-col">)/,
      /(0948737868">0948 737 868<\/a><\/div>\s*<\/div>\s*)(<\/div>\s*<div class="footer-col">)/,
    ];

    let inserted = false;
    for (const re of insertPatterns) {
      if (re.test(next)) {
        next = next.replace(re, `$1${block}$2`);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      return { filePath, status: 'fail-insert' };
    }
  }

  next = injectCss(next);
  if (next === content) {
    return { filePath, status: 'fail-unchanged' };
  }

  fs.writeFileSync(filePath, next, 'utf8');
  return { filePath, status: 'ok' };
}

function walkHtml(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(full, acc);
    else if (ent.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

const files = walkHtml(path.join(ROOT, 'sites'));
const results = files.map(patchFile);

const summary = results.reduce((acc, r) => {
  acc[r.status] = (acc[r.status] || 0) + 1;
  return acc;
}, {});

console.log(summary);
for (const r of results.filter((x) => x.status.startsWith('fail') || x.status === 'skip-no-row')) {
  console.log(r.status, path.relative(ROOT, r.filePath));
}