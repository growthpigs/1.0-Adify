import React from 'react';

export const Header: React.FC = () => (
  <header className="bg-yellow-400 sticky top-0 z-20 border-b border-yellow-300" style={{ height: '84px' }}>
    <div className="h-full flex items-center justify-between" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
      <img 
        src="/autobanana-logo-final.svg" 
        alt="AutoBanana" 
        className="h-9 w-auto opacity-60"
      />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-light text-gray-600 leading-tight opacity-80 font-sans">
            Automagically places products
          </p>
          <p className="text-sm font-light text-gray-600 leading-tight opacity-80 font-sans">
            in their natural environment
          </p>
        </div>
      </div>
    </div>
  </header>
);