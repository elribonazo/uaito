import { ChartBarIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const getColorForTokenCount = (count: number): string => {
    if (count < 66667) return 'text-accent';
    if (count < 133334) return 'text-orange-400';
    return 'text-red-400';
  };
  
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };
  
export const TokenCounter = ({ input, output }: { input: number; output: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const showDetailedView = isHovered || input > 66667 || output > 66667;
  
    return (
      <button 
        type="button"
        className="relative transition-all duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showDetailedView ? (
          <div className="bg-surface border border-border rounded-md px-2 py-1 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-tertiary-text text-xs">In:</span>
              <span className={`text-xs font-medium ${getColorForTokenCount(input)}`}>{formatNumber(input)}</span>
            </div>
            <div className="w-px h-3 bg-border"></div>
            <div className="flex items-center gap-1">
              <span className="text-tertiary-text text-xs">Out:</span>
              <span className={`text-xs font-medium ${getColorForTokenCount(output)}`}>{formatNumber(output)}</span>
            </div>
          </div>
        ) : (
          <div className="bg-surface hover:bg-surface-hover border border-border rounded-md px-1.5 sm:px-2 py-1 flex items-center gap-1.5 transition-all duration-200">
            <ChartBarIcon className="h-3.5 w-3.5 text-secondary-text" />
            <span className='text-xs text-secondary-text hidden sm:inline'>Usage</span>
          </div>
        )}
      </button>
    );
  };