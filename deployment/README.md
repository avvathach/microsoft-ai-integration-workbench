# Production deployment

The production topology is Cloudflare → the existing Docker-based Caddy proxy on Hetzner → static files in `/var/www/hr1.iavva.ai/current`. That host directory is mounted read-only in the Caddy container at `/srv/hr1`.

## Access required

Do not share account passwords. Configure:

- GitHub authorization for the `avvathach` account.
- An unprivileged Hetzner SSH deployment user that can write only to `/var/www/hr1.iavva.ai`.
- A Cloudflare API token limited to DNS editing for the `iavva.ai` zone.

The GitHub `production` environment needs these secrets:

- `HETZNER_HOST`: server IPv4/IPv6 address or administrative hostname.
- `HETZNER_SSH_PORT`: normally `22`.
- `HETZNER_SSH_USER`: restricted deployment user.
- `HETZNER_SSH_PRIVATE_KEY`: private half of a dedicated deployment key.
- `HETZNER_SSH_KNOWN_HOSTS`: pinned output for the server from `ssh-keyscan`, verified against the host fingerprint before saving.

## One-time Hetzner setup

1. Create `/var/www/hr1.iavva.ai/releases` and grant the deployment user ownership of `/var/www/hr1.iavva.ai` only.
2. Add `deployment/Caddyfile.hr1` to the server’s existing Caddy configuration without replacing other site blocks.
3. Validate with `caddy validate --config /etc/caddy/Caddyfile`, then reload Caddy.
4. Push `main`, confirm the workflow creates a release, and verify that `current` points to it.

Caddy obtains and renews the public origin certificate. Cloudflare SSL/TLS mode must be **Full (strict)**. Keep ports 80 and 443 reachable by Cloudflare and certificate validation.

## Cloudflare DNS

Create one proxied record in the `iavva.ai` zone:

| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| A or AAAA | `hr1` | Hetzner server address | Proxied |

Enable **Always Use HTTPS**. Do not use Flexible SSL.

The repository also includes a manual **Configure Cloudflare DNS** GitHub workflow. Add a production-environment secret named `CLOUDFLARE_API_TOKEN`, then run the workflow with the Hetzner public IPv4 address. The token should have `Zone / DNS / Edit` and `Zone / Zone / Read` permissions for only the `iavva.ai` zone.

## Rollback

Each GitHub commit is stored as a separate release. To roll back, atomically repoint `current` to a verified earlier directory:

```bash
cd /var/www/hr1.iavva.ai
ln -sfn releases/PREVIOUS_COMMIT current.next
mv -Tf current.next current
```

No Caddy reload is required for content-only deployments or rollbacks.

## Security Assurance API

The static Hetzner deployment does not run server-side application code. Deploy `api/` as a separate Azure Functions Node.js v4 app before enabling live Rafter status. Put the Function behind Azure API Management or an equivalent protected API boundary and route the frontend's fixed `/api/security` path to the API origin through the production proxy.

Required Azure Function settings are:

- `RAFTER_API_BASE_URL`
- `RAFTER_API_KEY`
- `RAFTER_SITE_ID`
- `RAFTER_PROJECT_ID`
- `ENTRA_TENANT_ID`
- `ENTRA_API_AUDIENCE`
- `SECURITY_ASSURANCE_ADMIN_ROLE`
- `APPLICATIONINSIGHTS_CONNECTION_STRING`

Set `RAFTER_API_KEY` as an Azure Key Vault reference, for example `@Microsoft.KeyVault(SecretUri=https://<vault>.vault.azure.net/secrets/<secret-name>/)`, and grant the Function managed identity permission to read that secret. Never add the key to GitHub secrets for frontend builds, static artifacts, browser storage, logs, or source control.

Routes:

- `GET /api/security/status`: public sanitized status only.
- `GET /api/security/csrf`: short-lived CSRF token for the administrator flow.
- `POST /api/security/scan`: Entra-authenticated administrator endpoint; fixed HR1 project and security/DNS sections only.

The API emits safe scan lifecycle events to Application Insights. It does not log API keys, tokens, raw Rafter responses, or vulnerability details. The Teams or Power Automate critical-finding notification remains proposed until a Logic App or flow is separately approved and configured.
