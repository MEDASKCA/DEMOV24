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

// Generate theatre allocations for today
async function generateTheatreAllocations() {
  console.log('🎭 Generating Theatre Staff Allocations...\n');

  // Fetch all staff from Firestore
  console.log('📋 Loading staff from Firestore...');
  const staffSnapshot = await getDocs(collection(db, 'staffProfiles'));
  const allStaff = staffSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
  console.log(`✅ Loaded ${allStaff.length} staff members\n`);

  // Categorize staff by role
  const surgeons = allStaff.filter(s => s.role === 'Consultant Surgeon');
  const assistants = allStaff.filter(s => s.role === 'Assistant Surgeon');
  const anaesthetists = allStaff.filter(s => s.role === 'Consultant Anaesthetist');
  const anaesRegistrars = allStaff.filter(s => s.role === 'Anaesthetic Registrar');
  const anaesNurses = allStaff.filter(s => s.role === 'Anaesthetic Nurse');
  const anaesODPs = allStaff.filter(s => s.role === 'Anaesthetic ODP');
  const scrubNurses = allStaff.filter(s => s.role === 'Scrub Nurse');
  const scrubODPs = allStaff.filter(s => s.role === 'Scrub ODP');
  const hcas = allStaff.filter(s => s.role === 'Healthcare Assistant');

  console.log('📊 Staff by Role:');
  console.log(`   - Consultant Surgeons: ${surgeons.length}`);
  console.log(`   - Assistant Surgeons: ${assistants.length}`);
  console.log(`   - Consultant Anaesthetists: ${anaesthetists.length}`);
  console.log(`   - Anaesthetic Registrars: ${anaesRegistrars.length}`);
  console.log(`   - Anaesthetic Nurses: ${anaesNurses.length}`);
  console.log(`   - Anaesthetic ODPs: ${anaesODPs.length}`);
  console.log(`   - Scrub Nurses: ${scrubNurses.length}`);
  console.log(`   - Scrub ODPs: ${scrubODPs.length}`);
  console.log(`   - HCAs: ${hcas.length}\n`);

  // Helper to format staff name with title
  const formatStaffName = (staff: any, rolePrefix?: string): string => {
    if (!staff) return 'VACANT';

    const lastName = staff.lastName.charAt(0).toUpperCase();
    const firstName = staff.firstName.charAt(0).toUpperCase();

    if (rolePrefix) {
      return `${rolePrefix} ${firstName}. ${staff.lastName}`;
    }

    // For surgeons and anaesthetists
    if (staff.role?.includes('Surgeon')) {
      return `Mr. ${firstName}. ${staff.lastName}`;
    } else if (staff.role?.includes('Anaesthetist')) {
      return `Dr. ${firstName}. ${staff.lastName}`;
    }

    return `${firstName}. ${staff.lastName}`;
  };

  // Generate 12 theatre allocations (Main Theatres 1-12)
  const allocations = [];
  const usedSurgeons = new Set();
  const usedAnaesthetists = new Set();

  for (let i = 1; i <= 12; i++) {
    // Select unique staff for this theatre
    let surgeon, assistant, anaesthetist, anaesNP, scrubNP1, scrubNP2;

    // Get surgeon (avoid reuse)
    const availableSurgeons = surgeons.filter(s => !usedSurgeons.has(s.id));
    if (availableSurgeons.length > 0) {
      surgeon = randomItem(availableSurgeons);
      usedSurgeons.add(surgeon.id);
    }

    // Get assistant
    assistant = randomItem(assistants);

    // Get anaesthetist (avoid reuse)
    const availableAnaesthetists = anaesthetists.filter(a => !usedAnaesthetists.has(a.id));
    if (availableAnaesthetists.length > 0) {
      anaesthetist = randomItem(availableAnaesthetists);
      usedAnaesthetists.add(anaesthetist.id);
    }

    // Get anaesthetic N/P (mix of nurses and ODPs)
    const anaesNPs = [...anaesNurses, ...anaesODPs];
    anaesNP = randomItem(anaesNPs);

    // Get scrub N/P (mix of nurses and ODPs)
    const scrubNPs = [...scrubNurses, ...scrubODPs];
    scrubNP1 = randomItem(scrubNPs);
    scrubNP2 = randomItem(scrubNPs.filter(s => s.id !== scrubNP1?.id));

    // Determine role prefix for N/P staff
    const anaesNPPrefix = anaesNP?.role === 'Anaesthetic Nurse' ? 'RN' : 'ODP';
    const scrubNP1Prefix = scrubNP1?.role === 'Scrub Nurse' ? 'RN' : 'ODP';
    const scrubNP2Prefix = scrubNP2?.role === 'Scrub Nurse' ? 'RN' : 'ODP';

    // Define shift patterns based on user requirements
    const validShifts = ['08:00-18:00', '08:00-20:00', '08:00-13:00', '13:00-18:00', '08:00-20:30', '20:00-08:30', '20:30-08:00'];
    const dayShifts = ['08:00-18:00', '08:00-20:00', '08:00-13:00', '13:00-18:00', '08:00-20:30'];

    // Assign shifts
    const surgeonShift = randomItem(dayShifts);
    const assistantShift = randomItem(dayShifts);
    const anaesthetistShift = randomItem(dayShifts);
    const anaesNPShift = randomItem(dayShifts);
    const scrubNP1Shift = randomItem(dayShifts);
    const scrubNP2Shift = randomItem(dayShifts);

    const allocation = {
      id: `theatre-${i}`,
      theatreNumber: i,
      theatreName: `Main Theatre ${i}`,
      status: i === 2 || i === 8 ? 'closed' : i === 1 || i === 3 || i === 5 || i === 7 || i === 10 || i === 12 ? 'in-use' : 'ready',
      team: {
        surgeon: {
          staffId: surgeon?.id || null,
          name: formatStaffName(surgeon),
          shift: surgeon ? surgeonShift : '',
        },
        assistant: {
          staffId: assistant?.id || null,
          name: formatStaffName(assistant),
          shift: assistant ? assistantShift : '',
        },
        anaesthetist: {
          staffId: anaesthetist?.id || null,
          name: formatStaffName(anaesthetist),
          shift: anaesthetist ? anaesthetistShift : '',
        },
        anaesNP: {
          staffId: anaesNP?.id || null,
          name: formatStaffName(anaesNP, anaesNPPrefix),
          shift: anaesNP ? anaesNPShift : '',
        },
        scrubNP1: {
          staffId: scrubNP1?.id || null,
          name: formatStaffName(scrubNP1, scrubNP1Prefix),
          shift: scrubNP1 ? scrubNP1Shift : '',
          scrubbed: [1, 3, 5, 7, 10, 12].includes(i),
        },
        scrubNP2: {
          staffId: scrubNP2?.id || null,
          name: formatStaffName(scrubNP2, scrubNP2Prefix),
          shift: scrubNP2 ? scrubNP2Shift : '',
          scrubbed: false,
        },
      },
      createdAt: new Date().toISOString(),
    };

    allocations.push(allocation);
  }

  console.log(`✅ Generated ${allocations.length} theatre allocations\n`);

  // Save to Firestore
  console.log('💾 Saving to Firestore...');
  let batch = writeBatch(db);
  let count = 0;

  for (const allocation of allocations) {
    const docRef = doc(db, 'theatreAllocations', allocation.id);
    batch.set(docRef, allocation);
    count++;

    if (count === 500) {
      await batch.commit();
      batch = writeBatch(db);
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
  }

  console.log('✅ All allocations saved!\n');

  // Display summary
  console.log('📊 THEATRE ALLOCATIONS SUMMARY:\n');
  allocations.forEach(alloc => {
    console.log(`   ${alloc.theatreName} (${alloc.status}):`);
    console.log(`     - Surgeon: ${alloc.team.surgeon.name}`);
    console.log(`     - Assistant: ${alloc.team.assistant.name}`);
    console.log(`     - Anaesthetist: ${alloc.team.anaesthetist.name}`);
    console.log(`     - Anaes N/P: ${alloc.team.anaesNP.name}`);
    console.log(`     - Scrub N/P 1: ${alloc.team.scrubNP1.name}`);
    console.log(`     - Scrub N/P 2: ${alloc.team.scrubNP2.name}\n`);
  });

  process.exit(0);
}

generateTheatreAllocations().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
