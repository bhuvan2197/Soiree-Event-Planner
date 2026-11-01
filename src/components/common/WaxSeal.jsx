import React from 'react';

export default function WaxSeal({ size = 38, className = '' }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title="Soirée Atelier Seal"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md transition-transform duration-300 hover:rotate-6 hover:scale-105"
      >
        {/* Irregular organic wax contour */}
        <path
          d="M 50,4 
             C 63,3 74,10 83,18 
             C 92,27 97,40 96,53 
             C 95,66 89,78 79,86 
             C 69,94 54,97 42,95 
             C 29,93 17,85 10,74 
             C 3,63 3,48 7,35 
             C 11,22 23,12 36,6 
             Z"
          fill="#6D1A2B"
          stroke="#4A0F1C"
          strokeWidth="2.5"
        />
        {/* Subtle inner gold rim */}
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="#B8935A"
          strokeWidth="1.6"
          strokeDasharray="2 3"
          opacity="0.9"
        />
        {/* Monogram S */}
        <text
          x="50"
          y="61"
          textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="36"
          fontWeight="700"
          fontStyle="italic"
          fill="#FAF5EC"
          letterSpacing="-1"
        >
          S
        </text>
      </svg>
    </div>
  );
}
