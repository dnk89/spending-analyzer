import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Spending Analyzer
          </Link>
          <div className="flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800">
              Dashboard
            </Link>
            <Link to="/transactions" className="text-gray-600 hover:text-gray-800">
              Transactions
            </Link>
            <Link to="/upload" className="text-gray-600 hover:text-gray-800">
              Upload
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;