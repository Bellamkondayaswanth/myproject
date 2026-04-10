import { useState } from 'react';
import api from '../api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/email/contact', { name: form.name, email: form.email, subject: form.subject, message: form.message });
    } catch (err) {
      console.error('Email error:', err);
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  if (sent) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center' }}>
      <div style={{ fontSize: '64px' }}>📬</div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', color: 'var(--primary)' }}>Message Sent!</h2>
      <p style={{ color: 'var(--text-muted)' }}>We'll get back to you at <strong>{form.email}</strong> within 24 hours.</p>
      <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} style={{ background: 'var(--primary)', color: 'white', padding: '12px 32px', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Send Another</button>
    </div>
  );

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '15px', outline: 'none', fontFamily: 'DM Sans, sans-serif' };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '60px 2rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', marginBottom: 8 }}>Contact Us</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 40 }}>We're here to help. Reach out anytime.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '📞', title: 'Phone', info: '+91 98765 43210', sub: 'Mon–Sat, 9am–6pm' },
              { icon: '📧', title: 'Email', info: 'support@mediquick.in', sub: 'Reply within 24 hours' },
              { icon: '📍', title: 'Address', info: 'MediQuick HQ, Hyderabad', sub: 'Telangana, India 500001' },
              { icon: '🕐', title: 'Working Hours', info: '24/7 Online Support', sub: 'Emergency orders anytime' },
            ].map(c => (
              <div key={c.title} style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--border)', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: 2 }}>{c.title}</div>
                  <div style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 600 }}>{c.info}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '32px' }}>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', marginBottom: 24 }}>Send a Message</h2>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: 6 }}>Name</label>
                  <input name="name" placeholder="Your name" value={form.name} onChange={handle} required style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: 6 }}>Email</label>
                  <input name="email" type="email" placeholder="Your email" value={form.email} onChange={handle} required style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: 6 }}>Subject</label>
                <input name="subject" placeholder="How can we help?" value={form.subject} onChange={handle} required style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: 6 }}>Message</label>
                <textarea name="message" placeholder="Write your message..." value={form.message} onChange={handle} required rows={5} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? '#64748b' : 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Sending...' : 'Send Message 📬'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}