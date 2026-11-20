#!/usr/bin/env node
import {
  localePath,
  redirectLangQuery,
  logicalPath,
  primaryLangByFolder,
} from "./locale-path.mjs";

/** @type {string[]} */
const fails = [];
function eq(name, got, expected) {
  if (got !== expected) fails.push(`${name}: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`);
}

eq("www /about + en", localePath("/about", "en", "vi"), "/en/about");
eq("www /en/about + vi", localePath("/en/about", "vi", "vi"), "/about");
eq("www / + en", localePath("/", "en", "vi"), "/en");
eq("www /en + vi", localePath("/en", "vi", "vi"), "/");
eq("www /en + en", localePath("/en", "en", "vi"), "/en");
eq("acc /vi + en", localePath("/vi", "en", "en"), "/");
eq("acc / + vi", localePath("/", "vi", "en"), "/vi");
eq("logical /en/insights/x", logicalPath("/en/insights/x", "vi"), "/insights/x");

eq("redirect same path drops query", redirectLangQuery("/about", "vi", "vi"), "/about");
eq("redirect /?lang=en", redirectLangQuery("/", "en", "vi"), "/en");
eq("redirect /en?lang=en", redirectLangQuery("/en", "en", "vi"), "/en");
eq("no redirect zh", redirectLangQuery("/", "zh", "vi"), null);

eq("www primary", primaryLangByFolder.www, "vi");
eq("acc primary", primaryLangByFolder.acc, "en");

if (fails.length) {
  console.error(fails.join("\n"));
  process.exit(1);
}
console.log("locale-path tests PASS");
