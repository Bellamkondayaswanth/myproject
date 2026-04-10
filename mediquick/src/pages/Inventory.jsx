import { useState, useEffect } from 'react';
import axios from 'axios';

const categories = [
  'Tablet', 'Syrup', 'Capsule', 'Injection', 'Cream', 'Drops',
  'Antibiotic', 'Vitamin', 'Painkiller',
  'Medical Device', 'Baby Care', 'Ayurvedic', 'Skincare', 'Other'
];

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: '', manufacturer: '', category: 'Other',
    stock: '', price: '', expiryDate: '', minStock: 10,
    genericName: '', requiresPrescription: false
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('mq_token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('http://localhost:5000/api/medicines')
      .then(res => setItems(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handle = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const openAdd = () => {
    setForm({ name: '', manufacturer: '', category: 'Other', stock: '', price: '', expiryDate: '', minStock: 10, genericName: '', requiresPrescription: false });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm({
      name: item.name || '',
      manufacturer: item.manufacturer || '',
      category: item.category || 'Other',
      stock: item.stock || '',
      price: item.price || '',
      expiryDate: item.expiryDate ? item.expiryDate.slice(0, 10) : '',
      minStock: item.minStock || 10,
      genericName: item.genericName || '',
      requiresPrescription: item.requiresPrescription || false
    });
    setEditId(item._id);
    setShowForm(true);
  };

  const save = async () => {
    try {
      if (!form.name || !form.price || !form.stock || !form.expiryDate) {
        alert('Please fill Name, Price, Stock and Expiry Date!');
        return;
      }
      if (editId) {
        const res = await axios.put(`http://localhost:5000/api/medicines/${editId}`, form, { headers });
        setItems(items.map(i => i._id === editId ? res.data : i));
      } else {
        const res = await axios.post('http://localhost:5000/api/medicines', form, { headers });
        setItems([...items, res.data]);
      }
      setShowForm(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const remove = async (id) => {
    if (window.confirm('Delete this medicine permanently?')) {
      try {
        await axios.delete(`http://localhost:5000/api/medicines/${id}`, { headers });
        setItems(items.filter(i => i._id !== id));
      } catch (err) {
        alert('Error deleting');
      }
    }
  };

  const filtered = items.filter(i =>
    (i.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.manufacturer || '').toLowerCase().includes(search.toLowerCase())
  );

  const stockStatus = (qty) => {
    if (qty < 50) return { label: 'Low Stock', bg: '#fee2e2', color: '#dc2626' };
    if (qty < 200) return { label: 'Medium', bg: '#fef3c7', color: '#92400e' };
    return { label: 'In Stock', bg: '#dcfce7', color: '#16a34a' };
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1px solid var(--border)', borderRadius: '10px',
    fontSize: '14px', outline: 'none', fontFamily: 'DM Sans, sans-serif'
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Syncing with MongoDB Atlas...</div>;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '40px 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', marginBottom: 4 }}>Inventory Control</h1>
            <p style={{ color: 'var(--text-muted)' }}>{items.length} products live in database</p>
          </div>
          <button onClick={openAdd} style={{
            background: 'var(--primary)', color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: 'pointer'
          }}>+ Add Medicine</button>
        </div>

        {saved && (
          <div style={{ background: '#dcfce7', color: '#16a34a', padding: '12px 20px', borderRadius: '10px', marginBottom: 16, fontWeight: 600 }}>
            ✅ Database updated successfully!
          </div>
        )}

        <div style={{ display: 'flex', background: 'white', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: 24 }}>
          <input placeholder="Search inventory..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '13px 20px', border: 'none', outline: 'none', fontSize: '15px' }} />
          <div style={{ padding: '13px 20px', color: 'var(--text-muted)' }}>🔍</div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {['Medicine', 'Manufacturer', 'Category', 'Stock', 'Price', 'Expiry', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const st = stockStatus(item.stock);
                return (
                  <tr key={item._id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: '14px' }}>{item.name}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>{item.manufacturer || 'N/A'}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px' }}>{item.category}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600 }}>{item.stock}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>₹{item.price}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px' }}>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: st.bg, color: st.color, fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' }}>{st.label}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openEdit(item)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--primary)', background: 'white', color: 'var(--primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => remove(item._id)} style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#dc2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', marginBottom: 24 }}>{editId ? 'Edit Medicine' : 'Add New Medicine'}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

                <div><label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Medicine Name *</label>
                  <input name="name" value={form.name} onChange={handle} style={inputStyle} placeholder="e.g. Paracetamol" /></div>

                <div><label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Generic Name</label>
                  <input name="genericName" value={form.genericName} onChange={handle} style={inputStyle} placeholder="e.g. Acetaminophen" /></div>

                <div><label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Manufacturer</label>
                  <input name="manufacturer" value={form.manufacturer} onChange={handle} style={inputStyle} placeholder="e.g. Sun Pharma" /></div>

                <div><label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Category *</label>
                  <select name="category" value={form.category} onChange={handle} style={inputStyle}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select></div>

                <div><label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Stock *</label>
                  <input name="stock" type="number" value={form.stock} onChange={handle} style={inputStyle} placeholder="e.g. 100" /></div>

                <div><label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Min Stock</label>
                  <input name="minStock" type="number" value={form.minStock} onChange={handle} style={inputStyle} placeholder="e.g. 10" /></div>

                <div><label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Price (₹) *</label>
                  <input name="price" type="number" value={form.price} onChange={handle} style={inputStyle} placeholder="e.g. 50" /></div>

                <div><label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Expiry Date *</label>
                  <input name="expiryDate" type="date" value={form.expiryDate} onChange={handle} style={inputStyle} /></div>

                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input name="requiresPrescription" type="checkbox" checked={form.requiresPrescription} onChange={handle} id="rx" />
                  <label htmlFor="rx" style={{ fontSize: '14px', fontWeight: 600 }}>Requires Prescription (Rx)</label>
                </div>

              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: 24 }}>
                <button onClick={save} style={{ flex: 1, padding: '13px', background: 'var(--primary)', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Save to DB</button>
                <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '13px', background: 'white', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}