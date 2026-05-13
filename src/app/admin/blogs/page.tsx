// app/admin/blogs/page.tsx
'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

function BlogsAdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get('action');
  const blogId = searchParams.get('id');

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/blogs');
      if (!res.ok) throw new Error('Failed to fetch blogs');
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDeleteBlog = useCallback(async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete blog');
      await fetchBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting blog');
    }
  }, [fetchBlogs]);

  if (action === 'new' || (action === 'edit' && blogId)) {
    return <BlogEditorPage blogId={blogId ? parseInt(blogId) : undefined} onClose={() => router.push('/admin/blogs')} />;
  }

  return (
    <div className="blogs-page">
      <div className="page-header">
        <h2>Blog Posts</h2>
        <button className="btn btn-primary" onClick={() => router.push('/admin/blogs?action=new')}>
          ✏️ Write New Post
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading blog posts...</div>
      ) : blogs.length === 0 ? (
        <div className="empty-state">
          <p>No blog posts yet</p>
          <Link href="/admin/blogs?action=new" className="btn btn-primary">
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="blogs-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td>
                    <div className="blog-title">{blog.title}</div>
                    <div className="blog-slug">{blog.slug}</div>
                  </td>
                  <td>
                    <span className={`badge ${blog.published ? 'published' : 'draft'}`}>
                      {blog.published ? '📤 Published' : '📝 Draft'}
                    </span>
                  </td>
                  <td>{new Date(blog.created_at).toLocaleDateString()}</td>
                  <td>{new Date(blog.updated_at).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-small btn-secondary"
                        onClick={() => router.push(`/admin/blogs?action=edit&id=${blog.id}`)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => handleDeleteBlog(blog.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .blogs-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .page-header h2 {
          font-size: 1.8rem;
        }

        .alert {
          padding: 1rem;
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .loading-state {
          text-align: center;
          padding: 2rem;
          color: var(--text-secondary);
        }

        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          background: var(--secondary);
          border: 2px dashed var(--border);
          border-radius: var(--radius-lg);
        }

        .empty-state p {
          margin-bottom: 1rem;
          color: var(--text-secondary);
        }

        .blogs-table {
          background: var(--secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: var(--tertiary);
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          border-bottom: 1px solid var(--border);
          color: var(--text-secondary);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        td {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
        }

        tbody tr:hover {
          background: rgba(59, 130, 246, 0.05);
        }

        .blog-title {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .blog-slug {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .badge {
          display: inline-block;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          font-weight: 600;
        }

        .badge.published {
          background: rgba(16, 185, 129, 0.15);
          color: #6ee7b7;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .badge.draft {
          background: rgba(251, 146, 60, 0.15);
          color: #fbcf8e;
          border: 1px solid rgba(251, 146, 60, 0.3);
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
}

// ============================================
// BLOG EDITOR COMPONENT
// ============================================

import { BlogEditor } from '../components/BlogEditor';

interface BlogEditorPageProps {
  blogId?: number;
  onClose: () => void;
}

function BlogEditorPage({ blogId, onClose }: BlogEditorPageProps) {
  const [blog, setBlog] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchBlog = async () => {
    if (!blogId) return;
    try {
      const res = await fetch(`/api/admin/blogs?id=${blogId}`);
      if (!res.ok) throw new Error('Failed to fetch blog');
      const data = await res.json();
      setBlog(data);
      setTitle(data.title);
      setSlug(data.slug);
      setExcerpt(data.excerpt || '');
      setContent(data.content);
      setPublished(data.published);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading blog');
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!blogId) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSaveContent = async (htmlContent: string) => {
    setContent(htmlContent);
  };

  const handlePublish = async () => {
    if (!title || !slug || !content) {
      setError('Please fill in all required fields');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const method = blogId ? 'PUT' : 'POST';
      const url = blogId ? `/api/admin/blogs?id=${blogId}` : '/api/admin/blogs';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          published: true,
        }),
      });

      if (!res.ok) throw new Error('Failed to publish blog');

      // Show success and redirect
      alert('Blog published successfully!');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving blog');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  return (
    <div className="blog-editor-page">
      <div className="editor-header">
        <button className="btn btn-secondary" onClick={onClose}>
          ← Back
        </button>
        <h2>{blogId ? 'Edit Blog Post' : 'New Blog Post'}</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="editor-form">
        <div className="form-group">
          <label className="form-label">Post Title *</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter post title"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Post Slug *</label>
          <input
            type="text"
            className="form-input"
            value={slug}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            placeholder="post-slug"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Excerpt</label>
          <textarea
            className="form-textarea"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief summary of your post"
            style={{ minHeight: '80px' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Content *</label>
          <BlogEditor initialContent={content} onSave={handleSaveContent} />
        </div>

        <div className="editor-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handlePublish}
            disabled={saving}
          >
            {saving ? '💾 Publishing...' : '📤 Publish'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .blog-editor-page {
          max-width: 1000px;
          margin: 0 auto;
        }

        .editor-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .editor-header h2 {
          font-size: 1.5rem;
          flex: 1;
        }

        .editor-form {
          background: var(--secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 2rem;
        }

        .editor-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }
      `}</style>
    </div>
  );
}

// 3. Export a default wrapper that includes Suspense
export default function BlogsAdminPage() {
  return (
    <Suspense fallback={<div>Loading Admin Dashboard...</div>}>
      <BlogsAdminContent />
    </Suspense>
  );
}