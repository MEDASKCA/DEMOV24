import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc, getDocs } from 'firebase/firestore';

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

// ==================== HOSPITAL DEPARTMENTS & WARDS ====================

const MAJOR_TRAUMA_CENTERS = [
  {
    id: 'hosp-004', // King's College Hospital
    name: "King's College Hospital NHS Foundation Trust",
    departments: {
      mainTheatres: {
        id: 'dept-kings-main',
        name: 'Main Theatres',
        theatreCount: 12,
        specialties: ['Cardiac', 'Neuro', 'Vascular', 'General', 'Ortho', 'Trauma', 'Hepatobiliary', 'Colorectal', 'Upper GI', 'Urology', 'Gynaecology', 'ENT'],
      },
      daySurgery: {
        id: 'dept-kings-dsu',
        name: 'Day Surgery Unit (DSU)',
        theatreCount: 4,
        specialties: ['General', 'Ortho', 'Urology', 'Gynaecology', 'ENT', 'Plastics'],
      },
      itu: {
        id: 'dept-kings-itu',
        name: 'Intensive Care Unit',
        bedCount: 28,
      },
      hdu: {
        id: 'dept-kings-hdu',
        name: 'High Dependency Unit',
        bedCount: 16,
      },
      wards: [
        { id: 'ward-kings-001', name: 'Cardiac Ward', bedCount: 28, specialty: 'Cardiac' },
        { id: 'ward-kings-002', name: 'Liver Ward', bedCount: 24, specialty: 'Hepatobiliary' },
        { id: 'ward-kings-003', name: 'Orthopaedic Ward A', bedCount: 32, specialty: 'Ortho' },
        { id: 'ward-kings-004', name: 'Orthopaedic Ward B', bedCount: 32, specialty: 'Ortho' },
        { id: 'ward-kings-005', name: 'General Surgery Ward A', bedCount: 28, specialty: 'General' },
        { id: 'ward-kings-006', name: 'General Surgery Ward B', bedCount: 28, specialty: 'General' },
        { id: 'ward-kings-007', name: 'Neurosurgery Ward', bedCount: 24, specialty: 'Neuro' },
        { id: 'ward-kings-008', name: 'Vascular Ward', bedCount: 20, specialty: 'Vascular' },
        { id: 'ward-kings-009', name: 'Urology Ward', bedCount: 24, specialty: 'Urology' },
        { id: 'ward-kings-010', name: 'Gynaecology Ward', bedCount: 20, specialty: 'Gynaecology' },
        { id: 'ward-kings-011', name: 'ENT Ward', bedCount: 18, specialty: 'ENT' },
        { id: 'ward-kings-012', name: 'Trauma Ward', bedCount: 32, specialty: 'Trauma' },
      ],
    },
  },
  {
    id: 'hosp-006', // St Mary's Hospital
    name: "St Mary's Hospital Imperial College Healthcare NHS Trust",
    departments: {
      mainTheatres: {
        id: 'dept-stmary-main',
        name: 'Main Theatres',
        theatreCount: 14,
        specialties: ['Cardiac', 'Neuro', 'Vascular', 'General', 'Ortho', 'Trauma', 'Thoracic', 'Colorectal', 'Upper GI', 'Urology', 'Gynaecology', 'Plastics', 'ENT'],
      },
      daySurgery: {
        id: 'dept-stmary-dsu',
        name: 'Day Surgery Unit (DSU)',
        theatreCount: 5,
        specialties: ['General', 'Ortho', 'Urology', 'Gynaecology', 'ENT', 'Plastics', 'Ophthalmology'],
      },
      itu: {
        id: 'dept-stmary-itu',
        name: 'Intensive Care Unit',
        bedCount: 32,
      },
      hdu: {
        id: 'dept-stmary-hdu',
        name: 'High Dependency Unit',
        bedCount: 20,
      },
      wards: [
        { id: 'ward-stmary-001', name: 'Cardiac Surgery Ward', bedCount: 30, specialty: 'Cardiac' },
        { id: 'ward-stmary-002', name: 'Cardiology Ward', bedCount: 28, specialty: 'Cardiac' },
        { id: 'ward-stmary-003', name: 'Orthopaedic Ward A', bedCount: 32, specialty: 'Ortho' },
        { id: 'ward-stmary-004', name: 'Orthopaedic Ward B', bedCount: 32, specialty: 'Ortho' },
        { id: 'ward-stmary-005', name: 'General Surgery Ward A', bedCount: 28, specialty: 'General' },
        { id: 'ward-stmary-006', name: 'General Surgery Ward B', bedCount: 28, specialty: 'General' },
        { id: 'ward-stmary-007', name: 'Neurosurgery Ward', bedCount: 26, specialty: 'Neuro' },
        { id: 'ward-stmary-008', name: 'Vascular Ward', bedCount: 22, specialty: 'Vascular' },
        { id: 'ward-stmary-009', name: 'Thoracic Ward', bedCount: 24, specialty: 'Thoracic' },
        { id: 'ward-stmary-010', name: 'Trauma Ward A', bedCount: 32, specialty: 'Trauma' },
        { id: 'ward-stmary-011', name: 'Trauma Ward B', bedCount: 32, specialty: 'Trauma' },
        { id: 'ward-stmary-012', name: 'Plastics Ward', bedCount: 20, specialty: 'Plastics' },
      ],
    },
  },
  {
    id: 'hosp-007', // Royal London Hospital
    name: 'Royal London Hospital Barts Health NHS Trust',
    departments: {
      mainTheatres: {
        id: 'dept-royal-main',
        name: 'Main Theatres',
        theatreCount: 16,
        specialties: ['Cardiac', 'Neuro', 'Vascular', 'General', 'Ortho', 'Trauma', 'Spinal', 'Colorectal', 'Upper GI', 'Urology', 'Gynaecology', 'Maxillofacial', 'Plastics', 'ENT'],
      },
      daySurgery: {
        id: 'dept-royal-dsu',
        name: 'Day Surgery Unit (DSU)',
        theatreCount: 6,
        specialties: ['General', 'Ortho', 'Urology', 'Gynaecology', 'ENT', 'Plastics', 'Ophthalmology', 'Dental'],
      },
      itu: {
        id: 'dept-royal-itu',
        name: 'Intensive Care Unit',
        bedCount: 36,
      },
      hdu: {
        id: 'dept-royal-hdu',
        name: 'High Dependency Unit',
        bedCount: 24,
      },
      wards: [
        { id: 'ward-royal-001', name: 'Cardiac Ward', bedCount: 28, specialty: 'Cardiac' },
        { id: 'ward-royal-002', name: 'Orthopaedic Trauma Ward A', bedCount: 32, specialty: 'Trauma' },
        { id: 'ward-royal-003', name: 'Orthopaedic Trauma Ward B', bedCount: 32, specialty: 'Trauma' },
        { id: 'ward-royal-004', name: 'Orthopaedic Elective Ward', bedCount: 28, specialty: 'Ortho' },
        { id: 'ward-royal-005', name: 'General Surgery Ward A', bedCount: 28, specialty: 'General' },
        { id: 'ward-royal-006', name: 'General Surgery Ward B', bedCount: 28, specialty: 'General' },
        { id: 'ward-royal-007', name: 'Neurosurgery Ward', bedCount: 24, specialty: 'Neuro' },
        { id: 'ward-royal-008', name: 'Spinal Ward', bedCount: 26, specialty: 'Spinal' },
        { id: 'ward-royal-009', name: 'Vascular Ward', bedCount: 22, specialty: 'Vascular' },
        { id: 'ward-royal-010', name: 'Maxillofacial Ward', bedCount: 20, specialty: 'Maxillofacial' },
        { id: 'ward-royal-011', name: 'Plastics & Burns Ward', bedCount: 24, specialty: 'Plastics' },
        { id: 'ward-royal-012', name: 'Emergency Surgery Ward', bedCount: 30, specialty: 'General' },
      ],
    },
  },
];

// Helper functions for date generation
function getMonthDates(year: number, month: number) {
  const dates = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(new Date(year, month, day));
  }
  return dates;
}

function getShiftForDate(date: Date): string {
  const day = date.getDay();
  const hour = date.getHours();

  // Weekend shifts
  if (day === 0 || day === 6) {
    if (hour >= 8 && hour < 20) return 'shift-008'; // Weekend Day
    if (hour >= 20 || hour < 8) return 'shift-009'; // Weekend Night
  }

  // Weekday shifts
  if (hour >= 8 && hour < 18) return 'shift-001'; // Standard Day
  if (hour >= 8 && hour < 20) return 'shift-004'; // Extended Day
  if (hour >= 20 || hour < 8) return 'shift-007'; // Night Shift

  return 'shift-001'; // Default
}

// Generate allocations for a department
async function generateDepartmentAllocations(
  hospitalId: string,
  hospitalName: string,
  deptId: string,
  deptName: string,
  specialties: string[],
  startMonth: number,
  endMonth: number,
  year: number,
  staffList: any[]
) {
  const allocations = [];

  // Filter staff by hospital and specialties - use current hospital or specialty match
  const relevantStaff = staffList.filter(staff => {
    const matchesHospital = staff.currentHospitalId === hospitalId;
    const matchesSpecialty = specialties.some(spec => staff.specialties?.includes(spec));
    return matchesHospital || matchesSpecialty;
  });

  console.log(`   Generating allocations for ${deptName} (${relevantStaff.length} relevant staff)`);

  for (let month = startMonth; month <= endMonth; month++) {
    const dates = getMonthDates(year, month);

    // Allocate staff for each day
    for (const date of dates) {
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Determine number of staff needed based on day type
      const staffNeeded = {
        scrubRN: isWeekend ? 4 : 8,
        scrubODP: isWeekend ? 4 : 8,
        anaesRN: isWeekend ? 3 : 6,
        anaesODP: isWeekend ? 3 : 6,
        hca: isWeekend ? 2 : 4,
      };

      // Randomly select staff for each role
      for (const [role, count] of Object.entries(staffNeeded)) {
        const roleStaff = relevantStaff.filter(s => s.role === role.toUpperCase().replace('RN', '_RN').replace('ODP', '_ODP'));
        const selectedStaff = roleStaff.sort(() => 0.5 - Math.random()).slice(0, count);

        for (const staff of selectedStaff) {
          const shiftId = getShiftForDate(date);

          allocations.push({
            id: `alloc-${hospitalId}-${deptId}-${staff.id}-${date.getTime()}`,
            hospitalId,
            hospitalName,
            departmentId: deptId,
            departmentName: deptName,
            staffId: staff.id,
            staffName: staff.name,
            staffRole: staff.role,
            date: date.toISOString().split('T')[0],
            shiftId,
            specialty: specialties[Math.floor(Math.random() * specialties.length)],
            status: 'confirmed',
            createdAt: new Date().toISOString(),
          });
        }
      }
    }
  }

  return allocations;
}

async function seedHospitalStructureAndAllocations() {
  try {
    console.log('🏥 Starting hospital structure and staff allocations seeding...\n');

    // Fetch all staff from Firebase
    console.log('📋 Fetching staff from Firebase...');
    const staffSnapshot = await getDocs(collection(db, 'staffProfiles'));
    const staffList = staffSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`✅ Loaded ${staffList.length} staff members\n`);

    // Seed Hospital Departments
    console.log('🏢 Seeding hospital departments and wards...');
    let batch = writeBatch(db);
    let batchCount = 0;

    for (const hospital of MAJOR_TRAUMA_CENTERS) {
      // Seed Main Theatres
      const mainTheatresDoc = doc(db, 'hospital_departments', hospital.departments.mainTheatres.id);
      batch.set(mainTheatresDoc, {
        ...hospital.departments.mainTheatres,
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        type: 'Main Theatres',
      });
      batchCount++;

      // Seed Day Surgery
      const dsuDoc = doc(db, 'hospital_departments', hospital.departments.daySurgery.id);
      batch.set(dsuDoc, {
        ...hospital.departments.daySurgery,
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        type: 'Day Surgery',
      });
      batchCount++;

      // Seed ITU
      const ituDoc = doc(db, 'hospital_departments', hospital.departments.itu.id);
      batch.set(ituDoc, {
        ...hospital.departments.itu,
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        type: 'ITU',
      });
      batchCount++;

      // Seed HDU
      const hduDoc = doc(db, 'hospital_departments', hospital.departments.hdu.id);
      batch.set(hduDoc, {
        ...hospital.departments.hdu,
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        type: 'HDU',
      });
      batchCount++;

      // Seed Wards
      for (const ward of hospital.departments.wards) {
        const wardDoc = doc(db, 'hospital_wards', ward.id);
        batch.set(wardDoc, {
          ...ward,
          hospitalId: hospital.id,
          hospitalName: hospital.name,
        });
        batchCount++;

        if (batchCount >= 400) {
          await batch.commit();
          batch = writeBatch(db);
          batchCount = 0;
        }
      }
    }

    if (batchCount > 0) {
      await batch.commit();
    }

    console.log('✅ Seeded all hospital departments and wards!\n');

    // Generate Staff Allocations (Aug-Dec 2025)
    console.log('📅 Generating staff allocations for August to December 2025...');

    const allAllocations = [];
    const year = 2025;
    const startMonth = 7; // August (0-indexed)
    const endMonth = 11; // December

    for (const hospital of MAJOR_TRAUMA_CENTERS) {
      console.log(`\n🏥 Processing ${hospital.name}...`);

      // Main Theatres Allocations
      const mainTheatresAllocs = await generateDepartmentAllocations(
        hospital.id,
        hospital.name,
        hospital.departments.mainTheatres.id,
        hospital.departments.mainTheatres.name,
        hospital.departments.mainTheatres.specialties,
        startMonth,
        endMonth,
        year,
        staffList
      );
      allAllocations.push(...mainTheatresAllocs);

      // Day Surgery Allocations
      const dsuAllocs = await generateDepartmentAllocations(
        hospital.id,
        hospital.name,
        hospital.departments.daySurgery.id,
        hospital.departments.daySurgery.name,
        hospital.departments.daySurgery.specialties,
        startMonth,
        endMonth,
        year,
        staffList
      );
      allAllocations.push(...dsuAllocs);
    }

    console.log(`\n✅ Generated ${allAllocations.length} staff allocation records!\n`);

    // Seed allocations in batches
    console.log('💾 Seeding staff allocations to Firebase...');
    const batchSize = 500;
    const totalBatches = Math.ceil(allAllocations.length / batchSize);

    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, allAllocations.length);
      const batchAllocs = allAllocations.slice(start, end);

      batch = writeBatch(db);
      for (const alloc of batchAllocs) {
        const allocDoc = doc(db, 'staff_allocations', alloc.id);
        batch.set(allocDoc, alloc);
      }
      await batch.commit();
      console.log(`   Saved ${end}/${allAllocations.length} allocations`);
    }

    console.log('\n🎉 All hospital structures and staff allocations seeded successfully!');

    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`   - 3 Major Trauma Centers`);
    console.log(`   - 6 Main Theatre Departments`);
    console.log(`   - 3 Day Surgery Units`);
    console.log(`   - 3 ITUs`);
    console.log(`   - 3 HDUs`);
    console.log(`   - 36 Wards`);
    console.log(`   - ${allAllocations.length} Staff Allocations (Aug-Dec 2025)`);

  } catch (error) {
    console.error('❌ Error seeding hospital structure and allocations:', error);
    throw error;
  }
}

seedHospitalStructureAndAllocations()
  .then(() => {
    console.log('\n✨ Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
