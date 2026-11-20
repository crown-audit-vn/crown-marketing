#!/usr/bin/env node
/**
 * Patch in-page language switchers in SOURCE html only (not /en or /vi mirrors):
 * - en/vi navigate to path-based locale URLs
 * - stop writing ?lang= onto links or the address bar
 * - initialize from the URL path / data-crown-locale, not a hard-coded default
 *
 * Run: node scripts/patch-locale-switcher.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeTextIfChanged } from "./fs-write-if-changed.mjs";
import { sites } from "./sites.mjs";
import { primaryLangByFolder } from "./seo/locale-path.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const HELPERS = `  const primaryByHost={
    'crown.com.vn':'vi','www.crown.com.vn':'vi',
    'cons.crown.com.vn':'vi','fas.crown.com.vn':'vi','up.crown.com.vn':'vi',
    'acc.crown.com.vn':'en','audit.crown.com.vn':'en','tax.crown.com.vn':'en','esg.crown.com.vn':'en'
  };
  function crownNormalizePath(pathname){
    if(!pathname||pathname==='/')return '/';
    const trimmed=pathname.replace(/\\/+$/,'');
    return trimmed===''?'/':trimmed;
  }
  function crownLogicalPath(pathname,primary){
    const alt=primary==='vi'?'en':'vi';
    const p=crownNormalizePath(pathname);
    if(p==='/'+alt)return '/';
    if(p.startsWith('/'+alt+'/'))return p.slice(alt.length+1);
    return p;
  }
  function crownLocalePath(pathname,targetLang,primary){
    const logical=crownLogicalPath(pathname,primary);
    if(targetLang!=='en'&&targetLang!=='vi')return logical;
    if(targetLang===primary)return logical;
    return logical==='/'?'/'+targetLang:'/'+targetLang+logical;
  }
  function crownPathLocale(pathname){
    const p=crownNormalizePath(pathname);
    if(p==='/en'||p.startsWith('/en/'))return 'en';
    if(p==='/vi'||p.startsWith('/vi/'))return 'vi';
    return null;
  }
  function crownPageLocale(){
    return crownPathLocale(location.pathname)
      || document.documentElement.getAttribute('data-crown-locale')
      || (document.documentElement.lang||'').slice(0,2)
      || 'vi';
  }
  function crownLocalizeUrl(href,language){
    const url=new URL(href,location.href);
    url.searchParams.delete('lang');
    const host=url.hostname;
    if(!crownHosts.has(host)) return url.href;
    const primary=primaryByHost[host]||'vi';
    if(language==='en'||language==='vi'){
      url.pathname=crownLocalePath(url.pathname,language,primary);
    }
    return url.pathname+url.search+url.hash;
  }
`;

const HOSTS_RE =
  /const crownHosts = new Set\(\[([^\]]*)\]\);/;

const HOSTS_NEXT =
  "const crownHosts = new Set(['crown.com.vn','www.crown.com.vn','audit.crown.com.vn','cons.crown.com.vn','acc.crown.com.vn','tax.crown.com.vn','fas.crown.com.vn','esg.crown.com.vn','up.crown.com.vn']);\n" +
  HELPERS;

const LINKS_OLD = `    links.forEach(({el,href})=>{
      const url=new URL(href,location.href);url.searchParams.set('lang',language);el.href=url.href;
    });`;

const LINKS_NEW = `    links.forEach(({el,href})=>{
      el.href=crownLocalizeUrl(href,language);
    });`;

const PERSIST_OLD = `      try{const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);}catch{}`;

const PERSIST_NEW = `      try{const url=new URL(location.href);url.searchParams.delete('lang');history.replaceState(null,'',url.pathname+url.search+url.hash);}catch{}`;

const CLICK_OLD = `  document.querySelectorAll('.lang-option').forEach(button=>button.addEventListener('click',()=>{applyLanguage(button.dataset.lang,true);closeMenus();menus[0].button.focus();}));`;

const CLICK_NEW = `  document.querySelectorAll('.lang-option').forEach(button=>button.addEventListener('click',()=>{
    const language=button.dataset.lang;
    const primary=primaryByHost[location.hostname]||'vi';
    if(language==='en'||language==='vi'){
      const dest=crownLocalePath(location.pathname,language,primary);
      const current=crownNormalizePath(location.pathname);
      if(crownNormalizePath(dest)!==current){
        const url=new URL(location.href);
        url.pathname=dest;
        url.searchParams.delete('lang');
        location.assign(url.pathname+url.search+url.hash);
        return;
      }
    }
    applyLanguage(language,true);closeMenus();menus[0].button.focus();
  }));`;

const INIT_PATTERNS = [
  /let\s+initial\s*=\s*new URLSearchParams\(location\.search\)\.get\('lang'\);\s*(?:\/\/[^\n]*\n\s*)*applyLanguage\(languages\.includes\(initial\)\s*\?\s*initial\s*:\s*'[^']+'\);/g,
  /const\s+requestedLanguage\s*=\s*new URLSearchParams\(location\.search\)\.get\('lang'\);\s*applyLanguage\(languages\.includes\(requestedLanguage\)\s*\?\s*requestedLanguage\s*:\s*'[^']+'\);/g,
];

const INIT_NEW = `  const initial=crownPageLocale();
  applyLanguage(languages.includes(initial)?initial:crownPageLocale());`;

/**
 * @param {string} siteDir
 * @param {string} primaryLang
 * @returns {string[]}
 */
function discoverSourceHtml(siteDir, primaryLang) {
  /** @type {string[]} */
  const files = [];
  const alt = primaryLang === "vi" ? "en" : "vi";

  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) {
        if (name === "assets" || name === ".vercel" || name === alt) continue;
        walk(full);
      } else if (name === "index.html") {
        files.push(full);
      }
    }
  };

  walk(siteDir);
  return files.sort();
}

/**
 * @param {string} html
 */
function patchStandardSwitcher(html) {
  let out = html;
  let changed = false;

  if (HOSTS_RE.test(out) && !out.includes("function crownLocalePath(")) {
    out = out.replace(HOSTS_RE, HOSTS_NEXT);
    changed = true;
  }

  if (out.includes(LINKS_OLD)) {
    out = out.replaceAll(LINKS_OLD, LINKS_NEW);
    changed = true;
  }

  if (out.includes(PERSIST_OLD)) {
    out = out.replaceAll(PERSIST_OLD, PERSIST_NEW);
    changed = true;
  }

  if (out.includes(CLICK_OLD)) {
    out = out.replaceAll(CLICK_OLD, CLICK_NEW);
    changed = true;
  }

  for (const re of INIT_PATTERNS) {
    const next = out.replace(re, INIT_NEW);
    if (next !== out) {
      out = next;
      changed = true;
    }
  }

  // file: protocol preview helper — keep local navigation, drop ?lang=
  out = out.replace(
    "local.searchParams.set('lang',document.documentElement.lang);location.href=local.href;",
    "location.href=local.pathname+local.search+local.hash;"
  );

  return { html: out, changed: changed || out !== html };
}

/**
 * Path-based setLang for Crown Up (data-vi / data-en, no translations JSON).
 * @param {string} html
 */
function patchUpSwitcher(html) {
  let out = html;

  out = out.replace(
    /onclick="setLang\('vi'\)"/g,
    `onclick="setLang('vi',true)"`
  );
  out = out.replace(
    /onclick="setLang\('en'\)"/g,
    `onclick="setLang('en',true)"`
  );

  const setLangOld = `  function setLang(lang){
    document.body.classList.toggle('lang-en', lang === 'en');
    document.getElementById('btn-vi').classList.toggle('active', lang === 'vi');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-placeholder-vi][data-placeholder-en]').forEach(el => el.setAttribute('placeholder',el.getAttribute('data-placeholder-'+lang)));
    document.querySelectorAll('[data-label-vi][data-label-en]').forEach(el => el.textContent=el.getAttribute('data-label-'+lang));
  }`;

  const setLangNew = `  function setLang(lang, persist){
    if(persist && (lang==='en'||lang==='vi')){
      const dest=lang==='en'?'/en':'/';
      const cur=(location.pathname.replace(/\\/+$/,'')||'/');
      if(dest!==cur){
        const url=new URL(location.href);
        url.pathname=dest;
        url.searchParams.delete('lang');
        location.assign(url.pathname+url.search+url.hash);
        return;
      }
    }
    document.body.classList.toggle('lang-en', lang === 'en');
    document.getElementById('btn-vi').classList.toggle('active', lang === 'vi');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-crown-locale', lang);
    document.querySelectorAll('[data-placeholder-vi][data-placeholder-en]').forEach(el => el.setAttribute('placeholder',el.getAttribute('data-placeholder-'+lang)));
    document.querySelectorAll('[data-label-vi][data-label-en]').forEach(el => el.textContent=el.getAttribute('data-label-'+lang));
  }`;

  if (out.includes(setLangOld)) out = out.replace(setLangOld, setLangNew);

  out = out.replace(
    /window\.addEventListener\("DOMContentLoaded",\(\)=>setLang\("en"\)\);/,
    `window.addEventListener("DOMContentLoaded",()=>{const p=(location.pathname.replace(/\\/+$/,'')||'/');setLang((p==='/en'||p.startsWith('/en/'))?'en':'vi');});`
  );

  // Source homepage is Vietnamese; EN should not start as the active button.
  out = out.replace(
    /<button class="active" id="btn-en"/,
    `<button class="" id="btn-en"`
  );
  out = out.replace(
    /<button class="" id="btn-vi"/,
    `<button class="active" id="btn-vi"`
  );

  return out;
}

let filesChanged = 0;

for (const { folder } of sites) {
  const primary = primaryLangByFolder[folder];
  const siteDir = resolve(root, "sites", folder);
  const files = discoverSourceHtml(siteDir, primary);
  for (const file of files) {
    const original = readFileSync(file, "utf8");
    let next = original;
    if (folder === "up") next = patchUpSwitcher(next);
    const patched = patchStandardSwitcher(next);
    next = patched.html;
    if (next !== original) {
      writeTextIfChanged(file, next);
      filesChanged += 1;
      console.log(`patched ${relative(root, file)}`);
    }
  }
}

console.log(`Locale switcher: ${filesChanged} source file(s) updated`);
