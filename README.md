# Microsoft AI Applications Integration Workbench

A working higher-education prototype demonstrating how governed AI can connect enterprise systems, assist human decisions, and create auditable workflows.

The included SIS Data Reconciliation scenario is illustrative. It does not assert that any institution is migrating between PeopleSoft, Banner, or another named platform.

## What the prototype demonstrates

- A business-first explanation of the operational value in plain language.
- Three concrete use cases with explicit pain points, personas, triggers, evidence sources, accountable decision owners, controls, and success measures: student record disputes, online course/refund review, and recruiter candidate triage.
- A CTO architecture covering enterprise APIs, Azure integration, deterministic rules, exception-only AI, human approval, supported SIS writeback, Microsoft 365 workflows, and analytics.
- A simulated live multi-source dashboard showing example system location, connection method, freshness, volume, and recent data activity.
- A fictional exception queue with source/target comparison, confidence, evidence, and accountable decisions.
- A browser-local audit trail with reviewer, rationale, timestamp, and CSV export.
- An optional live Microsoft 365 connector using Entra delegated sign-in and Microsoft Graph read-only access to the signed-in profile and OneDrive metadata.
- A Security Assurance module with a public sanitized scan summary and an administrator-only scan workflow backed by a server-side Azure Function proxy.
- A clear control boundary: the system of record remains authoritative and AI never independently changes institutional records.

## Run locally

The project has no runtime dependencies.

```bash
npm run check
npm run build
python3 -m http.server 5173
```

Open `http://localhost:5173`.

## Project structure

- `index.html`, `styles.css`, and `app.js` are the source application.
- `scripts/build.sh` copies the deployable source into `dist/` and adds content hashes to asset URLs so each deployment bypasses stale caches.
- `scripts/verify.mjs` verifies required product language and rejects misleading architecture language.
- `.github/workflows/deploy.yml` validates and deploys `main` to Hetzner.
- `deployment/` contains the Caddy site configuration and production runbook.

## Production target

The intended public URL is `https://hr1.iavva.ai`, proxied through Cloudflare and served by Caddy on Hetzner. GitHub Actions publishes immutable commit-based releases and atomically changes the active release.

See [deployment/README.md](deployment/README.md) for required access, GitHub secrets, DNS/TLS setup, and rollback instructions. Use scoped tokens and deployment keys; never commit or send account passwords.

## Security Assurance architecture

The public route is [Security Assurance](https://hr1.iavva.ai/#security-assurance). The static HR1 frontend calls only `GET /api/security/status` when the page loads. It never starts a scan automatically. `POST /api/security/scan` is administrator-only and is protected by Entra token validation, the `SecurityAssurance.Admin` role, same-origin checks, a double-submit CSRF token, and rate limiting.

The Rafter integration belongs in `api/`, not in the browser bundle. The Azure Function reads `RAFTER_API_KEY` from its server runtime. In Azure, configure that setting as a Key Vault reference and grant the Function's managed identity `Key Vault Secrets User` access to the secret. Keep these server-side settings out of GitHub source, static artifacts, browser storage, and logs:

```text
RAFTER_API_BASE_URL
RAFTER_API_KEY
RAFTER_SITE_ID
RAFTER_PROJECT_ID
ENTRA_TENANT_ID
ENTRA_API_AUDIENCE
SECURITY_ASSURANCE_ADMIN_ROLE
APPLICATIONINSIGHTS_CONNECTION_STRING
```

The status proxy calls `GET /api/static/sites/:id` with the fixed `RAFTER_SITE_ID`. The scan proxy calls `POST /api/static/sites/scan` with the fixed project ID and only the `security` and `dns` sections. It returns sanitized status and finding counts only. Raw Rafter responses and detailed findings are never sent to public users.

The Teams or Power Automate critical-finding notification is proposed, not connected. The intended design is Azure Function or Logic App -> critical-count condition -> Teams security channel, with no secret or raw vulnerability payload in the notification.

Run the server-side tests with:

```bash
npm run test:security
```

The current production deployment is static Hetzner/Caddy hosting. The frontend module can deploy there, but the API requires a separately deployed Azure Function and Key Vault configuration before live Rafter status is available.

## Data and technology notes

All people and records in the demo are fictional. Microsoft Graph is used only for Microsoft 365 integration, workflow routing, Teams, SharePoint, and related M365 actions. Any writeback to an SIS must use that system’s supported API or integration service after authorized human approval.

The live Microsoft 365 panel is a browser-based delegated connector. Register the SPA redirect URI `https://hr1.iavva.ai/`, then use only the tenant ID and client ID in the panel. Never place a client secret or password in the browser.
