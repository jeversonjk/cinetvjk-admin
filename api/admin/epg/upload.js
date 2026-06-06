// /api/admin/epg/upload.js — POST (upload XML) e DELETE
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://ohjpkvrmbdcqnlcuiwxf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanBrdnJtYmRjcW5sY3Vpd3hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc1MjExMSwiZXhwIjoyMDk2MzI4MTExfQ.MzphDop6Wwp7z8IQOrI29VO5fO1Rhiu6XPZJ6MLlut0";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "DELETE") {
      await supabase.from("app_config").update({ epg_url: "" }).eq("id", 1);
      return res.status(200).json({ success: true });
    }

    if (req.method === "POST") {
      // Recebe XML como text/plain
      let body = "";
      await new Promise((resolve, reject) => {
        req.on("data", (chunk) => { body += chunk.toString(); });
        req.on("end", resolve);
        req.on("error", reject);
      });

      // Contar programas no XML (tag <programme)
      const count = (body.match(/<programme/gi) || []).length;
      const uploadedAt = new Date().toISOString();

      // Salvar referência na app_config (epg_url como marcador interno)
      await supabase.from("app_config").update({
        epg_url: `__file_upload__:${uploadedAt}:${count}`,
        updated_at: uploadedAt,
      }).eq("id", 1);

      return res.status(200).json({ count, uploadedAt });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
