import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQty, removeFromCart, clearCart, total } = useCart();
  const [ordered, setOrdered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const delivery = total > 500 ? 0 : 40;
  const grandTotal = total + delivery;

  useEffect(() => {
    const token = localStorage.getItem('mq_token');
    if (token) {
      api.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setUser(res.data))
        .catch(() => {});
    }
  }, []);

  const placeOrder = async () => {
    const token = localStorage.getItem('mq_token');
    if (!token) { navigate('/login'); return; }
    setLoading(true);
    try {
      const orderRes = await api.post(
        '/api/orders',
        {
          items: cart.map(i => ({
            medicine: i._id,
            name: i.name,
            quantity: i.qty,
            price: i.price
          })),
          totalAmount: grandTotal,
          deliveryCharge: delivery
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newOrderId = orderRes.data.orderId || orderRes.data._id;
      setOrderId(newOrderId);

      try {
        await api.post(
          '/api/email/order-confirmation',
          {
            order: {
              orderId: newOrderId,
              items: cart.map(i => ({
                name: i.name,
                quantity: i.qty,
                price: i.price
              })),
              totalAmount: grandTotal,
              address: user?.address || 'Address on file'
            }
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (emailErr) {
        console.log('Email failed but order placed:', emailErr.message);
      }

      clearCart();
      setOrdered(true);
    } catch (err) {
      console.error('Order error:', err.message);
      alert('Failed to place order. Are you logged in?');
    } finally {
      setLoading(false);
    }
  };

  if (ordered) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center' }}>
      <div style={{ fontSize: '72px' }}>🎉</div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', color: 'var(--primary)' }}>Order Placed!</h2>
      <p style={{ color: 'var(--text-muted)' }}>Your medicines will arrive in 30 minutes.</p>
      {user?.email && <p style={{ color: 'var(--primary)', fontWeight: 600 }}>📧 Confirmation sent to {user.email}</p>}
      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Order ID: #{orderId}</p>
      <Link to="/orders" style={{ background: 'var(--primary)', color: 'white', padding: '12px 32px', borderRadius: '12px', fontWeight: 600 }}>Track Order</Link>
    </div>
  );

  if (cart.length === 0) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{ fontSize: '64px' }}>🛒</div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem' }}>Cart is Empty</h2>
      <p style={{ color: 'var(--text-muted)' }}>Add medicines from the catalog to get started.</p>
      <Link to="/medicines" style={{ background: 'var(--primary)', color: 'white', padding: '12px 32px', borderRadius: '12px', fontWeight: 600 }}>Browse Medicines</Link>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '40px 2rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', marginBottom: 8 }}>Your Cart</h1>
        {user && <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Delivering to: <strong>{user.address || 'Update address in profile'}</strong></p>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map(item => (
              <div key={item._id} style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: 64, height: 64, borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0 }}>💊</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>{item.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.brand}</div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', marginTop: 4 }}>₹{item.price}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => updateQty(item._id, -1)} style={{ width: 32, height: 32, borderRadius: '8px', border: '1px solid var(--border)', background: 'white', fontSize: '18px', cursor: 'pointer', fontWeight: 700 }}>−</button>
                  <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => updateQty(item._id, 1)} style={{ width: 32, height: 32, borderRadius: '8px', border: '1px solid var(--border)', background: 'white', fontSize: '18px', cursor: 'pointer', fontWeight: 700 }}>+</button>
                </div>
                <div style={{ fontWeight: 700, minWidth: 60, textAlign: 'right' }}>₹{item.price * item.qty}</div>
                <button onClick={() => removeFromCart(item._id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', width: 32, height: 32, borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>✕</button>
              </div>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', height: 'fit-content', position: 'sticky', top: '80px' }}>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', marginBottom: 20 }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal ({cart.length} items)</span>
                <span>₹{total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                <span style={{ color: delivery === 0 ? '#16a34a' : 'inherit' }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
              </div>
              {delivery > 0 && (
                <div style={{ fontSize: '12px', color: 'var(--primary)', background: 'var(--primary-light)', padding: '8px 12px', borderRadius: '8px' }}>
                  Add ₹{500 - total} more for free delivery!
                </div>
              )}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '18px' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>₹{grandTotal}</span>
              </div>
            </div>

            {user && (
              <div style={{ background: 'var(--primary-light)', borderRadius: '10px', padding: '12px', marginBottom: 16, fontSize: '13px' }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>📍 Delivery to:</div>
                <div style={{ color: 'var(--text-muted)' }}>{user.name}</div>
                <div style={{ color: 'var(--text-muted)' }}>{user.address || 'No address set'}</div>
                <div style={{ color: 'var(--text-muted)' }}>{user.phone}</div>
              </div>
            )}

            <button onClick={placeOrder} disabled={loading} style={{
              width: '100%', padding: '14px',
              background: loading ? '#64748b' : 'var(--primary)', color: 'white',
              border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}>
              {loading ? 'Placing Order...' : 'Place Order →'}
            </button>
            <Link to="/medicines" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: '14px', color: 'var(--text-muted)' }}>← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}