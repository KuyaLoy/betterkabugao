/**
 * Static file server that mimics Cloudflare Pages clean-URL routing for the
 * built site in `dist/`: `/about` -> `dist/about/index.html`, `/assets/x` ->
 * `dist/assets/x`, `/` -> `dist/index.html`, unknown -> `dist/404.html` (404).
 *
 * This is used by the committed Checkpoint-1 QA harness so the browser tests run
 * the way Cloudflare serves the site — NOT the way `vite preview` does (its SPA
 * fallback serves the homepage for every unknown path, which is a false result).
 */
import http from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIST = fileURLToPath(new URL("../../dist/", import.meta.url));

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".ico": "image/x-icon",
};

function sendFile(res, code, file) {
  const ext = path.extname(file).toLowerCase();
  res.writeHead(code, { "Content-Type": MIME[ext] || "application/octet-stream" });
  res.end(readFileSync(file));
}

/**
 * Starts the server. `port = 0` picks an ephemeral free port (no conflicts).
 * Resolves to `{ server, port, base }`.
 */
export function startServer(port = 0) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent((req.url || "/").split("?")[0]);
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    const candidates =
      p === "/" || p === ""
        ? [path.join(DIST, "index.html")]
        : [path.join(DIST, p), path.join(DIST, p, "index.html"), path.join(DIST, `${p}.html`)];
    for (const f of candidates) {
      try {
        if (existsSync(f) && statSync(f).isFile()) return sendFile(res, 200, f);
      } catch {
        /* fall through */
      }
    }
    const notFound = path.join(DIST, "404.html");
    if (existsSync(notFound)) return sendFile(res, 404, notFound);
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  });
  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => {
      const actual = server.address().port;
      resolve({ server, port: actual, base: `http://127.0.0.1:${actual}` });
    });
  });
}
