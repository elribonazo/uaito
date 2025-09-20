import React from'react'
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const getColorForTokenCount = (count: number): string => {
    if (count < 66667) return 'bg-green-500';
    if (count < 133334) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };
  
export const TokenCounter: React.FC<{ input: number; output: number }> = ({ input, output }) => {
    const [isHovered, setIsHovered] = useState(false);
    const showDetailedView = isHovered || input > 66667 || output > 66667;
  
    return (
      <div 
        className="w-50 rounded-md text-sm font-semibold z-50 transition-all duration-300 pt-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showDetailedView ? (
          <div className="bg-gray-700 bg-opacity-70 px-1 py-1 flex items-center justify-end space-x-2 rounded-md">
            <div className={`px-2 py-1 rounded ${getColorForTokenCount(input)}`}>
              <span className="text-white">Input: {formatNumber(input)}</span>
            </div>
            <div className={`px-2 py-1 rounded ${getColorForTokenCount(output)}`}>
              <span className="text-white">Output: {formatNumber(output)}</span>
            </div>
          </div>
        ) : (
          <div className="bg-opacity-90 bg-gray-700 space-x-2 rounded-md px-1 py-1 flex items-center space-x-2 cursor-pointer">
            <ChartBarIcon className=" h-5 w-5 text-gray-200" />
            <span className='px-2 py-1 text-gray-200'>Usage</span>
          </div>
        )}
      </div>
    );
  };