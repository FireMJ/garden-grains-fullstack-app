import { ReactNode } from 'react';
import StaffNavbar from '@/components/layout/StaffNavbar';

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <StaffNavbar />
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
