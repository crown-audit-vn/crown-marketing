#!/usr/bin/env node
import { deploySite } from "./deploy-site.mjs";
import { prepareDeploy } from "./prepare-deploy.mjs";
import { runCheckLocalCli } from "./seo/check-local.mjs";
import { runCheckLiveCli } from "./seo/check-live.mjs";
import { sites } from "./sites.mjs";

const prod = !process.argv.includes("--preview");
const fastPrepare = process.argv.includes("--fast");
const skipLiveCheck = process.argv.includes("--skip-live-check");

console.log(
  prod
    ? "Deploy tất cả site lên production (lần lượt)…\n"
    : "Deploy tất cả site (preview)…\n"
);

const prep = prepareDeploy("all", { fast: fastPrepare });
if (prep !== 0) {
  process.exit(prep);
}

const localSeo = runCheckLocalCli("all");
if (localSeo !== 0) {
  console.error("\nDừng: SEO local chưa pass — sửa trước khi deploy.\n");
  process.exit(localSeo);
}

for (const s of sites) {
  console.log(`\n${"=".repeat(60)}`);
  const code = await deploySite(s.folder, {
    prod,
    skipPrepare: true,
    skipLiveCheck: true,
  });
  if (code !== 0) {
    console.error(`\nDừng: deploy ${s.folder} thất bại (exit ${code}).`);
    process.exit(code);
  }
}

console.log(`\n${"=".repeat(60)}\nXong — đã deploy ${sites.length} site.`);

if (prod && !skipLiveCheck) {
  const live = await runCheckLiveCli({ retries: 3, delayMs: 5000 });
  process.exit(live);
}

if (prod && skipLiveCheck) {
  console.log(
    "\n(Bỏ qua kiểm tra production — đã dùng --skip-live-check.)\n"
  );
}
