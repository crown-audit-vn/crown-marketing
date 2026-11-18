#!/usr/bin/env node
/**
 * Local www dev: static files + Vercel-style /api/consultation-leads
 * (plain `serve` cannot run serverless routes → 404 on /api/*)
 */
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import serveHandler from "serve-handler";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const wwwDir = resolve(root, "sites", "www");
const PORT = Number(process.env.PORT) || 5000;

const require = createRequire(import.meta.url);
const consultationLeads = require(resolve(
  wwwDir,
  "api",
  "consultation-leads.js"
));

function loadDotEnv(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadDotEnv(resolve(root, ".env"));
loadDotEnv(resolve(wwwDir, ".env"));

function readJsonBody(req) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) {
        resolveBody({});
        return;
      }
      try {
        resolveBody(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function toVercelResponse(res) {
  let statusCode = 200;
  const headers = {};
  return {
    status(code) {
      statusCode = code;
      return this;
    },
    setHeader(name, value) {
      headers[name] = value;
      return this;
    },
    json(payload) {
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json; charset=utf-8";
      }
      const body = JSON.stringify(payload);
      res.writeHead(statusCode, headers);
      res.end(body);
    },
    end(body) {
      res.writeHead(statusCode, headers);
      res.end(body);
      return this;
    },
  };
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
  const path = decodeURIComponent(url.pathname);

  if (path === "/api/consultation-leads") {
    const vercelRes = toVercelResponse(res);

    if (req.method === "POST") {
      try {
        req.body = await readJsonBody(req);
      } catch {
        vercelRes.status(400).json({ error: "Invalid JSON body" });
        return;
      }
    }

    try {
      await consultationLeads(req, vercelRes);
    } catch (err) {
      console.error("consultation-leads handler error:", err);
      if (!res.writableEnded) {
        vercelRes.status(500).json({ error: "Internal server error" });
      }
    }
    return;
  }

  await serveHandler(req, res, {
    public: wwwDir,
    cleanUrls: true,
    trailingSlash: false,
  });
});

server.listen(PORT, () => {
  console.log(`www dev → http://localhost:${PORT}`);
  console.log("  static + POST /api/consultation-leads (loads .env from repo & sites/www)");
  console.log("  For full Vercel parity: npm run dev:www:vercel");
});