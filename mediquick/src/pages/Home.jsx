import { Link } from 'react-router-dom';

const categories = [
  { icon: '💊', name: 'Tablet',         count: '240+ items' },
  { icon: '🍼', name: 'Syrup',           count: '90+ items' },
  { icon: '💉', name: 'Capsule',         count: '100+ items' },
  { icon: '🧴', name: 'Cream',           count: '160+ items' },
  { icon: '💉', name: 'Injection',       count: '50+ items' },
  { icon: '🌿', name: 'Vitamin',         count: '120+ items' },
  { icon: '🔴', name: 'Painkiller',      count: '70+ items' },
  { icon: '💪', name: 'Antibiotic',      count: '60+ items' },
  { icon: '🩺', name: 'Medical Device',  count: '80+ items' },
  { icon: '👶', name: 'Baby Care',       count: '90+ items' },
  { icon: '🌱', name: 'Ayurvedic',       count: '120+ items' },
  { icon: '✨', name: 'Skincare',        count: '160+ items' },
];

const whyUs = [
  { icon: '⚡', title: '30-min Delivery', desc: 'Lightning-fast delivery to your doorstep in under 30 minutes.' },
  { icon: '✅', title: '100% Genuine', desc: 'All medicines sourced directly from licensed distributors.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Your health data is encrypted and never shared.' },
  { icon: '🏥', title: 'Expert Pharmacists', desc: 'Chat with certified pharmacists for free advice 24/7.' },
];

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #064d37 0%, #0a6e4f 50%, #0d8f65 100%)',
        padding: '80px 2rem', display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center', gap: '28px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: -100, right: -100 }} />
        <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', bottom: -80, left: -60 }} />

        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '30px', padding: '6px 18px', fontSize: '13px', color: 'rgba(255,255,255,0.9)', fontWeight: 500, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          🚀 Fast • Genuine • Trusted
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white', lineHeight: 1.2, maxWidth: 700 }}>
          Your Medicines,<br />
          <span style={{ color: '#86efac' }}>Delivered in Minutes</span>
        </h1>

        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: 520 }}>
          Order prescription and OTC medicines online. 30-minute delivery, 100% genuine products.
        </p>

        <div style={{ display: 'flex', width: '100%', maxWidth: 560, background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          <input placeholder="Search medicines, brands, health products..."
            style={{ flex: 1, padding: '16px 20px', border: 'none', outline: 'none', fontSize: '15px', fontFamily: 'DM Sans, sans-serif', color: '#1a1a2e' }} />
          <Link to="/medicines" style={{ padding: '0 28px', background: 'var(--primary)', color: 'white', border: 'none', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center' }}>Search</Link>
        </div>

        <div style={{ display: 'flex', gap: '24px', color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>
          <span>✓ 10,000+ medicines</span>
          <span>✓ 500+ brands</span>
          <span>✓ Cash on delivery</span>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: 'white', padding: '28px 2rem', display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border)' }}>
        {[
          { num: '50K+', label: 'Happy Customers' },
          { num: '10K+', label: 'Medicines' },
          { num: '30 min', label: 'Avg. Delivery' },
          { num: '24/7', label: 'Support' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Fraunces, serif' }}>{s.num}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '60px 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: 8 }}>Shop by Category</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '36px' }}>Find what you need quickly</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
          {categories.map(cat => (
            <Link to={`/medicines?category=${cat.name}`} key={cat.name} style={{
              background: 'white', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '24px 16px',
              textAlign: 'center', transition: 'all 0.25s',
              cursor: 'pointer', display: 'block', textDecoration: 'none'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(10,110,79,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>{cat.icon}</div>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px', color: 'var(--text)' }}>{cat.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cat.count}</div>
            </Link>
          ))}
        </div>
      </section>
          {/* POPULAR MEDICINES */}
<section style={{ background: 'var(--primary-light)', padding: '60px 2rem' }}>
  <div style={{ maxWidth: 1100, margin: '0 auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' }}>
      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: 4 }}>Popular Medicines</h2>
        <p style={{ color: 'var(--text-muted)' }}>Most ordered by our customers</p>
      </div>
      <Link to="/medicines" style={{
        color: 'var(--primary)', fontWeight: 600, fontSize: '14px',
        border: '1px solid var(--primary)', borderRadius: '10px', padding: '8px 20px'
      }}>View All →</Link>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px' }}>
      {[
        { name: 'Dolo 650',          brand: 'Micro Labs', price: 30, mrp: 35, tag: 'Bestseller' },
        { name: 'Cetirizine 10mg',   brand: 'Cipla',      price: 22, mrp: 28, tag: 'Popular' },
        { name: 'Pantoprazole 40mg', brand: 'Sun Pharma', price: 45, mrp: 55, tag: '' },
        { name: 'Azithromycin 500',  brand: 'Alkem',      price: 85, mrp: 100, tag: 'Rx Required' },
      ].map(med => (
        <div key={med.name} style={{
          background: 'white', borderRadius: '16px',
          border: '1px solid var(--border)', overflow: 'hidden', transition: 'all 0.25s'
        }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(10,110,79,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>

          <div style={{ background: 'var(--primary-light)', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', position: 'relative' }}>
            💊
            {med.tag && (
              <span style={{
                position: 'absolute', top: 10, right: 10,
                background: med.tag === 'Rx Required' ? '#fef3c7' : med.tag === 'Bestseller' ? 'var(--primary)' : '#dbeafe',
                color: med.tag === 'Rx Required' ? '#92400e' : med.tag === 'Bestseller' ? 'white' : '#1e40af',
                fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px'
              }}>{med.tag}</span>
            )}
          </div>

          <div style={{ padding: '16px' }}>
            <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: 2 }}>{med.name}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: 12 }}>{med.brand}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--primary)' }}>₹{med.price}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: 6 }}>₹{med.mrp}</span>
              </div>
              <Link to="/medicines" style={{
                background: 'var(--primary)', color: 'white', border: 'none',
                padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600
              }}>View →</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
      {/* WHY US */}
      <section style={{ padding: '60px 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: 8 }}>Why Choose MediQuick?</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '48px' }}>We make healthcare simple and accessible</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          {whyUs.map(w => (
            <div key={w.title} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px 24px' }}>
              <div style={{ fontSize: '36px', marginBottom: 12 }}>{w.icon}</div>
              <h3 style={{ fontSize: '18px', marginBottom: 8 }}>{w.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7 }}>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRESCRIPTION BANNER */}
      <section style={{
        background: 'linear-gradient(135deg, #0a6e4f, #064d37)',
        margin: '0 auto 60px', borderRadius: '16px',
        padding: '48px 40px', maxWidth: 1060,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: '24px', flexWrap: 'wrap'
      }}>
        <div>
          <h2 style={{ color: 'white', fontSize: '1.8rem', marginBottom: 8 }}>Have a Prescription?</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px' }}>Upload it and we'll prepare your full order in minutes.</p>
        </div>
        <Link to="/medicines" style={{ background: '#f59e0b', color: 'white', padding: '14px 32px', borderRadius: '12px', fontWeight: 700, fontSize: '15px', whiteSpace: 'nowrap' }}>
          Browse Medicines →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--text)', color: 'rgba(255,255,255,0.6)', padding: '40px 2rem', textAlign: 'center', fontSize: '14px' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: 'white', marginBottom: 8 }}>MediQuick</div>
        <p>© 2025 MediQuick. All rights reserved. | Your trusted online pharmacy.</p>
      </footer>
    </div>
  );
}