'use client';

import React, { useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Job {
  job_id: number;
  slug: string;
  designation: string;
  department: string;
  experience_min: number;
  experience_max: number;
  experience_label: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'temporary';
  location: string;
  content: string; // Stored as JSONB/HTML string
  status: 'draft' | 'active' | 'closed' | 'archived';
  open_date: string | null;
  closing_date: string | null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form State
  const [editingJob, setEditingJob] = useState<Partial<Job> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // ─── Fetch Data ─────────────────────────────────────────────────────────────

  const fetchJobs = async (targetPage = 1) => {
    setLoading(true);
    try {
      // Pass the x-admin-role header to bypass user restrictions
      const res = await fetch(`/api/jobs?page=${targetPage}&limit=10`, {
        headers: { 'x-admin-role': 'true' }
      });
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      
      setJobs(data.data);
      setPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  // ─── Form Handlers ──────────────────────────────────────────────────────────

  const handleAddNew = () => {
    setIsCreating(true);
    setEditingJob({
      slug: '', designation: '', department: '', location: '',
      experience_min: 0, experience_max: 0, experience_label: '',
      employment_type: 'full_time', status: 'draft', content: '',
      open_date: '', closing_date: ''
    });
  };

  const handleEdit = (job: Job) => {
    setIsCreating(false);
    
    // Extract the HTML string safely from the JSONB object
    // (We check typeof just in case it's still returning a string from a previous test)
    const htmlContent = typeof job.content === 'object' && job.content !== null 
      ? (job.content as any).html 
      : job.content;

    setEditingJob({
      ...job,
      content: htmlContent || '',
      open_date: job.open_date ? new Date(job.open_date).toISOString().split('T')[0] : '',
      closing_date: job.closing_date ? new Date(job.closing_date).toISOString().split('T')[0] : '',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    setSaving(true);
    try {
      const method = isCreating ? 'POST' : 'PATCH';
      const payload = {
        ...editingJob,
        // Ensure slug is clean
        slug: editingJob.slug?.toLowerCase().replace(/\s+/g, '-'),
      };

      const res = await fetch('/api/jobs', {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-role': 'true' // Admin auth header
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save job');
      }

      // Refresh list and close form
      await fetchJobs(page);
      setEditingJob(null);
      setIsCreating(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      
      {/* Header */}
      <div className="border-b border-gray-800 px-6 md:px-10 py-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-0.5">Admin</p>
          <h1 className="text-xl font-bold text-white">Jobs Manager</h1>
        </div>
        {!editingJob && (
          <button
            onClick={handleAddNew}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors"
          >
            + Create New Job
          </button>
        )}
      </div>

      <div className="px-6 md:px-10 py-8 max-w-6xl mx-auto">
        
        {/* ─── Error & Loading States ─── */}
        {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6">{error}</div>}
        
        {/* ─── List View ─── */}
        {!editingJob ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No jobs found. Create one to get started.</div>
            ) : (
              <>
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Designation</th>
                      <th className="px-6 py-4 font-semibold">Department</th>
                      <th className="px-6 py-4 font-semibold">Type</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {jobs.map(job => (
                      <tr key={job.job_id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{job.designation}</td>
                        <td className="px-6 py-4 text-gray-400">{job.department || '—'}</td>
                        <td className="px-6 py-4 text-gray-400 capitalize">{job.employment_type.replace('_', ' ')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                            job.status === 'active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            job.status === 'draft' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            'bg-gray-800 text-gray-400 border border-gray-700'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleEdit(job)}
                            className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Pagination Controls */}
                <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between bg-gray-900">
                  <button 
                    disabled={page === 1} 
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 text-sm text-gray-400 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                  <button 
                    disabled={page === totalPages} 
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 text-sm text-gray-400 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          
          /* ─── Form View ─── */
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {isCreating ? 'Create New Job Post' : `Editing: ${editingJob.designation}`}
              </h2>
              <button 
                onClick={() => setEditingJob(null)}
                className="text-sm text-gray-400 hover:text-white"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-[0.12em] uppercase text-gray-500 mb-2">Designation</label>
                  <input
                    required
                    type="text"
                    value={editingJob.designation}
                    onChange={e => setEditingJob({ ...editingJob, designation: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.12em] uppercase text-gray-500 mb-2">URL Slug</label>
                  <input
                    required
                    type="text"
                    value={editingJob.slug}
                    onChange={e => setEditingJob({ ...editingJob, slug: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="e.g. senior-frontend-engineer"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-[0.12em] uppercase text-gray-500 mb-2">Department</label>
                  <input
                    type="text"
                    value={editingJob.department}
                    onChange={e => setEditingJob({ ...editingJob, department: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="e.g. Engineering"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.12em] uppercase text-gray-500 mb-2">Location</label>
                  <input
                    type="text"
                    value={editingJob.location}
                    onChange={e => setEditingJob({ ...editingJob, location: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="e.g. Remote, Sydney"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.12em] uppercase text-gray-500 mb-2">Status</label>
                  <select
                    value={editingJob.status}
                    onChange={e => setEditingJob({ ...editingJob, status: e.target.value as any })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="draft">Draft (Hidden)</option>
                    <option value="active">Active (Published)</option>
                    <option value="closed">Closed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Experience & Type */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-5 border border-gray-800 rounded-xl bg-gray-900/50">
                <div>
                  <label className="block text-xs font-bold tracking-[0.12em] uppercase text-gray-500 mb-2">Min Years</label>
                  <input
                    type="number"
                    min="0"
                    value={editingJob.experience_min}
                    onChange={e => setEditingJob({ ...editingJob, experience_min: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.12em] uppercase text-gray-500 mb-2">Max Years</label>
                  <input
                    type="number"
                    min="0"
                    value={editingJob.experience_max}
                    onChange={e => setEditingJob({ ...editingJob, experience_max: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.12em] uppercase text-gray-500 mb-2">Exp Label</label>
                  <input
                    type="text"
                    value={editingJob.experience_label}
                    onChange={e => setEditingJob({ ...editingJob, experience_label: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="e.g. Mid-Level"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.12em] uppercase text-gray-500 mb-2">Type</label>
                  <select
                    value={editingJob.employment_type}
                    onChange={e => setEditingJob({ ...editingJob, employment_type: e.target.value as any })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="temporary">Temporary</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-[0.12em] uppercase text-gray-500 mb-2">Open Date</label>
                  <input
                    type="date"
                    value={editingJob.open_date || ''}
                    onChange={e => setEditingJob({ ...editingJob, open_date: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.12em] uppercase text-gray-500 mb-2">Closing Date</label>
                  <input
                    type="date"
                    value={editingJob.closing_date || ''}
                    onChange={e => setEditingJob({ ...editingJob, closing_date: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              {/* Content / TipTap Area */}
              <div>
                <label className="block text-xs font-bold tracking-[0.12em] uppercase text-gray-500 mb-2">Job Description (Content)</label>
                {/* Note: You can replace this <textarea> with your <EditorContent editor={editor} /> component here just like in your Legal Pages! */}
                <textarea
                  required
                  rows={8}
                  value={editingJob.content}
                  onChange={e => setEditingJob({ ...editingJob, content: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                  placeholder="<h2>About the role...</h2><p>We are looking for...</p>"
                />
              </div>

              <div className="pt-6 border-t border-gray-800 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-gray-400 text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                  {saving ? 'Saving...' : '💾 Save Job Post'}
                </button>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}