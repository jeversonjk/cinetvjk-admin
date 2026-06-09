// /api/admin/login.js — proxy para Edge Function
const https = require("https");

function post(url, body) {
  return new Promise((resolve, reject) =&gt; {
    const data = JSON.stringify(body);
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      port: 443,
      path: u.pathname + (u.search || ""),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data)
      }
    }, (res) =&gt; {
      let raw = "";
      res.on("data", (c) =&gt; raw += c);
      res.on("end", () =&gt; resolve({ status: res.statusCode, body: raw }));
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const result = await post(
      "https://ohjpkvrmbdcqnlcuiwxf.supabase.co/functions/v1/admin-api/api/admin/login",
      req.body || {}
    );
    const parsed = JSON.parse(result.body);
    return res.status(result.status).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao autenticar: " + err.message });
  }
};
// /api/admin/login.js — Vercel Serverless Function
const crypto = require("crypto");

module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { password } = req.body || {};
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || "cinetv2024";
  const JWT_SECRET = process.env.JWT_SECRET || "cinetv-admin-secret-2024";

  if (!password || password !== ADMIN_PASS) {
    return res.status(401).json({ error: "Senha inválida" });
  }

  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ role: "admin", iat: Date.now() })).toString("base64url");
  const sig = crypto.createHmac("sha256", JWT_SECRET).update(header + "." + payload).digest("base64url");
  const token = header + "." + payload + "." + sig;

  return res.status(200).json({ token });
};
