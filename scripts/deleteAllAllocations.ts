import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteAllAllocations() {
  console.log('🗑️  Deleting ALL theatre allocations...\n');

  const snapshot = await getDocs(collection(db, 'theatreAllocations'));
  console.log(`Found ${snapshot.docs.length} allocations to delete\n`);

  let batch = writeBatch(db);
  let batchCount = 0;
  let deleteCount = 0;

  for (const docSnapshot of snapshot.docs) {
    batch.delete(doc(db, 'theatreAllocations', docSnapshot.id));
    batchCount++;
    deleteCount++;

    if (batchCount === 500) {
      console.log(`   Deleted ${deleteCount} allocations...`);
      await batch.commit();
      batch = writeBatch(db);
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(`\n✅ Successfully deleted ${deleteCount} allocations!\n`);
  process.exit(0);
}

deleteAllAllocations().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
