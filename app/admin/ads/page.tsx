'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ExternalLink, Megaphone, Loader2, Edit2, Upload, X } from 'lucide-react';

interface Ad {
  $id: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
  display_order: number;
}

export default function ManageAds() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editAd, setEditAd] = useState<Ad | null>(null);
  const [formData, setFormData] = useState({ image_url: '', link_url: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    const res = await fetch('/api/admin/banners');
    const data = await res.json();
    if (Array.isArray(data)) setAds(data);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, image_url: data.url });
      }
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const method = editAd ? 'PATCH' : 'POST';
    const payload = editAd 
      ? { id: editAd.$id, ...formData }
      : formData;

    const res = await fetch('/api/admin/banners', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setFormData({ image_url: '', link_url: '' });
      setEditAd(null);
      fetchAds();
    }
    setSaving(false);
  };

  const handleEdit = (ad: Ad) => {
    setEditAd(ad);
    setFormData({ image_url: ad.image_url, link_url: ad.link_url });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;
    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAds();
      } else {
        const data = await res.json();
        alert(`Failed to delete ad: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`Network error deleting ad: ${err.message || err}`);
    }
  };

  const cancelEdit = () => {
    setEditAd(null);
    setFormData({ image_url: '', link_url: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-black">Manage Ads</h1>
          <p className="text-gray-500">Configure the images and links for your homepage banner.</p>
        </div>
      </div>

      {/* Form Section (Add or Edit) */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2 text-black">
            {editAd ? <Edit2 className="w-5 h-5 text-indigo-500" /> : <Plus className="w-5 h-5 text-blue-500" />}
            {editAd ? 'Edit Ad Slide' : 'Add New Ad Slide'}
          </h2>
          {editAd && (
            <button onClick={cancelEdit} className="text-gray-400 hover:text-black transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Image Source</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Image URL (e.g. https://...)"
                  required
                  className="flex-grow px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all text-black"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                  <span className="hidden md:inline text-xs font-bold">Upload</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Destination Link</label>
              <input
                type="url"
                placeholder="Link URL (e.g. https://...)"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all text-black"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={saving || uploading}
            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
              editAd ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-black hover:bg-gray-800'
            } text-white`}
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : editAd ? 'Save Changes' : 'Publish Slide'}
          </button>
        </form>
      </div>

      {/* Ads List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            Loading your ads...
          </div>
        ) : ads.length === 0 ? (
          <div className="col-span-full bg-white border-2 border-dashed border-gray-100 rounded-3xl py-16 text-center text-gray-400">
            No ads configured yet. Start by adding one above.
          </div>
        ) : (
          ads.map((ad) => (
            <div key={ad.$id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
              <div className="h-44 bg-gray-100 relative overflow-hidden">
                <img src={ad.image_url} alt="Ad Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <a href={ad.link_url} target="_blank" className="text-white bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/40 transition-all">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button onClick={() => handleEdit(ad)} className="text-white bg-indigo-500/80 backdrop-blur-md p-3 rounded-full hover:bg-indigo-600 transition-all">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(ad.$id)} className="text-white bg-red-500/80 backdrop-blur-md p-3 rounded-full hover:bg-red-600 transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="text-xs font-medium text-gray-400 truncate">
                  {ad.link_url}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

