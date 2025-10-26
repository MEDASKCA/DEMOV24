import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';

// Firebase config - loaded from environment variables
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

// Expanded role definitions with specific titles
const ROLES = {
  scrubRN: { title: 'Scrub Nurse', code: 'SCRUB_RN', bands: ['Band 5', 'Band 6', 'Band 7'] },
  scrubODP: { title: 'Scrub ODP', code: 'SCRUB_ODP', bands: ['Band 5', 'Band 6', 'Band 7'] },
  anaesRN: { title: 'Anaesthetic Nurse', code: 'ANAES_RN', bands: ['Band 5', 'Band 6', 'Band 7'] },
  anaesODP: { title: 'Anaesthetic ODP', code: 'ANAES_ODP', bands: ['Band 5', 'Band 6', 'Band 7'] },
  hca: { title: 'Healthcare Assistant', code: 'HCA', bands: ['Band 2', 'Band 3', 'Band 4'] },
};

// Employment types with distribution
const EMPLOYMENT_TYPES = [
  { type: 'permanent', weight: 70 },
  { type: 'bank', weight: 20 },
  { type: 'locum', weight: 10 },
];

// Seniority levels
const SENIORITY_LEVELS = ['Junior', 'Mid-Level', 'Senior', 'Lead'];

// Extended first names (500 names)
const FIRST_NAMES = [
  // British names
  'James', 'Oliver', 'George', 'Harry', 'Jack', 'Jacob', 'Charlie', 'Thomas', 'Oscar', 'William',
  'Emily', 'Olivia', 'Amelia', 'Isla', 'Ava', 'Isabella', 'Lily', 'Sophie', 'Grace', 'Mia',
  'Noah', 'Muhammad', 'Leo', 'Arthur', 'Freddie', 'Archie', 'Theo', 'Henry', 'Alfie', 'Joshua',
  'Ella', 'Freya', 'Charlotte', 'Sophia', 'Poppy', 'Daisy', 'Evie', 'Alice', 'Ruby', 'Lucy',
  // More diverse names
  'Mohammed', 'Ahmed', 'Youssef', 'Omar', 'Kareem', 'Ali', 'Hassan', 'Hussein', 'Ibrahim', 'Khalid',
  'Fatima', 'Aisha', 'Mariam', 'Zainab', 'Sara', 'Layla', 'Amina', 'Yasmin', 'Nour', 'Hana',
  'Arjun', 'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Aryan', 'Sai', 'Pranav', 'Krishna', 'Ishaan',
  'Aadhya', 'Ananya', 'Diya', 'Anya', 'Saanvi', 'Navya', 'Pari', 'Shanaya', 'Kavya', 'Myra',
  'Wei', 'Ming', 'Jie', 'Chen', 'Hui', 'Yan', 'Li', 'Jun', 'Xin', 'Yu',
  'Mei', 'Ling', 'Fang', 'Xia', 'Jing', 'Yue', 'Rong', 'Shan', 'Lan', 'Qing',
  'Adam', 'Benjamin', 'Daniel', 'Ethan', 'Felix', 'Gabriel', 'Isaac', 'Jacob', 'Lucas', 'Max',
  'Abigail', 'Bella', 'Clara', 'Diana', 'Eva', 'Fiona', 'Hannah', 'Iris', 'Jasmine', 'Kate',
];

// Extended last names (500 names)
const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
  'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez',
  // British surnames
  'Davies', 'Evans', 'Hughes', 'Edwards', 'Collins', 'Murphy', 'Cook', 'Morgan', 'Cooper', 'Bell',
  'Bailey', 'Richardson', 'Cox', 'Howard', 'Ward', 'Rogers', 'Reed', 'Coleman', 'Brooks', 'Watson',
  'Wood', 'Barnes', 'Ross', 'Henderson', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Hughes',
  // South Asian surnames
  'Patel', 'Shah', 'Khan', 'Singh', 'Kumar', 'Ali', 'Ahmed', 'Rahman', 'Hassan', 'Hussain',
  'Akhtar', 'Malik', 'Choudhury', 'Das', 'Gupta', 'Sharma', 'Verma', 'Reddy', 'Rao', 'Nair',
  // East Asian surnames
  'Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou',
  'Xu', 'Sun', 'Ma', 'Zhu', 'Hu', 'Guo', 'He', 'Gao', 'Lin', 'Luo',
  // African/Caribbean surnames
  'Okafor', 'Eze', 'Nwankwo', 'Adeyemi', 'Oluwaseun', 'Mensah', 'Boateng', 'Asante', 'Baptiste', 'Joseph',
];

// London hospitals with coordinates
const LONDON_HOSPITALS = [
  { name: "Royal London Hospital", trust: "Barts Health NHS Trust", postcode: "E1 1FR", coordinates: { lat: 51.5176, lng: -0.0599 }, area: "East London" },
  { name: "St Thomas' Hospital", trust: "Guy's and St Thomas' NHS Foundation Trust", postcode: "SE1 7EH", coordinates: { lat: 51.4989, lng: -0.1183 }, area: "Central London" },
  { name: "Guy's Hospital", trust: "Guy's and St Thomas' NHS Foundation Trust", postcode: "SE1 9RT", coordinates: { lat: 51.5031, lng: -0.0874 }, area: "Central London" },
  { name: "King's College Hospital", trust: "King's College Hospital NHS Foundation Trust", postcode: "SE5 9RS", coordinates: { lat: 51.4681, lng: -0.0935 }, area: "South London" },
  { name: "University College Hospital", trust: "University College London Hospitals NHS Foundation Trust", postcode: "NW1 2BU", coordinates: { lat: 51.5266, lng: -0.1341 }, area: "Central London" },
  { name: "St Mary's Hospital", trust: "Imperial College Healthcare NHS Trust", postcode: "W2 1NY", coordinates: { lat: 51.5174, lng: -0.1755 }, area: "West London" },
  { name: "Chelsea and Westminster Hospital", trust: "Chelsea and Westminster Hospital NHS Foundation Trust", postcode: "SW10 9NH", coordinates: { lat: 51.4808, lng: -0.1881 }, area: "West London" },
  { name: "St George's Hospital", trust: "St George's University Hospitals NHS Foundation Trust", postcode: "SW17 0QT", coordinates: { lat: 51.4276, lng: -0.1733 }, area: "South London" },
  { name: "Whittington Hospital", trust: "Whittington Health NHS Trust", postcode: "N19 5NF", coordinates: { lat: 51.5649, lng: -0.1386 }, area: "North London" },
  { name: "North Middlesex Hospital", trust: "North Middlesex University Hospital NHS Trust", postcode: "N18 1QX", coordinates: { lat: 51.6098, lng: -0.0659 }, area: "North London" },
  { name: "Barnet Hospital", trust: "Royal Free London NHS Foundation Trust", postcode: "EN5 3DJ", coordinates: { lat: 51.6493, lng: -0.2033 }, area: "North London" },
  { name: "Lewisham Hospital", trust: "Lewisham and Greenwich NHS Trust", postcode: "SE13 6LH", coordinates: { lat: 51.4639, lng: -0.0131 }, area: "South London" },
  { name: "Queen Elizabeth Hospital", trust: "Lewisham and Greenwich NHS Trust", postcode: "SE18 4QH", coordinates: { lat: 51.4894, lng: 0.0594 }, area: "South East London" },
  { name: "Croydon University Hospital", trust: "Croydon Health Services NHS Trust", postcode: "CR7 7YE", coordinates: { lat: 51.3798, lng: -0.0961 }, area: "South London" },
  { name: "Newham University Hospital", trust: "Barts Health NHS Trust", postcode: "E13 8SL", coordinates: { lat: 51.5294, lng: 0.0253 }, area: "East London" },
  { name: "Homerton Hospital", trust: "Homerton Healthcare NHS Foundation Trust", postcode: "E9 6SR", coordinates: { lat: 51.5516, lng: -0.0426 }, area: "East London" },
  { name: "Ealing Hospital", trust: "London North West University Healthcare NHS Trust", postcode: "UB1 3HW", coordinates: { lat: 51.5131, lng: -0.3745 }, area: "West London" },
  { name: "West Middlesex Hospital", trust: "Chelsea and Westminster Hospital NHS Foundation Trust", postcode: "TW7 6AF", coordinates: { lat: 51.4771, lng: -0.3264 }, area: "West London" },
  { name: "Hillingdon Hospital", trust: "The Hillingdon Hospitals NHS Foundation Trust", postcode: "UB8 3NN", coordinates: { lat: 51.5344, lng: -0.4622 }, area: "North West London" },
  { name: "Epsom Hospital", trust: "Epsom and St Helier University Hospitals NHS Trust", postcode: "KT18 7EG", coordinates: { lat: 51.3263, lng: -0.2719 }, area: "Surrey" },
  { name: "Kingston Hospital", trust: "Kingston Hospital NHS Foundation Trust", postcode: "KT2 7QB", coordinates: { lat: 51.4119, lng: -0.2968 }, area: "South West London" },
  { name: "Watford General Hospital", trust: "West Hertfordshire Teaching Hospitals NHS Trust", postcode: "WD18 0HB", coordinates: { lat: 51.6513, lng: -0.3916 }, area: "Hertfordshire" },
];

// London residential addresses within 15-mile radius (will be randomly generated)
const LONDON_AREAS = [
  { area: 'Whitechapel', postcodes: ['E1 1', 'E1 2'], lat: 51.5194, lng: -0.0596 },
  { area: 'Shoreditch', postcodes: ['E1 6', 'E2 7'], lat: 51.5245, lng: -0.0825 },
  { area: 'Bethnal Green', postcodes: ['E2 0', 'E2 9'], lat: 51.5272, lng: -0.0549 },
  { area: 'Mile End', postcodes: ['E3 2', 'E3 4'], lat: 51.5253, lng: -0.0431 },
  { area: 'Stratford', postcodes: ['E15 1', 'E15 2'], lat: 51.5422, lng: -0.0034 },
  { area: 'Canning Town', postcodes: ['E16 1', 'E16 2'], lat: 51.5147, lng: 0.0082 },
  { area: 'Walthamstow', postcodes: ['E17 4', 'E17 9'], lat: 51.5875, lng: -0.0206 },
  { area: 'Southwark', postcodes: ['SE1 0', 'SE1 2'], lat: 51.5035, lng: -0.0897 },
  { area: 'Bermondsey', postcodes: ['SE16 2', 'SE16 4'], lat: 51.4975, lng: -0.0639 },
  { area: 'Camberwell', postcodes: ['SE5 0', 'SE5 7'], lat: 51.4735, lng: -0.0909 },
  { area: 'Peckham', postcodes: ['SE15 1', 'SE15 5'], lat: 51.4742, lng: -0.0692 },
  { area: 'Woolwich', postcodes: ['SE18 1', 'SE18 4'], lat: 51.4892, lng: 0.0648 },
  { area: 'Brixton', postcodes: ['SW2 1', 'SW2 5'], lat: 51.4613, lng: -0.1157 },
  { area: 'Clapham', postcodes: ['SW4 6', 'SW4 9'], lat: 51.4620, lng: -0.1380 },
  { area: 'Chelsea', postcodes: ['SW3 1', 'SW3 6'], lat: 51.4875, lng: -0.1687 },
  { area: 'Fulham', postcodes: ['SW6 1', 'SW6 5'], lat: 51.4821, lng: -0.1950 },
  { area: 'Hammersmith', postcodes: ['W6 0', 'W6 9'], lat: 51.4927, lng: -0.2339 },
  { area: 'Paddington', postcodes: ['W2 1', 'W2 6'], lat: 51.5154, lng: -0.1755 },
  { area: 'Marylebone', postcodes: ['W1U 1', 'W1U 8'], lat: 51.5224, lng: -0.1545 },
  { area: 'Islington', postcodes: ['N1 0', 'N1 9'], lat: 51.5362, lng: -0.1028 },
  { area: 'Camden', postcodes: ['NW1 0', 'NW1 9'], lat: 51.5392, lng: -0.1426 },
  { area: 'Hampstead', postcodes: ['NW3 1', 'NW3 7'], lat: 51.5559, lng: -0.1772 },
  { area: 'Highgate', postcodes: ['N6 4', 'N6 6'], lat: 51.5707, lng: -0.1469 },
  { area: 'Hackney', postcodes: ['E8 1', 'E8 4'], lat: 51.5450, lng: -0.0553 },
  { area: 'Tottenham', postcodes: ['N15 3', 'N15 6'], lat: 51.5881, lng: -0.0722 },
];

// Helper functions
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

function generateAddress() {
  const area = randomItem(LONDON_AREAS);
  const houseNumber = randomInt(1, 250);
  const streets = ['High Street', 'Church Road', 'Station Road', 'Park Avenue', 'Green Lane', 'Mill Road', 'Victoria Road', 'Manor Road', 'London Road', 'King Street'];
  const street = randomItem(streets);
  const postcode = `${randomItem(area.postcodes)}${randomInt(1, 9)}${String.fromCharCode(65 + randomInt(0, 25))}${String.fromCharCode(65 + randomInt(0, 25))}`;

  // Generate coordinates within small radius of area center
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

function generateLinkedInUrl(firstName: string, lastName: string): string {
  return `https://www.linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${randomInt(100, 999)}`;
}

function generateEmail(firstName: string, lastName: string): string {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@nhs.net`;
}

function generatePhone(): string {
  return `+44 7${randomInt(400, 999)} ${randomInt(100000, 999999)}`;
}

// Generate staff profile
function generateStaffProfile(index: number): any {
  const roleKey = randomItem(Object.keys(ROLES)) as keyof typeof ROLES;
  const role = ROLES[roleKey];
  const firstName = randomItem(FIRST_NAMES);
  const lastName = randomItem(LAST_NAMES);
  const hospital = randomItem(LONDON_HOSPITALS);
  const homeAddress = generateAddress();

  // Calculate years of experience and seniority
  const yearsExperience = randomInt(1, 25);
  let seniority: string;
  let band: string;

  if (role.code === 'HCA') {
    seniority = yearsExperience < 3 ? 'Junior' : yearsExperience < 7 ? 'Mid-Level' : 'Senior';
    band = yearsExperience < 2 ? 'Band 2' : yearsExperience < 5 ? 'Band 3' : 'Band 4';
  } else {
    if (yearsExperience < 3) {
      seniority = 'Junior';
      band = 'Band 5';
    } else if (yearsExperience < 7) {
      seniority = 'Mid-Level';
      band = Math.random() > 0.5 ? 'Band 5' : 'Band 6';
    } else if (yearsExperience < 12) {
      seniority = 'Senior';
      band = Math.random() > 0.3 ? 'Band 6' : 'Band 7';
    } else {
      seniority = 'Lead';
      band = randomItem(['Band 7', 'Band 8a']);
    }
  }

  // Employment type weighted random
  const employmentRandom = Math.random() * 100;
  let employmentType = 'permanent';
  let cumulative = 0;
  for (const emp of EMPLOYMENT_TYPES) {
    cumulative += emp.weight;
    if (employmentRandom <= cumulative) {
      employmentType = emp.type;
      break;
    }
  }

  const profile = {
    registrationId: `TOM-NHS-2025-${String(index + 1000).padStart(4, '0')}`,
    firstName,
    lastName,
    email: generateEmail(firstName, lastName),
    phone: generatePhone(),
    linkedIn: generateLinkedInUrl(firstName, lastName),

    // Home address (not displayed in UI)
    homeAddress,

    // Work location
    currentTrust: hospital.trust,
    currentHospital: hospital.name,
    currentDepartment: randomItem(['Main Theatres', 'Day Surgery', 'Cardiac Theatres', 'Neuro Theatres', 'Orthopaedic Theatres']),

    location: {
      coordinates: hospital.coordinates,
      postcode: hospital.postcode,
      area: hospital.area,
    },

    // Role and experience
    role: role.title,
    roleCode: role.code,
    band,
    seniority,
    yearsExperience,
    employmentType,

    // Availability
    isActive: Math.random() > 0.15, // 85% active
    verified: Math.random() > 0.1, // 90% verified

    availability: {
      preferredRadius: randomInt(5, 20),
      willingToTravel: randomInt(10, 30),
      preferredShifts: randomItems(['early', 'late', 'night', 'long-day'], randomInt(2, 4)),
      preferredSpecialties: [], // Will be filled with procedures
      unavailableDates: [],
      sicknessRecords: [],
    },

    // Performance
    performance: {
      rating: +(Math.random() * 1.5 + 3.5).toFixed(1),
      totalShifts: randomInt(20, 500),
      completedShifts: 0, // Will calculate
    },

    // Competencies
    competencyStats: {
      mandatory: randomInt(8, 15),
      clinical: randomInt(30, 120),
      technical: randomInt(15, 50),
      professional: randomInt(5, 20),
    },

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  profile.performance.completedShifts = profile.performance.totalShifts - randomInt(0, 3);

  return profile;
}

// Main seeding function
async function seed1000Profiles() {
  try {
    console.log('🚀 Starting to generate 1,000 staff profiles...\n');

    const BATCH_SIZE = 500; // Firestore batch limit
    const TOTAL_PROFILES = 1000;

    let totalSaved = 0;

    for (let batchStart = 0; batchStart < TOTAL_PROFILES; batchStart += BATCH_SIZE) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE, TOTAL_PROFILES);
      const batchSize = batchEnd - batchStart;

      console.log(`\n📦 Processing batch ${Math.floor(batchStart / BATCH_SIZE) + 1}/${Math.ceil(TOTAL_PROFILES / BATCH_SIZE)}`);
      console.log(`   Generating profiles ${batchStart + 1} to ${batchEnd}...`);

      const batch = writeBatch(db);

      for (let i = batchStart; i < batchEnd; i++) {
        const profile = generateStaffProfile(i);
        const docRef = doc(collection(db, 'staff'));
        batch.set(docRef, profile);

        if ((i - batchStart + 1) % 100 === 0) {
          console.log(`   Generated ${i - batchStart + 1}/${batchSize} profiles in this batch...`);
        }
      }

      console.log(`   💾 Saving batch to Firebase...`);
      await batch.commit();
      totalSaved += batchSize;
      console.log(`   ✅ Saved ${batchSize} profiles (Total: ${totalSaved}/${TOTAL_PROFILES})`);
    }

    console.log(`\n🎉 Successfully generated and saved all ${TOTAL_PROFILES} staff profiles!`);

    // Summary statistics
    console.log(`\n📊 Summary:`);
    console.log(`   Total profiles: ${TOTAL_PROFILES}`);
    console.log(`   Hospitals: ${LONDON_HOSPITALS.length}`);
    console.log(`   Residential areas: ${LONDON_AREAS.length}`);
    console.log(`   Role types: ${Object.keys(ROLES).length}`);

  } catch (error) {
    console.error('❌ Error seeding profiles:', error);
    throw error;
  }
}

// Run the seeding
seed1000Profiles()
  .then(() => {
    console.log('\n✨ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
