// /api/group-order.js — GET e PATCH ordem dos grupos (CommonJS + Supabase)
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://ohjpkvrmbdcqnlcuiwxf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanBrdnJtYmRjcW5sY3Vpd3hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc1MjExMSwiZXhwIjoyMDk2MzI4MTExfQ.MzphDop6Wwp7z8IQOrI29VO5fO1Rhiu6XPZJ6MLlut0";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "GET") {
      const { data, error } = await supabase.from("group_order").select("*").eq("id", 1).single();
      if (error) throw error;
      return res.status(200).json({ tv: data.tv || [], movies: data.movies || [], series: data.series || [] });
    }

    if (req.method === "PATCH") {
      const { tv, movies, series } = req.body || {};
      const updates = { updated_at: new Date().toISOString() };
      if (tv !== undefined) updates.tv = tv;
      if (movies !== undefined) updates.movies = movies;
      if (series !== undefined) updates.series = series;

      const { data, error } = await supabase
        .from("group_order").update(updates).eq("id", 1).select().single();
      if (error) throw error;
      return res.status(200).json({ tv: data.tv || [], movies: data.movies || [], series: data.series || [] });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    return res.status(500).json({ message: "Erro: " + err.message });
  }
};
