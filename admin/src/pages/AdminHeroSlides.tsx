import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Video, Upload } from 'lucide-react';
import { getHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide, uploadImage } from '../services/api';
import { HeroSlide } from '../types';

const AdminHeroSlides: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [video, setVideo] = useState('');
  const [buttonText, setButtonText] = useState('Shop Parts');
  const [buttonLink, setButtonLink] = useState('/store');
  const [active, setActive] = useState(true);
  const [order, setOrder] = useState('1');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const data = await getHeroSlides();
      setSlides(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingSlide(null);
    setTitle('PREMIUM AUTO PARTS. BUILT FOR THE ROAD.');
    setSubtitle('Uncompromising engineering and precision components.');
    setImage('/media/barni1-automobile-679874_1920.jpg');
    setVideo('/media/141581-777930475_medium.mp4');
    setButtonText('Shop Parts');
    setButtonLink('/store');
    setActive(true);
    setOrder(String(slides.length + 1));
    setModalOpen(true);
  };

  const handleOpenEditModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setTitle(slide.title);
    setSubtitle(slide.subtitle);
    setImage(slide.image);
    setVideo(slide.video || '');
    setButtonText(slide.buttonText);
    setButtonLink(slide.buttonLink);
    setActive(slide.active);
    setOrder(String(slide.order));
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadImage(file);
      if (file.type.includes('video')) {
        setVideo(data.url);
      } else {
        setImage(data.url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSlide) {
        await updateHeroSlide(editingSlide._id, { title, subtitle, image, video, buttonText, buttonLink, active, order: Number(order) });
      } else {
        await createHeroSlide({ title, subtitle, image, video, buttonText, buttonLink, active, order: Number(order) });
      }
      setModalOpen(false);
      fetchSlides();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (window.confirm('Delete this hero slideshow item?')) {
      try {
        await deleteHeroSlide(id);
        fetchSlides();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Hero Slideshow <span className="text-brand-red">Management</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Control homepage hero slides, background videos, and call-to-action buttons.</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="btn-primary px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-redGlow self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero Slide</span>
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="admin-card h-40 rounded-2xl animate-pulse" />
        ) : (
          slides.map((s) => (
            <div key={s._id} className="admin-card p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-24 h-16 rounded-xl bg-slate-950 overflow-hidden relative shrink-0">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                  {s.video && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-brand-red">
                      <Video className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-brand-red font-mono block">Slide #{s.order}</span>
                  <h4 className="font-heading font-bold text-white text-base max-w-md truncate">{s.title}</h4>
                  <p className="text-xs text-slate-400 max-w-md truncate">{s.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.active ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                  {s.active ? 'Active' : 'Hidden'}
                </span>

                <button onClick={() => handleOpenEditModal(s)} className="p-2 rounded-lg bg-white/5 hover:bg-brand-red text-slate-300 hover:text-white">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteSlide(s._id)} className="p-2 rounded-lg bg-white/5 hover:bg-rose-600 text-slate-300 hover:text-white">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center">
          <div className="w-full max-w-lg bg-[#0F141F] border border-white/15 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-lg text-white">
                {editingSlide ? 'Edit Hero Slide' : 'Add Hero Slide'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Subtitle *</label>
                <textarea
                  rows={2}
                  required
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Button Link</label>
                  <input
                    type="text"
                    value={buttonLink}
                    onChange={(e) => setButtonLink(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Background Image/Video URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                />
                <div className="pt-2">
                  <label className="btn-secondary px-4 py-2 text-xs font-bold uppercase cursor-pointer flex items-center gap-2 inline-flex">
                    <Upload className="w-4 h-4 text-brand-red" />
                    <span>{uploading ? 'Uploading Media...' : 'Upload Media File'}</span>
                    <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*,video/mp4" />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="accent-brand-red w-4 h-4" />
                  <span>Active Slide</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary px-4 py-2 text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-6 py-2 text-xs font-bold uppercase tracking-wider">
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHeroSlides;
