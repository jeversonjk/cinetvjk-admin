// /api/stats.js — (CommonJS + Supabase)
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://ohjpkvrmbdcqnlcuiwxf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanBrdnJtYmRjcW5sY3Vpd3hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc1MjExMSwiZXhwIjoyMDk2MzI4MTExfQ.MzphDop6Wwp7z8IQOrI29VO5fO1Rhiu6XPZJ6MLlut0";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { data, error } = await supabase.from("devices").select("id, is_active, last_seen_at");
    if (error) throw error;

    const total = (data || []).length;
    const active = (data || []).filter((d) => d.is_active).length;
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const online = (data || []).filter((d) => d.last_seen_at && d.last_seen_at > fiveMinAgo).length;

    const { data: servers } = await supabase.from("servers").select("id");

    return res.status(200).json({
      totalDevices: total,
      activeDevices: active,
      onlineDevices: online,
      totalServers: (servers || []).length,
      appVersion: "1.0.64",
    });
  } catch (err) {
    return res.status(200).json({ totalDevices: 0, activeDevices: 0, onlineDevices: 0, totalServers: 0, appVersion: "1.0.64" });
  }
};
