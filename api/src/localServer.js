const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { createSecurityHandlers } = require("./securityAssurance");
const { createInterviewHandlers } = require("./interviewAssistant");

const API_HOST = "127.0.0.1";
const API_PORT = 7071;
const DEMO_HOST = "0.0.0.0";
const DEMO_PORT = 5173;
const MAX_BODY_BYTES = 16 * 1024;
const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

function loadLocalSettings() {
  const settingsPath = path.join(__dirname, "..", "local.settings.json");
  if (!fs.existsSync(settingsPath)) return;
  const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
  Object.entries(settings.Values || {}).forEach(([name, value]) => {
    if (process.env[name] === undefined && value !== undefined && value !== null) process.env[name] = String(value);
  });
}

function headersAdapter(headers) {
  return {
    get(name) {
      const value = headers[String(name).toLowerCase()];
      return Array.isArray(value) ? value.join(",") : value || "";
    },
  };
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("request_too_large"));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

function serveStaticFile(staticRoot, pathname, incoming, outgoing) {
  if (!["GET", "HEAD"].includes(incoming.method)) return false;
  let relativePath;
  try {
    relativePath = decodeURIComponent(pathname === "/" ? "index.html" : pathname.replace(/^\/+/, ""));
  } catch {
    return false;
  }
  const root = path.resolve(staticRoot);
  let filePath = path.resolve(root, relativePath);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) return false;
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, "index.html");
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return false;
  const contentType = MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
  outgoing.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": filePath.endsWith("index.html") ? "no-cache" : "public, max-age=3600",
    "X-Content-Type-Options": "nosniff",
  });
  if (incoming.method === "HEAD") outgoing.end();
  else fs.createReadStream(filePath).pipe(outgoing);
  return true;
}

function createLocalServer(options = {}) {
  const staticRoot = options.staticRoot ? path.resolve(options.staticRoot) : "";
  loadLocalSettings();
  if (!process.env.NODE_ENV) process.env.NODE_ENV = "development";
  if (staticRoot) process.env.HR1_LOCAL_DEMO = "true";
  const security = createSecurityHandlers({ verifyToken: async () => null, logger: console });
  const interview = createInterviewHandlers({ logger: console });
  const routes = new Map([
    ["/api/security/status", { methods: ["GET", "OPTIONS"], handler: security.status }],
    ["/api/security/csrf", { methods: ["GET", "OPTIONS"], handler: security.csrf }],
    ["/api/security/scan", { methods: ["POST", "OPTIONS"], handler: security.scan }],
    ["/api/interview/status", { methods: ["GET", "OPTIONS"], handler: interview.status }],
    ["/api/interview/analyze", { methods: ["POST", "OPTIONS"], handler: interview.analyze }],
  ]);

  return http.createServer(async (incoming, outgoing) => {
    const pathname = new URL(incoming.url, `http://${incoming.headers.host || API_HOST}`).pathname;
    const route = routes.get(pathname);
    if (!route) {
      if (staticRoot && !pathname.startsWith("/api/") && serveStaticFile(staticRoot, pathname, incoming, outgoing)) return;
      outgoing.writeHead(404, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
      outgoing.end(JSON.stringify({ error: "not_found" }));
      return;
    }
    if (!route.methods.includes(incoming.method)) {
      outgoing.writeHead(405, { "Content-Type": "application/json; charset=utf-8", Allow: route.methods.join(",") });
      outgoing.end(JSON.stringify({ error: "method_not_allowed" }));
      return;
    }
    try {
      const rawBody = await readBody(incoming);
      const request = {
        method: incoming.method,
        headers: headersAdapter(incoming.headers),
        json: async () => JSON.parse(rawBody || "{}"),
      };
      const result = await route.handler(request);
      outgoing.writeHead(result.status, result.headers || { "Content-Type": "application/json; charset=utf-8" });
      outgoing.end(JSON.stringify(result.jsonBody ?? {}));
    } catch (error) {
      const tooLarge = error.message === "request_too_large";
      outgoing.writeHead(tooLarge ? 413 : 400, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
      outgoing.end(JSON.stringify({ error: tooLarge ? "request_too_large" : "invalid_request" }));
    }
  });
}

if (require.main === module) {
  const serveDemo = process.argv.includes("--static");
  const host = serveDemo ? DEMO_HOST : API_HOST;
  const port = serveDemo ? DEMO_PORT : API_PORT;
  const staticRoot = serveDemo ? path.join(__dirname, "..", "..", "dist") : "";
  createLocalServer({ staticRoot }).listen(port, host, () => {
    const label = serveDemo ? "HR1 demo website + API" : "HR1 local API";
    console.log(`${label} listening on http://localhost:${port}`);
  });
}

module.exports = { createLocalServer, loadLocalSettings, headersAdapter, readBody, serveStaticFile };
