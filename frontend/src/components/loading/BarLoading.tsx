import React from 'react';

const BarLoading: React.FC = () => {
  return (
    <div>
      <div className="w-full h-3 mb-2 bg-blue-800 animate-pulse rounded-lg"></div>
      <div className="w-full h-3 mb-2 bg-blue-800 animate-pulse rounded-lg"></div>
      <div className="w-full h-3 mb-2 bg-blue-800 animate-pulse rounded-lg"></div>
      <div className="w-full h-3 mb-2 bg-blue-800 animate-pulse rounded-lg"></div>
    </div>
  )
}

export default BarLoading;