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
  const pathname = parsedUrl.pathname;

  console.log(`Request: ${req.method} ${pathname}`);

  // Handle API calls - proxy to backend
  if (pathname.startsWith('/api/')) {
    const targetUrl = `http://localhost:3000${req.url}`;
    console.log(`Proxying to: ${targetUrl}`);
    const proxy = require('http').request(targetUrl, (backendRes) => {
      res.writeHead(backendRes.statusCode, backendRes.headers);
      backendRes.pipe(res);
    });

    proxy.on('error', (err) => {
      console.log('Backend proxy error:', err.message);
      res.writeHead(500);
      res.end('Backend proxy error');
    });

    req.pipe(proxy);
    return;
  }

  // Serve static files
  let filePath;
  if (pathname === '/') {
    filePath = path.join(__dirname, 'index.html');
  } else {
    filePath = path.join(__dirname, pathname);
  }

  // Set content type based on file extension
  const ext = path.extname(filePath);
  let contentType = 'text/html';
  
  switch (ext) {
    case '.js':
    case '.jsx':
      contentType = 'application/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
  }

  console.log(`Serving file: ${filePath} (${contentType})`);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(`File not found: ${filePath}`);
      
      // If file not found and not API call, serve index.html for SPA routing
      if (!pathname.startsWith('/api/')) {
        const indexPath = path.join(__dirname, 'index.html');
        fs.readFile(indexPath, (indexErr, indexData) => {
          if (indexErr) {
            console.log(`Index file not found: ${indexPath}`);
            res.writeHead(404);
            res.end('File not found');
            return;
          }
          console.log(`Serving index.html for SPA routing: ${pathname}`);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexData);
        });
        return;
      }
      
      res.writeHead(404);
      res.end('File not found');
      return;
    }

    console.log(`Successfully serving: ${filePath} (${data.length} bytes)`);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

const PORT = 5173;
server.listen(PORT, () => {
  console.log(`🚀 NaviPark Frontend running on http://localhost:${PORT}`);
  console.log(`📡 Backend API proxied to http://localhost:3000`);
  console.log(`📁 Serving static files from: ${__dirname}`);
});
