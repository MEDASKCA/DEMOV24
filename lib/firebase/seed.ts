import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS, StaffMember, Theatre } from '@/types/tom';

import staffNamesData from '@/data/seed/staff-names.json';
import locationsData from '@/data/seed/locations.json';

// Helper to generate a random date in the past year
const randomPastDate = () => {
  const now = Date.now();
  const yearAgo = now - 365 * 24 * 60 * 60 * 1000;
  return new Date(yearAgo + Math.random() * (now - yearAgo));
};

// Helper to generate shift times
const generateShift = (type: 'early' | 'late' | 'night') => {
  const shifts = {
    early: { start: '08:00', end: '15:00' },
    late: { start: '14:00', end: '22:00' },
    night: { start: '21:00', end: '08:00' }
  };
  return shifts[type];
};

// Helper to map staff names to departments
const getDepartment = (staffName: string): 'Main Theatres' | 'DSU Theatres' | 'Recovery' | 'Anaesthetics' => {
  if (staffName.startsWith('RN') || staffName.startsWith('ODP')) return 'Main Theatres';
  if (staffName.startsWith('HCA')) return 'DSU Theatres';
  if (staffName.startsWith('Mr.') || staffName.startsWith('Miss.')) return 'Main Theatres';
  if (staffName.startsWith('FY') || staffName.startsWith('CT') || staffName.startsWith('ST')) return 'Main Theatres';
  if (staffName.startsWith('Dr.')) return 'Anaesthetics';
  return 'Main Theatres';
};

// Helper to map staff names to roles
const getRole = (staffName: string): 'Anaes N/P' | 'Scrub N/P' | 'HCA' | 'Recovery Nurse' | 'ODP' | 'Consultant Anaesthetist' | 'Consultant Surgeon' => {
  if (staffName.startsWith('RN')) return 'Scrub N/P';
  if (staffName.startsWith('ODP')) return 'ODP';
  if (staffName.startsWith('HCA')) return 'HCA';
  if (staffName.startsWith('Mr.') || staffName.startsWith('Miss.')) return 'Consultant Surgeon';
  if (staffName.startsWith('FY') || staffName.startsWith('CT') || staffName.startsWith('ST')) return 'Consultant Surgeon';
  if (staffName.startsWith('Dr.')) return 'Consultant Anaesthetist';
  return 'Scrub N/P';
};

/**
 * Seeds staff members from staff-names.json
 */
export async function seedStaff(): Promise<void> {
  console.log('🔄 Seeding staff members...');

  const allStaff = [
    ...staffNamesData.registeredNurses,
    ...staffNamesData.operatingDepartmentPractitioners,
    ...staffNamesData.healthcareAssistants,
    ...staffNamesData.consultantSurgeons,
    ...staffNamesData.assistantSurgeons,
    ...staffNamesData.anaesthetists
  ];

  const batch = writeBatch(db);
  let count = 0;
  const batchSize = 500; // Firestore batch limit

  for (const staffName of allStaff) {
    const staffRef = doc(collection(db, COLLECTIONS.STAFF));

    const staffMember: Omit<StaffMember, 'id'> = {
      name: staffName,
      role: getRole(staffName),
      department: getDepartment(staffName),
      employmentType: 'permanent', // Default to permanent
      competencies: ['Basic Theatre', 'Aseptic Technique'],
      createdAt: randomPastDate(),
      updatedAt: new Date()
    };

    batch.set(staffRef, staffMember);
    count++;

    // Commit batch when reaching limit
    if (count % batchSize === 0) {
      await batch.commit();
      console.log(`  ✅ Committed ${count} staff members`);
      // Create new batch for next set
      const newBatch = writeBatch(db);
      Object.assign(batch, newBatch);
    }
  }

  // Commit remaining (only if there are uncommitted items)
  if (count % batchSize !== 0) {
    await batch.commit();
  }
  console.log(`✅ Seeded ${allStaff.length} staff members`);
}

/**
 * Seeds theatres based on locations
 */
export async function seedTheatres(): Promise<void> {
  console.log('🔄 Seeding theatres...');

  const theatreLocations = locationsData.locations.filter(
    loc => loc.includes('Theatre') && !loc.includes('Recovery')
  );

  const batch = writeBatch(db);

  for (const location of theatreLocations) {
    const theatreRef = doc(collection(db, COLLECTIONS.THEATRES));

    let type: Theatre['type'] = 'general';
    if (location.includes('Main Theatre')) type = 'main';
    if (location.includes('DSU Theatre')) type = 'day_surgery';
    if (location.includes('Paediatric')) type = 'paediatric';

    const theatre: Omit<Theatre, 'id'> = {
      name: location,
      type,
      status: 'active',
      currentProcedure: null,
      scheduledProcedures: [],
      staff: [],
      equipment: [],
      createdAt: randomPastDate(),
      updatedAt: new Date()
    };

    batch.set(theatreRef, theatre);
  }

  await batch.commit();
  console.log(`✅ Seeded ${theatreLocations.length} theatres`);
}

/**
 * NOTE: Instrument tray seeding has been removed.
 *
 * Real instrument data should be imported from Synergy Trak using:
 * - Web UI: http://localhost:3000/admin/import-instruments
 * - API: POST /api/import-instruments
 *
 * This ensures you have real hospital data with:
 * - Physical reference codes (ZE1030, etc.)
 * - Actual instrument checklists
 * - Real locations and quantities
 * - Complete item categorization
 *
 * See: SYNERGY_TRAK_GUIDE.md for extraction instructions
 */

/**
 * Master seed function - runs all seeding operations
 * NOTE: Does NOT seed instruments - use Synergy Trak import instead
 */
export async function seedAllData(): Promise<void> {
  console.log('🚀 Starting TOM Database Seeding...\n');

  try {
    await seedStaff();
    console.log('');

    await seedTheatres();
    console.log('');

    console.log('✅ Core seed data has been successfully loaded into Firestore!');
    console.log('\n📊 Summary:');
    console.log(`   - 925 Staff Members`);
    console.log(`   - ${locationsData.locations.filter(l => l.includes('Theatre')).length} Theatres`);
    console.log('');
    console.log('📋 Next Step: Import Instrument Trays');
    console.log('   Go to: http://localhost:3000/admin/import-instruments');
    console.log('   Import real data from Synergy Trak with full checklists');
    console.log('   See: SYNERGY_TRAK_GUIDE.md for instructions');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

/**
 * Clear all data from collections (use with caution!)
 */
export async function clearAllData(): Promise<void> {
  console.warn('⚠️  This will delete ALL data from Firestore collections!');

  const collections = [
    COLLECTIONS.STAFF,
    COLLECTIONS.THEATRES,
    COLLECTIONS.INVENTORY,
    COLLECTIONS.PROCEDURES,
    COLLECTIONS.STAFF_BREAKS,
    COLLECTIONS.RELIEF_REQUESTS,
    COLLECTIONS.SICK_LEAVE,
    COLLECTIONS.LATE_ARRIVALS,
    COLLECTIONS.VACANT_SHIFTS,
    COLLECTIONS.THEATRE_EFFICIENCY
  ];

  // Note: This is a placeholder - actual implementation would require
  // fetching all docs and deleting them in batches
  console.log('To clear data, use Firebase Console or implement batch deletion');
}
