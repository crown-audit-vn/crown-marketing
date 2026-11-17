#!/usr/bin/env node
/**
 * Submit sitemap.xml of each Crown site to Google Search Console.
 *
 *   npm run seo:gsc -- --dry-run   # print sitemap URLs only (no API)
 *   npm run seo:gsc                # submit + print lastSubmitted / isPending / errors
 *
 * Credentials: GSC_SERVICE_ACCOUNT_KEY or GOOGLE_APPLICATION_CREDENTIALS,
 * defaulting to .secrets/gsc-service-account.json (repo root).
 *
 * Override a property: --property www=sc-domain:crown.com.vn
 * or env GSC_PROPERTY_WWW / GSC_PROPERTY_AUDIT / ...
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { google } from "googleapis";
import { sites } from "../sites.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");
const SCOPE = "https://www.googleapis.com/auth/webmasters";
const DEFAULT_KEY_REL = ".secrets/gsc-service-account.json";

/**
 * @param {string[]} argv
 * @returns {{ dryRun: boolean, overrides: Map<string, string> }}
 */
function parseArgs(argv) {
  const overrides = new Map();
  let dryRun = false;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    let body = null;
    if (arg.startsWith("--property=")) {
      body = arg.slice("--property=".length);
    } else if (arg === "--property") {
      body = argv[++i];
    }
    if (body == null) continue;
    const eq = body.indexOf("=");
    if (eq <= 0) {
      console.error(
        `Flag --property không hợp lệ: "${body}". Dùng --property <folder>=<siteUrl>`
      );
      process.exit(2);
    }
    overrides.set(body.slice(0, eq).trim().toLowerCase(), body.slice(eq + 1).trim());
  }
  return { dryRun, overrides };
}

function resolveKeyPath() {
  const raw =
    process.env.GSC_SERVICE_ACCOUNT_KEY ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    DEFAULT_KEY_REL;
  return isAbsolute(raw) ? raw : resolve(root, raw);
}

function envOverride(folder) {
  const key = `GSC_PROPERTY_${folder.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
  const value = process.env[key];
  return value && value.trim() ? value.trim() : null;
}

function sitemapUrl(domain) {
  return `https://${domain}/sitemap.xml`;
}

function prefixProperty(domain) {
  return `https://${domain}/`;
}

function normalizeSiteUrl(siteUrl) {
  return String(siteUrl || "").trim();
}

/**
 * Prefer exact URL-prefix, then exact sc-domain:<host>, then the most
 * specific sc-domain that covers the host (e.g. sc-domain:crown.com.vn
 * covers audit.crown.com.vn).
 * @param {string} domain
 * @param {string[]} listed
 * @returns {string | null}
 */
function pickProperty(domain, listed) {
  const host = domain.toLowerCase();
  const prefix = prefixProperty(host);
  const exactPrefix = listed.find((s) => {
    const n = normalizeSiteUrl(s).replace(/\/+$/, "") + "/";
    return n.toLowerCase() === prefix;
  });
  if (exactPrefix) return exactPrefix;

  const exactDomain = listed.find(
    (s) => normalizeSiteUrl(s).toLowerCase() === `sc-domain:${host}`
  );
  if (exactDomain) return exactDomain;

  const covers = listed
    .map((raw) => ({ raw, n: normalizeSiteUrl(raw).toLowerCase() }))
    .filter(({ n }) => n.startsWith("sc-domain:"))
    .map(({ raw, n }) => ({ raw, host: n.slice("sc-domain:".length) }))
    .filter(
      ({ host: apex }) => apex && (host === apex || host.endsWith(`.${apex}`))
    )
    .sort((a, b) => b.host.length - a.host.length);
  return covers[0]?.raw ?? null;
}

function readServiceAccount(keyPath) {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(keyPath, "utf8"));
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    throw Object.assign(new Error(`Không đọc được file key JSON: ${reason}`), {
      code: "INVALID_KEY",
    });
  }
  if (!parsed.client_email) {
    throw Object.assign(
      new Error("File key thiếu trường client_email — không phải service account JSON hợp lệ."),
      { code: "INVALID_KEY" }
    );
  }
  return parsed;
}

function googleErrorInfo(err) {
  const data = err?.response?.data?.error || err?.errors || null;
  const status = err?.response?.status || err?.code || err?.status;
  const reason =
    data?.errors?.[0]?.reason ||
    (Array.isArray(err?.errors) ? err.errors[0]?.reason : undefined) ||
    data?.status ||
    "";
  const message =
    data?.message ||
    (Array.isArray(err?.errors) ? err.errors[0]?.message : undefined) ||
    err?.message ||
    String(err);
  return { status, reason: String(reason), message: String(message) };
}

function isApiNotEnabled({ status, reason, message }) {
  const blob = `${reason} ${message}`.toLowerCase();
  return (
    reason === "accessNotConfigured" ||
    blob.includes("has not been used in project") ||
    blob.includes("is disabled") ||
    blob.includes("api has not been enabled") ||
    (Number(status) === 403 && blob.includes("search console api"))
  );
}

function pad(value, width) {
  const s = value == null ? "" : String(value);
  return s.length >= width ? s : s + " ".repeat(width - s.length);
}

function printDryRun() {
  console.log("# Gửi từng URL sau trong Search Console → Sitemaps\n");
  for (const { folder, domain } of sites) {
    console.log(`${folder.padEnd(6)} ${sitemapUrl(domain)}`);
  }
  console.log(
    "\n# Mỗi subdomain là một Vercel project → tạo property riêng (URL-prefix hoặc domain)."
  );
  console.log("# dry-run — không gọi API, không submit.");
}

function printMissingKey(keyPath) {
  console.error("Không tìm thấy service account key cho Google Search Console.");
  console.error(`  Đường dẫn đã tìm: ${keyPath}`);
  console.error("  Đặt file mặc định tại .secrets/gsc-service-account.json");
  console.error(
    "  hoặc trỏ GSC_SERVICE_ACCOUNT_KEY / GOOGLE_APPLICATION_CREDENTIALS tới file JSON."
  );
  console.error(
    "  Trong Search Console, thêm client_email của service account làm user cho từng property."
  );
}

async function main() {
  const { dryRun, overrides } = parseArgs(process.argv.slice(2));
  if (dryRun) {
    printDryRun();
    return 0;
  }

  const keyPath = resolveKeyPath();
  if (!existsSync(keyPath)) {
    printMissingKey(keyPath);
    return 1;
  }

  let account;
  try {
    account = readServiceAccount(keyPath);
  } catch (err) {
    console.error(err.message);
    console.error(`  File: ${keyPath}`);
    return 1;
  }

  const email = account.client_email;
  const projectId = account.project_id || "(unknown)";
  console.log(`Đăng nhập Search Console với service account: ${email}`);
  console.log(`Key: ${keyPath}\n`);

  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: [SCOPE],
  });
  const webmasters = google.webmasters({ version: "v3", auth });

  let listed = [];
  try {
    const res = await webmasters.sites.list();
    listed = (res.data.siteEntry || [])
      .map((e) => e.siteUrl)
      .filter(Boolean);
  } catch (err) {
    const info = googleErrorInfo(err);
    if (isApiNotEnabled(info)) {
      console.error("Google Search Console API chưa được bật cho project Google Cloud này.");
      console.error(`  project_id: ${projectId}`);
      console.error(`  service account: ${email}`);
      console.error(
        `  Bật API: https://console.developers.google.com/apis/api/searchconsole.googleapis.com/overview?project=${encodeURIComponent(projectId)}`
      );
      console.error(`  Chi tiết: ${info.message}`);
      return 1;
    }
    console.error(`Không liệt kê được property (sites.list): ${info.message}`);
    console.error(`  service account: ${email}`);
    return 1;
  }

  if (listed.length === 0) {
    console.error("Service account chưa được cấp quyền property nào trên Search Console.");
    console.error(`  service account: ${email}`);
    console.error(
      "  Thêm email này làm user (Owner hoặc Full) cho từng property URL-prefix hoặc sc-domain."
    );
    return 1;
  }

  console.log("Property service account truy cập được:");
  for (const url of listed) console.log(`  - ${url}`);
  console.log("");

  const rows = [];
  let failed = 0;

  for (const { folder, domain } of sites) {
    const feedpath = sitemapUrl(domain);
    const override = overrides.get(folder) || envOverride(folder);
    let property = override || pickProperty(domain, listed);
    const row = {
      folder,
      domain,
      property: property || "—",
      status: "",
      lastSubmitted: "—",
      pending: "—",
      errors: "—",
      warnings: "—",
      detail: "",
    };

    if (override && !listed.some((s) => normalizeSiteUrl(s) === normalizeSiteUrl(override))) {
      row.status = "ERROR";
      row.detail = `property ghi đè "${override}" không nằm trong danh sách service account truy cập được. Thêm ${email} làm user của property đó.`;
      failed += 1;
      rows.push(row);
      continue;
    }

    if (!property) {
      row.status = "ERROR";
      row.detail = `Không có property khớp với ${domain} (cần ${prefixProperty(domain)} hoặc sc-domain phủ host này). Thêm ${email} làm user trên property đó trong Search Console.`;
      failed += 1;
      rows.push(row);
      continue;
    }

    row.property = property;

    try {
      await webmasters.sitemaps.submit({ siteUrl: property, feedpath });
    } catch (err) {
      const info = googleErrorInfo(err);
      if (isApiNotEnabled(info)) {
        console.error("Google Search Console API chưa được bật cho project Google Cloud này.");
        console.error(`  project_id: ${projectId}`);
        console.error(`  service account: ${email}`);
        console.error(
          `  Bật API: https://console.developers.google.com/apis/api/searchconsole.googleapis.com/overview?project=${encodeURIComponent(projectId)}`
        );
        console.error(`  Chi tiết: ${info.message}`);
        return 1;
      }
      row.status = "ERROR";
      row.detail = `submit thất bại: ${info.message}`;
      if (Number(info.status) === 403 || /forbidden|permission/i.test(info.message)) {
        row.detail += ` — kiểm tra ${email} đã được thêm vào property ${property}.`;
      }
      failed += 1;
      rows.push(row);
      continue;
    }

    try {
      const got = await webmasters.sitemaps.get({ siteUrl: property, feedpath });
      const data = got.data || {};
      row.status = "OK";
      row.lastSubmitted = data.lastSubmitted || "—";
      row.pending = data.isPending === true ? "yes" : data.isPending === false ? "no" : "—";
      row.errors = data.errors == null ? "—" : String(data.errors);
      row.warnings = data.warnings == null ? "—" : String(data.warnings);
    } catch (err) {
      const info = googleErrorInfo(err);
      row.status = "ERROR";
      row.detail = `submit xong nhưng sitemaps.get thất bại: ${info.message}`;
      failed += 1;
    }

    rows.push(row);
  }

  const cols = [
    ["folder", 6],
    ["domain", 22],
    ["property", 32],
    ["status", 6],
    ["lastSubmitted", 24],
    ["pending", 7],
    ["errors", 6],
    ["warnings", 8],
  ];
  const header = cols.map(([k, w]) => pad(k, w)).join("  ");
  console.log(header);
  console.log("-".repeat(header.length));
  for (const row of rows) {
    console.log(cols.map(([k, w]) => pad(row[k], w)).join("  "));
    if (row.detail) console.log(`  → ${row.detail}`);
  }

  if (failed > 0) {
    console.error(`\nThất bại ${failed}/${rows.length} site. service account: ${email}`);
    return 1;
  }

  console.log(`\nĐã submit sitemap cho ${rows.length} site.`);
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(err?.stack || err);
    process.exit(1);
  });
