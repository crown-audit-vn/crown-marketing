#!/usr/bin/env node
import { sites } from "./sites.mjs";

console.log("Crown marketing — preview local\n");
console.log("Lần đầu: npm install");
console.log("Chạy một site:  npm run dev:<site>\n");
console.log("Site        Lệnh              URL local              Production");
console.log("─".repeat(72));
for (const s of sites) {
  const pad = (str, n) => String(str).padEnd(n);
  console.log(
    `${pad(s.folder, 10)} ${pad(`npm run dev:${s.folder}`, 20)} http://localhost:${s.port}   ${s.domain}`
  );
}
