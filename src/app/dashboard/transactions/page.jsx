'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, createTransaction } from '@/src/store/slice/transactionSlice';
import { fetchAccounts } from '@/src/store/slice/accountSlice';

export default function TransactionsPage() {
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    description: '',
    date: new Date().toISOString().split('T')[0],
    accountId: '',
    categoryId: ''
  });

  const dispatch = useDispatch();
  const { transactions, loading, error } = useSelector(state => state.transactions);
  const { accounts } = useSelector(state => state.accounts);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchAccounts());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createTransaction({
      ...formData,
      amount: parseFloat(formData.amount)
    }));
    setShowModal(false);
    setFormData({
      amount: '',
      type: 'expense',
      description: '',
      date: new Date().toISOString().split('T')[0],
      accountId: '',
      categoryId: ''
    });
  };

  const filteredTransactions = filterType === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filterType);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'income':
        return '↓';
      case 'expense':
        return '↑';
      case 'transfer':
        return '↔';
      default:
        return '•';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'income':
        return 'text-green-600';
      case 'expense':
        return 'text-red-600';
      case 'transfer':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  // Sample categories - in a real app, these would come from the API
  const categories = [
    { id: '1', name: 'Food & Dining', type: 'expense' },
    { id: '2', name: 'Transportation', type: 'expense' },
    { id: '3', name: 'Housing', type: 'expense' },
    { id: '4', name: 'Utilities', type: 'expense' },
    { id: '5', name: 'Entertainment', type: 'expense' },
    { id: '6', name: 'Healthcare', type: 'expense' },
    { id: '7', name: 'Salary', type: 'income' },
    { id: '8', name: 'Investment', type: 'income' },
    { id: '9', name: 'Gifts', type: 'income' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Add Transaction
        </button>
      </div>

      <div className="mb-6 flex items-center space-x-2">
        <span className="text-gray-600">Filter:</span>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded-md ${filterType === 'all' ? 'bg-gray-200' : 'bg-white'}`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${filterType === 'income' ? 'bg-green-100 text-green-700' : 'bg-white'}`}
            onClick={() => setFilterType('income')}
          >
            Income
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${filterType === 'expense' ? 'bg-red-100 text-red-700' : 'bg-white'}`}
            onClick={() => setFilterType('expense')}
          >
            Expense
          </button>
          <button 
            className={`px-3 py-1 rounded-md ${filterType === 'transfer' ? 'bg-blue-100 text-blue-700' : 'bg-white'}`}
            onClick={() => setFilterType('transfer')}
          >
            Transfer
          </button>
        </div>
      </div>

      {loading && <p className="text-center py-4">Loading transactions...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No transactions found. Add a transaction to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`mr-2 ${getTransactionColor(transaction.type)}`}>
                          {getTransactionIcon(transaction.type)}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.Category?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.Account?.name || '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'expense' ? '- ' : ''}
                      {parseFloat(transaction.amount).toLocaleString('id-ID', { 
                        style: 'currency', 
                        currency: 'IDR' 
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </button>
                      <button className="ml-3 text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Transaction</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                  Transaction Type
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Grocery shopping"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                  Amount
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                  Date
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accountId">
                  Account
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="accountId"
                  name="accountId"
                  value={formData.accountId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryId">
                  Category
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories
                    .filter(category => category.type === formData.type || formData.type === 'transfer')
                    .map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))
                  }
                </select>
              </div>
              
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}