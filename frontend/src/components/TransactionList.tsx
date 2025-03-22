import { useState, useEffect } from 'react';
import axios from 'axios';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string | null;
  notes: string | null;
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch transactions');
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (transactionId: number) => {
    try {
      await axios.put(`http://localhost:5000/api/transactions/${transactionId}/category`, JSON.stringify(newCategory), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setEditingCategory(null);
      setNewCategory('');
      fetchTransactions();
    } catch (err) {
      setError('Failed to update category');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                {transaction.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingCategory === transaction.id ? (
                  <input
                    type="text"
                    className="border rounded px-2 py-1"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateCategory(transaction.id);
                      }
                    }}
                  />
                ) : (
                  transaction.category || 'Uncategorized'
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingCategory === transaction.id ? (
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => handleUpdateCategory(transaction.id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => {
                      setEditingCategory(transaction.id);
                      setNewCategory(transaction.category || '');
                    }}
                  >
                    Edit Category
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}