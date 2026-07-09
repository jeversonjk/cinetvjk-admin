const https = require('https');

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanBrdnJtYmRjcW5sY3Vpd3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTIxMTEsImV4cCI6MjA5NjMyODExMX0._ygJHLEFTCHTAn2U-wxN3-_TsmNMatblDLg4xi7cEE4';

module.exports = async function handler(req, res) {
  return new Promise((resolve) =&gt; {
    const body = req.method !== 'GET' ? JSON.stringify(req.body) : null;
    const options = {
      hostname: 'ohjpkvrmbdcqnlcuiwxf.supabase.co',
      path: '/functions/v1/admin-api/admin/login',
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ANON_KEY,
        ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {}),
      },
    };
    const proxyReq = https.request(options, (proxyRes) =&gt; {
      let data = '';
      proxyRes.on('data', (chunk) =&gt; { data += chunk; });
      proxyRes.on('end', () =&gt; {
        try { res.status(proxyRes.statusCode).json(JSON.parse(data)); }
        catch (e) { res.status(proxyRes.statusCode).send(data); }
        resolve();
      });
    });
    proxyReq.on('error', (err) =&gt; {
      res.status(502).json({ error: err.message });
      resolve();
    });
    if (body) proxyReq.write(body);
    proxyReq.end();
  });
};
