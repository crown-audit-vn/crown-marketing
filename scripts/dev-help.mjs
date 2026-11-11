#!/usr/bin/env node
const sites = [
  { script: "dev:www", port: 5000, folder: "www", domain: "crown.com.vn" },
  { script: "dev:audit", port: 5001, folder: "audit", domain: "audit.crown.com.vn" },
  { script: "dev:cons", port: 5002, folder: "cons", domain: "cons.crown.com.vn" },
  { script: "dev:acc", port: 5003, folder: "acc", domain: "acc.crown.com.vn" },
  { script: "dev:tax", port: 5004, folder: "tax", domain: "tax.crown.com.vn" },
  { script: "dev:fas", port: 5005, folder: "fas", domain: "fas.crown.com.vn" },
  { script: "dev:esg", port: 5006, folder: "esg", domain: "esg.crown.com.vn" },
];

console.log("Crown marketing — preview local\n");
console.log("Lần đầu: npm install");
console.log("Chạy một site:  npm run dev:<site>\n");
console.log("Site        Lệnh              URL local              Production");
console.log("─".repeat(72));
for (const s of sites) {
  const pad = (str, n) => String(str).padEnd(n);
  console.log(
    `${pad(s.folder, 10)} ${pad(`npm run ${s.script}`, 20)} http://localhost:${s.port}   ${s.domain}`
  );
}
