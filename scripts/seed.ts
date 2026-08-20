import { config } from "dotenv";
config({ path: ".env.local" });

import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { tradeOptions } from "../lib/constants";
import { applicationSeed, listingSeed, employerSeed } from "../lib/seed-data";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  console.error("Missing NEXT_PUBLIC_FIREBASE_* env vars — check .env.local");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let hadFailure = false;

async function seedCollection<T extends { id: string }>(label: string, items: T[], collectionName: string) {
  let ok = 0;
  for (const { id, ...rest } of items) {
    try {
      await setDoc(doc(db, collectionName, id), rest);
      ok++;
    } catch (err) {
      hadFailure = true;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ${collectionName}/${id}: ${message}`);
    }
  }
  console.log(`  ${label}: ${ok}/${items.length}`);
}

async function seed() {
  console.log(`Seeding project "${firebaseConfig.projectId}"...`);

  await seedCollection("listings", listingSeed, "listings");
  await seedCollection("applications", applicationSeed, "applications");
  await seedCollection("employers", employerSeed, "employers");

  try {
    await setDoc(doc(db, "meta", "config"), { trades: tradeOptions });
    console.log(`  trades: ${tradeOptions.length}`);
  } catch (err) {
    hadFailure = true;
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  ✗ meta/config: ${message}`);
  }

  console.log(hadFailure ? "Done, with some failures (see ✗ lines above)." : "Done.");
  process.exit(hadFailure ? 1 : 0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
