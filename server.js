const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

 

function serveStatic(req, res){
  const urlPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  let filePath = path.join(process.cwd(), urlPath);
  if (urlPath === '/' || urlPath === '') filePath = path.join(process.cwd(), 'index.html');
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not Found');
    }
    const ext = path.extname(filePath).toLowerCase();
    const ct = CONTENT_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': ct });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  return serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});