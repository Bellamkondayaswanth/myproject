import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const statusColor = (s) => {
  if (s === 'delivered') return { bg: '#dcfce7', color: '#16a34a' };
  if (s === 'processing') return { bg: '#fef3c7', color: '#92400e' };
  if (s === 'confirmed') return { bg: '#dbeafe', color: '#1e40af' };
  if (s === 'cancelled') return { bg: '#fee2e2', color: '#dc2626' };
  return { bg: '#f1f5f9', color: '#64748b' };
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('mq_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchStats = () => {
    setLoading(true);
    api.get('/api/dashboard/stats', { headers })
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading dashboard...</p></div>;

  const statCards = [
    { icon: '📦', label: 'Total Orders', value: stats?.totalOrders || 0, color: '#0a6e4f', link: '/admin/orders' },
    { icon: '💊', label: 'Medicines', value: stats?.totalMedicines || 0, color: '#2563eb', link: '/inventory' },
    { icon: '👥', label: 'Customers', value: stats?.totalUsers || 0, color: '#7c3aed', link: '/admin/customers' },
    { icon: '⚠️', label: 'Low Stock', value: stats?.lowStock || 0, color: '#d97706', link: '/inventory' },
    { icon: '⏰', label: 'Expiring Soon', value: stats?.expiringCount || 0, color: '#dc2626', link: '/inventory' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '40px 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', marginBottom: 4 }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Live data from MongoDB</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={fetchStats} style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--primary)', background: 'white', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>🔄 Refresh</button>
            <Link to="/inventory" style={{ background: 'var(--primary)', color: 'white', padding: '10px 24px', borderRadius: '12px', fontWeight: 600 }}>Manage Inventory →</Link>
            <Link to="/admin/orders" style={{ background: '#1e293b', color: 'white', padding: '10px 24px', borderRadius: '12px', fontWeight: 600 }}>Manage Orders →</Link>
            <Link to="/admin/analytics" style={{ background: '#7c3aed', color: 'white', padding: '10px 24px', borderRadius: '12px', fontWeight: 600 }}>📊 Analytics</Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: 32 }}>
          {statCards.map(s => (
            <Link key={s.label} to={s.link} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ fontSize: '28px', marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '28px', color: s.color, fontFamily: 'Fraunces, serif', marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: 32 }}>
          {[
            { icon: '➕', label: 'Add Medicine', link: '/inventory', bg: '#e6f4ef', color: '#0a6e4f' },
            { icon: '📋', label: 'View All Orders', link: '/admin/orders', bg: '#dbeafe', color: '#1e40af' },
            { icon: '👥', label: 'View Customers', link: '/admin/customers', bg: '#ede9fe', color: '#7c3aed' },
            { icon: '📊', label: 'View Analytics', link: '/admin/analytics', bg: '#fef3c7', color: '#92400e' },
          ].map(a => (
            <Link key={a.label} to={a.link} style={{ background: a.bg, borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <span style={{ fontSize: '24px' }}>{a.icon}</span>
              <span style={{ fontWeight: 600, fontSize: '14px', color: a.color }}>{a.label}</span>
            </Link>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem' }}>Recent Orders</h2>
            <Link to="/admin/orders" style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 600 }}>View All →</Link>
          </div>
          {!stats?.recentOrders?.length ? (
            <p style={{ color: 'var(--text-muted)' }}>No orders yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 0', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(o => {
                  const sc = statusColor(o.status);
                  return (
                    <tr key={o._id} style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      <td style={{ padding: '12px 0', fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}><Link to="/admin/orders" style={{ color: 'var(--primary)' }}>#{o.orderId}</Link></td>
                      <td style={{ padding: '12px 0', fontSize: '13px' }}>{o.customer?.name || 'N/A'}</td>
                      <td style={{ padding: '12px 0', fontSize: '13px', textAlign: 'center' }}>{o.items?.length}</td>
                      <td style={{ padding: '12px 0', fontSize: '13px', fontWeight: 600 }}>₹{o.totalAmount}</td>
                      <td style={{ padding: '12px 0' }}><span style={{ background: sc.bg, color: sc.color, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>{o.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}