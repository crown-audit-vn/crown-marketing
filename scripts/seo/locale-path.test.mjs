#!/usr/bin/env node
import {
  localePath,
  redirectLangQuery,
  logicalPath,
  primaryLangByFolder,
  redirectRetiredEnPrefix,
} from "./locale-path.mjs";
import { rewriteOneHref } from "./rewrite-crown-links.mjs";

/** @type {string[]} */
const fails = [];
function eq(name, got, expected) {
  if (got !== expected) fails.push(`${name}: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`);
}

eq("www /about + en", localePath("/about", "en", "en"), "/about");
eq("www /about + vi", localePath("/about", "vi", "en"), "/vi/about");
eq("www / + vi", localePath("/", "vi", "en"), "/vi");
eq("www /vi + en", localePath("/vi", "en", "en"), "/");
eq("www /en/about + en", localePath("/en/about", "en", "en"), "/about");
eq("www /en/about + vi", localePath("/en/about", "vi", "en"), "/vi/about");
eq("www /vi/about + vi", localePath("/vi/about", "vi", "en"), "/vi/about");
eq("logical leftover /en/insights/x", logicalPath("/en/insights/x", "en"), "/insights/x");
eq("logical /vi/insights/x", logicalPath("/vi/insights/x", "en"), "/insights/x");

eq("redirect /?lang=vi", redirectLangQuery("/", "vi", "en"), "/vi");
eq("redirect /?lang=en", redirectLangQuery("/", "en", "en"), "/");
eq("redirect /en?lang=en", redirectLangQuery("/en", "en", "en"), "/");
eq("redirect /en/about?lang=vi", redirectLangQuery("/en/about", "vi", "en"), "/vi/about");
eq("redirect /vi?lang=en", redirectLangQuery("/vi", "en", "en"), "/");
eq("no redirect zh", redirectLangQuery("/", "zh", "en"), null);
eq("retired /en", redirectRetiredEnPrefix("/en"), "/");
eq("retired /en/about", redirectRetiredEnPrefix("/en/about"), "/about");
eq("retired not /vi", redirectRetiredEnPrefix("/vi"), null);

eq("www primary", primaryLangByFolder.www, "en");
eq("acc primary", primaryLangByFolder.acc, "en");
eq("fas primary", primaryLangByFolder.fas, "en");

eq(
  "svc en keeps subdomain",
  rewriteOneHref("https://acc.crown.com.vn", "en", "crown.com.vn"),
  "https://acc.crown.com.vn/"
);
eq(
  "svc vi keeps subdomain + /vi",
  rewriteOneHref("https://acc.crown.com.vn", "vi", "crown.com.vn"),
  "https://acc.crown.com.vn/vi"
);
eq(
  "svc fas en from leftover /en",
  rewriteOneHref("https://fas.crown.com.vn/en", "en", "crown.com.vn"),
  "https://fas.crown.com.vn/"
);
eq(
  "internal /about on vi page",
  rewriteOneHref("/about", "vi", "crown.com.vn"),
  "/vi/about"
);
eq(
  "internal leftover /en/career on en page",
  rewriteOneHref("/en/career", "en", "crown.com.vn"),
  "/career"
);
eq(
  "hash only stays",
  rewriteOneHref("#services", "vi", "crown.com.vn"),
  "#services"
);
eq(
  "root hash on vi",
  rewriteOneHref("/#services", "vi", "crown.com.vn"),
  "/vi#services"
);
eq(
  "www logo on acc vi",
  rewriteOneHref("https://crown.com.vn/", "vi", "acc.crown.com.vn"),
  "https://crown.com.vn/vi"
);

if (fails.length) {
  console.error(fails.join("\n"));
  process.exit(1);
}
console.log("locale-path tests PASS");
