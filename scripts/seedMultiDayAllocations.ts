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

// Helper to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to get date range (14 days back, today, 30 days forward)
const getDateRange = (): Date[] => {
  const dates: Date[] = [];
  const today = new Date();

  // 14 days in the past
  for (let i = 14; i >= 1; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }

  // Today
  dates.push(new Date(today));

  // 30 days in the future
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  return dates;
};

// Session types
const sessionTypes = [
  { id: 'session-1-am', name: '1 Session (AM)', start: '08:00', end: '13:00', shifts: ['08:00-13:00', '08:00-18:00'] },
  { id: 'session-1-pm', name: '1 Session (PM)', start: '13:00', end: '18:00', shifts: ['13:00-18:00', '08:00-18:00'] },
  { id: 'session-2', name: '2 Sessions', start: '08:00', end: '18:00', shifts: ['08:00-18:00'] },
  { id: 'session-3', name: '3 Sessions', start: '08:00', end: '20:00', shifts: ['08:00-20:00', '08:00-20:30'] },
];

// Helper to format staff name with title
const formatStaffName = (staff: any, rolePrefix?: string): string => {
  if (!staff) return 'VACANT';

  const firstName = staff.firstName.charAt(0).toUpperCase();

  if (rolePrefix) {
    return `${rolePrefix} ${firstName}. ${staff.lastName}`;
  }

  if (staff.role?.includes('Surgeon')) {
    return `Mr. ${firstName}. ${staff.lastName}`;
  } else if (staff.role?.includes('Anaesthetist')) {
    return `Dr. ${firstName}. ${staff.lastName}`;
  }

  return `${firstName}. ${staff.lastName}`;
};

async function generateMultiDayAllocations() {
  console.log('📅 Generating Multi-Day Theatre Allocations...\n');

  // Fetch all staff
  console.log('📋 Loading staff from Firestore...');
  const staffSnapshot = await getDocs(collection(db, 'staffProfiles'));
  const allStaff = staffSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
  console.log(`✅ Loaded ${allStaff.length} staff members\n`);

  // Categorize staff
  const surgeons = allStaff.filter(s => s.role === 'Consultant Surgeon');
  const assistants = allStaff.filter(s => s.role === 'Assistant Surgeon');
  const anaesthetists = allStaff.filter(s => s.role === 'Consultant Anaesthetist');
  const anaesNurses = allStaff.filter(s => s.role === 'Anaesthetic Nurse');
  const anaesODPs = allStaff.filter(s => s.role === 'Anaesthetic ODP');
  const scrubNurses = allStaff.filter(s => s.role === 'Scrub Nurse');
  const scrubODPs = allStaff.filter(s => s.role === 'Scrub ODP');

  const dates = getDateRange();
  console.log(`📅 Generating allocations for ${dates.length} days (14 past, today, 30 future)\n`);

  let totalAllocations = 0;
  let batch = writeBatch(db);
  let batchCount = 0;

  for (const date of dates) {
    const dateStr = formatDate(date);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

    // Skip weekends for some theatres
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const activeTheatres = isWeekend ? 6 : 12; // Fewer theatres on weekends

    for (let i = 1; i <= activeTheatres; i++) {
      // Select session type
      const sessionType = randomItem(sessionTypes);

      // Randomly select staff
      const surgeon = randomItem(surgeons);
      const assistant = randomItem(assistants);
      const anaesthetist = randomItem(anaesthetists);

      const anaesNPs = [...anaesNurses, ...anaesODPs];
      const anaesNP = randomItem(anaesNPs);
      const anaesNPPrefix = anaesNP?.role === 'Anaesthetic Nurse' ? 'RN' : 'ODP';

      const scrubNPs = [...scrubNurses, ...scrubODPs];
      const scrubNP1 = randomItem(scrubNPs);
      const scrubNP2 = randomItem(scrubNPs.filter(s => s.id !== scrubNP1?.id));
      const scrubNP1Prefix = scrubNP1?.role === 'Scrub Nurse' ? 'RN' : 'ODP';
      const scrubNP2Prefix = scrubNP2?.role === 'Scrub Nurse' ? 'RN' : 'ODP';

      // Select appropriate shifts based on session type
      const surgeonShift = randomItem(sessionType.shifts);
      const assistantShift = randomItem(sessionType.shifts);
      const anaesthetistShift = randomItem(sessionType.shifts);
      const anaesNPShift = randomItem(sessionType.shifts);
      const scrubNP1Shift = randomItem(sessionType.shifts);
      const scrubNP2Shift = randomItem(sessionType.shifts);

      const status = i === 2 || i === 8 ? 'closed' :
                     i === 1 || i === 3 || i === 5 ? 'in-use' : 'ready';

      const allocation = {
        id: `theatre-${i}-${dateStr}`,
        date: dateStr,
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
        theatreNumber: i,
        theatreName: `Main Theatre ${i}`,
        status,
        sessionType: {
          id: sessionType.id,
          name: sessionType.name,
          startTime: sessionType.start,
          endTime: sessionType.end,
        },
        team: {
          surgeon: {
            staffId: surgeon?.id || null,
            name: formatStaffName(surgeon),
            shift: surgeon ? surgeonShift : '',
            actualStartTime: null, // Filled when staff arrives
            actualEndTime: null,   // Filled when staff leaves
            overtimeMinutes: 0,    // Credit system
          },
          assistant: {
            staffId: assistant?.id || null,
            name: formatStaffName(assistant),
            shift: assistant ? assistantShift : '',
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
          },
          anaesthetist: {
            staffId: anaesthetist?.id || null,
            name: formatStaffName(anaesthetist),
            shift: anaesthetist ? anaesthetistShift : '',
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
          },
          anaesNP: {
            staffId: anaesNP?.id || null,
            name: formatStaffName(anaesNP, anaesNPPrefix),
            shift: anaesNP ? anaesNPShift : '',
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
          },
          scrubNP1: {
            staffId: scrubNP1?.id || null,
            name: formatStaffName(scrubNP1, scrubNP1Prefix),
            shift: scrubNP1 ? scrubNP1Shift : '',
            scrubbed: [1, 3, 5, 7, 10, 12].includes(i),
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
          },
          scrubNP2: {
            staffId: scrubNP2?.id || null,
            name: formatStaffName(scrubNP2, scrubNP2Prefix),
            shift: scrubNP2 ? scrubNP2Shift : '',
            scrubbed: false,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
          },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = doc(db, 'theatreAllocations', allocation.id);
      batch.set(docRef, allocation);
      batchCount++;
      totalAllocations++;

      // Commit batch every 500 documents
      if (batchCount === 500) {
        await batch.commit();
        console.log(`   ✅ Committed ${totalAllocations} allocations...`);
        batch = writeBatch(db);
        batchCount = 0;
      }
    }
  }

  // Commit remaining
  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(`\n✅ Generated ${totalAllocations} theatre allocations across ${dates.length} days!`);
  console.log(`   - Historical: 14 days`);
  console.log(`   - Today: 1 day`);
  console.log(`   - Future: 30 days\n`);

  process.exit(0);
}

generateMultiDayAllocations().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
