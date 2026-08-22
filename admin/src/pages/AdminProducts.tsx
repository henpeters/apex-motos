import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  Upload,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, uploadImage } from '../services/api';
import { Product, Category, Specification, VehicleCompatibility } from '../types';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saveError, setSaveError] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [bestseller, setBestseller] = useState(false);

  // Spec & Compatibility Builders
  const [specs, setSpecs] = useState<Specification[]>([]);
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const [compatibility, setCompatibility] = useState<VehicleCompatibility[]>([]);
  const [compMake, setCompMake] = useState('BMW');
  const [compModel, setCompModel] = useState('M3 (F80)');
  const [compYearStart, setCompYearStart] = useState('2015');
  const [compYearEnd, setCompYearEnd] = useState('2020');

  useEffect(() => {
    fetchData();
  }, [search, selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        getProducts({ search, category: selectedCategory }),
        getCategories(),
      ]);
      setProducts(prodRes.products);
      setCategories(catRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSku(`SKU-${Date.now().toString().slice(-5)}`);
    setBrand('Brembo');
    setCategory(categories[0]?._id || '');
    setPrice('199.99');
    setDiscountPrice('');
    setStock('25');
    setDescription('');
    setImages(['/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg']);
    setActive(true);
    setFeatured(false);
    setBestseller(false);
    setSpecs([]);
    setCompatibility([]);
    setModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSku(prod.sku);
    setBrand(prod.brand);
    setCategory(typeof prod.category === 'object' ? prod.category._id : prod.category);
    setPrice(String(prod.price));
    setDiscountPrice(prod.discountPrice ? String(prod.discountPrice) : '');
    setStock(String(prod.stock));
    setDescription(prod.description);
    setImages(prod.images || []);
    setActive(prod.active);
    setFeatured(prod.featured);
    setBestseller(prod.bestseller);
    setSpecs(prod.specifications || []);
    setCompatibility(prod.compatibility || []);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setUploadError('');
    try {
      const data = await uploadImage(file);
      setImages((prev) => [...prev, data.url]);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Image upload failed';
      setUploadError(msg);
      console.error('Upload error:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddSpec = () => {
    if (specKey && specValue) {
      setSpecs((prev) => [...prev, { key: specKey, value: specValue }]);
      setSpecKey('');
      setSpecValue('');
    }
  };

  const handleAddCompatibility = () => {
    if (compMake && compModel) {
      setCompatibility((prev) => [
        ...prev,
        {
          make: compMake,
          model: compModel,
          yearStart: Number(compYearStart),
          yearEnd: Number(compYearEnd),
        },
      ]);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const productPayload = {
      name,
      sku,
      brand,
      category,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      stock: Number(stock),
      description,
      images,
      active,
      featured,
      bestseller,
      specifications: specs,
      compatibility,
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, productPayload);
      } else {
        await createProduct(productPayload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save product. Please check all required fields.';
      setSaveError(msg);
      console.error('Error saving product:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this auto part?')) {
      try {
        await deleteProduct(id);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Product <span className="text-brand-red">Management</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Manage catalog items, inventory, specifications, and fitment tables.</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="btn-primary px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-redGlow self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="admin-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product name, SKU, brand..."
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-red"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-red w-full sm:w-auto"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="admin-card rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 uppercase text-[11px] font-bold text-slate-400 border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">SKU / Brand</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading catalog items...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images?.[0] || '/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg'}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-contain bg-slate-950 p-1"
                        />
                        <span className="font-bold text-white max-w-xs truncate block">{prod.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-brand-red block">{prod.brand}</span>
                      <span className="text-slate-500 font-mono">{prod.sku}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      ${prod.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-mono font-bold ${prod.stock <= 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {prod.stock} Units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {prod.active ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                          <XCircle className="w-3 h-3" /> Hidden
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-brand-red text-slate-300 hover:text-white transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center">
          <div className="w-full max-w-4xl bg-[#0F141F] border border-white/15 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
              <h3 className="font-heading font-bold text-xl text-white">
                {editingProduct ? 'Edit Auto Part Item' : 'Create New Auto Part'}
              </h3>
              <button onClick={() => { setModalOpen(false); setSaveError(''); setUploadError(''); }} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Save Error Banner */}
              {saveError && (
                <div className="bg-rose-500/10 border border-rose-500/40 rounded-xl px-4 py-3 text-xs text-rose-400 font-semibold">
                  ❌ {saveError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red font-mono"
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
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-300">Product Images</label>
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="btn-secondary px-4 py-2 text-xs font-bold uppercase cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4 text-brand-red" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                    <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" disabled={uploadingImage} />
                  </label>
                  {/* URL fallback input */}
                  <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                    <input
                      type="url"
                      placeholder="Or paste image URL..."
                      className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-red"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val) { setImages((prev) => [...prev, val]); (e.target as HTMLInputElement).value = ''; }
                        }
                      }}
                    />
                    <span className="text-[10px] text-slate-500">Press Enter to add</span>
                  </div>
                </div>
                {uploadError && (
                  <p className="text-xs text-rose-400 font-semibold">⚠️ {uploadError}</p>
                )}
                <div className="flex items-center gap-3 pt-2">
                  {images.map((img, i) => (
                    <div key={i} className="w-16 h-16 rounded-xl bg-slate-950 p-1 border border-white/10 relative">
                      <img src={img} alt="Uploaded" className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs Builder */}
              <div className="space-y-2 border-t border-white/10 pt-4">
                <label className="block text-xs font-bold uppercase text-slate-300">Technical Specs Builder</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Key (e.g. Rotor Diameter)"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white flex-1"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 380mm)"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white flex-1"
                  />
                  <button type="button" onClick={handleAddSpec} className="btn-secondary px-4 py-2 text-xs font-bold">
                    Add Spec
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {specs.map((s, i) => (
                    <span key={i} className="bg-slate-900 border border-white/10 text-xs px-2.5 py-1 rounded-lg text-slate-300">
                      {s.key}: <strong className="text-white">{s.value}</strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Fitment Builder */}
              <div className="space-y-2 border-t border-white/10 pt-4">
                <label className="block text-xs font-bold uppercase text-slate-300">Vehicle Fitment Manager</label>
                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Make (BMW)"
                    value={compMake}
                    onChange={(e) => setCompMake(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Model (M3)"
                    value={compModel}
                    onChange={(e) => setCompModel(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="number"
                    placeholder="Start Year"
                    value={compYearStart}
                    onChange={(e) => setCompYearStart(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="number"
                    placeholder="End Year"
                    value={compYearEnd}
                    onChange={(e) => setCompYearEnd(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <button type="button" onClick={handleAddCompatibility} className="btn-secondary px-4 py-2 text-xs font-bold mt-2">
                  Add Vehicle Fitment Rule
                </button>
                <div className="space-y-1 pt-2">
                  {compatibility.map((c, i) => (
                    <div key={i} className="text-xs bg-slate-900/60 p-2 rounded-lg text-slate-300 flex justify-between">
                      <span>{c.make} {c.model} ({c.yearStart} - {c.yearEnd})</span>
                      <button type="button" onClick={() => setCompatibility(compatibility.filter((_, idx) => idx !== i))} className="text-rose-400">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-6 border-t border-white/10 pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="accent-brand-red w-4 h-4" />
                  <span>Publish Item to Public Store</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-brand-red w-4 h-4" />
                  <span>Featured Product</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary px-5 py-2.5 text-xs uppercase font-bold">
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider shadow-redGlow">
                  Save Auto Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
