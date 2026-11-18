import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

const EMAIL_VI = {
  vi: 'Email liên hệ',
  en: 'Contact email',
  zh: '联系邮箱',
  ja: 'メールでのお問い合わせ',
  ko: '이메일 문의',
  th: 'อีเมลติดต่อ',
};

const EMAIL_EN = { ...EMAIL_VI };

function walkHtml(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(full, acc);
    else if (ent.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

function serializeEntry(key, value) {
  return `${JSON.stringify(key)}:${JSON.stringify(value)}`;
}

function injectTranslations(content) {
  const marker = 'const translations = {';
  const idx = content.indexOf(marker);
  if (idx === -1) return content;

  let next = content;
  const hasViKey = next.includes('"Email liên hệ":{');
  const hasEnKey = next.includes('"Contact email":{');

  const needsVi =
    !hasViKey && next.includes('footer-shared-email__label">Email liên hệ');
  const needsEn =
    !hasEnKey && next.includes('footer-shared-email__label">Contact email');

  if (!needsVi && !needsEn) return content;

  const parts = [];
  if (needsVi) parts.push(serializeEntry('Email liên hệ', EMAIL_VI));
  if (needsEn) parts.push(serializeEntry('Contact email', EMAIL_EN));
  const injection = `${parts.join(',')},`;

  return next.replace(marker, `${marker}${injection}`);
}

function injectI18nKey(content) {
  if (!content.includes('const I18N = {')) return content;
  if (content.includes('"footer.sharedEmail.label"')) return content;
  if (!content.includes('footer-shared-email')) return content;

  const marker = 'const I18N = {';
  const entry = `"footer.sharedEmail.label":${JSON.stringify(EMAIL_VI)},`;
  return content.replace(marker, `${marker}${entry}`);
}

function injectDataI18n(content) {
  if (!content.includes('const I18N = {')) return content;
  return content.replace(
    /<p class="footer-shared-email__label">Email liên hệ<\/p>/g,
    '<p class="footer-shared-email__label" data-i18n="footer.sharedEmail.label">Email liên hệ</p>',
  );
}

let updated = 0;
for (const file of walkHtml(path.join(ROOT, 'sites'))) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('footer-shared-email')) continue;

  const next = injectDataI18n(injectI18nKey(injectTranslations(content)));
  if (next !== content) {
    fs.writeFileSync(file, next, 'utf8');
    updated++;
  }
}

console.log(`updated ${updated} files`);