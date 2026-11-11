#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { siteByFolder, sites } from "./sites.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

/**
 * @param {string} folder
 * @param {{ prod?: boolean }} options
 * @returns {number} exit code
 */
export function deploySite(folder, { prod = true } = {}) {
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

  const result = spawnSync(vercelBin, args, {
    cwd: siteDir,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });

  return result.status ?? 1;
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const folder = process.argv[2];
  const prod = !process.argv.includes("--preview");

  if (!folder) {
    console.error("Usage: node scripts/deploy-site.mjs <folder> [--preview]");
    process.exit(1);
  }

  process.exit(deploySite(folder, { prod }));
}
