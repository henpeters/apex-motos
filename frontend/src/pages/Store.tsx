import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ShieldCheck, X, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FitmentBar from '../components/FitmentBar';
import SEO from '../components/SEO';
import { getProducts, getCategories } from '../services/api';
import { Product, Category } from '../types';
import { useFitment } from '../context/FitmentContext';

const BRANDS = ['Brembo', 'Akebono', 'EBC Brakes', 'Mahle', 'Gates', 'ARP', 'KW Suspensions', 'Exedy', 'NGK', 'Morimoto', 'Garrett', 'Mishimoto', 'K&N', 'Motul', 'Autel', 'BBS Wheels', 'Michelin'];

const Store: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { fitment, isVehicleSelected, clearFitment } = useFitment();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterMobileOpen, setFilterMobileOpen] = useState(false);

  // Filters State
  const searchArg = searchParams.get('search') || '';
  const categoryArg = searchParams.get('category') || '';
  const brandArg = searchParams.get('brand') || '';
  const minPriceArg = searchParams.get('minPrice') || '';
  const maxPriceArg = searchParams.get('maxPrice') || '';
  const sortArg = searchParams.get('sort') || 'newest';
  const pageArg = parseInt(searchParams.get('page') || '1', 10);
  const inStockArg = searchParams.get('inStock') === 'true';

  const [search, setSearch] = useState(searchArg);
  const [selectedCategory, setSelectedCategory] = useState(categoryArg);
  const [selectedBrand, setSelectedBrand] = useState(brandArg);
  const [minPrice, setMinPrice] = useState(minPriceArg);
  const [maxPrice, setMaxPrice] = useState(maxPriceArg);
  const [sort, setSort] = useState(sortArg);
  const [inStockOnly, setInStockOnly] = useState(inStockArg);
  const [page, setPage] = useState(pageArg);

  // Synchronize URL parameters with component state
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedBrand(searchParams.get('brand') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSort(searchParams.get('sort') || 'newest');
    setPage(parseInt(searchParams.get('page') || '1', 10));
    setInStockOnly(searchParams.get('inStock') === 'true');
  }, [searchParams]);

  // Load Categories on mount
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => console.error(err));
  }, []);

  // Fetch Products based on current active filters
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const queryParams: Record<string, any> = {
          page,
          limit: 12,
          sort,
        };

        if (search) queryParams.search = search;
        if (selectedCategory) queryParams.category = selectedCategory;
        if (selectedBrand) queryParams.brand = selectedBrand;
        if (minPrice) queryParams.minPrice = minPrice;
        if (maxPrice) queryParams.maxPrice = maxPrice;
        if (inStockOnly) queryParams.inStock = 'true';

        // Add Fitment filter if active
        if (isVehicleSelected) {
          queryParams.make = fitment.make;
          queryParams.model = fitment.model;
          queryParams.year = fitment.year;
        }

        const data = await getProducts(queryParams);
        setProducts(data.products);
        setTotal(data.total);
        setTotalPages(data.pages || 1);
      } catch (err) {
        console.error('Error fetching store products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [search, selectedCategory, selectedBrand, minPrice, maxPrice, sort, inStockOnly, page, isVehicleSelected, fitment]);

  // Apply filters to URL
  const updateUrl = (newParams: Record<string, string>) => {
    const current = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v) current.set(k, v);
      else current.delete(k);
    });
    setSearchParams(current);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ search, page: '1' });
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setInStockOnly(false);
    setPage(1);
    clearFitment();
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 pt-24 pb-20">
      <SEO
        title="Auto Parts Store — Apex Motors"
        description="Browse high-performance brake kits, coilovers, ECU tuners, OEM filters, spark plugs, and performance fluids. Filter by exact vehicle year, make, and model."
      />
      {/* Fitment Selector Bar */}
      <FitmentBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="text-xs text-slate-400 mb-2">
            <span>Home</span> / <span className="text-brand-red font-semibold">Auto Parts Store</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-heading font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
                Auto Parts <span className="text-gradient-red">Store</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Showing {total} precision engineered performance parts & OEM replacements
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setFilterMobileOpen(true)}
              className="lg:hidden btn-secondary px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
            >
              <Filter className="w-4 h-4 text-brand-red" />
              <span>Filters & Categories</span>
            </button>
          </div>
        </div>

        {/* Fitment Notification Badge if active */}
        {isVehicleSelected && (
          <div className="bg-brand-red/10 border border-brand-red/30 p-4 rounded-2xl mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-brand-red shrink-0" />
              <div>
                <h4 className="font-heading font-bold text-white text-sm">
                  Filtering Parts for {fitment.year} {fitment.make} {fitment.model}
                </h4>
                <p className="text-xs text-slate-400">Showing only parts verified to fit your specific vehicle</p>
              </div>
            </div>
            <button
              onClick={clearFitment}
              className="text-xs text-slate-400 hover:text-white underline font-semibold"
            >
              Show All Vehicle Parts
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR FILTERS (Desktop & Mobile Drawer) */}
          <aside
            className={`lg:block ${
              filterMobileOpen
                ? 'fixed inset-0 z-50 bg-[#0F141F] p-6 overflow-y-auto block'
                : 'hidden'
            }`}
          >
            <div className="space-y-6">
              {/* Sidebar Header for Mobile */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 lg:hidden">
                <h3 className="font-heading font-bold text-lg text-white">Filter Parts</h3>
                <button
                  onClick={() => setFilterMobileOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar in Sidebar */}
              <div className="glass-panel p-4 rounded-2xl space-y-3">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300">
                  Search Keywords
                </h4>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, SKU, brand..."
                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-red"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </form>
              </div>

              {/* Category Filter */}
              <div className="glass-panel p-4 rounded-2xl space-y-3">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300">
                  Categories
                </h4>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      updateUrl({ category: '', page: '1' });
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                      !selectedCategory ? 'bg-brand-red text-white' : 'text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <span>All Categories</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        updateUrl({ category: cat.slug, page: '1' });
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                        selectedCategory === cat.slug || selectedCategory === cat._id
                          ? 'bg-brand-red text-white'
                          : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {cat.itemCount !== undefined && (
                        <span className="text-[10px] opacity-70 font-mono">{cat.itemCount}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="glass-panel p-4 rounded-2xl space-y-3">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300">
                  Manufacturer / Brand
                </h4>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    updateUrl({ brand: e.target.value, page: '1' });
                  }}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-red"
                >
                  <option value="">All Brands</option>
                  {BRANDS.map((b) => (
                    <option key={b} value={b} className="bg-slate-900">
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="glass-panel p-4 rounded-2xl space-y-3">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300">
                  Price Range ($)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min $"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-red"
                  />
                  <input
                    type="number"
                    placeholder="Max $"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-red"
                  />
                </div>
                <button
                  onClick={() => updateUrl({ minPrice, maxPrice, page: '1' })}
                  className="btn-secondary w-full py-2 text-xs font-bold uppercase tracking-wider"
                >
                  Apply Price Filter
                </button>
              </div>

              {/* Availability Filter */}
              <div className="glass-panel p-4 rounded-2xl space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      updateUrl({ inStock: e.target.checked ? 'true' : '', page: '1' });
                    }}
                    className="w-4 h-4 accent-brand-red rounded"
                  />
                  <span className="text-xs font-semibold text-slate-300">In-Stock Only</span>
                </label>
              </div>

              {/* Reset Filters Button */}
              <button
                onClick={handleResetFilters}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-2 border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          </aside>

          {/* MAIN PRODUCT CATALOG CONTENT */}
          <main className="lg:col-span-3 space-y-6">
            {/* Sorting & Grid Bar */}
            <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                Found <span className="font-bold text-white font-mono">{total}</span> parts matching your criteria
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-brand-red" /> Sort By:
                </span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    updateUrl({ sort: e.target.value, page: '1' });
                  }}
                  className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-red flex-1 sm:flex-none cursor-pointer"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="glass-panel h-80 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="glass-panel p-12 text-center rounded-3xl border border-white/10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-xl text-white">No Auto Parts Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  We couldn't find any products matching your specific filter parameters. Try broadening your search or resetting filters.
                </p>
                <button onClick={handleResetFilters} className="btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider">
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <button
                  disabled={page <= 1}
                  onClick={() => updateUrl({ page: String(page - 1) })}
                  className="btn-secondary px-4 py-2 text-xs font-bold uppercase disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => updateUrl({ page: String(pNum) })}
                      className={`w-9 h-9 rounded-xl text-xs font-bold font-mono transition-all ${
                        page === pNum
                          ? 'bg-brand-red text-white shadow-redGlow'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  disabled={page >= totalPages}
                  onClick={() => updateUrl({ page: String(page + 1) })}
                  className="btn-secondary px-4 py-2 text-xs font-bold uppercase disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Store;
