import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/medicines');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '90vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 1rem', background: 'var(--bg)'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px',
        border: '1px solid var(--border)', padding: '48px 40px',
        width: '100%', maxWidth: 440,
        boxShadow: '0 8px 32px rgba(10,110,79,0.10)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '14px',
            background: 'var(--primary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', margin: '0 auto 12px'
          }}>💊</div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.8rem', marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Login to your MediQuick account</p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2', color: '#dc2626', padding: '12px',
            borderRadius: '10px', marginBottom: '20px', fontSize: '13px',
            textAlign: 'center', fontWeight: 600
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Email Address
            </label>
            <input
              name="email" type="email" placeholder="Enter your email"
              value={form.email} onChange={handle} required
              style={{
                width: '100%', padding: '12px 16px',
                border: '1px solid var(--border)', borderRadius: '10px',
                fontSize: '15px', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <input
              name="password" type="password" placeholder="Enter your password"
              value={form.password} onChange={handle} required
              style={{
                width: '100%', padding: '12px 16px',
                border: '1px solid var(--border)', borderRadius: '10px',
                fontSize: '15px', outline: 'none'
              }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? '#94a3b8' : 'var(--primary)', color: 'white',
            border: 'none', borderRadius: '12px',
            fontSize: '16px', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px'
          }}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}