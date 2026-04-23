const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Simple routing
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    // Proxy to backend for API calls
    const targetUrl = `http://localhost:3000${req.url}`;
    const proxy = require('http').request(targetUrl, (backendRes) => {
      res.writeHead(backendRes.statusCode, backendRes.headers);
      backendRes.pipe(res);
    });

    proxy.on('error', (err) => {
      res.writeHead(500);
      res.end('Backend proxy error');
    });

    req.pipe(proxy);
  }
});

const PORT = 5173;
server.listen(PORT, () => {
  console.log(`🚀 NaviPark Frontend running on http://localhost:${PORT}`);
  console.log(`📡 Backend API proxied to http://localhost:3000`);
});
