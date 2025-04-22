'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/src/store/slice/authSlice';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center md:hidden">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Notification and User info */}
          <div className="flex items-center">
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
              <BellIcon className="h-6 w-6" />
            </button>

            <div className="ml-4 relative flex-shrink-0">
              <div className="flex items-center">
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user?.username || 'User'}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {user?.email || 'user@example.com'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu links */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/dashboard"
              className="block pl-3 pr-4 py-2 border-l-4 border-primary text-base font-medium text-primary bg-indigo-50"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/accounts"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300"
            >
              Accounts
            </Link>
            <Link
              href="/dashboard/transactions"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300"
            >
              Transactions
            </Link>
            <Link
              href="/dashboard/categories"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300"
            >
              Categories
            </Link>
            <Link
              href="/dashboard/reports"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300"
            >
              Reports
            </Link>
            <Link
              href="/dashboard/settings"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300"
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
