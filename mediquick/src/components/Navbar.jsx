import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { count } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'white', borderBottom: '1px solid var(--border)',
      padding: '0 2rem', position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: '64px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '10px',
          background: 'var(--primary)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: 'white', fontFamily: 'Fraunces, serif',
          fontWeight: 700, fontSize: '18px'
        }}>M</div>
        <span style={{
          fontFamily: 'Fraunces, serif', fontSize: '22px',
          fontWeight: 700, color: 'var(--primary)'
        }}>MediQuick</span>
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {[{ to: '/', label: 'Home' },
          { to: '/medicines', label: 'Medicines' },
          { to: '/contact', label: 'Contact' },
          ...(user ? [{ to: '/orders', label: 'My Orders' }] : []),
        ].map(l => (
          <Link key={l.to} to={l.to} style={{
            fontSize: '15px',
            fontWeight: pathname === l.to ? 600 : 400,
            color: pathname === l.to ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: pathname === l.to ? '2px solid var(--primary)' : 'none',
            paddingBottom: '2px'
          }}>{l.label}</Link>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {/* Cart with count badge */}
        {user && (
          <Link to="/cart" style={{
            width: 40, height: 40, borderRadius: '10px',
            border: '1px solid var(--border)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', position: 'relative'
          }}>
            🛒
            {count > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -6,
                background: 'var(--primary)', color: 'white',
                borderRadius: '50%', width: 18, height: 18,
                fontSize: '11px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{count}</span>
            )}
          </Link>
        )}

        {user ? (
          <>
            <Link to="/profile" style={{
              width: 40, height: 40, borderRadius: '10px',
              border: '1px solid var(--border)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '18px'
            }}>👤</Link>

            {/* Admin button - only for admin role */}
            {user.role === 'admin' && (
                <>
                  <Link to="/admin" style={{
                    padding: '8px 14px', borderRadius: '10px',
                    background: '#1e293b', color: 'white',
                    fontSize: '14px', fontWeight: 600
                  }}>Dashboard</Link>
                  <Link to="/admin/orders" style={{
                    padding: '8px 14px', borderRadius: '10px',
                    background: '#0a6e4f', color: 'white',
                    fontSize: '14px', fontWeight: 600
                  }}>Orders</Link>
                </>
              )}

            <button onClick={handleLogout} style={{
              padding: '8px 14px', borderRadius: '10px',
              background: '#fee2e2', color: '#dc2626',
              border: 'none', fontSize: '14px',
              fontWeight: 600, cursor: 'pointer'
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/register" style={{
              padding: '8px 14px', borderRadius: '10px',
              border: '1px solid var(--primary)',
              color: 'var(--primary)', fontSize: '14px', fontWeight: 600
            }}>Register</Link>
            <Link to="/login" style={{
              padding: '8px 14px', borderRadius: '10px',
              background: 'var(--primary)', color: 'white',
              fontSize: '14px', fontWeight: 600
            }}>Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}