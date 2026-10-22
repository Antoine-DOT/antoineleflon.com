# antoineleflon.com

Source of my personal site: https://antoineleflon.com

I'm Antoine Leflon. I work in cybersecurity, infrastructure and project
management. The site covers my background, ATL (my freelance activity) and ATL-Lab, the home lab
where I self-host my projects, including this site.

## Stack

- React + Vite, Tailwind, plain JavaScript
- Bilingual (French / English), with language-aware routes and per-page
  metadata generated at build time
- Fully static: no backend, no database, no analytics

## Run it locally

Requires Node 22 (see `.nvmrc`).

```bash
npm ci
npm run dev      # http://localhost:3000
npm run lint
npm test
npm run build    # output in dist/apps/web
```

## How it is deployed

The site is not on a hosting platform. It runs in my home lab:

- a reverse proxy terminates TLS (Let's Encrypt) and is the only public entry point;
- the site itself is served by Nginx from a small, unprivileged container with
  no public port;
- each release is a static build named after its Git commit. It is pushed over
  SSH to an account that can do only one thing: receive a release, check it,
  and switch to it atomically. That account has no shell access, no sudo and
  no forwarding.

Details, scripts and the Nginx config are in [`infrastructure/`](infrastructure/).
Internal addresses and firewall rules are left out on purpose.

## Layout

```text
apps/web/src/      pages, components, bilingual content
apps/web/public/   static assets, resume, sitemap, robots, llms.txt
apps/web/tools/    build-time metadata and llms.txt generation
infrastructure/    release build, restricted deployment, Nginx config
```
