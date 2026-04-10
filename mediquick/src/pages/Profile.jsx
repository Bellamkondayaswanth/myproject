import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const [edit, setEdit] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: '', email: '', phone: '', address: '',
    pincode: '', dob: '', blood: '', role: ''
  });

  // LOAD from mq_user (correct key) when user changes
  useEffect(() => {
    if (user) {
      setProfile(prev => ({ ...prev, ...user }));
    } else {
      const savedUser = localStorage.getItem('mq_user');
      if (savedUser) setProfile(prev => ({ ...prev, ...JSON.parse(savedUser) }));
    }
  }, [user]);

  const handle = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const save = () => {
    // Save with CORRECT key mq_user
    localStorage.setItem('mq_user', JSON.stringify(profile));
    setEdit(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout(); // uses AuthContext logout (removes mq_token & mq_user)
    window.location.href = '/login';
  };

  const inputStyle = (editable) => ({
    width: '100%', padding: '11px 14px',
    border: `1px solid ${editable ? 'var(--primary)' : 'var(--border)'}`,
    borderRadius: '10px', fontSize: '14px',
    background: editable ? 'white' : 'var(--bg)',
    outline: 'none', fontFamily: 'DM Sans, sans-serif', color: 'var(--text)'
  });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '40px 2rem' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        <div style={{
          background: 'linear-gradient(135deg, #064d37, #0a6e4f)',
          borderRadius: '20px', padding: '32px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: '24px'
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '36px', fontWeight: 700, color: 'white',
            fontFamily: 'Fraunces, serif', flexShrink: 0
          }}>
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', color: 'white', fontSize: '1.8rem', marginBottom: 4 }}>
              {profile.name || 'User Name'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', marginBottom: 8 }}>
              {profile.email} • <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{profile.role}</span>
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}>
                📞 {profile.phone || 'Add Phone'}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}>
                🩸 Blood: {profile.blood || 'N/A'}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            marginLeft: 'auto', background: 'transparent',
            border: '1px solid white', color: 'white',
            padding: '5px 12px', borderRadius: '8px',
            cursor: 'pointer', fontSize: '12px'
          }}>Logout</button>
        </div>

        {saved && (
          <div style={{
            background: '#dcfce7', color: '#16a34a', padding: '12px 20px',
            borderRadius: '10px', marginBottom: 16, fontWeight: 600, fontSize: '14px'
          }}>✅ Profile saved successfully!</div>
        )}

        <div style={{
          background: 'white', borderRadius: '16px',
          border: '1px solid var(--border)', padding: '28px', marginBottom: 20
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem' }}>Personal Details</h2>
            <button onClick={() => edit ? save() : setEdit(true)} style={{
              padding: '8px 20px', borderRadius: '10px',
              background: edit ? 'var(--primary)' : 'white',
              color: edit ? 'white' : 'var(--primary)',
              border: '1px solid var(--primary)',
              fontWeight: 600, fontSize: '14px', cursor: 'pointer'
            }}>{edit ? 'Save Changes' : 'Edit Profile'}</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { label: 'Full Name', name: 'name', type: 'text' },
              { label: 'Email Address', name: 'email', type: 'email' },
              { label: 'Phone Number', name: 'phone', type: 'tel' },
              { label: 'Date of Birth', name: 'dob', type: 'date' },
              { label: 'Blood Group', name: 'blood', type: 'text' },
              { label: 'Address', name: 'address', type: 'text' },
              { label: 'Pincode', name: 'pincode', type: 'text' },
            ].map(f => (
              <div key={f.name}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
                <input
                  name={f.name} type={f.type}
                  value={profile[f.name] || ''} onChange={handle}
                  disabled={!edit} style={inputStyle(edit)}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { icon: '📦', label: 'Total Orders', value: '12' },
            { icon: '💊', label: 'Medicines Bought', value: '38' },
            { icon: '⭐', label: 'Reward Points', value: '240' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'white', borderRadius: '14px',
              border: '1px solid var(--border)', padding: '20px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '28px', marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '22px', color: 'var(--primary)', fontFamily: 'Fraunces, serif' }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}