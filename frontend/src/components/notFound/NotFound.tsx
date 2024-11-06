import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center mt-40">
      <div className="w-full p-8 space-y-6">
        <h1 className="text-8xl text-center text-blue-800">404</h1>
        <p className="text-center">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}

export default NotFound;