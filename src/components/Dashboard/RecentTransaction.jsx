'use client';

export default function RecentTransactions({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No recent transactions found.</p>
      </div>
    );
  }

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

  return (
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
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
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
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${getTransactionColor(transaction.type)}`}>
                {transaction.type === 'expense' ? '- ' : ''}
                {parseFloat(transaction.amount).toLocaleString('id-ID', { 
                  style: 'currency', 
                  currency: 'IDR' 
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}