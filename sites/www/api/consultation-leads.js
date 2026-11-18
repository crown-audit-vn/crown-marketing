/**
 * Proxy: www form → backend POST /api/public/consultation-leads
 * Env: CONSULTATION_LEADS_API_URL, CONSULTATION_LEADS_API_TOKEN (Vercel / .env)
 */
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const baseUrl = process.env.CONSULTATION_LEADS_API_URL;
  const token = process.env.CONSULTATION_LEADS_API_TOKEN;

  if (!baseUrl || !token) {
    return res.status(503).json({
      error: "Consultation API is not configured",
    });
  }

  const body = req.body;
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const { fullName, phone, email } = body;
  if (!fullName || !phone || !email) {
    return res.status(400).json({
      error: "fullName, phone, and email are required",
    });
  }

  const upstream = `${String(baseUrl).replace(/\/$/, "")}/api/public/consultation-leads`;

  try {
    const upstreamRes = await fetch(upstream, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const text = await upstreamRes.text();
    let payload;
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = { message: text || upstreamRes.statusText };
    }

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).json(payload);
    }

    return res.status(upstreamRes.status).json(payload);
  } catch (err) {
    console.error("consultation-leads proxy error:", err);
    return res.status(502).json({ error: "Upstream consultation API unavailable" });
  }
};