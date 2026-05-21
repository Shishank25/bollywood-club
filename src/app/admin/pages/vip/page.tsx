'use client';

import React, { useEffect, useRef, useState, ChangeEvent, DragEvent } from 'react';
import { useRouter } from 'next/navigation';

// ─── Types & Configuration ───────────────────────────────────────────────────

interface MediaAsset {
  html_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  alt_text: string | null;
  width: number | null;
  height: number | null;
}

// Configured specifically for the VIP page slots
const VIP_SLOTS = [
  { id: 'hero-media', label: '🎬 VIP Hero Media', description: 'Main background video or image at the top of the VIP page', folder: 'vip' },
  { id: 'form-media', label: '📝 VIP Form Media', description: 'Image or video displayed next to the VIP booking form', folder: 'vip' },
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

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function VipPageEditorPage() {
  const router = useRouter();
  const [mediaAssets, setMediaAssets] = useState<Record<string, MediaAsset>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVipPageMedia();
  }, []);

  const fetchVipPageMedia = async () => {
    try {
      setLoading(true);
      // Fetching specifically for the /vip route
      const res = await fetch('/api/media?page=/vip');
      if (!res.ok) throw new Error('Failed to fetch VIP page media');
      
      const data = await res.json();
      setMediaAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading VIP page data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading VIP page editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Edit VIP Page Media</h2>
        <p className="text-slate-400">Configure the hero and form media assets for your VIP Table packages</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-200">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Media Slots Grid */}
      <div className="grid gap-6">
        {VIP_SLOTS.map((slot) => (
          <MediaEditorCard 
            key={slot.id}
            slotConfig={slot}
            initialData={mediaAssets[slot.id]}
            onRefresh={fetchVipPageMedia}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Media Editor Card ────────────────────────────────────────────────────────

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

  const [uploadMode, setUploadMode] = useState<UploadMode>('file');
  const [saving, setSaving]         = useState(false);
  const [dragging, setDragging]     = useState(false);

  // Staged file state
  const [stagedFile, setStagedFile]       = useState<File | null>(null);
  const [stagedPreview, setStagedPreview] = useState<string | null>(null);
  const [fileError, setFileError]         = useState('');
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'done'>('idle');

  const [formData, setFormData] = useState({
    mediaUrl:  initialData?.media_url   || '',
    mediaType: (initialData?.media_type || 'image') as 'image' | 'video',
    altText:   initialData?.alt_text    || '',
    width:     initialData?.width?.toString()  || '',
    height:    initialData?.height?.toString() || '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        mediaUrl:  initialData.media_url,
        mediaType: initialData.media_type,
        altText:   initialData.alt_text    || '',
        width:     initialData.width?.toString()  || '',
        height:    initialData.height?.toString() || '',
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

  const clearStaged = () => {
    if (stagedPreview) URL.revokeObjectURL(stagedPreview);
    setStagedFile(null);
    setStagedPreview(null);
    setFileError('');
    setUploadProgress('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) stageFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) stageFile(file);
  };

  // ── Save Logic ──
  const handleSave = async () => {
    try {
      setSaving(true);
      const fd = new FormData();

      // Ensure we hit the VIP route
      fd.append('pageRoute', '/vip');
      fd.append('htmlId', slotConfig.id);
      fd.append('mediaType', formData.mediaType);
      fd.append('altText', formData.altText);
      if (formData.width) fd.append('width', formData.width);
      if (formData.height) fd.append('height', formData.height);

      if (uploadMode === 'file' && stagedFile) {
        setUploadProgress('uploading');
        fd.append('file', stagedFile);
        fd.append('folder', slotConfig.folder);
      } else if (uploadMode === 'url') {
        if (!formData.mediaUrl) throw new Error('Please enter a media URL');
        fd.append('mediaUrl', formData.mediaUrl);
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

      setFormData((prev) => ({ ...prev, mediaUrl: saved.media_url ?? prev.mediaUrl }));
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
    ((uploadMode === 'file' && stagedFile != null) || 
     (uploadMode === 'url'  && formData.mediaUrl.trim() !== ''));

  const previewUrl  = stagedPreview ?? formData.mediaUrl;
  const previewType = stagedFile 
    ? (ALLOWED_VIDEO_TYPES.includes(stagedFile.type) ? 'video' : 'image') 
    : formData.mediaType;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:border-slate-600 transition-colors">
      <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700/50 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-white">{slotConfig.label}</h3>
          <p className="text-sm text-slate-400 mt-1">{slotConfig.description}</p>
        </div>
        <div className="text-xs font-mono bg-slate-900 px-3 py-1 rounded text-slate-300 border border-slate-600">
          {slotConfig.id}
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Toggle Mode */}
        <div className="flex gap-1 bg-slate-900 border border-slate-700 rounded-lg p-1 w-fit">
          {(['file', 'url'] as UploadMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setUploadMode(m); clearStaged(); }}
              className={`px-4 py-1.5 text-sm font-medium rounded transition ${
                uploadMode === m ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m === 'file' ? '📁 Upload file' : '🔗 Paste URL'}
            </button>
          ))}
        </div>

        {/* File Mode */}
        {uploadMode === 'file' && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(',')}
              className="hidden"
              onChange={handleFileInput}
            />
            {!stagedFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                  dragging ? 'border-blue-500 bg-blue-950/40' : 'border-slate-600 hover:border-blue-500 hover:bg-slate-900/60'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-3xl mb-2">{dragging ? '📂' : '☁️'}</div>
                <p className="text-slate-300 text-sm font-medium mb-1">
                  {dragging ? 'Drop to stage' : 'Drag & drop or click to browse'}
                </p>
                <p className="text-slate-500 text-xs font-mono">Images up to 30 MB · Videos up to 24 MB</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg">
                <span className="text-2xl">{previewType === 'video' ? '🎬' : '🖼️'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate font-medium">{stagedFile.name}</p>
                  <p className="text-xs text-slate-400 font-mono">{formatBytes(stagedFile.size)}</p>
                </div>
                {uploadProgress === 'uploading' && <div className="w-4 h-4 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin" />}
                {uploadProgress === 'done' && <span className="text-green-400 text-sm">✓</span>}
                <button onClick={clearStaged} className="text-slate-400 hover:text-red-400 transition text-lg leading-none px-1">✕</button>
              </div>
            )}
            {fileError && <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5"><span>⚠️</span> {fileError}</p>}
          </div>
        )}

        {/* URL Mode */}
        {uploadMode === 'url' && (
          <div>
            <label className="block text-sm font-medium text-white mb-2">Media URL</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="https://example.com/image.jpg"
              value={formData.mediaUrl}
              onChange={(e) => setFormData({...formData, mediaUrl: e.target.value})}
            />
          </div>
        )}

        {/* Type & Alt Text */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Media Type</label>
          <select 
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
            value={formData.mediaType}
            onChange={(e) => setFormData({...formData, mediaType: e.target.value as 'image' | 'video'})}
          >
            <option value="image">📷 Image</option>
            <option value="video">🎥 Video</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Alt Text (SEO / Accessibility)</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Describe the media content..."
            value={formData.altText}
            onChange={(e) => setFormData({...formData, altText: e.target.value})}
          />
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Width (px)</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g. 1920"
              value={formData.width}
              onChange={(e) => setFormData({...formData, width: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Height (px)</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g. 1080"
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: e.target.value})}
            />
          </div>
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Preview</p>
              {stagedFile && <span className="text-xs text-amber-400 font-mono bg-amber-900/30 border border-amber-700/40 px-2 py-0.5 rounded">⏳ Not yet saved</span>}
              {!stagedFile && formData.mediaUrl && <span className="text-xs text-green-400 font-mono bg-green-900/30 border border-green-700/40 px-2 py-0.5 rounded">✓ Live</span>}
            </div>
            {previewType === 'video' ? (
              <video src={previewUrl} className="w-full h-48 bg-slate-900 rounded-lg object-cover border border-slate-600" controls />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt={formData.altText || 'Media preview'} className="w-full h-48 bg-slate-900 rounded-lg object-cover border border-slate-600" />
            )}
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-700/30 border-t border-slate-700 flex justify-end gap-3">
        <button 
          onClick={handleSave}
          disabled={!canSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {uploadMode === 'file' && stagedFile ? 'Uploading...' : 'Saving...'}
            </>
          ) : '💾 Save'}
        </button>
      </div>
    </div>
  );
}