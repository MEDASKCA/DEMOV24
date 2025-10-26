'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  User,
  FileText,
  TrendingUp,
  Activity,
  UserCheck,
  UserX
} from 'lucide-react';

interface StaffDutyViewProps {
  onBack: () => void;
  onNavigateToRoster?: () => void;
  selectedUnit?: 'all' | 'main' | 'acad' | 'recovery';
}

type ViewMode = 'sick' | 'late' | 'vacant';

export default function StaffDutyView({ onBack, onNavigateToRoster, selectedUnit = 'all' }: StaffDutyViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('sick');

  const staffSummary = {
    totalOnDuty: 156,
    onBreak: 7,
    arrivingLate: 3,
    sickToday: 5,
    vacantShifts: {
      tomorrow: 2,
      next7Days: 8
    }
  };

  const sickStaff = [
    {
      name: 'RN S. Williams',
      role: 'Scrub N/P',
      department: 'Main Theatres',
      reason: 'Flu symptoms',
      startDate: '2024-10-21',
      expectedReturn: '2024-10-23',
      episodes: 2,
      lastSickness: '2024-09-15 - Cold (3 days)',
      status: 'covered',
      coverBy: 'RN K. Martinez (Bank Staff)',
      shiftsCovered: ['Main Theatre 3: 08:00-18:00']
    },
    {
      name: 'ODP M. Johnson',
      role: 'Anaes N/P',
      department: 'DSU Theatres',
      reason: 'Migraine',
      startDate: '2024-10-21',
      expectedReturn: '2024-10-21',
      episodes: 1,
      lastSickness: '2024-08-10 - Stomach bug (2 days)',
      status: 'covered',
      coverBy: 'ODP R. Thompson (Internal)',
      shiftsCovered: ['DSU Theatre 5: 08:00-18:00']
    },
    {
      name: 'Dr. A. Patel',
      role: 'Anaesthetist',
      department: 'Anaesthetics',
      reason: 'Family emergency',
      startDate: '2024-10-21',
      expectedReturn: '2024-10-22',
      episodes: 0,
      lastSickness: 'None this year',
      status: 'covered',
      coverBy: 'Dr. S. Kumar (Locum)',
      shiftsCovered: ['Main Theatre 6: 08:00-18:00', 'DSU Theatre 2: 08:00-18:00']
    },
    {
      name: 'HCA T. Brown',
      role: 'Healthcare Assistant',
      department: 'Main Theatres',
      reason: 'Back pain',
      startDate: '2024-10-20',
      expectedReturn: '2024-10-22',
      episodes: 3,
      lastSickness: '2024-09-05 - Back pain (2 days)',
      status: 'gap',
      shiftsCovered: []
    },
    {
      name: 'RN D. Garcia',
      role: 'Recovery Nurse',
      department: 'Recovery',
      reason: 'Covid-19',
      startDate: '2024-10-19',
      expectedReturn: '2024-10-26',
      episodes: 1,
      lastSickness: 'None',
      status: 'gap',
      shiftsCovered: []
    }
  ];

  const arrivingLate = [
    {
      name: 'Dr. F. James',
      role: 'Consultant Anaesthetist',
      assignedTo: 'Main Theatre 1',
      scheduledStart: '08:00',
      expectedArrival: '09:15',
      reason: 'Managing emergency in Theatre 5',
      cover: 'Dr. S. Patel (Locum) - confirmed',
      impact: 'No delay - covered'
    },
    {
      name: 'J. Smith',
      role: 'Consultant Surgeon',
      assignedTo: 'Main Theatre 4',
      scheduledStart: '08:00',
      expectedArrival: '08:30',
      reason: 'Traffic delay - M1 accident',
      cover: 'Surgical Registrar ready to prep',
      impact: 'Minor delay - 15 min'
    },
    {
      name: 'RN L. Anderson',
      role: 'Scrub N/P',
      assignedTo: 'DSU Theatre 8',
      scheduledStart: '08:00',
      expectedArrival: '07:45',
      reason: 'Childcare issue',
      cover: 'ODP M. Wilson covering',
      impact: 'No delay - covered'
    }
  ];

  const vacantShifts = [
    {
      date: 'Tomorrow (22 Oct)',
      shifts: [
        { role: 'Anaes N/P', department: 'Main Theatre 5', time: '08:00-18:00', priority: 'urgent', availableCover: 3 },
        { role: 'Scrub N/P', department: 'DSU Theatre 3', time: '12:00-20:00', priority: 'high', availableCover: 5 }
      ]
    },
    {
      date: '23 Oct',
      shifts: [
        { role: 'HCA', department: 'Main Theatre 1', time: '08:00-16:00', priority: 'medium', availableCover: 8 },
        { role: 'Anaes N/P', department: 'DSU Theatre 7', time: '08:00-18:00', priority: 'high', availableCover: 2 }
      ]
    },
    {
      date: '24 Oct',
      shifts: [
        { role: 'Scrub N/P', department: 'Main Theatre 9', time: '08:00-18:00', priority: 'medium', availableCover: 6 },
        { role: 'Recovery Nurse', department: 'Main Recovery', time: '13:00-21:00', priority: 'urgent', availableCover: 1 }
      ]
    }
  ];

  const filteredSickStaff = sickStaff.filter(staff => {
    if (selectedUnit === 'all') return true;
    if (selectedUnit === 'recovery') return staff.department === 'Recovery';
    if (selectedUnit === 'main') return staff.department === 'Main Theatres' || staff.department === 'Anaesthetics';
    if (selectedUnit === 'acad') return staff.department === 'DSU Theatres';
    return true;
  });

  const filteredArrivingLate = arrivingLate.filter(staff => {
    if (selectedUnit === 'all') return true;
    if (selectedUnit === 'recovery') return staff.assignedTo?.includes('Recovery');
    if (selectedUnit === 'main') return staff.assignedTo?.startsWith('Main Theatre');
    if (selectedUnit === 'acad') return staff.assignedTo?.startsWith('DSU Theatre');
    return true;
  });

  const filteredVacantShifts = vacantShifts.map(dateGroup => ({
    ...dateGroup,
    shifts: dateGroup.shifts.filter(shift => {
      if (selectedUnit === 'all') return true;
      if (selectedUnit === 'recovery') return shift.department?.includes('Recovery');
      if (selectedUnit === 'main') return shift.department?.startsWith('Main Theatre') || shift.department?.includes('Main Recovery');
      if (selectedUnit === 'acad') return shift.department?.startsWith('DSU Theatre');
      return true;
    })
  })).filter(dateGroup => dateGroup.shifts.length > 0);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Left Sidebar - Premium Stats Panel */}
      <div className="w-80 bg-white border-r border-gray-200 shadow-xl flex flex-col">
        {/* Left Header with Gradient */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white px-6 py-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Staffing Summary</h3>
              <p className="text-blue-100 text-sm mt-1">Current levels</p>
            </div>
          </div>
        </div>

        {/* Stats Content - Premium Cards */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {/* Total On Duty */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Total On Duty</p>
              <UserCheck className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-4xl font-bold text-green-700">{staffSummary.totalOnDuty}</p>
            <p className="text-xs text-green-600 mt-2">Staff currently working</p>
          </div>

          {/* On Break */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">On Break</p>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-4xl font-bold text-blue-700">{staffSummary.onBreak}</p>
            <p className="text-xs text-blue-600 mt-2">Currently on break</p>
          </div>

          {/* Arriving Late */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Arriving Late</p>
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-4xl font-bold text-orange-700">{staffSummary.arrivingLate}</p>
            <p className="text-xs text-orange-600 mt-2">Delayed arrivals</p>
          </div>

          {/* Sick Today */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Sick Today</p>
              <UserX className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-4xl font-bold text-red-700">{staffSummary.sickToday}</p>
            <p className="text-xs text-red-600 mt-2">Staff absent</p>
          </div>

          {/* Vacant Shifts (7d) */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Vacant Shifts (7d)</p>
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-4xl font-bold text-purple-700">{staffSummary.vacantShifts.next7Days}</p>
            <p className="text-xs text-purple-600 mt-2">Unfilled positions</p>
          </div>
        </div>
      </div>

      {/* Right Content Area - Premium Design */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Premium Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white px-8 py-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Staff on Duty</h1>
                <p className="text-blue-100 text-sm mt-1">Current staffing levels, sickness tracking & vacant shifts</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-xs text-blue-100">Last Updated</p>
                <p className="text-sm font-semibold">Just now</p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium View Mode Selector */}
        <div className="bg-white border-b border-gray-200 px-8 py-5 shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold text-gray-700">View:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('sick')}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                  viewMode === 'sick'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <UserX className="w-4 h-4" />
                <span>Sick Today ({filteredSickStaff.length})</span>
              </button>
              <button
                onClick={() => setViewMode('late')}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                  viewMode === 'late'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Arriving Late ({filteredArrivingLate.length})</span>
              </button>
              <button
                onClick={() => setViewMode('vacant')}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                  viewMode === 'vacant'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Vacant Shifts ({staffSummary.vacantShifts.next7Days})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area - Premium Cards */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {viewMode === 'sick' && (
            <div className="space-y-4">
              {filteredSickStaff.map((staff, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{staff.name}</h3>
                      <p className="text-sm text-gray-600">{staff.role} • {staff.department}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      staff.status === 'covered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {staff.status === 'covered' ? 'COVERED' : 'GAP'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Reason</p>
                      <p className="text-sm text-gray-900 font-medium">{staff.reason}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Expected Return</p>
                      <p className="text-sm text-gray-900 font-medium">{staff.expectedReturn}</p>
                    </div>
                  </div>

                  {staff.status === 'covered' && staff.coverBy && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <p className="text-xs font-bold text-green-900 mb-2 uppercase tracking-wide">Cover Arranged</p>
                      <p className="text-sm text-green-800 font-medium">{staff.coverBy}</p>
                      {staff.shiftsCovered.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {staff.shiftsCovered.map((shift, i) => (
                            <p key={i} className="text-xs text-green-700">• {shift}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {staff.episodes > 0 && (
                    <div className="mt-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                      <p className="text-xs font-bold text-orange-900 mb-1">Sickness History</p>
                      <p className="text-sm text-orange-800">{staff.episodes} episodes this year • Last: {staff.lastSickness}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {viewMode === 'late' && (
            <div className="space-y-4">
              {filteredArrivingLate.map((staff, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{staff.name}</h3>
                      <p className="text-sm text-gray-600">{staff.role} • {staff.assignedTo}</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-orange-100 text-orange-700">
                      DELAYED
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Scheduled</p>
                      <p className="text-sm text-gray-900 font-medium">{staff.scheduledStart}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                      <p className="text-xs font-semibold text-orange-700 mb-1">Expected</p>
                      <p className="text-sm text-orange-900 font-medium">{staff.expectedArrival}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-xs font-semibold text-blue-700 mb-1">Impact</p>
                      <p className="text-sm text-blue-900 font-medium">{staff.impact}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200 mb-4">
                    <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Reason</p>
                    <p className="text-sm text-gray-800">{staff.reason}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <p className="text-xs font-bold text-green-900 mb-2 uppercase tracking-wide">Cover Arranged</p>
                    <p className="text-sm text-green-800 font-medium">{staff.cover}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'vacant' && (
            <div className="space-y-6">
              {filteredVacantShifts.map((dateGroup, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{dateGroup.date}</h3>
                  <div className="space-y-3">
                    {dateGroup.shifts.map((shift, shiftIdx) => (
                      <div key={shiftIdx} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{shift.role}</h4>
                            <p className="text-sm text-gray-600">{shift.department} • {shift.time}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getPriorityColor(shift.priority)}`}>
                            {shift.priority.toUpperCase()}
                          </span>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                          <p className="text-xs font-semibold text-blue-700 mb-1">Available Cover</p>
                          <p className="text-2xl font-bold text-blue-900">{shift.availableCover} staff members</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
