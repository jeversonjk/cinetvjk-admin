// /api/devices/[id].js — PUT e DELETE por ID
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL || "https://ohjpkvrmbdcqnlcuiwxf.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanBrdnJtYmRjcW5sY3Vpd3hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc1MjExMSwiZXhwIjoyMDk2MzI4MTExfQ.MzphDop6Wwp7z8IQOrI29VO5fO1Rhiu6XPZJ6MLlut0";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("devices").select("*").eq("id", id).single();
      if (error) throw error;
      return res.status(200).json({
        id: data.id, mac: data.mac, name: data.name,
        m3uUrl: data.m3u_url, status: data.status, createdAt: data.created_at,
      });
    }

    if (req.method === "PUT") {
      const { mac, name, m3uUrl, status } = req.body || {};
      const updates = { updated_at: new Date().toISOString() };
      if (mac) updates.mac = mac.toUpperCase();
      if (name) updates.name = name;
      if (m3uUrl) updates.m3u_url = m3uUrl;
      if (status) updates.status = status;

      const { data, error } = await supabase
        .from("devices").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return res.status(200).json({
        id: data.id, mac: data.mac, name: data.name,
        m3uUrl: data.m3u_url, status: data.status, createdAt: data.created_at,
      });
    }

    if (req.method === "DELETE") {
      const { error } = await supabase.from("devices").delete().eq("id", id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    console.error("Device by ID error:", err);
    return res.status(500).json({ message: "Erro: " + err.message });
  }
};
