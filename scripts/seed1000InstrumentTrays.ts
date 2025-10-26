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

// Helper function to generate sterilization dates
function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// ==================== INSTRUMENT TRAY TEMPLATES ====================

const ORTHO_INSTRUMENTS = {
  basic: [
    { name: 'Scalpel Handle No.3', productCode: 'SCAL-H3', manufacturer: 'Swann-Morton', qty: 2 },
    { name: 'Scalpel Handle No.4', productCode: 'SCAL-H4', manufacturer: 'Swann-Morton', qty: 2 },
    { name: 'Mayo Scissors Straight 17cm', productCode: 'SCIS-MAYO-S17', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Mayo Scissors Curved 17cm', productCode: 'SCIS-MAYO-C17', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Metzenbaum Scissors 18cm', productCode: 'SCIS-METZ-18', manufacturer: 'Aesculap', qty: 2 },
    { name: 'McIndoe Scissors 15cm', productCode: 'SCIS-MCIN-15', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Gillies Toothed Forceps 15cm', productCode: 'FORC-GILL-15', manufacturer: 'Aesculap', qty: 4 },
    { name: 'Adson Toothed Forceps 12cm', productCode: 'FORC-ADSO-12', manufacturer: 'Aesculap', qty: 4 },
    { name: 'DeBakey Forceps 20cm', productCode: 'FORC-DEBA-20', manufacturer: 'Aesculap', qty: 4 },
    { name: 'Spencer Wells Artery Forceps 12.5cm', productCode: 'FORC-SPEN-12', manufacturer: 'Aesculap', qty: 10 },
    { name: 'Mosquito Forceps Curved 12.5cm', productCode: 'FORC-MOSQ-C12', manufacturer: 'Aesculap', qty: 10 },
    { name: 'Mayo-Hegar Needle Holder 18cm', productCode: 'NEED-MAYO-18', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Langenbeck Retractor Small', productCode: 'RETR-LANG-SM', manufacturer: 'Aesculap', qty: 4 },
    { name: 'Hohmann Retractor 22cm', productCode: 'RETR-HOHM-22', manufacturer: 'Aesculap', qty: 4 },
    { name: 'Volkmann Rake Retractor 4-Prong', productCode: 'RETR-VOLK-4', manufacturer: 'Aesculap', qty: 2 },
  ],
  hip: [
    { name: 'Charnley Retractor Set', productCode: 'RETR-CHAR-SET', manufacturer: 'DePuy', qty: 1 },
    { name: 'Hohmann Retractors (Set of 6)', productCode: 'RETR-HOHM-SET', manufacturer: 'DePuy', qty: 1 },
    { name: 'Corkscrew Acetabular Reamer', productCode: 'REAM-CORK', manufacturer: 'Stryker', qty: 1 },
    { name: 'Acetabular Cup Introducer', productCode: 'INTR-ACET', manufacturer: 'Stryker', qty: 1 },
    { name: 'Femoral Broach Handle', productCode: 'BROA-HAND', manufacturer: 'Stryker', qty: 1 },
    { name: 'Box Osteotome 15mm', productCode: 'OSTE-BOX-15', manufacturer: 'Stryker', qty: 1 },
    { name: 'Curved Osteotome 20mm', productCode: 'OSTE-CURV-20', manufacturer: 'Stryker', qty: 1 },
    { name: 'Bone Nibblers', productCode: 'NIBB-BONE', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Bone Lever', productCode: 'LEVE-BONE', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Steinmann Pin 3.2mm', productCode: 'PIN-STEIN-32', manufacturer: 'Stryker', qty: 4 },
    { name: 'Impaction Grafting Tamps', productCode: 'TAMP-GRAF', manufacturer: 'Stryker', qty: 1 },
    { name: 'Trial Reducer Set', productCode: 'TRIAL-RED-SET', manufacturer: 'Stryker', qty: 1 },
    { name: 'Bone Mallet', productCode: 'MALL-BONE', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Pulse Lavage System', productCode: 'LAVA-PULSE', manufacturer: 'Stryker', qty: 1 },
  ],
  knee: [
    { name: 'Knee Retractor Set', productCode: 'RETR-KNEE-SET', manufacturer: 'Zimmer', qty: 1 },
    { name: 'Femoral Cutting Block', productCode: 'CUTT-FEM', manufacturer: 'Zimmer', qty: 1 },
    { name: 'Tibial Cutting Guide', productCode: 'CUTT-TIB', manufacturer: 'Zimmer', qty: 1 },
    { name: 'Oscillating Saw', productCode: 'SAW-OSCI', manufacturer: 'Stryker', qty: 1 },
    { name: 'Sagittal Saw', productCode: 'SAW-SAGI', manufacturer: 'Stryker', qty: 1 },
    { name: 'Femoral Trial Components', productCode: 'TRIAL-FEM-SET', manufacturer: 'Zimmer', qty: 1 },
    { name: 'Tibial Trial Components', productCode: 'TRIAL-TIB-SET', manufacturer: 'Zimmer', qty: 1 },
    { name: 'Patella Clamps', productCode: 'CLAM-PATE', manufacturer: 'Zimmer', qty: 2 },
    { name: 'Knee Hooks', productCode: 'HOOK-KNEE', manufacturer: 'Aesculap', qty: 4 },
    { name: 'PCL Retractor', productCode: 'RETR-PCL', manufacturer: 'Zimmer', qty: 1 },
    { name: 'Bone Cutters', productCode: 'CUTT-BONE', manufacturer: 'Aesculap', qty: 2 },
  ],
  spine: [
    { name: 'Weitlaner Self-Retaining Retractor', productCode: 'RETR-WEIT', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Cobb Elevator', productCode: 'ELEV-COBB', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Periosteal Elevator', productCode: 'ELEV-PERI', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Pituitary Rongeurs', productCode: 'RONG-PITU', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Kerrison Rongeurs 3mm', productCode: 'RONG-KERR-3', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Kerrison Rongeurs 5mm', productCode: 'RONG-KERR-5', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Nerve Root Retractors', productCode: 'RETR-NERV', manufacturer: 'Aesculap', qty: 4 },
    { name: 'Disc Forceps', productCode: 'FORC-DISC', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Curette Set (Straight & Angled)', productCode: 'CURE-SET', manufacturer: 'Aesculap', qty: 1 },
    { name: 'Impactor Set', productCode: 'IMPA-SET', manufacturer: 'DePuy', qty: 1 },
    { name: 'Pedicle Probe', productCode: 'PROB-PEDI', manufacturer: 'DePuy', qty: 2 },
    { name: 'Screw Holding Forceps', productCode: 'FORC-SCRE', manufacturer: 'DePuy', qty: 2 },
  ],
  trauma: [
    { name: 'Bone Reduction Forceps Large', productCode: 'FORC-REDU-L', manufacturer: 'Stryker', qty: 2 },
    { name: 'Pointed Reduction Forceps', productCode: 'FORC-REDU-P', manufacturer: 'Stryker', qty: 2 },
    { name: 'Bone Holding Forceps', productCode: 'FORC-HOLD', manufacturer: 'Stryker', qty: 4 },
    { name: 'Drill Guide 3.5mm', productCode: 'GUID-DRIL-35', manufacturer: 'DePuy', qty: 2 },
    { name: 'Depth Gauge', productCode: 'GAUG-DEPT', manufacturer: 'DePuy', qty: 1 },
    { name: 'Tap Handle', productCode: 'HAND-TAP', manufacturer: 'DePuy', qty: 1 },
    { name: 'Screwdriver Cruciate', productCode: 'SCRE-CRUC', manufacturer: 'DePuy', qty: 2 },
    { name: 'Hex Screwdriver', productCode: 'SCRE-HEX', manufacturer: 'DePuy', qty: 2 },
    { name: 'Plate Bending Iron', productCode: 'BEND-PLAT', manufacturer: 'DePuy', qty: 2 },
    { name: 'Wire Tightener', productCode: 'TIGH-WIRE', manufacturer: 'Stryker', qty: 2 },
    { name: 'K-Wire Driver', productCode: 'DRIV-KWIR', manufacturer: 'Stryker', qty: 1 },
  ],
};

const GENERAL_INSTRUMENTS = {
  basic: [
    { name: 'Scalpel Handle No.3', productCode: 'SCAL-H3', manufacturer: 'Swann-Morton', qty: 2 },
    { name: 'Scalpel Handle No.4', productCode: 'SCAL-H4', manufacturer: 'Swann-Morton', qty: 2 },
    { name: 'Mayo Scissors Straight 17cm', productCode: 'SCIS-MAYO-S17', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Mayo Scissors Curved 17cm', productCode: 'SCIS-MAYO-C17', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Metzenbaum Scissors 23cm', productCode: 'SCIS-METZ-23', manufacturer: 'Aesculap', qty: 2 },
    { name: 'McIndoe Scissors 23cm', productCode: 'SCIS-MCIN-23', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Gillies Toothed Forceps 15cm', productCode: 'FORC-GILL-15', manufacturer: 'Aesculap', qty: 4 },
    { name: 'Non-Toothed Forceps 15cm', productCode: 'FORC-NONT-15', manufacturer: 'Aesculap', qty: 4 },
    { name: 'Spencer Wells Artery Forceps 12.5cm', productCode: 'FORC-SPEN-12', manufacturer: 'Aesculap', qty: 10 },
    { name: 'Mosquito Forceps Curved 12.5cm', productCode: 'FORC-MOSQ-C12', manufacturer: 'Aesculap', qty: 10 },
    { name: 'Kocher Forceps 14cm', productCode: 'FORC-KOCH-14', manufacturer: 'Aesculap', qty: 4 },
    { name: 'Allis Tissue Forceps 15cm', productCode: 'FORC-ALLI-15', manufacturer: 'Aesculap', qty: 6 },
    { name: 'Babcock Forceps 16cm', productCode: 'FORC-BABC-16', manufacturer: 'Aesculap', qty: 4 },
    { name: 'Lanes Tissue Forceps', productCode: 'FORC-LANE', manufacturer: 'Aesculap', qty: 4 },
    { name: 'Mayo-Hegar Needle Holder 18cm', productCode: 'NEED-MAYO-18', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Mayo-Hegar Needle Holder 23cm', productCode: 'NEED-MAYO-23', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Langenbeck Retractor Large', productCode: 'RETR-LANG-LG', manufacturer: 'Aesculap', qty: 4 },
    { name: 'Morris Retractor', productCode: 'RETR-MORR', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Deaver Retractor Large', productCode: 'RETR-DEAV-L', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Doyen Bowel Clamps', productCode: 'CLAM-DOYE', manufacturer: 'Aesculap', qty: 4 },
  ],
  laparotomy: [
    { name: 'Balfour Retractor with Blades', productCode: 'RETR-BALF', manufacturer: 'Aesculap', qty: 1 },
    { name: 'Omnitract Retractor System', productCode: 'RETR-OMNI', manufacturer: 'Aesculap', qty: 1 },
    { name: 'Large Swab Holding Forceps', productCode: 'FORC-SWAB-L', manufacturer: 'Aesculap', qty: 4 },
    { name: 'Poole Suction', productCode: 'SUCT-POOL', manufacturer: 'Aesculap', qty: 1 },
    { name: 'Roberts Artery Forceps', productCode: 'FORC-ROBE', manufacturer: 'Aesculap', qty: 10 },
    { name: 'Intestinal Clamps Non-Crushing', productCode: 'CLAM-INTE', manufacturer: 'Aesculap', qty: 6 },
  ],
  laparoscopic: [
    { name: 'Veress Needle', productCode: 'NEED-VERE', manufacturer: 'Karl Storz', qty: 1 },
    { name: '10mm Trocar & Cannula', productCode: 'TROC-10MM', manufacturer: 'Ethicon', qty: 2 },
    { name: '5mm Trocar & Cannula', productCode: 'TROC-5MM', manufacturer: 'Ethicon', qty: 3 },
    { name: 'Maryland Dissector 5mm', productCode: 'DISS-MARY-5', manufacturer: 'Karl Storz', qty: 2 },
    { name: 'Grasper Atraumatic 5mm', productCode: 'GRAS-ATRA-5', manufacturer: 'Karl Storz', qty: 2 },
    { name: 'Scissors Curved 5mm', productCode: 'SCIS-CURV-5', manufacturer: 'Karl Storz', qty: 2 },
    { name: 'Clip Applier 10mm', productCode: 'APPL-CLIP-10', manufacturer: 'Ethicon', qty: 1 },
    { name: 'Suction Irrigation 5mm', productCode: 'SUCT-IRRI-5', manufacturer: 'Karl Storz', qty: 1 },
    { name: 'Needle Holder 5mm', productCode: 'NEED-HOLD-5', manufacturer: 'Karl Storz', qty: 1 },
  ],
};

const CARDIAC_INSTRUMENTS = {
  basic: [
    { name: 'DeBakey Vascular Forceps 20cm', productCode: 'FORC-DEBA-20', manufacturer: 'Aesculap', qty: 6 },
    { name: 'DeBakey Vascular Forceps 30cm', productCode: 'FORC-DEBA-30', manufacturer: 'Aesculap', qty: 6 },
    { name: 'Potts Scissors 45°', productCode: 'SCIS-POTT-45', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Metzenbaum Scissors Long', productCode: 'SCIS-METZ-L', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Satinsky Clamps', productCode: 'CLAM-SATI', manufacturer: 'Aesculap', qty: 4 },
    { name: 'Aortic Cross Clamp', productCode: 'CLAM-AORT', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Bulldog Clamps Small', productCode: 'CLAM-BULL-S', manufacturer: 'Aesculap', qty: 10 },
    { name: 'Cardiovascular Needle Holder', productCode: 'NEED-CARD', manufacturer: 'Aesculap', qty: 3 },
    { name: 'Chest Retractor (Finochietto)', productCode: 'RETR-FINO', manufacturer: 'Aesculap', qty: 1 },
    { name: 'Sternal Saw', productCode: 'SAW-STER', manufacturer: 'Stryker', qty: 1 },
    { name: 'Sternal Wire Twister', productCode: 'TWIST-STER', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Internal Mammary Artery Retractor', productCode: 'RETR-IMA', manufacturer: 'Aesculap', qty: 1 },
  ],
};

const NEURO_INSTRUMENTS = {
  basic: [
    { name: 'Hudson Brace & Perforator', productCode: 'BRAC-HUDS', manufacturer: 'Aesculap', qty: 1 },
    { name: 'Cranial Drill', productCode: 'DRIL-CRAN', manufacturer: 'Stryker', qty: 1 },
    { name: 'Craniotome (Gigli Saw)', productCode: 'SAW-GIGL', manufacturer: 'Aesculap', qty: 1 },
    { name: 'Raney Scalp Clips & Applier', productCode: 'CLIP-RANE', manufacturer: 'Aesculap', qty: 1 },
    { name: 'Adson Brain Spatula', productCode: 'SPAT-ADSO', manufacturer: 'Aesculap', qty: 4 },
    { name: 'Yasargil Clip Appliers', productCode: 'APPL-YASA', manufacturer: 'Aesculap', qty: 3 },
    { name: 'Micro-scissors Curved', productCode: 'SCIS-MICR-C', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Micro Bipolar Forceps', productCode: 'FORC-BIPO', manufacturer: 'Aesculap', qty: 2 },
    { name: 'Suction Tubes (Frazier)', productCode: 'SUCT-FRAZ', manufacturer: 'Aesculap', qty: 4 },
    { name: 'Weitlaner Self-Retaining Retractor', productCode: 'RETR-WEIT-N', manufacturer: 'Aesculap', qty: 2 },
  ],
};

function generateInstrumentTrays() {
  const trays = [];
  let trayId = 1;

  // Helper to format tray ID
  const formatId = (num: number) => `tray-${String(num).padStart(4, '0')}`;

  // Storage locations mapping
  const storageMap: any = {
    'Orthopaedic': 'store-020',
    'Spinal': 'store-021',
    'Neuro': 'store-022',
    'Cardiac': 'store-023',
    'General': 'store-018',
    'Laparoscopic': 'store-024',
    'Vascular': 'store-018',
    'Urology': 'store-018',
    'Gynaecology': 'store-018',
    'ENT': 'store-018',
    'Plastic': 'store-025',
    'Ophthalmic': 'store-018',
    'Maxillofacial': 'store-018',
    'Paediatric': 'store-018',
  };

  // ORTHOPAEDIC TRAYS (200)
  // Hip Trays (40)
  for (let i = 1; i <= 40; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `Hip Primary Tray ${i}`,
      specialty: 'Orthopaedic',
      procedureType: 'Total Hip Replacement',
      instruments: [...ORTHO_INSTRUMENTS.basic, ...ORTHO_INSTRUMENTS.hip],
      storageLocationId: storageMap['Orthopaedic'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-HIP-PRI-${i}`,
      weight: '8.5kg',
      dimensions: '60x40x15cm',
    });
  }

  // Hip Revision Trays (30)
  for (let i = 1; i <= 30; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `Hip Revision Tray ${i}`,
      specialty: 'Orthopaedic',
      procedureType: 'Hip Revision',
      instruments: [...ORTHO_INSTRUMENTS.basic, ...ORTHO_INSTRUMENTS.hip, ...[
        { name: 'Cement Removal Set', productCode: 'CEME-REM-SET', manufacturer: 'Stryker', qty: 1 },
        { name: 'Explant System', productCode: 'EXPL-SYS', manufacturer: 'Stryker', qty: 1 },
      ]],
      storageLocationId: storageMap['Orthopaedic'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-HIP-REV-${i}`,
      weight: '10.2kg',
      dimensions: '60x40x15cm',
    });
  }

  // Knee Primary Trays (40)
  for (let i = 1; i <= 40; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `Knee Primary Tray ${i}`,
      specialty: 'Orthopaedic',
      procedureType: 'Total Knee Replacement',
      instruments: [...ORTHO_INSTRUMENTS.basic, ...ORTHO_INSTRUMENTS.knee],
      storageLocationId: storageMap['Orthopaedic'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-KNEE-PRI-${i}`,
      weight: '7.8kg',
      dimensions: '60x40x15cm',
    });
  }

  // Shoulder Trays (20)
  for (let i = 1; i <= 20; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `Shoulder Arthroscopy Tray ${i}`,
      specialty: 'Orthopaedic',
      procedureType: 'Shoulder Arthroscopy',
      instruments: [...ORTHO_INSTRUMENTS.basic, ...GENERAL_INSTRUMENTS.laparoscopic],
      storageLocationId: storageMap['Orthopaedic'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-SHOU-ARTH-${i}`,
      weight: '5.5kg',
      dimensions: '50x35x12cm',
    });
  }

  // Hand Trays (20)
  for (let i = 1; i <= 20; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `Hand Surgery Tray ${i}`,
      specialty: 'Orthopaedic',
      procedureType: 'Hand Surgery',
      instruments: [...ORTHO_INSTRUMENTS.basic.slice(0, 10), ...[
        { name: 'Fine Dissecting Scissors', productCode: 'SCIS-FINE', manufacturer: 'Aesculap', qty: 3 },
        { name: 'Micro Needle Holders', productCode: 'NEED-MICR', manufacturer: 'Aesculap', qty: 3 },
      ]],
      storageLocationId: storageMap['Plastic'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-HAND-${i}`,
      weight: '3.2kg',
      dimensions: '40x30x10cm',
    });
  }

  // Spinal Trays (30)
  for (let i = 1; i <= 30; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `Spinal Instrumentation Tray ${i}`,
      specialty: 'Spinal',
      procedureType: 'Spinal Instrumentation',
      instruments: [...ORTHO_INSTRUMENTS.basic, ...ORTHO_INSTRUMENTS.spine],
      storageLocationId: storageMap['Spinal'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-SPINE-${i}`,
      weight: '9.5kg',
      dimensions: '60x40x15cm',
    });
  }

  // Trauma Trays (20)
  for (let i = 1; i <= 20; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `Trauma ORIF Tray ${i}`,
      specialty: 'Orthopaedic',
      procedureType: 'Trauma ORIF',
      instruments: [...ORTHO_INSTRUMENTS.basic, ...ORTHO_INSTRUMENTS.trauma],
      storageLocationId: storageMap['Orthopaedic'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-TRAUMA-${i}`,
      weight: '11.2kg',
      dimensions: '60x40x15cm',
    });
  }

  // GENERAL SURGERY TRAYS (150)
  // Laparotomy Trays (40)
  for (let i = 1; i <= 40; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `Laparotomy Major Tray ${i}`,
      specialty: 'General',
      procedureType: 'Laparotomy',
      instruments: [...GENERAL_INSTRUMENTS.basic, ...GENERAL_INSTRUMENTS.laparotomy],
      storageLocationId: storageMap['General'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-LAP-MAJ-${i}`,
      weight: '7.5kg',
      dimensions: '55x38x12cm',
    });
  }

  // Laparoscopic Trays (50)
  for (let i = 1; i <= 50; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `Laparoscopic General Tray ${i}`,
      specialty: 'Laparoscopic',
      procedureType: 'Laparoscopic Surgery',
      instruments: [...GENERAL_INSTRUMENTS.basic.slice(0, 8), ...GENERAL_INSTRUMENTS.laparoscopic],
      storageLocationId: storageMap['Laparoscopic'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-LAPSC-${i}`,
      weight: '4.8kg',
      dimensions: '50x35x10cm',
    });
  }

  // Appendicectomy Trays (20)
  for (let i = 1; i <= 20; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `Appendicectomy Tray ${i}`,
      specialty: 'General',
      procedureType: 'Appendicectomy',
      instruments: GENERAL_INSTRUMENTS.basic,
      storageLocationId: storageMap['General'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-APPEN-${i}`,
      weight: '5.2kg',
      dimensions: '50x35x10cm',
    });
  }

  // Hernia Trays (20)
  for (let i = 1; i <= 20; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `Hernia Repair Tray ${i}`,
      specialty: 'General',
      procedureType: 'Hernia Repair',
      instruments: GENERAL_INSTRUMENTS.basic,
      storageLocationId: storageMap['General'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-HERN-${i}`,
      weight: '5.5kg',
      dimensions: '50x35x10cm',
    });
  }

  // Cholecystectomy Trays (20)
  for (let i = 1; i <= 20; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `Laparoscopic Cholecystectomy Tray ${i}`,
      specialty: 'Laparoscopic',
      procedureType: 'Laparoscopic Cholecystectomy',
      instruments: [...GENERAL_INSTRUMENTS.basic.slice(0, 8), ...GENERAL_INSTRUMENTS.laparoscopic],
      storageLocationId: storageMap['Laparoscopic'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-CHOLE-${i}`,
      weight: '4.5kg',
      dimensions: '50x35x10cm',
    });
  }

  // CARDIAC TRAYS (100)
  // CABG Trays (40)
  for (let i = 1; i <= 40; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `CABG Tray ${i}`,
      specialty: 'Cardiac',
      procedureType: 'CABG',
      instruments: CARDIAC_INSTRUMENTS.basic,
      storageLocationId: storageMap['Cardiac'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-CABG-${i}`,
      weight: '9.8kg',
      dimensions: '60x40x15cm',
    });
  }

  // Valve Trays (30)
  for (let i = 1; i <= 30; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `Valve Replacement Tray ${i}`,
      specialty: 'Cardiac',
      procedureType: 'Valve Replacement',
      instruments: CARDIAC_INSTRUMENTS.basic,
      storageLocationId: storageMap['Cardiac'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-VALVE-${i}`,
      weight: '9.5kg',
      dimensions: '60x40x15cm',
    });
  }

  // Pacemaker Trays (30)
  for (let i = 1; i <= 30; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `Pacemaker Insertion Tray ${i}`,
      specialty: 'Cardiac',
      procedureType: 'Pacemaker Insertion',
      instruments: GENERAL_INSTRUMENTS.basic.slice(0, 12),
      storageLocationId: storageMap['Cardiac'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-PACE-${i}`,
      weight: '3.8kg',
      dimensions: '40x30x10cm',
    });
  }

  // NEUROSURGERY TRAYS (100)
  // Craniotomy Trays (50)
  for (let i = 1; i <= 50; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `Craniotomy Tray ${i}`,
      specialty: 'Neuro',
      procedureType: 'Craniotomy',
      instruments: NEURO_INSTRUMENTS.basic,
      storageLocationId: storageMap['Neuro'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-CRAN-${i}`,
      weight: '8.2kg',
      dimensions: '55x38x12cm',
    });
  }

  // Spinal Neuro Trays (30)
  for (let i = 1; i <= 30; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `Neurosurgery Spinal Tray ${i}`,
      specialty: 'Neuro',
      procedureType: 'Spinal Neurosurgery',
      instruments: [...ORTHO_INSTRUMENTS.spine, ...NEURO_INSTRUMENTS.basic.slice(4, 10)],
      storageLocationId: storageMap['Neuro'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-NEURO-SP-${i}`,
      weight: '7.5kg',
      dimensions: '55x38x12cm',
    });
  }

  // VP Shunt Trays (20)
  for (let i = 1; i <= 20; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `VP Shunt Tray ${i}`,
      specialty: 'Neuro',
      procedureType: 'VP Shunt',
      instruments: GENERAL_INSTRUMENTS.basic.slice(0, 10),
      storageLocationId: storageMap['Neuro'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-VPS-${i}`,
      weight: '3.5kg',
      dimensions: '40x30x10cm',
    });
  }

  // VASCULAR TRAYS (80)
  for (let i = 1; i <= 80; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    const types = ['AAA Repair', 'Carotid Endarterectomy', 'AV Fistula', 'Varicose Vein'];
    const type = types[i % 4];
    trays.push({
      id: formatId(trayId++),
      name: `Vascular ${type} Tray ${Math.floor(i / 4) + 1}`,
      specialty: 'Vascular',
      procedureType: type,
      instruments: [...GENERAL_INSTRUMENTS.basic, ...CARDIAC_INSTRUMENTS.basic.slice(0, 8)],
      storageLocationId: storageMap['Vascular'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-VASC-${i}`,
      weight: '6.8kg',
      dimensions: '55x38x12cm',
    });
  }

  // UROLOGY TRAYS (80)
  for (let i = 1; i <= 80; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    const types = ['TURP', 'TURBT', 'Nephrectomy', 'Prostatectomy'];
    const type = types[i % 4];
    trays.push({
      id: formatId(trayId++),
      name: `Urology ${type} Tray ${Math.floor(i / 4) + 1}`,
      specialty: 'Urology',
      procedureType: type,
      instruments: GENERAL_INSTRUMENTS.basic,
      storageLocationId: storageMap['Urology'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-URO-${i}`,
      weight: '5.5kg',
      dimensions: '50x35x10cm',
    });
  }

  // GYNAECOLOGY TRAYS (70)
  for (let i = 1; i <= 70; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    const types = ['Hysterectomy', 'Oophorectomy', 'C-Section'];
    const type = types[i % 3];
    trays.push({
      id: formatId(trayId++),
      name: `Gynaecology ${type} Tray ${Math.floor(i / 3) + 1}`,
      specialty: 'Gynaecology',
      procedureType: type,
      instruments: GENERAL_INSTRUMENTS.basic,
      storageLocationId: storageMap['Gynaecology'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-GYNAE-${i}`,
      weight: '5.8kg',
      dimensions: '50x35x10cm',
    });
  }

  // ENT TRAYS (60)
  for (let i = 1; i <= 60; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    const types = ['Tonsillectomy', 'Thyroidectomy', 'Septoplasty'];
    const type = types[i % 3];
    trays.push({
      id: formatId(trayId++),
      name: `ENT ${type} Tray ${Math.floor(i / 3) + 1}`,
      specialty: 'ENT',
      procedureType: type,
      instruments: GENERAL_INSTRUMENTS.basic.slice(0, 12),
      storageLocationId: storageMap['ENT'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-ENT-${i}`,
      weight: '4.2kg',
      dimensions: '45x32x10cm',
    });
  }

  // PLASTIC SURGERY TRAYS (60)
  for (let i = 1; i <= 60; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    const types = ['Free Flap', 'Skin Graft', 'Microsurgery'];
    const type = types[i % 3];
    trays.push({
      id: formatId(trayId++),
      name: `Plastic ${type} Tray ${Math.floor(i / 3) + 1}`,
      specialty: 'Plastic',
      procedureType: type,
      instruments: GENERAL_INSTRUMENTS.basic.slice(0, 10),
      storageLocationId: storageMap['Plastic'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-PLAST-${i}`,
      weight: '3.8kg',
      dimensions: '45x32x10cm',
    });
  }

  // OPHTHALMIC TRAYS (40)
  for (let i = 1; i <= 40; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    const types = ['Cataract', 'Vitrectomy'];
    const type = types[i % 2];
    trays.push({
      id: formatId(trayId++),
      name: `Ophthalmic ${type} Tray ${Math.floor(i / 2) + 1}`,
      specialty: 'Ophthalmic',
      procedureType: type,
      instruments: GENERAL_INSTRUMENTS.basic.slice(0, 8),
      storageLocationId: storageMap['Ophthalmic'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-OPHTH-${i}`,
      weight: '2.5kg',
      dimensions: '35x25x8cm',
    });
  }

  // MAXILLOFACIAL TRAYS (30)
  for (let i = 1; i <= 30; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `Maxillofacial ORIF Tray ${i}`,
      specialty: 'Maxillofacial',
      procedureType: 'Facial Fracture ORIF',
      instruments: [...GENERAL_INSTRUMENTS.basic.slice(0, 10), ...ORTHO_INSTRUMENTS.trauma.slice(0, 8)],
      storageLocationId: storageMap['Maxillofacial'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-MAXFAC-${i}`,
      weight: '4.8kg',
      dimensions: '45x32x10cm',
    });
  }

  // PAEDIATRIC TRAYS (30)
  for (let i = 1; i <= 30; i++) {
    const sterDate = randomDate(new Date(2025, 9, 1), new Date(2025, 9, 24));
    trays.push({
      id: formatId(trayId++),
      name: `Paediatric General Tray ${i}`,
      specialty: 'Paediatric',
      procedureType: 'Paediatric Surgery',
      instruments: GENERAL_INSTRUMENTS.basic.slice(0, 12),
      storageLocationId: storageMap['Paediatric'],
      sterilizationDate: sterDate,
      expiryDate: addDays(sterDate, 28),
      productCode: `TRY-PAED-${i}`,
      weight: '3.5kg',
      dimensions: '40x30x8cm',
    });
  }

  return trays;
}

console.log('🔧 Generating 1000 instrument trays...\n');

async function seed1000InstrumentTrays() {
  try {
    console.log('🚀 Starting instrument tray generation and seeding...\n');

    const trays = generateInstrumentTrays();
    console.log(`✅ Generated ${trays.length} instrument trays!\n`);

    // Seed in batches of 500 (Firestore limit)
    const batchSize = 500;
    const batches = Math.ceil(trays.length / batchSize);

    for (let i = 0; i < batches; i++) {
      console.log(`📦 Processing batch ${i + 1}/${batches}...`);
      const start = i * batchSize;
      const end = Math.min(start + batchSize, trays.length);
      const batchTrays = trays.slice(start, end);

      let batch = writeBatch(db);
      for (const tray of batchTrays) {
        const docRef = doc(db, 'instrument_trays', tray.id);
        batch.set(docRef, tray);
      }
      await batch.commit();
      console.log(`✅ Saved ${end} / ${trays.length} trays\n`);
    }

    console.log('🎉 All 1000 instrument trays seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding instrument trays:', error);
    throw error;
  }
}

seed1000InstrumentTrays()
  .then(() => {
    console.log('\n✨ Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
