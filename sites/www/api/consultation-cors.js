/**
 * CORS for central consultation proxy (subdomains → crown.com.vn/api/consultation-leads)
 */
const HTTPS_ORIGINS = new Set([
  "https://crown.com.vn",
  "https://audit.crown.com.vn",
  "https://cons.crown.com.vn",
  "https://acc.crown.com.vn",
  "https://tax.crown.com.vn",
  "https://fas.crown.com.vn",
  "https://esg.crown.com.vn",
  "https://up.crown.com.vn",
]);

const LOCAL_DEV_ORIGIN =
  /^http:\/\/(localhost|127\.0\.0\.1):(500[0-7]|[0-9]{2,5})$/;

/**
 * @param {string | undefined} origin
 * @returns {string | null} value for Access-Control-Allow-Origin
 */
function resolveConsultationCorsOrigin(origin) {
  if (!origin || typeof origin !== "string") return null;
  if (HTTPS_ORIGINS.has(origin)) return origin;
  if (LOCAL_DEV_ORIGIN.test(origin)) return origin;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return origin;
  return null;
}

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 * @returns {string | null}
 */
function applyConsultationCors(req, res) {
  const origin = req.headers.origin;
  const allowed = resolveConsultationCorsOrigin(origin);
  if (allowed) {
    res.setHeader("Access-Control-Allow-Origin", allowed);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");
  return allowed;
}

module.exports = {
  applyConsultationCors,
  resolveConsultationCorsOrigin,
};