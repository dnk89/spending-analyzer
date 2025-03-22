import React, { useEffect, useState } from 'react';

interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  category: string;
}

interface DashboardStats {
  totalSpent: number;
  topCategories: { category: string; amount: number }[];
  recentTransactions: Transaction[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!stats) {
    return <div className="text-center">No data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Total Spent</h2>
        <p className="text-3xl font-bold text-blue-600">
          ${stats.totalSpent.toFixed(2)}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Top Categories</h2>
        <div className="space-y-4">
          {stats.topCategories.map((category) => (
            <div key={category.category} className="flex justify-between items-center">
              <span className="text-gray-700">{category.category}</span>
              <span className="font-semibold">${category.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          {stats.recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.category}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${transaction.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;