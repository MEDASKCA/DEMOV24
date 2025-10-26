'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Calendar,
  User,
  FileText,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface TheatreOpsViewProps {
  onBack: () => void;
  selectedUnit?: 'all' | 'main' | 'acad' | 'recovery';
}

type IssueType = 'operational' | 'clinical' | 'escalation';
type FilterPeriod = 'today' | 'week' | 'month';

export default function TheatreOpsView({ onBack, selectedUnit = 'all' }: TheatreOpsViewProps) {
  const [selectedFilter, setSelectedFilter] = useState<IssueType | 'all'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>('today');
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  const operationalSummary = {
    runningTheatres: 24,
    totalTheatres: 26,
    casesCompleted: 47,
    casesUnderway: 18,
    casesScheduled: 89
  };

  const issues = [
    {
      id: 1,
      type: 'operational' as IssueType,
      title: 'Main Theatre 2 - Equipment Fault',
      description: 'Anaesthetic machine pressure sensor malfunction',
      theatre: 'Main Theatre 2',
      raisedBy: 'RN A. Flores',
      raisedAt: '08:15',
      status: 'resolved',
      resolvedAt: '09:30',
      resolvedBy: 'Biomed Engineer - J. Chen',
      priority: 'high',
      impact: 'Theatre closed for 75 minutes',
      previousOccurrences: [
        { date: '2024-10-15', theatre: 'Main Theatre 2', issue: 'Same sensor issue', resolvedBy: 'J. Chen' },
        { date: '2024-09-28', theatre: 'Main Theatre 5', issue: 'Pressure sensor fault', resolvedBy: 'K. Williams' }
      ],
      notes: 'Sensor replaced. Preventative maintenance scheduled for all machines'
    },
    {
      id: 2,
      type: 'operational' as IssueType,
      title: 'Main Theatre 7 - CLOSED',
      description: 'Unpopulated list - No cases booked',
      theatre: 'Main Theatre 7',
      raisedBy: 'System Auto-flagged',
      raisedAt: '08:00',
      status: 'acknowledged',
      assignedTo: 'Theatre Coordinator',
      priority: 'low',
      impact: 'Theatre available for emergency cases',
      previousOccurrences: [],
      notes: 'Staff reallocated to other theatres'
    },
    {
      id: 3,
      type: 'clinical' as IssueType,
      title: 'DSU Theatre 3 - Delayed Start',
      description: 'Patient arrived with elevated blood pressure',
      theatre: 'DSU Theatre 3',
      raisedBy: 'Dr. F. James (Anaesthetist)',
      raisedAt: '08:45',
      status: 'resolved',
      resolvedAt: '09:30',
      priority: 'medium',
      impact: '45 minute delay to list',
      previousOccurrences: [],
      notes: 'Patient observed. BP stabilized. Consultant approval obtained. Surgery proceeded'
    },
    {
      id: 4,
      type: 'escalation' as IssueType,
      title: 'Main Theatre 1 - Implant Not Available',
      description: 'Specific hip prosthesis not in stock',
      theatre: 'Main Theatre 1',
      raisedBy: 'J. Smith (Consultant)',
      raisedAt: '08:35',
      status: 'in-progress',
      assignedTo: 'Procurement Manager',
      priority: 'urgent',
      impact: '15 min delay - alternative implant sourced',
      previousOccurrences: [
        { date: '2024-10-10', theatre: 'Main Theatre 1', issue: 'Knee implant stockout', resolvedBy: 'Procurement' }
      ],
      notes: 'Escalated to supply chain. Emergency stock protocol activated'
    },
    {
      id: 5,
      type: 'clinical' as IssueType,
      title: 'Main Theatre 8 - Post-op Complication',
      description: 'Patient requires HDU admission',
      theatre: 'Main Theatre 8',
      raisedBy: 'Dr. B. Morgan (Surgeon)',
      raisedAt: '11:15',
      status: 'resolved',
      resolvedAt: '11:45',
      priority: 'high',
      impact: 'HDU bed secured - No delay to next case',
      previousOccurrences: [],
      notes: 'Patient transferred to HDU. Next case started on time'
    }
  ];

  const filteredIssues = issues.filter(issue => {
    if (selectedFilter !== 'all' && issue.type !== selectedFilter) return false;
    if (selectedUnit === 'all') return true;
    if (selectedUnit === 'recovery') return false;
    if (selectedUnit === 'main') return issue.theatre.startsWith('Main Theatre');
    if (selectedUnit === 'acad') return issue.theatre.startsWith('DSU Theatre');
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-700 border-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

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
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Summary Stats</h3>
              <p className="text-blue-100 text-sm mt-1">Real-time metrics</p>
            </div>
          </div>
        </div>

        {/* Stats Content - Premium Cards */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {/* Running Theatres - Premium Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Running Theatres</p>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-4xl font-bold text-green-700 mb-1">
              {operationalSummary.runningTheatres}<span className="text-2xl text-green-500">/{operationalSummary.totalTheatres}</span>
            </p>
            <div className="w-full bg-green-200 rounded-full h-2 mt-3">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${(operationalSummary.runningTheatres / operationalSummary.totalTheatres) * 100}%` }}
              />
            </div>
          </div>

          {/* Cases Completed */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Cases Completed</p>
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-4xl font-bold text-blue-700">{operationalSummary.casesCompleted}</p>
            <p className="text-xs text-blue-600 mt-2">Today's completed procedures</p>
          </div>

          {/* Cases Underway */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Cases Underway</p>
              <Activity className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-4xl font-bold text-orange-700">{operationalSummary.casesUnderway}</p>
            <p className="text-xs text-orange-600 mt-2">Currently in progress</p>
          </div>

          {/* Total Scheduled */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Total Scheduled</p>
              <BarChart3 className="w-4 h-4 text-gray-600" />
            </div>
            <p className="text-4xl font-bold text-gray-700">{operationalSummary.casesScheduled}</p>
            <p className="text-xs text-gray-600 mt-2">Today's scheduled cases</p>
          </div>

          {/* Active Issues */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Active Issues</p>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-4xl font-bold text-red-700">
              {issues.filter(i => i.status !== 'resolved').length}
            </p>
            <p className="text-xs text-red-600 mt-2">Requiring attention</p>
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
                <h1 className="text-3xl font-bold tracking-tight">Theatre Operations</h1>
                <p className="text-blue-100 text-sm mt-1">Live operational status and comprehensive issue tracking</p>
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

        {/* Premium Filters Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-5 shadow-sm">
          <div className="flex flex-col space-y-4">
            {/* Issue Type Filter */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">Issue Type:</span>
              </div>
              <div className="flex items-center space-x-2">
                {(['all', 'operational', 'clinical', 'escalation'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedFilter === filter
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Period Filter */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">Time Period:</span>
              </div>
              <div className="flex items-center space-x-2">
                {(['today', 'week', 'month'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedPeriod === period
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Issues List - Premium Cards */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-4">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => setSelectedIssue(selectedIssue?.id === issue.id ? null : issue)}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getPriorityColor(issue.priority)}`}>
                        {issue.priority.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(issue.status)}`}>
                        {issue.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">{issue.theatre}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{issue.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{issue.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Raised by: <span className="font-medium ml-1">{issue.raisedBy}</span>
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {issue.raisedAt}
                      </span>
                      {issue.previousOccurrences.length > 0 && (
                        <span className="flex items-center text-orange-600 font-semibold">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          {issue.previousOccurrences.length} previous occurrence{issue.previousOccurrences.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details - Premium */}
                {selectedIssue?.id === issue.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-xs font-bold text-blue-900 mb-2 uppercase tracking-wide">Impact Assessment</p>
                      <p className="text-sm text-blue-800">{issue.impact}</p>
                    </div>

                    {issue.notes && (
                      <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-xs font-bold text-gray-700 mb-2 flex items-center uppercase tracking-wide">
                          <FileText className="w-4 h-4 mr-2" />
                          Clinical Notes
                        </p>
                        <p className="text-sm text-gray-700">{issue.notes}</p>
                      </div>
                    )}

                    {issue.resolvedBy && (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                        <p className="text-xs font-bold text-green-900 mb-2 uppercase tracking-wide">Resolution</p>
                        <p className="text-sm text-green-800">
                          Resolved by <span className="font-semibold">{issue.resolvedBy}</span> at {issue.resolvedAt}
                        </p>
                      </div>
                    )}

                    {issue.previousOccurrences.length > 0 && (
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                        <p className="text-xs font-bold text-orange-900 mb-3 flex items-center uppercase tracking-wide">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Previous Occurrences
                        </p>
                        <div className="space-y-3">
                          {issue.previousOccurrences.map((occurrence, idx) => (
                            <div key={idx} className="text-sm text-orange-800 pl-4 border-l-2 border-orange-400">
                              <p className="font-semibold">{occurrence.date} - {occurrence.theatre}</p>
                              <p>{occurrence.issue} • Resolved by: {occurrence.resolvedBy}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
