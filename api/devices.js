// /api/devices.js — Vercel Serverless Function (CommonJS + Supabase)
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL || "https://ohjpkvrmbdcqnlcuiwxf.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanBrdnJtYmRjcW5sY3Vpd3hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc1MjExMSwiZXhwIjoyMDk2MzI4MTExfQ.MzphDop6Wwp7z8IQOrI29VO5fO1Rhiu6XPZJ6MLlut0";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "GET") {
      // Busca com filtro opcional por MAC ou nome
      const { search } = req.query || {};
      let query = supabase
        .from("devices")
        .select("*")
        .order("created_at", { ascending: false });

      if (search) {
        query = query.or(`mac.ilike.%${search}%,name.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Mapear para o formato esperado pelo painel
      const devices = (data || []).map((d) => ({
        id: d.id,
        mac: d.mac,
        name: d.name,
        m3uUrl: d.m3u_url,
        status: d.status,
        createdAt: d.created_at,
      }));

      return res.status(200).json(devices);
    }

    if (req.method === "POST") {
      const { mac, name, m3uUrl } = req.body || {};

      if (!mac || !name || !m3uUrl) {
        return res.status(400).json({ message: "MAC, nome e URL M3U são obrigatórios" });
      }

      const { data, error } = await supabase
        .from("devices")
        .insert([{ mac: mac.toUpperCase(), name, m3u_url: m3uUrl, status: "active" }])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          return res.status(409).json({ message: "Este MAC já está cadastrado" });
        }
        throw error;
      }

      return res.status(201).json({
        id: data.id,
        mac: data.mac,
        name: data.name,
        m3uUrl: data.m3u_url,
        status: data.status,
        createdAt: data.created_at,
      });
    }

    if (req.method === "PUT") {
      const id = req.query.id || (req.url.split("/").pop());
      const { mac, name, m3uUrl, status } = req.body || {};

      const updates = {};
      if (mac) updates.mac = mac.toUpperCase();
      if (name) updates.name = name;
      if (m3uUrl) updates.m3u_url = m3uUrl;
      if (status) updates.status = status;
      updates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from("devices")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        id: data.id,
        mac: data.mac,
        name: data.name,
        m3uUrl: data.m3u_url,
        status: data.status,
        createdAt: data.created_at,
      });
    }

    if (req.method === "DELETE") {
      const id = req.query.id || (req.url.split("/").pop());

      const { error } = await supabase
        .from("devices")
        .delete()
        .eq("id", id);

      if (error) throw error;

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: "Method Not Allowed" });

  } catch (err) {
    console.error("Devices API error:", err);
    return res.status(500).json({ message: "Erro interno: " + err.message });
  }
};

