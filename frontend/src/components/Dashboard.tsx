import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CategorySummary {
  category: string;
  total: number;
  count: number;
}

interface Summary {
  categories: CategorySummary[];
  total: number;
  transactionCount: number;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchSummary();
  }, [dateRange]);

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions/summary`, {
        params: dateRange
      });
      setSummary(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch summary data');
      setLoading(false);
    }
  };

  const chartData = {
    labels: summary?.categories.map(c => c.category) || [],
    datasets: [
      {
        label: 'Total Amount',
        data: summary?.categories.map(c => Math.abs(c.total)) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Spending by Category'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount ($)'
        }
      }
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!summary) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Spending Summary</h2>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">From</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">To</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900">Total Spending</h3>
            <p className="text-2xl font-bold text-blue-600">${Math.abs(summary.total).toFixed(2)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-900">Categories</h3>
            <p className="text-2xl font-bold text-green-600">{summary.categories.length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-purple-900">Transactions</h3>
            <p className="text-2xl font-bold text-purple-600">{summary.transactionCount}</p>
          </div>
        </div>

        <div className="h-96">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Category Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.categories.map((category) => (
              <div key={category.category} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">{category.category}</h4>
                <p className="text-lg font-bold text-gray-700">${Math.abs(category.total).toFixed(2)}</p>
                <p className="text-sm text-gray-500">{category.count} transactions</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}