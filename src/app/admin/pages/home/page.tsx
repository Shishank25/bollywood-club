// app/admin/pages/home/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Video {
  id: number;
  section_id: number;
  title: string;
  video_url: string;
  thumbnail_url: string;
  description: string;
  duration: number;
}

interface Section {
  id: number;
  section_id: string;
  type: string;
  title: string;
  content: string;
  metadata: any;
}

export default function HomePageEditorPage() {
  const router = useRouter();
  const [pageId, setPageId] = useState<number | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [heroVideo, setHeroVideo] = useState<Video | null>(null);
  const [cinematicHighlights, setCinematicHighlights] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHomePageData();
  }, []);

  const fetchHomePageData = async () => {
    try {
      setLoading(true);
      // Get page ID first
      const pagesRes = await fetch('/api/admin/pages?slug=home');
      if (!pagesRes.ok) throw new Error('Failed to fetch home page');
      const page = await pagesRes.json();
      setPageId(page.id);

      // Get sections
      const sectionsRes = await fetch(`/api/admin/sections?pageId=${page.id}`);
      if (!sectionsRes.ok) throw new Error('Failed to fetch sections');
      const sectionsData = await sectionsRes.json();
      setSections(sectionsData);

      // Load hero video
      const heroSection = sectionsData.find((s: Section) => s.section_id === 'hero-video');
      if (heroSection) {
        const heroRes = await fetch(`/api/admin/videos?sectionId=${heroSection.id}`);
        if (heroRes.ok) {
          const videos = await heroRes.json();
          setHeroVideo(videos[0] || null);
        }
      }

      // Load cinematic highlights
      const highlightsSection = sectionsData.find((s: Section) => s.section_id === 'cinematic-highlights');
      if (highlightsSection) {
        const highlightsRes = await fetch(`/api/admin/videos?sectionId=${highlightsSection.id}`);
        if (highlightsRes.ok) {
          const videos = await highlightsRes.json();
          setCinematicHighlights(videos);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading home page data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVideo = async (videoId: number, updates: Partial<Video>) => {
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/videos?id=${videoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update video');
      await fetchHomePageData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating video');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading home page editor...</div>;
  }

  return (
    <div className="home-editor-page">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => router.push('/admin/pages')}>
          ← Back to Pages
        </button>
        <h2>Edit Home Page</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="editor-sections">
        {/* HERO VIDEO SECTION */}
        <div className="editor-section hero-video-section">
          <div className="section-header">
            <h3>🎬 Hero Video</h3>
            <p className="section-description">Main video displayed at the top of your home page</p>
          </div>

          <div className="section-content">
            {heroVideo ? (
              <VideoEditor
                video={heroVideo}
                onUpdate={(updates) => handleUpdateVideo(heroVideo.id, updates)}
                isSaving={saving}
              />
            ) : (
              <div className="empty-section">
                <p>No hero video set yet</p>
                <button className="btn btn-primary" onClick={() => alert('Create new video section first')}>
                  + Add Hero Video
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CINEMATIC HIGHLIGHTS SECTION */}
        <div className="editor-section highlights-section">
          <div className="section-header">
            <h3>✨ Cinematic Highlights</h3>
            <p className="section-description">Up to 2 cinematic highlight videos</p>
          </div>

          <div className="section-content">
            {cinematicHighlights.length > 0 ? (
              <div className="video-grid">
                {cinematicHighlights.map((video, index) => (
                  <div key={video.id} className="video-item">
                    <div className="video-number">Video {index + 1}</div>
                    <VideoEditor
                      video={video}
                      onUpdate={(updates) => handleUpdateVideo(video.id, updates)}
                      isSaving={saving}
                      isCompact
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-section">
                <p>No cinematic highlights added yet</p>
                <button className="btn btn-primary" onClick={() => alert('Create cinematic highlights section first')}>
                  + Add Highlights
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .home-editor-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .page-header h2 {
          font-size: 1.8rem;
          flex: 1;
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
          padding: 2rem;
          text-align: center;
          color: var(--text-secondary);
        }

        .editor-sections {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .editor-section {
          background: var(--secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .section-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
          background: linear-gradient(135deg, var(--secondary) 0%, rgba(59, 130, 246, 0.05) 100%);
        }

        .section-header h3 {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
        }

        .section-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .section-content {
          padding: 1.5rem;
        }

        .empty-section {
          text-align: center;
          padding: 2rem;
          color: var(--text-secondary);
        }

        .empty-section p {
          margin-bottom: 1rem;
        }

        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .video-item {
          background: var(--tertiary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
        }

        .video-number {
          font-weight: 600;
          color: var(--accent);
          margin-bottom: 1rem;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}

// ============================================
// VIDEO EDITOR COMPONENT
// ============================================

interface VideoEditorProps {
  video: Video;
  onUpdate: (updates: Partial<Video>) => Promise<void>;
  isSaving?: boolean;
  isCompact?: boolean;
}

function VideoEditor({ video, onUpdate, isSaving = false, isCompact = false }: VideoEditorProps) {
  const [title, setTitle] = useState(video.title);
  const [videoUrl, setVideoUrl] = useState(video.video_url);
  const [thumbnailUrl, setThumbnailUrl] = useState(video.thumbnail_url || '');
  const [description, setDescription] = useState(video.description || '');

  const handleSave = async () => {
    await onUpdate({
      title,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      description,
    });
  };

  return (
    <div className="video-editor">
      <div className="form-group">
        <label className="form-label">Video Title</label>
        <input
          type="text"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Video title"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Video URL</label>
        <input
          type="url"
          className="form-input"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
        <p className="input-hint">Supports YouTube, Vimeo, or direct video URLs</p>
      </div>

      <div className="form-group">
        <label className="form-label">Thumbnail URL</label>
        <input
          type="url"
          className="form-input"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
        {thumbnailUrl && (
          <div className="thumbnail-preview">
            <img src={thumbnailUrl} alt="Thumbnail preview" />
          </div>
        )}
      </div>

      {!isCompact && (
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Video description"
            rows={3}
          />
        </div>
      )}

      <div className="editor-actions">
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? '💾 Saving...' : '💾 Save Video'}
        </button>
      </div>

      <style jsx>{`
        .video-editor {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .form-input,
        .form-textarea {
          padding: 0.75rem 1rem;
          background: var(--tertiary);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: inherit;
          transition: var(--transition);
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--accent);
          background: rgba(59, 130, 246, 0.05);
        }

        .form-textarea {
          resize: vertical;
        }

        .input-hint {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .thumbnail-preview {
          margin-top: 0.75rem;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border);
        }

        .thumbnail-preview img {
          width: 100%;
          height: auto;
          max-height: 200px;
          object-fit: cover;
          display: block;
        }

        .editor-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
      `}</style>
    </div>
  );
}