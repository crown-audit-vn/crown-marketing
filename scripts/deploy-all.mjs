#!/usr/bin/env node
import { deploySite } from "./deploy-site.mjs";
import { prepareDeploy } from "./prepare-deploy.mjs";
import { sites } from "./sites.mjs";

const prod = !process.argv.includes("--preview");
const fastPrepare = process.argv.includes("--fast");

console.log(
  prod
    ? "Deploy tất cả site lên production (lần lượt)…\n"
    : "Deploy tất cả site (preview)…\n"
);

const prep = prepareDeploy("all", { fast: fastPrepare });
if (prep !== 0) {
  process.exit(prep);
}

for (const s of sites) {
  console.log(`\n${"=".repeat(60)}`);
  const code = deploySite(s.folder, { prod, skipPrepare: true });
  if (code !== 0) {
    console.error(`\nDừng: deploy ${s.folder} thất bại (exit ${code}).`);
    process.exit(code);
  }
}

console.log(`\n${"=".repeat(60)}\nXong — đã deploy ${sites.length} site.`);
