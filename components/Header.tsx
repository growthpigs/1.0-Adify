import React from 'react';

export const Header: React.FC = () => (
  <header className="sticky top-0 z-20 border-b" style={{ height: '64px', backgroundColor: '#FACC15', borderColor: '#FDE047' }}>
    <div className="h-full flex items-center justify-between" style={{ paddingLeft: '26px', paddingRight: '20px' }}>
      <img 
        src="/autobanana-logo-final.svg" 
        alt="AutoBanana" 
        className="h-9 w-auto opacity-48"
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