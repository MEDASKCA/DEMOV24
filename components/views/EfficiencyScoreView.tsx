'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Filter,
  BarChart3,
  Target,
  Clock,
  Users,
  Activity,
  Award
} from 'lucide-react';

interface EfficiencyScoreViewProps {
  onBack: () => void;
}

type FilterUnit = 'all' | 'main' | 'acad' | 'recovery';

export default function EfficiencyScoreView({ onBack }: EfficiencyScoreViewProps) {
  const [selectedUnit, setSelectedUnit] = useState<FilterUnit>('all');
  const [selectedTheatre, setSelectedTheatre] = useState<string | null>(null);

  const todaysSummary = {
    overallEfficiency: 87,
    target: 85,
    bestTheatre: 'Main Theatre 4',
    worstTheatre: 'Main Theatre 7',
    aboveTarget: 7,
    belowTarget: 3
  };

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
      theatre: 'DSU Theatre 1',
      unit: 'acad',
      efficiency: 88,
      target: 85,
      trend: 'stable',
      casesScheduled: 4,
      casesCompleted: 3,
      casesInProgress: 1,
      utilizationRate: 91,
      avgCaseTime: 45,
      scheduledTime: 50,
      delayMinutes: 8,
      factors: [
        { factor: 'On-time starts', score: 90, status: 'excellent' },
        { factor: 'Turnover time', score: 88, status: 'good' },
        { factor: 'Case completion rate', score: 85, status: 'good' },
        { factor: 'Equipment ready', score: 92, status: 'excellent' }
      ]
    }
  ];

  const filteredTheatres = theatreData.filter(theatre => {
    if (selectedUnit === 'all') return true;
    return theatre.unit === selectedUnit;
  });

  const getEfficiencyColor = (efficiency: number, target: number) => {
    if (efficiency >= target + 5) return 'text-green-700';
    if (efficiency >= target) return 'text-blue-700';
    if (efficiency >= target - 5) return 'text-yellow-700';
    return 'text-red-700';
  };

  const getEfficiencyBgColor = (efficiency: number, target: number) => {
    if (efficiency >= target + 5) return 'from-green-50 to-emerald-50 border-green-200';
    if (efficiency >= target) return 'from-blue-50 to-indigo-50 border-blue-200';
    if (efficiency >= target - 5) return 'from-yellow-50 to-amber-50 border-yellow-200';
    return 'from-red-50 to-rose-50 border-red-200';
  };

  const getFactorColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-700';
      case 'good': return 'bg-blue-100 text-blue-700';
      case 'needs-attention': return 'bg-yellow-100 text-yellow-700';
      case 'poor': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 shadow-xl flex flex-col">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white px-6 py-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Efficiency Overview</h3>
              <p className="text-blue-100 text-sm mt-1">Performance summary</p>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {/* Overall Efficiency */}
          <div className={`bg-gradient-to-br ${getEfficiencyBgColor(todaysSummary.overallEfficiency, todaysSummary.target)} rounded-xl p-5 border shadow-sm hover:shadow-md transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-wide">Overall Efficiency</p>
              <Award className="w-4 h-4" />
            </div>
            <p className={`text-5xl font-bold ${getEfficiencyColor(todaysSummary.overallEfficiency, todaysSummary.target)} mb-1`}>
              {todaysSummary.overallEfficiency}<span className="text-2xl">%</span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
              <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${todaysSummary.overallEfficiency}%` }} />
            </div>
            <p className="text-xs mt-2">Target: {todaysSummary.target}%</p>
          </div>

          {/* Above Target */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Above Target</p>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-4xl font-bold text-green-700">{todaysSummary.aboveTarget}</p>
            <p className="text-xs text-green-600 mt-2">Theatres</p>
          </div>

          {/* Below Target */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Below Target</p>
              <TrendingDown className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-4xl font-bold text-red-700">{todaysSummary.belowTarget}</p>
            <p className="text-xs text-red-600 mt-2">Theatres</p>
          </div>

          {/* Best Performance */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Top Performer</p>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-lg font-bold text-amber-700">{todaysSummary.bestTheatre}</p>
            <p className="text-xs text-amber-600 mt-2">Highest efficiency today</p>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white px-8 py-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Efficiency Score Analysis</h1>
                <p className="text-blue-100 text-sm mt-1">Comprehensive theatre performance metrics</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-xs text-blue-100">Last Updated</p>
              <p className="text-sm font-semibold">Just now</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-b border-gray-200 px-8 py-5 shadow-sm">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-semibold text-gray-700">Unit:</span>
            {(['all', 'main', 'acad'] as FilterUnit[]).map((unit) => (
              <button
                key={unit}
                onClick={() => setSelectedUnit(unit)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  selectedUnit === unit ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {unit === 'all' ? 'All Units' : unit === 'main' ? 'Main Theatres' : 'DSU Theatres'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="grid grid-cols-2 gap-6">
            {filteredTheatres.map((theatre) => (
              <div
                key={theatre.theatre}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedTheatre(selectedTheatre === theatre.theatre ? null : theatre.theatre)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">{theatre.theatre}</h3>
                  {theatre.trend === 'improving' ? <TrendingUp className="w-5 h-5 text-green-600" /> :
                   theatre.trend === 'worsening' ? <TrendingDown className="w-5 h-5 text-red-600" /> :
                   <Activity className="w-5 h-5 text-gray-600" />}
                </div>

                {/* Efficiency Score Display */}
                <div className={`bg-gradient-to-br ${getEfficiencyBgColor(theatre.efficiency, theatre.target)} rounded-xl p-6 border mb-4`}>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2">Efficiency Score</p>
                  <p className={`text-6xl font-bold ${getEfficiencyColor(theatre.efficiency, theatre.target)}`}>
                    {theatre.efficiency}<span className="text-3xl">%</span>
                  </p>
                  <div className="w-full bg-gray-300 rounded-full h-3 mt-4">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full" style={{ width: `${theatre.efficiency}%` }} />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs font-semibold text-blue-700 mb-1">Scheduled</p>
                    <p className="text-2xl font-bold text-blue-900">{theatre.casesScheduled}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                    <p className="text-xs font-semibold text-green-700 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-green-900">{theatre.casesCompleted}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-200">
                    <p className="text-xs font-semibold text-orange-700 mb-1">In Progress</p>
                    <p className="text-2xl font-bold text-orange-900">{theatre.casesInProgress}</p>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedTheatre === theatre.theatre && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Performance Factors</p>
                    {theatre.factors.map((factor, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{factor.factor}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-gray-900">{factor.score}%</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${getFactorColor(factor.status)}`}>
                            {factor.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
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
