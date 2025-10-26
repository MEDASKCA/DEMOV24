'use client';

import React from 'react';
import MobileProfile from './MobileProfile';

export default function DesktopProfile() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop wrapper - centers the profile with max width */}
      <div className="max-w-5xl mx-auto">
        <MobileProfile />
      </div>
    </div>
  );
}
