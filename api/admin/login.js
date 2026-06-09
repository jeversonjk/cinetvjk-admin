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
