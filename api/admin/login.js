var https = require('https');
var KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oanBrdnJtYmRjcW5sY3Vpd3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTIxMTEsImV4cCI6MjA5NjMyODExMX0._ygJHLEFTCHTAn2U-wxN3-_TsmNMatblDLg4xi7cEE4';
module.exports = function(req, res) {
  var b = '';
  req.on('data', function(c) { b += c; });
  req.on('end', function() {
    var o = https.request({
      hostname: 'ohjpkvrmbdcqnlcuiwxf.supabase.co',
      path: '/functions/v1/admin-api/api/admin/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY, 'Content-Length': Buffer.byteLength(b) }
    }, function(r) {
      var d = '';
      r.on('data', function(c) { d += c; });
      r.on('end', function() { res.status(r.statusCode).json(JSON.parse(d)); });
    });
    o.write(b); o.end();
  });
};
