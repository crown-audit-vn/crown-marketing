/**
 * Optional git-based last-modified for insight HTML (falls back when not a git checkout).
 */
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

/**
 * @param {string} repoRoot
 * @param {string} absolutePath
 * @returns {string | null} YYYY-MM-DD
 */
export function gitLastModifiedDate(repoRoot, absolutePath) {
  try {
    const rel = absolutePath.startsWith(repoRoot)
      ? absolutePath.slice(repoRoot.length).replace(/^[/\\]+/, "").replace(/\\/g, "/")
      : absolutePath.replace(/\\/g, "/");
    const out = execFileSync(
      "git",
      ["log", "-1", "--format=%cs", "--", rel],
      {
        cwd: resolve(repoRoot),
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }
    ).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    return null;
  }
}

/**
 * @param {string | undefined | null} a YYYY-MM-DD
 * @param {string | undefined | null} b YYYY-MM-DD
 */
export function maxIsoDate(a, b) {
  if (!a) return b ?? undefined;
  if (!b) return a;
  return a >= b ? a : b;
}