import React, { useState } from 'react';
import { mockPharmacies } from '../../utils/mockData';
import { Phone, MapPin, Navigation } from 'lucide-react';

export default function NearbyPharmacy() {
  const [search, setSearch] = useState('');
  const filtered = mockPharmacies.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <h2>🗺️ Nearby Pharmacy</h2>
        <p>Find pharmacies and medicine availability near you</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input className="form-input" placeholder="🔍 Search pharmacy or medicine..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map(p => (
          <div key={p.id} className="pharmacy-item">
            <div className="pharmacy-icon">🏥</div>
            <div className="pharmacy-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                <div>
                  <div className="pharmacy-name">{p.name}</div>
                  <div className="pharmacy-address"><MapPin size={12} style={{ display: 'inline' }} /> {p.address} · 📍 {p.distance}</div>
                </div>
                <span className={`badge ${p.open ? 'badge-green' : 'badge-red'}`}>{p.open ? '🟢 Open' : '🔴 Closed'}</span>
              </div>
              <div className="pharmacy-medicines">
                {p.medicines.map((m, i) => <span key={i} className="badge badge-blue">{m}</span>)}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                <button className="btn btn-sm btn-primary"><Phone size={13} /> {p.phone}</button>
                <button className="btn btn-sm btn-outline"><Navigation size={13} /> Get Directions</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '24px', background: '#fffbeb', borderColor: '#fde68a' }}>
        <div className="card-title" style={{ marginBottom: '8px' }}>💡 Jan Aushadhi Tip</div>
        <p style={{ fontSize: '13px', color: '#78350f' }}>
          Jan Aushadhi stores offer generic medicines at up to <strong>90% lower prices</strong> than branded medicines. Always ask for generic alternatives!
        </p>
      </div>
    </div>
  );
}
