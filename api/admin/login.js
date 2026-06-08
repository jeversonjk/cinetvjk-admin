// /api/admin/login.js — Vercel Serverless Function
module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { password } = req.body || {};
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || "cinetv2024";

  if (!password || password !== ADMIN_PASS) {
    return res.status(401).json({ error: "Senha inválida" });
  }

  const token = Buffer.from("admin:" + Date.now() + ":cinetv").toString("base64");
  return res.status(200).json({ token });
};
