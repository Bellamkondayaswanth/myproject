import { useState, useEffect } from 'react';
import api from '../api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem('mq_token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    api.get('/api/auth/users', { headers })
      .then(res => setCustomers(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading customers...</p></div>;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '40px 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', marginBottom: 4 }}>👥 Customers</h1>
            <p style={{ color: 'var(--text-muted)' }}>{customers.length} registered users</p>
          </div>
        </div>

        <div style={{ display: 'flex', background: 'white', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: 24 }}>
          <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, padding: '13px 20px', border: 'none', outline: 'none', fontSize: '15px' }} />
          <div style={{ padding: '13px 20px', color: 'var(--text-muted)' }}>🔍</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 24 }}>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                  {['Customer', 'Email', 'Role', 'Joined', 'Details'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c._id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px' }}>
                          {c.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>{c.email}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: c.role === 'admin' ? '#1e293b' : '#dcfce7', color: c.role === 'admin' ? 'white' : '#16a34a' }}>{c.role}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={() => setSelected(selected?._id === c._id ? null : c)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--primary)', background: selected?._id === c._id ? 'var(--primary)' : 'white', color: selected?._id === c._id ? 'white' : 'var(--primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        {selected?._id === c._id ? 'Close' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selected && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', height: 'fit-content' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '26px' }}>
                  {selected.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', marginBottom: 4 }}>{selected.name}</h2>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: selected.role === 'admin' ? '#1e293b' : '#dcfce7', color: selected.role === 'admin' ? 'white' : '#16a34a' }}>{selected.role}</span>
                </div>
              </div>
              {[
                { label: 'Email', value: selected.email, icon: '📧' },
                { label: 'Phone', value: selected.phone || 'Not provided', icon: '📞' },
                { label: 'Address', value: selected.address || 'Not provided', icon: '🏠' },
                { label: 'Blood Group', value: selected.blood || 'Not provided', icon: '🩸' },
                { label: 'Date of Birth', value: selected.dob ? new Date(selected.dob).toLocaleDateString('en-IN') : 'Not provided', icon: '🎂' },
                { label: 'Joined', value: new Date(selected.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), icon: '📅' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}