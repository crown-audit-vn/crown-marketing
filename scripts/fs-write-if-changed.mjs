import { existsSync, readFileSync, writeFileSync } from "node:fs";

/**
 * @param {string} filePath
 * @param {string} content
 * @returns {boolean} true if file was written
 */
export function writeTextIfChanged(filePath, content) {
  if (existsSync(filePath) && readFileSync(filePath, "utf8") === content) {
    return false;
  }
  writeFileSync(filePath, content, "utf8");
  return true;
}