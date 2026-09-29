const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { createSecurityHandlers, RATE_LIMIT } = require("../src/securityAssurance");

const config = {
  apiKey: "server-only-test-key",
  apiBaseUrl: "https://rafter.example.test",
  siteId: "fixed-hr1-site",
  projectId: "fixed-hr1-project",
  domain: "hr1.iavva.ai",
  adminRole: "SecurityAssurance.Admin",
};

function request(method, headers = {}) {
  return { method, headers: new Map(Object.entries(headers)) };
}

function harness({ fetchImpl, verifyToken } = {}) {
  const calls = [];
  const handlers = createSecurityHandlers({
    config,
    fetchImpl: fetchImpl || (async (url, init) => {
      calls.push({ url, init });
      return { ok: true, status: 200, async json() { return { status: "completed", progressPercent: 100, scanStartedAt: "2026-09-29T00:00:00Z", scanCompletedAt: "2026-09-29T00:01:00Z", findingCounts: { critical: 0, warning: 1, informational: 2, total: 3 } }; } };
    }),
    verifyToken: verifyToken || (async () => ({ oid: "admin-1", roles: ["SecurityAssurance.Admin"] })),
  });
  return { handlers, calls };
}

test("status uses the fixed site endpoint and returns sanitized fields only", async () => {
  const { handlers, calls } = harness();
  const result = await handlers.status(request("GET"));
  assert.equal(result.status, 200);
  assert.equal(calls[0].url, "https://rafter.example.test/api/static/sites/fixed-hr1-site");
  assert.equal(result.jsonBody.domain, "hr1.iavva.ai");
  assert.equal(result.jsonBody.criticalCount, 0);
  assert.equal("apiKey" in result.jsonBody, false);
  assert.equal(JSON.stringify(result.jsonBody).includes(config.apiKey), false);
});

test("status maps the documented Rafter site response shape", async () => {
  const { handlers } = harness({
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      async json() {
        return {
          site: { registrable_domain: "hr1.iavva.ai" },
          latest_run: {
            status: "succeeded",
            progress_percent: 100,
            started_at: "2026-09-29T00:00:00Z",
            finished_at: "2026-09-29T00:01:00Z",
          },
          security: { critical: 0, warn: 2, info: 3, total: 5 },
          raw_findings: [{ message: "must not be returned" }],
        };
      },
    }),
  });
  const result = await handlers.status(request("GET"));
  assert.equal(result.status, 200);
  assert.equal(result.jsonBody.latestScanStatus, "succeeded");
  assert.equal(result.jsonBody.warningCount, 2);
  assert.equal(result.jsonBody.informationalCount, 3);
  assert.equal(result.jsonBody.totalFindings, 5);
  assert.equal("raw_findings" in result.jsonBody, false);
});

test("scan requires authentication and administrator authorization", async () => {
  const unauthenticated = harness({ verifyToken: async () => null });
  const noAuth = await unauthenticated.handlers.scan(request("POST", { origin: "https://hr1.iavva.ai" }));
  assert.equal(noAuth.status, 401);

  const unauthorized = harness({ verifyToken: async () => ({ oid: "user-1", roles: [] }) });
  const noRole = await unauthorized.handlers.scan(request("POST", { origin: "https://hr1.iavva.ai" }));
  assert.equal(noRole.status, 403);
});

test("scan requires same-origin CSRF protection and calls only fixed scan payload", async () => {
  const { handlers, calls } = harness();
  const csrf = await handlers.csrf(request("GET"));
  const token = csrf.jsonBody.token;
  const result = await handlers.scan(request("POST", { origin: "https://hr1.iavva.ai", cookie: `hr1_csrf=${token}`, "x-hr1-csrf": token }));
  assert.equal(result.status, 202);
  assert.equal(calls.at(-1).url, "https://rafter.example.test/api/static/sites/scan");
  assert.deepEqual(JSON.parse(calls.at(-1).init.body), { projectId: "fixed-hr1-project", sections: ["security", "dns"] });
  assert.equal(calls.at(-1).init.headers["x-api-key"], "server-only-test-key");
  assert.equal("Authorization" in calls.at(-1).init.headers, false);
});

test("scan is rate limited", async () => {
  const { handlers } = harness();
  const csrf = await handlers.csrf(request("GET"));
  const token = csrf.jsonBody.token;
  const headers = { origin: "https://hr1.iavva.ai", cookie: `hr1_csrf=${token}`, "x-hr1-csrf": token, "x-forwarded-for": "203.0.113.10" };
  let last;
  for (let index = 0; index < RATE_LIMIT + 1; index += 1) last = await handlers.scan(request("POST", headers));
  assert.equal(last.status, 429);
});

test("malformed upstream status never becomes fabricated results", async () => {
  const { handlers } = harness({ fetchImpl: async () => ({ ok: true, status: 200, async json() { return { unexpected: "shape" }; } }) });
  const result = await handlers.status(request("GET"));
  assert.equal(result.status, 502);
  assert.deepEqual(result.jsonBody, { error: "status_unavailable" });
});

test("upstream scan failures are surfaced without upstream details", async () => {
  const { handlers } = harness({ fetchImpl: async () => ({ ok: false, status: 500, async json() { return { secret: "should-not-return" }; } }) });
  const csrf = await handlers.csrf(request("GET"));
  const token = csrf.jsonBody.token;
  const result = await handlers.scan(request("POST", { origin: "https://hr1.iavva.ai", cookie: `hr1_csrf=${token}`, "x-hr1-csrf": token }));
  assert.equal(result.status, 502);
  assert.equal(JSON.stringify(result).includes("should-not-return"), false);
});

test("production client artifacts contain no Rafter credential material", () => {
  const root = path.join(__dirname, "../..");
  const files = ["dist/index.html", "dist/app.js", "dist/styles.css"];
  const clientText = files.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
  assert.equal(clientText.includes("RAFTER_API_KEY"), false);
  assert.equal(clientText.includes("server-only-test-key"), false);
  assert.equal(clientText.includes("Authorization: Bearer server-only-test-key"), false);
  assert.equal(clientText.includes("/api/static/sites/scan"), false);
});
