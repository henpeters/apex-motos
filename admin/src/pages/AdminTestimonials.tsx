import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../services/api';
import { Testimonial } from '../types';

const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerRole, setCustomerRole] = useState('');
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTestimonial(null);
    setCustomerName('');
    setCustomerRole('Verified Driver');
    setRating('5');
    setComment('');
    setActive(true);
    setModalOpen(true);
  };

  const handleOpenEditModal = (t: Testimonial) => {
    setEditingTestimonial(t);
    setCustomerName(t.customerName);
    setCustomerRole(t.customerRole);
    setRating(String(t.rating));
    setComment(t.comment);
    setActive(t.active);
    setModalOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial._id, { customerName, customerRole, rating: Number(rating), comment, active });
      } else {
        await createTestimonial({ customerName, customerRole, rating: Number(rating), comment, active });
      }
      setModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm('Delete customer review?')) {
      try {
        await deleteTestimonial(id);
        fetchTestimonials();
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
            Customer <span className="text-brand-red">Testimonials</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Manage driver reviews and star ratings displayed on homepage.</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="btn-primary px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-redGlow self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="admin-card h-40 rounded-2xl animate-pulse" />
        ) : (
          testimonials.map((t) => (
            <div key={t._id} className="admin-card p-5 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.active ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                    {t.active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 italic">"{t.comment}"</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-white text-sm">{t.customerName}</h4>
                  <span className="text-[11px] text-slate-400 block">{t.customerRole}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenEditModal(t)} className="p-1.5 rounded-lg bg-white/5 hover:bg-brand-red text-slate-300 hover:text-white">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteTestimonial(t._id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600 text-slate-300 hover:text-white">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Customer Role</label>
                  <input
                    type="text"
                    value={customerRole}
                    onChange={(e) => setCustomerRole(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Star Rating (1 - 5)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
                >
                  <option value="5">5 Stars (Excellent)</option>
                  <option value="4">4 Stars (Very Good)</option>
                  <option value="3">3 Stars (Average)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Review Comment *</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="accent-brand-red w-4 h-4" />
                  <span>Active Testimonial</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary px-4 py-2 text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-6 py-2 text-xs font-bold uppercase tracking-wider">
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
