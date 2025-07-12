import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-1',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-1',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-1',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-1',
  };

  return (
    <div className="relative inline-block" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <div className={`absolute z-10 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded shadow-sm max-w-xs ${positionClasses[position]}`}>
          {content}
          <div className={`absolute ${position === 'top' ? 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800' : 
                                      position === 'bottom' ? 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800' : 
                                      position === 'left' ? 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-800' : 
                                      'right-full top-1/2 transform -translate-y-1/2 border-r-gray-800'} 
                          border-solid border-4 border-transparent`}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;