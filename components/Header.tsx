import React from 'react';

export const Header: React.FC = () => (
  <header className="bg-yellow-400 sticky top-0 z-20 border-b border-yellow-300" style={{ height: '64px' }}>
    <div className="h-full flex items-center justify-between" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
      <img 
        src="/autobanana-logo-final.svg" 
        alt="AutoBanana" 
        className="h-10 w-auto"
      />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600 leading-tight">
            Automagically places products
          </p>
          <p className="text-sm font-medium text-gray-600 leading-tight">
            in their natural environment
          </p>
        </div>
      </div>
    </div>
  </header>
);