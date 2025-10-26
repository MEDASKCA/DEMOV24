// Mock Data for Theatre Operations Manager
// This file contains synchronized data across Dashboard, Schedule, and other views
//
// NOTE: This mock data is for demonstration purposes only.
// In production, this will be replaced by:
// - Firebase Realtime Database / Firestore for live data
// - Backend API with proper authentication
// - Integration with hospital systems (PAS, Theatre Management System)
//
// Mock data generated for October 21 - November 20, 2024

export interface Surgeon {
  name: string;
  title: string;
  specialty: string;
}

export interface StaffMember {
  name: string;
  role: string;
  shift: string;
}

export interface Procedure {
  id: string;
  name: string;
  specialty: string;
  duration: number; // in minutes
  complexity: 'minor' | 'moderate' | 'major' | 'complex';
}

export interface ScheduledCase {
  id: string;
  listOrder: number;
  date: string; // YYYY-MM-DD
  theatre: string;
  scheduledTime: string;
  time: string; // Alias for scheduledTime
  procedure: string;
  procedureName: string; // Alias for procedure
  specialty: string;
  surgeon: string;
  patient: {
    mrn: string;
    age: number;
    notes?: string;
  };
  estimatedDuration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'delayed';
  team: {
    surgeon: StaffMember;
    assistant: StaffMember;
    anaesthetist: StaffMember;
    anaesNP?: StaffMember;
    scrubNurse: StaffMember;
    scrubNP: string; // For compatibility
  };
  assistant: string;
  anaesthetist: string;
  anaesNP: string;
  scrubNP: string;
  hca?: string;
  equipment: string[];
  requirements: string[];
  notes: string[];
  requests: string[];
}

// Staff pool
export const surgeons: Surgeon[] = [
  { name: 'J. Smith', title: 'Mr.', specialty: 'Orthopaedics' },
  { name: 'R. Johnson', title: 'Mr.', specialty: 'Cardiac Surgery' },
  { name: 'A. Robertson', title: 'Ms.', specialty: 'Neurosurgery' },
  { name: 'I. Moore', title: 'Mr.', specialty: 'Emergency' },
  { name: 'P. Wright', title: 'Ms.', specialty: 'Ophthalmology' },
  { name: 'V. Edwards', title: 'Mr.', specialty: 'ENT' },
  { name: 'B. Morgan', title: 'Ms.', specialty: 'Gynaecology' },
  { name: 'O. Brooks', title: 'Mr.', specialty: 'Plastic Surgery' },
  { name: 'V. Ross', title: 'Ms.', specialty: 'Vascular' },
  { name: 'C. Patterson', title: 'Mr.', specialty: 'Thoracic' },
  { name: 'I. Foster', title: 'Ms.', specialty: 'Paediatric' },
  { name: 'P. Hayes', title: 'Dr.', specialty: 'Dental' },
  { name: 'U. Sullivan', title: 'Mr.', specialty: 'Maxillofacial' },
  { name: 'A. Ellis', title: 'Ms.', specialty: 'General Surgery' },
  { name: 'W. Stone', title: 'Mr.', specialty: 'Urology' },
];

export const anaesthetists: StaffMember[] = [
  { name: 'Dr. F. James', role: 'Anaesthetist', shift: '08:00-20:00' },
  { name: 'Dr. B. Thompson', role: 'Anaesthetist', shift: '08:00-19:00' },
  { name: 'Dr. D. Mitchell', role: 'Anaesthetist', shift: '08:00-20:00' },
  { name: 'Dr. K. Baker', role: 'Anaesthetist', shift: '08:00-20:00' },
  { name: 'Dr. R. Phillips', role: 'Anaesthetist', shift: '08:00-18:00' },
  { name: 'Dr. X. Morris', role: 'Anaesthetist', shift: '08:00-18:00' },
  { name: 'Dr. D. Murphy', role: 'Anaesthetist', shift: '08:00-18:00' },
  { name: 'Dr. S. Patel', role: 'Anaesthetist', shift: '08:00-20:00' },
];

export const scrubNurses: StaffMember[] = [
  { name: 'RN A. Flores', role: 'Scrub Nurse', shift: '08:00-20:00' },
  { name: 'ODP D. Jordan', role: 'Scrub Practitioner', shift: '08:00-18:00' },
  { name: 'RN M. Garcia', role: 'Scrub Nurse', shift: '08:00-20:00' },
  { name: 'RN L. Brown', role: 'Scrub Nurse', shift: '08:00-18:00' },
  { name: 'ODP K. White', role: 'Scrub Practitioner', shift: '10:00-20:00' },
  { name: 'RN T. Parker', role: 'Scrub Nurse', shift: '08:00-18:00' },
  { name: 'ODP U. Evans', role: 'Scrub Practitioner', shift: '08:00-18:00' },
  { name: 'RN Z. Reed', role: 'Scrub Nurse', shift: '08:00-20:00' },
];

// Procedures by specialty
export const proceduresBySpecialty: { [key: string]: Procedure[] } = {
  'Orthopaedics': [
    { id: 'orth-1', name: 'Total Hip Replacement', specialty: 'Orthopaedics', duration: 120, complexity: 'major' },
    { id: 'orth-2', name: 'Total Knee Replacement', specialty: 'Orthopaedics', duration: 90, complexity: 'major' },
    { id: 'orth-3', name: 'ACL Reconstruction', specialty: 'Orthopaedics', duration: 90, complexity: 'moderate' },
    { id: 'orth-4', name: 'Shoulder Arthroscopy', specialty: 'Orthopaedics', duration: 60, complexity: 'moderate' },
    { id: 'orth-5', name: 'Hip Arthroscopy', specialty: 'Orthopaedics', duration: 75, complexity: 'moderate' },
    { id: 'orth-6', name: 'Spinal Fusion', specialty: 'Orthopaedics', duration: 180, complexity: 'complex' },
  ],
  'Cardiac Surgery': [
    { id: 'card-1', name: 'CABG x3', specialty: 'Cardiac Surgery', duration: 240, complexity: 'complex' },
    { id: 'card-2', name: 'CABG x4', specialty: 'Cardiac Surgery', duration: 270, complexity: 'complex' },
    { id: 'card-3', name: 'Aortic Valve Replacement', specialty: 'Cardiac Surgery', duration: 210, complexity: 'complex' },
    { id: 'card-4', name: 'Mitral Valve Repair', specialty: 'Cardiac Surgery', duration: 240, complexity: 'complex' },
  ],
  'Neurosurgery': [
    { id: 'neuro-1', name: 'Craniotomy', specialty: 'Neurosurgery', duration: 240, complexity: 'complex' },
    { id: 'neuro-2', name: 'Spinal Decompression', specialty: 'Neurosurgery', duration: 120, complexity: 'major' },
    { id: 'neuro-3', name: 'Brain Tumour Resection', specialty: 'Neurosurgery', duration: 300, complexity: 'complex' },
    { id: 'neuro-4', name: 'Lumbar Discectomy', specialty: 'Neurosurgery', duration: 90, complexity: 'moderate' },
  ],
  'Ophthalmology': [
    { id: 'opht-1', name: 'Cataract Surgery Bilateral', specialty: 'Ophthalmology', duration: 45, complexity: 'minor' },
    { id: 'opht-2', name: 'Retinal Detachment Repair', specialty: 'Ophthalmology', duration: 90, complexity: 'moderate' },
    { id: 'opht-3', name: 'Vitrectomy', specialty: 'Ophthalmology', duration: 60, complexity: 'moderate' },
    { id: 'opht-4', name: 'Glaucoma Surgery', specialty: 'Ophthalmology', duration: 60, complexity: 'moderate' },
  ],
  'ENT': [
    { id: 'ent-1', name: 'Tonsillectomy', specialty: 'ENT', duration: 30, complexity: 'minor' },
    { id: 'ent-2', name: 'Septoplasty', specialty: 'ENT', duration: 60, complexity: 'moderate' },
    { id: 'ent-3', name: 'Thyroidectomy', specialty: 'ENT', duration: 120, complexity: 'major' },
    { id: 'ent-4', name: 'Functional Endoscopic Sinus Surgery', specialty: 'ENT', duration: 90, complexity: 'moderate' },
  ],
  'Gynaecology': [
    { id: 'gyn-1', name: 'Laparoscopic Hysterectomy', specialty: 'Gynaecology', duration: 120, complexity: 'major' },
    { id: 'gyn-2', name: 'Ovarian Cystectomy', specialty: 'Gynaecology', duration: 75, complexity: 'moderate' },
    { id: 'gyn-3', name: 'Myomectomy', specialty: 'Gynaecology', duration: 90, complexity: 'moderate' },
    { id: 'gyn-4', name: 'Hysteroscopy', specialty: 'Gynaecology', duration: 30, complexity: 'minor' },
  ],
  'General Surgery': [
    { id: 'gen-1', name: 'Laparoscopic Cholecystectomy', specialty: 'General Surgery', duration: 60, complexity: 'moderate' },
    { id: 'gen-2', name: 'Appendicectomy', specialty: 'General Surgery', duration: 45, complexity: 'moderate' },
    { id: 'gen-3', name: 'Hernia Repair (Inguinal)', specialty: 'General Surgery', duration: 60, complexity: 'moderate' },
    { id: 'gen-4', name: 'Bowel Resection', specialty: 'General Surgery', duration: 150, complexity: 'major' },
  ],
  'Vascular': [
    { id: 'vasc-1', name: 'AAA Repair', specialty: 'Vascular', duration: 240, complexity: 'complex' },
    { id: 'vasc-2', name: 'Carotid Endarterectomy', specialty: 'Vascular', duration: 120, complexity: 'major' },
    { id: 'vasc-3', name: 'Femoral-Popliteal Bypass', specialty: 'Vascular', duration: 180, complexity: 'major' },
  ],
  'Thoracic': [
    { id: 'thor-1', name: 'VATS Lobectomy', specialty: 'Thoracic', duration: 240, complexity: 'complex' },
    { id: 'thor-2', name: 'Lung Wedge Resection', specialty: 'Thoracic', duration: 120, complexity: 'major' },
  ],
  'Plastic Surgery': [
    { id: 'plas-1', name: 'Free Flap Reconstruction', specialty: 'Plastic Surgery', duration: 360, complexity: 'complex' },
    { id: 'plas-2', name: 'Breast Reconstruction', specialty: 'Plastic Surgery', duration: 240, complexity: 'major' },
    { id: 'plas-3', name: 'Skin Graft', specialty: 'Plastic Surgery', duration: 90, complexity: 'moderate' },
  ],
  'Urology': [
    { id: 'uro-1', name: 'TURP', specialty: 'Urology', duration: 60, complexity: 'moderate' },
    { id: 'uro-2', name: 'Robotic Prostatectomy', specialty: 'Urology', duration: 180, complexity: 'complex' },
    { id: 'uro-3', name: 'Nephrectomy', specialty: 'Urology', duration: 150, complexity: 'major' },
  ],
  'Paediatric': [
    { id: 'paed-1', name: 'Paediatric Hernia Repair', specialty: 'Paediatric', duration: 45, complexity: 'moderate' },
    { id: 'paed-2', name: 'Circumcision', specialty: 'Paediatric', duration: 20, complexity: 'minor' },
    { id: 'paed-3', name: 'Orchidopexy', specialty: 'Paediatric', duration: 60, complexity: 'moderate' },
  ],
  'Dental': [
    { id: 'dent-1', name: 'Dental Extractions (Multiple)', specialty: 'Dental', duration: 45, complexity: 'minor' },
    { id: 'dent-2', name: 'Wisdom Tooth Removal', specialty: 'Dental', duration: 30, complexity: 'minor' },
  ],
  'Maxillofacial': [
    { id: 'max-1', name: 'Wisdom Tooth Extraction', specialty: 'Maxillofacial', duration: 30, complexity: 'minor' },
    { id: 'max-2', name: 'Mandibular Fracture Fixation', specialty: 'Maxillofacial', duration: 120, complexity: 'major' },
  ],
};

// Equipment and requirements by specialty
export const equipmentBySpecialty: { [key: string]: string[] } = {
  'Orthopaedics': ['C-Arm', 'Orthopaedic Set', 'Hip Prosthesis', 'Knee Prosthesis', 'Arthroscopy Set', 'Video Tower', 'Power Tools'],
  'Cardiac Surgery': ['Heart-Lung Machine', 'Cardiac Set', 'Vein Harvesting Kit', 'Valve Sizer Set', 'Aortic Cannulae'],
  'Neurosurgery': ['Microscope', 'Neuro Set', 'Craniotomy Set', 'Spinal Set', 'Neuronavigation'],
  'Ophthalmology': ['Operating Microscope', 'Phaco Machine', 'Vitrectomy Machine', 'Ophthalmic Set'],
  'ENT': ['ENT Set', 'Microscope', 'Endoscopy Tower', 'Microdebrider'],
  'Gynaecology': ['Laparoscopic Tower', 'Energy Device', 'Uterine Manipulator', 'Hysteroscope'],
  'General Surgery': ['Laparoscopic Tower', 'Energy Device', 'Stapling Devices', 'Basic Laparoscopic Set'],
  'Vascular': ['Vascular Set', 'C-Arm', 'Doppler Ultrasound', 'Vascular Prostheses'],
  'Thoracic': ['VATS Set', 'Thoracoscopy Tower', 'Energy Device', 'Staplers'],
  'Plastic Surgery': ['Microsurgical Set', 'Skin Graft Dermatome', 'Doppler Probe'],
  'Urology': ['Cystoscopy Set', 'TURP Set', 'Robotic System', 'Laser'],
  'Paediatric': ['Paediatric Instruments', 'Smaller Retractors', 'Paediatric Anaesthesia'],
  'Dental': ['Dental Extraction Set', 'Oral Surgery Set'],
  'Maxillofacial': ['Maxillofacial Set', 'Rigid Fixation Kit', 'C-Arm'],
};

export const requirementsBySpecialty: { [key: string]: string[] } = {
  'Orthopaedics': ['Cell Salvage', 'Blood on standby (2 units)', 'Tourniquet', 'Image Intensifier'],
  'Cardiac Surgery': ['ICU bed confirmed', 'Blood products on standby (6 units)', 'Cell Salvage', 'Perfusionist on call'],
  'Neurosurgery': ['ICU/HDU bed confirmed', 'Neuro registrar on call', 'Image guidance calibrated'],
  'Ophthalmology': ['Day case', 'Post-op eye drops ready'],
  'ENT': ['Throat pack', 'Post-op observation'],
  'Gynaecology': ['Stoma nurse review', 'HDU bed on standby', 'Catheter'],
  'General Surgery': ['HDU bed on standby', 'Stoma marking if needed'],
  'Vascular': ['ICU/HDU bed confirmed', 'Blood on standby (4 units)', 'Vascular lab standby'],
  'Thoracic': ['ICU bed confirmed', 'Chest drain set ready', 'Blood on standby (4 units)'],
  'Plastic Surgery': ['Extended theatre time', 'Doppler monitoring', 'Specialized positioning'],
  'Urology': ['Catheter ready', 'Imaging reviewed'],
  'Paediatric': ['Paediatric recovery', 'Parent informed', 'Age-appropriate equipment'],
  'Dental': ['Post-op analgesia', 'Soft diet instructions'],
  'Maxillofacial': ['IMF wires/elastic ready', 'Post-op imaging if needed'],
};

// Helper function to generate patient MRN
function generateMRN(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

// Helper function to get random item from array
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper function to get random items from array
function randomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

// Generate month of scheduled cases (October 21 - November 20, 2024)
export function generateMonthSchedule(): ScheduledCase[] {
  const cases: ScheduledCase[] = [];
  const startDate = new Date('2024-10-21');
  const endDate = new Date('2024-11-20');

  const theatres = [
    { name: 'Main Theatre 1', specialty: 'Orthopaedics' },
    { name: 'Main Theatre 3', specialty: 'Cardiac Surgery' },
    { name: 'Main Theatre 4', specialty: 'Neurosurgery' },
    { name: 'Main Theatre 6', specialty: 'Ophthalmology' },
    { name: 'Main Theatre 7', specialty: 'ENT' },
    { name: 'Main Theatre 8', specialty: 'Gynaecology' },
    { name: 'Main Theatre 10', specialty: 'Plastic Surgery' },
    { name: 'Main Theatre 11', specialty: 'Vascular' },
    { name: 'Main Theatre 12', specialty: 'Thoracic' },
    { name: 'DSU Theatre 1', specialty: 'Paediatric' },
    { name: 'DSU Theatre 2', specialty: 'Dental' },
    { name: 'DSU Theatre 3', specialty: 'Maxillofacial' },
    { name: 'DSU Theatre 4', specialty: 'General Surgery' },
    { name: 'DSU Theatre 7', specialty: 'Urology' },
  ];

  let caseId = 1;

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();

    // Skip Sundays
    if (dayOfWeek === 0) continue;

    // Reduced schedule on Saturdays
    const theatresToSchedule = dayOfWeek === 6 ? theatres.slice(0, 5) : theatres;

    theatresToSchedule.forEach(theatre => {
      const procedures = proceduresBySpecialty[theatre.specialty];
      if (!procedures) return;

      // 2-4 cases per theatre per day
      const numCases = dayOfWeek === 6 ? 2 : Math.floor(Math.random() * 3) + 2;

      let currentTime = 480; // Start at 08:00 (in minutes from midnight)

      for (let i = 0; i < numCases; i++) {
        const procedure = randomItem(procedures);
        const surgeon = surgeons.find(s => s.specialty === theatre.specialty) || randomItem(surgeons);
        const assistant = randomItem(['A. Gallagher', 'T. Wilson', 'C. Lewis', 'M. Harper', 'S. Davis']);
        const anaesthetist = randomItem(anaesthetists);
        const scrubNurse = randomItem(scrubNurses);
        const anaesNP = randomItem(['RN K. Roberts', 'ODP L. Martinez', 'RN D. Brown', 'ODP S. Clarke']);
        const scrubNP = randomItem(['RN M. Taylor', 'ODP J. Anderson', 'RN R. White', 'ODP P. Hughes']);
        const hca = randomItem(['HCA J. Williams', 'HCA S. Thompson', 'HCA N. Garcia', 'HCA M. Rodriguez']);

        const hours = Math.floor(currentTime / 60);
        const mins = currentTime % 60;
        const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

        // Get equipment and requirements for this specialty
        const equipmentList = equipmentBySpecialty[theatre.specialty] || [];
        const requirementsList = requirementsBySpecialty[theatre.specialty] || [];

        // Randomly select equipment (2-4 items) and requirements (1-3 items)
        const selectedEquipment = randomItems(equipmentList, Math.floor(Math.random() * 3) + 2);
        const selectedRequirements = randomItems(requirementsList, Math.floor(Math.random() * 3) + 1);

        // Occasionally add notes for complex cases
        const caseNotes: string[] = [];
        if (procedure.complexity === 'complex' && Math.random() > 0.5) {
          caseNotes.push('Patient discussed at MDT meeting');
        }
        if (procedure.duration > 180 && Math.random() > 0.6) {
          caseNotes.push('Extended surgical time anticipated');
        }

        cases.push({
          id: `case-${caseId++}`,
          listOrder: i + 1,
          date: dateStr,
          theatre: theatre.name,
          scheduledTime: timeStr,
          time: timeStr, // Alias for scheduledTime
          procedure: procedure.name,
          procedureName: procedure.name, // Alias for procedure
          specialty: theatre.specialty,
          surgeon: `${surgeon.title} ${surgeon.name}`,
          assistant: assistant,
          anaesthetist: anaesthetist.name,
          anaesNP: anaesNP,
          scrubNP: scrubNP,
          hca: hca,
          patient: {
            mrn: generateMRN(),
            age: Math.floor(Math.random() * 70) + 18,
          },
          estimatedDuration: procedure.duration,
          status: dateStr < '2024-10-21' ? 'completed' : 'scheduled',
          team: {
            surgeon: { name: surgeon.name, role: 'Consultant Surgeon', shift: '08:00-18:00' },
            assistant: { name: assistant, role: 'Assistant Surgeon', shift: '08:00-16:00' },
            anaesthetist: anaesthetist,
            anaesNP: { name: anaesNP, role: 'Anaesthetic Nurse Practitioner', shift: '08:00-16:00' },
            scrubNurse: scrubNurse,
            scrubNP: scrubNP,
          },
          equipment: selectedEquipment,
          requirements: selectedRequirements,
          notes: caseNotes,
          requests: [], // Empty for now, can be populated later
        });

        // Add procedure duration + 30 min turnover
        currentTime += procedure.duration + 30;

        // Don't schedule past 18:00 (1080 minutes)
        if (currentTime > 1080) break;
      }
    });
  }

  return cases;
}

// Export pre-generated schedule
export const monthSchedule = generateMonthSchedule();

// Helper to get cases for a specific date
export function getCasesForDate(date: string): ScheduledCase[] {
  return monthSchedule.filter(c => c.date === date);
}

// Helper to get cases for a specific theatre
export function getCasesForTheatre(theatre: string): ScheduledCase[] {
  return monthSchedule.filter(c => c.theatre === theatre);
}

// Helper to get today's cases (October 21, 2024)
export function getTodaysCases(): ScheduledCase[] {
  return getCasesForDate('2024-10-21');
}
