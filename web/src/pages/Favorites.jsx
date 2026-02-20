import { useState, useEffect } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const { data } = await API.get('/favorites');
      setFavorites(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFavorites(); }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <p style={{ color: '#64748b' }}>Loading favorites...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div className="container">
        <div style={styles.header}>
          <h1 style={styles.title}>❤️ Your Favorites</h1>
          <p style={styles.subtitle}>{favorites.length} saved items</p>
        </div>

        {favorites.length > 0 ? (
          <div style={styles.grid}>
            {favorites.map((product, i) => (
              <div key={product._id} className="fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}>
                <ProductCard product={product} onFavoriteChange={fetchFavorites} />
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.empty}>
            <p style={styles.emptyIcon}>💔</p>
            <h2 style={styles.emptyTitle}>No favorites yet</h2>
            <p style={styles.emptySub}>Start exploring and save items you love!</p>
            <Link to="/" style={styles.exploreBtn}>Browse Products</Link>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '2rem 0' },
  header: { marginBottom: '2rem' },
  title: { fontSize: '2rem', fontWeight: '700', color: '#1e293b' },
  subtitle: { color: '#64748b', marginTop: '0.25rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' },
  empty: { textAlign: 'center', padding: '5rem 0' },
  emptyIcon: { fontSize: '5rem', marginBottom: '1rem' },
  emptyTitle: { fontSize: '1.5rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' },
  emptySub: { color: '#94a3b8', marginBottom: '1.5rem' },
  exploreBtn: {
    display: 'inline-block', padding: '0.75rem 2rem',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: '600'
  }
};

export default Favorites;