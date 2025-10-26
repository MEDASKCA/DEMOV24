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

// ==================== DEPARTMENT CONTACTS & NHS EMAILS ====================

const DEPARTMENT_CONTACTS = [
  // King's College Hospital
  {
    id: 'contact-kings-001',
    hospitalId: 'hosp-004',
    hospitalName: "King's College Hospital",
    departmentId: 'dept-kings-main',
    departmentName: 'Main Theatres',
    role: 'Theatre Manager',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@nhs.net',
    phone: '020 3299 4001',
    mobile: '07700 900123',
    responsibilities: ['Overall theatre operations', 'Staff management', 'Budget oversight'],
  },
  {
    id: 'contact-kings-002',
    hospitalId: 'hosp-004',
    hospitalName: "King's College Hospital",
    departmentId: 'dept-kings-main',
    departmentName: 'Main Theatres',
    role: 'Team Leader - Cardiac',
    name: 'James O\'Connor',
    email: 'james.oconnor@nhs.net',
    phone: '020 3299 4002',
    mobile: '07700 900124',
    specialties: ['Cardiac'],
    responsibilities: ['Cardiac theatre operations', 'Staff scheduling', 'Equipment maintenance'],
  },
  {
    id: 'contact-kings-003',
    hospitalId: 'hosp-004',
    hospitalName: "King's College Hospital",
    departmentId: 'dept-kings-main',
    departmentName: 'Main Theatres',
    role: 'Team Leader - Orthopaedics',
    name: 'Priya Sharma',
    email: 'priya.sharma@nhs.net',
    phone: '020 3299 4003',
    mobile: '07700 900125',
    specialties: ['Ortho', 'Trauma'],
    responsibilities: ['Ortho/Trauma theatres', 'Implant management', 'Training'],
  },
  {
    id: 'contact-kings-004',
    hospitalId: 'hosp-004',
    hospitalName: "King's College Hospital",
    departmentId: 'dept-kings-dsu',
    departmentName: 'Day Surgery Unit',
    role: 'DSU Manager',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@nhs.net',
    phone: '020 3299 4010',
    mobile: '07700 900126',
    responsibilities: ['Day case operations', 'Patient flow', 'Discharge coordination'],
  },
  {
    id: 'contact-kings-005',
    hospitalId: 'hosp-004',
    hospitalName: "King's College Hospital",
    departmentId: 'dept-kings-itu',
    departmentName: 'Intensive Care Unit',
    role: 'ITU Matron',
    name: 'Michael Davies',
    email: 'michael.davies@nhs.net',
    phone: '020 3299 4020',
    mobile: '07700 900127',
    responsibilities: ['ITU operations', 'Critical care staff', 'Bed management'],
  },

  // St Mary's Hospital
  {
    id: 'contact-stmary-001',
    hospitalId: 'hosp-006',
    hospitalName: "St Mary's Hospital",
    departmentId: 'dept-stmary-main',
    departmentName: 'Main Theatres',
    role: 'Theatre Manager',
    name: 'David Chen',
    email: 'david.chen@nhs.net',
    phone: '020 3312 6001',
    mobile: '07700 900200',
    responsibilities: ['Theatre operations', 'Quality assurance', 'Staff development'],
  },
  {
    id: 'contact-stmary-002',
    hospitalId: 'hosp-006',
    hospitalName: "St Mary's Hospital",
    departmentId: 'dept-stmary-main',
    departmentName: 'Main Theatres',
    role: 'Team Leader - Neurosurgery',
    name: 'Emma Wilson',
    email: 'emma.wilson@nhs.net',
    phone: '020 3312 6002',
    mobile: '07700 900201',
    specialties: ['Neuro'],
    responsibilities: ['Neuro theatre operations', 'Specialized equipment', 'Research coordination'],
  },
  {
    id: 'contact-stmary-003',
    hospitalId: 'hosp-006',
    hospitalName: "St Mary's Hospital",
    departmentId: 'dept-stmary-main',
    departmentName: 'Main Theatres',
    role: 'Team Leader - Trauma',
    name: 'Rajesh Patel',
    email: 'rajesh.patel@nhs.net',
    phone: '020 3312 6003',
    mobile: '07700 900202',
    specialties: ['Trauma', 'Ortho'],
    responsibilities: ['Major trauma coordination', 'Emergency procedures', '24/7 cover'],
  },
  {
    id: 'contact-stmary-004',
    hospitalId: 'hosp-006',
    hospitalName: "St Mary's Hospital",
    departmentId: 'dept-stmary-dsu',
    departmentName: 'Day Surgery Unit',
    role: 'DSU Manager',
    name: 'Sophie Anderson',
    email: 'sophie.anderson@nhs.net',
    phone: '020 3312 6010',
    mobile: '07700 900203',
    responsibilities: ['Day surgery scheduling', 'Pre-assessment', 'Recovery oversight'],
  },

  // Royal London Hospital
  {
    id: 'contact-royal-001',
    hospitalId: 'hosp-007',
    hospitalName: 'Royal London Hospital',
    departmentId: 'dept-royal-main',
    departmentName: 'Main Theatres',
    role: 'Theatre Manager',
    name: 'Jonathan Harris',
    email: 'jonathan.harris@nhs.net',
    phone: '020 3594 0001',
    mobile: '07700 900300',
    responsibilities: ['Overall theatre management', 'Strategic planning', 'Performance metrics'],
  },
  {
    id: 'contact-royal-002',
    hospitalId: 'hosp-007',
    hospitalName: 'Royal London Hospital',
    departmentId: 'dept-royal-main',
    departmentName: 'Main Theatres',
    role: 'Team Leader - Major Trauma',
    name: 'Aisha Mohammed',
    email: 'aisha.mohammed@nhs.net',
    phone: '020 3594 0002',
    mobile: '07700 900301',
    specialties: ['Trauma', 'Ortho'],
    responsibilities: ['Trauma theatre coordination', 'ATLS protocols', 'Training'],
  },
  {
    id: 'contact-royal-003',
    hospitalId: 'hosp-007',
    hospitalName: 'Royal London Hospital',
    departmentId: 'dept-royal-main',
    departmentName: 'Main Theatres',
    role: 'Team Leader - Spinal',
    name: 'Thomas Wright',
    email: 'thomas.wright@nhs.net',
    phone: '020 3594 0003',
    mobile: '07700 900302',
    specialties: ['Spinal'],
    responsibilities: ['Spinal surgery coordination', 'Specialized positioning', 'Equipment'],
  },
  {
    id: 'contact-royal-004',
    hospitalId: 'hosp-007',
    hospitalName: 'Royal London Hospital',
    departmentId: 'dept-royal-dsu',
    departmentName: 'Day Surgery Unit',
    role: 'DSU Manager',
    name: 'Grace Okafor',
    email: 'grace.okafor@nhs.net',
    phone: '020 3594 0010',
    mobile: '07700 900303',
    responsibilities: ['Day case management', 'Patient experience', 'Efficiency improvements'],
  },
];

// ==================== INVENTORY WITH STOCK LEVELS ====================

function generateInventoryRecords() {
  const records = [];
  const hospitals = ['hosp-004', 'hosp-006', 'hosp-007'];
  const hospitalNames = ["King's College Hospital", "St Mary's Hospital", "Royal London Hospital"];

  // Stock items with realistic levels
  const stockItems = [
    // Sutures
    { itemId: 'sut-001', itemName: 'Vicryl 2-0 70cm UR', category: 'Sutures', minStock: 50, maxStock: 200, reorderPoint: 80, storageId: 'store-013' },
    { itemId: 'sut-002', itemName: 'Vicryl 3-0 75cm CT-1', category: 'Sutures', minStock: 50, maxStock: 200, reorderPoint: 80, storageId: 'store-013' },
    { itemId: 'sut-010', itemName: 'PDS II 1 90cm CT-1', category: 'Sutures', minStock: 30, maxStock: 150, reorderPoint: 60, storageId: 'store-013' },
    { itemId: 'sut-030', itemName: 'Prolene 2-0 75cm SH', category: 'Sutures', minStock: 40, maxStock: 180, reorderPoint: 70, storageId: 'store-013' },

    // Gloves
    { itemId: 'glove-001', itemName: 'Biogel Surgeon Gloves 6.0', category: 'Gloves', minStock: 200, maxStock: 1000, reorderPoint: 300, storageId: 'store-015' },
    { itemId: 'glove-003', itemName: 'Biogel Surgeon Gloves 7.0', category: 'Gloves', minStock: 200, maxStock: 1000, reorderPoint: 300, storageId: 'store-015' },
    { itemId: 'glove-005', itemName: 'Biogel Surgeon Gloves 8.0', category: 'Gloves', minStock: 200, maxStock: 1000, reorderPoint: 300, storageId: 'store-015' },

    // Drapes
    { itemId: 'drape-001', itemName: 'Universal Surgical Drape', category: 'Drapes', minStock: 100, maxStock: 500, reorderPoint: 150, storageId: 'store-016' },
    { itemId: 'drape-002', itemName: 'Laparotomy Drape with Pouch', category: 'Drapes', minStock: 50, maxStock: 300, reorderPoint: 100, storageId: 'store-016' },

    // Ortho Implants
    { itemId: 'ortho-001', itemName: 'Cemented Hip Stem Exeter Size 1', category: 'Implants', minStock: 2, maxStock: 10, reorderPoint: 4, storageId: 'store-004' },
    { itemId: 'ortho-010', itemName: 'Total Knee Femoral Component Medium', category: 'Implants', minStock: 2, maxStock: 10, reorderPoint: 4, storageId: 'store-004' },
  ];

  for (let h = 0; h < hospitals.length; h++) {
    for (const item of stockItems) {
      const currentStock = Math.floor(Math.random() * (item.maxStock - item.minStock) + item.minStock);
      const status = currentStock <= item.reorderPoint ? 'Low Stock' : 'OK';

      records.push({
        id: `inv-${hospitals[h]}-${item.itemId}`,
        hospitalId: hospitals[h],
        hospitalName: hospitalNames[h],
        itemId: item.itemId,
        itemName: item.itemName,
        category: item.category,
        storageLocationId: item.storageId,
        currentStock,
        minStock: item.minStock,
        maxStock: item.maxStock,
        reorderPoint: item.reorderPoint,
        status,
        lastUpdated: new Date().toISOString(),
        lastOrderDate: new Date(2025, 9, Math.floor(Math.random() * 20) + 1).toISOString(),
        supplier: 'Various',
      });
    }
  }

  return records;
}

// ==================== PROCEDURE RECORDS (Historical) ====================

function generateProcedureRecords() {
  const records = [];
  const hospitals = [
    { id: 'hosp-004', name: "King's College Hospital", deptId: 'dept-kings-main' },
    { id: 'hosp-006', name: "St Mary's Hospital", deptId: 'dept-stmary-main' },
    { id: 'hosp-007', name: 'Royal London Hospital', deptId: 'dept-royal-main' },
  ];

  const procedures = [
    { name: 'Total Hip Replacement', specialty: 'Ortho', avgDuration: 120, complexity: 'Major' },
    { name: 'Total Knee Replacement', specialty: 'Ortho', avgDuration: 110, complexity: 'Major' },
    { name: 'Laparoscopic Cholecystectomy', specialty: 'General', avgDuration: 60, complexity: 'Intermediate' },
    { name: 'Appendicectomy', specialty: 'General', avgDuration: 45, complexity: 'Intermediate' },
    { name: 'CABG', specialty: 'Cardiac', avgDuration: 240, complexity: 'Major' },
    { name: 'Craniotomy', specialty: 'Neuro', avgDuration: 180, complexity: 'Major' },
    { name: 'Hernia Repair', specialty: 'General', avgDuration: 40, complexity: 'Minor' },
    { name: 'Carpal Tunnel Release', specialty: 'Ortho', avgDuration: 20, complexity: 'Minor' },
  ];

  const statuses = ['Completed', 'Completed', 'Completed', 'Completed', 'Completed', 'Cancelled', 'Delayed'];
  const cancellationReasons = ['Patient unwell', 'Emergency case priority', 'Equipment failure', 'Staff shortage', 'Bed unavailable'];
  const delayReasons = ['Previous case overran', 'Consent issues', 'Patient late arrival', 'Missing investigations'];

  let recordId = 1;

  // Generate records for past 365 days
  for (let day = 365; day >= 0; day--) {
    const date = new Date();
    date.setDate(date.getDate() - day);

    // Weekend - fewer procedures
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const proceduresPerDay = isWeekend ? 5 : 15;

    for (let i = 0; i < proceduresPerDay; i++) {
      const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];
      const procedure = procedures[Math.floor(Math.random() * procedures.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const scheduledStart = new Date(date);
      scheduledStart.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60));

      const variance = Math.floor(Math.random() * 60) - 20; // -20 to +40 mins
      const actualDuration = status === 'Completed' ? procedure.avgDuration + variance : null;

      const record: any = {
        id: `proc-${String(recordId++).padStart(6, '0')}`,
        date: date.toISOString().split('T')[0],
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        departmentId: hospital.deptId,
        procedureName: procedure.name,
        specialty: procedure.specialty,
        complexity: procedure.complexity,
        scheduledStart: scheduledStart.toISOString(),
        scheduledDuration: procedure.avgDuration,
        actualDuration,
        variance,
        status,
        surgeon: `Mr/Ms ${['Smith', 'Jones', 'Brown', 'Taylor', 'Wilson'][Math.floor(Math.random() * 5)]}`,
        anaesthetist: `Dr ${['Adams', 'Baker', 'Clark', 'Davis', 'Evans'][Math.floor(Math.random() * 5)]}`,
      };

      if (status === 'Cancelled') {
        record.cancellationReason = cancellationReasons[Math.floor(Math.random() * cancellationReasons.length)];
        record.cancellationTime = new Date(scheduledStart.getTime() - Math.random() * 7200000).toISOString();
      }

      if (status === 'Delayed') {
        record.delayReason = delayReasons[Math.floor(Math.random() * delayReasons.length)];
        record.delayMinutes = Math.floor(Math.random() * 90) + 15;
      }

      records.push(record);
    }
  }

  return records;
}

// ==================== NOTES & COMMENTS SYSTEM ====================

function generateNotesAndComments() {
  const notes = [];
  const noteTypes = ['Incident', 'Equipment Issue', 'Staff Feedback', 'Patient Safety', 'Operational', 'Training'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const sampleNotes = [
    { type: 'Equipment Issue', title: 'C-Arm in Theatre 5 requires calibration', content: 'Image quality degraded. Biomedical engineering notified. Alternative C-Arm from Theatre 3 can be used if needed.', priority: 'High' },
    { type: 'Incident', title: 'Swab count discrepancy - resolved', content: 'Initial count discrepancy resolved. All swabs accounted for after extended search. X-ray confirmed no RSI. Learning: double-check count board before closing.', priority: 'Urgent' },
    { type: 'Staff Feedback', title: 'New laparoscopic instruments well received', content: 'Team feedback on new Karl Storz instruments very positive. Improved ergonomics noted by all scrub practitioners.', priority: 'Low' },
    { type: 'Operational', title: 'Stock audit completed - Ortho implants', content: 'Annual stock audit complete. All implants accounted for. 3x hip stems approaching expiry - flagged for priority use.', priority: 'Medium' },
    { type: 'Patient Safety', title: 'WHO checklist compliance 100% this week', content: 'Excellent compliance with surgical safety checklist. All team members engaged. Continue good practice.', priority: 'Low' },
    { type: 'Training', title: 'Robotic surgery training session scheduled', content: 'Da Vinci Xi training for 12 staff members scheduled for next week. Stryker rep confirmed attendance.', priority: 'Medium' },
  ];

  for (let i = 0; i < 50; i++) {
    const note = sampleNotes[i % sampleNotes.length];
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    notes.push({
      id: `note-${String(i + 1).padStart(4, '0')}`,
      type: note.type,
      title: note.title,
      content: note.content,
      priority: note.priority,
      author: `${['Sarah Mitchell', 'James O\'Connor', 'David Chen', 'Emma Wilson', 'Jonathan Harris'][Math.floor(Math.random() * 5)]}`,
      authorEmail: `${['sarah.mitchell', 'james.oconnor', 'david.chen', 'emma.wilson', 'jonathan.harris'][Math.floor(Math.random() * 5)]}@nhs.net`,
      hospitalId: ['hosp-004', 'hosp-006', 'hosp-007'][Math.floor(Math.random() * 3)],
      departmentId: ['dept-kings-main', 'dept-stmary-main', 'dept-royal-main'][Math.floor(Math.random() * 3)],
      createdAt: date.toISOString(),
      status: Math.random() > 0.3 ? 'Open' : 'Resolved',
      resolvedAt: Math.random() > 0.3 ? null : new Date(date.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return notes;
}

// ==================== ANALYTICS SUMMARY ====================

function generateAnalyticsSummaries() {
  const summaries = [];
  const hospitals = ['hosp-004', 'hosp-006', 'hosp-007'];
  const hospitalNames = ["King's College Hospital", "St Mary's Hospital", "Royal London Hospital"];

  for (let h = 0; h < hospitals.length; h++) {
    // Weekly summary
    summaries.push({
      id: `analytics-${hospitals[h]}-weekly`,
      hospitalId: hospitals[h],
      hospitalName: hospitalNames[h],
      period: 'This Week',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      totalProcedures: Math.floor(Math.random() * 50) + 80,
      completedProcedures: Math.floor(Math.random() * 40) + 75,
      cancelledProcedures: Math.floor(Math.random() * 5) + 2,
      delayedProcedures: Math.floor(Math.random() * 8) + 3,
      avgUtilization: Math.floor(Math.random() * 15) + 75, // 75-90%
      avgTurnoverTime: Math.floor(Math.random() * 15) + 25, // 25-40 mins
      onTimeStarts: Math.floor(Math.random() * 10) + 80, // 80-90%
    });

    // Monthly summary
    summaries.push({
      id: `analytics-${hospitals[h]}-monthly`,
      hospitalId: hospitals[h],
      hospitalName: hospitalNames[h],
      period: 'This Month',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      totalProcedures: Math.floor(Math.random() * 200) + 350,
      completedProcedures: Math.floor(Math.random() * 180) + 320,
      cancelledProcedures: Math.floor(Math.random() * 15) + 10,
      delayedProcedures: Math.floor(Math.random() * 25) + 15,
      avgUtilization: Math.floor(Math.random() * 10) + 77,
      avgTurnoverTime: Math.floor(Math.random() * 10) + 28,
      onTimeStarts: Math.floor(Math.random() * 8) + 82,
    });

    // Yearly summary
    summaries.push({
      id: `analytics-${hospitals[h]}-yearly`,
      hospitalId: hospitals[h],
      hospitalName: hospitalNames[h],
      period: 'This Year',
      startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      totalProcedures: Math.floor(Math.random() * 1000) + 4000,
      completedProcedures: Math.floor(Math.random() * 900) + 3700,
      cancelledProcedures: Math.floor(Math.random() * 80) + 120,
      delayedProcedures: Math.floor(Math.random() * 120) + 180,
      avgUtilization: Math.floor(Math.random() * 8) + 78,
      avgTurnoverTime: Math.floor(Math.random() * 8) + 30,
      onTimeStarts: Math.floor(Math.random() * 5) + 83,
    });
  }

  return summaries;
}

console.log('📊 Generating operational records and analytics...\n');

async function seedOperationalData() {
  try {
    console.log('🚀 Starting operational data seeding...\n');

    // 1. Seed Department Contacts
    console.log('👥 Seeding department contacts with NHS emails...');
    let batch = writeBatch(db);
    for (const contact of DEPARTMENT_CONTACTS) {
      const docRef = doc(db, 'department_contacts', contact.id);
      batch.set(docRef, contact);
    }
    await batch.commit();
    console.log(`✅ Saved ${DEPARTMENT_CONTACTS.length} department contacts!\n`);

    // 2. Seed Inventory Records
    console.log('📦 Generating inventory records with stock levels...');
    const inventoryRecords = generateInventoryRecords();
    batch = writeBatch(db);
    for (const record of inventoryRecords) {
      const docRef = doc(db, 'inventory_records', record.id);
      batch.set(docRef, record);
    }
    await batch.commit();
    console.log(`✅ Saved ${inventoryRecords.length} inventory records!\n`);

    // 3. Seed Procedure Records (Historical - past year)
    console.log('🏥 Generating procedure records for past year...');
    const procedureRecords = generateProcedureRecords();
    console.log(`   Generated ${procedureRecords.length} procedure records`);

    const batchSize = 500;
    const totalBatches = Math.ceil(procedureRecords.length / batchSize);

    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, procedureRecords.length);
      const batchRecords = procedureRecords.slice(start, end);

      batch = writeBatch(db);
      for (const record of batchRecords) {
        const docRef = doc(db, 'procedure_records', record.id);
        batch.set(docRef, record);
      }
      await batch.commit();
      console.log(`   Saved ${end}/${procedureRecords.length} procedure records`);
    }
    console.log('✅ All procedure records saved!\n');

    // 4. Seed Notes & Comments
    console.log('📝 Generating notes and comments...');
    const notes = generateNotesAndComments();
    batch = writeBatch(db);
    for (const note of notes) {
      const docRef = doc(db, 'notes_comments', note.id);
      batch.set(docRef, note);
    }
    await batch.commit();
    console.log(`✅ Saved ${notes.length} notes and comments!\n`);

    // 5. Seed Analytics Summaries
    console.log('📈 Generating analytics summaries...');
    const analytics = generateAnalyticsSummaries();
    batch = writeBatch(db);
    for (const summary of analytics) {
      const docRef = doc(db, 'analytics_summaries', summary.id);
      batch.set(docRef, summary);
    }
    await batch.commit();
    console.log(`✅ Saved ${analytics.length} analytics summaries!\n`);

    console.log('🎉 All operational data seeded successfully!');

    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`   - ${DEPARTMENT_CONTACTS.length} Department Contacts with NHS emails`);
    console.log(`   - ${inventoryRecords.length} Inventory Records with stock levels`);
    console.log(`   - ${procedureRecords.length} Procedure Records (past year)`);
    console.log(`   - ${notes.length} Notes & Comments`);
    console.log(`   - ${analytics.length} Analytics Summaries`);
    console.log('\n💡 TOM AI can now answer:');
    console.log('   - "Do we have this item?" (with stock levels & reorder suggestions)');
    console.log('   - "Who is the manager of Main Theatres at King\'s?"');
    console.log('   - "What was our utilization last month?"');
    console.log('   - "How many procedures were cancelled this week?"');
    console.log('   - "Show me recent incidents"');
    console.log('   - And much more!');

  } catch (error) {
    console.error('❌ Error seeding operational data:', error);
    throw error;
  }
}

seedOperationalData()
  .then(() => {
    console.log('\n✨ Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
