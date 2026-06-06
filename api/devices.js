// /api/devices.js — Vercel Serverless Function
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    return res.status(200).json([]);
  }
  if (req.method === "POST") {
    return res.status(201).json({ id: Date.now(), ...req.body });
  }
  return res.status(200).json({ success: true });
}
