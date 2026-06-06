// /api/devices/[id].js — GET/PATCH/DELETE por MAC (CommonJS + Supabase)
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://ohjpkvrmbdcqnlcuiwxf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanBrdnJtYmRjcW5sY3Vpd3hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc1MjExMSwiZXhwIjoyMDk2MzI4MTExfQ.MzphDop6Wwp7z8IQOrI29VO5fO1Rhiu6XPZJ6MLlut0";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function toDevice(d) {
  return {
    id: d.id, mac: d.mac, name: d.name, m3uUrl: d.m3u_url,
    isActive: d.is_active, lastSeenAt: d.last_seen_at || null,
    nowWatching: d.now_watching || null, createdAt: d.created_at,
  };
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  // Decodificar MAC da URL (ex: BE%3A01%3AA0... → BE:01:A0...)
  const mac = decodeURIComponent(req.query.id || "").toUpperCase();

  try {
    if (req.method === "GET") {
      const { data, error } = await supabase.from("devices").select("*").eq("mac", mac).maybeSingle();
      if (error) throw error;
      if (!data) return res.status(404).json({ message: "Dispositivo não encontrado" });
      return res.status(200).json(toDevice(data));
    }

    if (req.method === "DELETE") {
      const { error } = await supabase.from("devices").delete().eq("mac", mac);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (req.method === "PATCH") {
      const { name, m3uUrl, isActive, lastSeenAt, nowWatching } = req.body || {};
      const updates = { updated_at: new Date().toISOString() };
      if (name !== undefined)        updates.name = name;
      if (m3uUrl !== undefined)      updates.m3u_url = m3uUrl;
      if (isActive !== undefined)    updates.is_active = isActive;
      if (lastSeenAt !== undefined)  updates.last_seen_at = lastSeenAt;
      if (nowWatching !== undefined) updates.now_watching = nowWatching;

      const { data, error } = await supabase
        .from("devices").update(updates).eq("mac", mac).select().single();
      if (error) throw error;
      return res.status(200).json(toDevice(data));
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    console.error("Device by MAC error:", err);
    return res.status(500).json({ message: "Erro: " + err.message });
  }
};
