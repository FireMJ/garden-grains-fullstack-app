# Authentication and customer accounts

## Original implementation

At `20d2ce5`, Firebase initialized in `src/lib/firebase.ts` and was exposed through `FirebaseProvider`. `AuthProvider` wrapped the application and coordinated Firebase Auth, role lookup, logout, password reset, and customer state.

Public account routes included `/login`, `/signup`, and `/forgot-password`. Signed-in customers used `/dashboard`, `/profile`, `/profile/edit`, `/profile/addresses`, and `/profile/notifications`. Headers and promotional components read authentication state to switch between sign-in actions and profile controls.

Required client configuration was supplied through the `NEXT_PUBLIC_FIREBASE_*` variables documented in the historical environment examples. Firestore stored user records and role information; some profile fields and addresses were also cached in browser storage.

## Why it was removed

The redesigned site sends orders to WhatsApp and has no signed-in customer experience. Keeping the providers would initialize Firebase on every public page and make local rendering depend on configuration unrelated to the active site.

## Restore it

1. Create a restoration branch and recover the auth context, Firebase wrapper, auth library, account routes, and account UI from `20d2ce5`.
2. Reinstall `firebase`, `@firebase/auth`, `@firebase/firestore`, and `@firebase/storage` at compatible versions.
3. Restore the Firebase variables to the environment examples and configure authorized domains in Firebase Console.
4. Wrap only the routes that need authentication. Do not make the editorial public pages depend on Firebase readiness.
5. Reconcile the restored header/profile entry points with the current site shell instead of replacing the shell wholesale.
6. Validate sign-up, sign-in, Google sign-in, password reset, profile updates, address persistence, sign-out, error states, and unauthorized redirects.

Example recovery:

```sh
git show 20d2ce5:src/context/AuthContext.tsx > src/context/AuthContext.tsx
git show 20d2ce5:src/app/login/page.tsx > src/app/login/page.tsx
```

Never restore production credentials from Git. Populate them through the deployment environment.

