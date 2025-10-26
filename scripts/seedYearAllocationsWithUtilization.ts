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

// Get date range for 1 year (14 days back, 365 days forward)
const getDateRange = (): Date[] => {
  const dates: Date[] = [];
  const today = new Date();

  // 14 days historical
  for (let i = 14; i >= 1; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }

  // Today
  dates.push(new Date(today));

  // 365 days forward
  for (let i = 1; i <= 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  return dates;
};

// Session type definitions with realistic utilization
const sessionTypes = [
  {
    id: 'session-1-am',
    name: '1 Session (AM)',
    sessionCount: 1,
    startTime: '08:00',
    endTime: '13:00',
    durationMinutes: 300,
    avgUtilization: 85, // 85% average utilization
    shifts: ['08:00-13:00', '08:00-18:00']
  },
  {
    id: 'session-1-pm',
    name: '1 Session (PM)',
    sessionCount: 1,
    startTime: '13:00',
    endTime: '18:00',
    durationMinutes: 300,
    avgUtilization: 82,
    shifts: ['13:00-18:00', '08:00-18:00']
  },
  {
    id: 'session-2',
    name: '2 Sessions',
    sessionCount: 2,
    startTime: '08:00',
    endTime: '18:00',
    durationMinutes: 600,
    avgUtilization: 88,
    shifts: ['08:00-18:00']
  },
  {
    id: 'session-3',
    name: '3 Sessions',
    sessionCount: 3,
    startTime: '08:00',
    endTime: '20:00',
    durationMinutes: 720,
    avgUtilization: 78, // Lower utilization for long sessions
    shifts: ['08:00-20:00', '08:00-20:30', '08:00-18:00'] // Include 08:00-18:00 for skill mix
  },
];

// Helper to calculate utilization with variance
const calculateUtilization = (sessionType: typeof sessionTypes[0]): number => {
  const variance = randomInt(-15, 10); // -15% to +10% variance
  return Math.max(50, Math.min(100, sessionType.avgUtilization + variance));
};

// Helper to determine if list will overrun
const willOverrun = (utilization: number, sessionType: typeof sessionTypes[0]): boolean => {
  // Higher utilization + 3 sessions = more likely to overrun
  if (sessionType.sessionCount === 3 && utilization > 85) return Math.random() < 0.4;
  if (sessionType.sessionCount === 2 && utilization > 90) return Math.random() < 0.25;
  if (sessionType.sessionCount === 1 && utilization > 95) return Math.random() < 0.15;
  return false;
};

// Helper to format staff name
const formatStaffName = (staff: any, rolePrefix?: string): string => {
  if (!staff) return 'VACANT';
  const firstName = staff.firstName.charAt(0).toUpperCase();
  if (rolePrefix) return `${rolePrefix} ${firstName}. ${staff.lastName}`;
  if (staff.role?.includes('Surgeon')) return `Mr. ${firstName}. ${staff.lastName}`;
  if (staff.role?.includes('Anaesthetist')) return `Dr. ${firstName}. ${staff.lastName}`;
  return `${firstName}. ${staff.lastName}`;
};

// Helper to check if staff needs relief
const needsRelief = (staffShift: string, sessionEnd: string): boolean => {
  const shiftEnd = staffShift.split('-')[1];
  const sessionEndHour = parseInt(sessionEnd.split(':')[0]);
  const shiftEndHour = parseInt(shiftEnd.split(':')[0]);
  return shiftEndHour < sessionEndHour;
};

async function generateYearAllocations() {
  console.log('📅 Generating 1 Year Theatre Allocations with Utilization Tracking...\n');

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
  console.log(`📅 Generating allocations for ${dates.length} days (14 past + 1 + 365 future)\n`);

  let totalAllocations = 0;
  let batch = writeBatch(db);
  let batchCount = 0;

  // Utilization tracking
  let totalUtilization = 0;
  let reliefNeededCount = 0;
  let overrunCount = 0;

  for (const date of dates) {
    const dateStr = formatDate(date);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Realistic theatre patterns
    // Mon-Fri: 12 theatres, Sat: 6 theatres, Sun: 4 theatres (emergency only)
    const activeTheatres = isWeekend ? (dayOfWeek === 0 ? 4 : 6) : 12;

    for (let i = 1; i <= activeTheatres; i++) {
      // Realistic session distribution
      // Mon-Thu: More 2 and 3 sessions
      // Fri: More 2 sessions, fewer 3 sessions
      // Weekend: Mostly 1 and 2 sessions
      let sessionType;
      const rand = Math.random();

      if (isWeekend) {
        // Weekend: 40% 1-session, 50% 2-session, 10% 3-session
        if (rand < 0.4) sessionType = randomItem([sessionTypes[0], sessionTypes[1]]);
        else if (rand < 0.9) sessionType = sessionTypes[2];
        else sessionType = sessionTypes[3];
      } else if (dayOfWeek === 5) { // Friday
        // Friday: 20% 1-session, 60% 2-session, 20% 3-session
        if (rand < 0.2) sessionType = randomItem([sessionTypes[0], sessionTypes[1]]);
        else if (rand < 0.8) sessionType = sessionTypes[2];
        else sessionType = sessionTypes[3];
      } else {
        // Mon-Thu: 10% 1-session, 45% 2-session, 45% 3-session
        if (rand < 0.1) sessionType = randomItem([sessionTypes[0], sessionTypes[1]]);
        else if (rand < 0.55) sessionType = sessionTypes[2];
        else sessionType = sessionTypes[3];
      }

      // Calculate utilization
      const utilization = calculateUtilization(sessionType);
      totalUtilization += utilization;

      // Determine if overrun likely
      const likelyOverrun = willOverrun(utilization, sessionType);
      if (likelyOverrun) overrunCount++;

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

      // Smart shift allocation based on session type
      let surgeonShift, assistantShift, anaesthetistShift, anaesNPShift, scrubNP1Shift, scrubNP2Shift;

      if (sessionType.id === 'session-3') {
        // 3 Sessions: 70% get 08:00-20:00/20:30, 30% get 08:00-18:00 (need relief)
        const use18hShift = Math.random() < 0.3;
        surgeonShift = use18hShift ? '08:00-18:00' : randomItem(['08:00-20:00', '08:00-20:30']);
        assistantShift = use18hShift ? '08:00-18:00' : randomItem(['08:00-20:00', '08:00-20:30']);
        anaesthetistShift = use18hShift ? '08:00-18:00' : randomItem(['08:00-20:00', '08:00-20:30']);
        anaesNPShift = randomItem(['08:00-20:00', '08:00-20:30']);
        scrubNP1Shift = randomItem(['08:00-20:00', '08:00-20:30']);
        scrubNP2Shift = Math.random() < 0.4 ? '08:00-18:00' : randomItem(['08:00-20:00', '08:00-20:30']);
      } else {
        surgeonShift = randomItem(sessionType.shifts);
        assistantShift = randomItem(sessionType.shifts);
        anaesthetistShift = randomItem(sessionType.shifts);
        anaesNPShift = randomItem(sessionType.shifts);
        scrubNP1Shift = randomItem(sessionType.shifts);
        scrubNP2Shift = randomItem(sessionType.shifts);
      }

      // Check who needs relief
      const reliefStatus = {
        surgeonNeedsRelief: needsRelief(surgeonShift, sessionType.endTime),
        assistantNeedsRelief: needsRelief(assistantShift, sessionType.endTime),
        anaesthetistNeedsRelief: needsRelief(anaesthetistShift, sessionType.endTime),
        anaesNPNeedsRelief: needsRelief(anaesNPShift, sessionType.endTime),
        scrubNP1NeedsRelief: needsRelief(scrubNP1Shift, sessionType.endTime),
        scrubNP2NeedsRelief: needsRelief(scrubNP2Shift, sessionType.endTime),
      };

      const anyReliefNeeded = Object.values(reliefStatus).some(v => v);
      if (anyReliefNeeded) reliefNeededCount++;

      // Determine status
      let status: string;
      if (isWeekend && i > 2) {
        status = 'closed';
      } else if (Math.random() < 0.15) {
        status = 'closed';
      } else if (Math.random() < 0.4) {
        status = 'in-use';
      } else if (Math.random() < 0.7) {
        status = 'ready';
      } else {
        status = 'standby';
      }

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
          sessionCount: sessionType.sessionCount,
          startTime: sessionType.startTime,
          endTime: sessionType.endTime,
          durationMinutes: sessionType.durationMinutes,
        },
        session: `${sessionType.startTime} - ${sessionType.endTime}`,
        sessionsCount: sessionType.sessionCount,
        utilization: {
          percentage: utilization,
          utilizationMinutes: Math.floor((utilization / 100) * sessionType.durationMinutes),
          availableMinutes: sessionType.durationMinutes - Math.floor((utilization / 100) * sessionType.durationMinutes),
          efficiency: utilization >= 85 ? 'high' : utilization >= 70 ? 'medium' : 'low',
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
            shift: surgeon ? surgeonShift : '',
            needsRelief: reliefStatus.surgeonNeedsRelief,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
          },
          assistant: {
            staffId: assistant?.id || null,
            name: formatStaffName(assistant),
            shift: assistant ? assistantShift : '',
            needsRelief: reliefStatus.assistantNeedsRelief,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
          },
          anaesthetist: {
            staffId: anaesthetist?.id || null,
            name: formatStaffName(anaesthetist),
            shift: anaesthetist ? anaesthetistShift : '',
            needsRelief: reliefStatus.anaesthetistNeedsRelief,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
          },
          anaesNP: {
            staffId: anaesNP?.id || null,
            name: formatStaffName(anaesNP, anaesNPPrefix),
            shift: anaesNP ? anaesNPShift : '',
            needsRelief: reliefStatus.anaesNPNeedsRelief,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
          },
          scrubNP1: {
            staffId: scrubNP1?.id || null,
            name: formatStaffName(scrubNP1, scrubNP1Prefix),
            shift: scrubNP1 ? scrubNP1Shift : '',
            scrubbed: status === 'in-use' && Math.random() < 0.6,
            needsRelief: reliefStatus.scrubNP1NeedsRelief,
            actualStartTime: null,
            actualEndTime: null,
            overtimeMinutes: 0,
          },
          scrubNP2: {
            staffId: scrubNP2?.id || null,
            name: formatStaffName(scrubNP2, scrubNP2Prefix),
            shift: scrubNP2 ? scrubNP2Shift : '',
            scrubbed: false,
            needsRelief: reliefStatus.scrubNP2NeedsRelief,
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

  const avgUtilization = (totalUtilization / totalAllocations).toFixed(1);

  console.log(`\n✅ Generated ${totalAllocations} theatre allocations across 380 days!`);
  console.log(`\n📊 UTILIZATION STATISTICS:`);
  console.log(`   Average Utilization: ${avgUtilization}%`);
  console.log(`   Lists Requiring Relief: ${reliefNeededCount} (${((reliefNeededCount/totalAllocations)*100).toFixed(1)}%)`);
  console.log(`   Lists Likely to Overrun: ${overrunCount} (${((overrunCount/totalAllocations)*100).toFixed(1)}%)`);
  console.log(`\n📅 DATE RANGE:`);
  console.log(`   Historical: 14 days`);
  console.log(`   Today: 1 day`);
  console.log(`   Future: 365 days\n`);

  process.exit(0);
}

generateYearAllocations().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
