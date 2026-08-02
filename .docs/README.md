# Garden & Grains documentation

The active application is an editorial restaurant site with three routes: `/`, `/about`, and `/menu`. The full commerce and operations application that preceded this rebuild is preserved in Git at baseline commit `20d2ce5`.

## Active system

- [Style guide](style-guide/README.md) and [visual reference](style-guide/reference.html)
- Shared site configuration: contact details, operating hours, links, and navigation
- Shared menu catalog: the source for both `/menu` and the WhatsApp order dialog
- Novel booking widget and gift-card environment variables

## Removed features and restoration

- [Authentication and customer accounts](restoration/authentication-and-accounts.md)
- [Cart, checkout, orders, and payments](restoration/commerce-and-payments.md)
- [Driver, kitchen, restaurant, and admin operations](restoration/operations-dashboards.md)
- [Legacy public pages, forms, promotions, and navigation](restoration/legacy-public-features.md)
- [Firestore Constantia Moment feed](restoration/constantia-moments.md)
- [Restoration runbook](restoration/restoration-runbook.md)

The guides explain the previous data flow and dependencies. Restore from Git rather than copying undocumented fragments into the active app.

