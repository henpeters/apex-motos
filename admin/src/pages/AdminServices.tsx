import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Wrench, Upload } from 'lucide-react';
import { getServices, createService, updateService, deleteService, uploadImage } from '../services/api';
import { Service } from '../types';

const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingService(null);
    setName('');
    setDescription('');
    setImage('/media/life-of-pix-cylinders-569151_1920.jpg');
    setPrice('149.00');
    setDuration('1 - 2 Hours');
    setActive(true);
    setFeatured(false);
    setModalOpen(true);
  };

  const handleOpenEditModal = (serv: Service) => {
    setEditingService(serv);
    setName(serv.name);
    setDescription(serv.description);
    setImage(serv.image);
    setPrice(String(serv.price));
    setDuration(serv.duration);
    setActive(serv.active);
    setFeatured(serv.featured);
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

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await updateService(editingService._id, { name, description, image, price: Number(price), duration, active, featured });
      } else {
        await createService({ name, description, image, price: Number(price), duration, active, featured });
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm('Delete this garage service?')) {
      try {
        await deleteService(id);
        fetchServices();
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
            Garage Services <span className="text-brand-red">Management</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Manage workshop diagnostic services, pricing, and duration.</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="btn-primary px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-redGlow self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Garage Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="admin-card h-52 rounded-2xl animate-pulse" />
          ))
        ) : (
          services.map((serv) => (
            <div key={serv._id} className="admin-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-white text-lg">{serv.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${serv.active ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                    {serv.active ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div className="w-full h-32 rounded-xl bg-slate-950 overflow-hidden">
                  <img src={serv.image || '/media/life-of-pix-cylinders-569151_1920.jpg'} alt={serv.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{serv.description}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-heading font-black text-white text-lg font-mono">${serv.price.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-500 block">{serv.duration}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenEditModal(serv)} className="p-1.5 rounded-lg bg-white/5 hover:bg-brand-red text-slate-300 hover:text-white">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteService(serv._id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600 text-slate-300 hover:text-white">
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
                {editingService ? 'Edit Garage Service' : 'Add Garage Service'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="1 - 2 Hours"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Service Thumbnail</label>
                <div className="flex items-center gap-3">
                  <label className="btn-secondary px-4 py-2 text-xs font-bold uppercase cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4 text-brand-red" />
                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                  </label>
                  {image && <img src={image} alt="Preview" className="w-10 h-10 rounded-lg object-cover bg-slate-950" />}
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="accent-brand-red w-4 h-4" />
                  <span>Active Service</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-brand-red w-4 h-4" />
                  <span>Featured Service</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary px-4 py-2 text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-6 py-2 text-xs font-bold uppercase tracking-wider">
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
