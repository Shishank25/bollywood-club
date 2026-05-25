'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  pages: number;
  blogs: number;
  images: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ pages: 0, blogs: 0, images: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pagesRes, blogsRes] = await Promise.all([
          fetch('/api/admin/pages'),
          fetch('/api/admin/blogs'),
        ]);

        const pages = await pagesRes.json();
        const blogs = await blogsRes.json();

        setStats({
          pages: pages.length || 0,
          blogs: blogs.length || 0,
          images: 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-[1400px] w-full mx-auto">
      {/* Welcome Section */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-slate-100">
          Welcome to the Admin Panel
        </h2>
        <p className="text-slate-400 text-base">
          Manage your website content from here
        </p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Pages"
          value={stats.pages}
          icon="📄"
          href="/admin/pages"
          colorClass="text-blue-500"
          hoverClass="hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:bg-slate-800/80"
        />
        <StatCard
          title="Blog Posts"
          value={stats.blogs}
          icon="📝"
          href="/admin/blogs"
          colorClass="text-purple-500"
          hoverClass="hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:bg-slate-800/80"
        />
        <StatCard
          title="Media Files"
          value={stats.images}
          icon="🎨"
          href="/admin/banners"
          colorClass="text-pink-500"
          hoverClass="hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)] hover:bg-slate-800/80"
        />
        <StatCard
          title="Quick Settings"
          value="→"
          icon="⚙️"
          href="/admin/settings"
          colorClass="text-emerald-500"
          hoverClass="hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:bg-slate-800/80"
        />
      </div>

      {/* Quick Actions Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-6 text-slate-100">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/blogs?action=new"
            className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)]"
          >
            ✏️ Write New Blog
          </Link>
          <Link
            href="/admin/pages/home"
            className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)]"
          >
            🏠 Edit Home Page
          </Link>
          <Link
            href="/admin/banners"
            className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)]"
          >
            📤 Upload Banner
          </Link>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  href: string;
  colorClass: string;
  hoverClass: string;
}

function StatCard({ title, value, icon, href, colorClass, hoverClass }: StatCardProps) {
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-6 p-6 bg-slate-800 border border-slate-700 rounded-xl no-underline text-inherit transition-all duration-300 overflow-hidden hover:-translate-y-1 ${hoverClass}`}
    >
      {/* Light Sweep Animation */}
      <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-500 ease-in-out group-hover:left-[100%]" />

      <div className="text-4xl shrink-0 z-10">{icon}</div>
      <div className="flex-1 z-10">
        <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
        <div className="text-sm text-slate-400 mt-1">{title}</div>
      </div>
    </Link>
  );
}