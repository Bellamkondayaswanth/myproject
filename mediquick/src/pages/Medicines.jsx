import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(null);
  const { addToCart, count } = useCart();
  const location = useLocation();

  useEffect(() => {
    api.get('/api/medicines')
      .then(res => {
        setMedicines(res.data);
        const cats = ['All', ...new Set(res.data.map(m => m.category).filter(Boolean))];
        setCategories(cats);
        const params = new URLSearchParams(location.search);
        const cat = params.get('category');
        if (cat) setActiveCategory(cat);
      })
      .catch(() => setMedicines([]))
      .finally(() => setLoading(false));
  }, [location.search]);

  const handleAddToCart = (med) => {
    addToCart(med);
    setAdded(med._id);
    setTimeout(() => setAdded(null), 1500);
  };

  const filtered = medicines.filter(m => {
    const matchCat = activeCategory === 'All' || m.category === activeCategory;
    const matchSearch =
      (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.manufacturer || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Loading medicines...</p>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '40px 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', marginBottom: 4 }}>
              {activeCategory === 'All' ? 'Medicine Catalog' : `${activeCategory}s`}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>{filtered.length} products found</p>
          </div>
          <Link to="/cart" style={{ background: 'var(--primary)', color: 'white', padding: '10px 24px', borderRadius: '12px', fontWeight: 600, fontSize: '15px' }}>
            🛒 Cart ({count})
          </Link>
        </div>

        <div style={{ display: 'flex', background: 'white', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: 24 }}>
          <input
            placeholder="Search medicines or brands..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '14px 20px', border: 'none', outline: 'none', fontSize: '15px', fontFamily: 'DM Sans, sans-serif' }}
          />
          <div style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>🔍</div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: 32 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '8px 18px', borderRadius: '30px', fontSize: '13px', fontWeight: 600,
              border: activeCategory === cat ? 'none' : '1px solid var(--border)',
              background: activeCategory === cat ? 'var(--primary)' : 'white',
              color: activeCategory === cat ? 'white' : 'var(--text-muted)',
              cursor: 'pointer', transition: 'all 0.2s'
            }}>{cat}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {filtered.map(med => (
            <div key={med._id} style={{
              background: 'white', borderRadius: '16px',
              border: '1px solid var(--border)', overflow: 'hidden', transition: 'all 0.25s'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(10,110,79,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ background: '#e8f5e9', height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '52px', position: 'relative' }}>
                💊
                {med.requiresPrescription && (
                  <span style={{ position: 'absolute', top: 10, left: 10, background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>Rx</span>
                )}
                {med.stock <= med.minStock && (
                  <span style={{ position: 'absolute', top: 10, right: 10, background: '#fee2e2', color: '#991b1b', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>Low Stock</span>
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{med.category}</div>
                <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: 2 }}>{med.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: 14 }}>{med.manufacturer || 'MediQuick'}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--primary)' }}>₹{med.price}</span>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Stock: {med.stock}</div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(med)}
                    disabled={med.stock === 0}
                    style={{
                      background: added === med._id ? '#16a34a' : med.stock === 0 ? '#94a3b8' : 'var(--primary)',
                      color: 'white', border: 'none',
                      padding: '10px 18px', borderRadius: '10px',
                      fontSize: '13px', fontWeight: 700,
                      cursor: med.stock === 0 ? 'not-allowed' : 'pointer',
                      transition: 'background 0.3s'
                    }}>
                    {med.stock === 0 ? 'Out of Stock' : added === med._id ? '✓ Added' : '+ Add'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '48px', marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: 'Fraunces, serif', marginBottom: 8 }}>No medicines found</h3>
            <p>Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}