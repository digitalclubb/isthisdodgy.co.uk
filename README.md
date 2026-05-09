# isthisdodgy.co.uk

A free calm UK consumer tool that checks links, emails, phone numbers and text messages for common scam patterns. One paste. One plain-English answer.

## Stack

- SvelteKit (Svelte 5 runes) and TypeScript
- Vercel adapter (`@sveltejs/adapter-vercel`, Node 22)
- Biome for lint and format
- pnpm
- libphonenumber-js for phone parsing
- tldts for Public-Suffix-List domain extraction
- Bundled UK scam-pattern heuristics, disposable-email list, suspicious-TLD list and brand-impersonation map

## External data sources

All optional. The app degrades gracefully if a key is missing or a service is down.

| Source | Purpose | Key required |
|---|---|---|
| [RDAP](https://rdap.org) | Domain age | No |
| Node `dns` | Live DNS resolution | No |
| [OpenPhish](https://openphish.com/feed.txt) | Known phishing URLs (12h feed) | No |
| [StopForumSpam](https://www.stopforumspam.com) | Community-reported spam senders | No |
| [Google Safe Browsing v4](https://developers.google.com/safe-browsing/v4) | Malware and phishing flags | `GOOGLE_SAFE_BROWSING_KEY` |
| [URLhaus (abuse.ch)](https://urlhaus.abuse.ch/api/) | Known malware-distribution URLs | `URLHAUS_AUTH_KEY` |
| [EmailRep.io](https://emailrep.io) | Email reputation and breach history | `EMAILREP_KEY` (recommended) |
| [IPQualityScore](https://www.ipqualityscore.com/documentation/overview) | Fraud score for URL, email and phone | `IPQS_KEY` |

There is no free public API for crowd-sourced UK reported scam phone numbers. IPQualityScore's abuse-network score is the closest freely-available signal and is wired in when `IPQS_KEY` is set. We say so plainly on `/about`.

## Scripts

```bash
pnpm install
pnpm dev          # vite dev server
pnpm build        # vercel-targeted production build
pnpm preview      # serve the prerendered output
pnpm check        # svelte-check / TypeScript
pnpm lint         # biome check
pnpm format       # biome format --write
pnpm dlx tsx scripts/smoke-detect.ts   # offline detector smoke test
pnpm dlx tsx scripts/probe-live.ts     # live API probe (touches real services)
```

## Routes

- `/` one-page checker (form action, server-side `detect()`)
- `/api/check` JSON POST endpoint, same engine, 16KB body cap, 4000-char input cap
- `/scams`, `/scams/[slug]` hand-written UK scam-pattern explainers (prerendered, in sitemap)
- `/url/[domain]` on-demand domain verdict page (CDN cached 5 min, stale-if-error 1h)
- `/number/[number]` on-demand phone verdict page (CDN cached 24h)
- `/about`, `/privacy`, `/report`
- `/sitemap.xml`, `/robots.txt`

## Detection engine

`src/lib/detect/` is the deterministic core plus an async enrichment layer.

- `classify.ts` works out whether the input is a URL, email, phone or text.
- `url.ts`, `email.ts`, `phone.ts`, `text.ts` are sync heuristic checks. Each emits weighted `Reason`s tagged with `source: 'heuristic'` or `'pattern'`.
- `engine.ts` is the async orchestrator. Heuristics run synchronously, then enrichers run via `Promise.allSettled` with per-source timeouts. Each contributes `Reason`s tagged with the source name.
- `enrich/` holds one module per data source. Every enricher returns an `EnrichmentResult` with `failed` / `skipped` flags and never throws.
- `enrich/runner.ts` provides a single-flight cache, `safeFetch` (manual redirect handling, private-IP block list, response size cap) and the timeout runner.
- `verdict.ts` maps the total score into one of four levels (`safe` / `caution` / `suspicious` / `dodgy`) with deliberately hedged language.
- `data/` holds the bundled UK scam patterns, disposable-email list, high-risk-TLD list and impersonation map.

Set `DISABLE_ENRICHERS=1` to skip all network calls. Used by the offline smoke test.

## Privacy posture

Inputs are processed in memory and discarded. There is no database, no analytics on user input, no ads, no signup. When you check a link or email it may be passed to one of the sources above. The `/privacy` page lists every external service we contact.

## Security notes

- All outbound fetches go through `safeFetch` which manually handles redirects, validates the protocol, and refuses to connect to loopback / link-local / RFC1918 / cloud-metadata addresses on every hop.
- API keys go in headers, not URLs.
- All enrichers regex-validate input before constructing any external URL.
- Rate limits are upstream-only for now. Add a Vercel KV-backed limiter before publicising the JSON API.
