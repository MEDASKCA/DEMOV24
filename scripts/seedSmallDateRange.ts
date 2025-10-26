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
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to get date range (7 days back, today, 7 days forward = 15 days total)
const getDateRange = (): Date[] => {
  const dates: Date[] = [];
  const today = new Date();

  // 7 days in the past
  for (let i = 7; i >= 1; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }

  // Today
  dates.push(new Date(today));

  // 7 days in the future
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  return dates;
};

// Session types
const sessionTypes = [
  { id: 'session-1-am', name: '1 Session (AM)', start: '08:00', end: '13:00', shifts: ['08:00-13:00', '08:00-18:00'], avgUtilization: 75 },
  { id: 'session-1-pm', name: '1 Session (PM)', start: '13:00', end: '18:00', shifts: ['13:00-18:00', '08:00-18:00'], avgUtilization: 70 },
  { id: 'session-2', name: '2 Sessions', start: '08:00', end: '18:00', shifts: ['08:00-18:00'], avgUtilization: 85 },
  { id: 'session-3', name: '3 Sessions', start: '08:00', end: '20:00', shifts: ['08:00-20:00', '08:00-20:30'], avgUtilization: 90 },
];

// Theatre definitions: 12 Main + 14 DSU = 26 total
const theatres = [
  ...Array.from({ length: 12 }, (_, i) => ({ number: i + 1, name: `Main Theatre ${i + 1}`, unit: 'main' })),
  ...Array.from({ length: 14 }, (_, i) => ({ number: i + 1, name: `DSU Theatre ${i + 1}`, unit: 'acad' })),
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
  } else if (staff.role === 'Healthcare Assistant' || staff.role === 'HCA') {
    return `HCA ${firstName}. ${staff.lastName}`;
  }

  return `${firstName}. ${staff.lastName}`;
};

// Helper to determine if relief is needed
const needsRelief = (shift: string, sessionEndTime: string): boolean => {
  const shiftEnd = shift.split('-')[1];
  return shiftEnd < sessionEndTime;
};

async function seedSmallDateRange() {
  console.log('📅 Generating Theatre Allocations (15 days: 7 past + today + 7 future)...\n');

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
  const hcas = allStaff.filter(s => s.role === 'Healthcare Assistant' || s.role === 'HCA');

  console.log(`📊 Staff breakdown:`);
  console.log(`   - Surgeons: ${surgeons.length}`);
  console.log(`   - Assistants: ${assistants.length}`);
  console.log(`   - Anaesthetists: ${anaesthetists.length}`);
  console.log(`   - HCAs: ${hcas.length}\n`);

  const dates = getDateRange();
  console.log(`📅 Generating allocations for ${dates.length} days (7 past, today, 7 future)\n`);

  let totalAllocations = 0;
  let batch = writeBatch(db);
  let batchCount = 0;

  for (const date of dates) {
    const dateStr = formatDate(date);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    for (const theatre of theatres) {
      // Determine status
      let status = 'ready';

      if (isWeekend && theatre.unit === 'main' && theatre.number > 6) {
        status = 'closed';
      } else if (isWeekend && theatre.unit === 'acad' && theatre.number > 4) {
        status = 'closed';
      } else if (Math.random() < 0.05) {
        status = 'closed';
      } else if (Math.random() < 0.3) {
        status = 'in-use';
      }

      // Select session type
      const sessionType = randomItem(sessionTypes);

      // Select staff
      const surgeon = status !== 'closed' && surgeons.length > 0 ? randomItem(surgeons) : null;
      const assistant = status !== 'closed' && assistants.length > 0 ? randomItem(assistants) : null;
      const anaesthetist = status !== 'closed' && anaesthetists.length > 0 ? randomItem(anaesthetists) : null;

      const anaesNPs = [...anaesNurses, ...anaesODPs];
      const anaesNP = status !== 'closed' && anaesNPs.length > 0 ? randomItem(anaesNPs) : null;
      const anaesNPPrefix = anaesNP?.role === 'Anaesthetic Nurse' ? 'RN' : 'ODP';

      const scrubNPs = [...scrubNurses, ...scrubODPs];
      const scrubNP1 = status !== 'closed' && scrubNPs.length > 0 ? randomItem(scrubNPs) : null;
      const scrubNP2 = status !== 'closed' && scrubNPs.length > 0 ? randomItem(scrubNPs.filter(s => s.id !== scrubNP1?.id)) : null;
      const scrubNP1Prefix = scrubNP1?.role === 'Scrub Nurse' ? 'RN' : 'ODP';
      const scrubNP2Prefix = scrubNP2?.role === 'Scrub Nurse' ? 'RN' : 'ODP';

      const hca = status !== 'closed' && hcas.length > 0 ? randomItem(hcas) : null;

      // Select shifts
      const surgeonShift = surgeon ? randomItem(sessionType.shifts) : '';
      const assistantShift = assistant ? randomItem(sessionType.shifts) : '';
      const anaesthetistShift = anaesthetist ? randomItem(sessionType.shifts) : '';
      const anaesNPShift = anaesNP ? randomItem(sessionType.shifts) : '';
      const scrubNP1Shift = scrubNP1 ? randomItem(sessionType.shifts) : '';
      const scrubNP2Shift = scrubNP2 ? randomItem(sessionType.shifts) : '';
      const hcaShift = hca ? randomItem(sessionType.shifts) : '';

      const allocation = {
        id: `${theatre.unit}-theatre-${theatre.number}-${dateStr}`,
        date: dateStr,
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
        theatreNumber: theatre.number,
        theatreName: theatre.name,
        unit: theatre.unit,
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
            shift: surgeonShift,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
            needsRelief: surgeon ? needsRelief(surgeonShift, sessionType.end) : false,
          },
          assistant: {
            staffId: assistant?.id || null,
            name: formatStaffName(assistant),
            shift: assistantShift,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
            needsRelief: assistant ? needsRelief(assistantShift, sessionType.end) : false,
          },
          anaesthetist: {
            staffId: anaesthetist?.id || null,
            name: formatStaffName(anaesthetist),
            shift: anaesthetistShift,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
            needsRelief: anaesthetist ? needsRelief(anaesthetistShift, sessionType.end) : false,
          },
          anaesNP: {
            staffId: anaesNP?.id || null,
            name: formatStaffName(anaesNP, anaesNPPrefix),
            shift: anaesNPShift,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
            needsRelief: anaesNP ? needsRelief(anaesNPShift, sessionType.end) : false,
          },
          scrubNP1: {
            staffId: scrubNP1?.id || null,
            name: formatStaffName(scrubNP1, scrubNP1Prefix),
            shift: scrubNP1Shift,
            scrubbed: Math.random() > 0.5,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
            needsRelief: scrubNP1 ? needsRelief(scrubNP1Shift, sessionType.end) : false,
          },
          scrubNP2: {
            staffId: scrubNP2?.id || null,
            name: formatStaffName(scrubNP2, scrubNP2Prefix),
            shift: scrubNP2Shift,
            scrubbed: false,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
            needsRelief: scrubNP2 ? needsRelief(scrubNP2Shift, sessionType.end) : false,
          },
          hca: {
            staffId: hca?.id || null,
            name: formatStaffName(hca),
            shift: hcaShift,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
            needsRelief: hca ? needsRelief(hcaShift, sessionType.end) : false,
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

  console.log(`\n✅ Generated ${totalAllocations} theatre allocations!`);
  console.log(`   - Days: ${dates.length} (7 past, today, 7 future)`);
  console.log(`   - Theatres per day: 26 (12 Main + 14 DSU)\n`);

  process.exit(0);
}

seedSmallDateRange().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
