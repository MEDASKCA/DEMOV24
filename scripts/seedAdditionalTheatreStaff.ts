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

// Theatre Staff Roles
const THEATRE_ROLES = {
  scrubRN: { title: 'Scrub Nurse', code: 'SCRUB_RN', bands: ['Band 5', 'Band 6', 'Band 7'], specialties: ['General', 'Ortho', 'Cardiac', 'Neuro', 'Vascular'] },
  scrubODP: { title: 'Scrub ODP', code: 'SCRUB_ODP', bands: ['Band 5', 'Band 6', 'Band 7'], specialties: ['General', 'Ortho', 'Cardiac', 'Neuro', 'Vascular'] },
  anaesRN: { title: 'Anaesthetic Nurse', code: 'ANAES_RN', bands: ['Band 5', 'Band 6', 'Band 7'], specialties: ['Anaesthetics'] },
  anaesODP: { title: 'Anaesthetic ODP', code: 'ANAES_ODP', bands: ['Band 5', 'Band 6', 'Band 7'], specialties: ['Anaesthetics'] },
  hca: { title: 'Healthcare Assistant', code: 'HCA', bands: ['Band 2', 'Band 3', 'Band 4'], specialties: ['Theatre Support'] },
  theatreCoord: { title: 'Theatre Coordinator', code: 'THEATRE_COORD', bands: ['Band 7', 'Band 8a'], specialties: ['Theatre Management'] },
};

// Three Major Trauma Centers
const HOSPITALS = [
  { id: 'hosp-004', name: "King's College Hospital NHS Foundation Trust" },
  { id: 'hosp-008', name: "St. Mary's Hospital Imperial College Healthcare NHS Trust" },
  { id: 'hosp-011', name: 'Royal London Hospital Barts Health NHS Trust' },
];

// Employment types - heavily weighted towards permanent for major trauma centers
const EMPLOYMENT_TYPES = [
  { type: 'Permanent', weight: 0.85 }, // 85% permanent
  { type: 'Bank', weight: 0.10 },      // 10% bank
  { type: 'Locum', weight: 0.05 },     // 5% locum
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

// Names
const FIRST_NAMES = [
  'James', 'Oliver', 'George', 'Harry', 'Jack', 'Charlie', 'Thomas', 'Oscar', 'William', 'Noah',
  'Emily', 'Olivia', 'Amelia', 'Isla', 'Ava', 'Isabella', 'Lily', 'Sophie', 'Grace', 'Mia',
  'Mohammed', 'Ahmed', 'Ali', 'Hassan', 'Ibrahim', 'Youssef', 'Omar', 'Kareem', 'Khalid', 'Amir',
  'Fatima', 'Aisha', 'Zara', 'Layla', 'Yasmin', 'Amina', 'Nadia', 'Sara', 'Hana', 'Mariam',
  'Liam', 'Ethan', 'Lucas', 'Mason', 'Logan', 'Alexander', 'Michael', 'Daniel', 'Henry', 'Samuel',
  'Emma', 'Charlotte', 'Sophia', 'Evelyn', 'Harper', 'Abigail', 'Elizabeth', 'Sofia', 'Ella', 'Madison',
  'Raj', 'Amit', 'Priya', 'Ananya', 'Rohan', 'Arjun', 'Neha', 'Kavya', 'Sanjay', 'Deepak',
  'Chen', 'Wei', 'Li', 'Zhang', 'Wang', 'Liu', 'Mei', 'Xiao', 'Ming', 'Ying',
];

const LAST_NAMES = [
  'Smith', 'Jones', 'Williams', 'Brown', 'Taylor', 'Davies', 'Wilson', 'Evans', 'Thomas', 'Roberts',
  'Johnson', 'Walker', 'Wright', 'Robinson', 'Thompson', 'White', 'Hughes', 'Edwards', 'Green', 'Lewis',
  'Khan', 'Ali', 'Ahmed', 'Shah', 'Patel', 'Singh', 'Kumar', 'Sharma', 'Kaur', 'Gupta',
  'Chen', 'Wang', 'Li', 'Zhang', 'Liu', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou',
  'Garcia', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres',
  'Murphy', 'Kelly', 'O\'Brien', 'Ryan', 'Walsh', 'O\'Connor', 'McCarthy', 'Doyle', 'Flynn', 'Sullivan',
];

// London areas for addresses
const LONDON_AREAS = [
  { area: 'Whitechapel', postcodes: ['E1'], lat: 51.5194, lng: -0.0596 },
  { area: 'Camberwell', postcodes: ['SE5'], lat: 51.4742, lng: -0.0882 },
  { area: 'Paddington', postcodes: ['W2'], lat: 51.5154, lng: -0.1755 },
  { area: 'Stratford', postcodes: ['E15'], lat: 51.5419, lng: -0.0033 },
  { area: 'Greenwich', postcodes: ['SE10'], lat: 51.4826, lng: -0.0077 },
  { area: 'Brixton', postcodes: ['SW2'], lat: 51.4613, lng: -0.1157 },
];

function generateAddress() {
  const area = randomItem(LONDON_AREAS);
  const houseNumber = randomInt(1, 250);
  const streets = ['High Street', 'Church Road', 'Station Road', 'Park Avenue', 'Green Lane', 'Manor Way'];
  const street = randomItem(streets);
  const postcode = `${randomItem(area.postcodes)} ${randomInt(1, 9)}${String.fromCharCode(65 + randomInt(0, 25))}${String.fromCharCode(65 + randomInt(0, 25))}`;

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

// Generate 600 additional theatre staff (200 per hospital)
function generateTheatreStaff(): any[] {
  const staff: any[] = [];
  let staffId = 1181; // Continue from staff-01180

  for (const hospital of HOSPITALS) {
    console.log(`\nGenerating 200 theatre staff for ${hospital.name}...`);

    for (let i = 0; i < 200; i++) {
      const firstName = randomItem(FIRST_NAMES);
      const lastName = randomItem(LAST_NAMES);
      const yearsExperience = randomInt(0, 25);

      // Determine role - distribute across theatre roles
      let roleKey: keyof typeof THEATRE_ROLES;
      const roleRand = Math.random();
      if (roleRand < 0.30) {
        roleKey = 'scrubRN'; // 30% Scrub RN
      } else if (roleRand < 0.55) {
        roleKey = 'scrubODP'; // 25% Scrub ODP
      } else if (roleRand < 0.75) {
        roleKey = 'anaesRN'; // 20% Anaes RN
      } else if (roleRand < 0.90) {
        roleKey = 'anaesODP'; // 15% Anaes ODP
      } else if (roleRand < 0.97) {
        roleKey = 'hca'; // 7% HCA
      } else {
        roleKey = 'theatreCoord'; // 3% Coordinators
      }

      const role = THEATRE_ROLES[roleKey];
      const band = yearsExperience >= 10 ? role.bands[role.bands.length - 1] :
                   yearsExperience >= 5 ? role.bands[Math.min(1, role.bands.length - 1)] :
                   role.bands[0];

      const seniority = yearsExperience >= 10 ? 'Very Senior' :
                        yearsExperience >= 6 ? 'Senior' :
                        yearsExperience >= 3 ? 'Mid-level' : 'Junior';

      const employmentType = getEmploymentType();
      const dob = new Date(1970 + randomInt(0, 30), randomInt(0, 11), randomInt(1, 28));
      const address = generateAddress();

      // Specialties based on experience
      const specialtyOptions = role.specialties;
      const numSpecialties = yearsExperience >= 10 ? randomInt(3, specialtyOptions.length) :
                             yearsExperience >= 5 ? randomInt(2, 4) :
                             randomInt(1, 2);
      const specialties = Array.from(new Set(
        Array(numSpecialties).fill(0).map(() => randomItem(specialtyOptions))
      ));

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
        department: 'Main Theatres',
        departmentCode: 'MAIN_THEATRES',
        band,
        seniority,
        yearsExperience,
        employmentType,
        currentHospital: hospital.name,
        currentHospitalId: hospital.id,
        address,
        registrationNumber: `${roleKey.includes('RN') ? 'NMC' : 'HCPC'}${randomInt(1000000, 9999999)}`,
        registrationExpiry: '2026-12-31',
        specialties,
        qualifications: [
          roleKey.includes('RN') ? 'BSc Nursing (Adult)' : 'BSc Operating Department Practice',
          'Theatre Nursing Course',
          yearsExperience >= 3 ? 'ILS Provider' : null,
          yearsExperience >= 5 ? 'ALS Provider' : null,
          yearsExperience >= 8 ? 'Theatre Management Course' : null,
        ].filter(Boolean),
        training: [
          'Manual Handling',
          'BLS',
          yearsExperience >= 3 ? 'ILS' : null,
          yearsExperience >= 5 ? 'ALS' : null,
          'Safeguarding Level 3',
          'Infection Control',
          'WHO Surgical Safety Checklist',
        ].filter(Boolean),
        procedureFamiliarity: specialties.map(spec => `${spec} procedures`),
        instrumentationKnowledge: [
          'Basic surgical instruments',
          yearsExperience >= 3 ? 'Laparoscopic instruments' : null,
          yearsExperience >= 5 ? 'Robotic instruments' : null,
          yearsExperience >= 8 ? 'Complex orthopaedic sets' : null,
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
        certifications: [
          'BLS',
          yearsExperience >= 3 ? 'ILS' : null,
          yearsExperience >= 5 ? 'ALS' : null,
          'Theatre Nursing Diploma',
        ].filter(Boolean),
        notes: `Experienced ${role.title} with ${yearsExperience} years in theatre practice. Specializes in ${specialties.join(', ')}.`,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return staff;
}

// Main seeding function
async function seedAdditionalTheatreStaff() {
  console.log('👥 Generating 600 Additional Theatre Staff...\n');
  console.log('🚀 Starting theatre staff seeding for Major Trauma Centers...\n');

  const theatreStaff = generateTheatreStaff();

  console.log(`\n📋 Generated ${theatreStaff.length} additional theatre staff profiles\n`);

  // Seed to Firestore in batches
  const batchSize = 500;
  let batch = writeBatch(db);
  let operationCount = 0;

  for (let i = 0; i < theatreStaff.length; i++) {
    const staff = theatreStaff[i];
    const docRef = doc(db, 'staffProfiles', staff.id);
    batch.set(docRef, staff);
    operationCount++;

    if (operationCount === batchSize || i === theatreStaff.length - 1) {
      await batch.commit();
      console.log(`   Saved ${i + 1}/${theatreStaff.length} theatre staff`);
      batch = writeBatch(db);
      operationCount = 0;
    }
  }

  console.log('✅ All additional theatre staff saved!\n');

  // Summary by hospital
  console.log('📊 SUMMARY BY HOSPITAL:\n');
  for (const hospital of HOSPITALS) {
    const hospitalStaff = theatreStaff.filter(s => s.currentHospitalId === hospital.id);
    const permanent = hospitalStaff.filter(s => s.employmentType === 'Permanent');
    const bank = hospitalStaff.filter(s => s.employmentType === 'Bank');
    const locum = hospitalStaff.filter(s => s.employmentType === 'Locum');

    console.log(`   ${hospital.name}:`);
    console.log(`   - Total Staff: ${hospitalStaff.length}`);
    console.log(`   - Permanent: ${permanent.length} (${Math.round(permanent.length / hospitalStaff.length * 100)}%)`);
    console.log(`   - Bank: ${bank.length} (${Math.round(bank.length / hospitalStaff.length * 100)}%)`);
    console.log(`   - Locum: ${locum.length} (${Math.round(locum.length / hospitalStaff.length * 100)}%)`);
    console.log(`   - Staff IDs: ${hospitalStaff[0].id} to ${hospitalStaff[hospitalStaff.length - 1].id}\n`);
  }

  console.log('🎉 Theatre staff seeding completed!\n');
  console.log(`✨ Added ${theatreStaff.length} theatre staff to the database!`);
  console.log(`📍 Staff ID range: staff-01181 to staff-${String(1180 + theatreStaff.length).padStart(5, '0')}`);

  console.log('\n🏥 COMBINED TOTALS PER HOSPITAL (including previous recovery staff):');
  console.log('   Each hospital now has approximately:');
  console.log('   - 200 new theatre staff (this seeding)');
  console.log('   - 60 recovery staff (previous seeding)');
  console.log('   - ~43 original staff (previous seeding)');
  console.log('   - TOTAL: ~303 staff per hospital\n');

  process.exit(0);
}

// Run the seeding
seedAdditionalTheatreStaff().catch((error) => {
  console.error('Error seeding additional theatre staff:', error);
  process.exit(1);
});
