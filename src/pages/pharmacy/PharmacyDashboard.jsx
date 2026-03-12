import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockMedicines, mockPrescriptionRequests } from '../../utils/mockData';

export default function PharmacyDashboard() {
  const navigate = useNavigate();
  const lowStockCount = mockMedicines.filter(m => m.lowStock).length;
  const todayPrescriptions = mockPrescriptionRequests.length;

  return (
    <div>
      <div className="greeting-banner" style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' }}>
        <h2>Jan Aushadhi Kendra 🏥</h2>
        <p>Pharmacy Dashboard · Main Road, Rampur</p>
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>🟢 Open Now</span>
          <span className="badge" style={{ background: lowStockCount > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.2)', color: '#fff' }}>⚠️ {lowStockCount} Low Stock</span>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '24px' }}>
        {[
          { label: "Today's Prescriptions", value: todayPrescriptions, emoji: '📋', accent: '#6366f1' },
          { label: 'Total Medicines', value: mockMedicines.length, emoji: '💊', accent: '#22c55e' },
          { label: 'Low Stock Alerts', value: lowStockCount, emoji: '⚠️', accent: '#ef4444' },
          { label: 'Orders Fulfilled', value: 24, emoji: '✅', accent: '#10b981' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ '--card-accent': s.accent }}>
            <div className="stat-card-icon" style={{ background: `${s.accent}20` }}>{s.emoji}</div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {lowStockCount > 0 && (
        <div className="card" style={{ marginBottom: '20px', borderColor: '#fca5a5', background: '#fff7f7' }}>
          <div className="card-header">
            <div className="card-title" style={{ color: '#b91c1c' }}>🚨 Low Stock Alerts</div>
            <button className="btn btn-sm btn-danger" onClick={() => navigate('/pharmacy/medicine-inventory')}>View Inventory</button>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {mockMedicines.filter(m => m.lowStock).map(m => (
              <div key={m.id} style={{ padding: '8px 12px', background: '#fee2e2', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#b91c1c' }}>
                ⚠️ {m.name} — only {m.stock} left
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="card-title">📋 Today's Prescription Requests</div>
          <button className="btn btn-sm btn-outline" onClick={() => navigate('/pharmacy/prescription-requests')}>View All</button>
        </div>
        {mockPrescriptionRequests.map(p => (
          <div key={p.id} style={{ padding: '12px', borderRadius: '10px', background: '#f8fafc', marginBottom: '8px', border: `1px solid ${p.status === 'confirmed' ? '#bbf7d0' : '#e2e8f0'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{p.patient}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>by {p.doctor} · {p.date}</div>
              </div>
              <span className={`badge ${p.status === 'confirmed' ? 'badge-green' : 'badge-yellow'}`}>{p.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}</span>
            </div>
            <div style={{ marginTop: '6px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {p.medicines.map((m, i) => <span key={i} className="badge badge-blue">{m}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
