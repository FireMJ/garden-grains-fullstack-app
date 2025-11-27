import { ReactNode } from 'react';
import AdminNavbar from '@/components/layout/AdminNavbar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
