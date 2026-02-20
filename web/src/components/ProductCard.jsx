import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const ProductCard = ({ product, onFavoriteChange }) => {
  const { user, updateFavorites } = useAuth();
  const [heartAnimating, setHeartAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFavorite = user?.favorites?.includes(product._id);

  const handleFavorite = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to save favorites');

    setLoading(true);
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 400);

    try {
      if (isFavorite) {
        const { data } = await API.delete(`/favorites/${product._id}`);
        updateFavorites(data.data);
        toast.success('Removed from favorites');
      } else {
        const { data } = await API.post(`/favorites/${product._id}`);
        updateFavorites(data.data);
        toast.success('Added to favorites ❤️');
      }
      if (onFavoriteChange) onFavoriteChange();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating favorites');
    } finally {
      setLoading(false);
    }
  };

  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  return (
    <Link to={`/products/${product._id}`} style={styles.cardLink}>
      <div style={styles.card} className="product-card">
        <div style={styles.imageContainer}>
          <img
            src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={product.title}
            style={styles.image}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
          />
          <div style={styles.categoryBadge}>{product.category}</div>
          <button
            onClick={handleFavorite}
            disabled={loading}
            style={{
              ...styles.heartBtn,
              transform: heartAnimating ? 'scale(1.4)' : 'scale(1)',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>

        <div style={styles.cardBody}>
          <h3 style={styles.title}>{product.title}</h3>
          <p style={styles.description}>{product.description.slice(0, 80)}...</p>
          <div style={styles.footer}>
            <div>
              <span style={styles.price}>${product.price.toFixed(2)}</span>
              <div style={styles.rating}>
                <span style={styles.stars}>{stars}</span>
                <span style={styles.ratingNum}>({product.rating})</span>
              </div>
            </div>
            <span style={styles.stock}>
              {product.stock > 0 ? `${product.stock} in stock` : '❌ Out of stock'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const styles = {
  cardLink: { textDecoration: 'none', color: 'inherit', display: 'block' },
  card: {
    background: '#fff', borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    overflow: 'hidden', transition: 'all 0.3s ease',
    cursor: 'pointer', height: '100%',
    ':hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 32px rgba(99,102,241,0.15)' }
  },
  imageContainer: { position: 'relative', overflow: 'hidden', height: '200px' },
  image: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' },
  categoryBadge: {
    position: 'absolute', top: '12px', left: '12px',
    background: 'rgba(99,102,241,0.9)', color: '#fff',
    padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600'
  },
  heartBtn: {
    position: 'absolute', top: '10px', right: '10px',
    background: 'rgba(255,255,255,0.9)', border: 'none',
    borderRadius: '50%', width: '36px', height: '36px',
    cursor: 'pointer', fontSize: '1.1rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(4px)'
  },
  cardBody: { padding: '1rem' },
  title: { fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  description: { fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: '1.5' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
  price: { fontSize: '1.2rem', fontWeight: '700', color: '#6366f1' },
  rating: { display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' },
  stars: { color: '#f59e0b', fontSize: '0.75rem', letterSpacing: '1px' },
  ratingNum: { fontSize: '0.7rem', color: '#94a3b8' },
  stock: { fontSize: '0.7rem', color: '#94a3b8', textAlign: 'right' }
};

export default ProductCard;