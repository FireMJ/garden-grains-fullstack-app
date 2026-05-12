'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUsers, FaClipboardList, FaStar, FaTruck, FaChartLine } from 'react-icons/fa';
import AdminNavbar from '@/components/AdminNavbar';

export default function AdminPage() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || userRole !== 'admin') {
        router.push('/login');
      }
    }
  }, [user, userRole, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user || userRole !== 'admin') {
    return null;
  }

  const adminSections = [
    { title: 'Order Management', description: 'View and manage all orders', icon: FaClipboardList, href: '/dashboard', color: 'bg-green-500' },
    { title: 'Staff Management', description: 'Add, edit, or remove staff members', icon: FaUsers, href: '/admin/staff', color: 'bg-blue-500' },
    { title: 'Reviews Moderation', description: 'Approve or reject customer reviews', icon: FaStar, href: '/admin/reviews', color: 'bg-yellow-500' },
    { title: 'Driver Management', description: 'Manage delivery drivers', icon: FaTruck, href: '/admin/drivers', color: 'bg-purple-500' },
    { title: 'Analytics', description: 'View sales and order analytics', icon: FaChartLine, href: '/admin/analytics', color: 'bg-indigo-500' },
  ];

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.displayName || user.email}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {adminSections.map((section) => (
              <Link key={section.href} href={section.href}>
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer group">
                  <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                    <section.icon className="text-white text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{section.title}</h3>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
