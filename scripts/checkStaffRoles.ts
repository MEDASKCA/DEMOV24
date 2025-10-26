import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';

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

async function checkStaffRoles() {
  console.log('📋 Fetching staff profiles from Firebase...\n');

  const staffSnapshot = await getDocs(collection(db, 'staffProfiles'));
  const staffList = staffSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

  console.log(`✅ Total staff loaded: ${staffList.length}\n`);

  // Group by role
  const roleCount: Record<string, number> = {};
  const roleCodes: Record<string, string> = {};

  staffList.forEach(staff => {
    const role = staff.role || 'Unknown';
    roleCount[role] = (roleCount[role] || 0) + 1;
    roleCodes[role] = staff.roleCode || 'N/A';
  });

  console.log('📊 STAFF ROLES BREAKDOWN:\n');
  Object.entries(roleCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([role, count]) => {
      console.log(`   ${role.padEnd(40)} | Code: ${roleCodes[role].padEnd(20)} | Count: ${count}`);
    });

  console.log('\n\n📋 SAMPLE STAFF DATA (first 3):');
  staffList.slice(0, 3).forEach(staff => {
    console.log(`\n   ID: ${staff.id}`);
    console.log(`   Name: ${staff.fullName}`);
    console.log(`   Role: ${staff.role}`);
    console.log(`   Role Code: ${staff.roleCode}`);
    console.log(`   Hospital: ${staff.currentHospital}`);
    console.log(`   Hospital ID: ${staff.currentHospitalId}`);
    console.log(`   Specialties: ${staff.specialties?.join(', ')}`);
  });

  // Check for theatre staff specifically
  const theatreRoles = staffList.filter(s =>
    s.roleCode?.includes('SCRUB') ||
    s.roleCode?.includes('ANAES') ||
    s.roleCode?.includes('HCA') ||
    s.roleCode?.includes('THEATRE')
  );

  console.log(`\n\n🎭 THEATRE STAFF: ${theatreRoles.length}`);

  // Check for surgeons and anaesthetists
  const surgeons = staffList.filter(s => s.role?.toLowerCase().includes('surgeon'));
  const anaesthetists = staffList.filter(s => s.role?.toLowerCase().includes('anaesthetist'));

  console.log(`\n👨‍⚕️ SURGEONS: ${surgeons.length}`);
  console.log(`💉 ANAESTHETISTS: ${anaesthetists.length}`);

  process.exit(0);
}

checkStaffRoles().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
