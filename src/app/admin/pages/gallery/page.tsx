"use client";
import React, { useState, useEffect, useRef, ChangeEvent, DragEvent } from 'react';

// ─── Types & Configuration (Media Slots) ──────────────────────────────────────

interface MediaAsset {
  html_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  alt_text: string | null;
  width: number | null;
  height: number | null;
  thumbnail_url?: string; // NEW: Added for video posters
}

const GALLERY_SLOTS = [
  { id: 'hero-video', label: '🎬 Hero Media', description: 'Main background video or image at the top of the gallery page', folder: 'gallery' },
  { id: 'latest-aftermovie', label: '🎥 Latest Aftermovie', description: 'Featured aftermovie video slot', folder: 'gallery' },
];

const MAX_IMAGE_SIZE = 30 * 1024 * 1024;  // 30 MB
const MAX_VIDEO_SIZE = 24 * 1024 * 1024;  // 24 MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

function validateFile(file: File): string | null {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return `Unsupported file type: ${file.type}. Use JPG, PNG, WebP, GIF, AVIF, MP4, WebM, or MOV.`;
  }
  if (isVideo && file.size > MAX_VIDEO_SIZE) {
    return `Video exceeds the 24 MB limit (${(file.size / 1024 / 1024).toFixed(1)} MB).`;
  }
  if (isImage && file.size > MAX_IMAGE_SIZE) {
    return `Image exceeds the 30 MB limit (${(file.size / 1024 / 1024).toFixed(1)} MB).`;
  }
  return null;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Main Admin Component ─────────────────────────────────────────────────────

export default function GalleryAdmin() {
  // Post Grid State
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSort, setCurrentSort] = useState('display_order');
  const [editingPost, setEditingPost] = useState<any>(null);

  const [postFile, setPostFile] = useState<File | null>(null);
  const [postThumbFile, setPostThumbFile] = useState<File | null>(null);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const postFileInputRef = useRef<HTMLInputElement>(null);
  const postThumbInputRef = useRef<HTMLInputElement>(null);

  // Page Media State
  const [mediaAssets, setMediaAssets] = useState<Record<string, MediaAsset>>({});
  const [mediaLoading, setMediaLoading] = useState(true);
  const [mediaError, setMediaError] = useState('');

  const fetchPosts = async (sort = 'display_order') => {
    setLoading(true);
    const res = await fetch(`/api/admin/gallery?sort=${sort}`);
    const data = await res.json();
    setPosts(data);
    setCurrentSort(sort);
    setLoading(false);
  };

  const fetchGalleryMedia = async () => {
    try {
      setMediaLoading(true);
      const res = await fetch('/api/media?page=/gallery');
      if (!res.ok) throw new Error('Failed to fetch gallery page media');
      
      const data = await res.json();
      setMediaAssets(data);
    } catch (err) {
      setMediaError(err instanceof Error ? err.message : 'Error loading gallery page media');
    } finally {
      setMediaLoading(false);
    }
  };

  useEffect(() => { 
    fetchPosts(); 
    fetchGalleryMedia();
  }, []);

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
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-in { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-card { animation: fadeInScale 0.5s ease-out forwards; }
        .card-hover { transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1); }
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
          top: 0; left: -100%; width: 100%; height: 100%;
          background: rgba(255, 255, 255, 0.1);
          transition: left 0.3s ease;
          z-index: -1;
        }
        .button-primary:hover::before { left: 100%; }
        .sort-button { transition: all 0.2s ease; position: relative; }
        .sort-button:hover { border-color: rgba(255, 0, 127, 0.3); }
        .modal-backdrop { animation: fadeInUp 0.3s ease-out; }
        .modal-content { animation: fadeInScale 0.3s ease-out; }
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: rgba(255, 0, 127, 0.5) !important;
          background-color: rgba(255, 0, 127, 0.02) !important;
          transition: all 0.2s ease;
        }
        .image-preview { transition: opacity 0.3s ease; }
        .image-preview:hover { opacity: 1 !important; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <header className="mb-12 animate-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-2">
                Gallery Admin
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

        {/* ── Page Media Slots Section ── */}
        <div className="mb-16 animate-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold mb-6 tracking-tight text-gray-200">Page Settings (Hero & Features)</h2>
          {mediaError && (
            <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-200 mb-6">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{mediaError}</p>
            </div>
          )}
          {mediaLoading ? (
            <div className="text-gray-500 text-sm py-4">Loading page media assets...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {GALLERY_SLOTS.map((slot) => (
                <MediaEditorCard 
                  key={slot.id}
                  slotConfig={slot}
                  initialData={mediaAssets[slot.id]}
                  onRefresh={fetchGalleryMedia}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-full h-px bg-gray-800/60 mb-12"></div>

        {/* ── Gallery Posts Grid Loading State ── */}
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

        {/* ── Gallery Posts Grid ── */}
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

      {/* Edit Modal (Untouched) */}
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
                setIsSavingPost(true);
                try {
                  const fd = new FormData();
                  
                  // Append text fields
                  if (editingPost.id) fd.append('id', editingPost.id.toString());
                  fd.append('title', editingPost.title || '');
                  fd.append('type', editingPost.type || 'image');
                  fd.append('is_featured', String(!!editingPost.is_featured));
                  fd.append('display_order', (editingPost.display_order || 0).toString());
                  
                  if (editingPost.location) fd.append('location', editingPost.location);
                  if (editingPost.caption) fd.append('caption', editingPost.caption);
                  if (editingPost.category) fd.append('category', editingPost.category);
                  if (editingPost.slug) fd.append('slug', editingPost.slug);
                  if (editingPost.event_date) fd.append('event_date', editingPost.event_date);

                  // Append files OR fallback to URL strings
                  if (postFile) fd.append('file', postFile);
                  else if (editingPost.media_url) fd.append('media_url', editingPost.media_url);

                  if (postThumbFile) fd.append('thumbnailFile', postThumbFile);
                  else if (editingPost.thumbnail_url) fd.append('thumbnail_url', editingPost.thumbnail_url);

                  const res = await fetch('/api/admin/gallery', {
                    method: 'POST', // POST handles both create and update with FormData
                    body: fd
                  });
                  
                  if (!res.ok) throw new Error("Failed to save");
                  
                  fetchPosts(currentSort);
                  setEditingPost(null);
                  setPostFile(null);
                  setPostThumbFile(null);
                } catch (err) {
                  alert("Error saving post");
                } finally {
                  setIsSavingPost(false);
                }
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
                <div className="flex items-center justify-between border-b border-gray-800/60 pb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Media</p>
                  <p className="text-[10px] text-gray-500">Drop files or paste URLs below</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Main Media Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Main Media <span className="text-pink-500 ml-0.5">*</span>
                    </label>
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={postFileInputRef}
                      accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(',')}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                           setPostFile(file);
                           // Auto-set type based on file
                           const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
                           setEditingPost({...editingPost, type: isVideo ? 'video' : 'image'});
                        }
                      }}
                    />
                    
                    {postFile ? (
                      <div className="flex items-center gap-3 px-3 py-3 bg-black border border-gray-800 rounded-sm">
                        <span className="text-xl">{ALLOWED_VIDEO_TYPES.includes(postFile.type) ? '🎬' : '🖼️'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white truncate font-medium">{postFile.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">{formatBytes(postFile.size)}</p>
                        </div>
                        <button type="button" onClick={() => setPostFile(null)} className="text-gray-500 hover:text-red-400">✕</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => postFileInputRef.current?.click()}
                          className="flex-shrink-0 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-xs px-4 rounded-sm transition-colors"
                        >
                          Upload
                        </button>
                        <input 
                          className="w-full bg-black border border-gray-800 rounded-sm p-3 text-sm text-white placeholder-gray-600" 
                          placeholder="Or paste https://..." 
                          value={editingPost.media_url || ''} 
                          onChange={e => setEditingPost({...editingPost, media_url: e.target.value})} 
                          required={!postFile} 
                        />
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Upload */}
                  <div className={`space-y-2 transition-opacity ${editingPost.type === 'video' ? 'opacity-100' : 'opacity-50'}`}>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Thumbnail Cover
                    </label>
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={postThumbInputRef}
                      accept={ALLOWED_IMAGE_TYPES.join(',')}
                      onChange={(e) => {
                        if (e.target.files?.[0]) setPostThumbFile(e.target.files[0]);
                      }}
                    />
                    
                    {postThumbFile ? (
                      <div className="flex items-center gap-3 px-3 py-3 bg-black border border-gray-800 rounded-sm">
                        <span className="text-xl">📸</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white truncate font-medium">{postThumbFile.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">{formatBytes(postThumbFile.size)}</p>
                        </div>
                        <button type="button" onClick={() => setPostThumbFile(null)} className="text-gray-500 hover:text-red-400">✕</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => postThumbInputRef.current?.click()}
                          className="flex-shrink-0 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-xs px-4 rounded-sm transition-colors"
                        >
                          Upload
                        </button>
                        <input 
                          className="w-full bg-black border border-gray-800 rounded-sm p-3 text-sm text-white placeholder-gray-600" 
                          placeholder="Or paste https://..." 
                          value={editingPost.thumbnail_url || ''} 
                          onChange={e => setEditingPost({...editingPost, thumbnail_url: e.target.value})} 
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Live preview for URLs (Optional if they use URLs instead of files) */}
                {(!postFile && !postThumbFile && (editingPost.thumbnail_url || editingPost.media_url)) && (
                  <div className="rounded-sm overflow-hidden aspect-video bg-gray-900 border border-gray-800 max-w-sm mt-2">
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
                  disabled={isSavingPost}
                  className="button-primary bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 disabled:opacity-70 px-8 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center gap-2"
                >
                  {isSavingPost ? (
                    <>
                      <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    editingPost.id ? 'Save Changes' : 'Create Post'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Media Editor Card (Styled for Gallery Admin) ─────────────────────────────

type UploadMode = 'file' | 'url';

function MediaEditorCard({ 
  slotConfig, 
  initialData, 
  onRefresh 
}: { 
  slotConfig: { id: string; label: string; description: string; folder: string };
  initialData?: MediaAsset;
  onRefresh: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null); // NEW: Ref for thumbnail upload

  const [uploadMode, setUploadMode] = useState<UploadMode>('file');
  const [saving, setSaving]         = useState(false);
  
  // Drag states
  const [draggingMain, setDraggingMain]   = useState(false);
  const [draggingThumb, setDraggingThumb] = useState(false);

  // Staged Main File state
  const [stagedFile, setStagedFile]       = useState<File | null>(null);
  const [stagedPreview, setStagedPreview] = useState<string | null>(null);
  const [fileError, setFileError]         = useState('');

  // NEW: Staged Thumbnail state
  const [stagedThumbFile, setStagedThumbFile]       = useState<File | null>(null);
  const [stagedThumbPreview, setStagedThumbPreview] = useState<string | null>(null);
  const [thumbError, setThumbError]                 = useState('');

  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'done'>('idle');

  const [formData, setFormData] = useState({
    mediaUrl:  initialData?.media_url   || '',
    mediaType: (initialData?.media_type || 'image') as 'image' | 'video',
    altText:   initialData?.alt_text    || '',
    width:     initialData?.width?.toString()  || '',
    height:    initialData?.height?.toString() || '',
    thumbnailUrl: initialData?.thumbnail_url || '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        mediaUrl:  initialData.media_url,
        mediaType: initialData.media_type,
        altText:   initialData.alt_text    || '',
        width:     initialData.width?.toString()  || '',
        height:    initialData.height?.toString() || '',
        thumbnailUrl: initialData.thumbnail_url || '',
      });
    }
  }, [initialData]);

  // ── File Staging ──
  const stageFile = (file: File) => {
    setFileError('');
    const err = validateFile(file);
    if (err) { setFileError(err); return; }

    setStagedFile(file);
    setUploadProgress('idle');

    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    setFormData((prev) => ({ ...prev, mediaType: isVideo ? 'video' : 'image' }));

    const objectUrl = URL.createObjectURL(file);
    setStagedPreview(objectUrl);
  };

  // NEW: Thumbnail Staging
  const stageThumbFile = (file: File) => {
    setThumbError('');
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setThumbError(`Unsupported thumbnail. Use JPG, PNG, WebP, GIF, or AVIF.`);
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setThumbError(`Thumbnail exceeds the 30 MB limit.`);
      return;
    }
    setStagedThumbFile(file);
    const objectUrl = URL.createObjectURL(file);
    setStagedThumbPreview(objectUrl);
  };

  const clearStaged = () => {
    if (stagedPreview) URL.revokeObjectURL(stagedPreview);
    if (stagedThumbPreview) URL.revokeObjectURL(stagedThumbPreview);
    
    setStagedFile(null);
    setStagedPreview(null);
    setFileError('');
    
    setStagedThumbFile(null);
    setStagedThumbPreview(null);
    setThumbError('');

    setUploadProgress('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (thumbInputRef.current) thumbInputRef.current.value = '';
  };

  // Main Drop/Input Handlers
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) stageFile(file);
  };
  const handleDropMain = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggingMain(false);
    const file = e.dataTransfer.files?.[0];
    if (file) stageFile(file);
  };

  // Thumbnail Drop/Input Handlers
  const handleThumbInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) stageThumbFile(file);
  };
  const handleDropThumb = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggingThumb(false);
    const file = e.dataTransfer.files?.[0];
    if (file) stageThumbFile(file);
  };

  // ── Save Logic ──
  const handleSave = async () => {
    try {
      setSaving(true);
      const fd = new FormData();

      // Route mapping specifically to the gallery page
      fd.append('pageRoute', '/gallery');
      fd.append('htmlId', slotConfig.id);
      fd.append('mediaType', formData.mediaType);
      fd.append('altText', formData.altText);
      if (formData.width) fd.append('width', formData.width);
      if (formData.height) fd.append('height', formData.height);

      // Handle URL Mode
      if (uploadMode === 'url') {
        if (!formData.mediaUrl) throw new Error('Please enter a media URL');
        fd.append('mediaUrl', formData.mediaUrl);
        if (formData.mediaType === 'video' && formData.thumbnailUrl) {
          fd.append('thumbnailUrl', formData.thumbnailUrl);
        }
      } 
      // Handle File Mode
      else {
        if (stagedFile) {
          setUploadProgress('uploading');
          fd.append('file', stagedFile);
          fd.append('folder', slotConfig.folder);
        }
        // Send the thumbnail file to your backend if it's a video
        if (formData.mediaType === 'video' && stagedThumbFile) {
          fd.append('thumbnailFile', stagedThumbFile); 
        }
      }

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Failed to save asset');
      }

      const saved = await res.json();
      setFormData((prev) => ({ 
        ...prev, 
        mediaUrl: saved.media_url ?? prev.mediaUrl,
        thumbnailUrl: saved.thumbnail_url ?? prev.thumbnailUrl 
      }));
      setUploadProgress('done');
      clearStaged();
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error saving asset');
      setUploadProgress('idle');
    } finally {
      setSaving(false);
    }
  };

  const canSave = 
    !saving && 
    ((uploadMode === 'file' && (stagedFile != null || stagedThumbFile != null)) || 
     (uploadMode === 'url'  && formData.mediaUrl.trim() !== ''));

  const previewUrl  = stagedPreview ?? formData.mediaUrl;
  const thumbPreviewUrl = stagedThumbPreview ?? formData.thumbnailUrl;
  
  const previewType = stagedFile 
    ? (ALLOWED_VIDEO_TYPES.includes(stagedFile.type) ? 'video' : 'image') 
    : formData.mediaType;

  // Determine grid columns based on media type
  const isVideoMode = formData.mediaType === 'video';

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-lg transition-colors">
      <div className="p-4 border-b border-gray-800 bg-black/40 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-white">{slotConfig.label}</h3>
          <p className="text-xs text-gray-400 mt-1">{slotConfig.description}</p>
        </div>
        <div className="text-[10px] uppercase font-bold tracking-widest bg-gray-900 px-3 py-1.5 rounded-sm text-gray-400 border border-gray-800">
          {slotConfig.id}
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="flex gap-1 bg-black border border-gray-800 rounded-sm p-1 w-fit">
          {(['file', 'url'] as UploadMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setUploadMode(m); clearStaged(); }}
              className={`px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-sm transition ${
                uploadMode === m ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {m === 'file' ? '📁 Upload' : '🔗 Link'}
            </button>
          ))}
        </div>

        {uploadMode === 'file' && (
          <div className={`grid gap-4 ${isVideoMode ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            
            {/* 1. Main Media Column */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                {isVideoMode ? 'Main Video File' : 'Image File'}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(',')}
                className="hidden"
                onChange={handleFileInput}
              />
              {!stagedFile ? (
                <div
                  className={`border border-dashed rounded-sm py-6 px-4 text-center cursor-pointer transition-all ${
                    draggingMain ? 'border-pink-500 bg-pink-950/20' : 'border-gray-700 hover:border-pink-500 hover:bg-gray-900/50'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDraggingMain(true); }}
                  onDragLeave={() => setDraggingMain(false)}
                  onDrop={handleDropMain}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-2xl mb-2">{draggingMain ? '📂' : '☁️'}</div>
                  <p className="text-gray-300 text-sm font-medium mb-1 line-clamp-1">
                    {draggingMain ? 'Drop main media' : 'Browse or drop'}
                  </p>
                  <p className="text-gray-500 text-xs font-mono truncate">Max: 30MB</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 px-3 py-3 bg-black border border-gray-800 rounded-sm h-[108px]">
                  <span className="text-2xl">{previewType === 'video' ? '🎬' : '🖼️'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate font-medium">{stagedFile.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{formatBytes(stagedFile.size)}</p>
                  </div>
                  {uploadProgress === 'uploading' && <div className="w-4 h-4 border-2 border-gray-700 border-t-pink-500 rounded-full animate-spin shrink-0" />}
                  {uploadProgress === 'done' && <span className="text-green-500 text-sm shrink-0">✓</span>}
                  <button onClick={() => { setStagedFile(null); setStagedPreview(null); }} className="text-gray-500 hover:text-red-400 transition text-lg leading-none px-1 shrink-0">✕</button>
                </div>
              )}
              {fileError && <p className="mt-2 text-xs font-semibold tracking-wider uppercase text-red-400 flex items-center gap-1.5"><span>⚠️</span> {fileError}</p>}
            </div>

            {/* 2. Thumbnail Column (Videos Only) */}
            {isVideoMode && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Thumbnail / Cover
                </label>
                <input
                  ref={thumbInputRef}
                  type="file"
                  accept={ALLOWED_IMAGE_TYPES.join(',')}
                  className="hidden"
                  onChange={handleThumbInput}
                />
                {!stagedThumbFile ? (
                  <div
                    className={`border border-dashed rounded-sm py-6 px-4 text-center cursor-pointer transition-all ${
                      draggingThumb ? 'border-amber-500 bg-amber-950/20' : 'border-gray-700 hover:border-amber-500 hover:bg-gray-900/50'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDraggingThumb(true); }}
                    onDragLeave={() => setDraggingThumb(false)}
                    onDrop={handleDropThumb}
                    onClick={() => thumbInputRef.current?.click()}
                  >
                    <div className="text-2xl mb-2">{draggingThumb ? '🖼️' : '📸'}</div>
                    <p className="text-gray-300 text-sm font-medium mb-1 line-clamp-1">
                      {draggingThumb ? 'Drop thumbnail' : 'Browse cover image'}
                    </p>
                    <p className="text-gray-500 text-xs font-mono truncate">Shows before playing</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-3 py-3 bg-black border border-gray-800 rounded-sm h-[108px]">
                    <span className="text-2xl">📸</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate font-medium">{stagedThumbFile.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{formatBytes(stagedThumbFile.size)}</p>
                    </div>
                    {uploadProgress === 'uploading' && <div className="w-4 h-4 border-2 border-gray-700 border-t-amber-500 rounded-full animate-spin shrink-0" />}
                    {uploadProgress === 'done' && <span className="text-green-500 text-sm shrink-0">✓</span>}
                    <button onClick={() => { setStagedThumbFile(null); setStagedThumbPreview(null); }} className="text-gray-500 hover:text-red-400 transition text-lg leading-none px-1 shrink-0">✕</button>
                  </div>
                )}
                {thumbError && <p className="mt-2 text-xs font-semibold tracking-wider uppercase text-red-400 flex items-center gap-1.5"><span>⚠️</span> {thumbError}</p>}
              </div>
            )}
          </div>
        )}

        {uploadMode === 'url' && (
          <div className={`grid gap-4 ${isVideoMode ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Media URL</label>
              <input 
                type="text" 
                className="w-full bg-black border border-gray-800 rounded-sm p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-all"
                placeholder="https://example.com/media.mp4"
                value={formData.mediaUrl}
                onChange={(e) => setFormData({...formData, mediaUrl: e.target.value})}
              />
            </div>
            {isVideoMode && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Thumbnail URL</label>
                <input 
                  type="text" 
                  className="w-full bg-black border border-gray-800 rounded-sm p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-all"
                  placeholder="https://example.com/poster.jpg"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({...formData, thumbnailUrl: e.target.value})}
                />
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Media Type</label>
            <select 
              className="w-full bg-black border border-gray-800 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-pink-500 transition-all cursor-pointer"
              value={formData.mediaType}
              onChange={(e) => setFormData({...formData, mediaType: e.target.value as 'image' | 'video'})}
            >
              <option value="image">📷 Image</option>
              <option value="video">🎥 Video</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Alt Text</label>
            <input 
              type="text" 
              className="w-full bg-black border border-gray-800 rounded-sm p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-all"
              placeholder="Describe media..."
              value={formData.altText}
              onChange={(e) => setFormData({...formData, altText: e.target.value})}
            />
          </div>
        </div>

        {(previewUrl || thumbPreviewUrl) && (
          <div className="pt-4 border-t border-gray-800/60">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Preview</p>
              {(stagedFile || stagedThumbFile) && <span className="text-[10px] text-amber-500 font-bold tracking-widest uppercase bg-amber-950/30 border border-amber-900/50 px-2 py-0.5 rounded-sm">Not Saved</span>}
              {!stagedFile && !stagedThumbFile && (formData.mediaUrl || formData.thumbnailUrl) && <span className="text-[10px] text-green-500 font-bold tracking-widest uppercase bg-green-950/30 border border-green-900/50 px-2 py-0.5 rounded-sm">Live</span>}
            </div>
            {previewType === 'video' ? (
              <video 
                src={previewUrl || undefined} 
                poster={thumbPreviewUrl || undefined} 
                className="w-full h-40 bg-black rounded-sm object-cover border border-gray-800" 
                controls 
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={previewUrl || undefined} 
                alt={formData.altText || 'Media preview'} 
                className="w-full h-40 bg-black rounded-sm object-cover border border-gray-800" 
              />
            )}
          </div>
        )}
      </div>

      <div className="p-4 bg-black/40 border-t border-gray-800 flex justify-end gap-3">
        <button 
          onClick={handleSave}
          disabled={!canSave}
          className="px-6 py-2.5 bg-pink-600 text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-pink-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
              Saving
            </>
          ) : 'Save Asset'}
        </button>
      </div>
    </div>
  );
}