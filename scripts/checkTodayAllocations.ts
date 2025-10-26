import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

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

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

async function checkTodayAllocations() {
  const today = formatDate(new Date());
  console.log(`📅 Checking allocations for ${today}...\n`);

  const q = query(
    collection(db, 'theatreAllocations'),
    where('date', '==', today)
  );

  const snapshot = await getDocs(q);
  console.log(`Found ${snapshot.docs.length} allocations for today\n`);

  const allocs = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Group by unit and theatre number
  const mainTheatres = allocs.filter((a: any) => a.unit === 'main');
  const dsuTheatres = allocs.filter((a: any) => a.unit === 'acad');

  console.log(`Main Theatres: ${mainTheatres.length}`);
  console.log(`DSU Theatres: ${dsuTheatres.length}`);
  console.log(`Total: ${allocs.length}\n`);

  // Check for duplicates
  const theatreMap = new Map<string, any[]>();
  allocs.forEach((alloc: any) => {
    const key = `${alloc.unit}-${alloc.theatreNumber}`;
    if (!theatreMap.has(key)) {
      theatreMap.set(key, []);
    }
    theatreMap.get(key)!.push(alloc);
  });

  console.log('Theatre breakdown:');
  Array.from(theatreMap.entries())
    .sort((a, b) => {
      const [unitA, numA] = a[0].split('-');
      const [unitB, numB] = b[0].split('-');
      if (unitA !== unitB) return unitA.localeCompare(unitB);
      return Number(numA) - Number(numB);
    })
    .forEach(([key, group]) => {
      const [unit, num] = key.split('-');
      const theatreName = unit === 'main' ? `Main Theatre ${num}` : `DSU Theatre ${num}`;
      if (group.length > 1) {
        console.log(`  ⚠️  ${theatreName}: ${group.length} DUPLICATES`);
        group.forEach((alloc: any, idx) => {
          console.log(`      [${idx + 1}] ID: ${alloc.id} | Created: ${alloc.createdAt}`);
        });
      } else {
        console.log(`  ✅ ${theatreName}`);
      }
    });

  process.exit(0);
}

checkTodayAllocations().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
