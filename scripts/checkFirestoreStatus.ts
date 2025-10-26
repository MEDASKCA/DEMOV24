import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

async function checkFirestoreStatus() {
  console.log('🔍 Checking Firestore Collections...\n');

  try {
    // Check theatre allocations
    const allocationsSnapshot = await getDocs(collection(db, 'theatreAllocations'));
    console.log(`📋 Theatre Allocations: ${allocationsSnapshot.docs.length} documents`);

    if (allocationsSnapshot.docs.length > 0) {
      // Group by date
      const dateMap = new Map<string, number>();

      allocationsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const date = data.date || 'unknown';
        dateMap.set(date, (dateMap.get(date) || 0) + 1);
      });

      console.log(`\n📅 Breakdown by date:`);
      const sortedDates = Array.from(dateMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

      sortedDates.forEach(([date, count]) => {
        console.log(`   ${date}: ${count} allocations`);
      });

      console.log(`\n📊 Total dates: ${dateMap.size}`);
      console.log(`📊 Total allocations: ${allocationsSnapshot.docs.length}`);
      console.log(`📊 Expected per day: 26 (12 Main + 14 DSU)`);
    }

    // Check staff profiles
    const staffSnapshot = await getDocs(collection(db, 'staffProfiles'));
    console.log(`\n👥 Staff Profiles: ${staffSnapshot.docs.length} documents`);

  } catch (error) {
    console.error('❌ Error:', error);
  }

  process.exit(0);
}

checkFirestoreStatus().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
