import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-in-up">
        <div style={styles.header}>
          <div style={styles.icon}>🛍️</div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="alice@test.com"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              style={styles.input}
              required
            />
          </div>

          {/* Quick fill demo credentials */}
          <div style={styles.demoBox}>
            <p style={styles.demoTitle}>🧪 Demo Credentials</p>
            <button type="button" style={styles.demoBtn}
              onClick={() => setForm({ email: 'alice@test.com', password: 'password123' })}>
              Fill Alice's credentials
            </button>
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? <span style={styles.spinner}>⏳</span> : 'Sign In'}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account? <Link to="/register" style={styles.link}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem'
  },
  card: {
    background: '#fff', borderRadius: '24px', padding: '2.5rem',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.15)'
  },
  header: { textAlign: 'center', marginBottom: '2rem' },
  icon: { fontSize: '3rem', marginBottom: '0.5rem' },
  title: { fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' },
  subtitle: { color: '#64748b', marginTop: '0.25rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.875rem', fontWeight: '500', color: '#374151' },
  input: {
    padding: '0.75rem 1rem', borderRadius: '10px',
    border: '1.5px solid #e2e8f0', fontSize: '0.95rem',
    outline: 'none', transition: 'border-color 0.2s',
    fontFamily: 'inherit'
  },
  demoBox: {
    background: '#f0fdf4', border: '1px solid #bbf7d0',
    borderRadius: '10px', padding: '0.75rem', textAlign: 'center'
  },
  demoTitle: { fontSize: '0.8rem', color: '#166534', marginBottom: '0.5rem' },
  demoBtn: {
    background: '#22c55e', color: '#fff', border: 'none',
    padding: '0.35rem 0.75rem', borderRadius: '6px', cursor: 'pointer',
    fontSize: '0.8rem', fontWeight: '500'
  },
  submitBtn: {
    padding: '0.875rem', borderRadius: '12px', border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff', fontSize: '1rem', fontWeight: '600',
    cursor: 'pointer', transition: 'opacity 0.2s'
  },
  spinner: { display: 'inline-block' },
  switchText: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' },
  link: { color: '#6366f1', fontWeight: '600', textDecoration: 'none' }
};

export default Login;