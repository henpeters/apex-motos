import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, CheckCircle, XCircle, Layers, Upload } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory, uploadImage } from '../services/api';
import { Category } from '../types';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [active, setActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('/media/barni1-automobile-679874_1920.jpg');
    setActive(true);
    setModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setImage(cat.image);
    setActive(cat.active);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadImage(file);
      setImage(data.url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, { name, description, image, active });
      } else {
        await createCategory({ name, description, image, active });
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Delete this product category?')) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Could not delete category');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Category <span className="text-brand-red">Management</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Organize auto parts into dynamic store categories.</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="btn-primary px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-redGlow self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="admin-card h-48 rounded-2xl animate-pulse" />
          ))
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className="admin-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-white text-lg">{cat.name}</span>
                  {cat.active ? (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Active</span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">Disabled</span>
                  )}
                </div>
                <div className="w-full h-32 rounded-xl bg-slate-950 overflow-hidden">
                  <img src={cat.image || '/media/barni1-automobile-679874_1920.jpg'} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{cat.description}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-brand-red">
                  {cat.itemCount !== undefined ? `${cat.itemCount} Products` : ''}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-brand-red text-slate-300 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                  >
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
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Category Image</label>
                <div className="flex items-center gap-3">
                  <label className="btn-secondary px-4 py-2 text-xs font-bold uppercase cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4 text-brand-red" />
                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                  </label>
                  {image && <img src={image} alt="Preview" className="w-10 h-10 rounded-lg object-cover bg-slate-950" />}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="accent-brand-red w-4 h-4" />
                  <span>Active Category</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary px-4 py-2 text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-6 py-2 text-xs font-bold uppercase tracking-wider">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
