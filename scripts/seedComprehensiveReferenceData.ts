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

// ==================== PATIENT POSITIONING ====================

const PATIENT_POSITIONING = [
  { id: 'pos-001', name: 'Supine', description: 'Patient lying flat on back', commonUse: ['General', 'Cardiac', 'Vascular', 'Neuro', 'Plastic'], pressurePoints: ['Occiput', 'Scapulae', 'Sacrum', 'Heels'], equipment: ['Head ring', 'Arm boards'], productCode: 'POS-SUP' },
  { id: 'pos-002', name: 'Prone', description: 'Patient lying face down', commonUse: ['Spinal', 'Neuro', 'Plastic'], pressurePoints: ['Forehead', 'Chest', 'Pelvis', 'Knees', 'Toes'], equipment: ['Wilson frame', 'Chest supports', 'Gel pads'], productCode: 'POS-PRO' },
  { id: 'pos-003', name: 'Lateral', description: 'Patient lying on side', commonUse: ['Thoracic', 'Ortho', 'Renal'], pressurePoints: ['Ear', 'Shoulder', 'Hip', 'Knee', 'Ankle'], equipment: ['Bean bag', 'Lateral supports', 'Axillary roll'], productCode: 'POS-LAT' },
  { id: 'pos-004', name: 'Lithotomy', description: 'Patient supine with legs elevated in stirrups', commonUse: ['Gynaecology', 'Urology', 'Colorectal'], pressurePoints: ['Sacrum', 'Common peroneal nerve'], equipment: ['Lithotomy poles', 'Stirrups', 'Leg holders'], productCode: 'POS-LITH' },
  { id: 'pos-005', name: 'Trendelenburg', description: 'Supine with head down tilt', commonUse: ['Laparoscopic', 'Gynaecology', 'Colorectal'], pressurePoints: ['Shoulders', 'Occiput'], equipment: ['Shoulder supports', 'Non-slip mattress'], productCode: 'POS-TREN' },
  { id: 'pos-006', name: 'Reverse Trendelenburg', description: 'Supine with head up tilt', commonUse: ['Upper GI', 'Bariatric', 'Head & Neck'], pressurePoints: ['Feet', 'Heels'], equipment: ['Foot board', 'Knee break'], productCode: 'POS-REVT' },
  { id: 'pos-007', name: 'Beach Chair', description: 'Semi-recumbent sitting position', commonUse: ['Shoulder', 'Head & Neck'], pressurePoints: ['Sacrum', 'Heels', 'Occiput'], equipment: ['Beach chair attachment', 'Head support'], productCode: 'POS-BEACH' },
  { id: 'pos-008', name: 'Sitting', description: 'Upright sitting position', commonUse: ['Neuro (posterior fossa)'], pressurePoints: ['Ischial tuberosities', 'Feet'], equipment: ['Mayfield clamp', 'Arm supports'], productCode: 'POS-SIT' },
  { id: 'pos-009', name: 'Kraske (Jackknife)', description: 'Prone with hips flexed', commonUse: ['Anorectal', 'Pilonidal'], pressurePoints: ['Chest', 'Pelvis', 'Knees'], equipment: ['Bolsters', 'Wilson frame'], productCode: 'POS-KRASK' },
  { id: 'pos-010', name: 'Knee-Chest', description: 'Kneeling position with chest supported', commonUse: ['Spinal', 'Anorectal'], pressurePoints: ['Knees', 'Chest'], equipment: ['Andrews frame', 'Knee pads'], productCode: 'POS-KNEE' },
  { id: 'pos-011', name: 'Fowler', description: 'Semi-sitting 45-60 degrees', commonUse: ['Neurosurgery', 'Shoulder'], pressurePoints: ['Sacrum', 'Heels'], equipment: ['Back rest', 'Foot support'], productCode: 'POS-FOWL' },
  { id: 'pos-012', name: 'Left Lateral Decubitus', description: 'Lying on left side', commonUse: ['Thoracic (right)', 'Ortho'], pressurePoints: ['Left shoulder', 'Left hip'], equipment: ['Lateral supports', 'Axillary roll'], productCode: 'POS-LLD' },
  { id: 'pos-013', name: 'Right Lateral Decubitus', description: 'Lying on right side', commonUse: ['Thoracic (left)', 'Ortho'], pressurePoints: ['Right shoulder', 'Right hip'], equipment: ['Lateral supports', 'Axillary roll'], productCode: 'POS-RLD' },
  { id: 'pos-014', name: 'Lloyd-Davies', description: 'Modified lithotomy with less hip flexion', commonUse: ['Colorectal', 'Urology'], pressurePoints: ['Sacrum', 'Knees'], equipment: ['Lloyd-Davies stirrups'], productCode: 'POS-LLOYD' },
  { id: 'pos-015', name: 'Park Bench', description: 'Lateral with operated side up', commonUse: ['Neurosurgery'], pressurePoints: ['Dependent shoulder', 'Dependent hip'], equipment: ['Mayfield clamp', 'Axillary roll'], productCode: 'POS-PARK' },
];

// ==================== ALLERGIES DATABASE ====================

const ALLERGIES = [
  { id: 'allergy-001', name: 'Latex', category: 'Material', severity: 'High', alternativesRequired: ['Non-latex gloves', 'Latex-free equipment'], productCode: 'ALG-LATEX' },
  { id: 'allergy-002', name: 'Chlorhexidine', category: 'Antiseptic', severity: 'High', alternativesRequired: ['Povidone-iodine prep', 'Alcohol prep'], productCode: 'ALG-CHLOR' },
  { id: 'allergy-003', name: 'Iodine/Betadine', category: 'Antiseptic', severity: 'High', alternativesRequired: ['Chlorhexidine prep', 'Alcohol prep'], productCode: 'ALG-IODINE' },
  { id: 'allergy-004', name: 'Penicillin', category: 'Antibiotic', severity: 'High', alternativesRequired: ['Alternative antibiotics'], productCode: 'ALG-PENICIL' },
  { id: 'allergy-005', name: 'Cephalosporin', category: 'Antibiotic', severity: 'High', alternativesRequired: ['Alternative antibiotics'], productCode: 'ALG-CEPH' },
  { id: 'allergy-006', name: 'Gentamicin', category: 'Antibiotic', severity: 'Medium', alternativesRequired: ['Non-gentamicin bone cement'], productCode: 'ALG-GENT' },
  { id: 'allergy-007', name: 'Adhesive Tape', category: 'Material', severity: 'Low', alternativesRequired: ['Hypoallergenic tape', 'Tubular bandage'], productCode: 'ALG-TAPE' },
  { id: 'allergy-008', name: 'Elastoplast', category: 'Material', severity: 'Low', alternativesRequired: ['Paper tape', 'Silk tape'], productCode: 'ALG-ELAST' },
  { id: 'allergy-009', name: 'Morphine', category: 'Opioid', severity: 'High', alternativesRequired: ['Alternative opioids'], productCode: 'ALG-MORPH' },
  { id: 'allergy-010', name: 'Codeine', category: 'Opioid', severity: 'Medium', alternativesRequired: ['Alternative analgesics'], productCode: 'ALG-CODE' },
  { id: 'allergy-011', name: 'NSAIDs', category: 'Analgesic', severity: 'Medium', alternativesRequired: ['Paracetamol', 'Alternative analgesics'], productCode: 'ALG-NSAID' },
  { id: 'allergy-012', name: 'Aspirin', category: 'Antiplatelet', severity: 'Medium', alternativesRequired: ['Alternative antiplatelet'], productCode: 'ALG-ASA' },
  { id: 'allergy-013', name: 'Local Anaesthetic (Amide)', category: 'Anaesthetic', severity: 'High', alternativesRequired: ['Ester local anaesthetics'], productCode: 'ALG-LA-AMIDE' },
  { id: 'allergy-014', name: 'Local Anaesthetic (Ester)', category: 'Anaesthetic', severity: 'High', alternativesRequired: ['Amide local anaesthetics'], productCode: 'ALG-LA-ESTER' },
  { id: 'allergy-015', name: 'Propofol', category: 'Anaesthetic', severity: 'High', alternativesRequired: ['Alternative induction agent'], productCode: 'ALG-PROP' },
  { id: 'allergy-016', name: 'Suxamethonium', category: 'Muscle Relaxant', severity: 'High', alternativesRequired: ['Non-depolarising relaxant'], productCode: 'ALG-SUX' },
  { id: 'allergy-017', name: 'Atracurium', category: 'Muscle Relaxant', severity: 'Medium', alternativesRequired: ['Alternative relaxant'], productCode: 'ALG-ATRA' },
  { id: 'allergy-018', name: 'Contrast Media', category: 'Imaging', severity: 'High', alternativesRequired: ['Pre-medication', 'Alternative imaging'], productCode: 'ALG-CONT' },
  { id: 'allergy-019', name: 'Egg/Soya', category: 'Food', severity: 'High', alternativesRequired: ['Propofol contraindicated'], productCode: 'ALG-EGG' },
  { id: 'allergy-020', name: 'Metal (Nickel/Cobalt)', category: 'Material', severity: 'Medium', alternativesRequired: ['Titanium implants'], productCode: 'ALG-METAL' },
];

// ==================== ANAESTHESIA TYPES ====================

const ANAESTHESIA_TYPES = [
  { id: 'anaes-type-001', name: 'General Anaesthesia (GA)', category: 'General', description: 'Complete unconsciousness', components: ['Induction', 'Maintenance', 'Reversal'], commonDrugs: ['Propofol', 'Sevoflurane', 'Fentanyl', 'Rocuronium'], productCode: 'ANAES-GA' },
  { id: 'anaes-type-002', name: 'TIVA (Total Intravenous Anaesthesia)', category: 'General', description: 'IV-only general anaesthesia', components: ['Propofol infusion', 'Remifentanil infusion'], commonDrugs: ['Propofol', 'Remifentanil'], productCode: 'ANAES-TIVA' },
  { id: 'anaes-type-003', name: 'Spinal Anaesthesia', category: 'Regional', description: 'Subarachnoid block', level: 'T10-L5', commonDrugs: ['Bupivacaine Heavy', 'Fentanyl'], duration: '2-4 hours', productCode: 'ANAES-SPINAL' },
  { id: 'anaes-type-004', name: 'Epidural Anaesthesia', category: 'Regional', description: 'Epidural space block', level: 'Variable', commonDrugs: ['Bupivacaine', 'Fentanyl', 'Ropivacaine'], duration: 'Continuous', productCode: 'ANAES-EPI' },
  { id: 'anaes-type-005', name: 'Combined Spinal-Epidural (CSE)', category: 'Regional', description: 'Spinal + epidural catheter', level: 'Variable', commonDrugs: ['Bupivacaine', 'Fentanyl'], duration: 'Extended', productCode: 'ANAES-CSE' },
  { id: 'anaes-type-006', name: 'Brachial Plexus Block', category: 'Regional', description: 'Upper limb block', approaches: ['Interscalene', 'Supraclavicular', 'Infraclavicular', 'Axillary'], commonDrugs: ['Levobupivacaine', 'Ropivacaine'], productCode: 'ANAES-BRACHIAL' },
  { id: 'anaes-type-007', name: 'Femoral Nerve Block', category: 'Regional', description: 'Anterior thigh block', commonDrugs: ['Levobupivacaine', 'Ropivacaine'], duration: '12-24 hours', productCode: 'ANAES-FEMORAL' },
  { id: 'anaes-type-008', name: 'Sciatic Nerve Block', category: 'Regional', description: 'Posterior leg/foot block', approaches: ['Posterior', 'Lateral', 'Anterior'], commonDrugs: ['Levobupivacaine', 'Ropivacaine'], productCode: 'ANAES-SCIATIC' },
  { id: 'anaes-type-009', name: 'Popliteal Block', category: 'Regional', description: 'Lower leg/foot block', commonDrugs: ['Levobupivacaine', 'Ropivacaine'], duration: '12-24 hours', productCode: 'ANAES-POPLI' },
  { id: 'anaes-type-010', name: 'Ankle Block', category: 'Regional', description: 'Foot block (5 nerves)', nerves: ['Posterior tibial', 'Deep peroneal', 'Superficial peroneal', 'Sural', 'Saphenous'], commonDrugs: ['Lidocaine', 'Bupivacaine'], productCode: 'ANAES-ANKLE' },
  { id: 'anaes-type-011', name: 'TAP Block (Transversus Abdominis Plane)', category: 'Regional', description: 'Abdominal wall block', approaches: ['Posterior', 'Subcostal', 'Oblique'], commonDrugs: ['Levobupivacaine', 'Ropivacaine'], productCode: 'ANAES-TAP' },
  { id: 'anaes-type-012', name: 'Rectus Sheath Block', category: 'Regional', description: 'Midline abdominal block', commonDrugs: ['Levobupivacaine', 'Ropivacaine'], duration: '8-12 hours', productCode: 'ANAES-RECTUS' },
  { id: 'anaes-type-013', name: 'Paravertebral Block', category: 'Regional', description: 'Thoracic wall block', levels: 'T1-T12', commonDrugs: ['Levobupivacaine', 'Ropivacaine'], productCode: 'ANAES-PARAV' },
  { id: 'anaes-type-014', name: 'Intercostal Nerve Block', category: 'Regional', description: 'Rib/chest wall block', levels: 'Multiple ribs', commonDrugs: ['Bupivacaine', 'Levobupivacaine'], productCode: 'ANAES-INTCOS' },
  { id: 'anaes-type-015', name: 'Sedation (Conscious)', category: 'Sedation', description: 'Maintained verbal contact', levels: ['Minimal', 'Moderate'], commonDrugs: ['Midazolam', 'Fentanyl', 'Propofol'], productCode: 'ANAES-CONSED' },
  { id: 'anaes-type-016', name: 'Sedation (Deep)', category: 'Sedation', description: 'Not easily aroused', commonDrugs: ['Propofol', 'Remifentanil'], monitoring: 'Continuous', productCode: 'ANAES-DEEPSED' },
  { id: 'anaes-type-017', name: 'MAC (Monitored Anaesthesia Care)', category: 'Sedation', description: 'Sedation with local', commonDrugs: ['Midazolam', 'Fentanyl', 'Propofol'], productCode: 'ANAES-MAC' },
];

// ==================== LOCAL INFILTRATION ====================

const LOCAL_INFILTRATION = [
  { id: 'local-001', name: 'Lidocaine 1% Plain', concentration: '1%', maxDose: '3mg/kg (max 200mg)', onset: '2-5 min', duration: '30-60 min', uses: ['Minor procedures', 'Infiltration'], productCode: 'LOC-LIDO-1' },
  { id: 'local-002', name: 'Lidocaine 2% Plain', concentration: '2%', maxDose: '3mg/kg (max 200mg)', onset: '2-5 min', duration: '30-60 min', uses: ['Infiltration', 'Nerve blocks'], productCode: 'LOC-LIDO-2' },
  { id: 'local-003', name: 'Lidocaine 1% with Adrenaline 1:200,000', concentration: '1%', maxDose: '7mg/kg (max 500mg)', onset: '2-5 min', duration: '2-6 hours', uses: ['Infiltration with haemostasis'], productCode: 'LOC-LIDO-1-ADR' },
  { id: 'local-004', name: 'Lidocaine 2% with Adrenaline 1:200,000', concentration: '2%', maxDose: '7mg/kg (max 500mg)', onset: '2-5 min', duration: '2-6 hours', uses: ['Infiltration', 'Nerve blocks'], productCode: 'LOC-LIDO-2-ADR' },
  { id: 'local-005', name: 'Bupivacaine 0.25% Plain', concentration: '0.25%', maxDose: '2mg/kg (max 150mg)', onset: '10-20 min', duration: '3-8 hours', uses: ['Infiltration', 'Field blocks'], productCode: 'LOC-BUPI-025' },
  { id: 'local-006', name: 'Bupivacaine 0.5% Plain', concentration: '0.5%', maxDose: '2mg/kg (max 150mg)', onset: '10-20 min', duration: '3-8 hours', uses: ['Nerve blocks', 'Infiltration'], productCode: 'LOC-BUPI-05' },
  { id: 'local-007', name: 'Bupivacaine 0.25% with Adrenaline 1:200,000', concentration: '0.25%', maxDose: '2mg/kg (max 150mg)', onset: '10-20 min', duration: '4-12 hours', uses: ['Infiltration', 'Field blocks'], productCode: 'LOC-BUPI-025-ADR' },
  { id: 'local-008', name: 'Bupivacaine 0.5% with Adrenaline 1:200,000', concentration: '0.5%', maxDose: '2mg/kg (max 150mg)', onset: '10-20 min', duration: '4-12 hours', uses: ['Nerve blocks'], productCode: 'LOC-BUPI-05-ADR' },
  { id: 'local-009', name: 'Levobupivacaine 0.25%', concentration: '0.25%', maxDose: '2mg/kg (max 150mg)', onset: '10-20 min', duration: '3-8 hours', uses: ['Infiltration', 'Epidural'], productCode: 'LOC-LEVO-025' },
  { id: 'local-010', name: 'Levobupivacaine 0.5%', concentration: '0.5%', maxDose: '2mg/kg (max 150mg)', onset: '10-20 min', duration: '3-8 hours', uses: ['Nerve blocks', 'Epidural'], productCode: 'LOC-LEVO-05' },
  { id: 'local-011', name: 'Ropivacaine 0.2%', concentration: '0.2%', maxDose: '3mg/kg (max 200mg)', onset: '10-25 min', duration: '4-8 hours', uses: ['Epidural', 'Infiltration'], productCode: 'LOC-ROPI-02' },
  { id: 'local-012', name: 'Ropivacaine 0.5%', concentration: '0.5%', maxDose: '3mg/kg (max 200mg)', onset: '10-25 min', duration: '6-10 hours', uses: ['Nerve blocks', 'Epidural'], productCode: 'LOC-ROPI-05' },
  { id: 'local-013', name: 'Ropivacaine 0.75%', concentration: '0.75%', maxDose: '3mg/kg (max 200mg)', onset: '10-25 min', duration: '8-12 hours', uses: ['Major nerve blocks'], productCode: 'LOC-ROPI-075' },
  { id: 'local-014', name: 'Prilocaine 1%', concentration: '1%', maxDose: '6mg/kg (max 400mg)', onset: '2-5 min', duration: '30-90 min', uses: ['IVRA', 'Infiltration'], productCode: 'LOC-PRILO-1' },
  { id: 'local-015', name: 'Prilocaine 2%', concentration: '2%', maxDose: '6mg/kg (max 400mg)', onset: '2-5 min', duration: '30-90 min', uses: ['IVRA', 'Infiltration'], productCode: 'LOC-PRILO-2' },
  { id: 'local-016', name: 'Chloroprocaine 1%', concentration: '1%', maxDose: '11mg/kg (max 800mg)', onset: '2-5 min', duration: '30-60 min', uses: ['Infiltration', 'Epidural'], productCode: 'LOC-CHLORO-1' },
];

// ==================== STORAGE LOCATIONS ====================

const STORAGE_LOCATIONS = [
  // Implant Storage
  { id: 'store-001', name: 'Implant Storage A', type: 'Implant', specialty: 'Orthopaedic', location: 'Main Theatre Complex', capacity: 'Large', temperature: 'Ambient', productCode: 'STOR-IMP-A' },
  { id: 'store-002', name: 'Implant Storage B', type: 'Implant', specialty: 'Orthopaedic', location: 'Main Theatre Complex', capacity: 'Large', temperature: 'Ambient', productCode: 'STOR-IMP-B' },
  { id: 'store-003', name: 'Implant Storage C', type: 'Implant', specialty: 'Orthopaedic', location: 'Ortho Theatre Wing', capacity: 'Medium', temperature: 'Ambient', productCode: 'STOR-IMP-C' },
  { id: 'store-004', name: 'Orthopaedic Implant Storage A', type: 'Implant', specialty: 'Orthopaedic', location: 'Ortho Theatre Wing', capacity: 'Large', temperature: 'Ambient', productCode: 'STOR-ORTHO-A' },
  { id: 'store-005', name: 'Orthopaedic Implant Storage B', type: 'Implant', specialty: 'Orthopaedic', location: 'Ortho Theatre Wing', capacity: 'Large', temperature: 'Ambient', productCode: 'STOR-ORTHO-B' },
  { id: 'store-006', name: 'Spinal Implant Storage', type: 'Implant', specialty: 'Spinal', location: 'Spinal Theatre Wing', capacity: 'Medium', temperature: 'Ambient', productCode: 'STOR-SPINE' },
  { id: 'store-007', name: 'Cardiac Implant Storage', type: 'Implant', specialty: 'Cardiac', location: 'Cardiac Theatre', capacity: 'Medium', temperature: 'Ambient', productCode: 'STOR-CARDIAC' },
  { id: 'store-008', name: 'Vascular Implant Storage', type: 'Implant', specialty: 'Vascular', location: 'Vascular Theatre', capacity: 'Small', temperature: 'Ambient', productCode: 'STOR-VASC' },
  { id: 'store-009', name: 'Neurosurgery Implant Storage', type: 'Implant', specialty: 'Neuro', location: 'Neuro Theatre Wing', capacity: 'Medium', temperature: 'Ambient', productCode: 'STOR-NEURO' },
  { id: 'store-010', name: 'General Implant Storage', type: 'Implant', specialty: 'General', location: 'Main Theatre Complex', capacity: 'Large', temperature: 'Ambient', productCode: 'STOR-GEN-IMP' },

  // Consumables Storage
  { id: 'store-011', name: 'Consumables Store A', type: 'Consumables', specialty: 'General', location: 'Main Theatre Complex', capacity: 'Extra Large', temperature: 'Ambient', productCode: 'STOR-CONS-A' },
  { id: 'store-012', name: 'Consumables Store B', type: 'Consumables', specialty: 'General', location: 'Main Theatre Complex', capacity: 'Extra Large', temperature: 'Ambient', productCode: 'STOR-CONS-B' },
  { id: 'store-013', name: 'Suture Storage', type: 'Consumables', specialty: 'Sutures', location: 'Main Theatre Complex', capacity: 'Large', temperature: 'Ambient', productCode: 'STOR-SUTURE' },
  { id: 'store-014', name: 'Dressing Storage', type: 'Consumables', specialty: 'Dressings', location: 'Main Theatre Complex', capacity: 'Large', temperature: 'Ambient', productCode: 'STOR-DRESS' },
  { id: 'store-015', name: 'Glove Storage', type: 'Consumables', specialty: 'Gloves', location: 'Main Theatre Complex', capacity: 'Large', temperature: 'Ambient', productCode: 'STOR-GLOVE' },
  { id: 'store-016', name: 'Drape Storage', type: 'Consumables', specialty: 'Drapes', location: 'Main Theatre Complex', capacity: 'Large', temperature: 'Ambient', productCode: 'STOR-DRAPE' },
  { id: 'store-017', name: 'Laparoscopic Consumables Store', type: 'Consumables', specialty: 'Laparoscopic', location: 'Minimal Access Theatre', capacity: 'Medium', temperature: 'Ambient', productCode: 'STOR-LAP-CONS' },

  // Instrument Storage
  { id: 'store-018', name: 'Instrument Sterile Store A', type: 'Instruments', specialty: 'General', location: 'CSSD Adjacent', capacity: 'Extra Large', temperature: 'Ambient', productCode: 'STOR-INST-A' },
  { id: 'store-019', name: 'Instrument Sterile Store B', type: 'Instruments', specialty: 'General', location: 'CSSD Adjacent', capacity: 'Extra Large', temperature: 'Ambient', productCode: 'STOR-INST-B' },
  { id: 'store-020', name: 'Orthopaedic Instrument Store', type: 'Instruments', specialty: 'Orthopaedic', location: 'Ortho Theatre Wing', capacity: 'Large', temperature: 'Ambient', productCode: 'STOR-ORTHO-INST' },
  { id: 'store-021', name: 'Spinal Instrument Store', type: 'Instruments', specialty: 'Spinal', location: 'Spinal Theatre Wing', capacity: 'Large', temperature: 'Ambient', productCode: 'STOR-SPINE-INST' },
  { id: 'store-022', name: 'Neuro Instrument Store', type: 'Instruments', specialty: 'Neuro', location: 'Neuro Theatre Wing', capacity: 'Large', temperature: 'Ambient', productCode: 'STOR-NEURO-INST' },
  { id: 'store-023', name: 'Cardiac Instrument Store', type: 'Instruments', specialty: 'Cardiac', location: 'Cardiac Theatre', capacity: 'Large', temperature: 'Ambient', productCode: 'STOR-CARD-INST' },
  { id: 'store-024', name: 'Laparoscopic Instrument Store', type: 'Instruments', specialty: 'Laparoscopic', location: 'Minimal Access Theatre', capacity: 'Medium', temperature: 'Ambient', productCode: 'STOR-LAP-INST' },
  { id: 'store-025', name: 'Microsurgery Instrument Store', type: 'Instruments', specialty: 'Microsurgery', location: 'Plastic Theatre', capacity: 'Small', temperature: 'Ambient', productCode: 'STOR-MICRO-INST' },

  // Equipment Storage
  { id: 'store-026', name: 'Equipment Store A', type: 'Equipment', specialty: 'General', location: 'Main Theatre Complex', capacity: 'Large', temperature: 'Ambient', productCode: 'STOR-EQUIP-A' },
  { id: 'store-027', name: 'Equipment Store B', type: 'Equipment', specialty: 'General', location: 'Main Theatre Complex', capacity: 'Large', temperature: 'Ambient', productCode: 'STOR-EQUIP-B' },
  { id: 'store-028', name: 'Endoscopy Equipment Store', type: 'Equipment', specialty: 'Endoscopy', location: 'Minimal Access Theatre', capacity: 'Medium', temperature: 'Ambient', productCode: 'STOR-ENDO-EQUIP' },
  { id: 'store-029', name: 'C-Arm Storage', type: 'Equipment', specialty: 'Imaging', location: 'Equipment Corridor', capacity: 'Small', temperature: 'Ambient', productCode: 'STOR-CARM' },
  { id: 'store-030', name: 'Tourniquet Storage', type: 'Equipment', specialty: 'Orthopaedic', location: 'Ortho Theatre Wing', capacity: 'Small', temperature: 'Ambient', productCode: 'STOR-TOURN' },
];

console.log('📋 Comprehensive Reference Data Ready!');
console.log(`📊 Will seed:`);
console.log(`   - ${PATIENT_POSITIONING.length} Patient Positioning Types`);
console.log(`   - ${ALLERGIES.length} Allergy Types`);
console.log(`   - ${ANAESTHESIA_TYPES.length} Anaesthesia Types`);
console.log(`   - ${LOCAL_INFILTRATION.length} Local Infiltration Types`);
console.log(`   - ${STORAGE_LOCATIONS.length} Storage Locations\n`);

async function seedReferenceData() {
  try {
    console.log('🚀 Starting reference data seeding...\n');

    // Seed Patient Positioning
    console.log('🛏️ Seeding patient positioning types...');
    let batch = writeBatch(db);
    for (const item of PATIENT_POSITIONING) {
      const docRef = doc(db, 'patient_positioning', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${PATIENT_POSITIONING.length} positioning types!\n`);

    // Seed Allergies
    console.log('⚠️ Seeding allergies...');
    batch = writeBatch(db);
    for (const item of ALLERGIES) {
      const docRef = doc(db, 'allergies', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${ALLERGIES.length} allergy types!\n`);

    // Seed Anaesthesia Types
    console.log('💤 Seeding anaesthesia types...');
    batch = writeBatch(db);
    for (const item of ANAESTHESIA_TYPES) {
      const docRef = doc(db, 'anaesthesia_types', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${ANAESTHESIA_TYPES.length} anaesthesia types!\n`);

    // Seed Local Infiltration
    console.log('💉 Seeding local infiltration options...');
    batch = writeBatch(db);
    for (const item of LOCAL_INFILTRATION) {
      const docRef = doc(db, 'local_infiltration', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${LOCAL_INFILTRATION.length} local infiltration types!\n`);

    // Seed Storage Locations
    console.log('📦 Seeding storage locations...');
    batch = writeBatch(db);
    for (const item of STORAGE_LOCATIONS) {
      const docRef = doc(db, 'storage_locations', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${STORAGE_LOCATIONS.length} storage locations!\n`);

    console.log('🎉 All reference data seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding reference data:', error);
    throw error;
  }
}

seedReferenceData()
  .then(() => {
    console.log('\n✨ Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
