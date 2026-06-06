// /api/servers.js — CRUD de servidores M3U (CommonJS + Supabase)
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://ohjpkvrmbdcqnlcuiwxf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanBrdnJtYmRjcW5sY3Vpd3hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc1MjExMSwiZXhwIjoyMDk2MzI4MTExfQ.MzphDop6Wwp7z8IQOrI29VO5fO1Rhiu6XPZJ6MLlut0";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "GET") {
      const { data, error } = await supabase.from("servers").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      return res.status(200).json((data || []).map((s) => ({ id: s.id, name: s.name, baseUrl: s.base_url })));
    }

    if (req.method === "POST") {
      const { name, baseUrl } = req.body || {};
      if (!name || !baseUrl) return res.status(400).json({ message: "Nome e URL base são obrigatórios" });
      const { data, error } = await supabase
        .from("servers").insert([{ name: name.trim(), base_url: baseUrl.trim() }]).select().single();
      if (error) throw error;
      return res.status(201).json({ id: data.id, name: data.name, baseUrl: data.base_url });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    return res.status(500).json({ message: "Erro: " + err.message });
  }
};
