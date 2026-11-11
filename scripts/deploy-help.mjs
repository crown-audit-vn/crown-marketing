#!/usr/bin/env node
import { sites } from "./sites.mjs";

console.log("Crown marketing — deploy Vercel\n");
console.log("Lần đầu (mỗi site, một lần):");
console.log("  cd sites/<folder> && npx vercel link");
console.log("  → chọn Vercel project có Root Directory = sites/<folder>\n");
console.log("Đăng nhập CLI (nếu cần): npx vercel login\n");
console.log("Deploy một site:   npm run deploy:<folder>");
console.log("Deploy tất cả:     npm run deploy:all");
console.log("Preview (không prod): npm run deploy:<folder> -- --preview\n");
console.log("Site        Lệnh deploy              Production");
console.log("─".repeat(56));
for (const s of sites) {
  const pad = (str, n) => String(str).padEnd(n);
  console.log(
    `${pad(s.folder, 10)} ${pad(`npm run deploy:${s.folder}`, 24)} ${s.domain}`
  );
}
