var https = require('https');
var KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanBrdnJtYmRjcW5sY3Vpd3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTIxMTEsImV4cCI6MjA5NjMyODExMX0._ygJHLEFTCHTAn2U-wxN3-_TsmNMatblDLg4xi7cEE4';
module.exports = function(req, res) {
  var jwt = (req.headers['authorization'] || '').replace('Bearer ', '');
  var b = '';
  req.on('data', function(c) { b += c; });
  req.on('end', function() {
    var hdrs = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY };
    if (jwt && jwt !== KEY) hdrs['X-Admin-Token'] = jwt;
    if (b) hdrs['Content-Length'] = Buffer.byteLength(b);
    var o = https.request({
      hostname: 'ohjpkvrmbdcqnlcuiwxf.supabase.co',
      path: '/functions/v1/admin-api' + req.url,
      method: req.method,
      headers: hdrs
    }, function(r) {
      var d = '';
      r.on('data', function(c) { d += c; });
      r.on('end', function() {
        try { res.status(r.statusCode).json(JSON.parse(d)); }
        catch(e) { res.status(r.statusCode).send(d); }
      });
    });
    o.on('error', function(e) { res.status(502).json({ error: String(e) }); });
    if (b) o.write(b);
    o.end();
  });
};
