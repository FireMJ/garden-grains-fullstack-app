import admin from "firebase-admin";
import fs from "fs";

// Load service account key (downloaded from Firebase Console → Project Settings → Service Accounts)
const serviceAccount = JSON.parse(
  fs.readFileSync("serviceAccountKey.json", "utf8")
);

// Initialize Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// ✅ Toggle dry-run mode
const DRY_RUN = true;

const removeAddOns = async () => {
  console.log("🚀 Starting addOns cleanup with Admin SDK...");

  const snapshot = await db.collection("menuItems").get();

  let cleaned = 0;
  let skipped = 0;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();

    if (data.addOns && Array.isArray(data.addOns) && data.addOns.length > 0) {
      if (DRY_RUN) {
        console.log(`🔎 Would remove addOns from: ${data.name || docSnap.id}`);
        skipped++;
      } else {
        try {
          await docSnap.ref.update({
            addOns: admin.firestore.FieldValue.delete(),
          });
          console.log(`✔ Cleared addOns for: ${data.name || docSnap.id}`);
          cleaned++;
        } catch (err) {
          console.error(`❌ Failed to clear addOns for ${data.name || docSnap.id}`, err);
        }
      }
    }
  }

  console.log(
    DRY_RUN
      ? `✅ Dry run complete — ${skipped} docs would be affected`
      : `✅ Cleanup complete — ${cleaned} docs updated`
  );
};

removeAddOns().catch((err) => console.error("Cleanup failed:", err));
