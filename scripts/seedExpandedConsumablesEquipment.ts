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

// ==================== EXPANDED CONSUMABLES WITH NHS PRICING ====================

// SURGICAL GLOVES
const GLOVES = [
  { id: 'glove-001', name: 'Biogel Surgeon Gloves Size 6.0', manufacturer: 'Mölnlycke', size: '6.0', type: 'Sterile Surgical', material: 'Latex', powdered: false, specialty: ['General'], productCode: '42760', nhsPrice: 0.85, packSize: 50, supplier: 'Mölnlycke' },
  { id: 'glove-002', name: 'Biogel Surgeon Gloves Size 6.5', manufacturer: 'Mölnlycke', size: '6.5', type: 'Sterile Surgical', material: 'Latex', powdered: false, specialty: ['General'], productCode: '42765', nhsPrice: 0.85, packSize: 50, supplier: 'Mölnlycke' },
  { id: 'glove-003', name: 'Biogel Surgeon Gloves Size 7.0', manufacturer: 'Mölnlycke', size: '7.0', type: 'Sterile Surgical', material: 'Latex', powdered: false, specialty: ['General'], productCode: '42770', nhsPrice: 0.85, packSize: 50, supplier: 'Mölnlycke' },
  { id: 'glove-004', name: 'Biogel Surgeon Gloves Size 7.5', manufacturer: 'Mölnlycke', size: '7.5', type: 'Sterile Surgical', material: 'Latex', powdered: false, specialty: ['General'], productCode: '42775', nhsPrice: 0.85, packSize: 50, supplier: 'Mölnlycke' },
  { id: 'glove-005', name: 'Biogel Surgeon Gloves Size 8.0', manufacturer: 'Mölnlycke', size: '8.0', type: 'Sterile Surgical', material: 'Latex', powdered: false, specialty: ['General'], productCode: '42780', nhsPrice: 0.85, packSize: 50, supplier: 'Mölnlycke' },
  { id: 'glove-006', name: 'Biogel Surgeon Gloves Size 8.5', manufacturer: 'Mölnlycke', size: '8.5', type: 'Sterile Surgical', material: 'Latex', powdered: false, specialty: ['General'], productCode: '42785', nhsPrice: 0.85, packSize: 50, supplier: 'Mölnlycke' },
  { id: 'glove-007', name: 'Biogel Neoderm Gloves Size 7.0', manufacturer: 'Mölnlycke', size: '7.0', type: 'Sterile Latex-Free', material: 'Neoprene', powdered: false, specialty: ['General'], productCode: '43270', nhsPrice: 1.25, packSize: 40, supplier: 'Mölnlycke' },
  { id: 'glove-008', name: 'Biogel Neoderm Gloves Size 7.5', manufacturer: 'Mölnlycke', size: '7.5', type: 'Sterile Latex-Free', material: 'Neoprene', powdered: false, specialty: ['General'], productCode: '43275', nhsPrice: 1.25, packSize: 40, supplier: 'Mölnlycke' },
  { id: 'glove-009', name: 'Biogel Neoderm Gloves Size 8.0', manufacturer: 'Mölnlycke', size: '8.0', type: 'Sterile Latex-Free', material: 'Neoprene', powdered: false, specialty: ['General'], productCode: '43280', nhsPrice: 1.25, packSize: 40, supplier: 'Mölnlycke' },
  { id: 'glove-010', name: 'Nitrile Exam Gloves Small', manufacturer: 'Cardinal Health', size: 'Small', type: 'Non-Sterile Exam', material: 'Nitrile', powdered: false, specialty: ['General'], productCode: 'SG5B85200', nhsPrice: 0.08, packSize: 100, supplier: 'Cardinal Health' },
  { id: 'glove-011', name: 'Nitrile Exam Gloves Medium', manufacturer: 'Cardinal Health', size: 'Medium', type: 'Non-Sterile Exam', material: 'Nitrile', powdered: false, specialty: ['General'], productCode: 'SG5B85210', nhsPrice: 0.08, packSize: 100, supplier: 'Cardinal Health' },
  { id: 'glove-012', name: 'Nitrile Exam Gloves Large', manufacturer: 'Cardinal Health', size: 'Large', type: 'Non-Sterile Exam', material: 'Nitrile', powdered: false, specialty: ['General'], productCode: 'SG5B85220', nhsPrice: 0.08, packSize: 100, supplier: 'Cardinal Health' },
];

// SURGICAL GOWNS
const GOWNS = [
  { id: 'gown-001', name: 'Barrier Surgical Gown Large', manufacturer: 'Mölnlycke', size: 'Large', type: 'Sterile Reinforced', material: 'SMS', fluidResistant: true, specialty: ['General'], productCode: '84100', nhsPrice: 4.50, packSize: 30, supplier: 'Mölnlycke' },
  { id: 'gown-002', name: 'Barrier Surgical Gown XL', manufacturer: 'Mölnlycke', size: 'XL', type: 'Sterile Reinforced', material: 'SMS', fluidResistant: true, specialty: ['General'], productCode: '84110', nhsPrice: 4.50, packSize: 30, supplier: 'Mölnlycke' },
  { id: 'gown-003', name: 'Barrier Surgical Gown XXL', manufacturer: 'Mölnlycke', size: 'XXL', type: 'Sterile Reinforced', material: 'SMS', fluidResistant: true, specialty: ['General'], productCode: '84120', nhsPrice: 4.75, packSize: 30, supplier: 'Mölnlycke' },
  { id: 'gown-004', name: 'Cardinal Standard Gown Large', manufacturer: 'Cardinal Health', size: 'Large', type: 'Sterile Standard', material: 'Polypropylene', fluidResistant: false, specialty: ['General'], productCode: '8106', nhsPrice: 2.80, packSize: 50, supplier: 'Cardinal Health' },
  { id: 'gown-005', name: 'Isolation Gown Universal', manufacturer: 'Medline', size: 'Universal', type: 'Non-Sterile', material: 'Polypropylene', fluidResistant: true, specialty: ['General'], productCode: 'CRI4001', nhsPrice: 1.20, packSize: 50, supplier: 'Medline' },
];

// SWABS AND GAUZE
const SWABS = [
  { id: 'swab-001', name: 'Gauze Swabs 10x10cm Non-Sterile', manufacturer: 'Robinson Healthcare', size: '10x10cm', type: 'Gauze', sterile: false, ply: 8, specialty: ['General'], productCode: 'GS10NS', nhsPrice: 0.02, packSize: 100, supplier: 'Robinson' },
  { id: 'swab-002', name: 'Gauze Swabs 10x10cm Sterile', manufacturer: 'Robinson Healthcare', size: '10x10cm', type: 'Gauze', sterile: true, ply: 8, specialty: ['General'], productCode: 'GS10S', nhsPrice: 0.08, packSize: 5, supplier: 'Robinson' },
  { id: 'swab-003', name: 'Gauze Swabs 7.5x7.5cm Sterile', manufacturer: 'Robinson Healthcare', size: '7.5x7.5cm', type: 'Gauze', sterile: true, ply: 12, specialty: ['General'], productCode: 'GS75S', nhsPrice: 0.06, packSize: 5, supplier: 'Robinson' },
  { id: 'swab-004', name: 'X-Ray Detectable Swabs 45x45cm', manufacturer: 'Cardinal Health', size: '45x45cm', type: 'Laparotomy Swab', sterile: true, ply: 4, radiopaque: true, specialty: ['General'], productCode: 'LAP-XR-45', nhsPrice: 0.85, packSize: 5, supplier: 'Cardinal' },
  { id: 'swab-005', name: 'X-Ray Detectable Swabs 30x30cm', manufacturer: 'Cardinal Health', size: '30x30cm', type: 'Abdominal Swab', sterile: true, ply: 4, radiopaque: true, specialty: ['General'], productCode: 'ABD-XR-30', nhsPrice: 0.55, packSize: 5, supplier: 'Cardinal' },
  { id: 'swab-006', name: 'Raytec X-Ray Swabs 10x10cm', manufacturer: 'Johnson & Johnson', size: '10x10cm', type: 'Raytec', sterile: true, ply: 4, radiopaque: true, specialty: ['General'], productCode: '2180', nhsPrice: 0.25, packSize: 10, supplier: 'J&J' },
  { id: 'swab-007', name: 'Neuro Patties 1x1cm', manufacturer: 'Codman', size: '1x1cm', type: 'Cottonoid Patty', sterile: true, radiopaque: true, specialty: ['Neuro'], productCode: 'CPAT-1X1', nhsPrice: 0.45, packSize: 10, supplier: 'Codman' },
  { id: 'swab-008', name: 'Neuro Patties 3x3cm', manufacturer: 'Codman', size: '3x3cm', type: 'Cottonoid Patty', sterile: true, radiopaque: true, specialty: ['Neuro'], productCode: 'CPAT-3X3', nhsPrice: 0.60, packSize: 10, supplier: 'Codman' },
];

// SYRINGES
const SYRINGES = [
  { id: 'syr-001', name: 'Luer Slip 2mL Syringe', manufacturer: 'BD', volume: '2mL', type: 'Luer Slip', sterile: true, specialty: ['General'], productCode: '300185', nhsPrice: 0.08, packSize: 100, supplier: 'BD' },
  { id: 'syr-002', name: 'Luer Slip 5mL Syringe', manufacturer: 'BD', volume: '5mL', type: 'Luer Slip', sterile: true, specialty: ['General'], productCode: '300187', nhsPrice: 0.09, packSize: 100, supplier: 'BD' },
  { id: 'syr-003', name: 'Luer Slip 10mL Syringe', manufacturer: 'BD', volume: '10mL', type: 'Luer Slip', sterile: true, specialty: ['General'], productCode: '300912', nhsPrice: 0.11, packSize: 100, supplier: 'BD' },
  { id: 'syr-004', name: 'Luer Slip 20mL Syringe', manufacturer: 'BD', volume: '20mL', type: 'Luer Slip', sterile: true, specialty: ['General'], productCode: '300613', nhsPrice: 0.15, packSize: 100, supplier: 'BD' },
  { id: 'syr-005', name: 'Luer Slip 50mL Syringe', manufacturer: 'BD', volume: '50mL', type: 'Luer Slip', sterile: true, specialty: ['General'], productCode: '300865', nhsPrice: 0.35, packSize: 60, supplier: 'BD' },
  { id: 'syr-006', name: 'Luer Lock 10mL Syringe', manufacturer: 'BD', volume: '10mL', type: 'Luer Lock', sterile: true, specialty: ['General'], productCode: '302995', nhsPrice: 0.14, packSize: 100, supplier: 'BD' },
  { id: 'syr-007', name: 'Luer Lock 20mL Syringe', manufacturer: 'BD', volume: '20mL', type: 'Luer Lock', sterile: true, specialty: ['General'], productCode: '302831', nhsPrice: 0.18, packSize: 100, supplier: 'BD' },
  { id: 'syr-008', name: 'Insulin Syringe 1mL U100', manufacturer: 'BD', volume: '1mL', type: 'Insulin', sterile: true, needleSize: '29G x 12.7mm', specialty: ['Anaesthesia'], productCode: '324826', nhsPrice: 0.25, packSize: 100, supplier: 'BD' },
];

// NEEDLES
const NEEDLES = [
  { id: 'needle-001', name: 'Hypodermic Needle 21G x 1.5"', manufacturer: 'BD', gauge: '21G', length: '1.5"', type: 'Standard', sterile: true, specialty: ['General'], productCode: '305167', nhsPrice: 0.06, packSize: 100, supplier: 'BD' },
  { id: 'needle-002', name: 'Hypodermic Needle 23G x 1"', manufacturer: 'BD', gauge: '23G', length: '1"', type: 'Standard', sterile: true, specialty: ['General'], productCode: '305145', nhsPrice: 0.06, packSize: 100, supplier: 'BD' },
  { id: 'needle-003', name: 'Hypodermic Needle 25G x 1"', manufacturer: 'BD', gauge: '25G', length: '1"', type: 'Standard', sterile: true, specialty: ['General'], productCode: '305127', nhsPrice: 0.06, packSize: 100, supplier: 'BD' },
  { id: 'needle-004', name: 'Spinal Needle 25G x 3.5" Quincke', manufacturer: 'BD', gauge: '25G', length: '3.5"', type: 'Quincke Point', sterile: true, specialty: ['Anaesthesia'], productCode: '405181', nhsPrice: 2.80, packSize: 25, supplier: 'BD' },
  { id: 'needle-005', name: 'Spinal Needle 27G x 3.5" Pencil Point', manufacturer: 'BD', gauge: '27G', length: '3.5"', type: 'Whitacre', sterile: true, specialty: ['Anaesthesia'], productCode: '405211', nhsPrice: 3.20, packSize: 25, supplier: 'BD' },
  { id: 'needle-006', name: 'Epidural Needle 18G x 3.5" Tuohy', manufacturer: 'BD', gauge: '18G', length: '3.5"', type: 'Tuohy', sterile: true, specialty: ['Anaesthesia'], productCode: '403203', nhsPrice: 4.50, packSize: 25, supplier: 'BD' },
  { id: 'needle-007', name: 'Veress Needle 120mm', manufacturer: 'Karl Storz', gauge: '14G', length: '120mm', type: 'Spring Loaded', sterile: true, specialty: ['Laparoscopic'], productCode: '30110VK', nhsPrice: 18.50, packSize: 1, supplier: 'Karl Storz' },
];

// CATHETERS
const CATHETERS = [
  { id: 'cath-001', name: 'Foley Catheter 12Fr 2-Way 10mL', manufacturer: 'Bard', size: '12Fr', type: 'Foley 2-Way', balloonVolume: '10mL', material: 'Silicone', sterile: true, specialty: ['General'], productCode: 'BAR122', nhsPrice: 1.85, packSize: 10, supplier: 'Bard' },
  { id: 'cath-002', name: 'Foley Catheter 14Fr 2-Way 10mL', manufacturer: 'Bard', size: '14Fr', type: 'Foley 2-Way', balloonVolume: '10mL', material: 'Silicone', sterile: true, specialty: ['General'], productCode: 'BAR142', nhsPrice: 1.85, packSize: 10, supplier: 'Bard' },
  { id: 'cath-003', name: 'Foley Catheter 16Fr 2-Way 10mL', manufacturer: 'Bard', size: '16Fr', type: 'Foley 2-Way', balloonVolume: '10mL', material: 'Silicone', sterile: true, specialty: ['General'], productCode: 'BAR162', nhsPrice: 1.85, packSize: 10, supplier: 'Bard' },
  { id: 'cath-004', name: 'Foley Catheter 18Fr 2-Way 10mL', manufacturer: 'Bard', size: '18Fr', type: 'Foley 2-Way', balloonVolume: '10mL', material: 'Silicone', sterile: true, specialty: ['General'], productCode: 'BAR182', nhsPrice: 1.85, packSize: 10, supplier: 'Bard' },
  { id: 'cath-005', name: 'Foley Catheter 20Fr 3-Way 30mL', manufacturer: 'Bard', size: '20Fr', type: 'Foley 3-Way', balloonVolume: '30mL', material: 'Silicone', sterile: true, specialty: ['Urology'], productCode: 'BAR203', nhsPrice: 3.50, packSize: 10, supplier: 'Bard' },
  { id: 'cath-006', name: 'Foley Catheter 22Fr 3-Way 30mL', manufacturer: 'Bard', size: '22Fr', type: 'Foley 3-Way', balloonVolume: '30mL', material: 'Silicone', sterile: true, specialty: ['Urology'], productCode: 'BAR223', nhsPrice: 3.50, packSize: 10, supplier: 'Bard' },
  { id: 'cath-007', name: 'Central Venous Catheter 7Fr Triple Lumen', manufacturer: 'Arrow', size: '7Fr', type: 'CVC Triple Lumen', length: '20cm', material: 'Polyurethane', sterile: true, specialty: ['Anaesthesia'], productCode: 'CS-14703', nhsPrice: 28.50, packSize: 1, supplier: 'Arrow' },
  { id: 'cath-008', name: 'Suction Catheter 12Fr', manufacturer: 'Pennine', size: '12Fr', type: 'Yankauer', material: 'PVC', sterile: true, specialty: ['General'], productCode: 'YAN-12', nhsPrice: 0.65, packSize: 50, supplier: 'Pennine' },
];

// SURGICAL CLIPS AND STAPLERS
const CLIPS_STAPLERS = [
  { id: 'clip-001', name: 'Ligaclip Extra Small 6mm', manufacturer: 'Ethicon', size: '6mm', type: 'Titanium Clip', reloadable: false, specialty: ['General', 'Laparoscopic'], productCode: '522906', nhsPrice: 4.20, packSize: 20, supplier: 'Ethicon' },
  { id: 'clip-002', name: 'Ligaclip Medium 9mm', manufacturer: 'Ethicon', size: '9mm', type: 'Titanium Clip', reloadable: false, specialty: ['General', 'Laparoscopic'], productCode: '522909', nhsPrice: 4.50, packSize: 20, supplier: 'Ethicon' },
  { id: 'clip-003', name: 'Ligaclip Large 11mm', manufacturer: 'Ethicon', size: '11mm', type: 'Titanium Clip', reloadable: false, specialty: ['General', 'Laparoscopic'], productCode: '522911', nhsPrice: 4.80, packSize: 20, supplier: 'Ethicon' },
  { id: 'clip-004', name: 'Hem-o-lok Clip Medium 10mm', manufacturer: 'Teleflex', size: '10mm', type: 'Polymer Clip', reloadable: false, specialty: ['Laparoscopic', 'Urology'], productCode: '544250', nhsPrice: 5.50, packSize: 10, supplier: 'Teleflex' },
  { id: 'clip-005', name: 'Hem-o-lok Clip Large 16mm', manufacturer: 'Teleflex', size: '16mm', type: 'Polymer Clip', reloadable: false, specialty: ['Laparoscopic', 'Bariatric'], productCode: '544260', nhsPrice: 6.20, packSize: 10, supplier: 'Teleflex' },
  { id: 'stapler-001', name: 'Proximate Linear Cutter Blue 60mm', manufacturer: 'Ethicon', length: '60mm', stapleHeight: '3.5mm', type: 'Linear Cutter', reloadable: false, specialty: ['General', 'Thoracic'], productCode: 'TLH60', nhsPrice: 285.00, packSize: 1, supplier: 'Ethicon' },
  { id: 'stapler-002', name: 'Proximate Linear Cutter Green 60mm', manufacturer: 'Ethicon', length: '60mm', stapleHeight: '4.1mm', type: 'Linear Cutter', reloadable: false, specialty: ['General', 'Colorectal'], productCode: 'TLH60G', nhsPrice: 285.00, packSize: 1, supplier: 'Ethicon' },
  { id: 'stapler-003', name: 'Echelon Flex Endopath Blue 60mm', manufacturer: 'Ethicon', length: '60mm', stapleHeight: '3.5mm', type: 'Articulating Stapler', reloadable: false, specialty: ['Laparoscopic'], productCode: 'ETS60B', nhsPrice: 420.00, packSize: 1, supplier: 'Ethicon' },
  { id: 'stapler-004', name: 'Echelon Flex Endopath Gold 60mm', manufacturer: 'Ethicon', length: '60mm', stapleHeight: '4.8mm', type: 'Articulating Stapler', reloadable: false, specialty: ['Laparoscopic', 'Bariatric'], productCode: 'ETS60G', nhsPrice: 420.00, packSize: 1, supplier: 'Ethicon' },
  { id: 'stapler-005', name: 'Circular Stapler 29mm', manufacturer: 'Ethicon', diameter: '29mm', type: 'Circular Anastomosis', reloadable: false, specialty: ['Colorectal'], productCode: 'CDH29', nhsPrice: 385.00, packSize: 1, supplier: 'Ethicon' },
  { id: 'stapler-006', name: 'Circular Stapler 33mm', manufacturer: 'Ethicon', diameter: '33mm', type: 'Circular Anastomosis', reloadable: false, specialty: ['Colorectal'], productCode: 'CDH33', nhsPrice: 385.00, packSize: 1, supplier: 'Ethicon' },
  { id: 'stapler-007', name: 'Skin Stapler 35W', manufacturer: 'Ethicon', capacity: 35, type: 'Skin Stapler', reloadable: false, specialty: ['General'], productCode: 'W8015', nhsPrice: 8.50, packSize: 12, supplier: 'Ethicon' },
];

// ORTHOPAEDIC IMPLANTS
const ORTHO_IMPLANTS = [
  { id: 'ortho-001', name: 'Cemented Hip Stem Exeter Size 1', manufacturer: 'Stryker', size: '1', type: 'Total Hip Stem', material: 'Stainless Steel', specialty: ['Ortho'], productCode: 'EXE-S1-C', nhsPrice: 850.00, packSize: 1, supplier: 'Stryker' },
  { id: 'ortho-002', name: 'Cemented Hip Stem Exeter Size 2', manufacturer: 'Stryker', size: '2', type: 'Total Hip Stem', material: 'Stainless Steel', specialty: ['Ortho'], productCode: 'EXE-S2-C', nhsPrice: 850.00, packSize: 1, supplier: 'Stryker' },
  { id: 'ortho-003', name: 'Cemented Hip Stem Exeter Size 3', manufacturer: 'Stryker', size: '3', type: 'Total Hip Stem', material: 'Stainless Steel', specialty: ['Ortho'], productCode: 'EXE-S3-C', nhsPrice: 850.00, packSize: 1, supplier: 'Stryker' },
  { id: 'ortho-004', name: 'Uncemented Hip Stem Corail Size 10', manufacturer: 'DePuy Synthes', size: '10', type: 'Total Hip Stem', material: 'Titanium', coating: 'Hydroxyapatite', specialty: ['Ortho'], productCode: 'COR-10-UC', nhsPrice: 1250.00, packSize: 1, supplier: 'DePuy' },
  { id: 'ortho-005', name: 'Uncemented Hip Stem Corail Size 12', manufacturer: 'DePuy Synthes', size: '12', type: 'Total Hip Stem', material: 'Titanium', coating: 'Hydroxyapatite', specialty: ['Ortho'], productCode: 'COR-12-UC', nhsPrice: 1250.00, packSize: 1, supplier: 'DePuy' },
  { id: 'ortho-006', name: 'Hip Cup Pinnacle 52mm', manufacturer: 'DePuy Synthes', size: '52mm', type: 'Acetabular Cup', material: 'Titanium', specialty: ['Ortho'], productCode: 'PIN-52', nhsPrice: 950.00, packSize: 1, supplier: 'DePuy' },
  { id: 'ortho-007', name: 'Hip Cup Pinnacle 54mm', manufacturer: 'DePuy Synthes', size: '54mm', type: 'Acetabular Cup', material: 'Titanium', specialty: ['Ortho'], productCode: 'PIN-54', nhsPrice: 950.00, packSize: 1, supplier: 'DePuy' },
  { id: 'ortho-008', name: 'Femoral Head 28mm +0', manufacturer: 'DePuy Synthes', size: '28mm', offset: '+0', type: 'Modular Femoral Head', material: 'Ceramic', specialty: ['Ortho'], productCode: 'FH-28-0', nhsPrice: 450.00, packSize: 1, supplier: 'DePuy' },
  { id: 'ortho-009', name: 'Femoral Head 32mm +0', manufacturer: 'DePuy Synthes', size: '32mm', offset: '+0', type: 'Modular Femoral Head', material: 'Ceramic', specialty: ['Ortho'], productCode: 'FH-32-0', nhsPrice: 450.00, packSize: 1, supplier: 'DePuy' },
  { id: 'ortho-010', name: 'Total Knee Femoral Component Medium', manufacturer: 'Zimmer Biomet', size: 'Medium', type: 'TKR Femoral', material: 'Cobalt Chrome', specialty: ['Ortho'], productCode: 'NTRK-FM-M', nhsPrice: 1400.00, packSize: 1, supplier: 'Zimmer' },
  { id: 'ortho-011', name: 'Total Knee Tibial Component Medium', manufacturer: 'Zimmer Biomet', size: 'Medium', type: 'TKR Tibial', material: 'Titanium', specialty: ['Ortho'], productCode: 'NTRK-TB-M', nhsPrice: 1200.00, packSize: 1, supplier: 'Zimmer' },
  { id: 'ortho-012', name: 'Total Knee Polyethylene Insert 10mm', manufacturer: 'Zimmer Biomet', size: '10mm', type: 'TKR Insert', material: 'UHMWPE', specialty: ['Ortho'], productCode: 'NTRK-PE-10', nhsPrice: 350.00, packSize: 1, supplier: 'Zimmer' },
  { id: 'ortho-013', name: 'Locking Compression Plate 8-Hole 3.5mm', manufacturer: 'DePuy Synthes', holes: 8, screwSize: '3.5mm', type: 'LCP', material: 'Stainless Steel', specialty: ['Ortho', 'Trauma'], productCode: 'LCP-35-8H', nhsPrice: 185.00, packSize: 1, supplier: 'DePuy' },
  { id: 'ortho-014', name: 'Locking Compression Plate 10-Hole 3.5mm', manufacturer: 'DePuy Synthes', holes: 10, screwSize: '3.5mm', type: 'LCP', material: 'Stainless Steel', specialty: ['Ortho', 'Trauma'], productCode: 'LCP-35-10H', nhsPrice: 215.00, packSize: 1, supplier: 'DePuy' },
  { id: 'ortho-015', name: 'Cortical Screw 3.5mm x 30mm', manufacturer: 'DePuy Synthes', diameter: '3.5mm', length: '30mm', type: 'Cortical Screw', material: 'Stainless Steel', specialty: ['Ortho', 'Trauma'], productCode: 'CS-35-30', nhsPrice: 12.50, packSize: 1, supplier: 'DePuy' },
  { id: 'ortho-016', name: 'Locking Screw 3.5mm x 30mm', manufacturer: 'DePuy Synthes', diameter: '3.5mm', length: '30mm', type: 'Locking Screw', material: 'Stainless Steel', specialty: ['Ortho', 'Trauma'], productCode: 'LS-35-30', nhsPrice: 18.50, packSize: 1, supplier: 'DePuy' },
  { id: 'ortho-017', name: 'K-Wire 1.6mm x 150mm', manufacturer: 'Stryker', diameter: '1.6mm', length: '150mm', type: 'Kirschner Wire', material: 'Stainless Steel', specialty: ['Ortho', 'Hand'], productCode: 'KW-16-150', nhsPrice: 3.50, packSize: 10, supplier: 'Stryker' },
  { id: 'ortho-018', name: 'Bone Cement Palacos R+G 40g', manufacturer: 'Heraeus', weight: '40g', type: 'PMMA Cement', antibiotic: 'Gentamicin', specialty: ['Ortho'], productCode: 'PAL-RG-40', nhsPrice: 85.00, packSize: 1, supplier: 'Heraeus' },
];

// SURGICAL MESHES
const MESHES = [
  { id: 'mesh-001', name: 'Prolene Mesh 6x11cm', manufacturer: 'Ethicon', size: '6x11cm', type: 'Polypropylene Mesh', weight: 'Lightweight', specialty: ['General', 'Hernia'], productCode: 'PRO6X11', nhsPrice: 45.00, packSize: 1, supplier: 'Ethicon' },
  { id: 'mesh-002', name: 'Prolene Mesh 15x15cm', manufacturer: 'Ethicon', size: '15x15cm', type: 'Polypropylene Mesh', weight: 'Lightweight', specialty: ['General', 'Hernia'], productCode: 'PRO15X15', nhsPrice: 95.00, packSize: 1, supplier: 'Ethicon' },
  { id: 'mesh-003', name: 'Prolene Mesh 30x30cm', manufacturer: 'Ethicon', size: '30x30cm', type: 'Polypropylene Mesh', weight: 'Lightweight', specialty: ['General', 'Hernia'], productCode: 'PRO30X30', nhsPrice: 185.00, packSize: 1, supplier: 'Ethicon' },
  { id: 'mesh-004', name: 'Physiomesh 15x15cm', manufacturer: 'Ethicon', size: '15x15cm', type: 'Composite Mesh', weight: 'Lightweight', coated: true, specialty: ['Laparoscopic', 'Hernia'], productCode: 'PHY15X15', nhsPrice: 325.00, packSize: 1, supplier: 'Ethicon' },
  { id: 'mesh-005', name: 'Parietex 10x15cm', manufacturer: 'Medtronic', size: '10x15cm', type: 'Polyester Mesh', weight: 'Lightweight', coated: true, specialty: ['Hernia'], productCode: 'PTX10X15', nhsPrice: 185.00, packSize: 1, supplier: 'Medtronic' },
  { id: 'mesh-006', name: 'Parietex 30x30cm', manufacturer: 'Medtronic', size: '30x30cm', type: 'Polyester Mesh', weight: 'Lightweight', coated: true, specialty: ['Hernia'], productCode: 'PTX30X30', nhsPrice: 420.00, packSize: 1, supplier: 'Medtronic' },
  { id: 'mesh-007', name: 'Gynemesh PS 7x11cm', manufacturer: 'Ethicon', size: '7x11cm', type: 'Polypropylene Mesh', weight: 'Lightweight', specialty: ['Gynaecology'], productCode: 'GYN7X11', nhsPrice: 285.00, packSize: 1, supplier: 'Ethicon' },
];

// ==================== THEATRE EQUIPMENT WITH PRICING ====================

const OPERATING_TABLES = [
  { id: 'table-001', name: 'Maquet Alphamaxx Operating Table', manufacturer: 'Maquet', type: 'Multi-Purpose', motorized: true, maxLoad: '454kg', specialty: ['General'], productCode: 'ALPHAMAXX', nhsPrice: 48500.00, warranty: '2 years', supplier: 'Getinge' },
  { id: 'table-002', name: 'Stryker Secure II Operating Table', manufacturer: 'Stryker', type: 'Multi-Purpose', motorized: true, maxLoad: '500kg', specialty: ['General', 'Bariatric'], productCode: 'SECURE2', nhsPrice: 52000.00, warranty: '2 years', supplier: 'Stryker' },
  { id: 'table-003', name: 'Trumpf TruSystem 7000 Operating Table', manufacturer: 'Trumpf', type: 'Universal', motorized: true, maxLoad: '350kg', specialty: ['General'], productCode: 'TS7000', nhsPrice: 45000.00, warranty: '2 years', supplier: 'Trumpf' },
  { id: 'table-004', name: 'Allen Spine Table', manufacturer: 'Allen Medical', type: 'Spine Surgery', motorized: true, maxLoad: '318kg', specialty: ['Spinal'], productCode: 'ALLEN-SPINE', nhsPrice: 35000.00, warranty: '2 years', supplier: 'Hill-Rom' },
  { id: 'table-005', name: 'Jackson Spinal Table', manufacturer: 'OSI', type: 'Spine Surgery', motorized: false, maxLoad: '300kg', specialty: ['Spinal'], productCode: 'JACKSON-SP', nhsPrice: 28000.00, warranty: '2 years', supplier: 'OSI' },
];

const TABLE_ATTACHMENTS = [
  { id: 'attach-001', name: 'Maquet Leg Holder Pair', manufacturer: 'Maquet', type: 'Leg Holder', compatibility: 'Maquet Tables', specialty: ['General', 'Lithotomy'], productCode: 'MQ-LEGH', nhsPrice: 1850.00, supplier: 'Getinge' },
  { id: 'attach-002', name: 'Allen Yellofin Stirrups', manufacturer: 'Allen Medical', type: 'Stirrup', compatibility: 'Universal', specialty: ['Gynaecology', 'Urology'], productCode: 'AL-YF', nhsPrice: 2200.00, supplier: 'Hill-Rom' },
  { id: 'attach-003', name: 'Lateral Positioning Device', manufacturer: 'Allen Medical', type: 'Lateral Positioner', compatibility: 'Universal', specialty: ['Ortho', 'Thoracic'], productCode: 'AL-LAT', nhsPrice: 1450.00, supplier: 'Hill-Rom' },
  { id: 'attach-004', name: 'Mayfield Skull Clamp 3-Pin', manufacturer: 'Integra', type: 'Skull Clamp', compatibility: 'Universal', specialty: ['Neuro'], productCode: 'MF-3PIN', nhsPrice: 3200.00, supplier: 'Integra' },
  { id: 'attach-005', name: 'Arm Board Pair', manufacturer: 'Maquet', type: 'Arm Support', compatibility: 'Universal', specialty: ['General'], productCode: 'MQ-ARM', nhsPrice: 650.00, supplier: 'Getinge' },
  { id: 'attach-006', name: 'Beach Chair Attachment', manufacturer: 'Stryker', type: 'Beach Chair', compatibility: 'Stryker Tables', specialty: ['Ortho', 'Shoulder'], productCode: 'STR-BEACH', nhsPrice: 4500.00, supplier: 'Stryker' },
];

const DIATHERMY = [
  { id: 'dia-001', name: 'ERBE VIO 3 Electrosurgical Unit', manufacturer: 'ERBE', type: 'Generator', modes: ['Cut', 'Coag', 'BiClamp'], power: '400W', specialty: ['General'], productCode: 'VIO3', nhsPrice: 28500.00, warranty: '2 years', supplier: 'ERBE' },
  { id: 'dia-002', name: 'Valleylab ForceTriad Energy Platform', manufacturer: 'Medtronic', type: 'Generator', modes: ['Cut', 'Coag', 'Vessel Seal'], power: '300W', specialty: ['General'], productCode: 'FT10', nhsPrice: 26000.00, warranty: '2 years', supplier: 'Medtronic' },
  { id: 'dia-003', name: 'Olympus Thunderbeat Generator', manufacturer: 'Olympus', type: 'Generator', modes: ['Ultrasonic', 'Bipolar'], power: '200W', specialty: ['Laparoscopic'], productCode: 'ESG-400', nhsPrice: 32000.00, warranty: '2 years', supplier: 'Olympus' },
  { id: 'dia-004', name: 'Bovie Reusable Pencil', manufacturer: 'Symmetry Surgical', type: 'Monopolar Pencil', handPiece: 'Reusable', specialty: ['General'], productCode: 'A940', nhsPrice: 145.00, sterilizable: true, supplier: 'Symmetry' },
  { id: 'dia-005', name: 'Valleylab Disposable Pencil with Smoke Evac', manufacturer: 'Medtronic', type: 'Monopolar Pencil', handPiece: 'Disposable', specialty: ['General'], productCode: 'E2515H', nhsPrice: 8.50, packSize: 10, supplier: 'Medtronic' },
  { id: 'dia-006', name: 'BiClamp Forceps 180mm', manufacturer: 'ERBE', type: 'Bipolar Forceps', length: '180mm', reusable: true, specialty: ['General'], productCode: 'BC180', nhsPrice: 1850.00, supplier: 'ERBE' },
];

const SUCTION_SYSTEMS = [
  { id: 'suct-001', name: 'Medela Dominant 50 Suction Unit', manufacturer: 'Medela', type: 'Vacuum Pump', flowRate: '50 L/min', noiseLevel: '58 dB', specialty: ['General'], productCode: 'DOM50', nhsPrice: 4200.00, warranty: '2 years', supplier: 'Medela' },
  { id: 'suct-002', name: 'AMSCO Century Surgical Vacuum', manufacturer: 'Steris', type: 'Vacuum Pump', flowRate: '70 L/min', noiseLevel: '55 dB', specialty: ['General'], productCode: 'AMSCO-VAC', nhsPrice: 4800.00, warranty: '2 years', supplier: 'Steris' },
  { id: 'suct-003', name: 'Neptune Waste Management System', manufacturer: 'Stryker', type: 'Waste Collector', capacity: '4000mL', specialty: ['General'], productCode: 'NEPT-4000', nhsPrice: 12500.00, warranty: '1 year', supplier: 'Stryker' },
  { id: 'suct-004', name: 'Yankauer Suction Handle Reusable', manufacturer: 'Symmetry Surgical', type: 'Suction Handle', material: 'Stainless Steel', reusable: true, specialty: ['General'], productCode: 'YAN-RE', nhsPrice: 85.00, sterilizable: true, supplier: 'Symmetry' },
];

const THEATRE_LIGHTS = [
  { id: 'light-001', name: 'Trumpf TruLight 5000 LED', manufacturer: 'Trumpf', type: 'Ceiling LED', illuminance: '160000 lux', temperature: '4500K', specialty: ['General'], productCode: 'TL5000', nhsPrice: 38000.00, warranty: '3 years', supplier: 'Trumpf' },
  { id: 'light-002', name: 'Maquet PowerLED II Satellite', manufacturer: 'Maquet', type: 'Ceiling LED', illuminance: '140000 lux', temperature: '4500K', specialty: ['General'], productCode: 'PLED2-SAT', nhsPrice: 42000.00, warranty: '3 years', supplier: 'Getinge' },
  { id: 'light-003', name: 'Stryker 1288 HD Camera System', manufacturer: 'Stryker', type: 'Endoscopy Camera', resolution: '1920x1080', specialty: ['Laparoscopic'], productCode: '1288-HD', nhsPrice: 55000.00, warranty: '2 years', supplier: 'Stryker' },
  { id: 'light-004', name: 'Olympus Visera Elite II', manufacturer: 'Olympus', type: 'Endoscopy Camera', resolution: '1920x1080', specialty: ['Laparoscopic'], productCode: 'CV-190', nhsPrice: 52000.00, warranty: '2 years', supplier: 'Olympus' },
];

const ANAESTHETIC_EQUIPMENT = [
  { id: 'anaes-001', name: 'GE Aisys CS2 Anaesthesia Machine', manufacturer: 'GE Healthcare', type: 'Anaesthesia Workstation', vaporizers: 2, ventilationModes: 7, specialty: ['Anaesthesia'], productCode: 'AISYS-CS2', nhsPrice: 68000.00, warranty: '2 years', supplier: 'GE' },
  { id: 'anaes-002', name: 'Dräger Fabius Tiro Anaesthesia Machine', manufacturer: 'Dräger', type: 'Anaesthesia Workstation', vaporizers: 2, ventilationModes: 5, specialty: ['Anaesthesia'], productCode: 'FABIUS-TIRO', nhsPrice: 62000.00, warranty: '2 years', supplier: 'Dräger' },
  { id: 'anaes-003', name: 'Smiths Medical Portex Soft Seal Laryngeal Mask Size 3', manufacturer: 'Smiths Medical', size: '3', type: 'LMA', material: 'Silicone', reusable: false, specialty: ['Anaesthesia'], productCode: 'SS3', nhsPrice: 4.50, packSize: 10, supplier: 'Smiths' },
  { id: 'anaes-004', name: 'Smiths Medical Portex Soft Seal Laryngeal Mask Size 4', manufacturer: 'Smiths Medical', size: '4', type: 'LMA', material: 'Silicone', reusable: false, specialty: ['Anaesthesia'], productCode: 'SS4', nhsPrice: 4.50, packSize: 10, supplier: 'Smiths' },
  { id: 'anaes-005', name: 'Teleflex LMA Supreme Size 3', manufacturer: 'Teleflex', size: '3', type: 'LMA', material: 'PVC', reusable: false, specialty: ['Anaesthesia'], productCode: 'LMA-SUP3', nhsPrice: 12.50, packSize: 10, supplier: 'Teleflex' },
  { id: 'anaes-006', name: 'Teleflex LMA Supreme Size 4', manufacturer: 'Teleflex', size: '4', type: 'LMA', material: 'PVC', reusable: false, specialty: ['Anaesthesia'], productCode: 'LMA-SUP4', nhsPrice: 12.50, packSize: 10, supplier: 'Teleflex' },
];

const MONITORS = [
  { id: 'mon-001', name: 'Philips IntelliVue MX800 Patient Monitor', manufacturer: 'Philips', type: 'Multi-Parameter Monitor', parameters: ['ECG', 'SpO2', 'NIBP', 'IBP', 'Temp', 'CO2'], specialty: ['Anaesthesia'], productCode: 'MX800', nhsPrice: 28500.00, warranty: '2 years', supplier: 'Philips' },
  { id: 'mon-002', name: 'GE Carescape B850 Patient Monitor', manufacturer: 'GE Healthcare', type: 'Multi-Parameter Monitor', parameters: ['ECG', 'SpO2', 'NIBP', 'IBP', 'Temp', 'CO2'], specialty: ['Anaesthesia'], productCode: 'B850', nhsPrice: 26000.00, warranty: '2 years', supplier: 'GE' },
  { id: 'mon-003', name: 'Masimo Radical-7 Pulse CO-Oximeter', manufacturer: 'Masimo', type: 'Pulse Oximeter', parameters: ['SpO2', 'SpHb', 'SpMet'], specialty: ['Anaesthesia'], productCode: 'RAD7', nhsPrice: 8500.00, warranty: '2 years', supplier: 'Masimo' },
];

const IMAGING_EQUIPMENT = [
  { id: 'img-001', name: 'Siemens Cios Alpha C-Arm', manufacturer: 'Siemens', type: 'Mobile C-Arm', imageIntensifier: '9 inch', specialty: ['Ortho', 'Trauma'], productCode: 'CIOS-ALPHA', nhsPrice: 185000.00, warranty: '2 years', supplier: 'Siemens' },
  { id: 'img-002', name: 'GE OEC 9900 Elite C-Arm', manufacturer: 'GE Healthcare', type: 'Mobile C-Arm', imageIntensifier: '12 inch', specialty: ['Vascular', 'Cardiac'], productCode: 'OEC9900', nhsPrice: 220000.00, warranty: '2 years', supplier: 'GE' },
  { id: 'img-003', name: 'Ziehm Vision RFD 3D C-Arm', manufacturer: 'Ziehm', type: 'Mobile C-Arm', imageIntensifier: '12 inch', specialty: ['Ortho', 'Spinal'], productCode: 'VISION-RFD', nhsPrice: 245000.00, warranty: '2 years', supplier: 'Ziehm' },
];

const LAPAROSCOPY_EQUIPMENT = [
  { id: 'lap-001', name: 'Karl Storz IMAGE1 S Camera System', manufacturer: 'Karl Storz', type: 'Laparoscopy Tower', includes: ['Camera', 'Light Source', 'Insufflator', 'Recorder'], specialty: ['Laparoscopic'], productCode: 'IMAGE1-S', nhsPrice: 95000.00, warranty: '2 years', supplier: 'Karl Storz' },
  { id: 'lap-002', name: 'Stryker 1688 AIM Platform', manufacturer: 'Stryker', type: 'Laparoscopy Tower', includes: ['Camera', 'Light Source', 'Insufflator'], specialty: ['Laparoscopic'], productCode: '1688-AIM', nhsPrice: 88000.00, warranty: '2 years', supplier: 'Stryker' },
  { id: 'lap-003', name: 'Karl Storz 10mm 0° Laparoscope', manufacturer: 'Karl Storz', diameter: '10mm', angle: '0°', type: 'Rigid Laparoscope', length: '33cm', specialty: ['Laparoscopic'], productCode: '26003AA', nhsPrice: 8500.00, warranty: '2 years', supplier: 'Karl Storz' },
  { id: 'lap-004', name: 'Karl Storz 10mm 30° Laparoscope', manufacturer: 'Karl Storz', diameter: '10mm', angle: '30°', type: 'Rigid Laparoscope', length: '33cm', specialty: ['Laparoscopic'], productCode: '26003BA', nhsPrice: 8500.00, warranty: '2 years', supplier: 'Karl Storz' },
  { id: 'lap-005', name: 'Olympus LTF-190 Insufflator', manufacturer: 'Olympus', type: 'CO2 Insufflator', flowRate: '40 L/min', specialty: ['Laparoscopic'], productCode: 'LTF-190', nhsPrice: 12000.00, warranty: '2 years', supplier: 'Olympus' },
];

const ROBOTIC_SYSTEMS = [
  { id: 'robot-001', name: 'Da Vinci Xi Surgical System', manufacturer: 'Intuitive Surgical', type: 'Robotic Platform', arms: 4, specialty: ['Robotic Surgery'], productCode: 'XI-SYSTEM', nhsPrice: 2500000.00, warranty: '2 years', supplier: 'Intuitive' },
  { id: 'robot-002', name: 'Mako SmartRobotics', manufacturer: 'Stryker', type: 'Robotic Arm', specialty: ['Ortho'], productCode: 'MAKO-SMART', nhsPrice: 850000.00, warranty: '2 years', supplier: 'Stryker' },
  { id: 'robot-003', name: 'ROSA Knee System', manufacturer: 'Zimmer Biomet', type: 'Robotic Arm', specialty: ['Ortho'], productCode: 'ROSA-KNEE', nhsPrice: 680000.00, warranty: '2 years', supplier: 'Zimmer' },
];

console.log('💊 Expanded Consumables & Equipment Database Ready!');
console.log(`📊 Will seed:`);
console.log(`   - ${GLOVES.length} Glove Types`);
console.log(`   - ${GOWNS.length} Gown Types`);
console.log(`   - ${SWABS.length} Swab Types`);
console.log(`   - ${SYRINGES.length} Syringe Types`);
console.log(`   - ${NEEDLES.length} Needle Types`);
console.log(`   - ${CATHETERS.length} Catheter Types`);
console.log(`   - ${CLIPS_STAPLERS.length} Clips & Staplers`);
console.log(`   - ${ORTHO_IMPLANTS.length} Orthopaedic Implants`);
console.log(`   - ${MESHES.length} Surgical Meshes`);
console.log(`   - ${OPERATING_TABLES.length} Operating Tables`);
console.log(`   - ${TABLE_ATTACHMENTS.length} Table Attachments`);
console.log(`   - ${DIATHERMY.length} Diathermy Units`);
console.log(`   - ${SUCTION_SYSTEMS.length} Suction Systems`);
console.log(`   - ${THEATRE_LIGHTS.length} Theatre Lights`);
console.log(`   - ${ANAESTHETIC_EQUIPMENT.length} Anaesthetic Equipment`);
console.log(`   - ${MONITORS.length} Patient Monitors`);
console.log(`   - ${IMAGING_EQUIPMENT.length} Imaging Equipment`);
console.log(`   - ${LAPAROSCOPY_EQUIPMENT.length} Laparoscopy Equipment`);
console.log(`   - ${ROBOTIC_SYSTEMS.length} Robotic Systems\n`);

async function seedExpandedData() {
  try {
    console.log('🚀 Starting expanded consumables and equipment seeding...\n');

    // Seed Gloves
    console.log('🧤 Seeding gloves...');
    let batch = writeBatch(db);
    for (const item of GLOVES) {
      const docRef = doc(db, 'consumables_gloves', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${GLOVES.length} gloves!\n`);

    // Seed Gowns
    console.log('👗 Seeding gowns...');
    batch = writeBatch(db);
    for (const item of GOWNS) {
      const docRef = doc(db, 'consumables_gowns', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${GOWNS.length} gowns!\n`);

    // Seed Swabs
    console.log('🧽 Seeding swabs...');
    batch = writeBatch(db);
    for (const item of SWABS) {
      const docRef = doc(db, 'consumables_swabs', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${SWABS.length} swabs!\n`);

    // Seed Syringes
    console.log('💉 Seeding syringes...');
    batch = writeBatch(db);
    for (const item of SYRINGES) {
      const docRef = doc(db, 'consumables_syringes', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${SYRINGES.length} syringes!\n`);

    // Seed Needles
    console.log('📍 Seeding needles...');
    batch = writeBatch(db);
    for (const item of NEEDLES) {
      const docRef = doc(db, 'consumables_needles', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${NEEDLES.length} needles!\n`);

    // Seed Catheters
    console.log('🩺 Seeding catheters...');
    batch = writeBatch(db);
    for (const item of CATHETERS) {
      const docRef = doc(db, 'consumables_catheters', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${CATHETERS.length} catheters!\n`);

    // Seed Clips & Staplers
    console.log('📎 Seeding clips and staplers...');
    batch = writeBatch(db);
    for (const item of CLIPS_STAPLERS) {
      const docRef = doc(db, 'consumables_clips_staplers', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${CLIPS_STAPLERS.length} clips and staplers!\n`);

    // Seed Orthopaedic Implants
    console.log('🦴 Seeding orthopaedic implants...');
    batch = writeBatch(db);
    for (const item of ORTHO_IMPLANTS) {
      const docRef = doc(db, 'consumables_ortho_implants', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${ORTHO_IMPLANTS.length} orthopaedic implants!\n`);

    // Seed Meshes
    console.log('🕸️ Seeding surgical meshes...');
    batch = writeBatch(db);
    for (const item of MESHES) {
      const docRef = doc(db, 'consumables_meshes', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${MESHES.length} surgical meshes!\n`);

    // Seed Operating Tables
    console.log('🛏️ Seeding operating tables...');
    batch = writeBatch(db);
    for (const item of OPERATING_TABLES) {
      const docRef = doc(db, 'equipment_operating_tables', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${OPERATING_TABLES.length} operating tables!\n`);

    // Seed Table Attachments
    console.log('🔧 Seeding table attachments...');
    batch = writeBatch(db);
    for (const item of TABLE_ATTACHMENTS) {
      const docRef = doc(db, 'equipment_table_attachments', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${TABLE_ATTACHMENTS.length} table attachments!\n`);

    // Seed Diathermy
    console.log('⚡ Seeding diathermy equipment...');
    batch = writeBatch(db);
    for (const item of DIATHERMY) {
      const docRef = doc(db, 'equipment_diathermy', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${DIATHERMY.length} diathermy units!\n`);

    // Seed Suction Systems
    console.log('🌪️ Seeding suction systems...');
    batch = writeBatch(db);
    for (const item of SUCTION_SYSTEMS) {
      const docRef = doc(db, 'equipment_suction', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${SUCTION_SYSTEMS.length} suction systems!\n`);

    // Seed Theatre Lights
    console.log('💡 Seeding theatre lights...');
    batch = writeBatch(db);
    for (const item of THEATRE_LIGHTS) {
      const docRef = doc(db, 'equipment_lights', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${THEATRE_LIGHTS.length} theatre lights!\n`);

    // Seed Anaesthetic Equipment
    console.log('💤 Seeding anaesthetic equipment...');
    batch = writeBatch(db);
    for (const item of ANAESTHETIC_EQUIPMENT) {
      const docRef = doc(db, 'equipment_anaesthesia', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${ANAESTHETIC_EQUIPMENT.length} anaesthetic items!\n`);

    // Seed Monitors
    console.log('📺 Seeding patient monitors...');
    batch = writeBatch(db);
    for (const item of MONITORS) {
      const docRef = doc(db, 'equipment_monitors', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${MONITORS.length} patient monitors!\n`);

    // Seed Imaging Equipment
    console.log('📷 Seeding imaging equipment...');
    batch = writeBatch(db);
    for (const item of IMAGING_EQUIPMENT) {
      const docRef = doc(db, 'equipment_imaging', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${IMAGING_EQUIPMENT.length} imaging devices!\n`);

    // Seed Laparoscopy Equipment
    console.log('🔬 Seeding laparoscopy equipment...');
    batch = writeBatch(db);
    for (const item of LAPAROSCOPY_EQUIPMENT) {
      const docRef = doc(db, 'equipment_laparoscopy', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${LAPAROSCOPY_EQUIPMENT.length} laparoscopy items!\n`);

    // Seed Robotic Systems
    console.log('🤖 Seeding robotic systems...');
    batch = writeBatch(db);
    for (const item of ROBOTIC_SYSTEMS) {
      const docRef = doc(db, 'equipment_robotics', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`✅ Saved ${ROBOTIC_SYSTEMS.length} robotic systems!\n`);

    console.log('🎉 All expanded consumables and equipment seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

seedExpandedData()
  .then(() => {
    console.log('\n✨ Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
