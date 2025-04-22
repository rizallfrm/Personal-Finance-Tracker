"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccounts } from "@/src/store/slice/accountSlice";
import { fetchTransactions } from "@/src/store/slice/transactionSlice";
import DashboardSummary from "@/src/components/Dashboard/DashboardSummary";
import RecentTransactions from "@/src/components/Dashboard/RecentTransaction";
import AccountsOverview from "@/src/components/Dashboard/AccountsOverview";
// import ExpenseByCategoryChart from '@/src/components/Dashboard/ExpenseByCategoryChart';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { accounts } = useSelector((state) => state.accounts);
  const { transactions, isLoading } = useSelector(
    (state) => state.transactions
  );
  const { user } = useSelector((state) => state.auth);
  if (isLoading) {
    return <div>Loading...</div>;
  }


  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <DashboardSummary accounts={accounts} transactions={transactions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Accounts Overview</h2>
          <AccountsOverview accounts={accounts} />
        </div>

        {/* <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Expenses by Category</h2>
          <ExpenseByCategoryChart transactions={transactions} />
        </div> */}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <RecentTransactions transactions={transactions?.slice(0, 5) || []} />
      </div>
    </div>
  );
}
