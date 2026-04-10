import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const steps = ['Order Placed', 'Confirmed', 'Out for Delivery', 'Delivered'];
const statusStep = (status) => {
  if (status === 'pending') return 1;
  if (status === 'confirmed') return 2;
  if (status === 'processing') return 3;
  if (status === 'delivered') return 4;
  return 1;
};
const statusColor = (s) => {
  if (s === 'delivered') return { bg: '#dcfce7', color: '#16a34a' };
  if (s === 'processing') return { bg: '#fef3c7', color: '#92400e' };
  if (s === 'confirmed') return { bg: '#dbeafe', color: '#1e40af' };
  if (s === 'cancelled') return { bg: '#fee2e2', color: '#dc2626' };
  return { bg: '#f1f5f9', color: '#64748b' };
};

export default function Orders() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem('mq_token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    api.get('/api/orders', { headers })
      .then(res => {
        setOrders(res.data);
        if (res.data.length > 0) setSelected(res.data[0]);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      const res = await api.patch(`/api/orders/${selected._id}/status`, { status: newStatus }, { headers });
      setSelected(res.data);
      setOrders(orders.map(o => o._id === res.data._id ? res.data : o));
    } catch (err) {
      alert('Error updating status: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading orders...</p></div>;
  if (orders.length === 0) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ fontSize: 64 }}>📦</div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem' }}>No Orders Yet</h2>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '40px 2rem' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', marginBottom: 32 }}>{isAdmin ? '📦 All Orders' : 'My Orders'}</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.map(o => {
              const sc = statusColor(o.status);
              return (
                <div key={o._id} onClick={() => setSelected(o)} style={{ background: selected?._id === o._id ? 'var(--primary-light)' : 'white', border: `1px solid ${selected?._id === o._id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '14px', padding: '16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>#{o.orderId}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: sc.bg, color: sc.color }}>{o.status}</span>
                  </div>
                  {isAdmin && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 2 }}>👤 {o.customer?.name || 'Customer'}</div>}
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 4 }}>{new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{o.totalAmount}</div>
                </div>
              );
            })}
          </div>

          {selected && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem' }}>Order #{selected.orderId}</h2>
                <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 14px', borderRadius: '20px', ...statusColor(selected.status) }}>{selected.status}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
                {steps.map((step, i) => {
                  const stepNum = statusStep(selected.status);
                  return (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: i < stepNum ? 'var(--primary)' : 'var(--border)', color: i < stepNum ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700 }}>
                          {i < stepNum ? '✓' : i + 1}
                        </div>
                        <span style={{ fontSize: '11px', color: i < stepNum ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600, textAlign: 'center', maxWidth: 70 }}>{step}</span>
                      </div>
                      {i < steps.length - 1 && <div style={{ flex: 1, height: 3, margin: '0 4px', marginBottom: 22, background: i < stepNum - 1 ? 'var(--primary)' : 'var(--border)', borderRadius: 2 }} />}
                    </div>
                  );
                })}
              </div>

              {isAdmin && (
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: 24, border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12 }}>UPDATE ORDER STATUS</p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {[
                      { label: '⏳ Pending', value: 'pending', color: '#64748b' },
                      { label: '✅ Confirmed', value: 'confirmed', color: '#1e40af' },
                      { label: '🚚 Out for Delivery', value: 'processing', color: '#92400e' },
                      { label: '🎉 Delivered', value: 'delivered', color: '#16a34a' },
                      { label: '❌ Cancelled', value: 'cancelled', color: '#dc2626' },
                    ].map(s => (
                      <button key={s.value} onClick={() => updateStatus(s.value)} disabled={updating || selected.status === s.value} style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: selected.status === s.value ? 'default' : 'pointer', border: `2px solid ${s.color}`, background: selected.status === s.value ? s.color : 'white', color: selected.status === s.value ? 'white' : s.color, opacity: updating ? 0.6 : 1 }}>{s.label}</button>
                    ))}
                  </div>
                </div>
              )}

              {isAdmin && selected.customer && (
                <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '12px 16px', marginBottom: 20, fontSize: '13px' }}>
                  <strong>Customer:</strong> {selected.customer.name} · {selected.customer.email}
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)' }}>ITEMS ORDERED</h3>
                {selected.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>💊</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ₹{item.unitPrice}</div>
                    </div>
                    <div style={{ fontWeight: 700 }}>₹{item.subtotal}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '16px' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>₹{selected.totalAmount}</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: 8 }}>
                Payment: {selected.paymentMethod?.toUpperCase()} · {selected.paymentStatus}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}