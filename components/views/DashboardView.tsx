"use client";

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  Clock,
  TrendingUp,
  Calendar,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

import TheatreTimelineModal from './TheatreTimelineModal';
import StaffReliefModal from './StaffReliefModal';
import StaffHoverCard from './StaffHoverCard';
import StaffCompetencyModal from './StaffCompetencyModal';
import StaffInfoMobileModal from './StaffInfoMobileModal';
import TheatreOpsModal from './TheatreOpsModal';
import StaffDutyModal from './StaffDutyModal';
import TurnoverTimeModal from './TurnoverTimeModal';
import EfficiencyScoreModal from './EfficiencyScoreModal';
import { Bell } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function DashboardView() {
  const [selectedTheatre, setSelectedTheatre] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showReliefModal, setShowReliefModal] = useState(false);
  const [selectedStaffForRelief, setSelectedStaffForRelief] = useState<any>(null);
  const [hoveredStaff, setHoveredStaff] = useState<any>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [showCompetencyModal, setShowCompetencyModal] = useState(false);
  const [selectedStaffForCompetency, setSelectedStaffForCompetency] = useState<any>(null);
  const [showMobileStaffInfo, setShowMobileStaffInfo] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<'all' | 'main' | 'acad' | 'recovery'>('all');
  const [showTheatreOpsModal, setShowTheatreOpsModal] = useState(false);
  const [showStaffDutyModal, setShowStaffDutyModal] = useState(false);
  const [showTurnoverModal, setShowTurnoverModal] = useState(false);
  const [showEfficiencyModal, setShowEfficiencyModal] = useState(false);
  const [theatreAllocations, setTheatreAllocations] = useState<any[]>([]);
  const [isLoadingAllocations, setIsLoadingAllocations] = useState(true);

  // --- Date helpers ---
  const makeDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const [selectedDate, setSelectedDate] = useState<string>(() => makeDateStr(new Date()));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const isTodaySelected = selectedDate === makeDateStr(new Date());

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Relative date label: Today / Yesterday / N days ago / In N days
  const relativeDateLabel = () => {
    const today = new Date();
    const sel = new Date(selectedDate + 'T00:00:00');
    const diffDays = Math.round((sel.getTime() - new Date(makeDateStr(today) + 'T00:00:00').getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  useEffect(() => {
    const fetchTheatreAllocations = async () => {
      if (!db) {
        console.warn('Firestore not initialized - using demo data');
        setIsLoadingAllocations(false);
        return;
      }
      try {
        const q = query(collection(db, 'theatreAllocations'), where('date', '==', selectedDate));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        data.sort((a: any, b: any) => a.theatreNumber - b.theatreNumber);

        const mapped = data.map((alloc: any) => ({
          theatre: alloc.theatreName,
          unit: alloc.unit,
          specialty: 'General Surgery',
          session: alloc.sessionType ? `${alloc.sessionType.startTime} - ${alloc.sessionType.endTime}` : '08:00 - 20:00',
          sessionsCount: alloc.sessionType?.sessionCount || 0,
          casesCompleted: alloc.status === 'in-use' ? 1 : 0,
          status: alloc.status === 'in-use' ? 'surgery_started' : alloc.status,
          patientStatus: alloc.status === 'in-use' ? 'Surgery Started' : alloc.status === 'ready' ? 'Ready' : 'CLOSED',
          currentProcedure: alloc.status === 'in-use' ? 'Surgery in Progress' : '',
          nextCase: alloc.status === 'ready' ? 'Next Case Scheduled' : '',
          surgeryStartTime: alloc.status === 'in-use' ? '08:50' : '',
          estimatedFinish: alloc.status === 'in-use' ? '10:30' : '',
          reliefRequired: alloc.reliefRequired || false,
          team: {
            surgeon: { name: alloc.team?.surgeon?.name || 'VACANT', shift: alloc.team?.surgeon?.shift || '' },
            assistant: { name: alloc.team?.assistant?.name || 'VACANT', shift: alloc.team?.assistant?.shift || '' },
            anaesthetist: { name: alloc.team?.anaesthetist?.name || 'VACANT', shift: alloc.team?.anaesthetist?.shift || '' },
            anaesNP: { name: alloc.team?.anaesNP?.name || 'VACANT', shift: alloc.team?.anaesNP?.shift || '' },
            scrubNP1: { name: alloc.team?.scrubNP1?.name || 'VACANT', shift: alloc.team?.scrubNP1?.shift || '', scrubbed: alloc.team?.scrubNP1?.scrubbed || false, etf: alloc.team?.scrubNP1?.scrubbed ? '10:30' : undefined },
            scrubNP2: { name: alloc.team?.scrubNP2?.name || 'VACANT', shift: alloc.team?.scrubNP2?.shift || '' },
            hca: { name: alloc.team?.hca?.name || 'VACANT', shift: alloc.team?.hca?.shift || '' }
          },
          alerts: alloc.status === 'closed' ? 'THEATRE CLOSED - No cases scheduled' : ''
        }));

        setTheatreAllocations(mapped);
        setIsLoadingAllocations(false);
      } catch (e) {
        console.error('Error fetching theatre allocations:', e);
        setIsLoadingAllocations(false);
      }
    };
    fetchTheatreAllocations();
  }, [selectedDate]);

  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(makeDateStr(d));
  };
  const goToToday = () => setSelectedDate(makeDateStr(new Date()));

  const formatTime = () => {
    if (!mounted) return '00:00:00';
    return currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // ——— Titles helper (with HCA rule) ———
  const addStaffTitle = (name: string, role: string): string => {
    if (!name || name === 'VACANT') return name;
    const stripped = name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|RN|ODP|HCA)\s+/i, '').trim();
    if (/healthcare assistant/i.test(role) || /^hca\b/i.test(role)) {
      return `HCA ${stripped}`;
    }
    if (/^(Mr\.|Mrs\.|Ms\.|Dr\.|RN|ODP)\s+/i.test(name)) return name;
    if (/Consultant|Assistant/i.test(role)) return `Mr. ${stripped}`;
    if (/Anaesthetist/i.test(role)) return `Dr. ${stripped}`;
    if (/Nurse|Practitioner/i.test(role)) return `RN ${stripped}`;
    return stripped;
  };

  const handleTheatreClick = (theatreName: string) => {
    setSelectedTheatre(theatreName);
    setShowTimeline(true);
  };
  const handleReliefRequest = (staffName: string, role: string, theatre: string) => {
    setSelectedStaffForRelief({ name: staffName, role, theatre });
    setShowReliefModal(true);
  };
  const handleStaffHover = (e: React.MouseEvent, staffName: string, role: string) => {
    setHoveredStaff({ name: staffName, role, id: staffName });
    setHoverPosition({ x: e.clientX, y: e.clientY });
  };
  const handleStaffClick = (staffName: string, role: string, theatre: string) => {
    setSelectedStaffForCompetency({ name: staffName, role, theatre });
    if (window.innerWidth < 1024) setShowMobileStaffInfo(true); else setShowCompetencyModal(true);
  };

  const filteredTheatres = theatreAllocations.filter(t => {
    if (selectedUnit === 'all') return true;
    if (selectedUnit === 'main') return t.unit === 'main';
    if (selectedUnit === 'acad') return t.unit === 'acad';
    return false;
  });

  const theatreStats = {
    running: selectedUnit === 'recovery' ? 0 : filteredTheatres.filter(t => t.status !== 'closed').length,
    total: selectedUnit === 'recovery' ? 0 : filteredTheatres.length
  };
  const staffCount = selectedUnit === 'recovery'
    ? 0
    : filteredTheatres.reduce((n, th) => n + Object.values(th.team).filter((s: any) => s && s.name && s.name !== 'VACANT').length, 0);

  const calculateDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return '';
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    if (h > 0 && m > 0) return `${h}h ${m}min`;
    if (h > 0) return `${h}h`;
    return `${m}min`;
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      {/* content container aligned with header; wide enough so names fit */}
      <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-4 lg:px-6">
        {/* Top bar */}
        <div className="border-b border-gray-200 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
              <button onClick={() => changeDate(-1)} className="p-1 hover:bg-white rounded" title="Previous day">
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              <div className="flex items-center gap-2 px-2" suppressHydrationWarning>
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <div className="flex flex-col sm:flex-row sm:items-end sm:gap-2">
                  <span className="text-xs sm:text-2xl font-semibold text-gray-700 leading-tight">
                    {new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-[10px] sm:text-sm text-gray-500 leading-tight">{relativeDateLabel()}</span>
                </div>
              </div>
              <button onClick={() => changeDate(1)} className="p-1 hover:bg-white rounded" title="Next day">
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {!isTodaySelected ? (
              <button onClick={goToToday} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                Go to Today
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs sm:text-xl text-gray-600" suppressHydrationWarning>
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <span className="font-mono font-medium sm:font-bold">{formatTime()}</span>
              </div>
            )}
          </div>

          {/* Removed the Live/Not live pill per request */}
          <div />
        </div>

        {/* Unit filters */}
        <div className="border-b border-gray-200 py-2">
          <div className="grid grid-cols-4 gap-2">
            {(['all','main','acad','recovery'] as const).map(k => (
              <button
                key={k}
                onClick={() => setSelectedUnit(k)}
                className={`px-2 py-2 sm:px-6 sm:py-3 rounded-md text-xs sm:text-base font-semibold transition-all ${
                  selectedUnit === k ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 border border-gray-300'
                }`}
              >
                {k === 'all' ? 'All' : k === 'main' ? 'Main' : k === 'acad' ? 'DSU' : 'Rec'}
              </button>
            ))}
          </div>
        </div>

        {/* KPIs – now clickable */}
        <div className="py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Theatres */}
            <button
              type="button"
              onClick={() => setShowTheatreOpsModal(true)}
              className="text-left bg-blue-50 border border-blue-200 p-3 sm:p-6 rounded-lg hover:shadow-md hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
              aria-label="Open theatres operational details"
            >
              <div className="flex items-center justify-between mb-1 sm:mb-3">
                <Activity className="w-5 h-5 text-blue-600" />
                {/* removed secondary Live chip to avoid duplication */}
              </div>
              <h3 className="text-xl sm:text-4xl font-bold text-gray-900">
                {selectedUnit === 'recovery' ? 'N/A' : `${theatreStats.running}/${theatreStats.total}`}
              </h3>
              <p className="text-gray-700 font-semibold mt-1 sm:mt-2 text-sm sm:text-base">Theatres</p>
            </button>

            {/* Staff */}
            <button
              type="button"
              onClick={() => setShowStaffDutyModal(true)}
              className="text-left bg-green-50 border border-green-200 p-3 sm:p-6 rounded-lg hover:shadow-md hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
              aria-label="Open staff-on-duty details"
            >
              <div className="flex items-center justify-between mb-1 sm:mb-3">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl sm:text-4xl font-bold text-gray-900">{staffCount}</h3>
              <p className="text-gray-700 font-semibold mt-1 sm:mt-2 text-sm sm:text-base">Staff</p>
            </button>

            {/* Turnover */}
            <button
              type="button"
              onClick={() => setShowTurnoverModal(true)}
              className="text-left bg-purple-50 border border-purple-200 p-3 sm:p-6 rounded-lg hover:shadow-md hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
              aria-label="Open turnover time details"
            >
              <div className="flex items-center justify-between mb-1 sm:mb-3">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-xl sm:text-4xl font-bold text-gray-900">18m</h3>
              <p className="text-gray-700 font-semibold mt-1 sm:mt-2 text-sm sm:text-base">Turnover</p>
            </button>

            {/* Efficiency */}
            <button
              type="button"
              onClick={() => setShowEfficiencyModal(true)}
              className="text-left bg-orange-50 border border-orange-200 p-3 sm:p-6 rounded-lg hover:shadow-md hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
              aria-label="Open efficiency score details"
            >
              <div className="flex items-center justify-between mb-1 sm:mb-3">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-xl sm:text-4xl font-bold text-gray-900">94%</h3>
              <p className="text-gray-700 font-semibold mt-1 sm:mt-2 text-sm sm:text-base">Efficiency</p>
            </button>
          </div>
        </div>

        {/* Main content – one panel on mobile; two on desktop */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* LEFT */}
          <div className="w-full md:flex-1">
            {selectedUnit !== 'recovery' && (
              <section className="border-t md:border-t-0 md:border-r border-gray-200">
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {selectedUnit === 'all' ? 'All Theatres' : selectedUnit === 'main' ? 'Main Theatres' : 'DSU Theatres'}
                    </h2>
                  </div>
                  {/* Removed Live / Not live pill per request */}
                </div>

                <div className="max-h[640px] md:max-h-[640px] overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTheatres.map((allocation, idx) => (
                      <div
                        key={idx}
                        className={`p-4 sm:p-5 border border-gray-200 ${idx % 3 !== 2 ? 'lg:border-r' : ''} ${idx >= 1 ? 'border-t' : ''} cursor-pointer hover:bg-teal-50/30`}
                        onClick={() => handleTheatreClick(allocation.theatre)}
                      >
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-bold text-base sm:text-lg text-gray-900 flex items-center">
                              {allocation.theatre}
                              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 text-gray-400" />
                            </p>
                            <span
                              className={`text-xs sm:text-sm px-2 py-1 rounded font-bold ${
                                allocation.status === 'surgery_started'
                                  ? 'bg-green-100 text-green-700'
                                  : allocation.status === 'anaesthetic_room'
                                  ? 'bg-purple-100 text-purple-700'
                                  : allocation.status === 'patient_sent'
                                  ? 'bg-blue-100 text-blue-700'
                                  : allocation.status === 'standby'
                                  ? 'bg-gray-100 text-gray-600'
                                  : allocation.status === 'closed'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {allocation.status === 'surgery_started' ? 'SURG'
                                : allocation.status === 'anaesthetic_room' ? 'ANAES'
                                : allocation.status === 'patient_sent' ? 'SENT'
                                : allocation.status === 'standby' ? 'STBY'
                                : allocation.status === 'closed' ? 'CLSD' : 'OTHER'}
                            </span>
                          </div>
                          <p className="text-sm sm:text-base text-gray-700 font-semibold mb-1">{allocation.specialty}</p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {allocation.session}
                            {allocation.sessionsCount > 0 && ` • ${allocation.casesCompleted || 0}/${allocation.sessionsCount}`}
                          </p>
                        </div>

                        <div className="space-y-1 sm:space-y-1.5">
                          {Object.entries({
                            'Cons': { ...allocation.team.surgeon, role: 'Consultant Surgeon', fullLabel: 'Consultant' },
                            'Assist': { ...allocation.team.assistant, role: 'Assistant Surgeon', fullLabel: 'Assistant' },
                            'Anaes': { ...allocation.team.anaesthetist, role: 'Anaesthetist', fullLabel: 'Anaesthetist' },
                            'Anaes N/P': { ...allocation.team.anaesNP, role: 'Anaesthetic Nurse/Practitioner', fullLabel: 'Anaes N/P' },
                            'Scrub 1': { ...allocation.team.scrubNP1, role: 'Scrub Nurse/Practitioner', fullLabel: 'Scrub N/P 1' },
                            'Scrub 2': { ...allocation.team.scrubNP2, role: 'Scrub Nurse/Practitioner', fullLabel: 'Scrub N/P 2' },
                            ...(allocation.team.hca ? { 'HCA 1': { ...allocation.team.hca, role: 'Healthcare Assistant', fullLabel: 'HCA' } } : {})
                          } as Record<string, any>).map(([label, staff]) => {
                            if (!staff || !staff.name) return null;
                            const needsReliefHighlight = staff.shift && staff.shift.startsWith('08:00') && staff.shift.endsWith('20:00');
                            return (
                              <div key={label} className="flex items-center justify-between">
                                <div className="flex items-center flex-1 min-w-0">
                                  <span className={`text-[10px] sm:text-sm mr-2 min-w-[66px] sm:min-w-[100px] font-semibold ${staff.name === 'VACANT' ? 'text-gray-400' : 'text-gray-700'}`}>
                                    <span className="lg:hidden">{label}:</span>
                                    <span className="hidden lg:inline">{staff.fullLabel || label}:</span>
                                  </span>
                                  {staff.name === 'VACANT' ? (
                                    <span className="text-gray-400 italic text-[10px] sm:text-sm">Vacant</span>
                                  ) : (
                                    <div className="flex items-center gap-1 min-w-0 flex-wrap">
                                      <span
                                        className={`cursor-pointer text-blue-600 hover:underline font-medium text-[10px] sm:text-sm ${needsReliefHighlight ? 'text-orange-600 font-bold' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); handleStaffClick(staff.name.replace(/[☕⚠️]/g, '').trim(), staff.role, allocation.theatre); }}
                                        onMouseEnter={(e) => handleStaffHover(e, staff.name.replace(/[☕⚠️]/g, '').trim(), staff.role)}
                                        onMouseLeave={() => setHoveredStaff(null)}
                                      >
                                        {addStaffTitle(staff.name.replace(/[☕⚠️]/g, '').trim(), staff.role)}
                                      </span>
                                      {staff.scrubbed && (
                                        <span
                                          className="italic text-[9px] sm:text-xs text-teal-700 bg-teal-50 px-1 py-0.5 rounded"
                                          title={allocation.surgeryStartTime && staff.etf ? `ETF: ${staff.etf} (${calculateDuration(allocation.surgeryStartTime, staff.etf)})` : 'Scrubbed in'}
                                        >
                                          Scrubbed in
                                        </span>
                                      )}
                                      {(staff.name.includes('☕') || staff.name.includes('⚠️')) && (
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleReliefRequest(staff.name.replace(/[☕⚠️]/g, '').trim(), staff.role, allocation.theatre); }}
                                          className="flex-shrink-0"
                                          title="Urgent: Staff needs relief"
                                        >
                                          <Bell className="w-3 h-3 text-orange-500 fill-orange-200" />
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                                {staff.shift && staff.name !== 'VACANT' && (
                                  <span className={`text-[9px] sm:text-xs text-gray-700 ml-2 ${needsReliefHighlight ? 'bg-orange-50 text-orange-700 font-bold' : 'bg-gray-100'} px-1.5 py-0.5 rounded`}>
                                    {staff.shift}
                                  </span>
                                )}
                              </div>
                            );
                          }).filter(Boolean)}
                        </div>

                        {allocation.alerts && (
                          <div className={`mt-2 text-xs px-2 py-1 rounded ${allocation.status === 'closed' ? 'text-red-700 bg-red-50 font-medium' : 'text-orange-600 bg-orange-50'}`}>
                            {allocation.status === 'closed' ? '⛔' : '⚠️'} {allocation.alerts}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {selectedUnit === 'recovery' && (
              <section className="border-t border-gray-200 p-4">
                <p className="text-sm text-gray-600">Recovery view…</p>
              </section>
            )}
          </div>

          {/* RIGHT column – kept for desktop; hidden on mobile */}
          <aside className="hidden md:block md:w-[35%]">
            {/* Right-hand panels could go here */}
          </aside>
        </div>
      </div>

      {/* Modals */}
      <TheatreTimelineModal
        isOpen={showTimeline}
        onClose={() => { setShowTimeline(false); setSelectedTheatre(null); }}
        theatre={selectedTheatre || ''} />
      <StaffReliefModal
        isOpen={showReliefModal}
        onClose={() => { setShowReliefModal(false); setSelectedStaffForRelief(null); }}
        staffMember={selectedStaffForRelief} />
      <StaffHoverCard staff={hoveredStaff} visible={!!hoveredStaff} position={hoverPosition} />
      <StaffCompetencyModal
        isOpen={showCompetencyModal}
        onClose={() => { setShowCompetencyModal(false); setSelectedStaffForCompetency(null); }}
        staff={selectedStaffForCompetency} />
      <StaffInfoMobileModal
        isOpen={showMobileStaffInfo}
        onClose={() => setShowMobileStaffInfo(false)}
        staff={selectedStaffForCompetency}
        onViewFullProfile={() => { setShowMobileStaffInfo(false); setShowCompetencyModal(true); }} />
      <TheatreOpsModal isOpen={showTheatreOpsModal} onClose={() => setShowTheatreOpsModal(false)} selectedUnit={selectedUnit} />
      <StaffDutyModal
        isOpen={showStaffDutyModal}
        onClose={() => setShowStaffDutyModal(false)}
        onNavigateToRoster={() => { setShowStaffDutyModal(false); console.log('Navigate to Staff Roster tab'); }}
        selectedUnit={selectedUnit} />
      <TurnoverTimeModal isOpen={showTurnoverModal} onClose={() => setShowTurnoverModal(false)} />
      <EfficiencyScoreModal isOpen={showEfficiencyModal} onClose={() => setShowEfficiencyModal(false)} />
    </div>
  );
}