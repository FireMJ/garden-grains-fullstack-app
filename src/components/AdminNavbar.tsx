'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaClipboardList, FaUsers, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

export default function AdminNavbar() {
  const { user, userRole, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: FaTachometerAlt, roles: ['admin'] },
    { href: '/dashboard', label: 'Orders', icon: FaClipboardList, roles: ['admin', 'staff'] },
    { href: '/admin/staff', label: 'Staff', icon: FaUsers, roles: ['admin'] },
  ];

  if (!user || (userRole !== 'admin' && userRole !== 'staff')) return null;

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-green-600 font-bold text-xl">🍽️ Garden & Grains</span>
            </Link>
            <div className="hidden md:flex gap-1">
              {navItems.map((item) => {
                if (item.roles.includes(userRole)) {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                        isActive(item.href)
                          ? 'bg-green-50 text-green-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="text-sm" />
                      <span>{item.label}</span>
                    </Link>
                  );
                }
                return null;
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.displayName || user.email}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 transition"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
