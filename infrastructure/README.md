# ATL-Lab deployment

## Validated repository state

The repository declares Node 22 in `.nvmrc`; production builds use Node 22 LTS
so local and CI environments agree. `npm ci`, `npm run lint`, and `npm run build` pass without
pre-existing dependencies.

The application is a bilingual French/English static React SPA. `/` resolves
the saved language or browser preference, explicit language routes remain stable,
and `/atl` always serves French. It has no backend, database, form endpoint, Hostinger
runtime dependency, or analytics. Public content is stored in
`apps/web/src/content.js`; shared layout and metadata live under `src/components`,
and page composition lives in `src/pages/SitePages.jsx`. Nginx uses its existing
SPA fallback for direct links, including `/fr/...` and `/en/...` routes.

Each page sets its own title, description, canonical URL and OpenGraph basics.
`public/sitemap.xml` lists only canonical routes. The resume is the existing
English PDF in `public`.

## Deployed web01 design

The site is self-hosted in ATL-Lab, my home lab (Proxmox, segmented VLANs,
default-deny firewall).

| Setting | Value |
| --- | --- |
| Type | unprivileged LXC |
| Hostname | web01 |
| Network | DMZ VLAN, no direct public exposure |
| Resources | 1 vCPU, 512 MiB RAM, 8 GiB disk |
| OS | Debian 12 (PVE 8.4.1 rejects the cached Debian 13.6 LXC template) |
| Runtime | Nginx only; no Node.js |
| Content | `/var/www/antoineleflon.com/releases/<commit>` + atomic `current` symlink |
| Logs | local Nginx access/error logs; bounded journal access through Observer |
| Monitoring | HTTP, Nginx service and `/.version`, read-only from Observer/monitor01 |
| Backup | Proxmox backup of the small CT and Git as source of truth; releases are reproducible |

Public traffic reaches web01 only through `proxy01`, a separate reverse proxy
in the same DMZ that terminates TLS. web01 has no public port and no inbound
route other than the proxy and the deployment key described below. A small LXC
was chosen over a full VM because the host's RAM is limited.

## Build

Use Node 22, then commit the intended source changes and run:

```bash
npm run build:release
```

The command performs a clean `npm ci`, lint, and build. It creates
`dist/apps/web/.version` with the full Git commit and a deterministic timestamp
derived from that commit. The build refuses tracked uncommitted changes.

## Restricted deployment

On web01, create an unprivileged `deploy` account with a locked password, no
sudo, and `/bin/sh` as its login shell. The shell is required because OpenSSH
executes a forced command through the account shell; the only authorized key is
restricted to that forced command, so no interactive session is available.
Install `infrastructure/web01/receive-release` as
`/usr/local/libexec/antoineleflon-receive-release`, owned by root and not
writable by `deploy`. Make `/var/www/antoineleflon.com` owned by `deploy`, and
force the dedicated public key in `authorized_keys`:

```text
restrict,command="/usr/local/libexec/antoineleflon-receive-release" ssh-ed25519 AAAA... antoineleflon-deploy
```

The forced command accepts only a tar stream, validates the release metadata,
installs an immutable commit-named directory and atomically changes `current`.
It offers no general remote shell, forwarding, PTY, agent forwarding, SCP or
SFTP. Deploy from the build machine with:

```bash
npm run build:release
DEPLOY_HOST=deploy@web01 bash infrastructure/deploy-release.sh
```

Pin web01's host key in the dedicated known-hosts file. Do not use
`StrictHostKeyChecking=no`.

Rollback is an explicit local action on web01 by an administrator: atomically
point `current` at a previously validated directory under `releases/`, run
`nginx -t`, and verify HTTP locally. The deploy key itself cannot choose an
arbitrary rollback target.

## Nginx and checks

Install the supplied server block, then validate before reload:

```bash
nginx -t
curl --fail --header 'Host: antoineleflon.com' http://127.0.0.1/
curl --fail --header 'Host: antoineleflon.com' http://127.0.0.1/.version
curl --fail --header 'Host: antoineleflon.com' http://127.0.0.1/a/future/spa/route
```

proxy01 terminates TLS with a production Let's Encrypt ECDSA certificate for
the apex and `www`. HTTP-01 renewal uses the fixed webroot
`/var/www/letsencrypt`; its dry run passes. The apex is canonical and both HTTP
and HTTPS `www` redirect to it.

## Publication state

The site is live at https://antoineleflon.com. The deployed version is
observable through `/.version`.
