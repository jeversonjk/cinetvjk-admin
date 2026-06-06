// /api/admin/change-password.js — Vercel Serverless Function
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  // Nota: para alterar senha permanentemente, configure ADMIN_PASSWORD nas
  // variáveis de ambiente da Vercel (Settings → Environment Variables)
  return res.status(200).json({ message: "Para alterar a senha, atualize ADMIN_PASSWORD nas variáveis de ambiente da Vercel." });
}
