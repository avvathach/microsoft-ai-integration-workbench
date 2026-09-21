# Microsoft AI Applications Integration Workbench

A working higher-education prototype demonstrating how governed AI can connect enterprise systems, assist human decisions, and create auditable workflows.

The included SIS Data Reconciliation scenario is illustrative. It does not assert that any institution is migrating between PeopleSoft, Banner, or another named platform.

## What the prototype demonstrates

- A business-first explanation of the operational value in plain language.
- A CTO architecture covering enterprise APIs, Azure integration, deterministic rules, exception-only AI, human approval, supported SIS writeback, Microsoft 365 workflows, and analytics.
- A simulated live multi-source dashboard showing example system location, connection method, freshness, volume, and recent data activity.
- A fictional exception queue with source/target comparison, confidence, evidence, and accountable decisions.
- A browser-local audit trail with reviewer, rationale, timestamp, and CSV export.
- An optional live Microsoft 365 connector using Entra delegated sign-in and Microsoft Graph read-only access to the signed-in profile and OneDrive metadata.
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

## Data and technology notes

All people and records in the demo are fictional. Microsoft Graph is used only for Microsoft 365 integration, workflow routing, Teams, SharePoint, and related M365 actions. Any writeback to an SIS must use that system’s supported API or integration service after authorized human approval.

The live Microsoft 365 panel is a browser-based delegated connector. Register the SPA redirect URI `https://hr1.iavva.ai/`, then use only the tenant ID and client ID in the panel. Never place a client secret or password in the browser.
