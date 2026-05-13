'use client';
 
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
 
const MENU_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Pages', href: '/admin/pages', icon: '📄' },
  { label: 'Blogs', href: '/admin/blogs', icon: '📝' },
  { label: 'Home Page', href: '/admin/pages/home', icon: '🏠' },
  { label: 'Banners', href: '/admin/banners', icon: '🎨' },
  { label: 'Images', href: '/admin/images', icon: '🖼️' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
];
 
export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
 
  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Admin</span>
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle sidebar"
        >
          {isOpen ? '←' : '→'}
        </button>
      </div>
 
      <nav className="sidebar-nav">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {isOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
 
      <div className="sidebar-footer">
        <button className="logout-btn">
          <span>🚪</span>
          {isOpen && 'Logout'}
        </button>
      </div>
    </aside>
  );
}