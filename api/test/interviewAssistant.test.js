const assert = require("node:assert/strict");
const test = require("node:test");
const { createInterviewHandlers, DECISION_BOUNDARY } = require("../src/interviewAssistant");

function request(method, body = null, headers = {}) {
  return {
    method,
    headers: new Map(Object.entries(headers)),
    async json() {
      return body;
    },
  };
}

test("status reports guided fixture mode without exposing case evidence", async () => {
  const handlers = createInterviewHandlers({ env: { NODE_ENV: "test" } });
  const result = await handlers.status(request("GET"));
  assert.equal(result.status, 200);
  assert.equal(result.jsonBody.mode, "guided-fixture");
  assert.equal(result.jsonBody.writeAccess, false);
  assert.equal(result.jsonBody.humanApprovalRequired, true);
  assert.equal(result.jsonBody.cases.length, 3);
  assert.equal("source" in result.jsonBody.cases[0], false);
  assert.equal("target" in result.jsonBody.cases[0], false);
});

test("guided analysis uses only an allowlisted case and always requires human review", async () => {
  const handlers = createInterviewHandlers({ env: { NODE_ENV: "test" } });
  const result = await handlers.analyze(request("POST", { caseId: "SYN-TXN-002" }, { origin: "http://localhost:5173" }));
  assert.equal(result.status, 200);
  assert.equal(result.jsonBody.mode, "guided-fixture");
  assert.equal(result.jsonBody.analysis.recommendation, "escalate");
  assert.equal(result.jsonBody.analysis.humanReviewRequired, true);
  assert.equal(result.jsonBody.analysis.decisionBoundary, DECISION_BOUNDARY);
  assert.equal(result.jsonBody.trace.length, 3);
  assert.equal(result.jsonBody.trace.every((item) => item.writeAccess === false), true);
});

test("analysis rejects raw or unknown case input", async () => {
  const handlers = createInterviewHandlers({ env: { NODE_ENV: "test" } });
  const result = await handlers.analyze(request("POST", { caseId: "NOT-ALLOWLISTED", source: { private: "data" } }));
  assert.equal(result.status, 400);
  assert.deepEqual(result.jsonBody, { error: "unknown_case" });
});

test("analysis rejects an unexpected browser origin", async () => {
  const handlers = createInterviewHandlers({ env: { NODE_ENV: "production" } });
  const result = await handlers.analyze(request("POST", { caseId: "SYN-ID-001" }, { origin: "https://unexpected.example" }));
  assert.equal(result.status, 403);
  assert.deepEqual(result.jsonBody, { error: "origin_not_allowed" });
});

test("live model mode executes bounded read-only tools and validates structured output", async () => {
  const calls = [];
  const modelResult = {
    recommendation: "escalate",
    confidence: 66,
    summary: "Critical synthetic transaction fields disagree, so the accountable owner should review the case.",
    supportingEvidence: ["field:amount"],
    conflictingEvidence: ["field:reference", "field:type"],
    missingEvidence: [],
    humanReviewRequired: true,
    decisionBoundary: DECISION_BOUNDARY,
  };
  const fetchImpl = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    if (calls.length === 1) {
      return {
        ok: true,
        async json() {
          return {
            id: "resp-tool-selection",
            output: [{ type: "function_call", call_id: "call-compare", name: "compare_case_fields", arguments: JSON.stringify({ caseId: "SYN-TXN-002" }) }],
          };
        },
      };
    }
    return {
      ok: true,
      async json() {
        return { output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify(modelResult) }] }] };
      },
    };
  };
  const handlers = createInterviewHandlers({
    env: { NODE_ENV: "test" },
    config: { apiKey: "server-test-key", model: "test-model", baseUrl: "https://model.example.test/v1" },
    fetchImpl,
  });
  const result = await handlers.analyze(request("POST", { caseId: "SYN-TXN-002" }, { origin: "http://localhost:5173" }));
  assert.equal(result.status, 200);
  assert.equal(result.jsonBody.mode, "live-model");
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "https://model.example.test/v1/responses");
  assert.equal(calls[0].body.tool_choice, "required");
  assert.equal(calls[1].body.previous_response_id, "resp-tool-selection");
  assert.equal(calls[1].body.text.format.type, "json_schema");
  assert.equal(result.jsonBody.trace.some((item) => item.selectedBy === "model"), true);
  assert.equal(result.jsonBody.trace.every((item) => item.writeAccess === false), true);
  assert.equal(JSON.stringify(result.jsonBody).includes("server-test-key"), false);
});

test("unsupported model evidence is rejected with a safe error", async () => {
  let call = 0;
  const fetchImpl = async () => {
    call += 1;
    if (call === 1) {
      return {
        ok: true,
        async json() {
          return { id: "resp-unsafe", output: [{ type: "function_call", call_id: "call-evidence", name: "load_case_evidence", arguments: JSON.stringify({ caseId: "SYN-ID-001" }) }] };
        },
      };
    }
    return {
      ok: true,
      async json() {
        return {
          output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({
            recommendation: "accept_match",
            confidence: 99,
            summary: "Unsupported claim.",
            supportingEvidence: ["invented:evidence"],
            conflictingEvidence: [],
            missingEvidence: [],
            humanReviewRequired: true,
            decisionBoundary: DECISION_BOUNDARY,
          }) }] }],
        };
      },
    };
  };
  const handlers = createInterviewHandlers({
    env: { NODE_ENV: "test" },
    config: { apiKey: "server-test-key", model: "test-model", baseUrl: "https://model.example.test/v1" },
    fetchImpl,
  });
  const result = await handlers.analyze(request("POST", { caseId: "SYN-ID-001" }));
  assert.equal(result.status, 502);
  assert.equal(result.jsonBody.error, "analysis_unavailable");
  assert.equal("detail" in result.jsonBody, false);
  assert.equal(typeof result.jsonBody.requestId, "string");
});
