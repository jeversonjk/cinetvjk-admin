// /api/admin/login.js — Vercel Serverless Function
const crypto = require("crypto");

function b64url(str) {
  return Buffer.from(str).toString("base64url");
}
function signToken(payload, secret) {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(payload));
  const message = `${header}.${body}`;
  const sig = crypto.createHmac("sha256", secret).update(message).digest();
  return `${message}.${Buffer.from(sig).toString("base64url")}`;
}

module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { password } = req.body || {};
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || "cinetv2024";
  const JWT_SECRET = process.env.JWT_SECRET || "cinetv-admin-secret-2024";

  if (password !== ADMIN_PASS) {
    return res.status(401).json({ error: "Senha inválida" });
  }
  const token = signToken({ role: "admin", iat: Date.now() }, JWT_SECRET);
  return res.status(200).json({ token });
};
