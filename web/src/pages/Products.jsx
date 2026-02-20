import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'];
const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' }
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 8, sort });
      if (search) params.append('search', search);
      if (category !== 'All') params.append('category', category);

      const { data } = await API.get(`/products?${params}`);
      setProducts(data.data);
      setPagination(data.pagination);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Hero Banner */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Discover Amazing Products</h1>
          <p style={styles.heroSub}>Browse our curated collection of premium items</p>

          {/* Search */}
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              type="text"
              placeholder="🔍  Search for anything..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchBtn}>Search</button>
            {search && (
              <button type="button" style={styles.clearBtn}
                onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}>
                ✕ Clear
              </button>
            )}
          </form>
        </div>

        {/* Filters */}
        <div style={styles.filterBar}>
          <div style={styles.categories}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{
                  ...styles.catBtn,
                  ...(category === cat ? styles.catBtnActive : {})
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
            style={styles.sortSelect}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Results info */}
        {!loading && (
          <p style={styles.resultInfo}>
            {search ? `Results for "${search}": ` : ''}
            {pagination.total || 0} products found
          </p>
        )}

        {/* Products Grid */}
        {loading ? (
          <div style={styles.grid}>
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={styles.skeletonCard} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div style={styles.grid}>
            {products.map((product, i) => (
              <div
                key={product._id}
                className="fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <ProductCard product={product} onFavoriteChange={fetchProducts} />
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.empty}>
            <p style={styles.emptyIcon}>🔍</p>
            <p style={styles.emptyText}>No products found</p>
            <p style={styles.emptySub}>Try a different search or category</p>
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={pagination.pages || 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '0 0 3rem' },
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '3rem 1.5rem', textAlign: 'center', marginBottom: '2rem'
  },
  heroTitle: { fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: '800', color: '#fff', marginBottom: '0.5rem' },
  heroSub: { color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' },
  searchForm: { display: 'flex', gap: '0.75rem', maxWidth: '600px', margin: '0 auto' },
  searchInput: {
    flex: 1, padding: '0.875rem 1.25rem', borderRadius: '12px',
    border: 'none', fontSize: '0.95rem', outline: 'none',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: 'inherit'
  },
  searchBtn: {
    padding: '0.875rem 1.5rem', background: '#f59e0b', color: '#fff',
    border: 'none', borderRadius: '12px', fontWeight: '600',
    cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap'
  },
  clearBtn: {
    padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.2)', color: '#fff',
    border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '500'
  },
  filterBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap'
  },
  categories: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  catBtn: {
    padding: '0.4rem 0.9rem', borderRadius: '20px',
    border: '1.5px solid #e2e8f0', background: '#fff',
    cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500',
    color: '#475569', transition: 'all 0.2s'
  },
  catBtnActive: { background: '#6366f1', color: '#fff', border: '1.5px solid #6366f1' },
  sortSelect: {
    padding: '0.5rem 1rem', borderRadius: '10px', border: '1.5px solid #e2e8f0',
    background: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit'
  },
  resultInfo: { color: '#64748b', marginBottom: '1rem', fontSize: '0.875rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  skeletonCard: { height: '340px', borderRadius: '16px' },
  empty: { textAlign: 'center', padding: '4rem 0' },
  emptyIcon: { fontSize: '4rem', marginBottom: '1rem' },
  emptyText: { fontSize: '1.25rem', fontWeight: '600', color: '#475569' },
  emptySub: { color: '#94a3b8', marginTop: '0.25rem' }
};

export default Products;