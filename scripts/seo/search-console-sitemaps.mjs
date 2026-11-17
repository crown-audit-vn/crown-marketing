#!/usr/bin/env node
/**
 * In danh sách URL sitemap để gửi Google Search Console (mỗi property = một domain).
 */
import { sites } from "../sites.mjs";

console.log("# Gửi từng URL sau trong Search Console → Sitemaps\n");
for (const { folder, domain } of sites) {
  console.log(`${folder.padEnd(6)} https://${domain}/sitemap.xml`);
}
console.log(
  "\n# Mỗi subdomain là một Vercel project → tạo property riêng (URL-prefix hoặc domain)."
);