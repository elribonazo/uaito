import React from 'react';
import dynamic from 'next/dynamic';

const ClientSpaceBackground = dynamic(() => import('./ClientSpaceBackground'), { ssr: false });

const SpaceBackground: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 bg-gray-900">
      <ClientSpaceBackground />
    </div>
  );
};

export default SpaceBackground;