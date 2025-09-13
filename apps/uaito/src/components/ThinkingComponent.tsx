import React, { useState } from 'react';
import { LightBulbIcon } from "@heroicons/react/24/outline";

export const ThinkingComponent: React.FC<{
  thinking: string;
}> = ({ thinking }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative w-full mt-4 p-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-start space-x-2 cursor-pointer">
        <LightBulbIcon className="w-5 h-5 text-yellow-400 animate-pulse" />
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Thinking...</span>
      </div>
      
      {isHovered && thinking && (
        <div className="absolute bottom-full left-0 mb-2 w-max max-w-md p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10 break-words whitespace-pre-wrap">
          <p className="font-semibold mb-1">Assistant's thought process:</p>
          {thinking}
        </div>
      )}
    </div>
  );
};
