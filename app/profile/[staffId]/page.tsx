'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import DynamicProfile from '@/features/profile/components/DynamicProfile';

export default function StaffProfilePage() {
  const params = useParams();
  const staffId = params.staffId as string;
  const [staffData, setStaffData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStaffProfile() {
      try {
        setLoading(true);
        const staffRef = doc(db, 'staffProfiles', staffId);
        const staffSnap = await getDoc(staffRef);

        if (staffSnap.exists()) {
          setStaffData({ id: staffSnap.id, ...staffSnap.data() });
        } else {
          setError(`Staff member ${staffId} not found`);
        }
      } catch (err) {
        console.error('Error fetching staff profile:', err);
        setError('Failed to load staff profile');
      } finally {
        setLoading(false);
      }
    }

    if (staffId) {
      fetchStaffProfile();
    }
  }, [staffId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !staffData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl">{error || 'Profile not found'}</p>
          <a href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <DynamicProfile staffData={staffData} />;
}
