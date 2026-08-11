# Garden & Grains

The Garden & Grains public restaurant site: an editorial, media-led Next.js experience inspired by Nkora's visual language.

## Active routes

- `/` — restaurant landing page, location details, and booking/order actions
- `/about` — Garden & Grains story and static `#ConstantiaMoment` gallery
- `/menu` — complete menu catalog

All other historical routes have been removed and return 404. The former account, commerce, payment, operational dashboard, and community-feed features can be restored from Git using [the restoration documentation](.docs/README.md).

## Run locally

```sh
npm ci
npm run dev
```

Novel bookings and gift cards use the public configuration in `src/site/config.ts`, so no Vercel environment values are required.

```sh
npm run lint
npm run build
```

See [AGENTS.md](AGENTS.md) for architecture rules and [the style guide](.docs/style-guide/README.md) for the design system.
