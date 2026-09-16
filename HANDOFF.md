# Claim the Curb / Curb Claim — programmer handoff

Date: 2026-09-15
Owner GitHub: https://github.com/calvin692/claimthecurb
Domains: https://www.claimthecurb.ca and https://www.claimthecurb.com

This repo is the public marketing site. It is **not** the original hosted map app (TanStack + Leaflet + PGLite). That project lived in a separate Grok App Builder session.

## Product

Youth teams walk streets for bottles and cans. Shared map so the next crew skips what you already picked up.

1. Pick city
2. Tap neighbourhood
3. Tap streets (or draw a box)
4. Tap **I picked these up**

Orange = bottles already gone. A hold for Saturday is only a handshake. Collection is the source of truth.

## Missing full app (rebuild from this)

- TanStack Start / Router / Query, React 19, Tailwind
- Leaflet, preferCanvas, OSM tiles https://tile.openstreetmap.org/{z}/{x}/{y}.png, Esri fallback
- Do not use Carto light_all (paints API KEY REQUIRED)
- reportCollected overwrites a reservation
- Street polygons/squares, not circles
- Odd / even / both sides
- Neighbourhoods load first; streets when a hood opens
- Disputed hatch, Team Pro heatmap, creator full Pro, 5 streets free then Pro
- Welcome overlay must have See the map

## Access — there are no production passwords

| Item | Value |
|---|---|
| Beta tester code | HAUL-7N3Q |
| GitHub | calvin692/claimthecurb |
| Map tiles | OSM + Esri, no key |
| Mail CTAs | hello@claimthecurb.ca / hello@claimthecurb.com |

No API keys, database URLs, or admin logins exist. Do not invent them. Put future secrets in host env vars, never in git.

## Domains

Cloudflare Pages connected to this repo. Framework none. Output `/`. Attach www and apex for .com and .ca.

## First jobs

1. Recreate or recover the map app
2. Point Get the map at that URL
3. Shared backend so two phones see the same orange streets
4. Keep the first screen non-technical
