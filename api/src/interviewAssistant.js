const crypto = require("node:crypto");
const { listSyntheticCases, getSyntheticCase, compareSyntheticCase } = require("./interviewCases");

const PUBLIC_ORIGIN = "https://hr1.iavva.ai";
const LOCAL_ORIGINS = new Set(["http://localhost:5173", "http://127.0.0.1:5173"]);
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 10;
const MAX_MODEL_TOOL_CALLS = 3;
const DECISION_BOUNDARY = "Recommendation only; authorized human decision required.";

const ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    recommendation: { type: "string", enum: ["accept_match", "reject_match", "escalate"] },
    confidence: { type: "integer", minimum: 0, maximum: 100 },
    summary: { type: "string" },
    supportingEvidence: { type: "array", items: { type: "string" }, maxItems: 8 },
    conflictingEvidence: { type: "array", items: { type: "string" }, maxItems: 8 },
    missingEvidence: { type: "array", items: { type: "string" }, maxItems: 8 },
    humanReviewRequired: { type: "boolean" },
    decisionBoundary: { type: "string", enum: [DECISION_BOUNDARY] },
  },
  required: [
    "recommendation",
    "confidence",
    "summary",
    "supportingEvidence",
    "conflictingEvidence",
    "missingEvidence",
    "humanReviewRequired",
    "decisionBoundary",
  ],
};

function header(request, name) {
  const headers = request?.headers;
  if (!headers) return "";
  if (typeof headers.get === "function") return headers.get(name) || "";
  return headers[name] || headers[name.toLowerCase()] || "";
}

function ipAddress(request) {
  return header(request, "x-forwarded-for").split(",")[0].trim() || "unknown";
}

function allowedOrigin(origin, env) {
  const localDevelopment = env.NODE_ENV === "development" || env.NODE_ENV === "test";
  const forwardedPreview = env.NODE_ENV === "development" && env.HR1_LOCAL_DEMO === "true" && /^https?:\/\//.test(origin);
  return !origin || origin === PUBLIC_ORIGIN || (localDevelopment && LOCAL_ORIGINS.has(origin)) || forwardedPreview;
}

function response(status, body, request, env, extraHeaders = {}) {
  const origin = header(request, "origin");
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    Vary: "Origin",
    ...extraHeaders,
  };
  if (allowedOrigin(origin, env)) headers["Access-Control-Allow-Origin"] = origin || PUBLIC_ORIGIN;
  return { status, headers, jsonBody: body };
}

function optionsResponse(request, env) {
  return response(204, {}, request, env, {
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "600",
  });
}

function configFromEnvironment(env = process.env) {
  return {
    apiKey: env.OPENAI_API_KEY || "",
    model: env.OPENAI_MODEL || "",
    baseUrl: (env.OPENAI_API_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, ""),
  };
}

function modelMode(config) {
  return config.apiKey && config.model ? "live-model" : "guided-fixture";
}

function toolDefinitions() {
  const caseIds = listSyntheticCases().map((item) => item.id);
  const parameters = {
    type: "object",
    additionalProperties: false,
    properties: { caseId: { type: "string", enum: caseIds } },
    required: ["caseId"],
  };
  return [
    { type: "function", name: "load_case_evidence", description: "Load an allowlisted synthetic HR1 case. Read only.", strict: true, parameters },
    { type: "function", name: "compare_case_fields", description: "Run deterministic field comparison for an allowlisted synthetic case. Read only.", strict: true, parameters },
    { type: "function", name: "get_governance_policy", description: "Load the human-approval and data-use controls for an allowlisted synthetic case. Read only.", strict: true, parameters },
  ];
}

function executeTool(name, caseId) {
  const record = getSyntheticCase(caseId);
  if (!record) throw new Error("unknown_case");
  if (name === "load_case_evidence") {
    return { caseId: record.id, title: record.title, owner: record.owner, description: record.description, source: record.source, target: record.target };
  }
  if (name === "compare_case_fields") return compareSyntheticCase(caseId);
  if (name === "get_governance_policy") {
    return { caseId: record.id, controls: record.policy.map((text, index) => ({ evidenceId: `policy:${index + 1}`, text })), writeAccess: false };
  }
  throw new Error("tool_not_allowed");
}

function safeJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function outputText(payload) {
  if (typeof payload?.output_text === "string") return payload.output_text;
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (content?.type === "output_text" && typeof content.text === "string") return content.text;
    }
  }
  return "";
}

function validateAnalysis(value, allowedEvidence) {
  const recommendations = new Set(["accept_match", "reject_match", "escalate"]);
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid_model_output");
  if (!recommendations.has(value.recommendation)) throw new Error("invalid_model_output");
  if (!Number.isInteger(value.confidence) || value.confidence < 0 || value.confidence > 100) throw new Error("invalid_model_output");
  if (typeof value.summary !== "string" || !value.summary.trim() || value.summary.length > 700) throw new Error("invalid_model_output");
  for (const key of ["supportingEvidence", "conflictingEvidence", "missingEvidence"]) {
    if (!Array.isArray(value[key]) || value[key].length > 8 || value[key].some((item) => typeof item !== "string")) throw new Error("invalid_model_output");
  }
  const cited = [...value.supportingEvidence, ...value.conflictingEvidence];
  if (cited.some((item) => !allowedEvidence.has(item))) throw new Error("unsupported_evidence_reference");
  if (value.humanReviewRequired !== true || value.decisionBoundary !== DECISION_BOUNDARY) throw new Error("invalid_decision_boundary");
  return value;
}

async function openAiRequest(config, body, fetchImpl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const result = await fetchImpl(`${config.baseUrl}/responses`, {
      method: "POST",
      signal: controller.signal,
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!result.ok) throw new Error(`model_provider_${result.status}`);
    return result.json();
  } finally {
    clearTimeout(timeout);
  }
}

function guidedAnalysis(caseId) {
  const comparison = compareSyntheticCase(caseId);
  const supporting = comparison.comparisons.filter((item) => item.status === "match").map((item) => item.evidenceId).slice(0, 4);
  const conflicting = comparison.comparisons.filter((item) => item.status === "difference").map((item) => item.evidenceId).slice(0, 4);
  const critical = comparison.ruleSummary.criticalDifferences;
  return {
    recommendation: comparison.ruleSummary.recommendation,
    confidence: comparison.ruleSummary.confidence,
    summary: critical
      ? `Deterministic review found ${critical} critical difference${critical === 1 ? "" : "s"}. The case should be escalated to the named owner.`
      : "The normalized evidence aligns strongly enough to recommend a match, subject to authorized human review.",
    supportingEvidence: supporting,
    conflictingEvidence: conflicting,
    missingEvidence: [],
    humanReviewRequired: true,
    decisionBoundary: DECISION_BOUNDARY,
  };
}

async function runLiveAgent(caseId, config, fetchImpl) {
  const tools = toolDefinitions();
  const instructions = [
    "You are the bounded HR1 exception-review assistant.",
    "Use only the supplied synthetic-case read tools. Never infer protected traits or invent evidence.",
    "Call the tools needed to inspect the case, then return a recommendation supported only by evidenceId values from tool results.",
    "You cannot change a record. Human review must always be required.",
  ].join(" ");
  const first = await openAiRequest(config, {
    model: config.model,
    store: true,
    instructions,
    input: `Analyze allowlisted synthetic case ${caseId}. Use read-only tools before recommending accept_match, reject_match, or escalate.`,
    tools,
    tool_choice: "required",
    parallel_tool_calls: true,
    max_output_tokens: 700,
  }, fetchImpl);
  const allRequested = (first.output || []).filter((item) => item.type === "function_call");
  if (!allRequested.length || allRequested.length > MAX_MODEL_TOOL_CALLS) throw new Error("tool_limit_exceeded");
  const requested = allRequested.slice(0, MAX_MODEL_TOOL_CALLS);
  const selectedNames = new Set(requested.map((item) => item.name));
  const requiredNames = ["load_case_evidence", "compare_case_fields", "get_governance_policy"];
  const calls = [...requested];
  for (const name of requiredNames) {
    if (!selectedNames.has(name)) calls.push({ call_id: `policy_${name}`, name, arguments: JSON.stringify({ caseId }), selectedBy: "policy" });
  }
  const trace = [];
  const policyResults = [];
  const toolOutputs = [];
  calls.forEach((call) => {
    const args = safeJson(call.arguments);
    if (!args || args.caseId !== caseId) throw new Error("invalid_tool_arguments");
    const output = executeTool(call.name, caseId);
    trace.push({ tool: call.name, status: "completed", selectedBy: call.selectedBy || "model", writeAccess: false });
    if (call.selectedBy === "policy") policyResults.push({ tool: call.name, output });
    else toolOutputs.push({ type: "function_call_output", call_id: call.call_id, output: JSON.stringify(output) });
  });
  if (policyResults.length) {
    toolOutputs.push({ role: "user", content: `Required read-only policy checks also returned: ${JSON.stringify(policyResults)}` });
  }
  const second = await openAiRequest(config, {
    model: config.model,
    store: true,
    previous_response_id: first.id,
    instructions,
    input: toolOutputs,
    tools,
    tool_choice: "none",
    text: { format: { type: "json_schema", name: "hr1_exception_analysis", strict: true, schema: ANALYSIS_SCHEMA } },
    max_output_tokens: 1000,
  }, fetchImpl);
  const parsed = safeJson(outputText(second));
  const comparison = compareSyntheticCase(caseId);
  const allowedEvidence = new Set([
    ...comparison.comparisons.map((item) => item.evidenceId),
    "policy:1",
    "policy:2",
    "policy:3",
  ]);
  return { analysis: validateAnalysis(parsed, allowedEvidence), trace, ruleSummary: comparison.ruleSummary };
}

async function requestJson(request) {
  if (typeof request?.json === "function") return request.json();
  if (typeof request?.body === "string") return JSON.parse(request.body);
  return request?.body || {};
}

function createInterviewHandlers(options = {}) {
  const env = options.env || process.env;
  const config = { ...configFromEnvironment(env), ...(options.config || {}) };
  const fetchImpl = options.fetchImpl || globalThis.fetch;
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
    if (request.method === "OPTIONS") return optionsResponse(request, env);
    return response(200, {
      status: "ready",
      mode: modelMode(config),
      cases: listSyntheticCases(),
      tools: ["load_case_evidence", "compare_case_fields", "get_governance_policy"],
      writeAccess: false,
      humanApprovalRequired: true,
    }, request, env);
  }

  async function analyze(request) {
    if (request.method === "OPTIONS") return optionsResponse(request, env);
    const origin = header(request, "origin");
    if (!allowedOrigin(origin, env)) return response(403, { error: "origin_not_allowed" }, request, env);
    if (rateLimited(ipAddress(request))) return response(429, { error: "rate_limit_exceeded" }, request, env);
    let body;
    try {
      body = await requestJson(request);
    } catch {
      return response(400, { error: "invalid_json" }, request, env);
    }
    const caseId = typeof body?.caseId === "string" ? body.caseId : "";
    const record = getSyntheticCase(caseId);
    if (!record) return response(400, { error: "unknown_case" }, request, env);
    const started = Date.now();
    const requestId = crypto.randomUUID();
    const mode = modelMode(config);
    try {
      const result = mode === "live-model"
        ? await runLiveAgent(caseId, config, fetchImpl)
        : (() => {
            const guidedTools = ["load_case_evidence", "compare_case_fields", "get_governance_policy"];
            guidedTools.forEach((name) => executeTool(name, caseId));
            return {
              analysis: guidedAnalysis(caseId),
              trace: guidedTools.map((tool) => ({ tool, status: "completed", selectedBy: "policy", writeAccess: false })),
              ruleSummary: compareSyntheticCase(caseId).ruleSummary,
            };
          })();
      logger.info("interview_analysis_completed", { requestId, caseId, mode, durationMs: Date.now() - started });
      return response(200, { requestId, caseId, mode, durationMs: Date.now() - started, ...result }, request, env);
    } catch (error) {
      logger.warn("interview_analysis_failed", { requestId, caseId, mode, reason: error.name === "AbortError" ? "timeout" : "model_or_validation_error" });
      return response(502, { error: "analysis_unavailable", requestId }, request, env);
    }
  }

  return { status, analyze };
}

module.exports = {
  createInterviewHandlers,
  guidedAnalysis,
  validateAnalysis,
  executeTool,
  configFromEnvironment,
  ANALYSIS_SCHEMA,
  DECISION_BOUNDARY,
  RATE_LIMIT,
};
