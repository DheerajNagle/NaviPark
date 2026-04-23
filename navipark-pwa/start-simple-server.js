const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

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

  const parsedUrl = url.parse(req.url);

  // Handle API calls - proxy to backend
  if (parsedUrl.pathname.startsWith('/api/')) {
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
    return;
  }

  // Serve static files
  let filePath = path.join(__dirname, parsedUrl.pathname === '/' ? 'index.html' : parsedUrl.pathname);

  // Handle JSX files - serve as JS with proper content type
  if (filePath.endsWith('.jsx')) {
    res.setHeader('Content-Type', 'application/javascript');
  } else if (filePath.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  } else if (filePath.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  } else if (filePath.endsWith('.json')) {
    res.setHeader('Content-Type', 'application/json');
  } else if (filePath.endsWith('.html')) {
    res.setHeader('Content-Type', 'text/html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(`File not found: ${filePath}`);
      // If file not found, try to serve index.html for SPA routing
      if (parsedUrl.pathname !== '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (indexErr, indexData) => {
          if (indexErr) {
            res.writeHead(404);
            res.end('File not found');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexData);
        });
        return;
      }
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    console.log(`Serving file: ${filePath} (${data.length} bytes)`);
    res.writeHead(200);
    res.end(data);
  });
});

const PORT = 5173;
server.listen(PORT, () => {
  console.log(`🚀 NaviPark Frontend running on http://localhost:${PORT}`);
  console.log(`📡 Backend API proxied to http://localhost:3000`);
  console.log(`📁 Serving static files from: ${__dirname}`);
});
