'use client';

import { Mail, Phone, MapPin, Calendar, Award, BookOpen, Briefcase, Building2, Clock, UserCheck, Linkedin } from 'lucide-react';

interface StaffData {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  role: string;
  roleCode: string;
  department: string;
  departmentCode: string;
  band: string;
  seniority: string;
  yearsExperience: number;
  employmentType: string;
  currentHospital: string;
  currentHospitalId: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    postcode: string;
    coordinates: { lat: number; lng: number };
  };
  registrationNumber: string;
  registrationExpiry: string;
  specialties: string[];
  qualifications: string[];
  training: string[];
  procedureFamiliarity?: string[];
  instrumentationKnowledge?: string[];
  linkedInProfile?: string;
  availability?: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  shiftPreferences?: string[];
  certifications?: string[];
  notes?: string;
  createdAt: string;
}

interface DynamicProfileProps {
  staffData: StaffData;
}

export default function DynamicProfile({ staffData }: DynamicProfileProps) {
  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(staffData.dateOfBirth);

  // Get initials for avatar
  const initials = `${staffData.firstName[0]}${staffData.lastName[0]}`.toUpperCase();

  // Format shift preferences
  const formatShiftPreference = (shift: string) => {
    const shiftMap: { [key: string]: string } = {
      'STD_DAY': 'Standard Day',
      'EARLY': 'Early',
      'LATE': 'Late',
      'LONG_DAY': 'Long Day',
      'NIGHT': 'Night',
    };
    return shiftMap[shift] || shift;
  };

  // Get available days
  const getAvailableDays = () => {
    if (!staffData.availability) return [];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days
      .filter(day => staffData.availability![day as keyof typeof staffData.availability])
      .map(day => day.charAt(0).toUpperCase() + day.slice(1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-48"></div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-12">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-xl border-4 border-white">
                  {initials}
                </div>
              </div>

              {/* Name and Title */}
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{staffData.fullName}</h1>
                <p className="text-xl text-gray-600 mt-1">{staffData.role}</p>
                <p className="text-lg text-gray-500 mt-1">{staffData.department}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {staffData.band}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {staffData.seniority}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {staffData.employmentType}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">{staffData.currentHospital}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <a href={`mailto:${staffData.email}`} className="text-sm hover:text-blue-600">
                    {staffData.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <a href={`tel:${staffData.phone}`} className="text-sm hover:text-blue-600">
                    {staffData.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">{staffData.address.city}, {staffData.address.postcode}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">{staffData.yearsExperience} years experience</span>
                </div>
                {staffData.linkedInProfile && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <a href={staffData.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-blue-600">
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="border-t border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 sm:p-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                {staffData.notes && (
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                      About
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{staffData.notes}</p>
                  </section>
                )}

                {/* Specialties */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Specialties
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {staffData.specialties.map((specialty, index) => (
                      <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Qualifications */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Qualifications
                  </h2>
                  <ul className="space-y-2">
                    {staffData.qualifications.map((qual, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                        <span>{qual}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Training & Certifications */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Training & Certifications
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {staffData.training.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Procedure Familiarity */}
                {staffData.procedureFamiliarity && staffData.procedureFamiliarity.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      Procedure Familiarity
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {staffData.procedureFamiliarity.map((proc, index) => (
                        <span key={index} className="px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
                          {proc}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Instrumentation Knowledge */}
                {staffData.instrumentationKnowledge && staffData.instrumentationKnowledge.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      Instrumentation Knowledge
                    </h2>
                    <ul className="space-y-2">
                      {staffData.instrumentationKnowledge.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="w-2 h-2 bg-purple-600 rounded-full mt-2"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Professional Details */}
                <section className="bg-gray-50 p-5 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h2>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Staff ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-mono">{staffData.id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Registration Number</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-mono">{staffData.registrationNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Registration Expiry</dt>
                      <dd className="mt-1 text-sm text-gray-900">{new Date(staffData.registrationExpiry).toLocaleDateString('en-GB')}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Role Code</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-mono">{staffData.roleCode}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Department Code</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-mono">{staffData.departmentCode}</dd>
                    </div>
                  </dl>
                </section>

                {/* Personal Info */}
                <section className="bg-gray-50 p-5 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                      <dd className="mt-1 text-sm text-gray-900">{new Date(staffData.dateOfBirth).toLocaleDateString('en-GB')} ({age} years)</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Gender</dt>
                      <dd className="mt-1 text-sm text-gray-900">{staffData.gender}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {staffData.address.line1}<br />
                        {staffData.address.line2}<br />
                        {staffData.address.city}<br />
                        {staffData.address.postcode}
                      </dd>
                    </div>
                  </dl>
                </section>

                {/* Availability */}
                {staffData.availability && (
                  <section className="bg-gray-50 p-5 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability</h2>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-700">
                        <strong>Available Days:</strong>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {getAvailableDays().map(day => (
                            <span key={day} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              {day.slice(0, 3)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Shift Preferences */}
                {staffData.shiftPreferences && staffData.shiftPreferences.length > 0 && (
                  <section className="bg-gray-50 p-5 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Shift Preferences</h2>
                    <div className="flex flex-wrap gap-2">
                      {staffData.shiftPreferences.map((shift, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {formatShiftPreference(shift)}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Hospital Info */}
                <section className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                  <h2 className="text-lg font-semibold text-blue-900 mb-2">Current Hospital</h2>
                  <p className="text-sm text-blue-800 font-medium">{staffData.currentHospital}</p>
                  <p className="text-xs text-blue-600 mt-1 font-mono">{staffData.currentHospitalId}</p>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg shadow hover:shadow-md transition-shadow border border-blue-200">
            <span>← Return to Dashboard</span>
          </a>
        </div>
      </div>
    </div>
  );
}
