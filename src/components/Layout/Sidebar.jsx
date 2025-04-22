'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  CreditCardIcon, 
  ArrowsRightLeftIcon, 
  ChartBarIcon,
  CogIcon,
  TagIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Accounts', href: '/dashboard/accounts', icon: CreditCardIcon },
    { name: 'Transactions', href: '/dashboard/transactions', icon: ArrowsRightLeftIcon },
    { name: 'Categories', href: '/dashboard/categories', icon: TagIcon },
    { name: 'Reports', href: '/dashboard/reports', icon: ChartBarIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
  ];

  return (
    <aside className="bg-white shadow-md w-64 hidden md:block">
      <div className="p-6 bg-primary text-white">
        <h2 className="text-xl font-bold">Finance Tracker</h2>
      </div>
      <nav className="mt-6">
        <ul>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                    isActive ? 'bg-gray-100 border-l-4 border-primary' : ''
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}