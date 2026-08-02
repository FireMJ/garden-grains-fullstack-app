# Legacy public pages, forms, promotions, and navigation

## Removed surfaces

The rebuild removed `/reserve`, `/contact`, `/reviews`, `/faq`, `/catering`, API-status/debug/test pages, and their API routes. It also removed the previous white header, mobile side menu, cart badge, floating cart/call/menu/reserve/WhatsApp stack, new-customer discount, visit counter, banners, testimonials, reviews, and promotional controls.

Reservations previously posted to `/api/send-reservation` and sent formatted emails. At baseline, `/contact` was a standalone page and there was no separate contact submission API to restore. Reviews used `/api/reviews`; catering and FAQ were page-level surfaces. The floating controls coupled the homepage to auth, cart, promotions, and multiple legacy routes.

Novel now replaces the reservation page. Location/contact information lives on the homepage. Ordering uses the shared WhatsApp dialog.

## Restore a feature selectively

1. Recover only the requested page, API, components, and dependencies from `20d2ce5`; do not restore the old root header or provider tree by default.
2. Add a current-shell navigation entry only when the feature is meant to be publicly discoverable.
3. Restore required mail or persistence variables through deployment configuration and add placeholders to the examples.
4. Validate server-side input validation, spam/rate protection, failure messages, mobile layout, keyboard access, and submission success.

For the old navigation and floating controls, inspect `src/components/Header.tsx`, `src/components/MainHeader.tsx`, `src/components/CartDrawer.tsx`, `src/components/FloatingPromoButton.tsx`, and the inline homepage controls at the baseline. The reservation endpoint is `src/app/api/send-reservation/route.ts` and reviews used `src/app/api/reviews/route.ts`. Prefer adapting current shell actions over bringing the entire stack back.
