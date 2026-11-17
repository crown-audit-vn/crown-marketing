#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prepareDeploy } from "./prepare-deploy.mjs";
import { runCheckLocalCli } from "./seo/check-local.mjs";
import { runCheckLiveCli } from "./seo/check-live.mjs";
import { siteByFolder, sites } from "./sites.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

/**
 * @param {string} folder
 * @param {{ prod?: boolean; skipPrepare?: boolean; fastPrepare?: boolean; skipLiveCheck?: boolean }} options
 * @returns {Promise<number>} exit code
 */
export async function deploySite(
  folder,
  { prod = true, skipPrepare = false, fastPrepare = false, skipLiveCheck = false } = {}
) {
  const meta = siteByFolder.get(folder);
  if (!meta) {
    console.error(`Site không hợp lệ: "${folder}".`);
    console.error(`Các site: ${sites.map((s) => s.folder).join(", ")}`);
    return 1;
  }

  const siteDir = resolve(root, "sites", folder);
  if (!existsSync(resolve(siteDir, "index.html"))) {
    console.error(`Không tìm thấy sites/${folder}/index.html`);
    return 1;
  }

  if (!skipPrepare) {
    const prep = prepareDeploy(folder, { fast: fastPrepare });
    if (prep !== 0) {
      return prep;
    }
    const localSeo = runCheckLocalCli(folder);
    if (localSeo !== 0) {
      return localSeo;
    }
  }

  const vercelLink = resolve(siteDir, ".vercel", "project.json");
  if (!existsSync(vercelLink)) {
    console.warn(
      `Chưa link Vercel cho sites/${folder}. Chạy một lần:\n` +
        `  cd sites/${folder} && npx vercel link\n` +
        `(chọn đúng Vercel project có Root Directory = sites/${folder})\n`
    );
  }

  const vercelBin = resolve(
    root,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "vercel.cmd" : "vercel"
  );

  const args = ["deploy", "--yes"];
  if (prod) args.push("--prod");

  console.log(
    `Deploy ${meta.folder} → ${meta.domain} (${prod ? "production" : "preview"})…\n`
  );

  const env = { ...process.env };
  const hadBadToken = Boolean(env.VERCEL_TOKEN || env.VERCEL_ACCESS_TOKEN);
  delete env.VERCEL_TOKEN;
  delete env.VERCEL_ACCESS_TOKEN;
  for (const key of Object.keys(env)) {
    if (/^VERCEL_.*TOKEN$/i.test(key)) delete env[key];
  }
  if (hadBadToken) {
    console.warn(
      "Đã bỏ VERCEL_TOKEN trong môi trường — dùng session `vercel login`.\n"
    );
  }

  const result = spawnSync(vercelBin, args, {
    cwd: siteDir,
    stdio: "inherit",
    shell: process.platform === "win32",
    env,
  });

  const deployCode = result.status ?? 1;
  if (deployCode !== 0) {
    return deployCode;
  }

  if (prod && !skipLiveCheck) {
    return runCheckLiveCli({ folders: [folder], retries: 3, delayMs: 5000 });
  }

  return 0;
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const folder = process.argv[2];
  const prod = !process.argv.includes("--preview");
  const fastPrepare = process.argv.includes("--fast");
  const skipLiveCheck = process.argv.includes("--skip-live-check");

  if (!folder) {
    console.error(
      "Usage: node scripts/deploy-site.mjs <folder> [--preview] [--fast] [--skip-live-check]"
    );
    process.exit(1);
  }

  deploySite(folder, { prod, fastPrepare, skipLiveCheck }).then((code) =>
    process.exit(code)
  );
}
