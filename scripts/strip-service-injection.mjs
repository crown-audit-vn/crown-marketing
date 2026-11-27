#!/usr/bin/env node
/**
 * Remove auto-injected service index blocks from site homepages (EN + VI).
 * Does not touch client body copy; only strips crown-svc-index CSS and nav/section.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeTextIfChanged } from "./fs-write-if-changed.mjs";
import { sites } from "./sites.mjs";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");

/**
 * @param {string} html
 * @returns {string}
 */
export function stripServiceInjection(html) {
  return html
    .replace(/<style id="crown-svc-index">[\s\S]*?<\/style>\s*/g, "")
    .replace(/<section class="svc-index-section"[^>]*>[\s\S]*?<\/section>\s*/g, "")
    .replace(/<nav class="svc-index"[\s\S]*?<\/nav>\s*/g, "");
}

let changed = 0;
for (const { folder } of sites) {
  for (const rel of ["index.html", join("vi", "index.html")]) {
    const file = join(root, "sites", folder, rel);
    if (!existsSync(file)) continue;
    const before = readFileSync(file, "utf8");
    const after = stripServiceInjection(before);
    if (after !== before) {
      writeTextIfChanged(file, after);
      console.log(`stripped: sites/${folder}/${rel.replace(/\\/g, "/")}`);
      changed += 1;
    }
  }
}
console.log(changed ? `done: ${changed} file(s)` : "done: no service index blocks found");