// src/components/LegalContentRenderer.tsx
import React from 'react';

// Define your types based on your database JSON structure
export type ContentBlock = 
  | { type: 'h1' | 'h2' | 'h3' | 'p'; text: string }
  | { type: 'list'; items: string[] };

interface RendererProps {
  blocks: ContentBlock[];
}

export default function LegalContentRenderer({ blocks }: RendererProps) {
  return (
    <div className="space-y-4 sm:space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'h1':
            return <h1 key={index} className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">{block.text}</h1>;
          case 'h2':
            return <h2 key={index} className="text-xl sm:text-2xl font-semibold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4">{block.text}</h2>;
          case 'h3':
            return <h3 key={index} className="text-lg sm:text-xl font-medium text-gray-900 mt-4 sm:mt-6 mb-2 sm:mb-3">{block.text}</h3>;
          case 'p':
            return <p key={index}>{block.text}</p>;
          case 'list':
            return (
              <ul key={index} className="list-disc pl-4 sm:pl-6 space-y-1 sm:space-y-2">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          default:
            return null; // Ignore unknown block types gracefully
        }
      })}
    </div>
  );
}