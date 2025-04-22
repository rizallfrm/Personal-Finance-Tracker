'use client';

import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

export default function DashboardSummary({ accounts = [], transactions = [] }) {
  // Gunakan default parameter di atas atau:
  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  // Calculate total balance
  const totalBalance = safeAccounts.reduce((sum, account) => sum + (account.balance || 0), 0);

  // Calculate income and expenses for current month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const currentMonthTransactions = safeTransactions.filter(transaction => {
    try {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === currentMonth && 
        transactionDate.getFullYear() === currentYear
      );
    } catch {
      return false;
    }
  });
  
  const monthlyIncome = currentMonthTransactions
    .filter(transaction => transaction?.type === 'income')
    .reduce((sum, transaction) => sum + (parseFloat(transaction?.amount) || 0), 0);
    
  const monthlyExpenses = currentMonthTransactions
    .filter(transaction => transaction?.type === 'expense')
    .reduce((sum, transaction) => sum + (parseFloat(transaction?.amount) || 0), 0);

  const summaryCards = [
    {
      title: 'Total Balance',
      value: totalBalance.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }),
      icon: BanknotesIcon,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Monthly Income',
      value: monthlyIncome.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }),
      icon: ArrowTrendingUpIcon,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Monthly Expenses',
      value: monthlyExpenses.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }),
      icon: ArrowTrendingDownIcon,
      color: 'bg-red-100 text-red-600'
    }
  ];

  return (
    <>
      {summaryCards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </div>
            <div className={`p-3 rounded-full ${card.color}`}>
              <card.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}