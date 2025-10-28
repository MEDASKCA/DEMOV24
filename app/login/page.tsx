  'use client';

  import React from 'react';
  import { useRouter } from 'next/navigation';
  import { ChevronLeft } from 'lucide-react';

  export default function TermsPage() {
    const router = useRouter();

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 text-white">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">Non-Disclosure Agreement</h1>
            <p className="text-white/90 text-sm mt-1">MEDASKCA Healthcare Operations Platform</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <p className="text-sm text-gray-500 mb-6">Effective Date: {new Date().toLocaleDateString('en-GB')}</p>

            <div className="prose prose-gray max-w-none space-y-6">
              {/* Introduction */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction and Purpose</h2>
                <p className="text-gray-700 leading-relaxed">
                  This Non-Disclosure Agreement ("Agreement") is entered into between MEDASKCA ("Disclosing Party") and you ("Recipient") regarding access to and use of the MEDASKCA Healthcare Operations
  Platform (the "Platform"). This Agreement governs the protection of Confidential Information disclosed through the Platform, which is designed for NHS healthcare professionals and operations managers.
                </p>
              </section>

              {/* Definition of Confidential Information */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Definition of Confidential Information</h2>
                <p className="text-gray-700 leading-relaxed mb-2">
                  "Confidential Information" includes, but is not limited to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>All data, information, and content accessed through the Platform</li>
                  <li>Theatre operations data, schedules, and resource allocation information</li>
                  <li>Staff information, rosters, and professional profiles</li>
                  <li>Operational metrics, analytics, and performance data</li>
                  <li>System architecture, features, and functionality details</li>
                  <li>Business strategies, methodologies, and processes</li>
                  <li>Any information marked as confidential or proprietary</li>
                  <li>Any information that would reasonably be considered confidential given its nature and the circumstances of disclosure</li>
                </ul>
              </section>

              {/* Obligations of Recipient */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Obligations of Recipient</h2>
                <p className="text-gray-700 leading-relaxed mb-2">
                  The Recipient agrees to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Maintain the confidentiality of all Confidential Information accessed through the Platform</li>
                  <li>Use Confidential Information solely for authorized professional purposes within their NHS role</li>
                  <li>Not disclose Confidential Information to any third party without prior written consent from MEDASKCA</li>
                  <li>Take reasonable measures to protect Confidential Information from unauthorized access or disclosure</li>
                  <li>Not copy, reproduce, or create derivative works from Confidential Information except as necessary for authorized use</li>
                  <li>Return or destroy all Confidential Information upon request or termination of access</li>
                  <li>Report any unauthorized access or potential breach immediately to MEDASKCA</li>
                </ul>
              </section>

              {/* Demo Version Notice */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Demo and Pilot Phase</h2>
                <p className="text-gray-700 leading-relaxed">
                  The Platform is currently in demo/pilot phase as part of the NHS Clinical Entrepreneur Programme. All features, data, and information accessed during this phase are considered
  Confidential Information subject to this Agreement. Recipient agrees not to disclose the existence, features, or performance of the Platform to unauthorized parties.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  For questions about this Agreement or to report a breach, contact:
                </p>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 font-medium">MEDASKCA</p>
                  <p className="text-gray-600 text-sm">Email: legal@medaskca.com</p>
                  <p className="text-gray-600 text-sm">Security: security@medaskca.com</p>
                  <p className="text-gray-600 text-sm">Website: www.medaskca.com</p>
                </div>
              </section>

              {/* Acknowledgment */}
              <section className="border-t pt-6 mt-8 bg-amber-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Acknowledgment and Acceptance</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By clicking "I Accept" or signing in to the Platform, you acknowledge that you have read, understood, and agree to be bound by the terms of this Non-Disclosure Agreement.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
