# Garden & Grains agent guide

## Active product

This repository is an editorial restaurant website. The only active routes are `/`, `/about`, and `/menu`. Removed commerce, account, operational, and legacy public features are documented under [`.docs`](.docs/README.md) and remain recoverable from baseline commit `20d2ce5`.

## Architecture rules

- Keep contact details, hours, social links, directions, and navigation in `src/site/config.ts`.
- Keep `/menu` and the WhatsApp order dialog on the shared typed catalog in `src/site/menu-catalog.ts`. Never add a second menu source.
- Keep selected site media under `public/media/garden-grains` and untouched originals in its `archive` directory. `ambient-table.mp4` is intentionally stored but not rendered.
- Preserve the Nkora-derived design tokens and patterns in [the style guide](.docs/style-guide/README.md).
- Display copy uses the local display font; body copy uses Inter.
- Booking uses the manually opened Novel widget. Gift Cards uses the configured Novel URL.
- Missing Novel values must not crash the site; the corresponding visible CTA is a no-op.
- Orders leave the site through a prefilled `wa.me` message. Do not reintroduce cart or checkout behavior without following the restoration docs.
- Do not make the public pages depend on Firebase or other secrets.

## Commands

```sh
npm ci
npm run dev
npm run build
npm run lint
```

## Environment

Novel's public browser configuration lives in `src/site/config.ts`; the public pages do not require environment values. Never expose private payment, email, webhook, or administrative credentials.

## Documentation index

- [Documentation home](.docs/README.md)
- [Restoration runbook](.docs/restoration/restoration-runbook.md)
- [Style guide](.docs/style-guide/README.md)
- [Visual reference](.docs/style-guide/reference.html)
