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

// Surgical Specialties
const SURGICAL_SPECIALTIES = [
  'General Surgery',
  'Orthopaedic Surgery',
  'Trauma & Orthopaedics',
  'Cardiac Surgery',
  'Cardiothoracic Surgery',
  'Neurosurgery',
  'Vascular Surgery',
  'Colorectal Surgery',
  'Upper GI Surgery',
  'Hepatobiliary Surgery',
  'Urology',
  'Gynaecology',
  'ENT Surgery',
  'Plastics & Reconstructive Surgery',
  'Paediatric Surgery',
  'Transplant Surgery'
];

// Anaesthetic Specialties
const ANAES_SPECIALTIES = [
  'General Anaesthetics',
  'Cardiac Anaesthetics',
  'Neuroanaesthetics',
  'Obstetric Anaesthetics',
  'Paediatric Anaesthetics',
  'Regional Anaesthetics',
  'Pain Medicine',
  'ICU & Anaesthetics'
];

// Three Major Trauma Centers
const HOSPITALS = [
  { id: 'hosp-004', name: "King's College Hospital NHS Foundation Trust" },
  { id: 'hosp-008', name: "St. Mary's Hospital Imperial College Healthcare NHS Trust" },
  { id: 'hosp-011', name: 'Royal London Hospital Barts Health NHS Trust' },
];

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

// London areas
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

// Generate Surgeons and Anaesthetists
function generateMedicalStaff(): any[] {
  const staff: any[] = [];
  let staffId = 1781; // Continue from staff-01780

  for (const hospital of HOSPITALS) {
    console.log(`\nGenerating medical staff for ${hospital.name}...`);

    // Generate 40 Consultant Surgeons per hospital
    console.log(`  - Adding 40 Consultant Surgeons...`);
    for (let i = 0; i < 40; i++) {
      const firstName = randomItem(FIRST_NAMES);
      const lastName = randomItem(LAST_NAMES);
      const yearsExperience = randomInt(10, 30); // Consultants have 10+ years
      const dob = new Date(1960 + randomInt(0, 25), randomInt(0, 11), randomInt(1, 28));
      const address = generateAddress();

      const numSpecialties = randomInt(1, 3);
      const specialties = Array.from(new Set(
        Array(numSpecialties).fill(0).map(() => randomItem(SURGICAL_SPECIALTIES))
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
        role: 'Consultant Surgeon',
        roleCode: 'CONSULTANT_SURGEON',
        department: 'Surgery',
        departmentCode: 'SURGERY',
        band: 'Consultant',
        seniority: 'Consultant',
        yearsExperience,
        employmentType: 'Permanent',
        currentHospital: hospital.name,
        currentHospitalId: hospital.id,
        address,
        registrationNumber: `GMC${randomInt(4000000, 7999999)}`,
        registrationExpiry: '2026-12-31',
        specialties,
        qualifications: [
          'MB BS',
          'MRCS',
          'FRCS',
          yearsExperience >= 15 ? 'MD' : null,
          'Advanced Laparoscopic Surgery',
        ].filter(Boolean),
        training: [
          'ATLS Provider',
          'ALS Provider',
          'Safeguarding Level 3',
          'Leadership & Management',
        ],
        linkedInProfile: `https://www.linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${randomInt(100, 999)}`,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: Math.random() > 0.7,
          sunday: Math.random() > 0.8,
        },
        shiftPreferences: ['STD_DAY', 'LONG_DAY', 'ON_CALL'],
        certifications: ['ATLS', 'ALS', 'FRCS'],
        notes: `Consultant ${specialties[0]} surgeon with ${yearsExperience} years of experience.`,
        createdAt: new Date().toISOString(),
      });
    }

    // Generate 20 Assistant Surgeons (Registrars) per hospital
    console.log(`  - Adding 20 Assistant Surgeons (Registrars)...`);
    for (let i = 0; i < 20; i++) {
      const firstName = randomItem(FIRST_NAMES);
      const lastName = randomItem(LAST_NAMES);
      const yearsExperience = randomInt(5, 10); // Registrars have 5-10 years
      const dob = new Date(1985 + randomInt(0, 10), randomInt(0, 11), randomInt(1, 28));
      const address = generateAddress();

      const numSpecialties = randomInt(1, 2);
      const specialties = Array.from(new Set(
        Array(numSpecialties).fill(0).map(() => randomItem(SURGICAL_SPECIALTIES))
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
        role: 'Assistant Surgeon',
        roleCode: 'ASSISTANT_SURGEON',
        department: 'Surgery',
        departmentCode: 'SURGERY',
        band: 'ST6-8',
        seniority: 'Registrar',
        yearsExperience,
        employmentType: 'Permanent',
        currentHospital: hospital.name,
        currentHospitalId: hospital.id,
        address,
        registrationNumber: `GMC${randomInt(7000000, 7999999)}`,
        registrationExpiry: '2026-12-31',
        specialties,
        qualifications: [
          'MB BS',
          'MRCS',
          yearsExperience >= 8 ? 'FRCS (in progress)' : null,
        ].filter(Boolean),
        training: [
          'ATLS Provider',
          'ALS Provider',
          'Safeguarding Level 3',
        ],
        linkedInProfile: `https://www.linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${randomInt(100, 999)}`,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: Math.random() > 0.5,
        },
        shiftPreferences: ['STD_DAY', 'LONG_DAY', 'ON_CALL', 'NIGHT'],
        certifications: ['ATLS', 'ALS', 'MRCS'],
        notes: `${specialties[0]} registrar with ${yearsExperience} years of surgical training.`,
        createdAt: new Date().toISOString(),
      });
    }

    // Generate 35 Consultant Anaesthetists per hospital
    console.log(`  - Adding 35 Consultant Anaesthetists...`);
    for (let i = 0; i < 35; i++) {
      const firstName = randomItem(FIRST_NAMES);
      const lastName = randomItem(LAST_NAMES);
      const yearsExperience = randomInt(10, 30); // Consultants have 10+ years
      const dob = new Date(1960 + randomInt(0, 25), randomInt(0, 11), randomInt(1, 28));
      const address = generateAddress();

      const numSpecialties = randomInt(1, 3);
      const specialties = Array.from(new Set(
        Array(numSpecialties).fill(0).map(() => randomItem(ANAES_SPECIALTIES))
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
        role: 'Consultant Anaesthetist',
        roleCode: 'CONSULTANT_ANAESTHETIST',
        department: 'Anaesthetics',
        departmentCode: 'ANAESTHETICS',
        band: 'Consultant',
        seniority: 'Consultant',
        yearsExperience,
        employmentType: 'Permanent',
        currentHospital: hospital.name,
        currentHospitalId: hospital.id,
        address,
        registrationNumber: `GMC${randomInt(4000000, 7999999)}`,
        registrationExpiry: '2026-12-31',
        specialties,
        qualifications: [
          'MB BS',
          'FRCA',
          yearsExperience >= 15 ? 'MD' : null,
          'Advanced Airway Management',
        ].filter(Boolean),
        training: [
          'ATLS Provider',
          'ALS Provider',
          'Difficult Airway Society',
          'Safeguarding Level 3',
        ],
        linkedInProfile: `https://www.linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${randomInt(100, 999)}`,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: Math.random() > 0.7,
          sunday: Math.random() > 0.8,
        },
        shiftPreferences: ['STD_DAY', 'LONG_DAY', 'ON_CALL'],
        certifications: ['ATLS', 'ALS', 'FRCA'],
        notes: `Consultant Anaesthetist specializing in ${specialties[0]} with ${yearsExperience} years of experience.`,
        createdAt: new Date().toISOString(),
      });
    }

    // Generate 20 Anaesthetic Registrars per hospital
    console.log(`  - Adding 20 Anaesthetic Registrars...`);
    for (let i = 0; i < 20; i++) {
      const firstName = randomItem(FIRST_NAMES);
      const lastName = randomItem(LAST_NAMES);
      const yearsExperience = randomInt(5, 10); // Registrars have 5-10 years
      const dob = new Date(1985 + randomInt(0, 10), randomInt(0, 11), randomInt(1, 28));
      const address = generateAddress();

      const numSpecialties = randomInt(1, 2);
      const specialties = Array.from(new Set(
        Array(numSpecialties).fill(0).map(() => randomItem(ANAES_SPECIALTIES))
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
        role: 'Anaesthetic Registrar',
        roleCode: 'ANAES_REGISTRAR',
        department: 'Anaesthetics',
        departmentCode: 'ANAESTHETICS',
        band: 'ST5-7',
        seniority: 'Registrar',
        yearsExperience,
        employmentType: 'Permanent',
        currentHospital: hospital.name,
        currentHospitalId: hospital.id,
        address,
        registrationNumber: `GMC${randomInt(7000000, 7999999)}`,
        registrationExpiry: '2026-12-31',
        specialties,
        qualifications: [
          'MB BS',
          'MRCP or MRCS',
          yearsExperience >= 8 ? 'FRCA (in progress)' : null,
        ].filter(Boolean),
        training: [
          'ATLS Provider',
          'ALS Provider',
          'Safeguarding Level 3',
        ],
        linkedInProfile: `https://www.linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${randomInt(100, 999)}`,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: Math.random() > 0.5,
        },
        shiftPreferences: ['STD_DAY', 'LONG_DAY', 'ON_CALL', 'NIGHT'],
        certifications: ['ATLS', 'ALS'],
        notes: `Anaesthetic registrar in ${specialties[0]} with ${yearsExperience} years of training.`,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return staff;
}

// Main seeding function
async function seedSurgeonsAndAnaesthetists() {
  console.log('👨‍⚕️ Generating Surgeons and Anaesthetists for Major Trauma Centers...\n');

  const medicalStaff = generateMedicalStaff();

  console.log(`\n📋 Generated ${medicalStaff.length} medical staff profiles\n`);

  // Seed to Firestore in batches
  const batchSize = 500;
  let batch = writeBatch(db);
  let operationCount = 0;

  for (let i = 0; i < medicalStaff.length; i++) {
    const staff = medicalStaff[i];
    const docRef = doc(db, 'staffProfiles', staff.id);
    batch.set(docRef, staff);
    operationCount++;

    if (operationCount === batchSize || i === medicalStaff.length - 1) {
      await batch.commit();
      console.log(`   Saved ${i + 1}/${medicalStaff.length} staff`);
      batch = writeBatch(db);
      operationCount = 0;
    }
  }

  console.log('\n✅ All medical staff saved!\n');

  // Summary
  const consultantSurgeons = medicalStaff.filter(s => s.role === 'Consultant Surgeon');
  const assistantSurgeons = medicalStaff.filter(s => s.role === 'Assistant Surgeon');
  const consultantAnaesthetists = medicalStaff.filter(s => s.role === 'Consultant Anaesthetist');
  const anaesRegistrars = medicalStaff.filter(s => s.role === 'Anaesthetic Registrar');

  console.log('📊 SUMMARY BY ROLE:\n');
  console.log(`   Consultant Surgeons: ${consultantSurgeons.length}`);
  console.log(`   Assistant Surgeons (Registrars): ${assistantSurgeons.length}`);
  console.log(`   Consultant Anaesthetists: ${consultantAnaesthetists.length}`);
  console.log(`   Anaesthetic Registrars: ${anaesRegistrars.length}`);
  console.log(`   TOTAL: ${medicalStaff.length}\n`);

  console.log('📊 SUMMARY BY HOSPITAL:\n');
  for (const hospital of HOSPITALS) {
    const hospitalStaff = medicalStaff.filter(s => s.currentHospitalId === hospital.id);
    console.log(`   ${hospital.name}:`);
    console.log(`   - Total Staff: ${hospitalStaff.length}`);
    console.log(`   - Consultant Surgeons: ${hospitalStaff.filter(s => s.role === 'Consultant Surgeon').length}`);
    console.log(`   - Assistant Surgeons: ${hospitalStaff.filter(s => s.role === 'Assistant Surgeon').length}`);
    console.log(`   - Consultant Anaesthetists: ${hospitalStaff.filter(s => s.role === 'Consultant Anaesthetist').length}`);
    console.log(`   - Anaesthetic Registrars: ${hospitalStaff.filter(s => s.role === 'Anaesthetic Registrar').length}\n`);
  }

  console.log(`\n📍 Staff ID range: staff-01781 to staff-${String(1780 + medicalStaff.length).padStart(5, '0')}`);
  console.log(`\n🏥 TOTAL STAFF IN DATABASE: ${780 + medicalStaff.length} (780 existing + ${medicalStaff.length} new)`);

  process.exit(0);
}

// Run the seeding
seedSurgeonsAndAnaesthetists().catch((error) => {
  console.error('Error seeding surgeons and anaesthetists:', error);
  process.exit(1);
});
