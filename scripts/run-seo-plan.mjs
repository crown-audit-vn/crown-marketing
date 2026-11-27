#!/usr/bin/env node
/**
 * Apply the SEO improvement plan files already in the repo, in order.
 */
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const steps = [
  ["node", "scripts/seo/page-meta.mjs"],
  ["node", "scripts/seo/locale-path.test.mjs"],
  ["node", "scripts/seo/locale-redirect.test.mjs"],
  ["node", "scripts/seo/write-middleware.mjs"],
  ["node", "scripts/generate-service-pages.mjs"],
  ["node", "scripts/generate-insights.mjs"],
  ["node", "scripts/patch-locale-switcher.mjs"],
  ["node", "scripts/prerender-locale.mjs", "all"],
  ["node", "scripts/apply-seo.mjs", "all"],
  ["node", "scripts/seo/legacy-redirects.mjs"],
  ["node", "scripts/seo/check-local.mjs"],
];

let failed = false;
for (const [cmd, ...args] of steps) {
  console.log(`\n==== ${cmd} ${args.join(" ")} ====`);
  const r = spawnSync(cmd, args, { cwd: root, stdio: "inherit", shell: false });
  if (r.status !== 0) {
    console.error(`FAILED (${r.status}): ${cmd} ${args.join(" ")}`);
    failed = true;
    break;
  }
}
process.exit(failed ? 1 : 0);

