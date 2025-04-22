'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import LoginForm from '@/src/components/Auth/LoginForm';

export default function Home() {
  const { isAuthenticated } = useSelector(state => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Personal Finance Tracker</h1>
          <p className="text-gray-600 mt-2">Take control of your financial life</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}