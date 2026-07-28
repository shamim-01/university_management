import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-9xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          404
        </div>
        <h1 className="text-3xl font-bold text-white mt-4">Page Not Found</h1>
        <p className="text-gray-400 mt-2 max-w-md">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <HomeIcon className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
