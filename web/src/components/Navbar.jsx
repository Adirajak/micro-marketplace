import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.brand}>
          <span style={styles.brandIcon}>🛍️</span>
          <span style={styles.brandText}>Marketplace</span>
        </Link>

        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>Products</Link>
          {user ? (
            <>
              <Link to="/favorites" style={styles.navLink}>❤️ Favorites</Link>
              <span style={styles.greeting}>Hi, {user.name.split(' ')[0]}!</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navLink}>Login</Link>
              <Link to="/register" style={styles.registerBtn}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 20px rgba(0,0,0,0.06)',
    padding: '0.875rem 0'
  },
  inner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  brand: { display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' },
  brandIcon: { fontSize: '1.5rem' },
  brandText: { fontSize: '1.25rem', fontWeight: '700', color: '#6366f1' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  navLink: { color: '#475569', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem',
    transition: 'color 0.2s', ':hover': { color: '#6366f1' } },
  greeting: { color: '#475569', fontSize: '0.9rem', fontWeight: '500' },
  logoutBtn: {
    padding: '0.4rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px',
    background: 'transparent', cursor: 'pointer', color: '#64748b',
    fontSize: '0.85rem', fontWeight: '500', transition: 'all 0.2s'
  },
  registerBtn: {
    padding: '0.4rem 1.2rem',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff', borderRadius: '8px', textDecoration: 'none',
    fontSize: '0.85rem', fontWeight: '600'
  }
};

export default Navbar;