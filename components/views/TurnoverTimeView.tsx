'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Filter,
  BarChart3,
  Calendar,
  Minus
} from 'lucide-react';

interface TurnoverTimeViewProps {
  onBack: () => void;
}

type FilterUnit = 'all' | 'main' | 'acad' | 'recovery';

export default function TurnoverTimeView({ onBack }: TurnoverTimeViewProps) {
  const [selectedUnit, setSelectedUnit] = useState<FilterUnit>('all');

  const todaysSummary = {
    averageTurnover: 18,
    target: 20,
    bestTheatre: 'Main Theatre 4',
    worstTheatre: 'Main Theatre 7',
    totalTurnovers: 47,
    onTarget: 34,
    delayed: 13
  };

  const theatreData = [
    {
      theatre: 'Main Theatre 1',
      unit: 'main',
      currentTurnover: 15,
      avgTurnover: 16,
      target: 20,
      turnoversToday: 4,
      onTarget: 3,
      delayed: 1,
      trend: 'improving',
      delayReasons: [
        { reason: 'Equipment setup delay', time: '09:30', duration: '8 min' }
      ],
      lastTurnover: '11:45',
      nextCase: '12:00'
    },
    {
      theatre: 'Main Theatre 2',
      unit: 'main',
      currentTurnover: 22,
      avgTurnover: 19,
      target: 20,
      turnoversToday: 3,
      onTarget: 2,
      delayed: 1,
      trend: 'worsening',
      delayReasons: [
        { reason: 'Cleaning required - spillage', time: '10:15', duration: '5 min' }
      ],
      lastTurnover: '10:37',
      nextCase: '11:00'
    },
    {
      theatre: 'Main Theatre 3',
      unit: 'main',
      currentTurnover: 17,
      avgTurnover: 17,
      target: 20,
      turnoversToday: 5,
      onTarget: 5,
      delayed: 0,
      trend: 'stable',
      delayReasons: [],
      lastTurnover: '13:12',
      nextCase: '13:30'
    },
    {
      theatre: 'Main Theatre 4',
      unit: 'main',
      currentTurnover: 12,
      avgTurnover: 14,
      target: 20,
      turnoversToday: 6,
      onTarget: 6,
      delayed: 0,
      trend: 'improving',
      delayReasons: [],
      lastTurnover: '14:20',
      nextCase: '14:35'
    },
    {
      theatre: 'Main Theatre 5',
      unit: 'main',
      currentTurnover: 19,
      avgTurnover: 18,
      target: 20,
      turnoversToday: 4,
      onTarget: 3,
      delayed: 1,
      trend: 'stable',
      delayReasons: [
        { reason: 'Patient handover delay', time: '11:05', duration: '3 min' }
      ],
      lastTurnover: '11:08',
      nextCase: '11:30'
    },
    {
      theatre: 'Main Theatre 7',
      unit: 'main',
      currentTurnover: 28,
      avgTurnover: 25,
      target: 20,
      turnoversToday: 2,
      onTarget: 0,
      delayed: 2,
      trend: 'worsening',
      delayReasons: [
        { reason: 'Porter delay', time: '08:45', duration: '10 min' },
        { reason: 'Missing equipment', time: '10:30', duration: '8 min' }
      ],
      lastTurnover: '10:38',
      nextCase: '11:15'
    },
    {
      theatre: 'Main Theatre 8',
      unit: 'main',
      currentTurnover: 16,
      avgTurnover: 16,
      target: 20,
      turnoversToday: 5,
      onTarget: 5,
      delayed: 0,
      trend: 'stable',
      delayReasons: [],
      lastTurnover: '12:50',
      nextCase: '13:10'
    },
    {
      theatre: 'DSU Theatre 1',
      unit: 'acad',
      currentTurnover: 20,
      avgTurnover: 19,
      target: 20,
      turnoversToday: 3,
      onTarget: 3,
      delayed: 0,
      trend: 'stable',
      delayReasons: [],
      lastTurnover: '11:30',
      nextCase: '11:50'
    },
    {
      theatre: 'DSU Theatre 2',
      unit: 'acad',
      currentTurnover: 21,
      avgTurnover: 20,
      target: 20,
      turnoversToday: 3,
      onTarget: 2,
      delayed: 1,
      trend: 'stable',
      delayReasons: [
        { reason: 'Implant preparation', time: '09:20', duration: '4 min' }
      ],
      lastTurnover: '09:24',
      nextCase: '09:45'
    },
    {
      theatre: 'DSU Theatre 3',
      unit: 'acad',
      currentTurnover: 18,
      avgTurnover: 17,
      target: 20,
      turnoversToday: 4,
      onTarget: 4,
      delayed: 0,
      trend: 'improving',
      delayReasons: [],
      lastTurnover: '13:45',
      nextCase: '14:05'
    }
  ];

  const filteredTheatres = theatreData.filter(theatre => {
    if (selectedUnit === 'all') return true;
    return theatre.unit === selectedUnit;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'worsening':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'stable':
        return <Minus className="w-5 h-5 text-gray-600" />;
      default:
        return null;
    }
  };

  const getPerformanceColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage <= 75) return 'bg-green-600';
    if (percentage <= 100) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getPerformanceTextColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage <= 75) return 'text-green-700';
    if (percentage <= 100) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Left Sidebar - Premium Stats Panel */}
      <div className="w-80 bg-white border-r border-gray-200 shadow-xl flex flex-col">
        {/* Left Header with Gradient */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white px-6 py-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Performance</h3>
              <p className="text-blue-100 text-sm mt-1">Today's metrics</p>
            </div>
          </div>
        </div>

        {/* Stats Content - Premium Cards */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {/* Average Turnover */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Average Turnover</p>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-4xl font-bold text-blue-700 mb-1">{todaysSummary.averageTurnover}<span className="text-xl text-blue-500">min</span></p>
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-blue-600">Target: {todaysSummary.target} min</span>
              <span className="text-green-600 font-semibold">✓ Within target</span>
            </div>
          </div>

          {/* Total Turnovers */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Total Turnovers</p>
              <BarChart3 className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-4xl font-bold text-green-700">{todaysSummary.totalTurnovers}</p>
            <p className="text-xs text-green-600 mt-2">Completed today</p>
          </div>

          {/* On Target */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">On Target</p>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-4xl font-bold text-emerald-700">{todaysSummary.onTarget}</p>
            <div className="w-full bg-emerald-200 rounded-full h-2 mt-3">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all"
                style={{ width: `${(todaysSummary.onTarget / todaysSummary.totalTurnovers) * 100}%` }}
              />
            </div>
          </div>

          {/* Delayed */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Delayed</p>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-4xl font-bold text-red-700">{todaysSummary.delayed}</p>
            <p className="text-xs text-red-600 mt-2">Exceeded target</p>
          </div>

          {/* Best Performance */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Best Performance</p>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-lg font-bold text-amber-700">{todaysSummary.bestTheatre}</p>
            <p className="text-xs text-amber-600 mt-2">Fastest turnover today</p>
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
                <h1 className="text-3xl font-bold tracking-tight">Turnover Time Analysis</h1>
                <p className="text-blue-100 text-sm mt-1">Real-time theatre turnover performance tracking</p>
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

        {/* Premium Unit Filter */}
        <div className="bg-white border-b border-gray-200 px-8 py-5 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">Unit:</span>
            </div>
            <div className="flex items-center space-x-2">
              {(['all', 'main', 'acad'] as FilterUnit[]).map((unit) => (
                <button
                  key={unit}
                  onClick={() => setSelectedUnit(unit)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    selectedUnit === unit
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {unit === 'all' ? 'All Units' : unit === 'main' ? 'Main Theatres' : 'DSU Theatres'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Theatre Cards - Premium Grid */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="grid grid-cols-2 gap-6">
            {filteredTheatres.map((theatre) => (
              <div key={theatre.theatre} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all">
                {/* Theatre Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{theatre.theatre}</h3>
                    <p className="text-sm text-gray-600">Last: {theatre.lastTurnover} • Next: {theatre.nextCase}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(theatre.trend)}
                  </div>
                </div>

                {/* Current Turnover - Large Display */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200 mb-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Current Turnover</p>
                  <div className="flex items-baseline space-x-2">
                    <p className={`text-5xl font-bold ${getPerformanceTextColor(theatre.currentTurnover, theatre.target)}`}>
                      {theatre.currentTurnover}
                    </p>
                    <span className="text-2xl text-gray-500">min</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <div
                      className={`${getPerformanceColor(theatre.currentTurnover, theatre.target)} h-3 rounded-full transition-all`}
                      style={{ width: `${Math.min((theatre.currentTurnover / theatre.target) * 100, 100)}%` }}
                    />
                    {/* Target marker */}
                    <div className="absolute top-0 h-3 w-0.5 bg-gray-800" style={{ left: '100%' }} />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-gray-600">Target: {theatre.target} min</span>
                    <span className={`font-semibold ${getPerformanceTextColor(theatre.currentTurnover, theatre.target)}`}>
                      {theatre.currentTurnover <= theatre.target ? '✓ On target' : `+${theatre.currentTurnover - theatre.target} min`}
                    </span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs font-semibold text-blue-700 mb-1">Today</p>
                    <p className="text-2xl font-bold text-blue-900">{theatre.turnoversToday}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                    <p className="text-xs font-semibold text-green-700 mb-1">On Time</p>
                    <p className="text-2xl font-bold text-green-900">{theatre.onTarget}</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-3 border border-red-200">
                    <p className="text-xs font-semibold text-red-700 mb-1">Delayed</p>
                    <p className="text-2xl font-bold text-red-900">{theatre.delayed}</p>
                  </div>
                </div>

                {/* Delay Reasons */}
                {theatre.delayReasons.length > 0 && (
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                    <p className="text-xs font-bold text-orange-900 mb-2 uppercase tracking-wide flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Delay Reasons
                    </p>
                    <div className="space-y-2">
                      {theatre.delayReasons.map((delay, idx) => (
                        <div key={idx} className="text-sm text-orange-800">
                          <p className="font-semibold">{delay.time} - {delay.reason}</p>
                          <p className="text-xs text-orange-600">Duration: {delay.duration}</p>
                        </div>
                      ))}
                    </div>
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
