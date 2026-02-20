import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(false);
  const [heartPop, setHeartPop] = useState(false);
  const { user, updateFavorites } = useAuth();
  const navigate = useNavigate();

  const isFavorite = user?.favorites?.includes(id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.data);
      } catch {
        toast.error('Product not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleFavorite = async () => {
    if (!user) return toast.error('Please login first');
    setFavLoading(true);
    setHeartPop(true);
    setTimeout(() => setHeartPop(false), 500);
    try {
      if (isFavorite) {
        const { data } = await API.delete(`/favorites/${id}`);
        updateFavorites(data.data);
        toast.success('Removed from favorites');
      } else {
        const { data } = await API.post(`/favorites/${id}`);
        updateFavorites(data.data);
        toast.success('Added to favorites ❤️');
      }
    } catch (err) {
      toast.error('Error updating favorites');
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner}>⏳ Loading product...</div>
      </div>
    );
  }

  if (!product) return null;

  const stars = Array.from({ length: 5 }, (_, i) =>
    i < Math.round(product.rating) ? '★' : '☆'
  ).join('');

  return (
    <div style={styles.page}>
      <div className="container">
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>

        <div style={styles.card} className="fade-in-up">
          {/* Left: Image */}
          <div style={styles.imageSection}>
            <img
              src={product.image || 'https://via.placeholder.com/500x400?text=No+Image'}
              alt={product.title}
              style={styles.image}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/500x400?text=No+Image'; }}
            />
            <div style={styles.imageBadges}>
              <span style={styles.categoryBadge}>{product.category}</span>
              {product.stock === 0 && <span style={styles.outBadge}>Out of Stock</span>}
            </div>
          </div>

          {/* Right: Details */}
          <div style={styles.detailSection}>
            <h1 style={styles.title}>{product.title}</h1>

            <div style={styles.ratingRow}>
              <span style={styles.stars}>{stars}</span>
              <span style={styles.ratingNum}>{product.rating} / 5</span>
            </div>

            <div style={styles.priceRow}>
              <span style={styles.price}>${product.price.toFixed(2)}</span>
              <span style={styles.stock}>
                {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of stock'}
              </span>
            </div>

            <div style={styles.sellerRow}>
              <span style={styles.sellerLabel}>Seller:</span>
              <span style={styles.seller}>{product.seller}</span>
            </div>

            <p style={styles.description}>{product.description}</p>

            <div style={styles.actions}>
              <button
                style={{
                  ...styles.addToCartBtn,
                  ...(product.stock === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {})
                }}
                disabled={product.stock === 0}
                onClick={() => toast.success('🛒 Added to cart!')}
              >
                🛒 Add to Cart
              </button>

              <button
                onClick={handleFavorite}
                disabled={favLoading}
                style={{
                  ...styles.favBtn,
                  background: isFavorite ? '#fef2f2' : '#f8fafc',
                  border: `1.5px solid ${isFavorite ? '#fca5a5' : '#e2e8f0'}`,
                  transform: heartPop ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                {isFavorite ? '❤️ Saved' : '🤍 Save'}
              </button>
            </div>

            <div style={styles.metaBox}>
              <p style={styles.metaItem}>
                📅 Listed: {new Date(product.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '2rem 0' },
  loadingPage: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' },
  spinner: { fontSize: '1.2rem', color: '#64748b' },
  backBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#6366f1', fontWeight: '600', fontSize: '0.9rem',
    marginBottom: '1.5rem', display: 'block', padding: '0'
  },
  card: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem',
    background: '#fff', borderRadius: '20px',
    boxShadow: '0 4px 30px rgba(0,0,0,0.1)', overflow: 'hidden',
    '@media (max-width: 768px)': { gridTemplateColumns: '1fr' }
  },
  imageSection: { position: 'relative', background: '#f8fafc', minHeight: '400px' },
  image: { width: '100%', height: '100%', objectFit: 'cover', minHeight: '400px' },
  imageBadges: { position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem' },
  categoryBadge: {
    background: 'rgba(99,102,241,0.9)', color: '#fff',
    padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600'
  },
  outBadge: {
    background: 'rgba(239,68,68,0.9)', color: '#fff',
    padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600'
  },
  detailSection: { padding: '2rem' },
  title: { fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem', lineHeight: '1.3' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' },
  stars: { color: '#f59e0b', fontSize: '1.1rem', letterSpacing: '2px' },
  ratingNum: { color: '#64748b', fontSize: '0.9rem' },
  priceRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' },
  price: { fontSize: '2rem', fontWeight: '800', color: '#6366f1' },
  stock: { fontSize: '0.85rem', color: '#64748b', fontWeight: '500' },
  sellerRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' },
  sellerLabel: { fontSize: '0.85rem', color: '#94a3b8' },
  seller: { fontSize: '0.9rem', fontWeight: '600', color: '#475569' },
  description: { color: '#475569', lineHeight: '1.7', marginBottom: '1.75rem', fontSize: '0.95rem' },
  actions: { display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' },
  addToCartBtn: {
    flex: 1, padding: '0.875rem', borderRadius: '12px', border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
    fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer'
  },
  favBtn: {
    padding: '0.875rem 1.25rem', borderRadius: '12px',
    cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem'
  },
  metaBox: { borderTop: '1px solid #f1f5f9', paddingTop: '1rem' },
  metaItem: { fontSize: '0.8rem', color: '#94a3b8' }
};

export default ProductDetail;