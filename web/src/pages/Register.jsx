import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-in-up">
        <div style={styles.header}>
          <div style={styles.icon}>✨</div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join the marketplace today</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            { key: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' }
          ].map(field => (
            <div key={field.key} style={styles.inputGroup}>
              <label style={styles.label}>{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={e => setForm({...form, [field.key]: e.target.value})}
                style={styles.input}
                required
              />
            </div>
          ))}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? '⏳ Creating...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account? <Link to="/login" style={styles.link}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '2rem'
  },
  card: {
    background: '#fff', borderRadius: '24px', padding: '2.5rem',
    width: '100%', maxWidth: '420px', boxShadow: '0 25px 60px rgba(0,0,0,0.15)'
  },
  header: { textAlign: 'center', marginBottom: '2rem' },
  icon: { fontSize: '3rem', marginBottom: '0.5rem' },
  title: { fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' },
  subtitle: { color: '#64748b', marginTop: '0.25rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.875rem', fontWeight: '500', color: '#374151' },
  input: {
    padding: '0.75rem 1rem', borderRadius: '10px',
    border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit'
  },
  submitBtn: {
    padding: '0.875rem', borderRadius: '12px', border: 'none',
    background: 'linear-gradient(135deg, #f093fb, #f5576c)',
    color: '#fff', fontSize: '1rem', fontWeight: '600', cursor: 'pointer'
  },
  switchText: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' },
  link: { color: '#f5576c', fontWeight: '600', textDecoration: 'none' }
};

export default Register;