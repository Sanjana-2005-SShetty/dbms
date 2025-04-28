import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md animate-slide-up">
        <h1 className="text-9xl font-bold text-primary-500">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="btn btn-primary mt-8 flex items-center gap-2 mx-auto w-max"
        >
          <HomeIcon size={18} />
          <span>Go to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;