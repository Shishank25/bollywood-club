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
      className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors duration-200 mb-6 
        ${isUploading 
          ? 'cursor-default opacity-70 border-slate-700 bg-slate-900' 
          : dragging 
            ? 'cursor-pointer border-blue-500 bg-[#1e3a5f]' 
            : 'cursor-pointer border-slate-700 bg-slate-900 hover:border-blue-500 hover:bg-slate-800'
        }`}
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
          <div className="w-7 h-7 border-[3px] border-slate-800 border-t-blue-500 rounded-full animate-[spin_0.7s_linear_infinite]" />
          <span className="text-[0.95rem] text-slate-400 font-medium">Uploading…</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="text-[2.5rem] leading-none">{dragging ? '📂' : '☁️'}</div>
          <span className="text-[0.95rem] text-slate-400 font-medium">
            {dragging ? 'Drop to upload' : 'Drag & drop files here, or click to browse'}
          </span>
          <span className="text-xs text-slate-600 font-mono">Images &amp; videos · max 30 MB each</span>
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
      <div 
        className={`grid grid-cols-[52px_1fr_90px_180px_80px] gap-3 px-4 py-[0.55rem] items-center border-b border-slate-800 cursor-pointer transition-colors duration-150 last:border-b-0 hover:bg-slate-800 group ${selected ? 'bg-[#1e3a5f]' : ''}`} 
        onClick={onSelect}
      >
        <div className="relative w-[44px] h-[44px] rounded-md overflow-hidden bg-slate-900">
          {file.type === 'video' ? (
            <video src={file.url} className="w-full h-full object-cover" muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
          )}
          {file.type === 'video' && <span className="absolute top-[6px] right-[6px] bg-black/75 rounded px-[5px] py-[2px] text-[0.7rem] text-white backdrop-blur-[4px]">▶</span>}
        </div>
        <span className="text-[0.82rem] text-slate-300 whitespace-nowrap overflow-hidden text-ellipsis font-mono" title={file.name}>{file.name}</span>
        <span className="text-[0.78rem] text-slate-500 font-mono">{formatBytes(file.size)}</span>
        <span className="text-[0.75rem] text-slate-500">{formatDate(file.uploadedAt)}</span>
        <div className="flex gap-[0.4rem]" onClick={(e) => e.stopPropagation()}>
          <button className="bg-transparent border border-slate-700 text-slate-400 rounded-[5px] px-2 py-[0.3rem] text-[0.8rem] cursor-pointer transition-all duration-150 hover:bg-[#1e3a5f] hover:border-blue-500 hover:text-blue-400" onClick={onCopy} title="Copy URL">⧉</button>
          <button className="bg-transparent border border-slate-700 text-slate-400 rounded-[5px] px-2 py-[0.3rem] text-[0.8rem] cursor-pointer transition-all duration-150 hover:bg-red-900 hover:border-red-800 hover:text-red-300" onClick={onDelete} title="Delete">✕</button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-slate-800 border rounded-[10px] overflow-hidden cursor-pointer transition-all duration-150 group hover:-translate-y-[1px] ${selected ? 'border-blue-500 shadow-[0_0_0_2px_#1d4ed840]' : 'border-slate-700 hover:border-slate-600'}`} 
      onClick={onSelect}
    >
      <div className="relative aspect-square overflow-hidden bg-slate-900">
        {file.type === 'video' ? (
          <video src={file.url} className="w-full h-full object-cover block transition-transform duration-200 group-hover:scale-[1.03]" muted />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={file.url} alt={file.name} className="w-full h-full object-cover block transition-transform duration-200 group-hover:scale-[1.03]" loading="lazy" />
        )}
        {file.type === 'video' && <span className="absolute top-[6px] right-[6px] bg-black/75 rounded px-[5px] py-[2px] text-[0.7rem] text-white backdrop-blur-[4px]">▶</span>}
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button className="px-4 py-[0.4rem] rounded-md text-[0.78rem] font-sans font-medium cursor-pointer transition-all duration-150 border-none bg-blue-700 text-white hover:bg-blue-600" onClick={(e) => { e.stopPropagation(); onCopy(); }}>
            Copy URL
          </button>
          <button className="px-4 py-[0.4rem] rounded-md text-[0.78rem] font-sans font-medium cursor-pointer transition-all duration-150 border-none bg-red-900 text-red-300 hover:bg-red-800" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            Delete
          </button>
        </div>
      </div>
      <div className="p-[0.55rem_0.65rem] flex justify-between items-center gap-2">
        <span className="text-[0.72rem] text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis flex-1 font-mono" title={file.name}>{file.name}</span>
        <span className="text-[0.68rem] text-slate-600 whitespace-nowrap font-mono">{formatBytes(file.size)}</span>
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
        const data = await res.json();
        if (data.file) results.push(data.file);
        else errors.push(data.error ?? file.name);
      } catch {
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Toast */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[200]">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className={`p-[0.65rem_1.1rem] rounded-lg text-[0.83rem] font-sans font-medium shadow-[0_4px_20px_rgba(0,0,0,0.4)] animate-[slideUp_0.25s_ease] ${
              t.type === 'success' ? 'bg-[#14532d] text-[#86efac] border border-[#166534]' : 'bg-[#7f1d1d] text-[#fca5a5] border border-[#991b1b]'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-[4px] z-[100] flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-slate-800 border border-slate-700 rounded-[14px] w-full max-w-[680px] max-h-[90vh] overflow-auto shadow-[0_24px_80px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-[1rem_1.25rem] border-b border-slate-700">
              <span className="text-[0.85rem] text-slate-400 font-mono whitespace-nowrap overflow-hidden text-ellipsis flex-1">{preview.name}</span>
              <button className="bg-transparent border-none text-slate-500 text-base cursor-pointer p-[0.2rem_0.5rem] rounded transition-colors duration-150 hover:bg-slate-900 hover:text-slate-200" onClick={() => setPreview(null)}>✕</button>
            </div>
            <div className="p-5 flex justify-center">
              {preview.type === 'video' ? (
                <video src={preview.url} controls className="max-w-full max-h-[60vh] object-contain rounded-lg" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview.url} alt={preview.name} className="max-w-full max-h-[60vh] object-contain rounded-lg" />
              )}
            </div>
            <div className="p-[1rem_1.25rem] border-t border-slate-700 flex flex-col gap-3">
              <div className="flex gap-2 text-[0.78rem] text-slate-500 font-mono">
                <span>{formatBytes(preview.size)}</span>
                <span>·</span>
                <span>{formatDate(preview.uploadedAt)}</span>
              </div>
              <div className="flex gap-[0.6rem] items-center">
                <code className="flex-1 bg-slate-900 border border-slate-700 rounded-md p-[0.45rem_0.75rem] text-[0.75rem] text-blue-400 font-mono whitespace-nowrap overflow-hidden text-ellipsis block">
                  {typeof window !== 'undefined' ? `${window.location.origin}${preview.url}` : preview.url}
                </code>
                <button className="bg-blue-700 text-white border-none rounded-md p-[0.45rem_0.9rem] text-[0.8rem] font-sans cursor-pointer whitespace-nowrap transition-colors duration-150 hover:bg-blue-600" onClick={() => copyUrl(preview)}>Copy URL</button>
              </div>
              <div className="flex justify-end">
                <button className="bg-transparent border border-red-900 text-red-300 rounded-md p-[0.4rem_0.9rem] text-[0.8rem] font-sans cursor-pointer transition-colors duration-150 hover:bg-red-900" onClick={() => handleDelete(preview.name)}>
                  Delete file
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-8 max-w-[1400px] font-sans text-slate-200">
        {/* Page header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <h1 className="text-[1.75rem] font-semibold tracking-[-0.02em] text-slate-50 m-0 mb-1">Media Library</h1>
            <p className="text-[0.8rem] text-slate-500 m-0 font-mono">
              {files.length} file{files.length !== 1 ? 's' : ''} · {formatBytes(totalSize)} used
            </p>
          </div>
        </div>

        {/* Upload zone */}
        <UploadZone onUpload={handleUpload} isUploading={uploading} />

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <input
              className="bg-slate-800 border border-slate-700 rounded-lg p-[0.45rem_0.85rem] text-slate-200 text-[0.85rem] font-sans outline-none w-[220px] transition-colors duration-200 focus:border-blue-500 placeholder-slate-600"
              placeholder="Search files…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-[0.3rem]">
              {(['all', 'image', 'video'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  className={`p-[0.4rem_0.85rem] rounded-md border text-[0.8rem] cursor-pointer font-sans transition-all duration-150 ${
                    filter === f ? 'bg-[#1e3a5f] text-blue-400 border-blue-700' : 'bg-transparent border-transparent text-slate-500 hover:text-slate-400 hover:bg-slate-800'
                  }`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'All' : f === 'image' ? '🖼 Images' : '🎬 Videos'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-[0.6rem]">
            {selected.size > 0 && (
              <button className="bg-red-900 border border-red-800 text-red-300 rounded-lg p-[0.45rem_0.9rem] text-[0.82rem] font-sans cursor-pointer transition-colors duration-150 hover:bg-red-800" onClick={handleDeleteSelected}>
                Delete {selected.size} selected
              </button>
            )}
            <select
              className="bg-slate-800 border border-slate-700 rounded-lg p-[0.45rem_0.75rem] text-slate-200 text-[0.82rem] font-sans cursor-pointer outline-none"
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
                className={`bg-transparent border-none p-[0.4rem_0.7rem] cursor-pointer text-base transition-all duration-150 leading-none ${viewMode === 'grid' ? 'bg-[#1e3a5f] text-blue-400' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-400'}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >⊞</button>
              <button
                className={`bg-transparent border-none p-[0.4rem_0.7rem] cursor-pointer text-base transition-all duration-150 leading-none ${viewMode === 'list' ? 'bg-[#1e3a5f] text-blue-400' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-400'}`}
                onClick={() => setViewMode('list')}
                title="List view"
              >☰</button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 px-8 text-slate-600">
            <div className="w-7 h-7 border-[3px] border-slate-800 border-t-blue-500 rounded-full animate-[spin_0.7s_linear_infinite]" />
            <span>Loading…</span>
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 px-8 text-slate-600">
            <span className="text-[3rem]">🗂️</span>
            <span className="text-[0.95rem]">
              {files.length === 0 ? 'No files uploaded yet' : 'No files match your search'}
            </span>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
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
          <div className="border border-slate-800 rounded-[10px] overflow-hidden">
            <div className="grid grid-cols-[52px_1fr_90px_180px_80px] gap-3 p-[0.6rem_1rem] bg-slate-900 border-b border-slate-800 text-[0.72rem] font-semibold text-slate-600 uppercase tracking-[0.06em] font-mono">
              <span className="col-start-2 text-[0.82rem] text-slate-300 whitespace-nowrap overflow-hidden text-ellipsis font-mono">Name</span>
              <span className="text-[0.78rem] text-slate-500 font-mono">Size</span>
              <span className="text-[0.75rem] text-slate-500">Uploaded</span>
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
    </>
  );
}