# AT&T AI Immersive Coach - HR1 live demonstration interview packet

This document is a truthful walkthrough of the repository as it exists. It does not attribute authorship, claim production integrations that are not configured, or use real HR/student data.

## Best presentation format: five acts

Keep the whole conversation on one memorable spine:

1. **Outcome:** “Reduce exception-handling time without surrendering human accountability.”
2. **Problem:** Evidence is fragmented; manual reconciliation is slow and inconsistent.
3. **Design:** Rules first, bounded AI second, human decision last.
4. **Proof:** Run one case, inspect one code path, run the tests.
5. **Judgment:** Name what is production-ready, what is a fixture, and what comes next.

Use dual-level narration throughout. Give the plain-English sentence first, then the technical proof:

> “The AI cannot change a record. Technically, the model receives only three read-only function tools, the trace marks `writeAccess: false`, and no system-of-record write endpoint exists.”

This lets a nontechnical interviewer understand the point while giving the technical leader enough evidence to drill deeper.

## “Tell me about yourself” — 60 seconds

Replace every bracket with a fact from your real resume. Do not invent tenure, employers, metrics, or ownership.

> “I’m a [current role or professional identity] with [verified years or scope] focused on [two relevant strengths: for example software delivery, AI enablement, technical training, or enterprise integration]. My strength is translating between business outcomes and engineering execution. In [real example], I [specific action] so that [measurable or observable result]. I work by making the problem clear, building a small testable path, and helping people understand not only what to do but why the controls matter. This HR1 workbench reflects that approach: deterministic validation, bounded AI tools, automated tests, and a human decision boundary. I’m interested in the AI Immersive Coach role because it combines hands-on technical credibility with facilitation—helping teams move from curiosity to safe, repeatable use of AI.”

If you cannot support a metric, describe the observable outcome without a number. Say “I led,” “I contributed,” or “I extended” only when each is accurate.

## Trainer/facilitator communication pattern

For every major concept, use **Define → Show → Translate → Check**:

1. **Define:** “Agentic means the model can choose a tool and use its result in a later reasoning step.”
2. **Show:** Open `runLiveAgent` and point to function tools, `function_call_output`, and the second response.
3. **Translate:** “That helps with ambiguous exceptions, but the allowlist prevents open-ended access.”
4. **Check:** “Would it help if I go deeper on the tool loop or on the governance boundary?”

If interrupted, answer in four sentences: direct answer, repository evidence, tradeoff, next step. Example:

> “No, this prototype does not have a database. The current state is synthetic code fixtures and browser-local storage. That makes the demo safe and portable but not suitable for durable enterprise audit. My next step would be an authenticated append-only audit store with retention and access policies.”

## How to address the three interview perspectives

| Interviewer perspective | What they need to see | Evidence to show |
|---|---|---|
| Technical leader | You can reason about architecture, APIs, security, testing, failure modes, and delivery | Architecture flow, `runLiveAgent`, `validateAnalysis`, negative tests, CI workflows |
| AI coach 1 | You can explain AI accurately without overwhelming learners | Define → Show → Translate → Check pattern; live-mode versus fixture labels |
| AI coach 2 | You can facilitate adoption and responsible behavior | Human-decision boundary, synthetic data, learner checks, fallback plan, gap matrix |
| Entire panel | You communicate clearly, command the room, and remain honest | Business-first opening, ten-minute structure, direct answers, explicit IMPLEMENTED/PARTIAL/NOT FOUND/UNKNOWN language |

Do not run three separate presentations. Tell one story and briefly change depth for the person asking the question.

## What to say first

> “I’ll demonstrate this as a governed AI integration workbench, not as an autonomous decision-maker. The business problem is fragmented evidence and slow exception handling. The engineering answer is deterministic validation first, bounded AI tools only for the residual ambiguity, strict output checks, and an authorized person making the final decision. I’ll show the architecture, run one synthetic case end to end, then prove the controls with tests.”

That opening serves both audiences: leaders hear the outcome and boundary; engineers hear the control strategy.

## Actual technology and status

| Area | Evidence | Status |
|---|---|---|
| Frontend | Vanilla HTML, CSS, and JavaScript in `index.html`, `styles.css`, `app.js` | IMPLEMENTED |
| Backend | Node.js CommonJS Azure Functions v4 registration in `api/src/index.js` | IMPLEMENTED |
| Local backend | Loopback-only Node adapter in `api/src/localServer.js` | IMPLEMENTED |
| AI path | OpenAI Responses API and function tools in `runLiveAgent` | IMPLEMENTED, configuration required |
| Deterministic fallback | `guidedAnalysis` and server/browser labels | IMPLEMENTED |
| Database | No database dependency or durable server-side store | NOT FOUND |
| Demo state | Browser `localStorage`; synthetic catalog in code | IMPLEMENTED, demo-only |
| Microsoft integration | Entra delegated sign-in plus Graph profile/OneDrive reads in `connectMicrosoft` and `graphGet` | PARTIAL |
| Security scanner | Server-side Rafter proxy in `createSecurityHandlers` | IMPLEMENTED, external configuration UNKNOWN |
| Enterprise source connectors/writeback | Architecture and illustrative adapters only | NOT FOUND |
| Automated tests | 14 API/security assertions in two Node test files | IMPLEMENTED |
| Browser E2E tests | No Playwright/Cypress suite | NOT FOUND |
| Deployment | Static Hetzner/Caddy workflow plus separate Azure Function workflow | IMPLEMENTED, current live state UNKNOWN |

## Architecture you can draw on a whiteboard

```text
User selects an allowlisted synthetic case
                 │ caseId only
                 ▼
Static browser UI (index.html + app.js)
                 │ POST /api/interview/analyze
                 ▼
Azure Function / local adapter
                 │
                 ├── deterministic comparison first
                 │
                 ├── guided fixture (no model configured)
                 │          or
                 └── Responses API agent loop
                        ├── load_case_evidence [read only]
                        ├── compare_case_fields [read only]
                        └── get_governance_policy [read only]
                                   │
                                   ▼
                     schema + evidence-ID validation
                                   │ recommendation only
                                   ▼
                      Human rationale and decision
                                   │
                                   ▼
                         Browser-local audit record
```

The production network path is browser → same-origin Caddy `/api/*` proxy → Azure Functions → model/tool or scanner provider. The system has no AI write tool.

## Two-minute architectural walkthrough

Use this almost word for word:

> “The frontend is a dependency-light static application: HTML for semantics, CSS for responsive presentation, and JavaScript for state and API orchestration. Its entry point is the `DOMContentLoaded` handler in `app.js`, which renders the workbench and checks the backend execution mode.
>
> “For this demo, the browser submits only an allowlisted synthetic case ID to `POST /api/interview/analyze`. The Node backend rejects arbitrary records, runs deterministic comparison first, and chooses a clearly labeled execution path. Without model configuration it uses a deterministic server fixture. With model configuration, `runLiveAgent` uses the Responses API and lets the model select only three read-only tools. Policy still forces every required check to run.
>
> “The second model response must satisfy a strict JSON schema. `validateAnalysis` rejects unsupported evidence IDs and requires the exact human-decision boundary. The frontend shows the tool trace and recommendation, but disables decision recording until a human adds rationale. The demo audit is intentionally browser-local; a production system would use an authenticated durable audit store.
>
> “Operationally, Caddy serves immutable static releases and proxies `/api` to Azure Functions. CI validates source, runs API tests, builds hashed assets, and validates the deployable artifact. The current repo has no enterprise database or live system-of-record writeback, and I state those gaps explicitly.”

## Ten-minute VS Code walkthrough

### 0:00–0:45 — Frame the outcome

Open `README.md` and say:

> “The problem is not ‘add a chatbot.’ It is reduce manual reconciliation while keeping the system of record and human owner authoritative.”

### 0:45–2:00 — Show the clean architecture

Open the browser at `http://localhost:5173`, click **Architecture**, and use the primary diagram first. Keep the six architecture lenses collapsed into supporting detail unless someone asks. Point left to right:

1. Authoritative source systems.
2. API and orchestration boundary.
3. Deterministic validation.
4. Bounded AI for exceptions.
5. Human approval, audit, and analytics.

Say:

> “Notice the trust boundary: AI recommends; it does not independently write to SIS, HR, recruiting, or finance systems.”

### 2:00–4:30 — Run the frontend scenario

Click **Governed AI demo**.

1. Point to the mode badge. Say exactly whether it is **Server guided fixture**, **Live model + tools**, or **Browser guided fixture**.
2. Choose **Payment exception**; it gives a clear escalation story.
3. Click **Analyze synthetic exception**.
4. Narrate the visible trace: allowlist validation → rules → read-only tools → schema validation.
5. Point to supporting/conflicting evidence and the human-decision boundary.
6. Enter: `Transaction type and reference conflict; route to Student Accounts for evidence review.`
7. Click **Escalate** and show the browser-local audit row.

Say:

> “This is deliberately synthetic. The recommendation does not become an action until a person records a rationale.”

### 4:30–6:45 — Trace the code

Use VS Code symbol search (`Ctrl+P`, then type the file/function):

1. `app.js` → `runInterviewAnalysis`: show the case-ID-only POST and frontend response-contract checks.
2. `api/src/index.js`: show the five HTTP route registrations.
3. `api/src/interviewAssistant.js` → `createInterviewHandlers`: show allowlisting, origin checks, rate limiting, request IDs, and safe errors.
4. Same file → `runLiveAgent`: show the bounded tools and two-stage Responses API flow.
5. Same file → `validateAnalysis`: show evidence citation and human-review enforcement.
6. `api/src/interviewCases.js` → `compareSyntheticCase`: show deterministic logic before AI.

### 6:45–8:15 — Prove it with tests

Run:

```bash
npm run test:security
```

Open `api/test/interviewAssistant.test.js`. Highlight the injected fake model response; say:

> “The live-model branch is tested without network calls or a real key. The tests prove tool bounds, strict output validation, origin rejection, unknown-case rejection, and fail-closed evidence handling.”

Then optionally run the Python black-box client:

```bash
python3 scripts/demo_interview_api.py
```

Say:

> “Python is an auxiliary API contract client here; the production backend is Node because Azure Functions and the existing repository use JavaScript.”

### 8:15–9:15 — Show delivery controls

Open `.github/workflows/deploy.yml`, `.github/workflows/deploy-security-api.yml`, and `deployment/Caddyfile.hr1`.

> “CI tests before building or deploying. Static releases are commit-addressed, activation is atomic, API deployment is separately gated, and the browser uses a same-origin proxy.”

### 9:15–10:00 — Close with judgment

> “What is complete is the demonstrable governed vertical slice. What remains before enterprise production is durable audit storage, distributed rate limiting, real source authorization, browser E2E tests, formal model evaluation, and environment verification. I would not confuse a strong prototype with a completed production platform.”

Then stop. Invite questions.

## Day-of preflight checklist

### Thirty minutes before

- Connect power and disable sleep/automatic updates.
- Close email, chat, password managers, cloud portals, and unrelated browser tabs.
- Make sure no `.env`, `local.settings.json`, tokens, or private records are visible.
- Set browser zoom to 90% or 100% and VS Code font large enough for screen sharing.
- Build once, run the 14 tests, and start the unified demo server.
- Forward only port `5173` if VS Code is remote.
- Open three prepared tabs: the demo, `api/src/interviewAssistant.js`, and `api/test/interviewAssistant.test.js`.
- Select the synthetic payment case but do not run it until the panel is watching.
- Keep the Word packet open on a second screen or printed; do not read it word for word.

### Commands

```bash
cd /root/HR
npm run check
npm run test:security
npm run build
npm run start:demo
```

### Your three recovery levels

1. **Normal:** server badge says **Server guided fixture** or **Live model + tools**; run the UI.
2. **API problem:** badge says **Browser guided fixture**; explicitly name the fallback and continue.
3. **Browser problem:** run `python3 scripts/demo_interview_api.py`, then show the passing unit tests and code path.

Never conceal the fallback. Explaining the designed failure path demonstrates stronger judgment than pretending everything is live.

## What success looks like to the panel

By the end, they should be able to repeat five points:

1. You start with a business and learner outcome, not a model.
2. You understand the difference between deterministic software, an LLM call, and an agentic tool loop.
3. You constrain AI with allowlists, read-only tools, schema checks, evidence validation, and human authority.
4. You prove behavior with tests and understand CI/CD and operational gaps.
5. You can teach the same concept at executive, beginner, and engineering depth.

## Commands to prepare and run

Linux paths are case-sensitive. The repository is `HR`, not `hr`.

### One-time preparation

```bash
cd /root/HR
code .
npm ci --prefix api
cp -n api/local.settings.example.json api/local.settings.json
```

Leave model values empty for the reliable server-guided demonstration. Never paste or display a key during screen sharing.

### Terminal 1 — unified website and backend

```bash
cd /root/HR
npm run build
npm run start:demo
```

Expected line: `HR1 demo website + API listening on http://localhost:5173`.

Open `http://localhost:5173/#interview-demo`.

### Terminal 2 — proof

```bash
cd /root/HR
npm run check
npm run test:security
npm run check:dist
python3 scripts/demo_interview_api.py
```

If a port is busy:

```bash
lsof -i :5173
lsof -i :7071
```

## 30 likely technical questions and evidence-based answers

1. **What is the frontend framework?** No framework: semantic HTML, responsive CSS, and browser JavaScript. Evidence: `index.html`, `styles.css`, and the `DOMContentLoaded` entry in `app.js`.

2. **What is the backend?** Node.js Azure Functions v4 using CommonJS. `api/package.json` points `main` to `src/index.js`; `api/src/index.js` registers the HTTP functions.

3. **Why no React?** The prototype does not require component-runtime complexity. The dependency-light frontend reduces build and supply-chain surface. For a larger team/product, component reuse and browser tests could justify a framework.

4. **What database does it use?** None. Synthetic cases are code fixtures; UI decisions use `localStorage` through `saveState` and `renderInterviewAudit`. Durable enterprise audit storage is not implemented.

5. **What are the API endpoints?** `security/status`, `security/csrf`, `security/scan`, `interview/status`, and `interview/analyze`, registered in `api/src/index.js` under the Azure Functions `/api` prefix.

6. **Walk me through one AI request.** `runInterviewAnalysis` posts an allowlisted ID. `createInterviewHandlers.analyze` validates origin/rate/case, runs deterministic tools, optionally calls `runLiveAgent`, validates output, and returns a request ID, trace, and recommendation.

7. **What makes this agentic?** Only live-model mode: the model can choose among function tools, receive their outputs, and produce a subsequent structured response. That loop is in `runLiveAgent`. A single prompt/response and both guided fixtures are not described as agentic.

8. **Which tools can the model use?** `load_case_evidence`, `compare_case_fields`, and `get_governance_policy`, defined by `toolDefinitions` and executed by `executeTool` in `api/src/interviewAssistant.js`.

9. **Can the agent mutate records?** No. No write tool exists; trace entries report `writeAccess: false`; output requires human review. Enterprise writeback is not implemented.

10. **How is the loop bounded?** `MAX_MODEL_TOOL_CALLS` is three, case IDs are enumerated, tools are strict, and the second model request sets `tool_choice: "none"`.

11. **How do you control hallucinations?** `validateAnalysis` permits only known recommendations, bounds confidence, validates arrays, rejects citations outside the computed evidence allowlist, and requires the exact decision boundary.

12. **Why deterministic rules before AI?** Exact comparisons are cheaper, testable, and explainable. `compareSyntheticCase` produces matches, differences, critical differences, confidence, and a recommendation before the model is used.

13. **What happens without a model key?** `modelMode` selects `guided-fixture`; the UI labels it **Server guided fixture**. If the API is absent, the UI labels **Browser guided fixture**. Neither is presented as model output.

14. **How are model secrets handled?** `configFromEnvironment` reads server environment variables. `OPENAI_API_KEY` is absent from frontend artifacts and is checked by `securityAssurance.test.js`. The runbook recommends ignored local settings and Azure Key Vault references.

15. **How is authentication implemented?** Admin security scans use Entra JWT verification through `createTokenVerifier`, remote JWKS, issuer/audience checks, and an application role. The synthetic interview analysis is public but tightly allowlisted and read-only.

16. **How is CSRF handled?** The admin scan uses origin validation plus a double-submit token from `security/csrf`; `createSecurityHandlers.scan` compares the cookie and `X-HR1-CSRF` header.

17. **How is CORS handled?** Production accepts the public origin; interview local origins are enabled only when `NODE_ENV` is `development` or `test`. See `allowedOrigin` in `interviewAssistant.js`.

18. **What prevents abuse?** Case allowlisting, small request shape, 16 KB local adapter body cap, upstream timeouts, tool limit, no write tools, and in-memory per-IP rate limiting. Distributed rate limiting remains a production gap.

19. **How are upstream errors exposed?** Handlers return generic codes such as `analysis_unavailable` or `status_unavailable` and log a request ID/category without raw provider responses or credentials.

20. **How is the AI branch tested without cost?** `interviewAssistant.test.js` injects `fetchImpl` and returns fake Responses API payloads. Tests cover tool calls and the structured second response without network access.

21. **What other tests exist?** `securityAssurance.test.js` covers status sanitization, documented response mapping, auth/role checks, CSRF, fixed scan payload, rate limiting, malformed results, upstream errors, and secret absence in static artifacts.

22. **What is not tested?** There is no automated browser E2E/visual-regression suite, load test, model-quality evaluation set, or deployed-environment integration test.

23. **How does the build work?** `scripts/build.sh` copies source/assets into `dist` and adds content hashes to CSS/JS URLs. `scripts/verify.mjs` checks required language and positioning.

24. **How is it deployed?** `.github/workflows/deploy.yml` builds static assets and atomically switches a Hetzner release. `.github/workflows/deploy-security-api.yml` tests and deploys `api/` to Azure Functions when enabled.

25. **How does routing work in production?** `deployment/Caddyfile.hr1` serves static files and reverse-proxies `/api/*` to Azure Functions, preserving same-origin browser requests.

26. **What Microsoft APIs are real?** `graphGet` calls Microsoft Graph `/me` and `/me/drive/root/children` after delegated MSAL sign-in. Broader Teams, SharePoint, SIS, LMS, HR, and finance integrations are architecture/design unless configured elsewhere.

27. **How do you address privacy?** Interview cases are explicitly synthetic, the browser sends only an allowlisted ID, no model tool can access arbitrary records, and outputs are not authoritative decisions. A real rollout would still require data classification, retention, legal review, and access audits.

28. **How do you observe a request?** The API creates a UUID request ID and logs completion/failure category, case ID, mode, and duration. Full distributed tracing/dashboard verification is not present.

29. **What does Git history prove?** It shows an incremental sequence of architecture and UI commits (`git log --oneline`). It establishes repository evolution, not who personally authored every line or whether every feature was production-operated.

30. **What would you build next?** Durable authenticated audit storage, distributed throttling, browser E2E tests, formal AI evals, and one authorized read-only enterprise connector before any controlled writeback.

## 10 likely coaching and behavioral questions

Use your own real example wherever brackets appear.

1. **Why this AI Immersive Coach role?** “It sits at the intersection where I add the most value: I can build and inspect the technology, explain it at the learner’s altitude, and turn responsible-AI principles into repeatable engineering behavior. This demo shows all three.”

2. **Why AT&T?** “The role calls for both technical depth and the ability to help people adopt AI through practical experiences. I am attracted to work where scale makes clarity, safety, APIs, testing, and change management equally important.” Do not add unverified claims about AT&T strategy.

3. **How do you teach a mixed technical/nontechnical audience?** “I use one shared business scenario, explain each concept in plain language, then offer technical depth as a second layer. I ask brief check questions and let advanced learners inspect code without losing beginners.”

4. **How would you explain agentic AI to a beginner?** “A normal model call is question in, answer out. An agentic workflow can choose an approved tool, observe the result, and continue toward a goal. The important engineering work is limiting the tools, loop, data, and authority.”

5. **What do you do when a live demo fails?** “I name the failure accurately, move to the designed fallback, and preserve the learning objective. Here the badge distinguishes live model, server fixture, and browser fixture; then I prove the contract with an automated test.”

6. **How do you handle a skeptical engineer?** “I invite falsification. We inspect the boundary, run the negative tests, and review the exact gaps. I do not ask them to trust a slide when the code can prove or disprove the claim.”

7. **How do you keep learners engaged?** “I alternate explanation with prediction and action: ask what should happen, run the case, inspect why it happened, then change one small behavior. That turns a passive demo into a coached engineering experience.”

8. **How do you measure coaching effectiveness?** “I use behavior and outcome measures: can learners explain the boundary, complete the task without prompting, write a meaningful test, identify a risk, and transfer the pattern to a new use case? In a real program I would establish baseline and follow-up measures.”

9. **Tell us about influencing without authority.** Use STAR: **Situation** `[real cross-team constraint]`; **Task** `[shared outcome]`; **Action** `[how you listened, translated concerns, created evidence, and facilitated a decision]`; **Result** `[verified outcome]`; **Reflection** `[what you improved next time]`.

10. **What would your first 30/60/90 days look like?** “First 30: listen, learn the audience, governance, tooling, and success measures. By 60: co-facilitate and improve one hands-on module using learner evidence. By 90: independently lead an experience, publish reusable patterns, and report adoption, skill, and safety outcomes.”

## Risk and gap matrix

| Risk/gap | Status | Interview-safe statement | Next control |
|---|---|---|---|
| Real model configuration | UNKNOWN | Code path and injected tests exist; runtime key/model are environment-owned | Key Vault reference and environment smoke test |
| Durable audit | NOT FOUND | Current audit is browser-local and demonstrative | Authenticated append-only store with retention policy |
| Distributed rate limiting | PARTIAL | Per-process limiter is implemented | API gateway/Redis-backed limit |
| Browser E2E/visual regression | NOT FOUND | Responsive CSS and source checks exist | Playwright viewport/accessibility suite |
| Model quality evaluation | NOT FOUND | Contract/safety behavior is tested, not recommendation quality | Versioned evaluation dataset and thresholds |
| Enterprise connectors | PARTIAL | Graph read-only connector exists; other adapters are illustrative | One approved sandbox connector at a time |
| System-of-record writeback | NOT FOUND | Intentionally absent from AI tools | Separate authorized workflow after human approval |
| Admin scan authentication | IMPLEMENTED | Entra issuer/audience/role plus CSRF | Verify production app-role assignment |
| Secret management | PARTIAL | Server env design and artifact checks exist | Confirm deployed Key Vault references/rotation |
| Deployment state | UNKNOWN | Workflows and runbook exist | Validate environment, health, and rollback drill |
| Database | NOT FOUND | Not required for the synthetic vertical slice | Add only for durable workflow/audit requirements |

## Best small live Codex change

Ask Codex to add a deterministic `riskBand` (`low`, `medium`, `high`) to `compareSyntheticCase`, return it in the API rule summary, display it in the recommendation metadata, and add one backend assertion. This is safe because it uses synthetic data, introduces no write access, and touches backend, frontend, and automated testing.

Suggested prompt:

> “In the HR1 repository, add a deterministic riskBand to the synthetic interview workflow: high for any critical difference, medium for noncritical differences, low for no differences. Return it in ruleSummary, render it beside mode/request ID, and add tests. Do not change the model tools, authorization, or deployment. Run the relevant checks.”

Before the interview, practice the change once on a disposable branch. During the interview, narrate: inspect → state assumption → modify smallest surface → test → review diff.

Rollback only the demo change after reviewing the exact paths:

```bash
git diff -- app.js api/src/interviewCases.js api/test/interviewAssistant.test.js
git restore -- app.js api/src/interviewCases.js api/test/interviewAssistant.test.js
```

Do not run that rollback if those files contain other uncommitted work. The safer interview setup is a clean temporary branch created specifically for the live change.

## How to command the room

- Lead every technical detail with its business purpose: “To reduce manual review, I run rules first.”
- Use precise status words: “implemented,” “configured,” “simulated,” and “proposed” are different.
- Never apologize for a fixture. Say: “I designed a deterministic fallback so the demonstration is reliable, and I label it so there is no ambiguity.”
- After showing code, translate it: “That allowlist means the browser cannot send arbitrary employee or applicant records.”
- If interrupted, answer in this order: direct answer, evidence, tradeoff, next step.
- If something fails, keep control: identify the mode badge, use the browser-guided fallback, run the unit test, and explain the failure boundary.
- End answers cleanly. Do not fill silence after you have proven the point.

Final close:

> “This demonstrates how I coach teams to use AI responsibly: make the business outcome explicit, constrain the model with software, prove the controls with tests, keep the human accountable, and be honest about what remains before production.”
