import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirm: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      // Sending EVERY field the model requires
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone
      });

      // Save user info so Profile.jsx can show "Sai"
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Success redirect
      navigate('/profile');
      
    } catch (err) {
      // This catches the 500 error and tells you WHY (e.g. Email already exists)
      setError(err.response?.data?.message || "Server Error. Check Backend Terminal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 1rem', background: 'var(--bg)' }}>
      <div style={{ background: 'var(--white)', borderRadius: '20px', border: '1px solid var(--border)', padding: '48px 40px', width: '100%', maxWidth: 480, boxShadow: '0 8px 32px rgba(10,110,79,0.10)' }}>
        
        <h1 style={{ textAlign: 'center', fontFamily: 'Fraunces, serif', marginBottom: '24px' }}>Create Account</h1>

        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center', fontWeight: 600 }}>⚠️ {error}</div>}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input name="name" placeholder="Full Name" value={form.name} onChange={handle} required style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }} />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handle} required style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }} />
          <input name="phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={handle} required style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handle} required style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }} />
          <input name="confirm" type="password" placeholder="Confirm Password" value={form.confirm} onChange={handle} required style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }} />
          
          <button type="submit" disabled={loading} style={{ padding: '14px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}