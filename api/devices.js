// /api/devices.js — GET lista + POST criar (CommonJS + Supabase)
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://ohjpkvrmbdcqnlcuiwxf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanBrdnJtYmRjcW5sY3Vpd3hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc1MjExMSwiZXhwIjoyMDk2MzI4MTExfQ.MzphDop6Wwp7z8IQOrI29VO5fO1Rhiu6XPZJ6MLlut0";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function toDevice(d) {
  return {
    id: d.id,
    mac: d.mac,
    name: d.name,
    m3uUrl: d.m3u_url,
    isActive: d.is_active,
    lastSeenAt: d.last_seen_at || null,
    nowWatching: d.now_watching || null,
    createdAt: d.created_at,
  };
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "GET") {
      const { search } = req.query || {};
      let query = supabase.from("devices").select("*").order("created_at", { ascending: false });
      if (search) query = query.or(`mac.ilike.%${search}%,name.ilike.%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json((data || []).map(toDevice));
    }

    if (req.method === "POST") {
      const { mac, name, m3uUrl } = req.body || {};
      if (!mac || !name) return res.status(400).json({ message: "MAC e nome são obrigatórios" });
      const { data, error } = await supabase
        .from("devices")
        .insert([{ mac: mac.toUpperCase().trim(), name: name.trim(), m3u_url: (m3uUrl || "").trim(), is_active: true }])
        .select().single();
      if (error) {
        if (error.code === "23505") return res.status(409).json({ message: "Este MAC já está cadastrado" });
        throw error;
      }
      return res.status(201).json(toDevice(data));
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    console.error("Devices error:", err);
    return res.status(500).json({ message: "Erro: " + err.message });
  }
};
