#!/usr/bin/env node
/**
 * Copy the self-contained Edge Middleware into each site project root.
 * Run: node scripts/seo/write-middleware.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeTextIfChanged } from "../fs-write-if-changed.mjs";
import { sites } from "../sites.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");
const source = readFileSync(join(__dirname, "middleware-source.js"), "utf8");

const arg = process.argv[2] ?? "all";
const targets = arg === "all" ? sites.map((s) => s.folder) : [arg];

for (const folder of targets) {
  const dest = join(root, "sites", folder, "middleware.js");
  writeTextIfChanged(dest, source);
  console.log(`[${folder}] wrote middleware.js`);
}
