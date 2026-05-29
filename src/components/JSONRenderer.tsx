import React from 'react';

// Helper component to safely render JSONB content, including Tiptap AST
const JsonRenderer = ({ content }: { content: any }) => {
  if (!content) return null;

  // 1. Handle standard strings (legacy data or flat strings)
  if (typeof content === 'string') {
    return <p className="text-sm sm:text-base text-brand-gray/80 leading-relaxed font-medium">{content}</p>;
  }

  // 2. Handle simple Arrays (Bullet points)
  if (Array.isArray(content)) {
    return (
      <ul className="list-disc list-outside ml-4 space-y-2 text-sm sm:text-base text-brand-gray/80 leading-relaxed font-medium marker:text-white/30">
        {content.map((item, index) => (
          <li key={index}>
            {typeof item === 'string' ? item : JSON.stringify(item)}
          </li>
        ))}
      </ul>
    );
  }

  // 3. Handle Tiptap JSON AST
  if (content.type === 'doc' && Array.isArray(content.content)) {
    const renderTiptapNode = (node: any, index: number): React.ReactNode => {
      // Base text nodes with marks (bold, italic)
      if (node.type === 'text') {
        let textElement: React.ReactNode = node.text;
        if (node.marks) {
          node.marks.forEach((mark: any) => {
            if (mark.type === 'bold') textElement = <strong key={`b-${index}`} className="font-bold text-white">{textElement}</strong>;
            if (mark.type === 'italic') textElement = <em key={`i-${index}`} className="italic">{textElement}</em>;
          });
        }
        return <React.Fragment key={index}>{textElement}</React.Fragment>;
      }

      // Paragraphs
      if (node.type === 'paragraph') {
        return (
          <p key={index} className="mb-4 last:mb-0 text-sm sm:text-base text-brand-gray/80 leading-relaxed font-medium">
            {node.content ? node.content.map((child: any, i: number) => renderTiptapNode(child, i)) : <br />}
          </p>
        );
      }

      // Bullet Lists
      if (node.type === 'bulletList') {
        return (
          <ul key={index} className="list-disc list-outside ml-4 space-y-2 mb-4 last:mb-0 text-brand-gray/80 marker:text-white/30">
            {node.content?.map((child: any, i: number) => renderTiptapNode(child, i))}
          </ul>
        );
      }

      // Ordered Lists
      if (node.type === 'orderedList') {
        return (
          <ol key={index} className="list-decimal list-outside ml-4 space-y-2 mb-4 last:mb-0 text-brand-gray/80 marker:text-white/30">
            {node.content?.map((child: any, i: number) => renderTiptapNode(child, i))}
          </ol>
        );
      }

      // List Items
      if (node.type === 'listItem') {
        return (
          <li key={index}>
            {node.content?.map((child: any, i: number) => renderTiptapNode(child, i))}
          </li>
        );
      }

      return null;
    };

    return (
      <div className="tiptap-content">
        {content.content.map((child: any, i: number) => renderTiptapNode(child, i))}
      </div>
    );
  }

  // 4. Fallback for unknown complex JSON structures
  return (
    <pre className="text-xs text-brand-gray/60 whitespace-pre-wrap bg-white/5 p-4 rounded-sm border border-white/10 overflow-x-auto">
      {JSON.stringify(content, null, 2)}
    </pre>
  );
};

export default JsonRenderer;