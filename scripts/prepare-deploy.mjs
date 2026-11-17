#!/usr/bin/env node
/**
 * Pipeline trước deploy: brand → ảnh inline → locale prerender → SEO/sitemap/robots.
 *
 * Usage:
 *   node scripts/prepare-deploy.mjs           # all sites
 *   node scripts/prepare-deploy.mjs www       # one site
 *   node scripts/prepare-deploy.mjs all --fast  # chỉ locale + SEO (bỏ brand/ảnh)
 */
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { siteByFolder } from "./sites.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

/**
 * @param {string} scriptName filename under scripts/
 * @param {string[]} args
 * @returns {number}
 */
function runNodeScript(scriptName, args = []) {
  const script = resolve(__dirname, scriptName);
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    stdio: "inherit",
  });
  return result.status ?? 1;
}

/**
 * @param {string} label
 * @param {string} scriptName
 * @param {string[]} args
 * @returns {number} 0 on success
 */
function runStep(label, scriptName, args = []) {
  console.log(`\n${"─".repeat(60)}\n▶ ${label}\n`);
  const code = runNodeScript(scriptName, args);
  if (code !== 0) {
    console.error(`\n✗ ${label} thất bại (exit ${code}).`);
  }
  return code;
}

/**
 * @param {string} target site folder or "all"
 * @param {{ fast?: boolean }} options `--fast`: skip brand sync and image extract
 * @returns {number}
 */
export function prepareDeploy(target = "all", { fast = false } = {}) {
  if (target !== "all" && !siteByFolder.has(target)) {
    console.error(`Site không hợp lệ: "${target}".`);
    return 1;
  }

  const scope =
    target === "all" ? "tất cả site" : `sites/${target}`;
  console.log(
    fast
      ? `Chuẩn bị deploy (${scope}) — locale + SEO…`
      : `Chuẩn bị deploy (${scope}) — brand → ảnh → locale → SEO…`
  );

  if (!fast) {
    let code = runStep(
      "Đồng bộ logo / favicon / OG",
      "sync-brand-assets.mjs"
    );
    if (code !== 0) return code;

    const imageArg = target === "all" ? "all" : target;
    code = runStep("Tách ảnh inline (lossless)", "extract-data-uri-images.mjs", [
      imageArg,
    ]);
    if (code !== 0) return code;
  }

  let code = runStep("Prerender locale (/en, /vi)", "prerender-locale.mjs", [
    target,
  ]);
  if (code !== 0) return code;

  code = runStep("SEO + sitemap + robots", "apply-seo.mjs", [target]);
  if (code !== 0) return code;

  console.log(`\n${"═".repeat(60)}\n✓ Chuẩn bị xong — sẵn sàng deploy.\n`);
  return 0;
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const argv = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const target = argv[0] ?? "all";
  const fast = process.argv.includes("--fast");
  process.exit(prepareDeploy(target, { fast }));
}