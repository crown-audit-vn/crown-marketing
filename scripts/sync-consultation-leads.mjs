#!/usr/bin/env node
/**
 * Central consultation proxy: sync client JS + wire forms on all marketing sites.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { sites } from "./sites.mjs";
import { writeTextIfChanged } from "./fs-write-if-changed.mjs";
import { patchEnquiryModals } from "./patch-enquiry-modals.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const clientSource = resolve(__dirname, "assets", "consultation-leads-client.js");
const clientJs = readFileSync(clientSource, "utf8");

const CLIENT_TAG =
  '<script src="/assets/consultation-leads-client.js"></script>';

const MAIL_SCRIPT_IDS = [
  "crown-accounting-email-contact",
  "crown-cons-contact-mail",
  "crown-fas-mail-contact",
  "crown-esg-mail-contact",
];

/** @param {string} domain */
function siteContactFormsScript(domain) {
  return `<script id="crown-site-contact-forms">(function(){
document.addEventListener('DOMContentLoaded',function(){
  var SOURCE_SITE=${JSON.stringify(domain)};
  function mailPurpose(form){
    var purpose=form.getAttribute('data-mail-purpose')||'consultation';
    var lang=(document.documentElement.lang||'vi').slice(0,2)==='en'?'en':'vi';
    var values=[];
    Array.prototype.forEach.call(form.querySelectorAll('input,select,textarea'),function(el){
      var value=(el.value||'').trim();if(!value)return;
      var key=el.getAttribute('placeholder')||el.getAttribute('aria-label')||el.name||el.id||'Field';
      values.push(key+': '+value);
    });
    var subj='Crown — '+purpose;
    var body=values.join('\\n')+'\\n\\nSent from '+SOURCE_SITE;
    window.location.href='mailto:info@crown.com.vn?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(body);
  }
  function isConsultationForm(form){
    if(form.id==='contactForm'||form.id==='tuvanForm')return true;
    return form.getAttribute('data-mail-purpose')==='consultation';
  }
  function onSubmit(ev){
    var form=ev.currentTarget;
    if(isConsultationForm(form)){
      ev.preventDefault();
      if(!window.CrownConsultationLeads)return;
      var lang=(document.documentElement.lang||'vi').slice(0,2)==='en'?'en':'vi';
      window.CrownConsultationLeads.submitFromForm(form,{sourceSite:SOURCE_SITE,lang:lang});
      return;
    }
    if(form.hasAttribute('data-mail-purpose')){
      ev.preventDefault();
      if(form.reportValidity&&!form.reportValidity())return;
      mailPurpose(form);
    }
  }
  var selector='#tuvanForm,form[data-mail-purpose]';
  document.querySelectorAll(selector).forEach(function(form){
    form.removeAttribute('onsubmit');
    form.addEventListener('submit',onSubmit);
  });
});
})();</script>`;
}

/**
 * @param {string} html
 * @param {string} domain
 */
function patchHtml(html, domain) {
  let out = html;

  out = out.replace(
    /<script src="\/assets\/consultation-leads-client\.js" defer><\/script>/g,
    CLIENT_TAG
  );

  for (const id of MAIL_SCRIPT_IDS) {
    const re = new RegExp(
      `<script id="${id}">[\\s\\S]*?<\\/script>\\n?`,
      "g"
    );
    out = out.replace(re, "");
  }

  out = out.replace(
    /<form([^>]*)\sid="tuvanForm"[^>]*onsubmit="[^"]*"([^>]*)>/gi,
    '<form$1 id="tuvanForm" data-source-site="' + domain + '"$2>'
  );
  out = out.replace(
    /<form([^>]*)\sid="tuvanForm"(?![^>]*data-source-site)([^>]*)>/gi,
    '<form$1 id="tuvanForm" data-source-site="' + domain + '"$2>'
  );

  if (!out.includes("consultation-leads-client.js")) {
    out = out.replace("</body>", `${CLIENT_TAG}\n${siteContactFormsScript(domain)}\n</body>`);
  } else if (!out.includes('id="crown-site-contact-forms"')) {
    out = out.replace("</body>", `${siteContactFormsScript(domain)}\n</body>`);
  } else {
    out = out.replace(
      /<script id="crown-site-contact-forms">[\s\S]*?<\/script>\n?/,
      siteContactFormsScript(domain) + "\n"
    );
  }

  out = out.replace(
    /async function crownComposeEnquiry\(form\)\{[\s\S]*?\n\}/,
    `async function crownComposeEnquiry(form){
  if (!window.CrownConsultationLeads) {
    alert('Consultation form is loading. Please try again.');
    return;
  }
  const lang = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : (document.documentElement.lang || 'vi');
  await window.CrownConsultationLeads.submitFromForm(form, { sourceSite: 'crown.com.vn', lang: lang });
}`
  );

  out = out.replace(
    /\/\/ Crown Up uses email-based intake[\s\S]*?window\.location\.href = 'mailto:[^']+';\s*\}\);\s*\}\s*\n/g,
    ""
  );
  out = out.replace(
    /<script src="\/assets\/consultation-leads-client\.js" defer><\/script>/g,
    CLIENT_TAG
  );

  return out;
}

/** @param {string} dir */
function indexHtmlFiles(dir) {
  /** @type {string[]} */
  const files = [];
  if (!existsSync(dir)) return files;
  const rootIdx = join(dir, "index.html");
  if (existsSync(rootIdx)) files.push(rootIdx);
  for (const sub of ["en", "vi"]) {
    const p = join(dir, sub, "index.html");
    if (existsSync(p)) files.push(p);
  }
  return files;
}

function syncClientAssets() {
  let copied = 0;
  for (const site of sites) {
    const assetsDir = resolve(root, "sites", site.folder, "assets");
    if (!existsSync(assetsDir)) mkdirSync(assetsDir, { recursive: true });
    const dest = join(assetsDir, "consultation-leads-client.js");
    if (writeTextIfChanged(dest, clientJs)) copied += 1;
  }
  return copied;
}

function main() {
  const only = process.argv[2];
  const targetSites = only
    ? sites.filter((s) => s.folder === only)
  : sites;
  if (only && !targetSites.length) {
    console.error(`Unknown site folder: ${only}`);
    process.exit(1);
  }

  const assetsUpdated = syncClientAssets();
  let htmlUpdated = 0;

  for (const site of targetSites) {
    const siteDir = resolve(root, "sites", site.folder);
    for (const file of indexHtmlFiles(siteDir)) {
      const before = readFileSync(file, "utf8");
      if (!before.includes("tuvanForm") && !before.includes("contactForm") && !before.includes("data-mail-purpose")) {
        continue;
      }
      const after = patchHtml(before, site.domain);
      if (writeTextIfChanged(file, after)) htmlUpdated += 1;
    }
  }

  const enquiryUpdated = patchEnquiryModals(only);

  console.log(
    `consultation-leads sync: ${assetsUpdated} asset file(s), ${htmlUpdated} HTML file(s), ${enquiryUpdated} enquiry modal(s) updated`
  );
}

main();