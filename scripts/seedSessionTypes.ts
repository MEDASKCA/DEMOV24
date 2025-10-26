import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';

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

// Session Types reference data
const sessionTypes = [
  {
    id: 'session-1-am',
    name: '1 Session (AM)',
    sessionCount: 1,
    startTime: '08:00',
    endTime: '13:00',
    durationHours: 5,
    description: 'Morning session - typically 2-3 short cases',
    preferredStaffShifts: ['08:00-13:00', '08:00-18:00'],
    reliefRequired: false
  },
  {
    id: 'session-1-pm',
    name: '1 Session (PM)',
    sessionCount: 1,
    startTime: '13:00',
    endTime: '18:00',
    durationHours: 5,
    description: 'Afternoon session - typically 2-3 short cases',
    preferredStaffShifts: ['13:00-18:00', '08:00-18:00'],
    reliefRequired: false
  },
  {
    id: 'session-2',
    name: '2 Sessions',
    sessionCount: 2,
    startTime: '08:00',
    endTime: '18:00',
    durationHours: 10,
    description: 'Full day session - typically 4-6 cases',
    preferredStaffShifts: ['08:00-18:00'],
    reliefRequired: true,
    reliefGuidelines: 'Staff should receive 30-45 min break after 4-5 hours'
  },
  {
    id: 'session-3',
    name: '3 Sessions',
    sessionCount: 3,
    startTime: '08:00',
    endTime: '20:00',
    durationHours: 12,
    description: 'Extended day session - typically 6-8 cases',
    preferredStaffShifts: ['08:00-20:00', '08:00-20:30'],
    reliefRequired: true,
    reliefGuidelines: 'Mandatory relief required. Staff on 08:00-18:00 must be relieved by staff finishing at 20:00 from shorter sessions.',
    skillMixConsiderations: 'If 08:00-18:00 staff allocated due to skill requirements, arrange relief from appropriately skilled staff finishing earlier'
  },
  {
    id: 'session-emergency',
    name: 'Emergency (24/7)',
    sessionCount: 0,
    startTime: '00:00',
    endTime: '23:59',
    durationHours: 24,
    description: 'On-call emergency theatre',
    preferredStaffShifts: ['20:00-08:30', '20:30-08:00', '08:00-20:00'],
    reliefRequired: true,
    reliefGuidelines: 'Rotating shifts with handover periods'
  }
];

async function seedSessionTypes() {
  console.log('📋 Seeding Session Types to Firestore...\n');

  const batch = writeBatch(db);

  sessionTypes.forEach(sessionType => {
    const docRef = doc(db, 'sessionTypes', sessionType.id);
    batch.set(docRef, {
      ...sessionType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    console.log(`✅ ${sessionType.name}: ${sessionType.startTime} - ${sessionType.endTime} (${sessionType.durationHours}h)`);
    console.log(`   Preferred shifts: ${sessionType.preferredStaffShifts.join(', ')}`);
    if (sessionType.reliefGuidelines) {
      console.log(`   Relief: ${sessionType.reliefGuidelines}`);
    }
    console.log('');
  });

  await batch.commit();
  console.log('✅ All session types saved to Firestore!\n');

  process.exit(0);
}

seedSessionTypes().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
