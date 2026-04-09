"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load heavy components
const ProfileContent = dynamic(
  () => import('@/components/ProfileContent'),
  {
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    ),
    ssr: false
  }
);

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
