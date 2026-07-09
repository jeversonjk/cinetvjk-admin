const EDGE_URL = 'https://ohjpkvrmbdcqnlcuiwxf.supabase.co/functions/v1/admin-api';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanBrdnJtYmRjcW5sY3Vpd3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTIxMTEsImV4cCI6MjA5NjMyODExMX0._ygJHLEFTCHTAn2U-wxN3-_TsmNMatblDLg4xi7cEE4';

export default async function handler(req, res) {
  const slug = req.query.slug || [];
  const path = '/' + (Array.isArray(slug) ? slug.join('/') : slug);
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ANON_KEY}`,
  };
  if (req.headers['x-admin-token']) headers['x-admin-token'] = req.headers['x-admin-token'];
  let body;
  if (req.method !== 'GET') body = JSON.stringify(req.body);
  const upstream = await fetch(EDGE_URL + path, { method: req.method, headers, body });
  const data = await upstream.json().catch(() =&gt; ({}));
  res.status(upstream.status).json(data);
}
