'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  { id: 'hero-media', label: '🎬 VIP Hero Media', description: 'Main background video or image at the top of the VIP page' },
  { id: 'form-media', label: '📝 VIP Form Media', description: 'Image or video displayed next to the VIP booking form' },
];

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

function MediaEditorCard({ 
  slotConfig, 
  initialData, 
  onRefresh 
}: { 
  slotConfig: { id: string; label: string; description: string };
  initialData?: MediaAsset;
  onRefresh: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    mediaUrl: initialData?.media_url || '',
    mediaType: initialData?.media_type || 'image' as 'image' | 'video',
    altText: initialData?.alt_text || '',
    width: initialData?.width?.toString() || '',
    height: initialData?.height?.toString() || '',
  });

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageRoute: '/vip', // Target the VIP route
          htmlId: slotConfig.id,
          mediaUrl: formData.mediaUrl,
          mediaType: formData.mediaType,
          altText: formData.altText,
          width: formData.width ? parseInt(formData.width, 10) : null,
          height: formData.height ? parseInt(formData.height, 10) : null,
        }),
      });

      if (!res.ok) throw new Error('Failed to save asset');
      
      alert('Saved successfully!');
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error saving asset');
    } finally {
      setSaving(false);
    }
  };

  const hasMedia = !!initialData?.media_url;

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
        <div>
          <label className="block text-sm font-medium text-white mb-2">Media URL</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white 
                     placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent transition-all"
            placeholder="https://example.com/image.jpg"
            value={formData.mediaUrl}
            onChange={(e) => setFormData({...formData, mediaUrl: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Media Type</label>
          <select 
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                     transition-all cursor-pointer"
            value={formData.mediaType}
            onChange={(e) => setFormData({...formData, mediaType: e.target.value as 'image' | 'video'})}
          >
            <option value="image">🖼️ Image</option>
            <option value="video">🎥 Video</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Alt Text (SEO / Accessibility)</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white 
                     placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent transition-all"
            placeholder="Describe the media content..."
            value={formData.altText}
            onChange={(e) => setFormData({...formData, altText: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Width (px)</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white 
                       placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent transition-all"
              placeholder="e.g. 1920"
              value={formData.width}
              onChange={(e) => setFormData({...formData, width: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Height (px)</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white 
                       placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent transition-all"
              placeholder="e.g. 1080"
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: e.target.value})}
            />
          </div>
        </div>

        {hasMedia && (
          <div className="pt-4 border-t border-slate-700">
            <p className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wide">Preview</p>
            {formData.mediaType === 'video' ? (
              <video 
                src={formData.mediaUrl}
                className="w-full h-48 bg-slate-900 rounded-lg object-cover border border-slate-600"
                controls
              />
            ) : (
              <img 
                src={formData.mediaUrl}
                alt={formData.altText || 'Media preview'}
                className="w-full h-48 bg-slate-900 rounded-lg object-cover border border-slate-600"
              />
            )}
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-700/30 border-t border-slate-700 flex justify-end gap-3">
        <button 
          onClick={handleSave}
          disabled={saving || !formData.mediaUrl}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                   disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed
                   font-medium transition-all duration-200"
        >
          {saving ? '⏳ Saving...' : '💾 Save'}
        </button>
      </div>
    </div>
  );
}