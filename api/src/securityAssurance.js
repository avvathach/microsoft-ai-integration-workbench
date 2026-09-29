const crypto = require("node:crypto");

const PUBLIC_ORIGIN = "https://hr1.iavva.ai";
const PUBLIC_DOMAIN = "hr1.iavva.ai";
const DEFAULT_ADMIN_ROLE = "SecurityAssurance.Admin";
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 3;

function header(request, name) {
  const headers = request?.headers;
  if (!headers) return "";
  if (typeof headers.get === "function") return headers.get(name) || "";
  return headers[name] || headers[name.toLowerCase()] || "";
}

function ipAddress(request) {
  return header(request, "x-forwarded-for").split(",")[0].trim() || "unknown";
}

function response(status, body, request, extraHeaders = {}) {
  const origin = header(request, "origin");
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    Vary: "Origin",
    ...extraHeaders,
  };
  if (!origin || origin === PUBLIC_ORIGIN) {
    headers["Access-Control-Allow-Origin"] = PUBLIC_ORIGIN;
  }
  return { status, headers, jsonBody: body };
}

function optionsResponse(request) {
  return response(204, {}, request, {
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization,Content-Type,X-HR1-CSRF",
    "Access-Control-Max-Age": "600",
  });
}

function errorResponse(status, code, request) {
  return response(status, { error: code }, request);
}

function configFromEnvironment(env = process.env) {
  return {
    apiKey: env.RAFTER_API_KEY || "",
    apiBaseUrl: env.RAFTER_API_BASE_URL || "",
    siteId: env.RAFTER_SITE_ID || "",
    projectId: env.RAFTER_PROJECT_ID || "",
    tenantId: env.ENTRA_TENANT_ID || "",
    audience: env.ENTRA_API_AUDIENCE || "",
    adminRole: env.SECURITY_ASSURANCE_ADMIN_ROLE || DEFAULT_ADMIN_ROLE,
    domain: PUBLIC_DOMAIN,
  };
}

function isConfigured(config, needsProject = false) {
  return Boolean(config.apiKey && config.apiBaseUrl && config.siteId && (!needsProject || config.projectId));
}

function cleanBaseUrl(baseUrl) {
  return baseUrl.replace(/\/+$/, "");
}

async function rafterRequest(config, path, method, body, fetchImpl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetchImpl(`${cleanBaseUrl(config.apiBaseUrl)}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${config.apiKey}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!response.ok) throw new Error(`Rafter returned ${response.status}`);
    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function valueAt(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function numberAt(...values) {
  const value = valueAt(...values);
  if (value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function objectAt(...values) {
  return values.find((value) => value && typeof value === "object" && !Array.isArray(value)) || {};
}

function sanitizeStatus(payload, config) {
  const root = objectAt(payload?.data, payload?.result, payload?.site, payload);
  const scan = objectAt(root.latestScan, root.latest_scan, root.scan, root.latest);
  const counts = objectAt(root.findingCounts, root.finding_counts, root.counts, scan.findingCounts, scan.finding_counts, scan.counts);
  const status = valueAt(scan.status, scan.scanStatus, root.latestScanStatus, root.latest_scan_status, root.status, root.scan_status);
  return {
    domain: config.domain,
    latestScanStatus: typeof status === "string" ? status : null,
    progressPercent: numberAt(scan.progressPercent, scan.progress_percentage, root.progressPercent, root.progress_percentage),
    scanStartedAt: valueAt(scan.startedAt, scan.started_at, root.scanStartedAt, root.scan_started_at) || null,
    scanCompletedAt: valueAt(scan.completedAt, scan.completed_at, root.scanCompletedAt, root.scan_completed_at) || null,
    criticalCount: numberAt(counts.critical, counts.criticalCount, root.criticalCount),
    warningCount: numberAt(counts.warning, counts.warnings, counts.warningCount, root.warningCount),
    informationalCount: numberAt(counts.informational, counts.info, counts.informationalCount, root.informationalCount),
    totalFindings: numberAt(counts.total, counts.totalFindings, root.totalFindings),
    remediationVerificationStatus: valueAt(root.remediationVerificationStatus, root.remediation_status, scan.remediationVerificationStatus) || null,
  };
}

function createSecurityHandlers(options = {}) {
  const env = options.env || process.env;
  const config = { ...configFromEnvironment(env), ...(options.config || {}) };
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const verifyToken = options.verifyToken || (async () => null);
  const logger = options.logger || { info() {}, warn() {}, error() {} };
  const requestTimes = new Map();

  function rateLimited(key) {
    const now = Date.now();
    const previous = (requestTimes.get(key) || []).filter((time) => now - time < RATE_WINDOW_MS);
    previous.push(now);
    requestTimes.set(key, previous);
    return previous.length > RATE_LIMIT;
  }

  async function status(request) {
    if (request.method === "OPTIONS") return optionsResponse(request);
    if (!isConfigured(config)) return response(503, { status: "not_configured", domain: config.domain }, request);
    try {
      const payload = await rafterRequest(config, `/api/static/sites/${encodeURIComponent(config.siteId)}`, "GET", null, fetchImpl);
      const sanitized = sanitizeStatus(payload, config);
      const hasRecognizedData = [sanitized.latestScanStatus, sanitized.progressPercent, sanitized.scanStartedAt, sanitized.scanCompletedAt, sanitized.criticalCount, sanitized.warningCount, sanitized.informationalCount, sanitized.totalFindings].some((value) => value !== null);
      if (!hasRecognizedData) throw new Error("Malformed Rafter status response");
      if (sanitized.scanCompletedAt) logger.info("security_scan_completion_observed", { domain: config.domain, status: sanitized.latestScanStatus || "unknown" });
      return response(200, sanitized, request);
    } catch (error) {
      logger.warn("security_status_failed", { domain: config.domain, reason: error.name === "AbortError" ? "timeout" : "upstream_error" });
      return errorResponse(502, "status_unavailable", request);
    }
  }

  async function csrf(request) {
    if (request.method === "OPTIONS") return optionsResponse(request);
    const token = crypto.randomBytes(32).toString("hex");
    return response(200, { token }, request, {
      "Set-Cookie": `hr1_csrf=${token}; Path=/api/security; Max-Age=600; Secure; HttpOnly; SameSite=Strict`,
    });
  }

  async function scan(request) {
    if (request.method === "OPTIONS") return optionsResponse(request);
    if (header(request, "origin") !== PUBLIC_ORIGIN) return errorResponse(403, "origin_not_allowed", request);
    if (!isConfigured(config, true)) return errorResponse(503, "not_configured", request);
    let identity;
    try {
      identity = await verifyToken(request);
    } catch {
      return errorResponse(401, "invalid_token", request);
    }
    if (!identity) return errorResponse(401, "authentication_required", request);
    if (!Array.isArray(identity.roles) || !identity.roles.includes(config.adminRole)) return errorResponse(403, "administrator_role_required", request);
    const cookie = header(request, "cookie").match(/(?:^|;\s*)hr1_csrf=([^;]+)/)?.[1] || "";
    const submitted = header(request, "x-hr1-csrf");
    if (!cookie || !submitted || cookie !== submitted) return errorResponse(403, "csrf_validation_failed", request);
    const key = `${identity.oid || "unknown"}:${ipAddress(request)}`;
    if (rateLimited(key)) return errorResponse(429, "rate_limit_exceeded", request);
    const startedAt = new Date().toISOString();
    logger.info("security_scan_initiated", { domain: config.domain, actor: identity.oid || "redacted" });
    try {
      await rafterRequest(config, "/api/static/sites/scan", "POST", { projectId: config.projectId, sections: ["security", "dns"] }, fetchImpl);
      logger.info("security_scan_request_completed", { domain: config.domain, actor: identity.oid || "redacted", startedAt });
      return response(202, { status: "scan_requested", requestedAt: startedAt }, request);
    } catch (error) {
      logger.error("security_scan_request_failed", { domain: config.domain, reason: error.name === "AbortError" ? "timeout" : "upstream_error" });
      return errorResponse(502, "scan_request_failed", request);
    }
  }

  return { status, csrf, scan };
}

module.exports = { createSecurityHandlers, sanitizeStatus, configFromEnvironment, PUBLIC_ORIGIN, RATE_LIMIT };
