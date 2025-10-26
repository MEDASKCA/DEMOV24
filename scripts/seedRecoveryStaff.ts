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

// Helper functions
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Names arrays
const FIRST_NAMES = [
  'Sarah', 'Michael', 'Emma', 'James', 'Olivia', 'David', 'Sophie', 'Daniel',
  'Emily', 'Christopher', 'Jessica', 'Matthew', 'Hannah', 'Andrew', 'Lucy',
  'Ryan', 'Charlotte', 'Thomas', 'Rebecca', 'Joshua', 'Amy', 'Benjamin',
  'Katie', 'Samuel', 'Laura', 'Jack', 'Grace', 'Oliver', 'Megan', 'George',
  'Rachel', 'William', 'Victoria', 'Harry', 'Lauren', 'Joseph', 'Natalie',
  'Charles', 'Chloe', 'Edward', 'Abigail', 'Alexander', 'Ella', 'Lewis',
  'Amelia', 'Jacob', 'Lily', 'Henry', 'Bethany', 'Ethan', 'Molly', 'Nathan',
  'Isabella', 'Adam', 'Poppy', 'Luke', 'Evie', 'Robert', 'Scarlett', 'Peter',
  'Ava', 'Jonathan', 'Ruby', 'Simon', 'Zoe', 'Mark', 'Eleanor', 'Paul',
  'Alice', 'Stephen', 'Holly', 'Richard', 'Georgia', 'Patrick', 'Rosie',
];

const LAST_NAMES = [
  'Smith', 'Jones', 'Williams', 'Brown', 'Taylor', 'Davies', 'Wilson', 'Evans',
  'Thomas', 'Roberts', 'Johnson', 'Walker', 'Wright', 'Robinson', 'Thompson',
  'White', 'Hughes', 'Edwards', 'Green', 'Lewis', 'Wood', 'Harris', 'Martin',
  'Jackson', 'Clarke', 'Clark', 'Turner', 'Hill', 'Scott', 'Cooper', 'Morris',
  'Ward', 'Moore', 'King', 'Watson', 'Baker', 'Harrison', 'Morgan', 'Patel',
  'Young', 'Allen', 'Mitchell', 'James', 'Anderson', 'Phillips', 'Lee',
  'Bell', 'Parker', 'Davis', 'Miller', 'Wilson', 'Ahmed', 'Ali', 'Khan',
  'Singh', 'Murphy', 'Kelly', 'O\'Brien', 'Ryan', 'Walsh', 'O\'Connor',
];

// Recovery Staff Roles
const RECOVERY_ROLES = {
  recoveryRN: {
    title: 'Recovery Nurse',
    code: 'RECOVERY_RN',
    bands: ['Band 5', 'Band 6', 'Band 7'],
    specialties: ['Post-Anaesthetic Care', 'Airway Management', 'Pain Management', 'Cardiovascular Monitoring'],
  },
  recoveryODP: {
    title: 'Recovery ODP',
    code: 'RECOVERY_ODP',
    bands: ['Band 5', 'Band 6'],
    specialties: ['Post-Anaesthetic Care', 'Airway Management', 'Equipment Management'],
  },
  seniorRecoveryRN: {
    title: 'Senior Recovery Nurse',
    code: 'SENIOR_RECOVERY_RN',
    bands: ['Band 7'],
    specialties: ['Post-Anaesthetic Care', 'Airway Management', 'Pain Management', 'Cardiovascular Monitoring', 'Team Leadership'],
  },
};

// Major Trauma Centers
const HOSPITALS = [
  { id: 'hosp-004', name: "King's College Hospital NHS Foundation Trust" },
  { id: 'hosp-008', name: "St. Mary's Hospital Imperial College Healthcare NHS Trust" },
  { id: 'hosp-011', name: 'Royal London Hospital Barts Health NHS Trust' },
];

// Employment types with weighted distribution
const EMPLOYMENT_TYPES = [
  { type: 'Permanent', weight: 0.70 },
  { type: 'Bank', weight: 0.20 },
  { type: 'Locum', weight: 0.10 },
];

function getEmploymentType(): string {
  const rand = Math.random();
  let cumulative = 0;

  for (const emp of EMPLOYMENT_TYPES) {
    cumulative += emp.weight;
    if (rand <= cumulative) return emp.type;
  }

  return 'Permanent';
}

// London areas for addresses
const LONDON_AREAS = [
  { area: 'Camberwell', postcodes: ['SE5', 'SE15'], lat: 51.4742, lng: -0.0882 },
  { area: 'Dulwich', postcodes: ['SE21', 'SE22'], lat: 51.4436, lng: -0.0868 },
  { area: 'Brixton', postcodes: ['SW2', 'SW9'], lat: 51.4613, lng: -0.1157 },
  { area: 'Peckham', postcodes: ['SE15'], lat: 51.4740, lng: -0.0697 },
  { area: 'Lewisham', postcodes: ['SE13'], lat: 51.4577, lng: -0.0144 },
  { area: 'Greenwich', postcodes: ['SE10'], lat: 51.4826, lng: -0.0077 },
  { area: 'Paddington', postcodes: ['W2'], lat: 51.5154, lng: -0.1755 },
  { area: 'Bayswater', postcodes: ['W2'], lat: 51.5120, lng: -0.1878 },
  { area: 'Notting Hill', postcodes: ['W11'], lat: 51.5095, lng: -0.1967 },
  { area: 'Whitechapel', postcodes: ['E1'], lat: 51.5194, lng: -0.0625 },
  { area: 'Mile End', postcodes: ['E1', 'E3'], lat: 51.5250, lng: -0.0334 },
  { area: 'Stratford', postcodes: ['E15'], lat: 51.5419, lng: -0.0033 },
];

function generateAddress() {
  const area = randomItem(LONDON_AREAS);
  const houseNumber = randomInt(1, 250);
  const streets = ['High Street', 'Church Road', 'Station Road', 'Park Avenue', 'Green Lane', 'Manor Way', 'Hill Road', 'Grove Street'];
  const street = randomItem(streets);
  const postcode = `${randomItem(area.postcodes)}${randomInt(1, 9)}${String.fromCharCode(65 + randomInt(0, 25))}${String.fromCharCode(65 + randomInt(0, 25))}`;

  const lat = area.lat + (Math.random() - 0.5) * 0.02;
  const lng = area.lng + (Math.random() - 0.5) * 0.02;

  return {
    line1: `${houseNumber} ${street}`,
    line2: area.area,
    city: 'London',
    postcode,
    coordinates: { lat, lng }
  };
}

// Generate recovery staff profiles
function generateRecoveryStaff(): any[] {
  const staff: any[] = [];
  let staffId = 1001; // Start after the 1000 regular staff

  for (const hospital of HOSPITALS) {
    // Main Theatre Recovery Staff (30)
    for (let i = 0; i < 30; i++) {
      const firstName = randomItem(FIRST_NAMES);
      const lastName = randomItem(LAST_NAMES);
      const yearsExperience = randomInt(0, 20);

      // Determine role based on experience and distribution
      let roleKey: 'recoveryRN' | 'recoveryODP' | 'seniorRecoveryRN';
      if (yearsExperience >= 8 && i < 5) {
        roleKey = 'seniorRecoveryRN'; // ~5 senior staff per recovery area
      } else if (i % 3 === 0) {
        roleKey = 'recoveryODP'; // ~1/3 ODPs
      } else {
        roleKey = 'recoveryRN'; // ~2/3 RNs
      }

      const role = RECOVERY_ROLES[roleKey];
      const band = yearsExperience >= 10 ? 'Band 7' :
                   yearsExperience >= 5 ? 'Band 6' : 'Band 5';
      const seniority = yearsExperience >= 10 ? 'Very Senior' :
                        yearsExperience >= 6 ? 'Senior' :
                        yearsExperience >= 3 ? 'Mid-level' : 'Junior';

      const employmentType = getEmploymentType();
      const dob = new Date(1975 + randomInt(0, 25), randomInt(0, 11), randomInt(1, 28));
      const address = generateAddress();

      staff.push({
        id: `staff-${String(staffId++).padStart(5, '0')}`,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        dateOfBirth: dob.toISOString().split('T')[0],
        gender: randomItem(['Male', 'Female']),
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@nhs.net`,
        phone: `07${randomInt(700, 999)}${String(randomInt(100000, 999999))}`,
        role: role.title,
        roleCode: role.code,
        department: 'Main Theatre Recovery',
        departmentCode: 'MAIN_RECOVERY',
        band,
        seniority,
        yearsExperience,
        employmentType,
        currentHospital: hospital.name,
        currentHospitalId: hospital.id,
        address,
        registrationNumber: `${roleKey.includes('RN') ? 'NMC' : 'HCPC'}${randomInt(1000000, 9999999)}`,
        registrationExpiry: '2026-12-31',
        specialties: role.specialties,
        qualifications: [
          roleKey.includes('RN') ? 'BSc Nursing (Adult)' : 'BSc Operating Department Practice',
          'Post-Anaesthetic Care Course',
          'Airway Management Course',
          yearsExperience >= 5 ? 'ILS Provider' : null,
          yearsExperience >= 8 ? 'ALS Provider' : null,
        ].filter(Boolean),
        training: [
          'Manual Handling',
          'BLS',
          yearsExperience >= 3 ? 'ILS' : null,
          yearsExperience >= 6 ? 'ALS' : null,
          'Safeguarding Level 3',
          'Oxygen Therapy',
          'Anaphylaxis Management',
        ].filter(Boolean),
        linkedInProfile: `https://www.linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${randomInt(100, 999)}`,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: employmentType !== 'Permanent' || Math.random() > 0.7,
          sunday: employmentType !== 'Permanent' || Math.random() > 0.8,
        },
        shiftPreferences: employmentType === 'Permanent' ? ['STD_DAY', 'EARLY', 'LATE'] :
                          employmentType === 'Bank' ? ['STD_DAY', 'EARLY', 'LATE', 'LONG_DAY', 'NIGHT'] :
                          ['LONG_DAY', 'NIGHT', 'STD_DAY'],
        recoverySkills: [
          'Post-operative monitoring',
          'Airway management and intervention',
          'Pain assessment and management',
          'Cardiovascular monitoring',
          'Recognition of post-op complications',
          'Emergency response',
          'Patient handover',
          yearsExperience >= 5 ? 'Mentoring junior staff' : null,
        ].filter(Boolean),
        procedureFamiliarity: [
          'General Surgery recovery',
          'Orthopaedic recovery',
          'Cardiac recovery',
          'Neurosurgery recovery',
          'Laparoscopic procedures',
          'Major trauma cases',
          yearsExperience >= 3 ? 'Paediatric recovery' : null,
        ].filter(Boolean),
        certifications: [
          'BLS',
          yearsExperience >= 3 ? 'ILS' : null,
          yearsExperience >= 6 ? 'ALS' : null,
          'Airway Management',
          'Pain Management',
        ].filter(Boolean),
        notes: `Experienced ${role.title} in Main Theatre Recovery with ${yearsExperience} years of post-anaesthetic care experience.`,
        createdAt: new Date().toISOString(),
      });
    }

    // DSU Theatre Recovery Staff (30)
    for (let i = 0; i < 30; i++) {
      const firstName = randomItem(FIRST_NAMES);
      const lastName = randomItem(LAST_NAMES);
      const yearsExperience = randomInt(0, 18);

      let roleKey: 'recoveryRN' | 'recoveryODP' | 'seniorRecoveryRN';
      if (yearsExperience >= 8 && i < 5) {
        roleKey = 'seniorRecoveryRN';
      } else if (i % 3 === 0) {
        roleKey = 'recoveryODP';
      } else {
        roleKey = 'recoveryRN';
      }

      const role = RECOVERY_ROLES[roleKey];
      const band = yearsExperience >= 10 ? 'Band 7' :
                   yearsExperience >= 5 ? 'Band 6' : 'Band 5';
      const seniority = yearsExperience >= 10 ? 'Very Senior' :
                        yearsExperience >= 6 ? 'Senior' :
                        yearsExperience >= 3 ? 'Mid-level' : 'Junior';

      const employmentType = getEmploymentType();
      const dob = new Date(1975 + randomInt(0, 25), randomInt(0, 11), randomInt(1, 28));
      const address = generateAddress();

      staff.push({
        id: `staff-${String(staffId++).padStart(5, '0')}`,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        dateOfBirth: dob.toISOString().split('T')[0],
        gender: randomItem(['Male', 'Female']),
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@nhs.net`,
        phone: `07${randomInt(700, 999)}${String(randomInt(100000, 999999))}`,
        role: role.title,
        roleCode: role.code,
        department: 'DSU Recovery',
        departmentCode: 'DSU_RECOVERY',
        band,
        seniority,
        yearsExperience,
        employmentType,
        currentHospital: hospital.name,
        currentHospitalId: hospital.id,
        address,
        registrationNumber: `${roleKey.includes('RN') ? 'NMC' : 'HCPC'}${randomInt(1000000, 9999999)}`,
        registrationExpiry: '2026-12-31',
        specialties: role.specialties,
        qualifications: [
          roleKey.includes('RN') ? 'BSc Nursing (Adult)' : 'BSc Operating Department Practice',
          'Post-Anaesthetic Care Course',
          'Day Surgery Nursing',
          yearsExperience >= 5 ? 'ILS Provider' : null,
        ].filter(Boolean),
        training: [
          'Manual Handling',
          'BLS',
          yearsExperience >= 3 ? 'ILS' : null,
          'Safeguarding Level 3',
          'Discharge Planning',
          'Patient Education',
        ].filter(Boolean),
        linkedInProfile: `https://www.linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${randomInt(100, 999)}`,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: employmentType !== 'Permanent' || Math.random() > 0.8,
          sunday: false, // DSU typically closed Sundays
        },
        shiftPreferences: ['STD_DAY', 'EARLY'], // DSU mainly day shifts
        recoverySkills: [
          'Day surgery recovery',
          'Fast-track discharge assessment',
          'Patient education and discharge planning',
          'Pain management',
          'PONV management',
          'Fitness for discharge criteria',
          yearsExperience >= 5 ? 'Discharge coordinator' : null,
        ].filter(Boolean),
        procedureFamiliarity: [
          'Laparoscopic procedures',
          'Minor orthopaedic procedures',
          'Endoscopy',
          'General surgery day cases',
          'Urology procedures',
          'Gynaecology procedures',
        ].filter(Boolean),
        certifications: [
          'BLS',
          yearsExperience >= 3 ? 'ILS' : null,
          'Day Surgery Nursing',
          'Discharge Planning',
        ].filter(Boolean),
        notes: `Experienced ${role.title} in Day Surgery Recovery with ${yearsExperience} years of experience specializing in fast-track recovery and discharge.`,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return staff;
}

// Main seeding function
async function seedRecoveryStaff() {
  console.log('👥 Generating Recovery Staff profiles...\n');
  console.log('🚀 Starting recovery staff seeding...\n');

  const recoveryStaff = generateRecoveryStaff();

  console.log(`📋 Generated ${recoveryStaff.length} recovery staff profiles\n`);
  console.log(`   - Main Theatre Recovery: ${recoveryStaff.filter(s => s.departmentCode === 'MAIN_RECOVERY').length}`);
  console.log(`   - DSU Recovery: ${recoveryStaff.filter(s => s.departmentCode === 'DSU_RECOVERY').length}\n`);

  // Seed to Firestore in batches
  const batchSize = 500;
  let batch = writeBatch(db);
  let operationCount = 0;

  for (let i = 0; i < recoveryStaff.length; i++) {
    const staff = recoveryStaff[i];
    const docRef = doc(db, 'staffProfiles', staff.id);
    batch.set(docRef, staff);
    operationCount++;

    if (operationCount === batchSize || i === recoveryStaff.length - 1) {
      await batch.commit();
      console.log(`   Saved ${i + 1}/${recoveryStaff.length} recovery staff`);
      batch = writeBatch(db);
      operationCount = 0;
    }
  }

  console.log('✅ All recovery staff saved!\n');

  // Summary by hospital
  console.log('📊 SUMMARY BY HOSPITAL:\n');
  for (const hospital of HOSPITALS) {
    const hospitalStaff = recoveryStaff.filter(s => s.currentHospitalId === hospital.id);
    const mainRecovery = hospitalStaff.filter(s => s.departmentCode === 'MAIN_RECOVERY');
    const dsuRecovery = hospitalStaff.filter(s => s.departmentCode === 'DSU_RECOVERY');

    console.log(`   ${hospital.name}:`);
    console.log(`   - Main Theatre Recovery: ${mainRecovery.length} staff`);
    console.log(`   - DSU Recovery: ${dsuRecovery.length} staff`);
    console.log(`   - Total: ${hospitalStaff.length} recovery staff\n`);
  }

  console.log('🎉 Recovery staff seeding completed!\n');
  console.log(`✨ Added ${recoveryStaff.length} recovery staff to the database!`);
  process.exit(0);
}

// Run the seeding
seedRecoveryStaff().catch((error) => {
  console.error('Error seeding recovery staff:', error);
  process.exit(1);
});
