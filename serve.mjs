// Minimal zero-dependency static file server for local development/testing.
// Usage: node serve.mjs [port]   (default 8080)
// Serves the ./dist directory with correct MIME types so ES modules and the
// service worker work over http://localhost.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, 'dist');
const PORT = Number(process.argv[2] || process.env.PORT || 8080);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml'
};

const server = createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (urlPath === '/') urlPath = '/index.html';
    // Prevent path traversal.
    const safe = normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
    let filePath = join(DIST, safe);
    let info;
    try { info = await stat(filePath); } catch { info = null; }
    if (info && info.isDirectory()) { filePath = join(filePath, 'index.html'); }
    const data = await readFile(filePath);
    const type = MIME[extname(filePath)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
    res.end(data);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Serving ${DIST} at http://localhost:${PORT}`);
  console.log('Open the app: http://localhost:' + PORT + '/');
  console.log('Run browser tests: http://localhost:' + PORT + '/tests/browser.test.html');
});
