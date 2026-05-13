// app/admin/pages/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Page {
  id: number;
  title: string;
  slug: string;
  route: string;
}

export default function PagesIndexPage() {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/pages');
      if (!res.ok) throw new Error('Failed to fetch pages');
      
      const data = await res.json();
      const pagesList = Array.isArray(data) ? data : [];
      setPages(pagesList);

      // Auto-redirect to first page if available
      if (pagesList.length > 0) {
        router.push(`/admin/pages/${pagesList[0].slug}`);
      }
    } catch (err) {
      console.error('Error fetching pages:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center max-w-2xl mx-auto">
      <div className="mb-6">
        <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-white mb-3">Select a Page</h2>
      <p className="text-slate-400 mb-8">
        Use the dropdown menu in the header to select a page to edit. No pages are currently selected.
      </p>

      {pages.length > 0 && (
        <div className="mt-8">
          <p className="text-sm text-slate-500 mb-4">Available pages:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => router.push(`/admin/pages/${page.slug}`)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                         transition-colors font-medium text-sm"
              >
                {page.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}