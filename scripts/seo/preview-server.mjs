#!/usr/bin/env node
/**
 * Static file server that applies vercel.json redirects, cleanUrls, and
 * trailingSlash:false — for local SEO verification without `vercel dev`.
 *
 * Usage: node scripts/seo/preview-server.mjs <folder> <port>
 */
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { siteByFolder } from "../sites.mjs";
import { resolveRedirect } from "./legacy-redirects.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

/**
 * @param {string} folder
 * @param {number} port
 */
export function startPreviewServer(folder, port) {
  const meta = siteByFolder.get(folder);
  if (!meta) throw new Error(`Unknown site: ${folder}`);
  const siteDir = resolve(root, "sites", folder);
  const vercel = JSON.parse(readFileSync(join(siteDir, "vercel.json"), "utf8"));
  const rules = vercel.redirects ?? [];

  const server = createServer((req, res) => {
    const host = req.headers.host || `${meta.domain}`;
    const url = new URL(req.url ?? "/", `http://${host}`);
    let pathname = decodeURIComponent(url.pathname);

    const redirected = resolveRedirect(rules, pathname, url.searchParams);
    if (redirected) {
      const dest = redirected.destination;
      const isAbsolute = /^https?:\/\//i.test(dest);
      let location = dest;
      if (!isAbsolute) {
        const destUrl = new URL(dest, url);
        const keep = new URLSearchParams(url.searchParams);
        keep.delete("lang");
        const kept = keep.toString();
        if (kept && !destUrl.search) destUrl.search = kept;
        location = destUrl.pathname + destUrl.search + destUrl.hash;
      }
      res.writeHead(redirected.status, { Location: location });
      res.end();
      return;
    }

    if (pathname.length > 1 && pathname.endsWith("/")) {
      const dest = pathname.replace(/\/+$/, "") + url.search + url.hash;
      res.writeHead(308, { Location: dest || "/" });
      res.end();
      return;
    }

    const rel = pathname === "/" ? "" : pathname.replace(/^\//, "");
    const safe = normalize(rel).replace(/^(\.\.[/\\])+/, "");
    const candidates = [];
    if (safe && extname(safe)) candidates.push(join(siteDir, safe));
    if (!extname(safe)) {
      if (safe) candidates.push(join(siteDir, safe, "index.html"));
      else candidates.push(join(siteDir, "index.html"));
      if (safe) candidates.push(join(siteDir, `${safe}.html`));
    }

    const file = candidates.find((p) => existsSync(p) && statSync(p).isFile());
    if (!file) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const type = TYPES[extname(file).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "content-type": type });
    res.end(readFileSync(file));
  });

  return new Promise((resolveStart) => {
    server.listen(port, "127.0.0.1", () => resolveStart(server));
  });
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const folder = process.argv[2];
  const port = Number(process.argv[3]);
  if (!folder || !port) {
    console.error("Usage: node scripts/seo/preview-server.mjs <folder> <port>");
    process.exit(1);
  }
  const server = await startPreviewServer(folder, port);
  console.log(`preview ${folder} http://127.0.0.1:${port}`);
  const shutdown = () => {
    server.close(() => process.exit(0));
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
