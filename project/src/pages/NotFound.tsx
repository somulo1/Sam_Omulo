import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Unauthorized Access
          </h2>
          <p className="text-gray-600 mb-6">
            You do not have permission to access this page directly.
            Please follow the proper authentication flow.
          </p>
          <Link 
            to="/" 
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Return to Portfolio
          </Link>
        </div>
        <div className="text-sm text-gray-500">
          <p>For security reasons, direct page access is restricted.</p>
        </div>
      </div>
    </div>
  );
}
