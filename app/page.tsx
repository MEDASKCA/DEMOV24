'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import SubMenuModal from '@/components/SubMenuModal';
import FeedsView from '@/components/views/FeedsView';
import DashboardView from '@/components/views/DashboardView';
import TheatreScheduleView from '@/components/views/TheatreScheduleView';
import TomAIView from '@/components/views/TomAIView';
import DesktopRoster from '@/features/roster/components/DesktopRoster';
import { ChevronDown, User, Settings, HelpCircle, LogOut } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<'feeds' | 'chat' | 'theatres' | 'staff' | 'alerts' | 'menu'>('theatres');
  const [currentView, setCurrentView] = useState<string>('feeds');
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [subMenuType, setSubMenuType] = useState<'menu' | null>(null);
  const [showDashboard, setShowDashboard] = useState(true);
  const [showTheatreSchedule, setShowTheatreSchedule] = useState(false);
  const [showCriticalAlerts, setShowCriticalAlerts] = useState(false);
  const [showUpcomingCases, setShowUpcomingCases] = useState(false);
  const [showEquipmentStatus, setShowEquipmentStatus] = useState(false);
  const [showReliefRequest, setShowReliefRequest] = useState(false);
  const [showWellbeingBreaks, setShowWellbeingBreaks] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleBottomNavClick = (page: 'feeds' | 'chat' | 'theatres' | 'staff' | 'alerts' | 'menu') => {
    setCurrentPage(page);

    if (page === 'feeds') {
      setCurrentView('posts'); // Mobile home shows Posts (FeedsView)
    } else if (page === 'chat') {
      setCurrentView('chat');
    } else if (page === 'staff') {
      setCurrentView('roster');
    } else if (page === 'alerts') {
      setCurrentView('alerts');
    } else if (page === 'menu') {
      // Show submenu for menu section
      setSubMenuType('menu');
      setShowSubMenu(true);
    }
    // For 'theatres', we just set currentPage and let renderContent handle it
  };

  const handleSubMenuNavigate = (viewId: string) => {
    setCurrentView(viewId);
  };

  const renderContent = () => {
    // Theatre views - Desktop shows view based on currentView, Mobile shows accordions
    if (currentPage === 'theatres') {
      return (
        <div className="h-full w-full">
          {/* Desktop View - Render based on currentView (hidden on mobile) */}
          <div className="hidden md:block h-full">
            {currentView === 'feeds' && <DashboardView />}
            {currentView === 'theatreSchedule' && <TheatreScheduleView />}
            {currentView === 'inventory' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-2">Inventory Management</h2>
                  <p className="text-gray-500">Inventory tracking coming soon</p>
                </div>
              </div>
            )}
            {currentView === 'procedures' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-2">Procedure Cards</h2>
                  <p className="text-gray-500">Procedure management coming soon</p>
                </div>
              </div>
            )}
            {currentView === 'readiness' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-2">Readiness Dashboard</h2>
                  <p className="text-gray-500">Theatre readiness monitoring coming soon</p>
                </div>
              </div>
            )}
            {currentView === 'analytics' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-2">Analytics & Reports</h2>
                  <p className="text-gray-500">Performance analytics coming soon</p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile View - Accordion sections (hidden on desktop) */}
          <div className="md:hidden h-full flex flex-col bg-gray-50 overflow-y-auto pb-20">
            <div className="p-3 space-y-3">
              {/* Dashboard Accordion */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <button
                  onClick={() => setShowDashboard(!showDashboard)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
                  </div>
                  {showDashboard ? (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
                {showDashboard && (
                  <div className="px-5 pb-5">
                    <DashboardView />
                  </div>
                )}
              </div>

            {/* Theatre Schedule Accordion */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <button
                onClick={() => setShowTheatreSchedule(!showTheatreSchedule)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <h2 className="text-lg font-semibold text-gray-800">Theatre Schedule</h2>
                </div>
                {showTheatreSchedule ? (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              {showTheatreSchedule && (
                <div className="px-5 pb-5">
                  <TheatreScheduleView />
                </div>
              )}
            </div>

            {/* Critical Alerts Accordion */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <button
                onClick={() => setShowCriticalAlerts(!showCriticalAlerts)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h2 className="text-lg font-semibold text-gray-800">Critical Alerts</h2>
                </div>
                {showCriticalAlerts ? (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              {showCriticalAlerts && (
                <div className="px-5 pb-5 space-y-3">
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                    <div className="flex items-start">
                      <svg className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
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
                      <svg className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-red-800">Low Inventory Alert</p>
                        <p className="text-xs text-red-700 mt-1">Hip implants (size L) - Only 2 units remaining</p>
                        <p className="text-xs text-red-600 mt-2">Action: Order placed, ETA 2 hours</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                    <div className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Staff Shortage Warning</p>
                        <p className="text-xs text-yellow-700 mt-1">Night shift - 1 scrub nurse short</p>
                        <p className="text-xs text-yellow-600 mt-2">Action: Agency staff requested</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                    <div className="flex items-start">
                      <svg className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-green-800">Issue Resolved</p>
                        <p className="text-xs text-green-700 mt-1">Theatre 2 HVAC system restored</p>
                        <p className="text-xs text-green-600 mt-2">Resolved 10 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Upcoming Cases Accordion */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <button
                onClick={() => setShowUpcomingCases(!showUpcomingCases)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-lg font-semibold text-gray-800">Upcoming Cases</h2>
                </div>
                {showUpcomingCases ? (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              {showUpcomingCases && (
                <div className="px-5 pb-5 space-y-3">
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
              )}
            </div>

            {/* Critical Equipment Status Accordion */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <button
                onClick={() => setShowEquipmentStatus(!showEquipmentStatus)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h2 className="text-lg font-semibold text-gray-800">Critical Equipment Status</h2>
                </div>
                {showEquipmentStatus ? (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              {showEquipmentStatus && (
                <div className="px-5 pb-5 space-y-3">
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
              )}
            </div>

            {/* Relief Request Accordion */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <button
                onClick={() => setShowReliefRequest(!showReliefRequest)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <h2 className="text-lg font-semibold text-gray-800">Relief Request</h2>
                </div>
                {showReliefRequest ? (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              {showReliefRequest && (
                <div className="px-5 pb-5 space-y-3">
                  {[
                    { staff: 'RN A. Flores', role: 'Scrub Nurse', theatre: 'Main Theatre 1', shift: '08:00 - 20:00', hoursWorked: '9h 30m', status: 'urgent', reason: 'Worked 9+ hours, break overdue' },
                    { staff: 'Dr. F. James', role: 'Anaesthetist', theatre: 'Main Theatre 1', shift: '08:00 - 20:00', hoursWorked: '9h 30m', status: 'on_break', reason: 'Currently on break (15 min)' },
                    { staff: 'RN Z. Reed', role: 'Scrub Nurse', theatre: 'Main Theatre 7', shift: '08:00 - 20:00', hoursWorked: '9h 30m', status: 'urgent', reason: 'Break overdue' },
                    { staff: 'RN M. Garcia', role: 'Scrub Nurse', theatre: 'Main Theatre 3', shift: '08:00 - 20:00', hoursWorked: '9h 30m', status: 'relieved', reason: 'Break taken (30 min), relieved by RN L. Brown' },
                  ].map((request, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border-l-4 ${
                      request.status === 'urgent' ? 'bg-orange-50 border-orange-500' :
                      request.status === 'on_break' ? 'bg-blue-50 border-blue-500' :
                      'bg-green-50 border-green-500'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-bold text-gray-900">{request.staff}</p>
                            <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                              request.status === 'urgent' ? 'bg-orange-100 text-orange-700' :
                              request.status === 'on_break' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {request.status === 'urgent' ? 'URGENT' : request.status === 'on_break' ? 'ON BREAK' : 'RELIEVED'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-700">{request.role} • {request.theatre}</p>
                          <p className="text-xs text-gray-600 mt-1">{request.shift} • {request.hoursWorked} worked</p>
                          <p className="text-xs text-gray-700 mt-2">{request.reason}</p>
                        </div>
                        {request.status === 'urgent' && (
                          <button className="ml-3 px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded hover:bg-orange-700 transition-colors">
                            Send Relief
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wellbeing Breaks Accordion */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <button
                onClick={() => setShowWellbeingBreaks(!showWellbeingBreaks)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <h2 className="text-lg font-semibold text-gray-800">Wellbeing Breaks</h2>
                </div>
                {showWellbeingBreaks ? (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              {showWellbeingBreaks && (
                <div className="px-5 pb-5">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-700">12</p>
                      <p className="text-xs text-blue-600">Currently on Break</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-700">45</p>
                      <p className="text-xs text-green-600">Breaks Taken Today</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-orange-700">8</p>
                      <p className="text-xs text-orange-600">Break Overdue</p>
                    </div>
                  </div>

                  {/* Break Details */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Breaks</h3>
                    {[
                      { staff: 'Dr. F. James', role: 'Anaesthetist', theatre: 'Main Theatre 1', breakType: 'Coffee Break', startTime: '09:45', duration: '15 min', timeLeft: '5 min' },
                      { staff: 'Dr. K. Baker', role: 'Anaesthetist', theatre: 'Main Theatre 5', breakType: 'Rest Break', startTime: '09:30', duration: '30 min', timeLeft: 'Overdue 5m' },
                      { staff: 'Dr. X. Coleman', role: 'Anaesthetist', theatre: 'Main Theatre 11', breakType: 'Coffee Break', startTime: '09:50', duration: '15 min', timeLeft: '10 min' },
                      { staff: 'RN H. Newman', role: 'Scrub Nurse', theatre: 'DSU Theatre 8', breakType: 'Coffee Break', startTime: '09:40', duration: '15 min', timeLeft: 'Returning' },
                    ].map((breakItem, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">{breakItem.staff}</p>
                            <p className="text-xs text-gray-700">{breakItem.role} • {breakItem.theatre}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                              <span>{breakItem.breakType}</span>
                              <span>•</span>
                              <span>Started: {breakItem.startTime}</span>
                              <span>•</span>
                              <span>{breakItem.duration}</span>
                            </div>
                          </div>
                          <div className={`ml-3 px-2 py-1 rounded text-xs font-semibold ${
                            breakItem.timeLeft.includes('Overdue') ? 'bg-red-100 text-red-700' :
                            breakItem.timeLeft.includes('Returning') ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {breakItem.timeLeft}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      );
    }

    switch (currentView) {
      case 'posts':
        return <FeedsView />;
      case 'chat':
        return <TomAIView />;
      case 'feeds':
        return <DashboardView />;
      case 'theatreSchedule':
        return <TheatreScheduleView />;
      case 'roster':
        return <DesktopRoster />;
      case 'alerts':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Alerts & Notifications</h2>
              <p className="text-gray-500">Notification center coming soon</p>
            </div>
          </div>
        );
      case 'availability':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Staff Availability</h2>
              <p className="text-gray-500">Availability tracking coming soon</p>
            </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Inventory Management</h2>
              <p className="text-gray-500">Inventory tracking coming soon</p>
            </div>
          </div>
        );
      case 'procedures':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Procedure Cards</h2>
              <p className="text-gray-500">Procedure management coming soon</p>
            </div>
          </div>
        );
      case 'readiness':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Readiness Dashboard</h2>
              <p className="text-gray-500">Theatre readiness monitoring coming soon</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Analytics & Reports</h2>
              <p className="text-gray-500">Performance analytics coming soon</p>
            </div>
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-100">
      {/* Desktop Header Banner - Hidden on Mobile */}
      <div className="hidden md:block bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 text-white">
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Left: Branding */}
          <div>
            <h1 className="text-xl font-bold">TOM by MEDASKCA</h1>
            <p className="text-sm text-white/90">Theatre Operations Manager</p>
            <p className="text-xs italic text-white/80">Demo for NHS Clinical Entrepreneur Programme</p>
          </div>

          {/* Right: User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-colors"
            >
              {/* Profile Photo */}
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm border-2 border-white/30">
                AM
              </div>

              {/* User Info */}
              <div className="text-left">
                <p className="text-sm font-bold text-white">Alexander Monterubio</p>
                <p className="text-xs text-white/70">Theatre Manager • NHSCEP Hospital</p>
              </div>

              {/* Dropdown Arrow */}
              <ChevronDown className={`w-4 h-4 text-white/80 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700 transition-colors">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Update Profile</span>
                </button>
                <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700 transition-colors">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Settings</span>
                </button>
                <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700 transition-colors">
                  <HelpCircle className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Help and Support</span>
                </button>
                <div className="border-t border-gray-200 my-2"></div>
                <button className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center space-x-3 text-red-600 transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Header Navigation - Hidden on Mobile */}
      <div className="hidden md:block bg-white border-b border-gray-200">
        <div className="flex items-center space-x-1 px-4">
          <button
            onClick={() => {
              setCurrentView('posts');
              setCurrentPage('feeds');
            }}
            className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
              currentView === 'posts'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => {
              setCurrentView('feeds');
              setCurrentPage('theatres');
            }}
            className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
              currentView === 'feeds'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              setCurrentView('theatreSchedule');
              setCurrentPage('theatres');
            }}
            className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
              currentView === 'theatreSchedule'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Theatre Schedule
          </button>
          <button
            onClick={() => {
              setCurrentView('roster');
              setCurrentPage('staff');
            }}
            className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
              currentView === 'roster'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Staff Roster
          </button>
          <button
            onClick={() => {
              setCurrentView('inventory');
              setCurrentPage('theatres');
            }}
            className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
              currentView === 'inventory'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => {
              setCurrentView('procedures');
              setCurrentPage('theatres');
            }}
            className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
              currentView === 'procedures'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Procedures
          </button>
          <button
            onClick={() => {
              setCurrentView('readiness');
              setCurrentPage('theatres');
            }}
            className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
              currentView === 'readiness'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Readiness
          </button>
          <button
            onClick={() => {
              setCurrentView('analytics');
              setCurrentPage('theatres');
            }}
            className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
              currentView === 'analytics'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      {/* Bottom Navigation - Hidden on Desktop, Shown on Mobile */}
      <div className="md:hidden">
        <BottomNav
          currentPage={currentPage}
          onNavigate={handleBottomNavClick}
          alertCount={4}
        />
      </div>

      {/* Submenu Modal */}
      <SubMenuModal
        isOpen={showSubMenu}
        onClose={() => setShowSubMenu(false)}
        menuType={subMenuType}
        onNavigate={handleSubMenuNavigate}
      />
    </div>
  );
}
