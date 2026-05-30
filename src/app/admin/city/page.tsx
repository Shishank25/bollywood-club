'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from 'next/image';

// Types matching our database schema
interface CityPage {
  id: string;
  slug: string;
  title: string;
  greeting: string | null;
  content: any | null; // TipTap JSON
  image_url: string | null;
  // NEW FIELDS
  footer_label: string | null;
  secondary_content: any | null;
}

// ─── TIPTAP TOOLBAR COMPONENT ───────────────────────────────────────────────
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 p-2 mb-2 bg-gray-50 border border-gray-300 rounded-t-md">
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        className={`px-2 py-1 text-sm rounded ${editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'}`}
      >
        Bold
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        className={`px-2 py-1 text-sm rounded ${editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'}`}
      >
        Italic
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
        className={`px-2 py-1 text-sm rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'}`}
      >
        H2
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
        className={`px-2 py-1 text-sm rounded ${editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'}`}
      >
        Bullet List
      </button>
    </div>
  );
};

// ─── MAIN ADMIN COMPONENT ───────────────────────────────────────────────────
export default function AdminCitiesPage() {
  const [cities, setCities] = useState<CityPage[]>([]);
  const [selectedId, setSelectedId] = useState<string>('new');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [greeting, setGreeting] = useState('');
  const [footerLabel, setFooterLabel] = useState(''); // NEW
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Initialize Primary Tiptap Editor (Main Content)
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 min-h-[200px] border border-gray-300 rounded-b-md focus:outline-none',
      },
    },
  });

  // NEW: Initialize Secondary Tiptap Editor (Secondary Content)
  const secondaryEditor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 min-h-[150px] border border-gray-300 rounded-b-md focus:outline-none bg-gray-50',
      },
    },
  });

  // Fetch Cities on Mount
  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await fetch('/api/admin/city'); // Make sure this path matches your backend
      if (res.ok) {
        const data = await res.json();
        setCities(data);
      }
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Populate form when a specific city is selected from the dropdown
  useEffect(() => {
    if (selectedId === 'new') {
      setTitle('');
      setSlug('');
      setGreeting('');
      setFooterLabel(''); // NEW
      setImageUrl('');
      setImageFile(null);
      setImagePreview(null);
      if (editor) editor.commands.setContent('');
      if (secondaryEditor) secondaryEditor.commands.setContent(''); // NEW
    } else {
      const city = cities.find((c) => c.id === selectedId);
      if (city) {
        setTitle(city.title || '');
        setSlug(city.slug || '');
        setGreeting(city.greeting || '');
        setFooterLabel(city.footer_label || ''); // NEW
        setImageUrl(city.image_url || '');
        setImageFile(null);
        setImagePreview(city.image_url || null);
        
        if (editor) {
          editor.commands.setContent(city.content || '');
        }
        if (secondaryEditor) {
          // NEW: Load JSON content into secondary Tiptap
          secondaryEditor.commands.setContent(city.secondary_content || '');
        }
      }
    }
  }, [selectedId, cities, editor, secondaryEditor]);

  // Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      if (selectedId !== 'new') formData.append('id', selectedId);
      
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('greeting', greeting);
      formData.append('footer_label', footerLabel); // NEW
      
      // Get JSON from primary Tiptap editor
      if (editor) {
        const jsonContent = editor.getJSON();
        formData.append('content', JSON.stringify(jsonContent));
      }

      // NEW: Get JSON from secondary Tiptap editor
      if (secondaryEditor) {
        const secondaryJsonContent = secondaryEditor.getJSON();
        formData.append('secondary_content', JSON.stringify(secondaryJsonContent));
      }

      if (imageFile) {
        formData.append('file', imageFile);
      } else if (imageUrl) {
        formData.append('image_url', imageUrl);
      }

      const res = await fetch('/api/admin/city', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save city page');
      }

      const savedCity = await res.json();
      setMessage({ type: 'success', text: 'City page saved successfully!' });
      
      await fetchCities();
      setSelectedId(savedCity.id);

    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  // Delete City Page
  const handleDelete = async () => {
    if (selectedId === 'new') return;
    if (!confirm('Are you sure you want to delete this city page?')) return;

    try {
      const res = await fetch(`/api/admin/city?id=${selectedId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      
      setMessage({ type: 'success', text: 'City page deleted.' });
      await fetchCities();
      setSelectedId('new');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  if (loading) return <div className="p-8 text-black">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white text-black rounded-lg shadow-sm mt-10 mb-20">
      <h1 className="text-2xl font-bold mb-6">Manage City Pages</h1>

      {/* Message Banner */}
      {message.text && (
        <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Pages Dropdown */}
      <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select a City Page to Edit</label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="new">-- Create New City Page --</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.title} ({city.slug})
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* ROW 1: Title & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. New York City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. new-york-city"
            />
          </div>
        </div>

        {/* ROW 2: Footer Label & Greeting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Footer Label</label>
            <input
              type="text"
              value={footerLabel}
              onChange={(e) => setFooterLabel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. NYC (Defaults to Title if empty)"
            />
            <p className="text-xs text-gray-500 mt-1">Shorter name displayed in the global footer.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Greeting / Subtitle</label>
            <input
              type="text"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Welcome to the Big Apple!"
            />
            <p className="text-xs text-gray-500 mt-1">Displayed in the hero section below the title.</p>
          </div>
        </div>

        {/* NEW: Secondary Tiptap Editor */}
        <div className="p-4 border border-blue-100 bg-blue-50/30 rounded-md">
          <label className="block text-sm font-bold text-gray-800 mb-2">Secondary Content (Hero Area)</label>
          <p className="text-sm text-gray-600 mb-3">This content will be displayed directly under the Greeting in the top hero section.</p>
          <div className="flex flex-col w-full bg-white">
            <MenuBar editor={secondaryEditor} />
            <EditorContent editor={secondaryEditor} />
          </div>
        </div>

        {/* Image Upload */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 mb-4 cursor-pointer"
          />
          {imagePreview && (
            <div className="relative w-64 h-40 border border-gray-300 rounded-md overflow-hidden shadow-sm">
              <Image 
                src={imagePreview} 
                alt="City Preview" 
                fill 
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Main Tiptap Editor */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-bold text-gray-800 mb-2">Main Body Content</label>
          <p className="text-sm text-gray-600 mb-3">This is the primary content block displayed at the bottom of the page.</p>
          <div className="flex flex-col w-full">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div>
            {selectedId !== 'new' && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 font-medium rounded-md hover:bg-red-100 focus:outline-none transition-colors"
              >
                Delete Page
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none disabled:opacity-50 transition-colors shadow-sm"
          >
            {saving ? 'Saving...' : 'Save City Page'}
          </button>
        </div>
      </form>
    </div>
  );
}