#!/usr/bin/env node
/**
 * Local preview server for the ALLAI public site (site/).
 *
 *  - Sends the same Content-Security-Policy the production server sends, so anything
 *    that would be blocked live (inline styles/scripts, CDNs, <video>) is blocked here too.
 *  - Clean URLs: /pricing -> site/pricing.html (as in production).
 *  - Backend-only routes (/plans, /login, /signup, /audit, /forgot, /api/...) are NOT part
 *    of this repository. They answer with a small stub page so links can be checked locally.
 *
 * Usage: node tools/serve.mjs [port]   (default 4173)
 */
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'site');
const PORT = Number(process.argv[2] || process.env.PORT || 4173);

const CSP = [
  "default-src 'none'", "script-src 'self'", "style-src 'self'", "img-src 'self' data:",
  "font-src 'self'", "connect-src 'self'", "base-uri 'none'", "form-action 'none'", "frame-ancestors 'none'",
].join('; ');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml', '.webp': 'image/webp',
};

const BACKEND = /^\/(plans|login|signup|audit|forgot|reset|checkout|dashboard|security|account)\/?$/;

const stub = (route) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Backend route ${route}</title><link rel="stylesheet" href="/assets/css/allai.css"></head>
<body class="stub"><main class="stub__box"><p class="eyebrow">Local preview</p><h1 class="h2">${route}</h1>
<p class="lead">This route is served by the ALLAI application backend in production. It is not part of the static site in this repository, so the preview shows this placeholder.</p>
<p><a class="btn" href="/">Back to the homepage</a></p></main></body></html>`;

async function fileFor(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const abs = path.join(ROOT, path.normalize(p));
  if (!abs.startsWith(ROOT)) return null;
  for (const cand of [abs, abs + '.html']) {
    try { const s = await stat(cand); if (s.isFile()) return cand; } catch { /* next */ }
  }
  return null;
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const headers = {
    'Content-Security-Policy': CSP, 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Cache-Control': 'no-store',
  };
  if (url.pathname.startsWith('/api/')) {
    res.writeHead(404, { ...headers, 'Content-Type': 'application/json' });
    return res.end('{"error":"backend_not_available_in_preview"}');
  }
  if (BACKEND.test(url.pathname)) {
    res.writeHead(200, { ...headers, 'Content-Type': TYPES['.html'], 'X-Preview-Stub': '1' });
    return res.end(stub(url.pathname + url.search));
  }
  const f = await fileFor(url.pathname);
  if (!f) { res.writeHead(404, { ...headers, 'Content-Type': 'text/plain' }); return res.end('Not found'); }
  res.writeHead(200, { ...headers, 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  res.end(await readFile(f));
}).listen(PORT, () => console.log(`ALLAI preview: http://localhost:${PORT}  (production CSP enabled)`));
