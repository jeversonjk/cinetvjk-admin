// /api/stats.js — Vercel Serverless Function
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  return res.status(200).json({
    totalDevices: 0,
    activeDevices: 0,
    totalServers: 0,
    appVersion: "1.0.0",
  });
}
