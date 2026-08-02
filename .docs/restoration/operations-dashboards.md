# Operations dashboards

## Original implementation

The previous site included role-aware operational surfaces:

- `/driver` displayed assigned deliveries and driver actions.
- `/kitchen` consumed real-time orders for preparation workflows.
- `/restaurant` handled restaurant-facing order and pickup state.
- `/admin` and `/admin/drivers` managed staff-facing administration and driver applications.
- `AdminNavbar`, `StaffNavbar`, order tables, status badges, order cards, and notifier components supplied shared UI.

Firebase Auth and Firestore roles guarded parts of the flow. `useRealtimeOrders`, order services, driver registration APIs, Firestore rules, and an audio notification asset supported operations.

## Restore it

1. Restore authentication first, including authoritative role claims and server-side authorization checks.
2. Recover the four route groups, staff navigation, real-time hook, operational components, driver context, and driver/admin API routes from `20d2ce5`.
3. Restore Firestore collections, indexes, rules, and staff bootstrap scripts. Do not rely on client-side role checks alone.
4. Mount staff chrome separately from the public restaurant shell.
5. Test each role against allowed and forbidden routes, live order updates, status transitions, reconnect behavior, notification audio, driver registration, and concurrent changes.

Treat the historical dashboards as a starting point: review authorization and operational requirements before exposing them again.

