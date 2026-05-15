"use client";
import { useState, useEffect } from 'react';

export default function GalleryAdmin() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSort, setCurrentSort] = useState('display_order');
  const [editingPost, setEditingPost] = useState<any>(null);

  const fetchPosts = async (sort = 'display_order') => {
    setLoading(true);
    const res = await fetch(`/api/admin/gallery?sort=${sort}`);
    const data = await res.json();
    setPosts(data);
    setCurrentSort(sort);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
    fetchPosts(currentSort);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white" style={{
      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,0,127,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,0,127,0.02) 0%, transparent 50%)'
    }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-in {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-card {
          animation: fadeInScale 0.5s ease-out forwards;
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        .stagger-6 { animation-delay: 0.6s; }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
        }

        .card-hover:hover {
          border-color: rgba(255, 0, 127, 0.4);
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(255, 0, 127, 0.08);
        }

        .button-primary {
          position: relative;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .button-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.1);
          transition: left 0.3s ease;
          z-index: -1;
        }

        .button-primary:hover::before {
          left: 100%;
        }

        .sort-button {
          transition: all 0.2s ease;
          position: relative;
        }

        .sort-button:hover {
          border-color: rgba(255, 0, 127, 0.3);
        }

        .modal-backdrop {
          animation: fadeInUp 0.3s ease-out;
        }

        .modal-content {
          animation: fadeInScale 0.3s ease-out;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: rgba(255, 0, 127, 0.5) !important;
          background-color: rgba(255, 0, 127, 0.02) !important;
          transition: all 0.2s ease;
        }

        .image-preview {
          transition: opacity 0.3s ease;
        }

        .image-preview:hover {
          opacity: 1 !important;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <header className="mb-16 animate-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-2">
                Gallery Posts
              </h1>
              <div className="w-12 h-1 bg-gradient-to-r from-pink-600 to-transparent mb-8"></div>
              
              <div className="flex flex-wrap gap-3">
                {['display_order', 'created', 'event_date', 'modified'].map((s, idx) => (
                  <button 
                    key={s}
                    onClick={() => fetchPosts(s)}
                    className={`sort-button px-4 py-2 text-xs font-semibold uppercase tracking-widest border rounded-sm transition-all ${
                      currentSort === s 
                        ? 'bg-pink-600 border-pink-600 text-white' 
                        : 'border-gray-700 text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    }`}
                    style={{ animation: `slideInLeft 0.4s ease-out forwards`, animationDelay: `${idx * 0.05}s` }}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setEditingPost({})} 
              className="button-primary bg-pink-600 hover:bg-pink-700 px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-sm whitespace-nowrap"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.2s forwards', opacity: 0 }}
            >
              Create Entry
            </button>
          </div>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-pink-600 rounded-full"
                  style={{
                    animation: 'pulse 1.4s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any, idx: number) => (
              <div 
                key={post.id} 
                className="card-hover animate-card group"
                style={{ animationDelay: `${Math.min(idx * 0.08, 0.4)}s` }}
              >
                <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden h-full flex flex-col transition-colors duration-300">
                  {/* Image Container */}
                  <div className="relative aspect-video bg-gray-900 overflow-hidden flex-shrink-0">
                    <img 
                      src={post.thumbnail_url || post.media_url} 
                      className="image-preview w-full h-full object-cover opacity-70" 
                      alt={post.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content Container */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Tags row */}
                    <div className="flex items-center gap-2 mb-3">
                      {post.type && (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border border-gray-700 text-gray-500 rounded-sm">
                          {post.type}
                        </span>
                      )}
                      {post.is_featured && (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-pink-600/20 border border-pink-600/40 text-pink-400 rounded-sm">
                          Featured
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-lg tracking-tight mb-2 line-clamp-2 group-hover:text-pink-400 transition-colors">
                      {post.title}
                    </h3>

                    {post.caption && (
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">{post.caption}</p>
                    )}

                    <p className="text-gray-500 text-sm mb-6 flex-grow">
                      {post.category && <span className="font-medium text-gray-400">{post.category}</span>}
                      {post.category && post.location && <span className="text-gray-600 mx-2">•</span>}
                      {post.location && <span className="text-gray-400">{post.location}</span>}
                    </p>

                    {/* Metadata Bar */}
                    <div className="pt-4 border-t border-gray-800/50">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-gray-600 font-medium uppercase tracking-wider">
                          Order: <span className="text-gray-400">{post.display_order}</span>
                        </span>
                        {post.event_date && (
                          <span className="text-xs text-gray-600">
                            {new Date(post.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setEditingPost(post)} 
                          className="flex-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-500/60 rounded-sm transition-all duration-200"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id)} 
                          className="flex-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 rounded-sm transition-all duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 animate-in">
            <p className="text-gray-500 text-lg mb-6">No gallery posts yet</p>
            <button 
              onClick={() => setEditingPost({})} 
              className="button-primary bg-pink-600 hover:bg-pink-700 px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-sm"
            >
              Create Your First Post
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-backdrop">
          <div className="bg-gray-950 border border-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto modal-content" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)' }}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-950 border-b border-gray-800 px-8 py-6">
              <h2 className="text-2xl font-bold tracking-tight">
                {editingPost.id ? 'Edit Post' : 'Create New Post'}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {editingPost.id ? 'Update gallery post details' : 'Add a new gallery entry'}
              </p>
            </div>

            {/* Modal Form */}
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const method = editingPost.id ? 'PUT' : 'POST';
                await fetch('/api/admin/gallery', {
                  method,
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(editingPost)
                });
                // setEditingPost(null);
                fetchPosts(currentSort);
              }} 
              className="p-8 space-y-8"
            >
              {/* Section: Core Info */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 border-b border-gray-800/60 pb-2">Core Info</p>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Title <span className="text-pink-500 ml-0.5">*</span>
                  </label>
                  <input 
                    className="w-full bg-black border border-gray-800 rounded-sm p-3 text-sm text-white placeholder-gray-600" 
                    placeholder="Enter post title" 
                    value={editingPost.title || ''} 
                    onChange={e => setEditingPost({...editingPost, title: e.target.value})} 
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Type <span className="text-pink-500 ml-0.5">*</span>
                    </label>
                    <select
                      className="w-full bg-black border border-gray-800 rounded-sm p-3 text-sm text-white"
                      value={editingPost.type || ''}
                      onChange={e => setEditingPost({...editingPost, type: e.target.value})}
                      required
                    >
                      <option value="" disabled>Select type</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="reel">Reel</option>
                      <option value="gallery">Gallery</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Slug <span className="text-gray-600 text-[10px] ml-1 normal-case tracking-normal font-normal">(unique)</span></label>
                    <input 
                      className="w-full bg-black border border-gray-800 rounded-sm p-3 text-sm text-white placeholder-gray-600" 
                      placeholder="post-slug" 
                      value={editingPost.slug || ''} 
                      onChange={e => setEditingPost({...editingPost, slug: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Category</label>
                    <input 
                      className="w-full bg-black border border-gray-800 rounded-sm p-3 text-sm text-white placeholder-gray-600" 
                      placeholder="e.g. Wedding, Portrait" 
                      value={editingPost.category || ''} 
                      onChange={e => setEditingPost({...editingPost, category: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Location</label>
                    <input 
                      className="w-full bg-black border border-gray-800 rounded-sm p-3 text-sm text-white placeholder-gray-600" 
                      placeholder="e.g. New Delhi, India" 
                      value={editingPost.location || ''} 
                      onChange={e => setEditingPost({...editingPost, location: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Caption</label>
                  <textarea
                    className="w-full bg-black border border-gray-800 rounded-sm p-3 text-sm text-white placeholder-gray-600 resize-none"
                    placeholder="Optional caption or description"
                    rows={3}
                    value={editingPost.caption || ''}
                    onChange={e => setEditingPost({...editingPost, caption: e.target.value})}
                  />
                </div>
              </div>

              {/* Section: Media */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 border-b border-gray-800/60 pb-2">Media</p>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Media URL <span className="text-pink-500 ml-0.5">*</span>
                  </label>
                  <input 
                    className="w-full bg-black border border-gray-800 rounded-sm p-3 text-sm text-white placeholder-gray-600" 
                    placeholder="https://example.com/media.jpg" 
                    value={editingPost.media_url || ''} 
                    onChange={e => setEditingPost({...editingPost, media_url: e.target.value})} 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Thumbnail URL</label>
                  <input 
                    className="w-full bg-black border border-gray-800 rounded-sm p-3 text-sm text-white placeholder-gray-600" 
                    placeholder="https://example.com/thumb.jpg (falls back to Media URL)" 
                    value={editingPost.thumbnail_url || ''} 
                    onChange={e => setEditingPost({...editingPost, thumbnail_url: e.target.value})} 
                  />
                </div>

                {/* Live preview if URL is present */}
                {(editingPost.thumbnail_url || editingPost.media_url) && (
                  <div className="rounded-sm overflow-hidden aspect-video bg-gray-900 border border-gray-800">
                    <img
                      src={editingPost.thumbnail_url || editingPost.media_url}
                      alt="Preview"
                      className="w-full h-full object-cover opacity-80"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              {/* Section: Display Settings */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 border-b border-gray-800/60 pb-2">Display Settings</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Display Order <span className="text-gray-600 text-[10px] ml-1 normal-case tracking-normal font-normal">(default 0)</span></label>
                    <input 
                      className="w-full bg-black border border-gray-800 rounded-sm p-3 text-sm text-white placeholder-gray-600" 
                      type="number" 
                      placeholder="0" 
                      value={editingPost.display_order ?? 0} 
                      onChange={e => setEditingPost({...editingPost, display_order: parseInt(e.target.value) || 0})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Event Date</label>
                    <input 
                      className="w-full bg-black border border-gray-800 rounded-sm p-3 text-sm text-white placeholder-gray-600" 
                      type="date" 
                      value={editingPost.event_date?.split('T')[0] || ''} 
                      onChange={e => setEditingPost({...editingPost, event_date: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border border-gray-800 rounded-sm bg-black cursor-pointer group/feat"
                  onClick={() => setEditingPost({...editingPost, is_featured: !editingPost.is_featured})}
                >
                  <div className={`w-4 h-4 rounded-sm border flex-shrink-0 transition-colors flex items-center justify-center ${editingPost.is_featured ? 'bg-pink-600 border-pink-600' : 'border-gray-600 group-hover/feat:border-gray-400'}`}>
                    {editingPost.is_featured && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-300">Featured</p>
                    <p className="text-xs text-gray-600">Pin this post to featured sections</p>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-800/50">
                <button 
                  type="button" 
                  onClick={() => setEditingPost(null)} 
                  className="px-6 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-300 border border-gray-800 hover:border-gray-700 rounded-sm transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="button-primary bg-pink-600 hover:bg-pink-700 px-8 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm"
                >
                  {editingPost.id ? 'Save Changes' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}