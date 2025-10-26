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

// ==================== HOSPITALS DATABASE ====================
const HOSPITALS = [
  // NHS - Central London
  { id: 'hosp-001', name: "St Thomas' Hospital", trust: "Guy's and St Thomas' NHS Foundation Trust", type: 'nhs', address: "Westminster Bridge Road", city: "London", postcode: "SE1 7EH", phone: "020 7188 7188", coordinates: { lat: 51.4989, lng: -0.1183 }, beds: 840, theatres: 31, specialties: ['Cardiac', 'Neuro', 'General', 'Ortho', 'Vascular'], hasEmergency: true },
  { id: 'hosp-002', name: "Guy's Hospital", trust: "Guy's and St Thomas' NHS Foundation Trust", type: 'nhs', address: "Great Maze Pond", city: "London", postcode: "SE1 9RT", phone: "020 7188 7188", coordinates: { lat: 51.5031, lng: -0.0874 }, beds: 720, theatres: 24, specialties: ['General', 'Urology', 'ENT', 'Dental'], hasEmergency: true },
  { id: 'hosp-003', name: "King's College Hospital", trust: "King's College Hospital NHS Foundation Trust", type: 'nhs', address: "Denmark Hill", city: "London", postcode: "SE5 9RS", phone: "020 3299 9000", coordinates: { lat: 51.4681, lng: -0.0935 }, beds: 950, theatres: 32, specialties: ['Trauma', 'Neuro', 'Liver', 'Haematology'], hasEmergency: true },
  { id: 'hosp-004', name: "University College Hospital", trust: "University College London Hospitals NHS Foundation Trust", type: 'nhs', address: "235 Euston Road", city: "London", postcode: "NW1 2BU", phone: "020 3456 7890", coordinates: { lat: 51.5266, lng: -0.1341 }, beds: 665, theatres: 28, specialties: ['Cancer', 'Cardiac', 'Neuro', 'Womens'], hasEmergency: true },
  { id: 'hosp-005', name: "Royal London Hospital", trust: "Barts Health NHS Trust", type: 'nhs', address: "Whitechapel Road", city: "London", postcode: "E1 1FR", phone: "020 3416 5000", coordinates: { lat: 51.5176, lng: -0.0599 }, beds: 845, theatres: 35, specialties: ['Trauma', 'Cardiac', 'Neuro', 'Renal'], hasEmergency: true },
  { id: 'hosp-006', name: "St Bartholomew's Hospital", trust: "Barts Health NHS Trust", type: 'nhs', address: "West Smithfield", city: "London", postcode: "EC1A 7BE", phone: "020 3416 5000", coordinates: { lat: 51.5180, lng: -0.1003 }, beds: 388, theatres: 18, specialties: ['Cardiac', 'Cancer', 'Cardiac Surgery'], hasEmergency: false },
  { id: 'hosp-007', name: "St Mary's Hospital", trust: "Imperial College Healthcare NHS Trust", type: 'nhs', address: "Praed Street", city: "London", postcode: "W2 1NY", phone: "020 3312 6666", coordinates: { lat: 51.5174, lng: -0.1755 }, beds: 460, theatres: 22, specialties: ['General', 'Trauma', 'Neuro', 'Obstetrics'], hasEmergency: true },
  { id: 'hosp-008', name: "Chelsea and Westminster Hospital", trust: "Chelsea and Westminster Hospital NHS Foundation Trust", type: 'nhs', address: "369 Fulham Road", city: "London", postcode: "SW10 9NH", phone: "020 3315 8000", coordinates: { lat: 51.4808, lng: -0.1881 }, beds: 430, theatres: 20, specialties: ['General', 'Ortho', 'Burns', 'HIV'], hasEmergency: true },
  { id: 'hosp-009', name: "Charing Cross Hospital", trust: "Imperial College Healthcare NHS Trust", type: 'nhs', address: "Fulham Palace Road", city: "London", postcode: "W6 8RF", phone: "020 3311 1234", coordinates: { lat: 51.4888, lng: -0.2196 }, beds: 360, theatres: 16, specialties: ['General', 'Vascular', 'Stroke', 'Renal'], hasEmergency: true },
  { id: 'hosp-010', name: "Hammersmith Hospital", trust: "Imperial College Healthcare NHS Trust", type: 'nhs', address: "Du Cane Road", city: "London", postcode: "W12 0HS", phone: "020 3313 1000", coordinates: { lat: 51.5170, lng: -0.2333 }, beds: 386, theatres: 18, specialties: ['Renal', 'Cancer', 'Haematology'], hasEmergency: false },

  // NHS - North London
  { id: 'hosp-011', name: "Whittington Hospital", trust: "Whittington Health NHS Trust", type: 'nhs', address: "Magdala Avenue", city: "London", postcode: "N19 5NF", phone: "020 7272 3070", coordinates: { lat: 51.5649, lng: -0.1386 }, beds: 420, theatres: 14, specialties: ['General', 'Ortho', 'Obstetrics'], hasEmergency: true },
  { id: 'hosp-012', name: "North Middlesex Hospital", trust: "North Middlesex University Hospital NHS Trust", type: 'nhs', address: "Sterling Way", city: "London", postcode: "N18 1QX", phone: "020 8887 2000", coordinates: { lat: 51.6098, lng: -0.0659 }, beds: 540, theatres: 18, specialties: ['General', 'Trauma', 'Obstetrics'], hasEmergency: true },
  { id: 'hosp-013', name: "Barnet Hospital", trust: "Royal Free London NHS Foundation Trust", type: 'nhs', address: "Wellhouse Lane", city: "Barnet", postcode: "EN5 3DJ", phone: "020 8216 4600", coordinates: { lat: 51.6493, lng: -0.2033 }, beds: 420, theatres: 15, specialties: ['General', 'Ortho', 'Obstetrics'], hasEmergency: true },
  { id: 'hosp-014', name: "Royal Free Hospital", trust: "Royal Free London NHS Foundation Trust", type: 'nhs', address: "Pond Street", city: "London", postcode: "NW3 2QG", phone: "020 7794 0500", coordinates: { lat: 51.5519, lng: -0.1646 }, beds: 850, theatres: 26, specialties: ['General', 'Renal', 'Liver', 'HIV'], hasEmergency: true },

  // NHS - South London
  { id: 'hosp-015', name: "St George's Hospital", trust: "St George's University Hospitals NHS Foundation Trust", type: 'nhs', address: "Blackshaw Road", city: "London", postcode: "SW17 0QT", phone: "020 8672 1255", coordinates: { lat: 51.4276, lng: -0.1733 }, beds: 950, theatres: 30, specialties: ['Trauma', 'Neuro', 'Cardiac', 'Stroke'], hasEmergency: true },
  { id: 'hosp-016', name: "Lewisham Hospital", trust: "Lewisham and Greenwich NHS Trust", type: 'nhs', address: "High Street", city: "London", postcode: "SE13 6LH", phone: "020 8333 3000", coordinates: { lat: 51.4639, lng: -0.0131 }, beds: 550, theatres: 16, specialties: ['General', 'Ortho', 'Obstetrics'], hasEmergency: true },
  { id: 'hosp-017', name: "Queen Elizabeth Hospital", trust: "Lewisham and Greenwich NHS Trust", type: 'nhs', address: "Stadium Road", city: "London", postcode: "SE18 4QH", phone: "020 8836 6000", coordinates: { lat: 51.4894, lng: 0.0594 }, beds: 540, theatres: 18, specialties: ['General', 'Renal', 'Ortho'], hasEmergency: true },
  { id: 'hosp-018', name: "Croydon University Hospital", trust: "Croydon Health Services NHS Trust", type: 'nhs', address: "530 London Road", city: "Croydon", postcode: "CR7 7YE", phone: "020 8401 3000", coordinates: { lat: 51.3798, lng: -0.0961 }, beds: 520, theatres: 17, specialties: ['General', 'Trauma', 'Obstetrics'], hasEmergency: true },
  { id: 'hosp-019', name: "Princess Royal University Hospital", trust: "King's College Hospital NHS Foundation Trust", type: 'nhs', address: "Farnborough Common", city: "Orpington", postcode: "BR6 8ND", phone: "01689 863000", coordinates: { lat: 51.3486, lng: 0.0789 }, beds: 480, theatres: 15, specialties: ['General', 'Ortho', 'Obstetrics'], hasEmergency: true },

  // NHS - East London
  { id: 'hosp-020', name: "Newham University Hospital", trust: "Barts Health NHS Trust", type: 'nhs', address: "Glen Road", city: "London", postcode: "E13 8SL", phone: "020 7476 4000", coordinates: { lat: 51.5294, lng: 0.0253 }, beds: 480, theatres: 16, specialties: ['General', 'Obstetrics', 'Paediatrics'], hasEmergency: true },
  { id: 'hosp-021', name: "Homerton Hospital", trust: "Homerton Healthcare NHS Foundation Trust", type: 'nhs', address: "Homerton Row", city: "London", postcode: "E9 6SR", phone: "020 8510 5555", coordinates: { lat: 51.5516, lng: -0.0426 }, beds: 430, theatres: 14, specialties: ['General', 'Obstetrics', 'Sexual Health'], hasEmergency: true },

  // NHS - West London
  { id: 'hosp-022', name: "Ealing Hospital", trust: "London North West University Healthcare NHS Trust", type: 'nhs', address: "Uxbridge Road", city: "Southall", postcode: "UB1 3HW", phone: "020 8967 5000", coordinates: { lat: 51.5131, lng: -0.3745 }, beds: 340, theatres: 12, specialties: ['General', 'Ortho', 'Obstetrics'], hasEmergency: true },
  { id: 'hosp-023', name: "Northwick Park Hospital", trust: "London North West University Healthcare NHS Trust", type: 'nhs', address: "Watford Road", city: "Harrow", postcode: "HA1 3UJ", phone: "020 8864 3232", coordinates: { lat: 51.5782, lng: -0.3136 }, beds: 590, theatres: 19, specialties: ['General', 'Stroke', 'Trauma'], hasEmergency: true },
  { id: 'hosp-024', name: "West Middlesex Hospital", trust: "Chelsea and Westminster Hospital NHS Foundation Trust", type: 'nhs', address: "Twickenham Road", city: "Isleworth", postcode: "TW7 6AF", phone: "020 8321 5000", coordinates: { lat: 51.4771, lng: -0.3264 }, beds: 380, theatres: 13, specialties: ['General', 'Ortho', 'Obstetrics'], hasEmergency: true },
  { id: 'hosp-025', name: "Hillingdon Hospital", trust: "The Hillingdon Hospitals NHS Foundation Trust", type: 'nhs', address: "Pield Heath Road", city: "Uxbridge", postcode: "UB8 3NN", phone: "01895 238282", coordinates: { lat: 51.5344, lng: -0.4622 }, beds: 460, theatres: 15, specialties: ['General', 'Ortho', 'Obstetrics'], hasEmergency: true },
  { id: 'hosp-026', name: "Mount Vernon Hospital", trust: "The Hillingdon Hospitals NHS Foundation Trust", type: 'nhs', address: "Rickmansworth Road", city: "Northwood", postcode: "HA6 2RN", phone: "01923 826111", coordinates: { lat: 51.6083, lng: -0.4236 }, beds: 220, theatres: 8, specialties: ['Cancer', 'Cardiac Rehab'], hasEmergency: false },

  // PRIVATE HOSPITALS - Central London
  { id: 'hosp-101', name: "The London Clinic", trust: "Independent", type: 'private', address: "20 Devonshire Place", city: "London", postcode: "W1G 6BW", phone: "020 7935 4444", coordinates: { lat: 51.5205, lng: -0.1478 }, beds: 170, theatres: 16, specialties: ['Cardiac', 'Neuro', 'Ortho', 'Cancer'], hasEmergency: false },
  { id: 'hosp-102', name: "The Wellington Hospital", trust: "HCA Healthcare UK", type: 'private', address: "8A Wellington Place", city: "London", postcode: "NW8 9LE", phone: "020 7586 5959", coordinates: { lat: 51.5264, lng: -0.1731 }, beds: 265, theatres: 24, specialties: ['Cardiac', 'Neuro', 'Ortho', 'Cancer'], hasEmergency: false },
  { id: 'hosp-103', name: "The Portland Hospital", trust: "HCA Healthcare UK", type: 'private', address: "205-209 Great Portland Street", city: "London", postcode: "W1W 5AH", phone: "020 7580 4400", coordinates: { lat: 51.5238, lng: -0.1421 }, beds: 120, theatres: 12, specialties: ['Obstetrics', 'Paediatrics', 'Womens'], hasEmergency: false },
  { id: 'hosp-104', name: "The Lister Hospital", trust: "HCA Healthcare UK", type: 'private', address: "Chelsea Bridge Road", city: "London", postcode: "SW1W 8RH", phone: "020 7730 7733", coordinates: { lat: 51.4866, lng: -0.1481 }, beds: 85, theatres: 12, specialties: ['General', 'Ortho', 'Gynaecology'], hasEmergency: false },
  { id: 'hosp-105', name: "The Princess Grace Hospital", trust: "HCA Healthcare UK", type: 'private', address: "42-52 Nottingham Place", city: "London", postcode: "W1U 5NY", phone: "020 7486 1234", coordinates: { lat: 51.5212, lng: -0.1549 }, beds: 150, theatres: 15, specialties: ['Cancer', 'Cardiac', 'Ortho'], hasEmergency: false },
];

// ==================== SHIFT PATTERNS ====================
const SHIFT_PATTERNS = [
  { id: 'shift-001', name: 'Standard Day', code: 'STD_DAY', startTime: '08:00', endTime: '18:00', duration: 10, breakMinutes: 60, type: 'day', payRate: 1.0 },
  { id: 'shift-002', name: 'Morning Half', code: 'AM_HALF', startTime: '08:00', endTime: '13:00', duration: 5, breakMinutes: 0, type: 'day', payRate: 0.5 },
  { id: 'shift-003', name: 'Afternoon Half', code: 'PM_HALF', startTime: '13:00', endTime: '18:00', duration: 5, breakMinutes: 0, type: 'day', payRate: 0.5 },
  { id: 'shift-004', name: 'Extended Day', code: 'EXT_DAY', startTime: '08:00', endTime: '20:00', duration: 12, breakMinutes: 60, type: 'long-day', payRate: 1.2 },
  { id: 'shift-005', name: 'Extended Day Plus', code: 'EXT_DAY_PLUS', startTime: '08:00', endTime: '20:30', duration: 12.5, breakMinutes: 60, type: 'long-day', payRate: 1.25 },
  { id: 'shift-006', name: 'Night Shift', code: 'NIGHT', startTime: '20:30', endTime: '08:00', duration: 11.5, breakMinutes: 60, type: 'night', payRate: 1.35 },
  { id: 'shift-007', name: 'Long Night', code: 'LONG_NIGHT', startTime: '20:00', endTime: '08:00', duration: 12, breakMinutes: 60, type: 'night', payRate: 1.4 },
  { id: 'shift-008', name: 'Early Day', code: 'EARLY', startTime: '08:00', endTime: '17:00', duration: 10, breakMinutes: 60, type: 'day', payRate: 1.0 },
  { id: 'shift-009', name: 'Late Shift', code: 'LATE', startTime: '13:00', endTime: '21:00', duration: 8, breakMinutes: 30, type: 'late', payRate: 1.1 },
  { id: 'shift-010', name: 'Twilight', code: 'TWILIGHT', startTime: '17:00', endTime: '21:00', duration: 4, breakMinutes: 0, type: 'twilight', payRate: 1.15 },
  { id: 'shift-011', name: 'On-Call', code: 'ON_CALL', startTime: '17:00', endTime: '08:00', duration: 15, breakMinutes: 0, type: 'on-call', payRate: 0.3 },
  { id: 'shift-012', name: 'Weekend Day', code: 'WKND_DAY', startTime: '08:00', endTime: '18:00', duration: 10, breakMinutes: 60, type: 'day', payRate: 1.5 },
  { id: 'shift-013', name: 'Weekend Night', code: 'WKND_NIGHT', startTime: '20:00', endTime: '08:00', duration: 12, breakMinutes: 60, type: 'night', payRate: 1.75 },
  { id: 'shift-014', name: 'Bank Holiday', code: 'BH_DAY', startTime: '08:00', endTime: '18:00', duration: 10, breakMinutes: 60, type: 'day', payRate: 2.0 },
];

console.log('🎯 Master Database Seeding Script Ready!');
console.log(`📊 Will seed:`);
console.log(`   - ${HOSPITALS.length} Hospitals`);
console.log(`   - ${SHIFT_PATTERNS.length} Shift Patterns`);
console.log(`   - Plus: Consumables, Equipment, Procedures (coming next)...\n`);

async function seedMasterDatabase() {
  try {
    console.log('🚀 Starting master database seeding...\n');

    // Seed Hospitals
    console.log('🏥 Seeding hospitals...');
    let batch = writeBatch(db);
    let count = 0;

    for (const hospital of HOSPITALS) {
      const docRef = doc(db, 'hospitals', hospital.id);
      batch.set(docRef, hospital);
      count++;

      if (count % 10 === 0) {
        console.log(`   Saved ${count}/${HOSPITALS.length} hospitals...`);
      }
    }

    await batch.commit();
    console.log(`✅ Saved ${HOSPITALS.length} hospitals!\n`);

    // Seed Shift Patterns
    console.log('⏰ Seeding shift patterns...');
    batch = writeBatch(db);

    for (const shift of SHIFT_PATTERNS) {
      const docRef = doc(db, 'shiftPatterns', shift.id);
      batch.set(docRef, shift);
    }

    await batch.commit();
    console.log(`✅ Saved ${SHIFT_PATTERNS.length} shift patterns!\n`);

    console.log('🎉 Master database seeding completed!');

  } catch (error) {
    console.error('❌ Error seeding master database:', error);
    throw error;
  }
}

seedMasterDatabase()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
