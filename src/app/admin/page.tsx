 
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
    <div className="dashboard">
      <div className="dashboard-welcome">
        <h2>Welcome to the Admin Panel</h2>
        <p>Manage your website content from here</p>
      </div>
 
      <div className="dashboard-grid">
        <StatCard
          title="Pages"
          value={stats.pages}
          icon="📄"
          href="/admin/pages"
          color="var(--blue)"
        />
        <StatCard
          title="Blog Posts"
          value={stats.blogs}
          icon="📝"
          href="/admin/blogs"
          color="var(--purple)"
        />
        <StatCard
          title="Media Files"
          value={stats.images}
          icon="🎨"
          href="/admin/banners"
          color="var(--pink)"
        />
        <StatCard
          title="Quick Settings"
          value="→"
          icon="⚙️"
          href="/admin/settings"
          color="var(--green)"
        />
      </div>
 
      <div className="dashboard-recent">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <Link href="/admin/blogs?action=new" className="action-btn">
            ✏️ Write New Blog
          </Link>
          <Link href="/admin/pages/home" className="action-btn">
            🏠 Edit Home Page
          </Link>
          <Link href="/admin/banners" className="action-btn">
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
  color: string;
}
 
function StatCard({ title, value, icon, href, color }: StatCardProps) {
  return (
    <Link href={href} className="stat-card" style={{ '--stat-color': color } as any}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{title}</div>
      </div>
    </Link>
  );
}