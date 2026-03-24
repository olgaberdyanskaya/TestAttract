"use client"
import React from 'react';

// Direction type for better type safety
type Direction = 'up' | 'down' | 'left' | 'right';

// Props for the button (optional, if you need to handle clicks)
interface ArrowButtonProps {
  direction: Direction;
  onClick?: (direction: Direction) => void;
}

// Individual arrow button component
const ArrowButton: React.FC<ArrowButtonProps> = ({ direction, onClick }) => {
  // SVG paths for each direction
  const svgPath = {
    up: 'M12 4L12 20M12 4L6 10M12 4L18 10',
    down: 'M12 20L12 4M12 20L6 14M12 20L18 14',
    left: 'M4 12L20 12M4 12L10 6M4 12L10 18',
    right: 'M20 12L4 12M20 12L14 6M20 12L14 18',
  };

  const handleClick = () => {
    onClick?.(direction);
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors focus:outline-none active:ring-2 active:ring-red-500"
      aria-label={`${direction} arrow`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
      >
        <path d={svgPath[direction]} />
      </svg>
    </button>
  );
};

// Main component: groups the four buttons
const ArrowButtons: React.FC = () => {

  return (
    <div className="flex flex-column justify-center items-center gap-4 p-4 bg-gray-900 rounded-xl shadow-lg">
      {/* Top row: up arrow centered */}
      <div className="flex-1">
        <ArrowButton direction="left"  />
        
      </div>
      {/* Bottom row: left and right */}
      <div className="flex-1">
        <div className="mb-4"><ArrowButton direction="up"/></div>
        <div><ArrowButton direction="down"  /></div>
      </div>
      {/* Optional: down arrow centered below left/right */}
      <div className="flex-1">
         <ArrowButton direction="right"  />
      </div>
    </div>
  );
};

export default ArrowButtons;