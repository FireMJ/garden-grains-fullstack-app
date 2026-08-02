# Firestore Constantia Moment feed

## Original implementation

The old About page subscribed to `moments` and `comments` Firestore collections through `src/services/momentService.ts`. Visitors could publish text and a locally previewed image, filter and sort posts, like moments, open comment dialogs, and add comments. Snapshot listeners provided live updates and increment operations maintained counts.

Despite Instagram-inspired language, this was a first-party Firestore community feed, not an Instagram API embed.

## Current replacement

The active About page contains a static editorial `#ConstantiaMoment` gallery made from local media and a direct Instagram follow link. It has no Firebase dependency or interactive social state.

## Restore it

1. Restore `momentService`, its types, the interactive About sections, and Firebase initialization from `20d2ce5`.
2. Define and secure `moments` and `comments` collections. Add authentication, upload validation, moderation, abuse controls, and server-side limits before accepting public content.
3. Replace base64 image previews with a real upload pipeline if image persistence is required.
4. Ensure an unavailable Firebase project produces a deliberate empty/error state rather than an endless loader.
5. Test subscription cleanup, empty states, ordering, filtering, duplicate likes, comment counts, rejected writes, and moderation.

