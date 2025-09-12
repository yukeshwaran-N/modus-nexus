import React from 'react';
import { Shield } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="animate-pulse">
            <Shield className="h-16 w-16 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          MODUS-NEXUS
        </h2>
        <p className="text-gray-600">Loading security system...</p>
        <div className="mt-6">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;