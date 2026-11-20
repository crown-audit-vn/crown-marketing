#!/usr/bin/env node
/**
 * Patch in-page language switchers on every HTML page:
 * - en/vi navigate to path-based locale URLs (English unprefixed, Vietnamese /vi)
 * - stop writing ?lang= onto links or the address bar
 * - initialize from the URL path / data-crown-locale (no language flip)
 * - keep origin when localizing cross-subdomain Crown links
 *
 * Run: node scripts/patch-locale-switcher.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeTextIfChanged } from "./fs-write-if-changed.mjs";
import { sites } from "./sites.mjs";
import { primaryLangByHost } from "./seo/locale-path.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function helpersSnippet() {
  const entries = Object.entries(primaryLangByHost)
    .map(([host, lang]) => `'${host}':'${lang}'`)
    .join(",");
  return `  const primaryByHost={${entries}};
  function crownNormalizePath(pathname){
    if(!pathname||pathname==='/')return '/';
    const trimmed=pathname.replace(/\\/+$/,'');
    return trimmed===''?'/':trimmed;
  }
  function crownLogicalPath(pathname){
    const p=crownNormalizePath(pathname);
    for (const prefix of ['en','vi']){
      if(p==='/'+prefix)return '/';
      if(p.startsWith('/'+prefix+'/'))return p.slice(prefix.length+1);
    }
    return p;
  }
  function crownLocalePath(pathname,targetLang){
    const logical=crownLogicalPath(pathname);
    if(targetLang!=='en'&&targetLang!=='vi')return logical;
    if(targetLang==='en')return logical;
    return logical==='/'?'/vi':'/vi'+logical;
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
      || 'en';
  }
  function crownLocalizeUrl(href,language){
    const url=new URL(href,location.href);
    url.searchParams.delete('lang');
    const host=url.hostname;
    if(!crownHosts.has(host)) return url.href;
    if(language==='en'||language==='vi'){
      url.pathname=crownLocalePath(url.pathname,language);
    }
    const pathPart=url.pathname+url.search+url.hash;
    if(host!==location.hostname){
      return url.origin+pathPart;
    }
    return pathPart;
  }
`;
}

const HOSTS_RE = /const crownHosts = new Set\(\[([^\]]*)\]\);/;

const HOSTS_SET =
  "const crownHosts = new Set(['crown.com.vn','www.crown.com.vn','audit.crown.com.vn','cons.crown.com.vn','acc.crown.com.vn','tax.crown.com.vn','fas.crown.com.vn','esg.crown.com.vn','up.crown.com.vn']);";

const LINKS_OLD = [
  `    links.forEach(({el,href})=>{
      const url=new URL(href,location.href);url.searchParams.set('lang',language);el.href=url.href;
    });`,
  `    links.forEach(({el,href})=>{
      el.href=crownLocalizeUrl(href,language);
    });`,
];

const LINKS_NEW = `    links.forEach(({el,href})=>{
      el.href=crownLocalizeUrl(href,language);
    });`;

const PERSIST_OLD = `      try{const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);}catch{}`;
const PERSIST_NEW = `      try{const url=new URL(location.href);url.searchParams.delete('lang');history.replaceState(null,'',url.pathname+url.search+url.hash);}catch{}`;

const CLICK_OLD = `  document.querySelectorAll('.lang-option').forEach(button=>button.addEventListener('click',()=>{applyLanguage(button.dataset.lang,true);closeMenus();menus[0].button.focus();}));`;

const CLICK_NEW = `  document.querySelectorAll('.lang-option').forEach(button=>button.addEventListener('click',()=>{
    const language=button.dataset.lang;
    if(language==='en'||language==='vi'){
      const dest=crownLocalePath(location.pathname,language);
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
  /const initial=crownPageLocale\(\);\s*applyLanguage\(languages\.includes\(initial\)\?initial:crownPageLocale\(\)\);/g,
];

const INIT_NEW = `  const initial=crownPageLocale();
  applyLanguage(languages.includes(initial)?initial:'en');`;

/**
 * @param {string} siteDir
 * @returns {string[]}
 */
function discoverAllHtml(siteDir) {
  /** @type {string[]} */
  const files = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) {
        if (name === "assets" || name === ".vercel") continue;
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
 * Replace or inject the shared path-locale helpers after crownHosts.
 * @param {string} html
 */
function upsertHelpers(html) {
  let out = html;
  const helpers = helpersSnippet();

  const blockRe =
    /const primaryByHost=\{[\s\S]*?function crownLocalizeUrl\(href,language\)\{[\s\S]*?\r?\n  \}\r?\n/;
  if (blockRe.test(out)) {
    out = out.replace(blockRe, helpers);
  } else if (HOSTS_RE.test(out) && !out.includes("function crownLocalePath(")) {
    out = out.replace(HOSTS_RE, `${HOSTS_SET}\n${helpers}`);
  }

  if (HOSTS_RE.test(out)) {
    out = out.replace(HOSTS_RE, HOSTS_SET);
  }
  return out;
}

/**
 * @param {string} html
 */
function patchStandardSwitcher(html) {
  let out = upsertHelpers(html);

  for (const old of LINKS_OLD) {
    if (out.includes(old)) out = out.replaceAll(old, LINKS_NEW);
  }

  if (out.includes(PERSIST_OLD)) {
    out = out.replaceAll(PERSIST_OLD, PERSIST_NEW);
  }

  // Replace previous click handlers (vi-primary or original) with the en-default one.
  const clickRe =
    /document\.querySelectorAll\('\.lang-option'\)\.forEach\(button=>button\.addEventListener\('click',\(\)=>\{[\s\S]*?menus\[0\]\.button\.focus\(\);\s*\}\)\);/;
  if (clickRe.test(out)) {
    out = out.replace(clickRe, CLICK_NEW);
  } else if (out.includes(CLICK_OLD)) {
    out = out.replaceAll(CLICK_OLD, CLICK_NEW);
  }

  for (const re of INIT_PATTERNS) {
    out = out.replace(re, INIT_NEW);
  }

  out = out.replace(
    "local.searchParams.set('lang',document.documentElement.lang);location.href=local.href;",
    "location.href=local.pathname+local.search+local.hash;"
  );

  return { html: out, changed: out !== html };
}

/**
 * Path-based setLang for Crown Up (data-vi / data-en, no translations JSON).
 * @param {string} html
 */
function patchUpSwitcher(html) {
  let out = html;

  out = out.replace(/onclick="setLang\('vi'\)"/g, `onclick="setLang('vi',true)"`);
  out = out.replace(/onclick="setLang\('en'\)"/g, `onclick="setLang('en',true)"`);

  const setLangNew = `  function setLang(lang, persist){
    if(persist && (lang==='en'||lang==='vi')){
      const dest=lang==='en'?'/':'/vi';
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

  out = out.replace(
    /function setLang\(lang(?:,\s*persist)?\)\{[\s\S]*?data-label-'\+lang\)\);\s*\}/,
    setLangNew.trim()
  );

  out = out.replace(
    /window\.addEventListener\("DOMContentLoaded",\(\)=>setLang\("en"\)\);/,
    `window.addEventListener("DOMContentLoaded",()=>{const p=(location.pathname.replace(/\\/+$/,'')||'/');setLang((p==='/vi'||p.startsWith('/vi/'))?'vi':'en');});`
  );
  out = out.replace(
    /window\.addEventListener\("DOMContentLoaded",\(\)=>\{const p=\(location\.pathname\.replace\(\/\\\/\+\$\/,''\)\|\|'\/'\)\);setLang\(\(p==='\/en'\|\|p\.startsWith\('\/en\/'\)\)\?'en':'vi'\);\}\);/,
    `window.addEventListener("DOMContentLoaded",()=>{const p=(location.pathname.replace(/\\/+$/,'')||'/');setLang((p==='/vi'||p.startsWith('/vi/'))?'vi':'en');});`
  );


  out = out.replace(
    /setLang\(\(p==='\/en'\|\|p\.startsWith\('\/en\/'\)\)\?'en':'vi'\)/g,
    "setLang((p==='/vi'||p.startsWith('/vi/'))?'vi':'en')"
  );

  return out;
}

/**
 * Keep the visible language-button state in sync with the page locale.
 * @param {string} html
 * @param {string} relPath posix path under the site root, e.g. "vi/index.html"
 */
function syncUpButtonState(html, relPath) {
  const isVi = relPath === "vi" || relPath.startsWith("vi/");
  let out = html;
  if (isVi) {
    out = out.replace(/<button class="active" id="btn-en"/, `<button class="" id="btn-en"`);
    out = out.replace(/<button class="" id="btn-vi"/, `<button class="active" id="btn-vi"`);
  } else {
    out = out.replace(/<button class="active" id="btn-vi"/, `<button class="" id="btn-vi"`);
    out = out.replace(/<button class="" id="btn-en"/, `<button class="active" id="btn-en"`);
  }
  return out;
}

let filesChanged = 0;

for (const { folder } of sites) {
  const siteDir = resolve(root, "sites", folder);
  const files = discoverAllHtml(siteDir);
  for (const file of files) {
    const original = readFileSync(file, "utf8");
    let next = original;
    const rel = relative(siteDir, file).replace(/\\/g, "/");
    if (folder === "up") {
      next = patchUpSwitcher(next);
      next = syncUpButtonState(next, rel.replace(/\/index\.html$/, "").replace(/index\.html$/, "") || ".");
    }
    const patched = patchStandardSwitcher(next);
    next = patched.html;
    if (next !== original) {
      writeTextIfChanged(file, next);
      filesChanged += 1;
      console.log(`patched ${relative(root, file)}`);
    }
  }
}

console.log(`Locale switcher: ${filesChanged} file(s) updated`);
