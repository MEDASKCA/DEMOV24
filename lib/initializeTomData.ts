import { db } from './firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import type {
  Theatre,
  Staff,
  Case,
  ProcedureCard,
  InventoryItem,
  InstrumentTray,
  Shift,
} from '@/types';

// Check if data already exists
export async function checkIfInitialized(): Promise<boolean> {
  const theatresRef = collection(db, 'theatres');
  const snapshot = await getDocs(theatresRef);
  return !snapshot.empty;
}

// Initialize all demo data
export async function initializeTomData() {
  try {
    // Check if already initialized
    const isInitialized = await checkIfInitialized();
    if (isInitialized) {
      console.log('TOM data already initialized');
      return;
    }

    console.log('Initializing TOM demo data...');

    // Initialize in order
    await initializeTheatres();
    await initializeStaff();
    await initializeProcedures();
    await initializeInventory();
    await initializeTrays();
    await initializeCases();
    await initializeShifts();

    console.log('✅ TOM demo data initialized successfully!');
  } catch (error) {
    console.error('Error initializing TOM data:', error);
    throw error;
  }
}

// ============================================
// THEATRES
// ============================================

async function initializeTheatres() {
  const theatres: Omit<Theatre, 'createdAt' | 'updatedAt'>[] = [
    {
      id: 'theatre-1',
      name: 'Theatre 1',
      number: 1,
      specialty: 'Orthopedics',
      status: 'ready',
      location: 'Main Theatre Block',
      capacity: 4,
      equipment: ['laminar-flow', 'c-arm', 'power-tools'],
      features: ['laminar-flow', 'imaging-capable'],
    },
    {
      id: 'theatre-2',
      name: 'Theatre 2',
      number: 2,
      specialty: 'Orthopedics',
      status: 'in-use',
      location: 'Main Theatre Block',
      capacity: 4,
      equipment: ['laminar-flow', 'arthroscopy-tower'],
      features: ['laminar-flow'],
      currentCase: 'case-2',
    },
    {
      id: 'theatre-3',
      name: 'Theatre 3',
      number: 3,
      specialty: 'General Surgery',
      status: 'cleaning',
      location: 'Main Theatre Block',
      capacity: 3,
      equipment: ['laparoscopy-tower', 'diathermy'],
      features: ['standard'],
    },
    {
      id: 'theatre-4',
      name: 'Theatre 4',
      number: 4,
      specialty: 'ENT',
      status: 'ready',
      location: 'Minor Theatre Block',
      capacity: 3,
      equipment: ['microscope', 'endoscopy'],
      features: ['microscope-capable'],
    },
    {
      id: 'theatre-5',
      name: 'Theatre 5',
      number: 5,
      specialty: 'General Surgery',
      status: 'maintenance',
      location: 'Main Theatre Block',
      capacity: 3,
      equipment: ['laparoscopy-tower'],
      features: ['standard'],
    },
    {
      id: 'theatre-6',
      name: 'Theatre 6 (Emergency)',
      number: 6,
      specialty: 'Emergency',
      status: 'ready',
      location: 'Emergency Theatre',
      capacity: 4,
      equipment: ['c-arm', 'rapid-infuser'],
      features: ['emergency-capable', 'trauma-ready'],
    },
  ];

  for (const theatre of theatres) {
    await setDoc(doc(db, 'theatres', theatre.id), {
      ...theatre,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log(`✅ Initialized ${theatres.length} theatres`);
}

// ============================================
// STAFF
// ============================================

async function initializeStaff() {
  const staff: Omit<Staff, 'createdAt' | 'updatedAt'>[] = [
    // Surgeons
    {
      id: 'staff-1',
      firstName: 'Sarah',
      lastName: 'Mitchell',
      email: 'sarah.mitchell@nhs.net',
      role: 'surgeon',
      grade: 'consultant',
      specialties: ['Orthopedics'],
      competencies: [
        { procedureName: 'Total Hip Replacement', level: 'expert', certifiedDate: new Date('2020-01-01') },
        { procedureName: 'Total Knee Replacement', level: 'expert', certifiedDate: new Date('2020-01-01') },
        { procedureName: 'Knee Arthroscopy', level: 'expert', certifiedDate: new Date('2019-01-01') },
      ],
      availability: {},
      employeeNumber: 'NHS001',
      department: 'Orthopedics',
      isActive: true,
    },
    {
      id: 'staff-2',
      firstName: 'James',
      lastName: 'Cooper',
      email: 'james.cooper@nhs.net',
      role: 'surgeon',
      grade: 'registrar',
      specialties: ['Orthopedics'],
      competencies: [
        { procedureName: 'Knee Arthroscopy', level: 'competent', certifiedDate: new Date('2022-06-01') },
        { procedureName: 'Total Hip Replacement', level: 'assisted', certifiedDate: new Date('2023-01-01') },
      ],
      availability: {},
      employeeNumber: 'NHS002',
      department: 'Orthopedics',
      isActive: true,
    },
    {
      id: 'staff-3',
      firstName: 'David',
      lastName: 'Chen',
      email: 'david.chen@nhs.net',
      role: 'surgeon',
      grade: 'consultant',
      specialties: ['General Surgery'],
      competencies: [
        { procedureName: 'Laparoscopic Cholecystectomy', level: 'expert', certifiedDate: new Date('2018-01-01') },
        { procedureName: 'Appendicectomy', level: 'expert', certifiedDate: new Date('2017-01-01') },
      ],
      availability: {},
      employeeNumber: 'NHS003',
      department: 'General Surgery',
      isActive: true,
    },

    // Anesthetists
    {
      id: 'staff-4',
      firstName: 'Emma',
      lastName: 'Thompson',
      email: 'emma.thompson@nhs.net',
      role: 'anesthetist',
      grade: 'consultant',
      specialties: ['Anesthesia', 'Orthopedics'],
      competencies: [
        { procedureName: 'General Anesthesia', level: 'expert', certifiedDate: new Date('2015-01-01') },
        { procedureName: 'Regional Anesthesia', level: 'expert', certifiedDate: new Date('2016-01-01') },
      ],
      availability: {},
      employeeNumber: 'NHS004',
      department: 'Anesthesia',
      isActive: true,
    },
    {
      id: 'staff-5',
      firstName: 'Michael',
      lastName: 'Patel',
      email: 'michael.patel@nhs.net',
      role: 'anesthetist',
      grade: 'registrar',
      specialties: ['Anesthesia'],
      competencies: [
        { procedureName: 'General Anesthesia', level: 'competent', certifiedDate: new Date('2021-01-01') },
      ],
      availability: {},
      employeeNumber: 'NHS005',
      department: 'Anesthesia',
      isActive: true,
    },

    // Scrub Nurses
    {
      id: 'staff-6',
      firstName: 'Rachel',
      lastName: 'Williams',
      email: 'rachel.williams@nhs.net',
      role: 'scrub-nurse',
      grade: 'senior-nurse',
      specialties: ['Orthopedics'],
      competencies: [
        { procedureName: 'Total Hip Replacement', level: 'expert', certifiedDate: new Date('2019-01-01'), equipmentFamiliarity: ['hip-set', 'cement-gun', 'pulse-lavage'] },
        { procedureName: 'Total Knee Replacement', level: 'expert', certifiedDate: new Date('2019-01-01') },
        { procedureName: 'Knee Arthroscopy', level: 'competent', certifiedDate: new Date('2020-01-01') },
      ],
      availability: {},
      employeeNumber: 'NHS006',
      department: 'Theatre',
      isActive: true,
    },
    {
      id: 'staff-7',
      firstName: 'Sophie',
      lastName: 'Davies',
      email: 'sophie.davies@nhs.net',
      role: 'scrub-nurse',
      grade: 'staff-nurse',
      specialties: ['Orthopedics', 'General Surgery'],
      competencies: [
        { procedureName: 'Knee Arthroscopy', level: 'competent', certifiedDate: new Date('2022-01-01') },
        { procedureName: 'Total Hip Replacement', level: 'learning', certifiedDate: new Date('2023-09-01') },
      ],
      availability: {},
      employeeNumber: 'NHS007',
      department: 'Theatre',
      isActive: true,
    },

    // ODPs
    {
      id: 'staff-8',
      firstName: 'Tom',
      lastName: 'Harrison',
      email: 'tom.harrison@nhs.net',
      role: 'odp',
      grade: 'senior-nurse',
      specialties: ['Orthopedics', 'General Surgery'],
      competencies: [
        { procedureName: 'General Theatre Support', level: 'expert', certifiedDate: new Date('2017-01-01') },
      ],
      availability: {},
      employeeNumber: 'NHS008',
      department: 'Theatre',
      isActive: true,
    },
    {
      id: 'staff-9',
      firstName: 'Lisa',
      lastName: 'Brown',
      email: 'lisa.brown@nhs.net',
      role: 'odp',
      grade: 'staff-nurse',
      specialties: ['General Surgery', 'ENT'],
      competencies: [
        { procedureName: 'General Theatre Support', level: 'competent', certifiedDate: new Date('2021-01-01') },
      ],
      availability: {},
      employeeNumber: 'NHS009',
      department: 'Theatre',
      isActive: true,
    },

    // Recovery Nurses
    {
      id: 'staff-10',
      firstName: 'Amanda',
      lastName: 'Taylor',
      email: 'amanda.taylor@nhs.net',
      role: 'recovery-nurse',
      grade: 'senior-nurse',
      specialties: ['Recovery'],
      competencies: [
        { procedureName: 'Post-Anesthesia Care', level: 'expert', certifiedDate: new Date('2016-01-01') },
      ],
      availability: {},
      employeeNumber: 'NHS010',
      department: 'Recovery',
      isActive: true,
    },

    // Coordinator
    {
      id: 'staff-11',
      firstName: 'Helen',
      lastName: 'Roberts',
      email: 'helen.roberts@nhs.net',
      role: 'coordinator',
      grade: 'senior-nurse',
      specialties: ['Theatre Management'],
      competencies: [
        { procedureName: 'Theatre Coordination', level: 'expert', certifiedDate: new Date('2015-01-01') },
      ],
      availability: {},
      employeeNumber: 'NHS011',
      department: 'Theatre',
      isActive: true,
    },
  ];

  for (const person of staff) {
    await setDoc(doc(db, 'staff', person.id), {
      ...person,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log(`✅ Initialized ${staff.length} staff members`);
}

// ============================================
// PROCEDURES
// ============================================

async function initializeProcedures() {
  const procedures: Omit<ProcedureCard, 'createdAt' | 'updatedAt'>[] = [
    {
      id: 'proc-1',
      name: 'Total Hip Replacement',
      specialty: 'Orthopedics',
      code: 'W371',
      description: 'Primary total hip arthroplasty - cemented or uncemented prosthesis',
      expectedDuration: 90,
      requiredStaff: [
        { role: 'surgeon', grade: 'consultant', count: 1 },
        { role: 'anesthetist', grade: 'consultant', count: 1 },
        { role: 'scrub-nurse', count: 1, requiredCompetency: 'Total Hip Replacement - Competent' },
        { role: 'odp', count: 1 },
        { role: 'recovery-nurse', count: 1 },
      ],
      requiredEquipment: [
        { itemName: 'Hip Instrument Set', quantity: 1, isCritical: true },
        { itemName: 'C-Arm Fluoroscopy', quantity: 1, isCritical: true },
        { itemName: 'Laminar Flow System', quantity: 1, isCritical: true },
        { itemName: 'Cement Gun', quantity: 1, isCritical: false },
        { itemName: 'Pulse Lavage', quantity: 1, isCritical: false },
      ],
      requiredConsumables: [
        { itemName: 'Hip Prosthesis (specify size)', quantity: 1, isCritical: true },
        { itemName: 'Bone Cement', quantity: 1, isCritical: false },
        { itemName: 'Swabs - Large', quantity: 20, isCritical: true },
        { itemName: 'Sutures - 1 PDS', quantity: 3, isCritical: true },
        { itemName: 'Drains - Redivac', quantity: 1, isCritical: true },
      ],
      specialRequirements: ['Laminar flow theatre', 'C-arm imaging', 'Blood available (2 units cross-matched)'],
      riskLevel: 'high',
      anesthesiaType: 'general',
      postOpCare: 'HDU monitoring for 24h, physio from day 1, VTE prophylaxis',
      isActive: true,
    },
    {
      id: 'proc-2',
      name: 'Knee Arthroscopy',
      specialty: 'Orthopedics',
      code: 'W824',
      description: 'Arthroscopic knee examination and meniscal repair/trim',
      expectedDuration: 45,
      requiredStaff: [
        { role: 'surgeon', count: 1 },
        { role: 'anesthetist', count: 1 },
        { role: 'scrub-nurse', count: 1 },
        { role: 'odp', count: 1 },
      ],
      requiredEquipment: [
        { itemName: 'Arthroscopy Tower', quantity: 1, isCritical: true },
        { itemName: 'Arthroscope 30°', quantity: 1, isCritical: true },
        { itemName: 'Shaver System', quantity: 1, isCritical: true },
        { itemName: 'Knee Arthroscopy Set', quantity: 1, isCritical: true },
      ],
      requiredConsumables: [
        { itemName: 'Arthroscopy Fluid - Saline 3L', quantity: 3, isCritical: true },
        { itemName: 'Shaver Blades', quantity: 2, isCritical: true },
        { itemName: 'Portal Closure - 3/0 Nylon', quantity: 2, isCritical: true },
      ],
      specialRequirements: [],
      riskLevel: 'low',
      anesthesiaType: 'general',
      postOpCare: 'Day case, crutches as needed, physio referral',
      isActive: true,
    },
    {
      id: 'proc-3',
      name: 'Total Knee Replacement',
      specialty: 'Orthopedics',
      code: 'W401',
      description: 'Primary total knee arthroplasty',
      expectedDuration: 105,
      requiredStaff: [
        { role: 'surgeon', grade: 'consultant', count: 1 },
        { role: 'anesthetist', grade: 'consultant', count: 1 },
        { role: 'scrub-nurse', count: 1 },
        { role: 'odp', count: 1 },
        { role: 'recovery-nurse', count: 1 },
      ],
      requiredEquipment: [
        { itemName: 'Knee Instrument Set', quantity: 1, isCritical: true },
        { itemName: 'Power Tools - Saw & Drill', quantity: 1, isCritical: true },
        { itemName: 'Tourniquet System', quantity: 1, isCritical: true },
      ],
      requiredConsumables: [
        { itemName: 'Knee Prosthesis', quantity: 1, isCritical: true },
        { itemName: 'Bone Cement', quantity: 1, isCritical: true },
        { itemName: 'Swabs - Large', quantity: 20, isCritical: true },
        { itemName: 'Drains - Redivac', quantity: 1, isCritical: true },
      ],
      specialRequirements: ['Blood available (2 units)', 'Tourniquetappropriate'],
      riskLevel: 'high',
      anesthesiaType: 'general',
      postOpCare: 'Ward care, physio from day 1, VTE prophylaxis',
      isActive: true,
    },
  ];

  for (const procedure of procedures) {
    await setDoc(doc(db, 'procedures', procedure.id), {
      ...procedure,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log(`✅ Initialized ${procedures.length} procedure cards`);
}

// ============================================
// INVENTORY
// ============================================

async function initializeInventory() {
  const inventory: Omit<InventoryItem, 'createdAt' | 'updatedAt'>[] = [
    // Hip Sets
    {
      id: 'inv-1',
      name: 'Hip Instrument Set - Primary',
      category: 'instrument',
      subcategory: 'ortho-sets',
      description: 'Complete primary hip replacement instrument set',
      quantity: 3,
      minQuantity: 2,
      unit: 'set',
      location: 'Sterile Stores',
      sublocation: 'Bay 1, Shelf A',
      isCritical: true,
      isTracked: true,
      linkedProcedures: ['proc-1'],
    },

    // Prosthetics
    {
      id: 'inv-2',
      name: 'Hip Prosthesis - Cemented Stem (Size 3)',
      category: 'implant',
      manufacturer: 'Stryker',
      udi: '(01)00643169001763(17)251231(10)LOT12345',
      catalogNumber: 'ACCOLADE-II-3',
      quantity: 2,
      minQuantity: 1,
      unit: 'unit',
      location: 'Implant Store',
      cost: 2500,
      expiryDate: new Date('2025-12-31'),
      isCritical: true,
      isTracked: true,
      linkedProcedures: ['proc-1'],
    },

    // Consumables
    {
      id: 'inv-3',
      name: 'Bone Cement - Palacos',
      category: 'consumable',
      manufacturer: 'Heraeus',
      udi: '(01)00643169002470',
      quantity: 15,
      minQuantity: 10,
      unit: 'pack',
      location: 'Theatre 1 Store',
      cost: 85,
      expiryDate: new Date('2026-06-30'),
      isCritical: true,
      isTracked: false,
      linkedProcedures: ['proc-1', 'proc-3'],
    },
    {
      id: 'inv-4',
      name: 'Swabs - Large Gauze (Pack of 10)',
      category: 'consumable',
      quantity: 200,
      minQuantity: 50,
      unit: 'pack',
      location: 'Main Store',
      cost: 5,
      isCritical: true,
      isTracked: false,
    },
    {
      id: 'inv-5',
      name: 'Sutures - 1 PDS',
      category: 'consumable',
      quantity: 25,
      minQuantity: 20,
      unit: 'pack',
      location: 'Main Store',
      cost: 12,
      expiryDate: new Date('2027-12-31'),
      isCritical: true,
      isTracked: false,
    },

    // Equipment
    {
      id: 'inv-6',
      name: 'C-Arm Fluoroscopy Unit',
      category: 'equipment',
      subcategory: 'imaging',
      quantity: 2,
      minQuantity: 1,
      unit: 'unit',
      location: 'Equipment Bay',
      isCritical: true,
      isTracked: true,
    },
    {
      id: 'inv-7',
      name: 'Arthroscopy Tower - Stryker',
      category: 'equipment',
      subcategory: 'endoscopy',
      manufacturer: 'Stryker',
      quantity: 2,
      minQuantity: 1,
      unit: 'unit',
      location: 'Theatre 2',
      isCritical: true,
      isTracked: true,
      linkedProcedures: ['proc-2'],
    },
    {
      id: 'inv-8',
      name: 'Cement Gun - Standard',
      category: 'instrument',
      quantity: 4,
      minQuantity: 2,
      unit: 'unit',
      location: 'Sterile Stores',
      isCritical: false,
      isTracked: false,
    },
    {
      id: 'inv-9',
      name: 'Pulse Lavage System',
      category: 'equipment',
      quantity: 3,
      minQuantity: 2,
      unit: 'unit',
      location: 'Equipment Bay',
      isCritical: false,
      isTracked: true,
    },

    // Arthroscopy Supplies
    {
      id: 'inv-10',
      name: 'Arthroscope 30° - 4mm',
      category: 'instrument',
      manufacturer: 'Karl Storz',
      quantity: 3,
      minQuantity: 2,
      unit: 'unit',
      location: 'Endoscopy Store',
      isCritical: true,
      isTracked: true,
      linkedProcedures: ['proc-2'],
    },
    {
      id: 'inv-11',
      name: 'Shaver Blades - Aggressive',
      category: 'consumable',
      quantity: 12,
      minQuantity: 8,
      unit: 'unit',
      location: 'Theatre 2 Store',
      cost: 45,
      isCritical: true,
      isTracked: false,
      linkedProcedures: ['proc-2'],
    },
    {
      id: 'inv-12',
      name: 'Saline Irrigation - 3L',
      category: 'consumable',
      quantity: 30,
      minQuantity: 15,
      unit: 'bag',
      location: 'Main Store',
      cost: 8,
      expiryDate: new Date('2026-03-31'),
      isCritical: true,
      isTracked: false,
    },

    // Drains
    {
      id: 'inv-13',
      name: 'Redivac Drain - CH14',
      category: 'consumable',
      quantity: 18,
      minQuantity: 10,
      unit: 'unit',
      location: 'Main Store',
      cost: 15,
      expiryDate: new Date('2027-01-31'),
      isCritical: true,
      isTracked: false,
    },
  ];

  for (const item of inventory) {
    await setDoc(doc(db, 'inventory', item.id), {
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log(`✅ Initialized ${inventory.length} inventory items`);
}

// ============================================
// INSTRUMENT TRAYS
// ============================================

async function initializeTrays() {
  const trays: Omit<InstrumentTray, 'createdAt' | 'updatedAt'>[] = [
    {
      id: 'tray-1',
      name: 'Hip Instrument Set - Primary',
      code: 'HIP-001',
      specialty: 'Orthopedics',
      contents: [
        { itemId: 'hip-retractor', itemName: 'Hip Retractor - Hohmann', quantity: 4, isPresent: true },
        { itemId: 'hip-rasp', itemName: 'Femoral Rasp Set', quantity: 8, isPresent: true },
        { itemId: 'hip-impactor', itemName: 'Femoral Impactor', quantity: 1, isPresent: true },
        { itemId: 'acetabular-reamer', itemName: 'Acetabular Reamer Set', quantity: 10, isPresent: true },
      ],
      location: 'Sterile Stores - Bay 1',
      sterilizationStatus: 'sterile',
      lastSterilized: new Date(),
      nextSterilizationDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      autocycleId: 'AC-2025-001',
      condition: 'excellent',
      maintenanceHistory: [],
      linkedProcedures: ['proc-1'],
    },
    {
      id: 'tray-2',
      name: 'Knee Arthroscopy Set',
      code: 'KNEE-ART-001',
      specialty: 'Orthopedics',
      contents: [
        { itemId: 'scope-30', itemName: 'Arthroscope 30°', quantity: 1, isPresent: true },
        { itemId: 'probe', itemName: 'Arthroscopic Probe', quantity: 1, isPresent: true },
        { itemId: 'grasper', itemName: 'Arthroscopic Grasper', quantity: 2, isPresent: true },
        { itemId: 'scissors', itemName: 'Arthroscopic Scissors', quantity: 1, isPresent: true },
      ],
      location: 'Theatre 2 - Arthroscopy Bay',
      sterilizationStatus: 'dirty',
      condition: 'good',
      maintenanceHistory: [],
      linkedProcedures: ['proc-2'],
    },
  ];

  for (const tray of trays) {
    await setDoc(doc(db, 'trays', tray.id), {
      ...tray,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log(`✅ Initialized ${trays.length} instrument trays`);
}

// ============================================
// CASES (Today's Schedule)
// ============================================

async function initializeCases() {
  const today = new Date().toISOString().split('T')[0];

  const cases: Omit<Case, 'createdAt' | 'updatedAt'>[] = [
    {
      id: 'case-1',
      theatreId: 'theatre-1',
      procedureId: 'proc-1',
      procedureName: 'Total Hip Replacement',
      date: today,
      scheduledStartTime: '08:00',
      scheduledEndTime: '09:30',
      status: 'scheduled',
      surgeonId: 'staff-1',
      anesthetistId: 'staff-4',
      teamIds: ['staff-1', 'staff-4', 'staff-6', 'staff-8', 'staff-10'],
      isEmergency: false,
      notes: 'Patient: 72F, OA right hip, pre-op completed',
    },
    {
      id: 'case-2',
      theatreId: 'theatre-2',
      procedureId: 'proc-2',
      procedureName: 'Knee Arthroscopy',
      date: today,
      scheduledStartTime: '08:00',
      scheduledEndTime: '08:45',
      actualStartTime: '08:05',
      status: 'in-progress',
      surgeonId: 'staff-2',
      anesthetistId: 'staff-5',
      teamIds: ['staff-2', 'staff-5', 'staff-7', 'staff-9'],
      isEmergency: false,
      notes: 'Patient: 45M, meniscal tear, diagnostic + repair',
    },
    {
      id: 'case-3',
      theatreId: 'theatre-1',
      procedureId: 'proc-3',
      procedureName: 'Total Knee Replacement',
      date: today,
      scheduledStartTime: '10:00',
      scheduledEndTime: '11:45',
      status: 'scheduled',
      surgeonId: 'staff-1',
      anesthetistId: 'staff-4',
      teamIds: ['staff-1', 'staff-4', 'staff-6', 'staff-8'],
      isEmergency: false,
      notes: 'Patient: 68M, OA left knee',
    },
    {
      id: 'case-4',
      theatreId: 'theatre-2',
      procedureId: 'proc-2',
      procedureName: 'Knee Arthroscopy',
      date: today,
      scheduledStartTime: '09:30',
      scheduledEndTime: '10:15',
      status: 'scheduled',
      surgeonId: 'staff-2',
      anesthetistId: 'staff-5',
      teamIds: ['staff-2', 'staff-5', 'staff-7', 'staff-9'],
      isEmergency: false,
    },
    {
      id: 'case-5',
      theatreId: 'theatre-4',
      procedureId: 'proc-2',
      procedureName: 'Knee Arthroscopy',
      date: today,
      scheduledStartTime: '14:00',
      scheduledEndTime: '14:45',
      status: 'scheduled',
      surgeonId: 'staff-1',
      anesthetistId: 'staff-4',
      teamIds: ['staff-1', 'staff-4', 'staff-7', 'staff-8'],
      isEmergency: false,
    },
  ];

  for (const caseItem of cases) {
    await setDoc(doc(db, 'cases', caseItem.id), {
      ...caseItem,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log(`✅ Initialized ${cases.length} cases for today`);
}

// ============================================
// SHIFTS (Today's Roster)
// ============================================

async function initializeShifts() {
  const today = new Date().toISOString().split('T')[0];

  const shifts: Omit<Shift, 'createdAt' | 'updatedAt'>[] = [
    // Surgeons
    { id: 'shift-1', staffId: 'staff-1', theatreId: 'theatre-1', date: today, type: 'long-day', startTime: '08:00', endTime: '17:00', role: 'surgeon', status: 'confirmed' },
    { id: 'shift-2', staffId: 'staff-2', theatreId: 'theatre-2', date: today, type: 'long-day', startTime: '08:00', endTime: '17:00', role: 'surgeon', status: 'confirmed' },
    { id: 'shift-3', staffId: 'staff-3', date: today, type: 'on-call', startTime: '08:00', endTime: '20:00', role: 'surgeon', status: 'confirmed' },

    // Anesthetists
    { id: 'shift-4', staffId: 'staff-4', date: today, type: 'long-day', startTime: '07:30', endTime: '16:30', role: 'anesthetist', status: 'confirmed' },
    { id: 'shift-5', staffId: 'staff-5', date: today, type: 'long-day', startTime: '07:30', endTime: '16:30', role: 'anesthetist', status: 'confirmed' },

    // Scrub Nurses
    { id: 'shift-6', staffId: 'staff-6', theatreId: 'theatre-1', date: today, type: 'long-day', startTime: '07:45', endTime: '16:00', role: 'scrub-nurse', status: 'confirmed' },
    { id: 'shift-7', staffId: 'staff-7', theatreId: 'theatre-2', date: today, type: 'long-day', startTime: '07:45', endTime: '16:00', role: 'scrub-nurse', status: 'confirmed' },

    // ODPs
    { id: 'shift-8', staffId: 'staff-8', theatreId: 'theatre-1', date: today, type: 'long-day', startTime: '07:45', endTime: '16:00', role: 'odp', status: 'confirmed' },
    { id: 'shift-9', staffId: 'staff-9', theatreId: 'theatre-2', date: today, type: 'long-day', startTime: '07:45', endTime: '16:00', role: 'odp', status: 'confirmed' },

    // Recovery
    { id: 'shift-10', staffId: 'staff-10', date: today, type: 'long-day', startTime: '07:30', endTime: '16:30', role: 'recovery-nurse', status: 'confirmed' },

    // Coordinator
    { id: 'shift-11', staffId: 'staff-11', date: today, type: 'long-day', startTime: '08:00', endTime: '15:00', role: 'coordinator', status: 'confirmed' },
  ];

  for (const shift of shifts) {
    await setDoc(doc(db, 'shifts', shift.id), {
      ...shift,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log(`✅ Initialized ${shifts.length} shifts for today`);
}
