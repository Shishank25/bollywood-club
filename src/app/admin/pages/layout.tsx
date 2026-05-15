// app/admin/pages/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface Page {
  id: number;
  title: string;
  slug: string;
  route: string;
}

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all available pages on mount
  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/pages'); // Adjust endpoint to match your API
      if (!res.ok) throw new Error('Failed to fetch pages');
      
      const data = await res.json();
      setPages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading pages');
      // Fallback to common pages if API fails
      setPages([
        { id: 1, title: 'Home', slug: 'home', route: '/home' },
        { id: 2, title: 'About', slug: 'about', route: '/about' },
        { id: 3, title: 'Contact', slug: 'contact', route: '/contact' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Determine current selected page from pathname
  const getCurrentPage = () => {
    const lastSegment = pathname.split('/').pop();
    return pages.find(p => p.slug === lastSegment) || pages[0];
  };

  const currentPage = getCurrentPage();

  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSlug = e.target.value;
    const selectedPage = pages.find(p => p.slug === selectedSlug);
    if (selectedPage) {
      router.push(`/admin/pages/${selectedPage.slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header with Navigation */}
      <div className="sticky top-0 z-50 bg-slate-950 border-b border-slate-700 shadow-lg w-full px-2">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Title */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">Page Editor</h1>
              <p className="text-sm text-slate-400">Manage your site content</p>
            </div>

            {/* Page Selector Dropdown */}
            {pages.length > 0 && (
              <div className="flex items-center gap-3">
                <label htmlFor="page-select" className="text-sm font-medium text-slate-300">
                  Select Page:
                </label>
                <select
                  id="page-select"
                  value={currentPage?.slug || ''}
                  onChange={handlePageChange}
                  className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-medium 
                             hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200 cursor-pointer min-w-[200px]"
                >
                  {pages.map((page) => (
                    <option key={page.id} value={page.slug}>
                      {page.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={fetchPages}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 
                       transition-colors disabled:opacity-50"
              title="Refresh pages list"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area - Child Routes Render Here */}
      <div className="max-w-7xl mx-auto p-6">
        {loading && !pages.length ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Loading pages...</p>
            </div>
          </div>
        ) : pages.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
            <p className="text-slate-400 mb-4">No pages found. Create some pages first.</p>
            <button
              onClick={fetchPages}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}