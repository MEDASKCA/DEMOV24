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

async function cleanupDuplicateAllocations() {
  console.log('🧹 Cleaning up duplicate theatre allocations...\n');

  // Fetch all allocations
  const allocationsSnapshot = await getDocs(collection(db, 'theatreAllocations'));
  console.log(`📋 Found ${allocationsSnapshot.docs.length} total allocations\n`);

  // Group by date to find duplicates
  const allocationsByDate = new Map<string, any[]>();

  allocationsSnapshot.docs.forEach(docSnapshot => {
    const allocation = { id: docSnapshot.id, ...docSnapshot.data() };
    const date = allocation.date;

    if (!allocationsByDate.has(date)) {
      allocationsByDate.set(date, []);
    }
    allocationsByDate.get(date)!.push(allocation);
  });

  console.log(`📅 Found allocations across ${allocationsByDate.size} different dates\n`);

  // Analyze duplicates
  let duplicateDates = 0;
  let totalToDelete = 0;

  for (const [date, allocations] of allocationsByDate.entries()) {
    // Count by theatre number and unit
    const theatreMap = new Map<string, any[]>();

    allocations.forEach(alloc => {
      const key = `${alloc.unit}-${alloc.theatreNumber}`;
      if (!theatreMap.has(key)) {
        theatreMap.set(key, []);
      }
      theatreMap.get(key)!.push(alloc);
    });

    // Check for duplicates
    const hasDuplicates = Array.from(theatreMap.values()).some(group => group.length > 1);

    if (hasDuplicates) {
      duplicateDates++;
      console.log(`🔍 Date ${date}: ${allocations.length} allocations`);

      theatreMap.forEach((group, key) => {
        if (group.length > 1) {
          console.log(`   ⚠️  Duplicate theatre ${key}: ${group.length} instances`);
          totalToDelete += group.length - 1; // Keep one, delete the rest
        }
      });
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   - Dates with duplicates: ${duplicateDates}`);
  console.log(`   - Total allocations to delete: ${totalToDelete}`);
  console.log(`   - Allocations to keep: ${allocationsSnapshot.docs.length - totalToDelete}\n`);

  // Ask for confirmation (in production, you'd want user input here)
  console.log('🗑️  Deleting duplicate allocations (keeping the most recent ones)...\n');

  let batch = writeBatch(db);
  let batchCount = 0;
  let deleteCount = 0;

  for (const [date, allocations] of allocationsByDate.entries()) {
    const theatreMap = new Map<string, any[]>();

    allocations.forEach(alloc => {
      const key = `${alloc.unit}-${alloc.theatreNumber}`;
      if (!theatreMap.has(key)) {
        theatreMap.set(key, []);
      }
      theatreMap.get(key)!.push(alloc);
    });

    // For each theatre, keep the most recent, delete the rest
    for (const [key, group] of theatreMap.entries()) {
      if (group.length > 1) {
        // Sort by updatedAt or createdAt, keep the newest
        group.sort((a, b) => {
          const aTime = new Date(a.updatedAt || a.createdAt).getTime();
          const bTime = new Date(b.updatedAt || b.createdAt).getTime();
          return bTime - aTime; // Descending order (newest first)
        });

        // Delete all but the first (newest) one
        for (let i = 1; i < group.length; i++) {
          batch.delete(doc(db, 'theatreAllocations', group[i].id));
          batchCount++;
          deleteCount++;

          // Commit every 500 deletes
          if (batchCount === 500) {
            console.log(`   ✅ Deleted ${deleteCount} duplicates so far...`);
            await batch.commit();
            batch = writeBatch(db);
            batchCount = 0;
          }
        }
      }
    }
  }

  // Commit remaining
  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(`\n✅ Successfully deleted ${deleteCount} duplicate allocations!`);
  console.log(`   Remaining allocations: ${allocationsSnapshot.docs.length - deleteCount}\n`);

  process.exit(0);
}

cleanupDuplicateAllocations().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
