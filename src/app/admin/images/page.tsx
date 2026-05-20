'use client';

import React, { useState, useEffect, useRef, useCallback, DragEvent, ChangeEvent } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MediaFile {
  name: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  uploadedAt: string;
}

type SortKey = 'newest' | 'oldest' | 'name' | 'size';
type FilterType = 'all' | 'image' | 'video';
type ViewMode = 'grid' | 'list';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Toast ────────────────────────────────────────────────────────────────────

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const push = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  return { toasts, push };
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────

interface UploadZoneProps {
  onUpload: (files: File[]) => void;
  isUploading: boolean;
}

function UploadZone({ onUpload, isUploading }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onUpload(files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onUpload(files);
    e.target.value = '';
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all ${
        dragging
          ? 'border-blue-500 bg-blue-950'
          : 'border-slate-600 bg-slate-950 hover:border-blue-500 hover:bg-slate-900'
      } ${isUploading ? 'cursor-default opacity-70' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !isUploading && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={handleChange}
      />

      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-7 h-7 border-3 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-slate-400 text-sm font-medium">Uploading…</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="text-4xl">{dragging ? '📂' : '☁️'}</div>
          <span className="text-slate-300 text-sm font-medium">
            {dragging ? 'Drop to upload' : 'Drag & drop files here, or click to browse'}
          </span>
          <span className="text-slate-500 text-xs font-mono">Images &amp; videos · max 30 MB each</span>
        </div>
      )}
    </div>
  );
}

// ─── Media Card ───────────────────────────────────────────────────────────────

interface MediaCardProps {
  file: MediaFile;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onCopy: () => void;
  viewMode: ViewMode;
}

function MediaCard({ file, selected, onSelect, onDelete, onCopy, viewMode }: MediaCardProps) {
  if (viewMode === 'list') {
    return (
      <div className={`grid grid-cols-[52px_1fr_90px_180px_80px] gap-3 px-4 py-2.5 items-center border-b border-slate-800 cursor-pointer transition hover:bg-slate-900 ${selected ? 'bg-slate-800' : ''}`} onClick={onSelect}>
        <div className="relative w-11 h-11 rounded overflow-hidden bg-slate-900">
          {file.type === 'video' ? (
            <video src={file.url} className="w-full h-full object-cover" muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
          )}
          {file.type === 'video' && <span className="absolute top-1 right-1 bg-black/75 rounded text-xs text-white px-1">▶</span>}
        </div>
        <span className="text-sm text-slate-200 truncate font-mono" title={file.name}>{file.name}</span>
        <span className="text-xs text-slate-400 font-mono">{formatBytes(file.size)}</span>
        <span className="text-xs text-slate-400">{formatDate(file.uploadedAt)}</span>
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button className="px-1.5 py-1.5 text-xs border border-slate-600 text-slate-300 rounded hover:bg-slate-800 hover:border-blue-600 hover:text-blue-400 transition" onClick={onCopy} title="Copy URL">⧉</button>
          <button className="px-1.5 py-1.5 text-xs border border-slate-600 text-slate-300 rounded hover:bg-red-900 hover:border-red-600 hover:text-red-300 transition" onClick={onDelete} title="Delete">✕</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-900 border border-slate-700 rounded-lg overflow-hidden cursor-pointer transition hover:border-slate-600 hover:-translate-y-0.5 ${selected ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}`} onClick={onSelect}>
      <div className="relative aspect-square overflow-hidden bg-slate-950">
        {file.type === 'video' ? (
          <video src={file.url} className="w-full h-full object-cover" muted />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
        )}
        {file.type === 'video' && <span className="absolute top-1.5 right-1.5 bg-black/75 rounded text-xs text-white px-1.5 py-0.5">▶</span>}
        <div className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded font-medium transition" onClick={(e) => { e.stopPropagation(); onCopy(); }}>
            Copy URL
          </button>
          <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-red-100 text-xs rounded font-medium transition" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            Delete
          </button>
        </div>
      </div>
      <div className="px-2.5 py-2 flex justify-between items-center gap-2">
        <span className="text-xs text-slate-300 truncate font-mono" title={file.name}>{file.name}</span>
        <span className="text-xs text-slate-500 whitespace-nowrap font-mono">{formatBytes(file.size)}</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminImagesPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const { toasts, push } = useToast();

  // ── Load files ──────────────────────────────────────────────────────────────

  const loadFiles = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/upload');
      const data = await res.json();
      if (data.files) setFiles(data.files);
    } catch {
      push('Failed to load files', 'error');
    } finally {
      setLoading(false);
    }
  }, [push]);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  // ── Upload ──────────────────────────────────────────────────────────────────

  const handleUpload = async (incoming: File[]) => {
    setUploading(true);
    const results: MediaFile[] = [];
    const errors: string[] = [];

    for (const file of incoming) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        
        if (!res.ok) {
          const data = await res.json();
          errors.push(data.error ?? file.name);
          continue;
        }

        const data = await res.json();
        
        // Handle both response formats
        const mediaFile: MediaFile | null = data.file 
          ? {
              name: data.file.name || data.file.url?.split('/').pop() || file.name,
              url: data.file.url || data.url,
              type: file.type.startsWith('video/') ? 'video' : 'image',
              size: data.file.size || file.size,
              uploadedAt: data.file.uploadedAt || new Date().toISOString(),
            }
          : data.url
          ? {
              name: data.url.split('/').pop() || file.name,
              url: data.url,
              type: file.type.startsWith('video/') ? 'video' : 'image',
              size: file.size,
              uploadedAt: new Date().toISOString(),
            }
          : null;

        if (mediaFile) {
          results.push(mediaFile);
        } else {
          errors.push(data.error ?? file.name);
        }
      } catch (err) {
        console.error('Upload error:', err);
        errors.push(file.name);
      }
    }

    if (results.length) {
      setFiles((prev) => [...results, ...prev]);
      push(`${results.length} file${results.length > 1 ? 's' : ''} uploaded`, 'success');
    }
    if (errors.length) {
      push(errors[0], 'error');
    }
    setUploading(false);
  };

  // ── Delete ──────────────────────────────────────────────────────────────────

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/upload?name=${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setFiles((prev) => prev.filter((f) => f.name !== name));
        setSelected((prev) => { const s = new Set(prev); s.delete(name); return s; });
        if (preview?.name === name) setPreview(null);
        push('File deleted', 'success');
      } else {
        push(data.error ?? 'Delete failed', 'error');
      }
    } catch {
      push('Delete failed', 'error');
    }
  };

  const handleDeleteSelected = async () => {
    if (!selected.size) return;
    if (!confirm(`Delete ${selected.size} file(s)?`)) return;
    for (const name of selected) await handleDelete(name);
    setSelected(new Set());
  };

  // ── Copy URL ────────────────────────────────────────────────────────────────

  const copyUrl = (file: MediaFile) => {
    const fullUrl = `${window.location.origin}${file.url}`;
    navigator.clipboard.writeText(fullUrl).then(
      () => push('URL copied!', 'success'),
      () => push('Copy failed', 'error')
    );
  };

  // ── Toggle select ───────────────────────────────────────────────────────────

  const toggleSelect = (name: string) => {
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(name) ? s.delete(name) : s.add(name);
      return s;
    });
  };

  // ── Filtered + sorted list ──────────────────────────────────────────────────

  const displayed = files
    .filter((f) => {
      if (filter !== 'all' && f.type !== filter) return false;
      if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      if (sort === 'oldest') return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'size') return b.size - a.size;
      return 0;
    });

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Toast */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-lg text-sm font-medium animate-in slide-in-from-bottom-2 ${
              t.type === 'success'
                ? 'bg-green-900 text-green-200 border border-green-700'
                : 'bg-red-900 text-red-200 border border-red-700'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>

      {/* Preview modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700">
              <span className="text-sm text-slate-300 font-mono truncate">{preview.name}</span>
              <button className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 px-2 py-1 rounded transition" onClick={() => setPreview(null)}>✕</button>
            </div>
            <div className="p-5 flex justify-center bg-slate-950">
              {preview.type === 'video' ? (
                <video src={preview.url} controls className="max-w-full max-h-96 rounded-lg" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview.url} alt={preview.name} className="max-w-full max-h-96 rounded-lg" />
              )}
            </div>
            <div className="px-5 py-4 border-t border-slate-700 space-y-3">
              <div className="flex gap-2 text-xs text-slate-400 font-mono">
                <span>{formatBytes(preview.size)}</span>
                <span>·</span>
                <span>{formatDate(preview.uploadedAt)}</span>
              </div>
              <div className="flex gap-2 items-center">
                <code className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-blue-400 font-mono truncate">
                  {typeof window !== 'undefined' ? `${window.location.origin}${preview.url}` : preview.url}
                </code>
                <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded font-medium transition" onClick={() => copyUrl(preview)}>Copy URL</button>
              </div>
              <div className="flex justify-end">
                <button className="px-3 py-2 bg-red-900 hover:bg-red-800 border border-red-700 text-red-200 text-xs rounded font-medium transition" onClick={() => handleDelete(preview.name)}>
                  Delete file
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Page header */}
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-white mb-1">Media Library</h1>
          <p className="text-sm text-slate-400 font-mono">
            {files.length} file{files.length !== 1 ? 's' : ''} · {formatBytes(totalSize)} used
          </p>
        </div>

        {/* Upload zone */}
        <div className="mb-6">
          <UploadZone onUpload={handleUpload} isUploading={uploading} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex flex-wrap items-center gap-3">
            <input
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm w-56 focus:border-blue-500 outline-none transition placeholder-slate-500"
              placeholder="Search files…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-1 bg-slate-900 rounded-lg border border-slate-700 p-0.5">
              {(['all', 'image', 'video'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  className={`px-3 py-1 text-xs font-medium rounded transition ${
                    filter === f
                      ? 'bg-slate-700 text-blue-300'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'All' : f === 'image' ? '🖼 Images' : '🎬 Videos'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selected.size > 0 && (
              <button className="px-3 py-2 bg-red-900 hover:bg-red-800 border border-red-700 text-red-200 text-xs rounded font-medium transition" onClick={handleDeleteSelected}>
                Delete {selected.size} selected
              </button>
            )}
            <select
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm focus:border-blue-500 outline-none transition"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name A–Z</option>
              <option value="size">Largest first</option>
            </select>
            <div className="flex border border-slate-700 rounded-lg overflow-hidden">
              <button
                className={`px-3 py-2 text-lg transition ${viewMode === 'grid' ? 'bg-slate-700 text-blue-300' : 'text-slate-400 hover:text-slate-300'}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >⊞</button>
              <button
                className={`px-3 py-2 text-lg transition border-l border-slate-700 ${viewMode === 'list' ? 'bg-slate-700 text-blue-300' : 'text-slate-400 hover:text-slate-300'}`}
                onClick={() => setViewMode('list')}
                title="List view"
              >☰</button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-slate-400">Loading…</span>
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <span className="text-5xl">🗂️</span>
            <span className="text-slate-400">
              {files.length === 0 ? 'No files uploaded yet' : 'No files match your search'}
            </span>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayed.map((file) => (
              <MediaCard
                key={file.name}
                file={file}
                selected={selected.has(file.name)}
                onSelect={() => toggleSelect(file.name)}
                onDelete={() => handleDelete(file.name)}
                onCopy={() => copyUrl(file)}
                viewMode="grid"
              />
            ))}
          </div>
        ) : (
          <div className="border border-slate-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-[52px_1fr_90px_180px_80px] gap-3 px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wide font-mono">
              <span />
              <span>Name</span>
              <span>Size</span>
              <span>Uploaded</span>
              <span />
            </div>
            {displayed.map((file) => (
              <MediaCard
                key={file.name}
                file={file}
                selected={selected.has(file.name)}
                onSelect={() => setPreview(file)}
                onDelete={() => handleDelete(file.name)}
                onCopy={() => copyUrl(file)}
                viewMode="list"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}