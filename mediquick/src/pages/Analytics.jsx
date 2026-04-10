import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0a6e4f', '#2563eb', '#7c3aed', '#d97706', '#dc2626', '#16a34a'];

export default function Analytics() {
  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const token = localStorage.getItem('mq_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = useCallback(() => {
    Promise.all([
      api.get('/api/orders', { headers }),
      api.get('/api/medicines', { headers })
    ]).then(([ordersRes, medsRes]) => {
      setOrders(ordersRes.data);
      setMedicines(medsRes.data);
      setLastUpdated(new Date().toLocaleTimeString());
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const confirmedOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'delivered' || o.status === 'out for delivery');
  const revenueByDay = () => {
    const map = {};
    confirmedOrders.forEach(o => {
      const date = new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      map[date] = (map[date] || 0) + (o.totalAmount || 0);
    });
    return Object.entries(map).map(([date, revenue]) => ({ date, revenue })).slice(-7);
  };
  const ordersByStatus = () => {
    const map = {};
    orders.forEach(o => { const status = o.status || 'pending'; map[status] = (map[status] || 0) + 1; });
    return Object.entries(map).map(([status, count]) => ({ status, count }));
  };
  const stockByCategory = () => {
    const map = {};
    medicines.forEach(m => { const cat = m.category || 'Other'; map[cat] = (map[cat] || 0) + (m.stock || 0); });
    return Object.entries(map).map(([category, stock]) => ({ category, stock }));
  };
  const topMedicines = () => {
    const map = {};
    confirmedOrders.forEach(o => { (o.items || []).forEach(item => { const name = item.name || 'Unknown'; map[name] = (map[name] || 0) + (item.quantity || 1); }); });
    return Object.entries(map).map(([name, sold]) => ({ name, sold })).sort((a, b) => b.sold - a.sold).slice(0, 5);
  };

  const totalRevenue = confirmedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const avgOrderValue = confirmedOrders.length ? Math.round(totalRevenue / confirmedOrders.length) : 0;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const deliveryRate = orders.length ? Math.round((deliveredCount / orders.length) * 100) : 0;
  const pendingRevenue = orders.filter(o => o.status === 'pending').reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Loading analytics...</p></div>;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '40px 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', marginBottom: 4 }}>📊 Analytics</h1>
            <p style={{ color: 'var(--text-muted)' }}>Live insights • Last updated: {lastUpdated} • <span style={{ color: '#16a34a', fontWeight: 600 }}>Auto-refreshes every 30s</span></p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={fetchData} style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--primary)', background: 'white', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>🔄 Refresh Now</button>
            <Link to="/admin" style={{ background: 'var(--primary)', color: 'white', padding: '10px 24px', borderRadius: '12px', fontWeight: 600 }}>← Dashboard</Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: 32 }}>
          {[
            { icon: '💰', label: 'Confirmed Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: '#0a6e4f', sub: 'From confirmed & delivered orders' },
            { icon: '⏳', label: 'Pending Revenue', value: `₹${pendingRevenue.toLocaleString()}`, color: '#d97706', sub: 'Waiting to be confirmed' },
            { icon: '📈', label: 'Avg Order Value', value: `₹${avgOrderValue}`, color: '#7c3aed', sub: 'Per confirmed order' },
            { icon: '🚀', label: 'Delivery Rate', value: `${deliveryRate}%`, color: '#2563eb', sub: `${deliveredCount} of ${orders.length} delivered` },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px' }}>
              <div style={{ fontSize: '28px', marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '22px', color: s.color, fontFamily: 'Fraunces, serif', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#e6f4ef', borderRadius: '12px', padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '20px' }}>ℹ️</span>
          <p style={{ margin: 0, fontSize: '14px', color: '#0a6e4f', fontWeight: 500 }}>Revenue charts count only <strong>Confirmed, Out for Delivery & Delivered</strong> orders.</p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem' }}>Revenue Trend (Last 7 Days)</h2>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Confirmed orders only</span>
          </div>
          {revenueByDay().length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueByDay()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(val) => [`₹${val}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#0a6e4f" strokeWidth={3} dot={{ fill: '#0a6e4f', r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: 12 }}>📭</div>
              <p style={{ color: 'var(--text-muted)' }}>No confirmed orders yet.</p>
              <Link to="/admin/orders" style={{ color: 'var(--primary)', fontWeight: 600 }}>Go to Manage Orders →</Link>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: 24 }}>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px' }}>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', marginBottom: 20 }}>Orders by Status</h2>
            {ordersByStatus().length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={ordersByStatus()} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label={({ status, count }) => `${status}: ${count}`}>
                      {ordersByStatus().map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 12 }}>
                  {ordersByStatus().map((item, i) => (
                    <div key={item.status} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                      <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{item.status} ({item.count})</span>
                    </div>
                  ))}
                </div>
              </>
            ) : <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>No orders yet</p>}
          </div>

          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px' }}>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', marginBottom: 4 }}>Top Selling Medicines</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 16 }}>From confirmed & delivered orders</p>
            {topMedicines().length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={topMedicines()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis dataKey="name" type="category" fontSize={11} width={110} />
                  <Tooltip formatter={(val) => [val, 'Units Sold']} />
                  <Bar dataKey="sold" fill="#0a6e4f" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div style={{ textAlign: 'center', padding: '40px 0' }}><p style={{ color: 'var(--text-muted)' }}>Confirm orders to see top medicines</p></div>}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', marginBottom: 20 }}>Stock by Category</h2>
          {stockByCategory().length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stockByCategory()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(val) => [val, 'Units in Stock']} />
                <Bar dataKey="stock" radius={[6, 6, 0, 0]}>
                  {stockByCategory().map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>No stock data yet</p>}
        </div>
      </div>
    </div>
  );
}