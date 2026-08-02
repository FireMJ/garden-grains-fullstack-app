# Restoration runbook

Baseline: `20d2ce5` (`adding media`). Always restore on a branch and review the baseline diff before copying files.

## Historical surface map

| Capability | Original routes | Providers, services, and key paths | Main packages |
| --- | --- | --- | --- |
| Customer identity | `/login`, `/signup`, `/forgot-password`, `/dashboard`, `/profile/*` | `src/context/AuthContext.tsx`, `src/components/FirebaseProvider.tsx`, `src/lib/firebase.ts` | `firebase`, `@firebase/auth`, `@firebase/firestore`, `@firebase/storage` |
| Cart and fulfillment | `/cart`, `/checkout`, `/order`, `/orders/*`, `/order-tracking/*` | `src/context/CartContext.tsx`, `src/services/orderService.ts`, `src/lib/deliveryCalculator.ts` | Firebase, Google Maps, Axios |
| Payments | `/payment/*`, `/api/payment/*`, `/api/vodapay/*` | `src/context/PaymentContext.tsx`, `src/lib/payment/vodapay.ts`, `src/lib/vodapay/*` | Axios plus the gateway SDK/API contract |
| Staff operations | `/driver`, `/kitchen`, `/restaurant`, `/admin/*` | `src/context/DriverContext.tsx`, `src/hooks/useRealtimeOrders.ts`, staff navigation and order components | Firebase |
| Public forms and content | `/reserve`, `/contact`, `/reviews`, `/catering`, `/faq` | `src/app/api/send-reservation/route.ts`, `src/app/api/reviews/route.ts`, public page components | Resend and Firebase where used |
| Constantia Moment feed | former interactive sections within `/about` | `src/services/momentService.ts` and Firebase initialization | Firebase/Firestore |

The historical root layout mounted authentication, cart, user-data, payment, driver, and Firebase concerns around broad parts of the application. Restore providers only around the routes that consume them.

## Historical data flow

1. Firebase Auth established the customer or staff identity and Firestore supplied role/profile state.
2. Category and item-detail pages assembled configurable products and wrote them to `CartContext` and browser persistence.
3. Checkout resolved a delivery address through Google Places, calculated fees, and persisted an order through `orderService`.
4. Payment routes initiated VodaPay or Yoco work, then callbacks/webhooks updated order state.
5. Kitchen, restaurant, driver, and admin screens subscribed to Firestore order changes and advanced operational statuses.
6. The old About feed separately subscribed to moment/comment collections and issued like, post, and comment writes.

## Historical environment inventory

Only restore variables needed by the selected capability. The baseline referenced `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, VodaPay sandbox/production identifiers, `YOCO_SECRET_KEY`, `RESEND_API_KEY`, `JWT_SECRET`, public app/base URLs, an email domain, and a Google Analytics measurement ID.

Values prefixed `NEXT_PUBLIC_` are bundled into browser code. Payment secrets, JWT signing material, mail credentials, admin credentials, and webhook verification material must remain server-only and must never be recovered from historical files.

## Procedure

1. Identify the feature guide and list its routes, providers, APIs, services, data, environment variables, and packages.
2. Inspect a historical file with `git show 20d2ce5:path/to/file` or restore a tree with `git restore --source 20d2ce5 -- path/to/tree`.
3. Reconcile restored code with the current three-route shell, Next.js version, shared menu catalog, and current package versions.
4. Restore environment placeholders, Firestore rules/indexes, and server-only credential handling where required.
5. Add authorization and validation before exposing restored writes or staff tools.
6. Run the production build, start a no-secrets public-site smoke test, then test the restored feature with isolated non-production services.

Examples for inspecting exact baseline files without restoring a whole tree:

```sh
git show 20d2ce5:src/context/CartContext.tsx
git show 20d2ce5:src/services/orderService.ts
git show 20d2ce5:src/app/api/send-reservation/route.ts
git show 20d2ce5:firestore.rules
```

When restoring files, create their parent directories first and use `git restore --source 20d2ce5 -- <path>` so the change stays reviewable in the working tree.

## Compatibility rules

- Do not replace the active root layout with the historical provider stack. Mount providers around the smallest route group that needs them.
- Do not introduce a second menu source. Extend or deliberately migrate the shared catalog.
- Do not put payment, email, Firebase Admin, or webhook secrets in `NEXT_PUBLIC_*` variables.
- Preserve `/`, `/about`, and `/menu` behavior while restoring a feature.
- Add the restored capability and its verification steps to `AGENTS.md` and this documentation index.

## Security review before enabling writes

- Revalidate every API body server-side and add rate limiting to public forms.
- Authorize staff actions on the server or in Firestore rules; hiding UI is not authorization.
- Verify payment signatures and webhook replay/idempotency behavior before changing order state.
- Restrict Firestore collections by ownership and role, and test the rules with the emulator.
- Review stored personal data, retention, logging, and error payloads before enabling accounts or delivery.
- Use non-production projects and gateway sandboxes until every smoke test passes.

## Smoke checklist

- Public pages still render at mobile, tablet, and desktop widths.
- Restored routes reject unauthorized users.
- Missing optional configuration cannot crash unrelated public pages.
- API validation and failure responses are visible and do not expose secrets.
- Data writes, retries, callbacks, and real-time listeners are idempotent where required.
