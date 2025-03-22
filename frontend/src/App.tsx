import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TransactionList from './components/TransactionList';
import TransactionUpload from './components/TransactionUpload';
import Dashboard from './components/Dashboard';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransactionsUpdated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  key={refreshKey} 
                />
              } 
            />
            <Route 
              path="/transactions" 
              element={
                <TransactionList 
                  key={refreshKey}
                />
              } 
            />
            <Route 
              path="/upload" 
              element={
                <TransactionUpload 
                  onUploadSuccess={handleTransactionsUpdated}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;