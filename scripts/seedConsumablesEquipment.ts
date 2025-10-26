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

// ==================== CONSUMABLES DATABASE ====================

// SUTURES - Complete range
const SUTURES = [
  // Vicryl (Polyglactin 910) - Absorbable
  { id: 'sut-001', name: 'Vicryl 2-0 70cm UR', manufacturer: 'Ethicon', type: 'Absorbable', material: 'Polyglactin 910', size: '2-0', length: '70cm', needle: 'UR (Urology Round)', color: 'Violet', specialty: ['Urology', 'General'], productCode: 'V392H' },
  { id: 'sut-002', name: 'Vicryl 3-0 75cm CT-1', manufacturer: 'Ethicon', type: 'Absorbable', material: 'Polyglactin 910', size: '3-0', length: '75cm', needle: 'CT-1 (Taper)', color: 'Violet', specialty: ['General', 'Gynaecology'], productCode: 'V303H' },
  { id: 'sut-003', name: 'Vicryl 0 90cm CT-1', manufacturer: 'Ethicon', type: 'Absorbable', material: 'Polyglactin 910', size: '0', length: '90cm', needle: 'CT-1 (Taper)', color: 'Violet', specialty: ['General', 'Vascular'], productCode: 'V832H' },
  { id: 'sut-004', name: 'Vicryl Rapide 3-0 75cm FS-2', manufacturer: 'Ethicon', type: 'Absorbable', material: 'Polyglactin 910', size: '3-0', length: '75cm', needle: 'FS-2 (Cutting)', color: 'Undyed', specialty: ['Plastic', 'Facial'], productCode: 'VR2235' },
  { id: 'sut-005', name: 'Vicryl 4-0 45cm PS-2', manufacturer: 'Ethicon', type: 'Absorbable', material: 'Polyglactin 910', size: '4-0', length: '45cm', needle: 'PS-2 (Plastic)', color: 'Violet', specialty: ['Plastic', 'Hand'], productCode: 'V422H' },

  // PDS (Polydioxanone) - Long-term Absorbable
  { id: 'sut-010', name: 'PDS II 1 90cm CT-1', manufacturer: 'Ethicon', type: 'Absorbable', material: 'Polydioxanone', size: '1', length: '90cm', needle: 'CT-1 (Taper)', color: 'Violet', specialty: ['General', 'Abdominal'], productCode: 'Z306H' },
  { id: 'sut-011', name: 'PDS II 2-0 90cm CT-1', manufacturer: 'Ethicon', type: 'Absorbable', material: 'Polydioxanone', size: '2-0', length: '90cm', needle: 'CT-1 (Taper)', color: 'Violet', specialty: ['General', 'Vascular'], productCode: 'Z303H' },
  { id: 'sut-012', name: 'PDS II 3-0 70cm SH', manufacturer: 'Ethicon', type: 'Absorbable', material: 'Polydioxanone', size: '3-0', length: '70cm', needle: 'SH (Taper)', color: 'Violet', specialty: ['Cardiac', 'Vascular'], productCode: 'Z340H' },
  { id: 'sut-013', name: 'PDS II Loop 1 48cm CT-1', manufacturer: 'Ethicon', type: 'Absorbable', material: 'Polydioxanone', size: '1', length: '48cm', needle: 'CT-1 (Taper)', color: 'Violet', specialty: ['Ortho', 'Tendon'], productCode: 'Z306L' },

  // Monocryl (Poliglecaprone 25) - Fast Absorbable
  { id: 'sut-020', name: 'Monocryl 3-0 70cm PS-2', manufacturer: 'Ethicon', type: 'Absorbable', material: 'Poliglecaprone 25', size: '3-0', length: '70cm', needle: 'PS-2 (Plastic)', color: 'Undyed', specialty: ['Plastic', 'Dermatology'], productCode: 'Y423H' },
  { id: 'sut-021', name: 'Monocryl 4-0 45cm PS-3', manufacturer: 'Ethicon', type: 'Absorbable', material: 'Poliglecaprone 25', size: '4-0', length: '45cm', needle: 'PS-3 (Plastic)', color: 'Undyed', specialty: ['Plastic', 'Facial'], productCode: 'Y433H' },
  { id: 'sut-022', name: 'Monocryl 5-0 45cm P-3', manufacturer: 'Ethicon', type: 'Absorbable', material: 'Poliglecaprone 25', size: '5-0', length: '45cm', needle: 'P-3 (Precision)', color: 'Undyed', specialty: ['Ophthalmic', 'Plastic'], productCode: 'Y443H' },

  // Prolene (Polypropylene) - Non-Absorbable
  { id: 'sut-030', name: 'Prolene 2-0 75cm SH', manufacturer: 'Ethicon', type: 'Non-Absorbable', material: 'Polypropylene', size: '2-0', length: '75cm', needle: 'SH (Taper)', color: 'Blue', specialty: ['Vascular', 'Cardiac'], productCode: '8886H' },
  { id: 'sut-031', name: 'Prolene 3-0 75cm SH', manufacturer: 'Ethicon', type: 'Non-Absorbable', material: 'Polypropylene', size: '3-0', length: '75cm', needle: 'SH (Taper)', color: 'Blue', specialty: ['Vascular', 'Cardiac'], productCode: '8883H' },
  { id: 'sut-032', name: 'Prolene 4-0 75cm SH', manufacturer: 'Ethicon', type: 'Non-Absorbable', material: 'Polypropylene', size: '4-0', length: '75cm', needle: 'SH (Taper)', color: 'Blue', specialty: ['Vascular', 'Cardiac'], productCode: '8881H' },
  { id: 'sut-033', name: 'Prolene 5-0 60cm BV-1', manufacturer: 'Ethicon', type: 'Non-Absorbable', material: 'Polypropylene', size: '5-0', length: '60cm', needle: 'BV-1 (Cardiovascular)', color: 'Blue', specialty: ['Cardiac', 'Vascular'], productCode: '8700H' },
  { id: 'sut-034', name: 'Prolene 6-0 60cm BV-1', manufacturer: 'Ethicon', type: 'Non-Absorbable', material: 'Polypropylene', size: '6-0', length: '60cm', needle: 'BV-1 (Cardiovascular)', color: 'Blue', specialty: ['Cardiac', 'Microsurgery'], productCode: '8698H' },

  // Ethibond (Polyester) - Non-Absorbable
  { id: 'sut-040', name: 'Ethibond Excel 1 75cm SH', manufacturer: 'Ethicon', type: 'Non-Absorbable', material: 'Polyester', size: '1', length: '75cm', needle: 'SH (Taper)', color: 'Green', specialty: ['Cardiac', 'Vascular'], productCode: 'X809H' },
  { id: 'sut-041', name: 'Ethibond Excel 2 90cm SH', manufacturer: 'Ethicon', type: 'Non-Absorbable', material: 'Polyester', size: '2', length: '90cm', needle: 'SH (Taper)', color: 'Green', specialty: ['Cardiac', 'Sternal'], productCode: 'X812H' },

  // Nylon - Non-Absorbable
  { id: 'sut-050', name: 'Ethilon 3-0 75cm FS-2', manufacturer: 'Ethicon', type: 'Non-Absorbable', material: 'Nylon', size: '3-0', length: '75cm', needle: 'FS-2 (Cutting)', color: 'Black', specialty: ['Plastic', 'General'], productCode: '663H' },
  { id: 'sut-051', name: 'Ethilon 4-0 45cm PS-3', manufacturer: 'Ethicon', type: 'Non-Absorbable', material: 'Nylon', size: '4-0', length: '45cm', needle: 'PS-3 (Plastic)', color: 'Black', specialty: ['Plastic', 'Facial'], productCode: '661H' },
  { id: 'sut-052', name: 'Ethilon 5-0 45cm P-3', manufacturer: 'Ethicon', type: 'Non-Absorbable', material: 'Nylon', size: '5-0', length: '45cm', needle: 'P-3 (Precision)', color: 'Black', specialty: ['Ophthalmic', 'Microsurgery'], productCode: '1667G' },
];

// SURGICAL DRAPES
const DRAPES = [
  { id: 'drape-001', name: 'Universal Surgical Drape', manufacturer: '3M', size: '100x150cm', type: 'Standard', material: 'SMS Non-Woven', sterile: true, specialty: ['General'], productCode: '1020' },
  { id: 'drape-002', name: 'Laparotomy Drape with Pouch', manufacturer: '3M', size: '240x280cm', type: 'Fenestrated', material: 'SMS Non-Woven', sterile: true, specialty: ['General', 'Gynaecology'], productCode: '1030' },
  { id: 'drape-003', name: 'Cardiovascular Drape', manufacturer: 'Medline', size: '300x340cm', type: 'Fenestrated', material: 'Polypropylene', sterile: true, specialty: ['Cardiac'], productCode: 'DYNJP5440' },
  { id: 'drape-004', name: 'Orthopaedic Hip Drape', manufacturer: 'Mölnlycke', size: '260x320cm', type: 'Fenestrated', material: 'Barrier', sterile: true, specialty: ['Ortho'], productCode: '176500' },
  { id: 'drape-005', name: 'Extremity Drape', manufacturer: 'Mölnlycke', size: '110x250cm', type: 'Split Sheet', material: 'Barrier', sterile: true, specialty: ['Ortho', 'Vascular'], productCode: '176450' },
  { id: 'drape-006', name: 'Neuro Craniotomy Drape', manufacturer: 'Cardinal Health', size: '240x320cm', type: 'Fenestrated', material: 'SMS', sterile: true, specialty: ['Neuro'], productCode: 'C-CRANI-01' },
  { id: 'drape-007', name: 'Ophthalmic Drape', manufacturer: 'Allergan', size: '50x60cm', type: 'Adhesive', material: 'Polyethylene', sterile: true, specialty: ['Ophthalmic'], productCode: 'EYE-100' },
  { id: 'drape-008', name: 'Caesarean Section Drape', manufacturer: 'Medline', size: '180x230cm', type: 'Fenestrated', material: 'SMS', sterile: true, specialty: ['Obstetrics'], productCode: 'DYNJP5420' },
  { id: 'drape-009', name: 'Arthroscopy Drape', manufacturer: 'DeRoyal', size: '180x230cm', type: 'Fluid Collection', material: 'Barrier', sterile: true, specialty: ['Ortho'], productCode: 'ART-450' },
  { id: 'drape-010', name: 'Minor Procedure Drape', manufacturer: 'Medline', size: '45x75cm', type: 'Fenestrated', material: 'SMS', sterile: true, specialty: ['Minor'], productCode: 'NON27160' },
];

// SKIN PREP SOLUTIONS
const SKIN_PREP = [
  { id: 'prep-001', name: 'ChloraPrep 26mL Applicator', manufacturer: 'BD', solution: '2% Chlorhexidine + 70% IPA', volume: '26mL', type: 'Applicator', tint: 'Orange', productCode: '260901' },
  { id: 'prep-002', name: 'ChloraPrep 10.5mL Applicator', manufacturer: 'BD', solution: '2% Chlorhexidine + 70% IPA', volume: '10.5mL', type: 'Applicator', tint: 'Orange', productCode: '260701' },
  { id: 'prep-003', name: 'ChloraPrep Clear 26mL', manufacturer: 'BD', solution: '2% Chlorhexidine + 70% IPA', volume: '26mL', type: 'Applicator', tint: 'Clear', productCode: '260902' },
  { id: 'prep-004', name: 'Betadine 10% Solution', manufacturer: 'Avrio', solution: '10% Povidone-Iodine', volume: '500mL', type: 'Liquid', tint: 'Brown', productCode: 'BET-500' },
  { id: 'prep-005', name: 'Betadine Alcoholic Solution', manufacturer: 'Avrio', solution: 'Povidone-Iodine + Ethanol', volume: '500mL', type: 'Liquid', tint: 'Brown', productCode: 'BET-ALC-500' },
  { id: 'prep-006', name: 'Hibitane 0.5% in 70% Spirit', manufacturer: 'Mölnlycke', solution: '0.5% Chlorhexidine + 70% Ethanol', volume: '500mL', type: 'Liquid', tint: 'Pink', productCode: 'HIB-500' },
];

// DRESSINGS - Multiple sizes and types
const DRESSINGS = [
  // Adhesive Island Dressings
  { id: 'dress-001', name: 'Mepore 9x10cm', manufacturer: 'Mölnlycke', size: '9x10cm', type: 'Adhesive Island', absorbency: 'Low', waterproof: false, specialty: ['General'], productCode: '670900' },
  { id: 'dress-002', name: 'Mepore 9x15cm', manufacturer: 'Mölnlycke', size: '9x15cm', type: 'Adhesive Island', absorbency: 'Low', waterproof: false, specialty: ['General'], productCode: '670950' },
  { id: 'dress-003', name: 'Mepore 9x20cm', manufacturer: 'Mölnlycke', size: '9x20cm', type: 'Adhesive Island', absorbency: 'Low', waterproof: false, specialty: ['General'], productCode: '671000' },
  { id: 'dress-004', name: 'Mepore 9x25cm', manufacturer: 'Mölnlycke', size: '9x25cm', type: 'Adhesive Island', absorbency: 'Low', waterproof: false, specialty: ['General'], productCode: '671100' },
  { id: 'dress-005', name: 'Mepore 9x30cm', manufacturer: 'Mölnlycke', size: '9x30cm', type: 'Adhesive Island', absorbency: 'Low', waterproof: false, specialty: ['General'], productCode: '671200' },

  // Foam Dressings
  { id: 'dress-010', name: 'Mepilex Border 7.5x7.5cm', manufacturer: 'Mölnlycke', size: '7.5x7.5cm', type: 'Foam Border', absorbency: 'High', waterproof: true, specialty: ['General', 'Pressure'], productCode: '295300' },
  { id: 'dress-011', name: 'Mepilex Border 10x10cm', manufacturer: 'Mölnlycke', size: '10x10cm', type: 'Foam Border', absorbency: 'High', waterproof: true, specialty: ['General', 'Pressure'], productCode: '295400' },
  { id: 'dress-012', name: 'Mepilex Border 15x15cm', manufacturer: 'Mölnlycke', size: '15x15cm', type: 'Foam Border', absorbency: 'High', waterproof: true, specialty: ['General', 'Pressure'], productCode: '295500' },
  { id: 'dress-013', name: 'Allevyn Gentle Border 10x10cm', manufacturer: 'Smith & Nephew', size: '10x10cm', type: 'Foam Border', absorbency: 'High', waterproof: true, specialty: ['General'], productCode: '66020044' },
  { id: 'dress-014', name: 'Allevyn Gentle Border 12.5x12.5cm', manufacturer: 'Smith & Nephew', size: '12.5x12.5cm', type: 'Foam Border', absorbency: 'High', waterproof: true, specialty: ['General'], productCode: '66020045' },

  // Transparent Film Dressings
  { id: 'dress-020', name: 'Tegaderm 6x7cm', manufacturer: '3M', size: '6x7cm', type: 'Transparent Film', absorbency: 'None', waterproof: true, specialty: ['IV Sites', 'Minor'], productCode: '1624W' },
  { id: 'dress-021', name: 'Tegaderm 10x12cm', manufacturer: '3M', size: '10x12cm', type: 'Transparent Film', absorbency: 'None', waterproof: true, specialty: ['Surgical'], productCode: '1626W' },
  { id: 'dress-022', name: 'OpSite Post-Op 8.5x9.5cm', manufacturer: 'Smith & Nephew', size: '8.5x9.5cm', type: 'Transparent Island', absorbency: 'Low', waterproof: true, specialty: ['Surgical'], productCode: '66000309' },
  { id: 'dress-023', name: 'OpSite Post-Op 10x25cm', manufacturer: 'Smith & Nephew', size: '10x25cm', type: 'Transparent Island', absorbency: 'Low', waterproof: true, specialty: ['Surgical'], productCode: '66000314' },

  // Absorbent Pads
  { id: 'dress-030', name: 'Melolin 5x5cm', manufacturer: 'Smith & Nephew', size: '5x5cm', type: 'Non-Adherent Pad', absorbency: 'Medium', waterproof: false, specialty: ['General'], productCode: '66974924' },
  { id: 'dress-031', name: 'Melolin 10x10cm', manufacturer: 'Smith & Nephew', size: '10x10cm', type: 'Non-Adherent Pad', absorbency: 'Medium', waterproof: false, specialty: ['General'], productCode: '66974944' },
  { id: 'dress-032', name: 'Kaltostat 7.5x12cm', manufacturer: 'ConvaTec', size: '7.5x12cm', type: 'Alginate', absorbency: 'Very High', waterproof: false, specialty: ['Exudating Wounds'], productCode: '168200' },
];

console.log('💊 Consumables & Equipment Database Ready!');
console.log(`📊 Will seed:`);
console.log(`   - ${SUTURES.length} Suture Types`);
console.log(`   - ${DRAPES.length} Surgical Drapes`);
console.log(`   - ${SKIN_PREP.length} Skin Prep Solutions`);
console.log(`   - ${DRESSINGS.length} Dressings\n`);

async function seedConsumables() {
  try {
    console.log('🚀 Starting consumables seeding...\n');

    // Seed Sutures
    console.log('🧵 Seeding sutures...');
    let batch = writeBatch(db);
    for (const suture of SUTURES) {
      const docRef = doc(db, 'consumables_sutures', suture.id);
      batch.set(docRef, suture);
    }
    await batch.commit();
    console.log(`✅ Saved ${SUTURES.length} sutures!\n`);

    // Seed Drapes
    console.log('🏥 Seeding surgical drapes...');
    batch = writeBatch(db);
    for (const drape of DRAPES) {
      const docRef = doc(db, 'consumables_drapes', drape.id);
      batch.set(docRef, drape);
    }
    await batch.commit();
    console.log(`✅ Saved ${DRAPES.length} drapes!\n`);

    // Seed Skin Prep
    console.log('🧴 Seeding skin prep solutions...');
    batch = writeBatch(db);
    for (const prep of SKIN_PREP) {
      const docRef = doc(db, 'consumables_prep', prep.id);
      batch.set(docRef, prep);
    }
    await batch.commit();
    console.log(`✅ Saved ${SKIN_PREP.length} prep solutions!\n`);

    // Seed Dressings
    console.log('🩹 Seeding dressings...');
    batch = writeBatch(db);
    for (const dressing of DRESSINGS) {
      const docRef = doc(db, 'consumables_dressings', dressing.id);
      batch.set(docRef, dressing);
    }
    await batch.commit();
    console.log(`✅ Saved ${DRESSINGS.length} dressings!\n`);

    console.log('🎉 All consumables seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding consumables:', error);
    throw error;
  }
}

seedConsumables()
  .then(() => {
    console.log('\n✨ Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
