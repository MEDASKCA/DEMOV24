'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar
} from 'lucide-react';

export default function StaffPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'sick' | 'late' | 'vacant'>('sick');

  const sickStaff = [
    {
      name: 'RN S. Williams',
      role: 'Scrub N/P',
      department: 'Main Theatres',
      reason: 'Flu symptoms',
      expectedReturn: '2024-10-23',
      episodes: 2,
      status: 'covered',
      coverBy: 'RN K. Martinez (Bank Staff)'
    },
    {
      name: 'ODP M. Johnson',
      role: 'Anaes N/P',
      department: 'DSU Theatres',
      reason: 'Migraine',
      expectedReturn: '2024-10-21',
      episodes: 1,
      status: 'covered',
      coverBy: 'ODP R. Thompson (Internal)'
    },
    {
      name: 'HCA T. Brown',
      role: 'Healthcare Assistant',
      department: 'Main Theatres',
      reason: 'Back pain',
      expectedReturn: '2024-10-22',
      episodes: 3,
      status: 'gap'
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
      impact: 'No delay - covered'
    },
    {
      name: 'J. Smith',
      role: 'Consultant Surgeon',
      assignedTo: 'Main Theatre 4',
      scheduledStart: '08:00',
      expectedArrival: '08:30',
      reason: 'Traffic delay - M1 accident',
      impact: 'Minor delay - 15 min'
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
        { role: 'HCA', department: 'Main Theatre 1', time: '08:00-16:00', priority: 'medium', availableCover: 8 }
      ]
    }
  ];

  const stats = {
    totalOnDuty: 156,
    onBreak: 7,
    arrivingLate: arrivingLate.length,
    sickToday: sickStaff.length,
    vacantShifts: 8
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Staff Directory</h1>
              <p className="text-xs text-purple-100 mt-0.5">
                View staff on duty & status
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="px-4 pb-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-purple-100">On Duty</p>
                <p className="text-lg font-bold">{stats.totalOnDuty}</p>
              </div>
              <div>
                <p className="text-xs text-purple-100">On Break</p>
                <p className="text-lg font-bold">{stats.onBreak}</p>
              </div>
              <div>
                <p className="text-xs text-purple-100">Sick Today</p>
                <p className="text-lg font-bold text-red-300">{stats.sickToday}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-1">
            <button
              onClick={() => setSelectedTab('sick')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                selectedTab === 'sick'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-white/80'
              }`}
            >
              Sick ({sickStaff.length})
            </button>
            <button
              onClick={() => setSelectedTab('late')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                selectedTab === 'late'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-white/80'
              }`}
            >
              Late ({arrivingLate.length})
            </button>
            <button
              onClick={() => setSelectedTab('vacant')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                selectedTab === 'vacant'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-white/80'
              }`}
            >
              Vacant ({stats.vacantShifts})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {selectedTab === 'sick' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="text-sm font-bold text-gray-900">Sickness Today</h2>
            </div>

            {sickStaff.map((staff, idx) => (
              <motion.div
                key={idx}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-red-500"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{staff.name}</h3>
                    <p className="text-xs text-gray-600">{staff.role} • {staff.department}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                    staff.status === 'covered'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {staff.status === 'covered' ? '✓ Covered' : '⚠ Gap'}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">Reason:</span>
                      <p className="font-semibold text-gray-900">{staff.reason}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Return:</span>
                      <p className="font-semibold text-gray-900">{new Date(staff.expectedReturn).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Episodes (YTD):</span>
                      <p className="font-semibold text-gray-900">{staff.episodes}</p>
                    </div>
                  </div>
                </div>

                {staff.status === 'covered' && staff.coverBy && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-semibold text-green-900">Covered by: {staff.coverBy}</span>
                    </div>
                  </div>
                )}

                {staff.status === 'gap' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-semibold text-red-900">Coverage gap - requires urgent action</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {selectedTab === 'late' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <h2 className="text-sm font-bold text-gray-900">Arriving Late</h2>
            </div>

            {arrivingLate.map((staff, idx) => (
              <motion.div
                key={idx}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-orange-500"
              >
                <div className="mb-3">
                  <h3 className="font-bold text-gray-900">{staff.name}</h3>
                  <p className="text-xs text-gray-600">{staff.role}</p>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Scheduled:</span>
                    <span className="font-bold text-gray-900">{staff.scheduledStart}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">ETA:</span>
                    <span className="font-bold text-orange-600">{staff.expectedArrival}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Assigned:</span>
                    <span className="font-semibold text-gray-900">{staff.assignedTo}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                  <p className="text-xs text-blue-900">
                    <span className="font-semibold">Reason:</span> {staff.reason}
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-900">
                    <span className="font-semibold">Impact:</span> {staff.impact}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {selectedTab === 'vacant' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h2 className="text-sm font-bold text-gray-900">Vacant Shifts - Next 7 Days</h2>
            </div>

            {vacantShifts.map((day, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="font-bold text-purple-900 mb-3">{day.date}</h3>
                <div className="space-y-2">
                  {day.shifts.map((shift, shiftIdx) => (
                    <div
                      key={shiftIdx}
                      className="bg-purple-50 border border-purple-200 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              shift.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                              shift.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {shift.priority.toUpperCase()}
                            </span>
                            <span className="font-bold text-gray-900 text-sm">{shift.role}</span>
                          </div>
                          <p className="text-xs text-gray-600">{shift.department}</p>
                          <p className="text-xs text-gray-600 mt-1">{shift.time}</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-2 mt-2">
                        <p className="text-xs text-gray-700">
                          <span className="font-semibold">{shift.availableCover}</span> staff available to cover
                        </p>
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
  );
}
