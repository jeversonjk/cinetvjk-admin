// /api/stats.js — Vercel Serverless Function (CommonJS + Supabase)
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL || "https://ohjpkvrmbdcqnlcuiwxf.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanBrdnJtYmRjcW5sY3Vpd3hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc1MjExMSwiZXhwIjoyMDk2MzI4MTExfQ.MzphDop6Wwp7z8IQOrI29VO5fO1Rhiu6XPZJ6MLlut0";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { data, error } = await supabase
      .from("devices")
      .select("id, status");

    if (error) throw error;

    const total = data.length;
    const active = data.filter((d) => d.status === "active").length;

    return res.status(200).json({
      totalDevices: total,
      activeDevices: active,
      totalServers: 0,
      appVersion: "1.0.64",
    });
  } catch (err) {
    return res.status(200).json({
      totalDevices: 0,
      activeDevices: 0,
      totalServers: 0,
      appVersion: "1.0.64",
    });
  }
};

