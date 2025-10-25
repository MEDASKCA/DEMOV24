'use client';

import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Filter,
  BarChart3,
  Target,
  Clock,
  Activity
} from 'lucide-react';

interface EfficiencyScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterUnit = 'all' | 'main' | 'acad' | 'recovery';

export default function EfficiencyScoreModal({ isOpen, onClose }: EfficiencyScoreModalProps) {
  const [selectedUnit, setSelectedUnit] = useState<FilterUnit>('all');

  if (!isOpen) return null;

  // --- Demo summary ---
  const todaysSummary = {
    overallEfficiency: 87,
    target: 85,
    bestTheatre: 'Main Theatre 4',
    worstTheatre: 'Main Theatre 7',
    aboveTarget: 7,
    belowTarget: 3
  };

  // --- Demo data ---
  const theatreData = [
    {
      theatre: 'Main Theatre 1',
      unit: 'main',
      efficiency: 89,
      target: 85,
      trend: 'improving',
      casesScheduled: 5,
      casesCompleted: 4,
      casesInProgress: 1,
      utilizationRate: 92,
      avgCaseTime: 78,
      scheduledTime: 85,
      delayMinutes: 12,
      factors: [
        { factor: 'On-time starts', score: 95, status: 'excellent' },
        { factor: 'Turnover time', score: 88, status: 'good' },
        { factor: 'Case completion rate', score: 85, status: 'good' },
        { factor: 'Equipment ready', score: 92, status: 'excellent' }
      ]
    },
    {
      theatre: 'Main Theatre 2',
      unit: 'main',
      efficiency: 82,
      target: 85,
      trend: 'stable',
      casesScheduled: 4,
      casesCompleted: 3,
      casesInProgress: 1,
      utilizationRate: 88,
      avgCaseTime: 92,
      scheduledTime: 90,
      delayMinutes: 22,
      factors: [
        { factor: 'On-time starts', score: 75, status: 'needs-attention' },
        { factor: 'Turnover time', score: 82, status: 'good' },
        { factor: 'Case completion rate', score: 85, status: 'good' },
        { factor: 'Equipment ready', score: 88, status: 'good' }
      ]
    },
    {
      theatre: 'Main Theatre 3',
      unit: 'main',
      efficiency: 91,
      target: 85,
      trend: 'improving',
      casesScheduled: 6,
      casesCompleted: 5,
      casesInProgress: 1,
      utilizationRate: 95,
      avgCaseTime: 68,
      scheduledTime: 70,
      delayMinutes: 5,
      factors: [
        { factor: 'On-time starts', score: 100, status: 'excellent' },
        { factor: 'Turnover time', score: 92, status: 'excellent' },
        { factor: 'Case completion rate', score: 88, status: 'good' },
        { factor: 'Equipment ready', score: 95, status: 'excellent' }
      ]
    },
    {
      theatre: 'Main Theatre 4',
      unit: 'main',
      efficiency: 94,
      target: 85,
      trend: 'improving',
      casesScheduled: 7,
      casesCompleted: 6,
      casesInProgress: 1,
      utilizationRate: 98,
      avgCaseTime: 62,
      scheduledTime: 65,
      delayMinutes: 2,
      factors: [
        { factor: 'On-time starts', score: 100, status: 'excellent' },
        { factor: 'Turnover time', score: 95, status: 'excellent' },
        { factor: 'Case completion rate', score: 92, status: 'excellent' },
        { factor: 'Equipment ready', score: 98, status: 'excellent' }
      ]
    },
    {
      theatre: 'Main Theatre 5',
      unit: 'main',
      efficiency: 86,
      target: 85,
      trend: 'stable',
      casesScheduled: 5,
      casesCompleted: 4,
      casesInProgress: 1,
      utilizationRate: 90,
      avgCaseTime: 75,
      scheduledTime: 80,
      delayMinutes: 15,
      factors: [
        { factor: 'On-time starts', score: 85, status: 'good' },
        { factor: 'Turnover time', score: 88, status: 'good' },
        { factor: 'Case completion rate', score: 85, status: 'good' },
        { factor: 'Equipment ready', score: 90, status: 'excellent' }
      ]
    },
    {
      theatre: 'Main Theatre 7',
      unit: 'main',
      efficiency: 68,
      target: 85,
      trend: 'worsening',
      casesScheduled: 3,
      casesCompleted: 2,
      casesInProgress: 1,
      utilizationRate: 72,
      avgCaseTime: 105,
      scheduledTime: 90,
      delayMinutes: 45,
      factors: [
        { factor: 'On-time starts', score: 60, status: 'critical' },
        { factor: 'Turnover time', score: 65, status: 'needs-attention' },
        { factor: 'Case completion rate', score: 70, status: 'needs-attention' },
        { factor: 'Equipment ready', score: 78, status: 'needs-attention' }
      ]
    },
    {
      theatre: 'Main Theatre 8',
      unit: 'main',
      efficiency: 88,
      target: 85,
      trend: 'stable',
      casesScheduled: 6,
      casesCompleted: 5,
      casesInProgress: 1,
      utilizationRate: 93,
      avgCaseTime: 70,
      scheduledTime: 75,
      delayMinutes: 8,
      factors: [
        { factor: 'On-time starts', score: 90, status: 'excellent' },
        { factor: 'Turnover time', score: 88, status: 'good' },
        { factor: 'Case completion rate', score: 88, status: 'good' },
        { factor: 'Equipment ready', score: 92, status: 'excellent' }
      ]
    },
    {
      theatre: 'DSU Theatre 1',
      unit: 'acad',
      efficiency: 85,
      target: 85,
      trend: 'stable',
      casesScheduled: 4,
      casesCompleted: 3,
      casesInProgress: 1,
      utilizationRate: 88,
      avgCaseTime: 80,
      scheduledTime: 85,
      delayMinutes: 10,
      factors: [
        { factor: 'On-time starts', score: 85, status: 'good' },
        { factor: 'Turnover time', score: 85, status: 'good' },
        { factor: 'Case completion rate', score: 85, status: 'good' },
        { factor: 'Equipment ready', score: 88, status: 'good' }
      ]
    },
    {
      theatre: 'DSU Theatre 2',
      unit: 'acad',
      efficiency: 83,
      target: 85,
      trend: 'stable',
      casesScheduled: 4,
      casesCompleted: 3,
      casesInProgress: 1,
      utilizationRate: 86,
      avgCaseTime: 85,
      scheduledTime: 88,
      delayMinutes: 18,
      factors: [
        { factor: 'On-time starts', score: 80, status: 'good' },
        { factor: 'Turnover time', score: 82, status: 'good' },
        { factor: 'Case completion rate', score: 85, status: 'good' },
        { factor: 'Equipment ready', score: 86, status: 'good' }
      ]
    },
    {
      theatre: 'DSU Theatre 3',
      unit: 'acad',
      efficiency: 90,
      target: 85,
      trend: 'improving',
      casesScheduled: 5,
      casesCompleted: 4,
      casesInProgress: 1,
      utilizationRate: 94,
      avgCaseTime: 72,
      scheduledTime: 75,
      delayMinutes: 6,
      factors: [
        { factor: 'On-time starts', score: 92, status: 'excellent' },
        { factor: 'Turnover time', score: 90, status: 'excellent' },
        { factor: 'Case completion rate', score: 88, status: 'good' },
        { factor: 'Equipment ready', score: 92, status: 'excellent' }
      ]
    }
  ];

  const filteredTheatres = theatreData.filter(t => (selectedUnit === 'all' ? true : t.unit === selectedUnit));

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'worsening': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />;
    }
  };

  const getEfficiencyColor = (eff: number, tgt: number) => {
    if (eff >= tgt + 5) return 'bg-green-50 border-green-200';
    if (eff >= tgt) return 'bg-blue-50 border-blue-200';
    if (eff >= tgt - 10) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getFactorColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-50 text-green-800 border-green-200';
      case 'good': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'needs-attention': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-50 text-red-800 border-red-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-white lg:bg-black lg:bg-opacity-40 lg:backdrop-blur-sm flex items-stretch justify-center"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Efficiency score analysis"
    >
      <div className="bg-white lg:rounded-2xl lg:shadow-2xl w-full lg:max-w-5xl h-full lg:h-[90vh] overflow-hidden flex flex-col">
        {/* Sticky top header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold truncate">Theatre Efficiency Score</h2>
            <p className="text-orange-100 text-[11px] sm:text-xs">Real-time efficiency & performance factors</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-blue-800/60" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable column */}
        <div className="flex-1 overflow-y-auto">
          {/* 1) SUMMARY FIRST */}
          <section className="px-4 sm:px-6 pt-3 pb-2">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Today's Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <div className="rounded-lg p-3 border bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <p className="text-[10px] font-semibold text-orange-700 uppercase tracking-wide">Overall Efficiency</p>
                <p className="text-2xl sm:text-3xl font-bold text-orange-800">{todaysSummary.overallEfficiency}%</p>
              </div>
              <div className="rounded-lg p-3 border bg-gradient-to-br from-slate-50 to-gray-50 border-gray-200">
                <p className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide">Target</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{todaysSummary.target}%</p>
              </div>
              <div className="rounded-lg p-3 border bg-gradient-to-br from-green-50 to-emerald-50 border-emerald-200">
                <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">Above Target</p>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-800">{todaysSummary.aboveTarget}</p>
              </div>
              <div className="rounded-lg p-3 border bg-gradient-to-br from-rose-50 to-red-50 border-rose-200">
                <p className="text-[10px] font-semibold text-rose-700 uppercase tracking-wide">Below Target</p>
                <p className="text-2xl sm:text-3xl font-bold text-rose-800">{todaysSummary.belowTarget}</p>
              </div>
              <div className="rounded-lg p-3 border bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
                <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">Top Performer</p>
                <p className="text-xs font-semibold text-emerald-900 truncate">{todaysSummary.bestTheatre}</p>
              </div>
              <div className="rounded-lg p-3 border bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
                <p className="text-[10px] font-semibold text-red-700 uppercase tracking-wide">Needs Support</p>
                <p className="text-xs font-semibold text-red-900 truncate">{todaysSummary.worstTheatre}</p>
              </div>
            </div>
          </section>

          {/* 2) TITLE BAR */}
          <section className="px-4 sm:px-6 pt-2 pb-3">
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-lg text-white px-4 py-3 sm:px-5 sm:py-4">
              <h3 className="text-base sm:text-lg font-bold">Efficiency – Details</h3>
              <p className="text-indigo-100 text-[11px] sm:text-xs mt-0.5">
                Breakdown by theatre with trends, utilization and factors
              </p>
            </div>
          </section>

          {/* 3) STICKY FILTERS */}
          <div className="sticky top-[48px] sm:top-[56px] z-10 bg-white/95 backdrop-blur border-y border-gray-200">
            <div className="px-4 sm:px-6 py-2 flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-3 h-3 text-gray-500" />
                <span className="text-[11px] font-medium text-gray-700">Filter by Unit:</span>
                {(['all', 'main', 'acad', 'recovery'] as const).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setSelectedUnit(unit)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      selectedUnit === unit
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-pressed={selectedUnit === unit}
                  >
                    {unit === 'all' ? 'All Units' : unit.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <BarChart3 className="w-3 h-3 text-gray-500" />
                <button className="px-2 py-1 bg-blue-600 text-white rounded text-[11px] font-medium hover:bg-blue-700 transition-colors">
                  View Period Analytics
                </button>
              </div>
            </div>
          </div>

          {/* 4) THEATRE LIST */}
          <div className="px-4 sm:px-6 py-3 space-y-3">
            {filteredTheatres.map((theatre) => (
              <div
                key={theatre.theatre}
                className={`rounded-lg p-4 border ${getEfficiencyColor(theatre.efficiency, theatre.target)}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900 truncate">{theatre.theatre}</h4>
                      {getTrendIcon(theatre.trend)}
                      <span className="text-xs font-medium capitalize text-gray-700">({theatre.trend})</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] text-gray-600">Efficiency</p>
                    <p className="text-xl font-extrabold">{theatre.efficiency}%</p>
                  </div>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3 text-sm">
                  <div className="bg-white bg-opacity-50 rounded p-2">
                    <p className="text-xs text-gray-600 flex items-center">
                      <Target className="w-3 h-3 mr-1" />
                      Cases
                    </p>
                    <p className="font-bold">
                      {theatre.casesCompleted}/{theatre.casesScheduled}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-50 rounded p-2">
                    <p className="text-xs text-gray-600 flex items-center">
                      <Activity className="w-3 h-3 mr-1" />
                      Utilization
                    </p>
                    <p className="font-bold">{theatre.utilizationRate}%</p>
                  </div>
                  <div className="bg-white bg-opacity-50 rounded p-2">
                    <p className="text-xs text-gray-600 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Avg Time
                    </p>
                    <p className="font-bold">{theatre.avgCaseTime} min</p>
                  </div>
                  <div className="bg-white bg-opacity-50 rounded p-2">
                    <p className="text-xs text-gray-600">Scheduled</p>
                    <p className="font-bold">{theatre.scheduledTime} min</p>
                  </div>
                  <div className="bg-white bg-opacity-50 rounded p-2">
                    <p className="text-xs text-gray-600">Total Delay</p>
                    <p className={`font-bold ${theatre.delayMinutes > 20 ? 'text-red-700' : 'text-gray-800'}`}>
                      {theatre.delayMinutes} min
                    </p>
                  </div>
                </div>

                {/* Factors */}
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Performance Factors</p>
                  <div className="grid grid-cols-2 gap-2">
                    {theatre.factors.map((f, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between px-3 py-2 rounded border text-xs ${getFactorColor(f.status)}`}
                      >
                        <span className="font-medium">{f.factor}</span>
                        <span className="font-bold">{f.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alerts */}
                {theatre.efficiency < theatre.target - 10 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="bg-red-50 rounded p-2 text-xs text-red-800 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      <span className="font-semibold">
                        Critical: Efficiency {theatre.target - theatre.efficiency}% below target. Immediate action required.
                      </span>
                    </div>
                  </div>
                )}

                {theatre.efficiency >= theatre.target + 5 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-green-700 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Excellent performance – {theatre.efficiency - theatre.target}% above target
                    </p>
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
