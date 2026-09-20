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
