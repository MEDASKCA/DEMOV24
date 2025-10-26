'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Coffee,
  Utensils,
  UserCheck,
  Shield,
  Award,
  Send,
  ChevronRight,
  Filter,
  AlertTriangle
} from 'lucide-react';

interface StaffReliefViewProps {
  onBack: () => void;
}

interface ReliefRequest {
  id: string;
  requestedBy: {
    name: string;
    role: string;
    theatre: string;
    currentShiftStart: string;
  };
  reason: string;
  duration: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  requestedAt: string;
  status: 'pending' | 'acknowledged' | 'deployed';
  deployedStaff?: string;
}

export default function StaffReliefView({ onBack }: StaffReliefViewProps) {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const reliefRequests: ReliefRequest[] = [
    {
      id: '1',
      requestedBy: {
        name: 'S. Patel',
        role: 'Anaes N/P',
        theatre: 'Main Theatre 3',
        currentShiftStart: '08:00'
      },
      reason: 'Coffee/Rest Break',
      duration: '15 min',
      urgency: 'routine',
      requestedAt: '10:45',
      status: 'pending'
    },
    {
      id: '2',
      requestedBy: {
        name: 'M. Johnson',
        role: 'Scrub N/P',
        theatre: 'Main Theatre 5',
        currentShiftStart: '08:00'
      },
      reason: 'Lunch Break',
      duration: '30 min',
      urgency: 'routine',
      requestedAt: '12:15',
      status: 'acknowledged'
    },
    {
      id: '3',
      requestedBy: {
        name: 'A. Williams',
        role: 'Recovery Nurse',
        theatre: 'Main Recovery',
        currentShiftStart: '08:00'
      },
      reason: 'Emergency Toilet Break',
      duration: '10 min',
      urgency: 'urgent',
      requestedAt: '11:20',
      status: 'deployed',
      deployedStaff: 'K. Martinez (Bank)'
    },
    {
      id: '4',
      requestedBy: {
        name: 'R. Thompson',
        role: 'Anaes N/P',
        theatre: 'DSU Theatre 2',
        currentShiftStart: '08:00'
      },
      reason: 'Supper Break',
      duration: '20 min',
      urgency: 'routine',
      requestedAt: '18:30',
      status: 'pending'
    },
    {
      id: '5',
      requestedBy: {
        name: 'L. Garcia',
        role: 'Scrub N/P',
        theatre: 'Main Theatre 8',
        currentShiftStart: '13:00'
      },
      reason: 'Medical Emergency - Unwell',
      duration: 'Unknown',
      urgency: 'emergency',
      requestedAt: '14:15',
      status: 'acknowledged'
    }
  ];

  const summary = {
    totalRequests: reliefRequests.length,
    pending: reliefRequests.filter(r => r.status === 'pending').length,
    acknowledged: reliefRequests.filter(r => r.status === 'acknowledged').length,
    deployed: reliefRequests.filter(r => r.status === 'deployed').length,
    urgent: reliefRequests.filter(r => r.urgency === 'urgent').length,
    emergency: reliefRequests.filter(r => r.urgency === 'emergency').length
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-100 text-red-700 border-red-300';
      case 'urgent': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'routine': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'bg-green-100 text-green-700';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-700';
      case 'pending': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getReasonIcon = (reason: string) => {
    if (reason.toLowerCase().includes('coffee') || reason.toLowerCase().includes('tea')) {
      return <Coffee className="w-5 h-5" />;
    }
    if (reason.toLowerCase().includes('lunch') || reason.toLowerCase().includes('supper')) {
      return <Utensils className="w-5 h-5" />;
    }
    if (reason.toLowerCase().includes('emergency')) {
      return <AlertTriangle className="w-5 h-5" />;
    }
    return <Clock className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 shadow-xl flex flex-col">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white px-6 py-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Relief Summary</h3>
              <p className="text-blue-100 text-sm mt-1">Current requests</p>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {/* Total Requests */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Total Requests</p>
              <Bell className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-4xl font-bold text-blue-700">{summary.totalRequests}</p>
            <p className="text-xs text-blue-600 mt-2">Active relief requests</p>
          </div>

          {/* Pending */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Pending</p>
              <Clock className="w-4 h-4 text-gray-600" />
            </div>
            <p className="text-4xl font-bold text-gray-700">{summary.pending}</p>
            <p className="text-xs text-gray-600 mt-2">Awaiting response</p>
          </div>

          {/* Acknowledged */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5 border border-yellow-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">Acknowledged</p>
              <CheckCircle className="w-4 h-4 text-yellow-600" />
            </div>
            <p className="text-4xl font-bold text-yellow-700">{summary.acknowledged}</p>
            <p className="text-xs text-yellow-600 mt-2">Being processed</p>
          </div>

          {/* Deployed */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Deployed</p>
              <UserCheck className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-4xl font-bold text-green-700">{summary.deployed}</p>
            <p className="text-xs text-green-600 mt-2">Relief staff deployed</p>
          </div>

          {/* Emergency */}
          {summary.emergency > 0 && (
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Emergency</p>
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-4xl font-bold text-red-700">{summary.emergency}</p>
              <p className="text-xs text-red-600 mt-2">Urgent attention required</p>
            </div>
          )}
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
                <h1 className="text-3xl font-bold tracking-tight">Staff Relief Management</h1>
                <p className="text-blue-100 text-sm mt-1">Real-time relief request tracking and deployment</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-xs text-blue-100">Last Updated</p>
              <p className="text-sm font-semibold">Just now</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-4">
            {reliefRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      request.urgency === 'emergency' ? 'bg-red-100 text-red-600' :
                      request.urgency === 'urgent' ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {getReasonIcon(request.reason)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{request.requestedBy.name}</h3>
                      <p className="text-sm text-gray-600">{request.requestedBy.role} • {request.requestedBy.theatre}</p>
                      <p className="text-xs text-gray-500 mt-1">Shift started: {request.requestedBy.currentShiftStart}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency.toUpperCase()}
                    </span>
                    <p className="text-xs text-gray-500 mt-2">Requested: {request.requestedAt}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs font-semibold text-blue-700 mb-1">Reason</p>
                    <p className="text-sm text-blue-900 font-medium">{request.reason}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-xs font-semibold text-purple-700 mb-1">Duration</p>
                    <p className="text-sm text-purple-900 font-medium">{request.duration}</p>
                  </div>
                  <div className={`bg-gradient-to-br rounded-lg p-4 border ${
                    request.status === 'deployed' ? 'from-green-50 to-emerald-50 border-green-200' :
                    request.status === 'acknowledged' ? 'from-yellow-50 to-amber-50 border-yellow-200' :
                    'from-gray-50 to-slate-50 border-gray-200'
                  }`}>
                    <p className={`text-xs font-semibold mb-1 ${
                      request.status === 'deployed' ? 'text-green-700' :
                      request.status === 'acknowledged' ? 'text-yellow-700' :
                      'text-gray-700'
                    }`}>Status</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${getStatusColor(request.status)}`}>
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {request.status === 'deployed' && request.deployedStaff && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <p className="text-xs font-bold text-green-900 mb-2 uppercase tracking-wide flex items-center">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Relief Staff Deployed
                    </p>
                    <p className="text-sm text-green-800 font-semibold">{request.deployedStaff}</p>
                  </div>
                )}

                {request.status === 'pending' && (
                  <div className="mt-4 flex items-center space-x-3">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Acknowledge Request</span>
                    </button>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>Deploy Relief Staff</span>
                    </button>
                  </div>
                )}

                {request.status === 'acknowledged' && (
                  <div className="mt-4">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>Deploy Relief Staff</span>
                    </button>
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
