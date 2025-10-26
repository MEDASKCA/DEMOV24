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

const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Session type definitions
const sessionTypes = [
  {
    id: 'session-1-am',
    name: '1 Session (AM)',
    sessionCount: 1,
    startTime: '08:00',
    endTime: '13:00',
    durationHours: 5,
    shifts: ['08:00-13:00', '08:00-18:00']
  },
  {
    id: 'session-1-pm',
    name: '1 Session (PM)',
    sessionCount: 1,
    startTime: '13:00',
    endTime: '18:00',
    durationHours: 5,
    shifts: ['13:00-18:00', '08:00-18:00']
  },
  {
    id: 'session-2',
    name: '2 Sessions',
    sessionCount: 2,
    startTime: '08:00',
    endTime: '18:00',
    durationHours: 10,
    shifts: ['08:00-18:00']
  },
  {
    id: 'session-3',
    name: '3 Sessions',
    sessionCount: 3,
    startTime: '08:00',
    endTime: '20:00',
    durationHours: 12,
    shifts: ['08:00-20:00', '08:00-20:30']
  },
];

async function updateAllocationsWithSessions() {
  console.log('🎭 Updating Theatre Allocations with Session Types...\n');

  // Fetch current allocations
  const allocationsSnapshot = await getDocs(collection(db, 'theatreAllocations'));
  console.log(`📋 Found ${allocationsSnapshot.docs.length} existing allocations\n`);

  const batch = writeBatch(db);
  let updateCount = 0;

  allocationsSnapshot.docs.forEach(docSnapshot => {
    const allocation = docSnapshot.data();

    // Randomly assign a session type (with higher probability for 2 and 3 sessions)
    const weights = [0.1, 0.1, 0.4, 0.4]; // 10% each for 1-session, 40% each for 2 and 3 sessions
    const rand = Math.random();
    let sessionType;

    if (rand < weights[0]) {
      sessionType = sessionTypes[0]; // 1 Session AM
    } else if (rand < weights[0] + weights[1]) {
      sessionType = sessionTypes[1]; // 1 Session PM
    } else if (rand < weights[0] + weights[1] + weights[2]) {
      sessionType = sessionTypes[2]; // 2 Sessions
    } else {
      sessionType = sessionTypes[3]; // 3 Sessions
    }

    // For closed theatres, use 1 session or 2 sessions
    if (allocation.status === 'closed') {
      sessionType = Math.random() < 0.5 ? sessionTypes[0] : sessionTypes[2];
    }

    // Update staff shifts based on session type
    const updateStaffShifts = (team: any) => {
      const newTeam = { ...team };

      Object.keys(newTeam).forEach(roleKey => {
        const staffMember = newTeam[roleKey];
        if (staffMember && staffMember.staffId) {
          // For 3-session lists, prefer 08:00-20:00 or 08:00-20:30
          if (sessionType.id === 'session-3') {
            staffMember.shift = randomItem(['08:00-20:00', '08:00-20:30']);
          } else {
            // Otherwise use shifts appropriate for the session type
            staffMember.shift = randomItem(sessionType.shifts);
          }

          // Add overtime tracking fields
          staffMember.actualStartTime = null;
          staffMember.actualEndTime = null;
          staffMember.overtimeMinutes = 0;
        }
      });

      return newTeam;
    };

    // Create updated allocation
    const updatedAllocation = {
      ...allocation,
      sessionType: {
        id: sessionType.id,
        name: sessionType.name,
        sessionCount: sessionType.sessionCount,
        startTime: sessionType.startTime,
        endTime: sessionType.endTime,
        durationHours: sessionType.durationHours,
      },
      session: `${sessionType.startTime} - ${sessionType.endTime}`, // Display string
      sessionsCount: sessionType.sessionCount,
      team: updateStaffShifts(allocation.team),
      updatedAt: new Date().toISOString(),
    };

    batch.update(doc(db, 'theatreAllocations', docSnapshot.id), updatedAllocation);
    updateCount++;

    console.log(`✅ Theatre ${allocation.theatreNumber}: ${sessionType.name} (${sessionType.startTime}-${sessionType.endTime})`);
  });

  await batch.commit();
  console.log(`\n✅ Updated ${updateCount} allocations with session types!\n`);

  // Display summary
  console.log('📊 SESSION TYPE DISTRIBUTION:');
  const sessionCounts: Record<string, number> = {};
  allocationsSnapshot.docs.forEach(docSnapshot => {
    const allocation = docSnapshot.data();
    // This won't show updated data, but gives idea of distribution
    const sessionName = allocation.sessionType?.name || 'Unknown';
    sessionCounts[sessionName] = (sessionCounts[sessionName] || 0) + 1;
  });

  Object.entries(sessionCounts).forEach(([name, count]) => {
    console.log(`   ${name}: ${count} theatres`);
  });

  process.exit(0);
}

updateAllocationsWithSessions().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
