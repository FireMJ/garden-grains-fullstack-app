# Cart, checkout, orders, and payments

## Original implementation

The previous application used `CartProvider` and `src/context/CartContext.tsx` to keep products, quantities, add-ons, fries, juices, dressings, and totals in browser state and local storage. Menu category and detail routes pushed configured items into the cart.

The flow continued through `/cart`, `/checkout`, `/order`, `/payment`, `/order-confirmation`, `/orders`, and `/order-tracking/[id]`. Delivery used Google Places, geocoding, Cape Town bounds, restaurant coordinates, and distance-based fees. Firestore services persisted orders and powered real-time updates.

Payment integrations included VodaPay initiation, callback parsing, webhook routes, mock/test pages, and historical Yoco helpers. Order confirmation and receipt components formatted the completed transaction.

## Why it was removed

Orders now start in a lightweight shared menu dialog and continue in WhatsApp. There is no on-site cart, address validation, checkout, payment, order history, or tracking.

## Restore it

1. Recover the cart context, product option types, cart components, commerce routes, order services, delivery utilities, and payment API routes from `20d2ce5`.
2. Restore the category/detail pages only if on-site product configuration is required; the current catalog should remain the canonical display menu until data is deliberately migrated.
3. Reinstall Firebase, Google Maps, Axios, and payment dependencies. Restore Google Maps and gateway variables through deployment configuration.
4. Recreate Firestore rules/indexes for orders and test them against authenticated customer and staff roles.
5. Keep gateway credentials server-side. Only explicitly public test identifiers may use `NEXT_PUBLIC_*`.
6. Test empty carts, duplicate items, add-on quantities, pickup/delivery, invalid and out-of-range addresses, payment cancellation, callback replay, webhook verification, confirmation, and real-time order tracking.

Useful baseline paths include `src/context/CartContext.tsx`, `src/app/cart`, `src/app/checkout`, `src/app/order`, `src/app/payment`, `src/services/orderService.ts`, `src/lib/deliveryCalculator.ts`, and `src/lib/vodapay`.

