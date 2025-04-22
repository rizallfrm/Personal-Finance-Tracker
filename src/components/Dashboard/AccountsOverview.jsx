'use client';

export default function AccountsOverview({ accounts }) {
  if (!accounts || accounts.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No accounts found. Add an account to get started.</p>
      </div>
    );
  }

  const accountTypeIcons = {
    checking: '🏦',
    savings: '💰',
    credit: '💳',
    investment: '📈'
  };

  return (
    <div className="space-y-4">
      {accounts.map(account => (
        <div key={account.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{accountTypeIcons[account.type] || '🏦'}</span>
              <div>
                <h3 className="font-medium">{account.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{account.type} Account</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">
                {parseFloat(account.balance).toLocaleString('id-ID', { 
                  style: 'currency', 
                  currency: account.currency || 'IDR' 
                })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}