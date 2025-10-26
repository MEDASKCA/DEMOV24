'use client';

import React, { useState } from 'react';
import {
  Activity,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  Package,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Coffee,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import TheatreTimelineModal from './TheatreTimelineModal';
import StaffReliefModal from './StaffReliefModal';
import StaffHoverCard from './StaffHoverCard';
import StaffCompetencyModal from './StaffCompetencyModal';
import TheatreOpsModal from './TheatreOpsModal';
import StaffDutyModal from './StaffDutyModal';
import TurnoverTimeModal from './TurnoverTimeModal';
import EfficiencyScoreModal from './EfficiencyScoreModal';
import { Bell } from 'lucide-react';

export default function DashboardView() {
  const [selectedTheatre, setSelectedTheatre] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showReliefModal, setShowReliefModal] = useState(false);
  const [selectedStaffForRelief, setSelectedStaffForRelief] = useState<any>(null);
  const [hoveredStaff, setHoveredStaff] = useState<any>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [showCompetencyModal, setShowCompetencyModal] = useState(false);
  const [selectedStaffForCompetency, setSelectedStaffForCompetency] = useState<any>(null);
  const [selectedUnit, setSelectedUnit] = useState<'all' | 'main' | 'acad' | 'recovery'>('all');
  const [showTheatreOpsModal, setShowTheatreOpsModal] = useState(false);
  const [showStaffDutyModal, setShowStaffDutyModal] = useState(false);
  const [showTurnoverModal, setShowTurnoverModal] = useState(false);
  const [showEfficiencyModal, setShowEfficiencyModal] = useState(false);

  // Live clock state - synchronized with Theatre Schedule date (October 21, 2024)
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format date and time - using October 21, 2024 as the base date
  const formatDateTime = () => {
    const baseDate = new Date(2024, 9, 21); // October 21, 2024
    const time = currentTime;

    const dateStr = baseDate.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const timeStr = time.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    return { date: dateStr, time: timeStr };
  };

  // Helper function to add professional titles to staff names
  const addStaffTitle = (name: string, role: string): string => {
    if (name === 'VACANT' || !name) return name;

    // If name already has a title (Mr., Ms., Dr., RN, ODP), return as is
    if (name.match(/^(Mr\.|Ms\.|Dr\.|RN|ODP)\s/)) return name;

    // Add title based on role
    if (role.includes('Consultant') || role.includes('Assistant')) {
      // Surgeons get Mr. or Ms. - using Mr. as default
      return `Mr. ${name}`;
    } else if (role.includes('Anaesthetist')) {
      return `Dr. ${name}`;
    } else if (role.includes('Nurse') || role.includes('Practitioner')) {
      // Nurses and practitioners - check if they already have RN or ODP prefix
      // If not, add RN as default
      if (!name.startsWith('RN ') && !name.startsWith('ODP ')) {
        return `RN ${name}`;
      }
    }

    return name;
  };

  const handleTheatreClick = (theatreName: string) => {
    setSelectedTheatre(theatreName);
    setShowTimeline(true);
  };

  const handleReliefRequest = (staffName: string, role: string, theatre: string) => {
    setSelectedStaffForRelief({ name: staffName, role, theatre });
    setShowReliefModal(true);
  };

  const handleStaffHover = (event: React.MouseEvent, staffName: string, role: string) => {
    setHoveredStaff({ name: staffName, role, id: staffName });
    setHoverPosition({ x: event.clientX, y: event.clientY });
  };

  const handleStaffClick = (staffName: string, role: string, theatre: string) => {
    setSelectedStaffForCompetency({ name: staffName, role, theatre });
    setShowCompetencyModal(true);
  };

  // Helper function to check if staff needs relief (working > 10 hours without proper breaks)
  const needsRelief = (startTime: string, currentTime: string = '16:30') => {
    // Simple check - if started at 08:00 and it's now 16:30+, highlight
    return startTime === '08:00';
  };

  // Helper function to calculate duration between two times
  const calculateDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return '';

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    const durationMinutes = endMinutes - startMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}min`;
    }
  };

  const theatreAllocations = [
    {
      theatre: 'Main Theatre 1',
      specialty: 'Elective Orthopaedics',
      session: '08:00 - 20:00',
      sessionsCount: 3,
      casesCompleted: 1,
      status: 'surgery_started',
      patientStatus: 'Surgery Started',
      currentProcedure: 'Total Hip Replacement',
      nextCase: 'Knee Arthroscopy',
      surgeryStartTime: '08:50',
      estimatedFinish: '10:30',
      team: {
        surgeon: { name: 'J. Smith', shift: '08:00 - 18:00' },
        assistant: { name: 'A. Gallagher', shift: '08:00 - 16:00' },
        anaesthetist: { name: 'F. James ☕', shift: '08:00 - 20:00' },
        anaesNP: { name: 'L. O\'Brien', shift: '10:00 - 18:00' },
        scrubNP1: { name: 'RN A. Flores', shift: '08:00 - 20:00', scrubbed: true, etf: '10:30' },
        scrubNP2: { name: 'ODP D. Jordan', shift: '08:00 - 18:00', scrubbed: false },
        hca: { name: 'T. Chikukwe', shift: '08:00 - 16:00' }
      },
      alerts: 'F. James on break (15 min)'
    },
    {
      theatre: 'Main Theatre 2',
      specialty: 'General Surgery',
      session: 'CLOSED',
      sessionsCount: 0,
      status: 'closed',
      team: {
        surgeon: { name: 'VACANT', shift: '' },
        assistant: { name: 'VACANT', shift: '' },
        anaesthetist: { name: 'VACANT', shift: '' },
        anaesNP: { name: 'VACANT', shift: '' },
        scrubNP1: { name: 'VACANT', shift: '' },
        scrubNP2: { name: 'VACANT', shift: '' },
        hca: { name: 'VACANT', shift: '' }
      },
      alerts: 'THEATRE CLOSED - Unpopulated list, no cases scheduled',
      closureReason: 'No surgical cases booked for today'
    },
    {
      theatre: 'Main Theatre 3',
      specialty: 'Cardiac Surgery',
      session: '08:00 - 18:00',
      sessionsCount: 2,
      casesCompleted: 0,
      status: 'surgery_started',
      patientStatus: 'Surgery Started',
      currentProcedure: 'CABG x4',
      nextCase: 'Aortic Valve Replacement',
      surgeryStartTime: '09:00',
      estimatedFinish: '14:30',
      team: {
        surgeon: { name: 'R. Johnson', shift: '08:00 - 18:00' },
        assistant: { name: 'T. Wilson', shift: '08:00 - 18:00' },
        anaesthetist: { name: 'B. Thompson', shift: '08:00 - 19:00' },
        anaesNP: { name: 'H. Adams', shift: '08:00 - 16:00' },
        scrubNP1: { name: 'RN M. Garcia ☕', shift: '08:00 - 20:00', scrubbed: true, etf: '14:30', relievedBy: 'RN L. Brown', relievedFrom: 'Main Theatre 3', relievedAt: '09:30' },
        scrubNP2: { name: 'RN L. Brown', shift: '08:00 - 18:00', scrubbed: false },
        scrubNP3: { name: 'ODP K. White', shift: '10:00 - 20:00', scrubbed: false },
        hca: { name: 'S. Ali', shift: '08:00 - 16:00' }
      },
      alerts: 'M. Garcia break taken (30 min)'
    },
    {
      theatre: 'Main Theatre 4',
      specialty: 'Neurosurgery',
      session: '08:00 - 18:00',
      sessionsCount: 2,
      casesCompleted: 0,
      status: 'patient_sent',
      patientStatus: 'Sent For',
      currentProcedure: 'Craniotomy',
      nextCase: 'Spinal Decompression',
      surgeryStartTime: '',
      estimatedFinish: '13:00',
      team: {
        surgeon: { name: 'A. Robertson', shift: '08:00 - 18:00' },
        assistant: { name: 'C. Lewis', shift: '08:00 - 18:00' },
        anaesthetist: { name: 'D. Mitchell', shift: '08:00 - 20:00' },
        anaesNP: { name: 'E. Cooper', shift: '08:00 - 18:00' },
        scrubNP1: { name: 'ODP F. Harrison', shift: '08:00 - 20:00', scrubbed: false },
        scrubNP2: { name: 'RN G. Walker', shift: '08:00 - 18:00', scrubbed: false },
        hca: { name: 'H. Green', shift: '08:00 - 16:00' }
      }
    },
    {
      theatre: 'Main Theatre 5',
      specialty: 'Emergency',
      session: '24/7 On-Call',
      sessionsCount: 4,
      casesCompleted: 2,
      status: 'standby',
      patientStatus: 'Standby - Ready',
      currentProcedure: '',
      surgeryStartTime: '',
      estimatedFinish: '',
      team: {
        surgeon: { name: 'I. Moore', shift: '08:00 - 20:00' },
        assistant: { name: 'J. Clark', shift: '08:00 - 20:00' },
        anaesthetist: { name: 'K. Baker ☕', shift: '08:00 - 20:00' },
        anaesNP: { name: 'L. Hill', shift: '08:00 - 18:00' },
        scrubNP1: { name: 'RN M. Scott', shift: '08:00 - 20:00', scrubbed: false },
        scrubNP2: { name: 'ODP N. Young', shift: '08:00 - 20:00', scrubbed: false },
        hca: { name: 'O. King', shift: '08:00 - 20:00' }
      }
    },
    {
      theatre: 'Main Theatre 6',
      specialty: 'Ophthalmology',
      session: '08:00 - 18:00',
      sessionsCount: 3,
      casesCompleted: 2,
      status: 'surgery_started',
      patientStatus: 'Surgery Started',
      currentProcedure: 'Cataract Surgery Bilateral',
      nextCase: 'Retinal Detachment Repair',
      surgeryStartTime: '09:15',
      estimatedFinish: '10:45',
      team: {
        surgeon: { name: 'P. Wright', shift: '08:00 - 18:00' },
        assistant: { name: 'Q. Turner', shift: '08:00 - 18:00' },
        anaesthetist: { name: 'R. Phillips', shift: '08:00 - 18:00' },
        anaesNP: { name: 'S. Campbell', shift: '08:00 - 16:00' },
        scrubNP1: { name: 'RN T. Parker', shift: '08:00 - 18:00', scrubbed: true, etf: '10:45', relievedBy: 'ODP U. Evans', relievedFrom: 'Main Theatre 6' },
        scrubNP2: { name: 'ODP U. Evans', shift: '08:00 - 18:00', scrubbed: false }
      }
    },
    {
      theatre: 'Main Theatre 7',
      specialty: 'ENT',
      session: '08:00 - 18:00',
      sessionsCount: 3,
      casesCompleted: 1,
      status: 'anaesthetic_room',
      patientStatus: 'Anaesthetic Room',
      currentProcedure: 'Tonsillectomy',
      nextCase: 'Septoplasty',
      surgeryStartTime: '',
      estimatedFinish: '11:30',
      team: {
        surgeon: { name: 'V. Edwards', shift: '08:00 - 18:00' },
        assistant: { name: 'W. Collins', shift: '08:00 - 18:00' },
        anaesthetist: { name: 'X. Morris', shift: '08:00 - 18:00' },
        anaesNP: { name: 'Y. Rogers', shift: '08:00 - 16:00' },
        scrubNP1: { name: 'RN Z. Reed ⚠️', shift: '08:00 - 20:00', scrubbed: false },
        scrubNP2: { name: 'ODP A. Cook', shift: '08:00 - 18:00', scrubbed: false }
      },
      alerts: 'Z. Reed break overdue'
    },
    {
      theatre: 'Main Theatre 8',
      specialty: 'Gynaecology',
      session: '08:00 - 18:00',
      sessionsCount: 3,
      casesCompleted: 1,
      status: 'surgery_started',
      patientStatus: 'Surgery Started',
      currentProcedure: 'Laparoscopic Hysterectomy',
      nextCase: 'Ovarian Cystectomy',
      surgeryStartTime: '08:45',
      estimatedFinish: '11:15',
      team: {
        surgeon: { name: 'B. Morgan', shift: '08:00 - 18:00' },
        assistant: { name: 'C. Bell', shift: '08:00 - 16:00' },
        anaesthetist: { name: 'D. Murphy', shift: '08:00 - 18:00' },
        anaesNP: { name: 'E. Bailey', shift: '08:00 - 18:00' },
        scrubNP1: { name: 'RN F. Rivera', shift: '08:00 - 18:00', scrubbed: true, etf: '11:15' },
        scrubNP2: { name: 'ODP G. Cooper', shift: '08:00 - 18:00', scrubbed: false },
        hca: { name: 'H. Ward', shift: '08:00 - 16:00' }
      }
    },
    {
      theatre: 'Main Theatre 9',
      specialty: 'Urology',
      session: 'CLOSED',
      sessionsCount: 0,
      status: 'closed',
      team: {
        surgeon: { name: 'I. Torres', shift: '08:00 - 16:00' },
        assistant: { name: 'VACANT', shift: '' },
        anaesthetist: { name: 'K. Gray', shift: '08:00 - 16:00' },
        anaesNP: { name: 'VACANT', shift: '' },
        scrubNP1: { name: 'VACANT', shift: '' },
        scrubNP2: { name: 'VACANT', shift: '' }
      },
      alerts: 'THEATRE CLOSED - Critical equipment failure & staff shortage',
      closureReason: 'Laser system malfunction, insufficient scrub staff coverage'
    },
    {
      theatre: 'Main Theatre 10',
      specialty: 'Plastic Surgery',
      session: '08:00 - 20:00',
      sessionsCount: 3,
      casesCompleted: 1,
      status: 'patient_sent',
      patientStatus: 'Sent For',
      currentProcedure: 'Free Flap Reconstruction',
      surgeryStartTime: '',
      estimatedFinish: '16:00',
      team: {
        surgeon: { name: 'O. Brooks', shift: '08:00 - 18:00' },
        assistant: { name: 'P. Kelly', shift: '08:00 - 18:00' },
        anaesthetist: { name: 'Q. Sanders', shift: '08:00 - 20:00' },
        anaesNP: { name: 'R. Price', shift: '08:00 - 18:00' },
        scrubNP1: { name: 'RN S. Bennett', shift: '08:00 - 20:00', scrubbed: false },
        scrubNP2: { name: 'ODP T. Wood', shift: '08:00 - 20:00', scrubbed: false },
        scrubNP3: { name: 'RN U. Barnes', shift: '10:00 - 20:00', scrubbed: false }
      }
    },
    {
      theatre: 'Main Theatre 11',
      specialty: 'Vascular',
      session: '08:00 - 18:00',
      sessionsCount: 2,
      casesCompleted: 0,
      status: 'surgery_started',
      patientStatus: 'Surgery Started',
      currentProcedure: 'AAA Repair',
      surgeryStartTime: '08:30',
      estimatedFinish: '13:00',
      team: {
        surgeon: { name: 'V. Ross', shift: '08:00 - 18:00' },
        assistant: { name: 'W. Henderson', shift: '08:00 - 18:00' },
        anaesthetist: { name: 'X. Coleman ☕', shift: '08:00 - 19:00' },
        anaesNP: { name: 'Y. Jenkins', shift: '08:00 - 18:00' },
        anaesNP2: { name: 'Z. Perry', shift: '10:00 - 18:00' },
        scrubNP1: { name: 'RN A. Powell', shift: '08:00 - 18:00', scrubbed: true, etf: '13:00', relievedBy: 'ODP B. Long', relievedFrom: 'Main Theatre 11', relievedAt: '10:15' },
        scrubNP2: { name: 'ODP B. Long', shift: '08:00 - 18:00', scrubbed: false }
      }
    },
    {
      theatre: 'Main Theatre 12',
      specialty: 'Thoracic',
      session: '08:00 - 18:00',
      sessionsCount: 2,
      casesCompleted: 0,
      status: 'anaesthetic_room',
      patientStatus: 'Anaesthetic Room',
      currentProcedure: 'VATS Lobectomy',
      surgeryStartTime: '',
      estimatedFinish: '14:30',
      team: {
        surgeon: { name: 'C. Patterson', shift: '08:00 - 18:00' },
        assistant: { name: 'D. Hughes', shift: '08:00 - 18:00' },
        anaesthetist: { name: 'E. Flores', shift: '08:00 - 20:00' },
        anaesNP: { name: 'F. Washington', shift: '08:00 - 18:00' },
        scrubNP1: { name: 'RN G. Butler', shift: '08:00 - 20:00', scrubbed: false },
        scrubNP2: { name: 'ODP H. Simmons', shift: '08:00 - 18:00', scrubbed: false }
      }
    },
    {
      theatre: 'DSU Theatre 1',
      specialty: 'Paediatric Day Surgery',
      session: '08:00 - 17:00',
      sessionsCount: 2,
      casesCompleted: 0,
      status: 'surgery_started',
      patientStatus: 'Surgery Started',
      currentProcedure: 'Paediatric Hernia Repair',
      surgeryStartTime: '09:00',
      estimatedFinish: '09:45',
      team: {
        surgeon: { name: 'I. Foster', shift: '08:00 - 17:00' },
        assistant: { name: 'J. Gonzales', shift: '08:00 - 17:00' },
        anaesthetist: { name: 'K. Bryant', shift: '08:00 - 17:00' },
        anaesNP: { name: 'L. Alexander', shift: '08:00 - 17:00' },
        scrubNP1: { name: 'RN M. Russell', shift: '08:00 - 17:00', scrubbed: true, etf: '09:45' },
        scrubNP2: { name: 'ODP N. Griffin', shift: '08:00 - 17:00', scrubbed: false },
        hca: { name: 'O. Diaz', shift: '08:00 - 17:00' }
      }
    },
    {
      theatre: 'DSU Theatre 2',
      specialty: 'Dental Day Surgery',
      session: '08:00 - 17:00',
      sessionsCount: 2,
      casesCompleted: 0,
      status: 'standby',
      patientStatus: 'Standby - Ready',
      currentProcedure: '',
      surgeryStartTime: '',
      estimatedFinish: '',
      team: {
        surgeon: { name: 'P. Hayes', shift: '08:00 - 17:00' },
        assistant: { name: 'Q. Myers', shift: '08:00 - 17:00' },
        anaesthetist: { name: 'R. Ford', shift: '08:00 - 17:00' },
        anaesNP: { name: 'S. Hamilton', shift: '08:00 - 17:00' },
        scrubNP1: { name: 'ODP T. Graham', shift: '08:00 - 17:00', scrubbed: false }
      }
    },
    {
      theatre: 'DSU Theatre 3',
      specialty: 'Maxillofacial Day',
      session: '08:00 - 17:00',
      sessionsCount: 2,
      casesCompleted: 0,
      status: 'patient_sent',
      patientStatus: 'Sent For',
      currentProcedure: 'Wisdom Tooth Extraction',
      surgeryStartTime: '',
      estimatedFinish: '10:30',
      team: {
        surgeon: { name: 'U. Sullivan', shift: '08:00 - 17:00' },
        assistant: { name: 'V. Pierce', shift: '08:00 - 17:00' },
        anaesthetist: { name: 'W. Jordan', shift: '08:00 - 17:00' },
        anaesNP: { name: 'X. Owens', shift: '08:00 - 17:00' },
        scrubNP1: { name: 'RN Y. Reynolds ⚠️', shift: '08:00 - 17:00', scrubbed: false },
        scrubNP2: { name: 'ODP Z. Fisher', shift: '08:00 - 17:00', scrubbed: false }
      },
      alerts: 'Y. Reynolds delayed'
    },
    {
      theatre: 'DSU Theatre 4',
      specialty: 'General Day Surgery',
      session: '08:00 - 17:00',
      sessionsCount: 3,
      casesCompleted: 1,
      status: 'surgery_started',
      patientStatus: 'Surgery Started',
      currentProcedure: 'Laparoscopic Cholecystectomy',
      surgeryStartTime: '08:40',
      estimatedFinish: '10:10',
      team: {
        surgeon: { name: 'A. Ellis', shift: '08:00 - 17:00' },
        assistant: { name: 'B. Stevens', shift: '08:00 - 17:00' },
        anaesthetist: { name: 'C. Chapman', shift: '08:00 - 17:00' },
        anaesNP: { name: 'D. Payne', shift: '08:00 - 17:00' },
        scrubNP1: { name: 'RN E. Hunter', shift: '08:00 - 17:00', scrubbed: true, etf: '10:10' },
        scrubNP2: { name: 'ODP F. Lawson', shift: '08:00 - 17:00', scrubbed: false },
        scrubNP3: { name: 'RN G. Berry', shift: '08:00 - 17:00', scrubbed: false }
      }
    },
    {
      theatre: 'DSU Theatre 5',
      specialty: 'HPB Day Surgery',
      session: '08:00 - 17:00',
      sessionsCount: 2,
      casesCompleted: 0,
      status: 'anaesthetic_room',
      patientStatus: 'Anaesthetic Room',
      currentProcedure: 'Liver Biopsy',
      surgeryStartTime: '',
      estimatedFinish: '11:00',
      team: {
        surgeon: { name: 'H. Arnold', shift: '08:00 - 17:00' },
        assistant: { name: 'I. Willis', shift: '08:00 - 17:00' },
        anaesthetist: { name: 'J. Ray', shift: '08:00 - 17:00' },
        anaesNP: { name: 'K. Burns', shift: '08:00 - 17:00' },
        anaesNP2: { name: 'L. Stanley', shift: '08:00 - 17:00' },
        scrubNP1: { name: 'RN M. Webb', shift: '08:00 - 17:00', scrubbed: false },
        scrubNP2: { name: 'ODP N. Tucker', shift: '08:00 - 17:00', scrubbed: false }
      }
    },
    {
      theatre: 'DSU Theatre 6',
      specialty: 'Complex Day Surgery',
      session: '08:00 - 17:00',
      sessionsCount: 2,
      casesCompleted: 0,
      status: 'standby',
      patientStatus: 'Standby - Ready',
      currentProcedure: '',
      surgeryStartTime: '',
      estimatedFinish: '',
      team: {
        surgeon: { name: 'O. Porter', shift: '08:00 - 17:00' },
        assistant: { name: 'P. Hunter', shift: '08:00 - 17:00' },
        anaesthetist: { name: 'Q. Holmes', shift: '08:00 - 17:00' },
        anaesNP: { name: 'R. Rice', shift: '08:00 - 17:00' },
        scrubNP1: { name: 'RN S. Black', shift: '08:00 - 17:00', scrubbed: false },
        scrubNP2: { name: 'ODP T. Mills', shift: '08:00 - 17:00', scrubbed: false },
        scrubNP3: { name: 'RN U. Grant', shift: '08:00 - 17:00', scrubbed: false },
        hca: { name: 'V. West', shift: '08:00 - 17:00' }
      }
    },
    {
      theatre: 'DSU Theatre 7',
      specialty: 'Robotic Day Surgery',
      session: '08:00 - 17:00',
      sessionsCount: 2,
      casesCompleted: 0,
      status: 'surgery_started',
      patientStatus: 'Surgery Started',
      currentProcedure: 'Robotic Prostatectomy',
      surgeryStartTime: '08:35',
      estimatedFinish: '11:30',
      team: {
        surgeon: { name: 'W. Stone', shift: '08:00 - 17:00' },
        assistant: { name: 'X. Hicks', shift: '08:00 - 17:00' },
        anaesthetist: { name: 'Y. Crawford', shift: '08:00 - 17:00' },
        anaesNP: { name: 'Z. Reyes', shift: '08:00 - 17:00' },
        scrubNP1: { name: 'RN A. Little', shift: '08:00 - 17:00', scrubbed: true, etf: '11:30' },
        scrubNP2: { name: 'ODP B. Fowler', shift: '08:00 - 17:00', scrubbed: false },
        techSpec: { name: 'C. Sharp', shift: '08:00 - 17:00' }
      }
    },
    {
      theatre: 'DSU Theatre 8',
      specialty: 'Hybrid Procedures',
      session: '08:00 - 17:00',
      sessionsCount: 2,
      casesCompleted: 0,
      status: 'surgery_started',
      patientStatus: 'Surgery Started',
      currentProcedure: 'EVAR',
      surgeryStartTime: '09:10',
      estimatedFinish: '12:00',
      team: {
        surgeon: { name: 'D. Wells', shift: '08:00 - 17:00' },
        assistant: { name: 'E. Shaw', shift: '08:00 - 17:00' },
        anaesthetist: { name: 'F. Ramos', shift: '08:00 - 17:00' },
        anaesNP: { name: 'G. Holland', shift: '08:00 - 17:00' },
        scrubNP1: { name: 'RN H. Newman ☕', shift: '08:00 - 17:00', scrubbed: true, etf: '12:00' },
        scrubNP2: { name: 'ODP I. Barrett', shift: '08:00 - 17:00', scrubbed: false }
      },
      alerts: 'H. Newman on break'
    },
    {
      theatre: 'DSU Theatre 9',
      specialty: 'Spinal Day Surgery',
      session: '08:00 - 17:00',
      sessionsCount: 2,
      casesCompleted: 0,
      status: 'anaesthetic_room',
      patientStatus: 'Anaesthetic Room',
      currentProcedure: 'Lumbar Microdiscectomy',
      surgeryStartTime: '',
      estimatedFinish: '11:45',
      team: {
        surgeon: { name: 'J. Murray', shift: '08:00 - 17:00' },
        assistant: { name: 'K. Freeman', shift: '08:00 - 17:00' },
        anaesthetist: { name: 'L. Wells', shift: '08:00 - 17:00' },
        anaesNP: { name: 'M. Castillo', shift: '08:00 - 17:00' },
        scrubNP1: { name: 'RN N. Webb', shift: '08:00 - 17:00', scrubbed: false },
        scrubNP2: { name: 'ODP O. Duncan', shift: '08:00 - 17:00', scrubbed: false },
        scrubNP3: { name: 'RN P. Graves', shift: '08:00 - 17:00', scrubbed: false }
      }
    },
    {
      theatre: 'DSU Theatre 10',
      specialty: 'Hand Surgery',
      session: '08:00 - 17:00',
      sessionsCount: 3,
      casesCompleted: 1,
      status: 'surgery_started',
      patientStatus: 'Surgery Started',
      currentProcedure: 'Carpal Tunnel Release',
      surgeryStartTime: '09:20',
      estimatedFinish: '09:50',
      team: {
        surgeon: { name: 'Q. Lynch', shift: '08:00 - 17:00' },
        assistant: { name: 'R. Lawson', shift: '08:00 - 17:00' },
        anaesthetist: { name: 'S. Simpson', shift: '08:00 - 17:00' },
        anaesNP: { name: 'T. Kim', shift: '08:00 - 17:00' },
        scrubNP1: { name: 'RN U. Mendoza', shift: '08:00 - 17:00', scrubbed: true, etf: '09:50' },
        scrubNP2: { name: 'ODP V. Burke', shift: '08:00 - 17:00', scrubbed: false }
      }
    },
    {
      theatre: 'DSU Theatre 11',
      specialty: 'Breast Surgery',
      session: '08:00 - 17:00',
      sessionsCount: 2,
      casesCompleted: 0,
      status: 'surgery_started',
      patientStatus: 'Surgery Started',
      currentProcedure: 'Wide Local Excision',
      surgeryStartTime: '08:55',
      estimatedFinish: '10:25',
      team: {
        surgeon: { name: 'W. Hart', shift: '08:00 - 17:00' },
        assistant: { name: 'X. Cunningham', shift: '08:00 - 17:00' },
        anaesthetist: { name: 'Y. Bradley', shift: '08:00 - 17:00' },
        anaesNP: { name: 'Z. Andrews', shift: '08:00 - 17:00' },
        scrubNP1: { name: 'RN A. Stephens', shift: '08:00 - 17:00', scrubbed: true, etf: '10:25' },
        scrubNP2: { name: 'ODP B. Moreno', shift: '08:00 - 17:00', scrubbed: false }
      }
    },
    {
      theatre: 'DSU Theatre 12',
      specialty: 'Bariatric Day Surgery',
      session: '08:00 - 17:00',
      sessionsCount: 2,
      casesCompleted: 0,
      status: 'patient_sent',
      patientStatus: 'Sent For - Delayed',
      currentProcedure: 'Gastric Band Adjustment',
      surgeryStartTime: '',
      estimatedFinish: '11:00',
      team: {
        surgeon: { name: 'C. Knight', shift: '08:00 - 17:00' },
        assistant: { name: 'D. Lawrence', shift: '08:00 - 17:00' },
        anaesthetist: { name: 'E. Vargas', shift: '08:00 - 17:00' },
        anaesNP: { name: 'F. Austin', shift: '08:00 - 17:00' },
        anaesNP2: { name: 'G. Peters', shift: '08:00 - 17:00' },
        scrubNP1: { name: 'RN H. Hawkins', shift: '08:00 - 17:00', scrubbed: false },
        scrubNP2: { name: 'ODP I. Fields', shift: '08:00 - 17:00', scrubbed: false }
      },
      alerts: 'Awaiting special equipment'
    },
    {
      theatre: 'DSU Theatre 13',
      specialty: 'Minor Procedures',
      session: '08:00 - 17:00',
      sessionsCount: 3,
      casesCompleted: 1,
      status: 'surgery_started',
      patientStatus: 'Surgery Started',
      currentProcedure: 'Skin Lesion Excision',
      surgeryStartTime: '09:05',
      estimatedFinish: '09:30',
      team: {
        surgeon: { name: 'J. Weaver', shift: '08:00 - 17:00' },
        assistant: { name: 'K. Mason', shift: '08:00 - 17:00' },
        anaesthetist: { name: 'L. Dixon ⚠️', shift: '08:00 - 17:00' },
        anaesNP: { name: 'M. Hunt', shift: '08:00 - 17:00' },
        scrubNP1: { name: 'RN N. Gibson', shift: '08:00 - 17:00', scrubbed: true, etf: '09:30' },
        scrubNP2: { name: 'ODP O. Marshall', shift: '08:00 - 17:00', scrubbed: false }
      },
      alerts: 'L. Dixon break overdue'
    },
    {
      theatre: 'DSU Theatre 14',
      specialty: 'Endoscopy',
      session: '08:00 - 17:00',
      sessionsCount: 4,
      casesCompleted: 2,
      status: 'surgery_started',
      patientStatus: 'Surgery Started',
      currentProcedure: 'Colonoscopy',
      surgeryStartTime: '09:25',
      estimatedFinish: '09:55',
      team: {
        surgeon: { name: 'P. Wagner', shift: '08:00 - 17:00' },
        assistant: { name: 'Q. Pearson', shift: '08:00 - 17:00' },
        anaesthetist: { name: 'R. Kelley', shift: '08:00 - 17:00' },
        anaesNP: { name: 'S. Dunn', shift: '08:00 - 17:00' },
        scrubNP1: { name: 'RN T. Oliver', shift: '08:00 - 17:00', scrubbed: true, etf: '09:55' },
        scrubNP2: { name: 'ODP U. Silva', shift: '08:00 - 17:00', scrubbed: false }
      }
    }
  ];

  // Recovery Area Data
  const recoveryBays = {
    mainTheatres: [
      {
        bayNumber: 1,
        occupied: true,
        patientArrivalTime: '09:45',
        fromTheatre: 'Main Theatre 1',
        specialty: 'Elective Orthopaedics',
        procedure: 'Total Hip Replacement',
        dischargeWard: 'Ward 7A - Orthopaedics',
        wardExtension: '2471',
        extensionNumber: '2450'
      },
      {
        bayNumber: 2,
        occupied: true,
        patientArrivalTime: '10:20',
        fromTheatre: 'Main Theatre 8',
        specialty: 'Gynaecology',
        procedure: 'Laparoscopic Hysterectomy',
        dischargeWard: 'Ward 4B - Gynae',
        wardExtension: '2384',
        extensionNumber: '2451'
      },
      {
        bayNumber: 3,
        occupied: false,
        extensionNumber: '2452'
      },
      {
        bayNumber: 4,
        occupied: true,
        patientArrivalTime: '08:30',
        fromTheatre: 'Main Theatre 6',
        specialty: 'Ophthalmology',
        procedure: 'Cataract Surgery',
        dischargeWard: 'Discharge Lounge',
        wardExtension: '2299',
        extensionNumber: '2453'
      },
      {
        bayNumber: 5,
        occupied: false,
        extensionNumber: '2454'
      },
      {
        bayNumber: 6,
        occupied: true,
        patientArrivalTime: '09:15',
        fromTheatre: 'Main Theatre 11',
        specialty: 'Vascular',
        procedure: 'AAA Repair - Obs',
        dischargeWard: 'ICU',
        wardExtension: '2500',
        extensionNumber: '2455'
      }
    ],
    acad: [
      {
        bayNumber: 1,
        occupied: true,
        patientArrivalTime: '09:30',
        fromTheatre: 'DSU Theatre 1',
        specialty: 'Paediatric Day Surgery',
        procedure: 'Hernia Repair',
        dischargeWard: 'Paediatric Ward',
        wardExtension: '2320',
        extensionNumber: '2460'
      },
      {
        bayNumber: 2,
        occupied: false,
        extensionNumber: '2461'
      },
      {
        bayNumber: 3,
        occupied: true,
        patientArrivalTime: '09:00',
        fromTheatre: 'DSU Theatre 4',
        specialty: 'General Day Surgery',
        procedure: 'Laparoscopic Cholecystectomy',
        dischargeWard: 'Discharge Lounge',
        wardExtension: '2299',
        extensionNumber: '2462'
      },
      {
        bayNumber: 4,
        occupied: false,
        extensionNumber: '2463'
      }
    ]
  };

  // Theatre extension numbers mapping
  const theatreExtensions: { [key: string]: string } = {
    'Main Theatre 1': '2401',
    'Main Theatre 2': '2402',
    'Main Theatre 3': '2403',
    'Main Theatre 4': '2404',
    'Main Theatre 5': '2405',
    'Main Theatre 6': '2406',
    'Main Theatre 7': '2407',
    'Main Theatre 8': '2408',
    'Main Theatre 9': '2409',
    'Main Theatre 10': '2410',
    'Main Theatre 11': '2411',
    'Main Theatre 12': '2412',
    'DSU Theatre 1': '2421',
    'DSU Theatre 2': '2422',
    'DSU Theatre 3': '2423',
    'DSU Theatre 4': '2424',
    'DSU Theatre 5': '2425',
    'DSU Theatre 6': '2426',
    'DSU Theatre 7': '2427',
    'DSU Theatre 8': '2428',
    'DSU Theatre 9': '2429',
    'DSU Theatre 10': '2430',
    'DSU Theatre 11': '2431',
    'DSU Theatre 12': '2432',
    'DSU Theatre 13': '2433',
    'DSU Theatre 14': '2434',
  };

  // Filter theatres based on selected unit
  const filteredTheatres = theatreAllocations.filter(theatre => {
    if (selectedUnit === 'all') return true;
    if (selectedUnit === 'main') return theatre.theatre.startsWith('Main Theatre');
    if (selectedUnit === 'acad') return theatre.theatre.startsWith('DSU Theatre');
    return false;
  });

  // Calculate KPI metrics based on selected unit
  const getTheatreStats = () => {
    if (selectedUnit === 'recovery') {
      return { running: 0, total: 0 };
    }
    const running = filteredTheatres.filter(t => t.status !== 'closed').length;
    const total = filteredTheatres.length;
    return { running, total };
  };

  const getStaffCount = () => {
    if (selectedUnit === 'recovery') {
      // Count recovery staff (for now return 0, will be updated when recovery staff data is added)
      return 0;
    }

    let staffCount = 0;
    filteredTheatres.forEach(theatre => {
      Object.values(theatre.team).forEach(staff => {
        if (staff && staff.name && staff.name !== 'VACANT') {
          staffCount++;
        }
      });
    });
    return staffCount;
  };

  const getStaffOnBreak = () => {
    if (selectedUnit === 'recovery') return 0;

    let onBreakCount = 0;
    filteredTheatres.forEach(theatre => {
      Object.values(theatre.team).forEach(staff => {
        if (staff && staff.name && staff.name.includes('☕')) {
          onBreakCount++;
        }
      });
    });
    return onBreakCount;
  };

  const getStaffDelayed = () => {
    if (selectedUnit === 'recovery') return 0;

    let delayedCount = 0;
    filteredTheatres.forEach(theatre => {
      Object.values(theatre.team).forEach(staff => {
        if (staff && staff.name && staff.name.includes('⚠️')) {
          delayedCount++;
        }
      });
    });
    return delayedCount;
  };

  const theatreStats = getTheatreStats();
  const staffCount = getStaffCount();
  const staffOnBreak = getStaffOnBreak();
  const staffDelayed = getStaffDelayed();

  return (
    <div className="p-2 lg:p-0">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        {/* Title */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Operations Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-900 mt-1">Real-time theatre management and monitoring</p>
            {/* Date and Time Display */}
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-2 text-gray-900">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{formatDateTime().date}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-900 mt-1 sm:mt-0">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-mono font-semibold">{formatDateTime().time}</span>
              </div>
            </div>
          </div>
          {/* Live Status Indicator */}
          <div className="flex items-center space-x-2 bg-green-500/20 px-2 sm:px-3 py-1 rounded-full flex-shrink-0">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] sm:text-sm text-green-700 font-medium">All Systems Operational</span>
          </div>
        </div>

        {/* Unit Filter Buttons - Stack on mobile, inline on desktop */}
        <div className="grid grid-cols-4 gap-2 sm:flex sm:gap-2 sm:justify-end">
          <button
            onClick={() => setSelectedUnit('all')}
            className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              selectedUnit === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            <span className="sm:hidden">All</span>
            <span className="hidden sm:inline">All Units</span>
          </button>
          <button
            onClick={() => setSelectedUnit('main')}
            className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              selectedUnit === 'main'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            <span className="sm:hidden">Main</span>
            <span className="hidden sm:inline">Main Theatres</span>
          </button>
          <button
            onClick={() => setSelectedUnit('acad')}
            className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              selectedUnit === 'acad'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            <span className="sm:hidden">DSU</span>
            <span className="hidden sm:inline">DSU Theatres</span>
          </button>
          <button
            onClick={() => setSelectedUnit('recovery')}
            className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              selectedUnit === 'recovery'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            <span className="sm:hidden">Recovery</span>
            <span className="hidden sm:inline">Recovery Areas</span>
          </button>
        </div>
      </div>

      {/* Key Performance Metrics - Clickable Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Theatres Operational Card */}
        <div
          onClick={() => setShowTheatreOpsModal(true)}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 p-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded font-medium">Live</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {selectedUnit === 'recovery' ? 'N/A' : `${theatreStats.running}/${theatreStats.total}`}
          </h3>
          <p className="text-sm text-gray-700 font-medium">Theatres Operational</p>
          {selectedUnit !== 'recovery' && theatreStats.total - theatreStats.running > 0 && (
            <p className="text-xs text-orange-600 mt-2 font-medium">
              ⚠ {theatreStats.total - theatreStats.running} theatre{theatreStats.total - theatreStats.running > 1 ? 's' : ''} closed
            </p>
          )}
          {selectedUnit !== 'recovery' && theatreStats.total - theatreStats.running === 0 && (
            <p className="text-xs text-green-600 mt-2 font-medium">✓ All theatres operational</p>
          )}
          {selectedUnit === 'recovery' && (
            <p className="text-xs text-gray-500 mt-2 font-medium">Recovery areas active</p>
          )}
          <p className="text-xs text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click for details →</p>
        </div>

        {/* Staff On Duty Card */}
        <div
          onClick={() => setShowStaffDutyModal(true)}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200 p-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded font-medium">
              {selectedUnit === 'recovery' ? 'Recovery' : 'Optimal'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{staffCount}</h3>
          <p className="text-sm text-gray-900 font-medium">Staff On Duty</p>
          {selectedUnit !== 'recovery' && (staffOnBreak > 0 || staffDelayed > 0) && (
            <p className="text-xs text-orange-600 mt-2 font-medium">
              {staffOnBreak > 0 && `${staffOnBreak} on break`}
              {staffOnBreak > 0 && staffDelayed > 0 && ' • '}
              {staffDelayed > 0 && `${staffDelayed} delayed`}
            </p>
          )}
          {selectedUnit !== 'recovery' && staffOnBreak === 0 && staffDelayed === 0 && staffCount > 0 && (
            <p className="text-xs text-green-600 mt-2 font-medium">✓ All staff active</p>
          )}
          {selectedUnit === 'recovery' && staffCount === 0 && (
            <p className="text-xs text-gray-500 mt-2 font-medium">Recovery staff tracking</p>
          )}
          <p className="text-xs text-green-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click for details →</p>
        </div>

        {/* Avg Turnover Time Card */}
        <div
          onClick={() => setShowTurnoverModal(true)}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200 p-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded font-medium">On Track</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">18 min</h3>
          <p className="text-sm text-gray-900 font-medium">Avg Turnover Time</p>
          <p className="text-xs text-green-600 mt-2 font-medium">↓ 5 min vs target (23 min)</p>
          <p className="text-xs text-purple-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click for details →</p>
        </div>

        {/* Efficiency Score Card */}
        <div
          onClick={() => setShowEfficiencyModal(true)}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200 p-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded font-medium">High</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">94%</h3>
          <p className="text-sm text-gray-900 font-medium">Efficiency Score</p>
          <p className="text-xs text-green-600 mt-2 font-medium">↑ 3% from yesterday</p>
          <p className="text-xs text-orange-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click for details →</p>
        </div>
      </div>

      {/* Theatre Team Allocations - Full Width */}
      {selectedUnit !== 'recovery' && (
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            {selectedUnit === 'all' && (
              <>
                <span className="lg:hidden">All Theatres</span>
                <span className="hidden lg:inline">All Theatre Operations</span>
              </>
            )}
            {selectedUnit === 'main' && (
              <>
                <span className="lg:hidden">Main Theatres</span>
                <span className="hidden lg:inline">Main Theatres Operations</span>
              </>
            )}
            {selectedUnit === 'acad' && (
              <>
                <span className="lg:hidden">DSU Theatres</span>
                <span className="hidden lg:inline">DSU Theatres Operations</span>
              </>
            )}
          </h2>
          <div className="text-xs font-normal text-gray-500 mb-4">
            {filteredTheatres.filter(t => t.status === 'surgery_started').length} Surgery Started, {filteredTheatres.filter(t => t.status === 'anaesthetic_room').length} Anaesthetic Room, {filteredTheatres.filter(t => t.status === 'patient_sent').length} Patient Sent, {filteredTheatres.filter(t => t.status === 'standby').length} Standby, {filteredTheatres.filter(t => t.status === 'closed').length} Closed
          </div>
          <div className="max-h-[600px] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
              {filteredTheatres.map((allocation, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg transition-colors cursor-pointer group border ${
                  allocation.status === 'closed'
                    ? 'bg-gray-100 border-gray-400 opacity-75'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => handleTheatreClick(allocation.theatre)}
              >
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <p
                      className="font-bold text-sm text-gray-900 flex items-center cursor-help"
                      title={`Extension: ${theatreExtensions[allocation.theatre] || 'N/A'}`}
                    >
                      {allocation.theatre}
                      <ChevronRight className="w-4 h-4 ml-1 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      allocation.status === 'surgery_started' ? 'bg-green-100 text-green-700' :
                      allocation.status === 'anaesthetic_room' ? 'bg-purple-100 text-purple-700' :
                      allocation.status === 'patient_sent' ? 'bg-blue-100 text-blue-700' :
                      allocation.status === 'standby' ? 'bg-gray-100 text-gray-600' :
                      allocation.status === 'closed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {allocation.patientStatus || (allocation.status === 'closed' ? '⛔ CLOSED' : allocation.status.toUpperCase())}
                    </span>
                  </div>
                  <p className="text-sm sm:text-xs text-gray-900 font-medium">{allocation.specialty}</p>
                  <p className="text-xs text-gray-900">
                    {allocation.session} {allocation.sessionsCount > 0 && `• ${allocation.sessionsCount} Session${allocation.sessionsCount > 1 ? 's' : ''}`}
                    {allocation.casesCompleted !== undefined && allocation.sessionsCount > 0 && (
                      <span className="ml-1 text-blue-600 font-medium">
                        • {allocation.casesCompleted}/{allocation.sessionsCount} completed
                      </span>
                    )}
                  </p>
                  {allocation.currentProcedure && allocation.status !== 'closed' && (
                    <p className="text-xs text-green-700 font-medium mt-1">
                      Ongoing: {allocation.currentProcedure}
                    </p>
                  )}
                  {allocation.nextCase && allocation.status !== 'closed' && (
                    <p className="text-xs text-blue-600 mt-0.5">
                      Next Case: {allocation.nextCase}
                    </p>
                  )}
                </div>
                <div className="space-y-1 text-xs">
                  {Object.entries({
                    'Cons': { ...allocation.team.surgeon, role: 'Consultant Surgeon', fullLabel: 'Consultant' },
                    'Assist': { ...allocation.team.assistant, role: 'Assistant Surgeon', fullLabel: 'Assistant' },
                    'Anaes': { ...allocation.team.anaesthetist, role: 'Anaesthetist', fullLabel: 'Anaesthetist' },
                    'Anaes N/P': { ...allocation.team.anaesNP, role: 'Anaesthetic Nurse/Practitioner', fullLabel: 'Anaes N/P' },
                    ...(allocation.team.anaesNP2 ? {'Anaes N/P 2': { ...allocation.team.anaesNP2, role: 'Anaesthetic Nurse/Practitioner', fullLabel: 'Anaes N/P 2' }} : {}),
                    'Scrub 1': { ...allocation.team.scrubNP1, role: 'Scrub Nurse/Practitioner', fullLabel: 'Scrub N/P 1' },
                    'Scrub 2': { ...allocation.team.scrubNP2, role: 'Scrub Nurse/Practitioner', fullLabel: 'Scrub N/P 2' },
                    ...(allocation.team.scrubNP3 ? {'Scrub 3': { ...allocation.team.scrubNP3, role: 'Scrub Nurse/Practitioner', fullLabel: 'Scrub N/P 3' }} : {}),
                    ...(allocation.team.hca ? {'HCA 1': { ...allocation.team.hca, role: 'Healthcare Assistant', fullLabel: 'HCA' }} : {}),
                    ...(allocation.team.techSpec ? {'Tech Spec': { ...allocation.team.techSpec, role: 'Technical Specialist', fullLabel: 'Tech Spec' }} : {})
                  }).map(([label, staff]) => {
                    // Add null check for staff object
                    if (!staff || !staff.name) {
                      return null;
                    }

                    const needsReliefHighlight = staff.shift && staff.shift.startsWith('08:00') && staff.shift.endsWith('20:00');

                    return (
                      <div key={label} className="group/staff">
                        {/* Single row layout for both mobile and desktop */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-1 min-w-0">
                            <span className={`text-[10px] mr-1 min-w-[70px] flex-shrink-0 ${staff.name === 'VACANT' ? 'text-gray-400' : 'text-gray-900'}`}>
                              <span className="lg:hidden">{label}:</span>
                              <span className="hidden lg:inline">{staff.fullLabel || label}:</span>
                            </span>
                            {staff.name === 'VACANT' ? (
                              <span className="text-gray-400 italic text-[10px]">Vacant</span>
                            ) : (
                              <div className="flex items-center gap-1 min-w-0">
                                <span
                                  className={`cursor-pointer hover:text-blue-600 hover:underline truncate text-[10px] ${
                                    needsReliefHighlight ? 'text-orange-600 font-semibold' : ''
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStaffClick(staff.name.replace(/[☕⚠️]/g, '').trim(), staff.role, allocation.theatre);
                                  }}
                                  onMouseEnter={(e) => handleStaffHover(e, staff.name.replace(/[☕⚠️]/g, '').trim(), staff.role)}
                                  onMouseLeave={() => setHoveredStaff(null)}
                                >
                                  {addStaffTitle(staff.name.replace(/[☕⚠️]/g, '').trim(), staff.role)}
                                </span>
                              {staff.scrubbed && (
                                <span
                                  className="italic text-[9px] text-gray-900 flex-shrink-0"
                                  title={
                                    staff.etf
                                      ? `ETF: Approx ${staff.etf} (${calculateDuration(allocation.surgeryStartTime || '08:00', staff.etf)} duration)${
                                          staff.relievedBy
                                            ? `\n\nRelieved by: ${staff.relievedBy}${staff.relievedFrom && staff.relievedFrom !== allocation.theatre ? ` (from ${staff.relievedFrom})` : ''}`
                                            : ''
                                        }`
                                      : 'Scrubbed in'
                                  }
                                >
                                  Scrubbed in
                                </span>
                              )}
                              {(staff.name.includes('☕') || staff.name.includes('⚠️')) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReliefRequest(staff.name.replace(/[☕⚠️]/g, '').trim(), staff.role, allocation.theatre);
                                  }}
                                  className="flex-shrink-0"
                                  title="Urgent: Staff needs relief"
                                >
                                  <Bell className="w-3 h-3 text-orange-500 hover:text-orange-600 fill-orange-200 animate-[wiggle_1s_ease-in-out_infinite]" />
                                </button>
                              )}
                            </div>
                          )}
                          </div>
                          {staff.shift && staff.name !== 'VACANT' && (
                            <span className={`text-xs sm:text-[9px] text-gray-900 sm:ml-1 flex-shrink-0 ${
                              needsReliefHighlight ? 'text-orange-500 font-medium' : ''
                            }`}>
                              {staff.shift}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }).filter(Boolean)}
                </div>
                {allocation.alerts && (
                  <div className={`mt-2 text-xs px-2 py-1 rounded ${
                    allocation.status === 'closed'
                      ? 'text-red-700 bg-red-50 font-medium'
                      : 'text-orange-600 bg-orange-50'
                  }`}>
                    {allocation.status === 'closed' ? '⛔' : '⚠️'} {allocation.alerts}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Recovery Areas */}
      {selectedUnit === 'recovery' && (
        <div className="space-y-6">
          {/* Main Theatres Recovery */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Main Theatres Recovery ({recoveryBays.mainTheatres.filter(b => b.occupied).length}/{recoveryBays.mainTheatres.length} Bays Occupied)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recoveryBays.mainTheatres.map((bay) => (
                <div
                  key={bay.bayNumber}
                  className={`p-3 rounded-lg border-2 ${
                    bay.occupied
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  title={`Extension: ${bay.extensionNumber}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm">Bay {bay.bayNumber}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      bay.occupied ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {bay.occupied ? 'Occupied' : 'Available'}
                    </span>
                  </div>
                  {bay.occupied ? (
                    <div className="space-y-1 text-xs">
                      <p className="text-gray-600">
                        <span className="font-medium">Arrived:</span> {bay.patientArrivalTime}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">From:</span> {bay.fromTheatre}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Specialty:</span> {bay.specialty}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Procedure:</span> {bay.procedure}
                      </p>
                      <p
                        className="text-blue-600 font-medium cursor-help"
                        title={`Ward Extension: ${bay.wardExtension}`}
                      >
                        <span className="text-gray-600 font-normal">To:</span> {bay.dischargeWard}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Bay available</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DSU Recovery */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              DSU Theatres Recovery ({recoveryBays.acad.filter(b => b.occupied).length}/{recoveryBays.acad.length} Bays Occupied)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {recoveryBays.acad.map((bay) => (
                <div
                  key={bay.bayNumber}
                  className={`p-3 rounded-lg border-2 ${
                    bay.occupied
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  title={`Extension: ${bay.extensionNumber}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm">Bay {bay.bayNumber}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      bay.occupied ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {bay.occupied ? 'Occupied' : 'Available'}
                    </span>
                  </div>
                  {bay.occupied ? (
                    <div className="space-y-1 text-xs">
                      <p className="text-gray-600">
                        <span className="font-medium">Arrived:</span> {bay.patientArrivalTime}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">From:</span> {bay.fromTheatre}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Specialty:</span> {bay.specialty}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Procedure:</span> {bay.procedure}
                      </p>
                      <p
                        className="text-green-600 font-medium cursor-help"
                        title={`Ward Extension: ${bay.wardExtension}`}
                      >
                        <span className="text-gray-600 font-normal">To:</span> {bay.dischargeWard}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Bay available</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Alerts */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            Critical Alerts
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex items-start">
                <XCircle className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Theatre Closures</p>
                  <p className="text-xs text-red-700 mt-1">Theatre 2 - Unpopulated list</p>
                  <p className="text-xs text-red-700">Theatre 9 - Equipment failure & staff shortage</p>
                  <p className="text-xs text-red-600 mt-2">Action: Cases rescheduled, maintenance notified</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex items-start">
                <XCircle className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Low Inventory Alert</p>
                  <p className="text-xs text-red-700 mt-1">Hip implants (size L) - Only 2 units remaining</p>
                  <p className="text-xs text-red-600 mt-2">Action: Order placed, ETA 2 hours</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <div className="flex items-start">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Staff Shortage Warning</p>
                  <p className="text-xs text-yellow-700 mt-1">Night shift - 1 scrub nurse short</p>
                  <p className="text-xs text-yellow-600 mt-2">Action: Agency staff requested</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">Issue Resolved</p>
                  <p className="text-xs text-green-700 mt-1">Theatre 2 HVAC system restored</p>
                  <p className="text-xs text-green-600 mt-2">Resolved 10 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Cases */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-600" />
            Upcoming Cases
          </h2>
          <div className="space-y-3">
            {[
              { time: '14:00', procedure: 'Total Knee Replacement', surgeon: 'Mr. Johnson', theatre: 'Theatre 1', duration: '2h' },
              { time: '14:30', procedure: 'Cholecystectomy', surgeon: 'Ms. Chen', theatre: 'Theatre 2', duration: '1h 30m' },
              { time: '15:00', procedure: 'Cataract Surgery', surgeon: 'Dr. Patel', theatre: 'Theatre 4', duration: '45m' },
              { time: '16:00', procedure: 'Hernia Repair', surgeon: 'Mr. Williams', theatre: 'Theatre 2', duration: '1h' },
              { time: '16:30', procedure: 'Carpal Tunnel Release', surgeon: 'Ms. Brown', theatre: 'Theatre 5', duration: '30m' },
            ].map((caseItem, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Start</p>
                    <p className="font-bold text-sm">{caseItem.time}</p>
                  </div>
                  <div className="border-l pl-3">
                    <p className="font-medium text-sm">{caseItem.procedure}</p>
                    <p className="text-xs text-gray-600">{caseItem.surgeon} • {caseItem.theatre}</p>
                  </div>
                </div>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">{caseItem.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Equipment Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-green-600" />
            Critical Equipment Status
          </h2>
          <div className="space-y-3">
            {[
              { item: 'Anaesthesia Machines', available: 26, total: 30, status: 'good' },
              { item: 'C-Arms', available: 8, total: 10, status: 'good' },
              { item: 'Laparoscopic Towers', available: 12, total: 15, status: 'good' },
              { item: 'Microscopes', available: 5, total: 8, status: 'limited' },
              { item: 'Da Vinci Robots', available: 2, total: 2, status: 'optimal' },
              { item: 'Hybrid Lab Equipment', available: 1, total: 1, status: 'optimal' },
            ].map((equipment, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm">{equipment.item}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">{equipment.available}/{equipment.total}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    equipment.status === 'optimal' ? 'bg-green-100 text-green-700' :
                    equipment.status === 'good' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {equipment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <TheatreTimelineModal
        isOpen={showTimeline}
        onClose={() => {
          setShowTimeline(false);
          setSelectedTheatre(null);
        }}
        theatre={selectedTheatre || ''}
      />

      {/* Staff Relief Request Modal */}
      <StaffReliefModal
        isOpen={showReliefModal}
        onClose={() => {
          setShowReliefModal(false);
          setSelectedStaffForRelief(null);
        }}
        staffMember={selectedStaffForRelief}
      />

      {/* Staff Hover Card */}
      <StaffHoverCard
        staff={hoveredStaff}
        visible={!!hoveredStaff}
        position={hoverPosition}
      />

      {/* Staff Competency Modal */}
      <StaffCompetencyModal
        isOpen={showCompetencyModal}
        onClose={() => {
          setShowCompetencyModal(false);
          setSelectedStaffForCompetency(null);
        }}
        staff={selectedStaffForCompetency}
      />

      {/* Theatre Operations Modal */}
      <TheatreOpsModal
        isOpen={showTheatreOpsModal}
        onClose={() => setShowTheatreOpsModal(false)}
        selectedUnit={selectedUnit}
      />

      {/* Staff Duty Modal */}
      <StaffDutyModal
        isOpen={showStaffDutyModal}
        onClose={() => setShowStaffDutyModal(false)}
        onNavigateToRoster={() => {
          // TODO: Navigate to Staff Roster tab when tab navigation is implemented
          setShowStaffDutyModal(false);
          console.log('Navigate to Staff Roster tab');
        }}
        selectedUnit={selectedUnit}
      />

      {/* Turnover Time Modal */}
      <TurnoverTimeModal
        isOpen={showTurnoverModal}
        onClose={() => setShowTurnoverModal(false)}
      />

      {/* Efficiency Score Modal */}
      <EfficiencyScoreModal
        isOpen={showEfficiencyModal}
        onClose={() => setShowEfficiencyModal(false)}
      />
    </div>
  );
}