// app/admin/layout.tsx
import React from 'react';
import Link from 'next/link';
import { AdminSidebar } from './components/AdminSidebar';
import './admin.css';

export const metadata = {
  title: 'Admin Panel',
  description: 'Content management dashboard',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-title">Content Management</h1>
          <div className="admin-header-actions">
            <span className="admin-status">● Live</span>
          </div>
        </div>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}