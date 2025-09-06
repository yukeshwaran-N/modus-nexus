// src/utils/textFormatter.ts
import React from 'react';

export const formatText = (text: string): React.ReactNode => {
  if (!text) return text;
  
  // Simple bold formatting using split
  const segments = text.split(/\*\*(.*?)\*\*/g);
  
  return segments.map((segment, index) => {
    if (index % 2 === 1) {
      // Odd indices are bold text (inside **)
      return React.createElement('strong', { 
        key: index, 
        className: 'text-bold' 
      }, segment);
    } else {
      // Even indices are regular text
      return segment;
    }
  });
};