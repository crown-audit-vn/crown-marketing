#!/usr/bin/env node
import { resolveLocaleRedirect } from "./locale-redirect.mjs";

/** @type {string[]} */
const fails = [];

function loc(hostname, pathname, search = "") {
  const got = resolveLocaleRedirect({ hostname, pathname, search });
  return got ? got.location : null;
}

function eq(name, got, expected) {
  if (got !== expected) {
    fails.push(`${name}: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`);
  }
}

const audit = "audit.crown.com.vn";
const www = "crown.com.vn";
const wwwHost = "www.crown.com.vn";

eq("/?lang=en", loc(audit, "/", "?lang=en"), "/");
eq("/?lang=vi", loc(audit, "/", "?lang=vi"), "/vi");
eq("deep /about?lang=vi", loc(www, "/about", "?lang=vi"), "/vi/about");
eq("deep /about?lang=en", loc(www, "/about", "?lang=en"), "/about");
eq("/vi?lang=en", loc(audit, "/vi", "?lang=en"), "/");
eq("/vi/about?lang=en", loc(www, "/vi/about", "?lang=en"), "/about");
eq("/vi?lang=vi", loc(audit, "/vi", "?lang=vi"), "/vi");
eq("/en", loc(audit, "/en", ""), "/");
eq("/en/about", loc(www, "/en/about", ""), "/about");
eq("/en/about?lang=vi", loc(www, "/en/about", "?lang=vi"), "/vi/about");
eq("/en?lang=en", loc(audit, "/en", "?lang=en"), "/");
eq("preserve utm", loc(audit, "/", "?lang=en&utm_source=gsc"), "/?utm_source=gsc");
eq("no loop /", loc(audit, "/", ""), null);
eq("no loop /vi", loc(audit, "/vi", ""), null);
eq("no loop /about", loc(www, "/about", ""), null);
eq("unknown lang ignored", loc(audit, "/", "?lang=zh"), null);
eq("www host /", loc(wwwHost, "/", ""), "https://crown.com.vn/");
eq("www host /?lang=vi", loc(wwwHost, "/", "?lang=vi"), "https://crown.com.vn/vi");
eq("www host /en/about?lang=vi", loc(wwwHost, "/en/about", "?lang=vi"), "https://crown.com.vn/vi/about");
eq("legacy /tuyen-dung?lang=vi", loc(www, "/tuyen-dung", "?lang=vi"), "/vi/career");
eq("legacy /en/tuyen-dung", loc(www, "/en/tuyen-dung", ""), "/career");
eq("legacy /news?lang=en", loc(www, "/news", "?lang=en"), "/insights");
eq(
  "legacy tax advisory vi",
  loc(www, "/services/tax-advisory", "?lang=vi"),
  "https://tax.crown.com.vn/vi"
);
eq(
  "legacy /en/services/audit-assurance",
  loc(www, "/en/services/audit-assurance", ""),
  "https://audit.crown.com.vn/"
);
eq("trailing slash /vi/", loc(audit, "/vi/", "?lang=en"), "/");
eq("status 308", resolveLocaleRedirect({ hostname: audit, pathname: "/", search: "?lang=vi" })?.status, 308);

if (fails.length) {
  console.error(fails.join("\n"));
  process.exit(1);
}
console.log("locale-redirect tests PASS");
