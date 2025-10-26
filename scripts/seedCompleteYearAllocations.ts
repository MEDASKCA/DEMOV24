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
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to get date range (14 days back, today, 365 days forward = 380 days)
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

  // 365 days in the future
  for (let i = 1; i <= 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  return dates;
};

// Session types with utilization characteristics
const sessionTypes = [
  { id: 'session-1-am', name: '1 Session (AM)', startTime: '08:00', endTime: '13:00', durationMinutes: 300, avgUtilization: 85, shifts: ['08:00-13:00', '08:00-18:00'] },
  { id: 'session-1-pm', name: '1 Session (PM)', startTime: '13:00', endTime: '18:00', durationMinutes: 300, avgUtilization: 82, shifts: ['13:00-18:00', '08:00-18:00'] },
  { id: 'session-2', name: '2 Sessions', startTime: '08:00', endTime: '18:00', durationMinutes: 600, avgUtilization: 88, shifts: ['08:00-18:00'] },
  { id: 'session-3', name: '3 Sessions', startTime: '08:00', endTime: '20:00', durationMinutes: 720, avgUtilization: 78, shifts: ['08:00-20:00', '08:00-20:30', '08:00-18:00'] },
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

// Calculate utilization with variance
const calculateUtilization = (sessionType: any): number => {
  const variance = randomInt(-15, 10);
  return Math.max(50, Math.min(100, sessionType.avgUtilization + variance));
};

// Check if staff needs relief
const needsRelief = (staffShift: string, sessionEnd: string): boolean => {
  const shiftEnd = staffShift.split('-')[1];
  const sessionEndHour = parseInt(sessionEnd.split(':')[0]);
  const shiftEndHour = parseInt(shiftEnd.split(':')[0]);
  return shiftEndHour < sessionEndHour;
};

async function generateCompleteYearAllocations() {
  console.log('📅 Generating Complete Year Theatre Allocations (All 26 Theatres Daily)...\n');

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
  console.log(`   - Anaesthetic Nurses: ${anaesNurses.length}`);
  console.log(`   - Anaesthetic ODPs: ${anaesODPs.length}`);
  console.log(`   - Scrub Nurses: ${scrubNurses.length}`);
  console.log(`   - Scrub ODPs: ${scrubODPs.length}`);
  console.log(`   - HCAs: ${hcas.length}\n`);

  const dates = getDateRange();
  console.log(`📅 Generating allocations for ${dates.length} days (14 past, today, 365 future)\n`);

  // Theatre definitions: 12 Main + 14 DSU = 26 total
  const theatres = [
    ...Array.from({ length: 12 }, (_, i) => ({ number: i + 1, name: `Main Theatre ${i + 1}`, unit: 'main' })),
    ...Array.from({ length: 14 }, (_, i) => ({ number: i + 1, name: `DSU Theatre ${i + 1}`, unit: 'acad' })),
  ];

  let totalAllocations = 0;
  let batch = writeBatch(db);
  let batchCount = 0;

  for (const date of dates) {
    const dateStr = formatDate(date);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    for (const theatre of theatres) {
      // Determine if theatre is closed (some theatres may be closed on weekends or randomly)
      let status: 'ready' | 'in-use' | 'closed';

      if (isWeekend && theatre.unit === 'main' && theatre.number > 6) {
        // Close Main Theatre 7-12 on weekends
        status = 'closed';
      } else if (isWeekend && theatre.unit === 'acad' && theatre.number > 4) {
        // Close DSU Theatre 5-14 on weekends
        status = 'closed';
      } else if (Math.random() < 0.05) {
        // 5% chance of being closed on weekdays (maintenance, etc.)
        status = 'closed';
      } else {
        // Random between ready and in-use
        status = Math.random() < 0.6 ? 'in-use' : 'ready';
      }

      // Select session type based on theatre and day
      let sessionType;
      if (status === 'closed') {
        sessionType = sessionTypes[0]; // Doesn't matter, but use 1 session
      } else if (theatre.unit === 'acad') {
        // DSU mostly does 1-session or 2-session lists
        sessionType = randomItem([sessionTypes[0], sessionTypes[1], sessionTypes[2]]);
      } else {
        // Main theatres do all session types
        const weights = dayOfWeek === 5 ? [0.15, 0.15, 0.45, 0.25] : [0.1, 0.1, 0.4, 0.4];
        const rand = Math.random();
        if (rand < weights[0]) sessionType = sessionTypes[0];
        else if (rand < weights[0] + weights[1]) sessionType = sessionTypes[1];
        else if (rand < weights[0] + weights[1] + weights[2]) sessionType = sessionTypes[2];
        else sessionType = sessionTypes[3];
      }

      // Select staff
      const surgeon = status !== 'closed' ? randomItem(surgeons) : null;
      const assistant = status !== 'closed' ? randomItem(assistants) : null;
      const anaesthetist = status !== 'closed' ? randomItem(anaesthetists) : null;

      const anaesNPs = [...anaesNurses, ...anaesODPs];
      const anaesNP = status !== 'closed' ? randomItem(anaesNPs) : null;
      const anaesNPPrefix = anaesNP?.role === 'Anaesthetic Nurse' ? 'RN' : 'ODP';

      const scrubNPs = [...scrubNurses, ...scrubODPs];
      const scrubNP1 = status !== 'closed' ? randomItem(scrubNPs) : null;
      const scrubNP2 = status !== 'closed' ? randomItem(scrubNPs.filter(s => s.id !== scrubNP1?.id)) : null;
      const scrubNP1Prefix = scrubNP1?.role === 'Scrub Nurse' ? 'RN' : 'ODP';
      const scrubNP2Prefix = scrubNP2?.role === 'Scrub Nurse' ? 'RN' : 'ODP';

      const hca = status !== 'closed' && hcas.length > 0 ? randomItem(hcas) : null;

      // Select shifts based on session type
      const selectShift = () => {
        if (sessionType.id === 'session-3') {
          // 3-session: 70% long shifts, 30% need relief
          return Math.random() < 0.7
            ? randomItem(['08:00-20:00', '08:00-20:30'])
            : '08:00-18:00';
        }
        return randomItem(sessionType.shifts);
      };

      const surgeonShift = surgeon ? selectShift() : '';
      const assistantShift = assistant ? selectShift() : '';
      const anaesthetistShift = anaesthetist ? selectShift() : '';
      const anaesNPShift = anaesNP ? selectShift() : '';
      const scrubNP1Shift = scrubNP1 ? selectShift() : '';
      const scrubNP2Shift = scrubNP2 ? selectShift() : '';
      const hcaShift = hca ? selectShift() : '';

      // Calculate utilization and relief needs
      const utilization = status !== 'closed' ? calculateUtilization(sessionType) : 0;
      const utilizationMinutes = Math.floor((utilization / 100) * sessionType.durationMinutes);
      const availableMinutes = sessionType.durationMinutes - utilizationMinutes;
      const efficiency = utilization >= 85 ? 'high' : utilization >= 70 ? 'medium' : 'low';

      const likelyOverrun = status === 'in-use' && utilization > 90 && Math.random() < 0.15;

      const reliefStatus = {
        surgeonNeedsRelief: surgeon ? needsRelief(surgeonShift, sessionType.endTime) : false,
        assistantNeedsRelief: assistant ? needsRelief(assistantShift, sessionType.endTime) : false,
        anaesthetistNeedsRelief: anaesthetist ? needsRelief(anaesthetistShift, sessionType.endTime) : false,
        anaesNPNeedsRelief: anaesNP ? needsRelief(anaesNPShift, sessionType.endTime) : false,
        scrubNP1NeedsRelief: scrubNP1 ? needsRelief(scrubNP1Shift, sessionType.endTime) : false,
        scrubNP2NeedsRelief: scrubNP2 ? needsRelief(scrubNP2Shift, sessionType.endTime) : false,
        hcaNeedsRelief: hca ? needsRelief(hcaShift, sessionType.endTime) : false,
      };

      const anyReliefNeeded = Object.values(reliefStatus).some(v => v);

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
          startTime: sessionType.startTime,
          endTime: sessionType.endTime,
          durationMinutes: sessionType.durationMinutes,
        },
        utilization: {
          percentage: utilization,
          utilizationMinutes,
          availableMinutes,
          efficiency,
        },
        overrun: {
          likely: likelyOverrun,
          estimatedExtraMinutes: likelyOverrun ? randomInt(15, 45) : 0,
        },
        reliefRequired: anyReliefNeeded,
        reliefStatus,
        team: {
          surgeon: {
            staffId: surgeon?.id || null,
            name: formatStaffName(surgeon),
            shift: surgeonShift,
            needsRelief: reliefStatus.surgeonNeedsRelief,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
          },
          assistant: {
            staffId: assistant?.id || null,
            name: formatStaffName(assistant),
            shift: assistantShift,
            needsRelief: reliefStatus.assistantNeedsRelief,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
          },
          anaesthetist: {
            staffId: anaesthetist?.id || null,
            name: formatStaffName(anaesthetist),
            shift: anaesthetistShift,
            needsRelief: reliefStatus.anaesthetistNeedsRelief,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
          },
          anaesNP: {
            staffId: anaesNP?.id || null,
            name: formatStaffName(anaesNP, anaesNPPrefix),
            shift: anaesNPShift,
            needsRelief: reliefStatus.anaesNPNeedsRelief,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
          },
          scrubNP1: {
            staffId: scrubNP1?.id || null,
            name: formatStaffName(scrubNP1, scrubNP1Prefix),
            shift: scrubNP1Shift,
            scrubbed: status === 'in-use' && Math.random() < 0.7,
            needsRelief: reliefStatus.scrubNP1NeedsRelief,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
          },
          scrubNP2: {
            staffId: scrubNP2?.id || null,
            name: formatStaffName(scrubNP2, scrubNP2Prefix),
            shift: scrubNP2Shift,
            scrubbed: false,
            needsRelief: reliefStatus.scrubNP2NeedsRelief,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
          },
          hca: {
            staffId: hca?.id || null,
            name: formatStaffName(hca),
            shift: hcaShift,
            needsRelief: reliefStatus.hcaNeedsRelief,
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

  console.log(`\n✅ Generated ${totalAllocations} theatre allocations!`);
  console.log(`   - 26 theatres per day (12 Main + 14 DSU)`);
  console.log(`   - ${dates.length} days (14 past + 1 today + 365 future)`);
  console.log(`   - Expected total: ${26 * dates.length} = ${totalAllocations}\n`);

  process.exit(0);
}

generateCompleteYearAllocations().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
