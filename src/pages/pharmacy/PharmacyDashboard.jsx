import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockMedicines, mockPrescriptionRequests } from '../../utils/mockData';
import { AlertCircle, TrendingUp, PackagePlus } from 'lucide-react';

export default function PharmacyDashboard() {
  const navigate = useNavigate();
  const lowStockCount = mockMedicines.filter(m => m.lowStock).length;
  const todayPrescriptions = mockPrescriptionRequests.length;

  // Calculate Expiry Alerts - mock logic for the demo relying on manually set mock dates
  const expiringSoon = mockMedicines.filter(m => {
    if (!m.expiry) return false;
    const [year, month] = m.expiry.split('-');
    // In our mockData, "2026-03" and "2026-04" represent expiring soon relative to March 2026
    return year === '2026' && (month === '03' || month === '04');
  });

  return (
    <div>
      <div className="greeting-banner" style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' }}>
        <h2>Jan Aushadhi Kendra 🏥</h2>
        <p>Pharmacy Dashboard · Main Road, Rampur</p>
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>🟢 Open Now</span>
          <span className="badge" style={{ background: lowStockCount > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.2)', color: '#fff' }}>⚠️ {lowStockCount} Low Stock</span>
          {expiringSoon.length > 0 && <span className="badge" style={{ background: 'rgba(245,158,11,0.3)', color: '#fff' }}>⏰ {expiringSoon.length} Expiring Soon</span>}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        
        {/* Alerts Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* EXPIRY ALERTS */}
          {expiringSoon.length > 0 && (
            <div className="card" style={{ borderColor: '#fcd34d', background: '#fffbeb' }}>
              <div className="card-header">
                <div className="card-title" style={{ color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={18} /> Medicine Expiry Alerts
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {expiringSoon.map(m => (
                  <div key={m.id} style={{ padding: '8px 12px', background: '#fef3c7', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#b45309' }}>
                    ⏰ {m.name} — expires {m.expiry}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LOW STOCK ALERTS */}
          {lowStockCount > 0 && (
            <div className="card" style={{ borderColor: '#fca5a5', background: '#fff7f7' }}>
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
        </div>

        {/* Analytics Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* MEDICINE DEMAND ANALYTICS */}
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={18} color="#6366f1" /> Medicine Demand Analytics
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Weekly Village Health Trends</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>Paracetamol demand increased 40%</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Indicates possible viral fever spread in nearby villages.</div>
              </div>
              <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #eab308' }}>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>ORS Sachet demand increased 25%</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Rising cases of dehydration reported.</div>
              </div>
            </div>
          </div>

          {/* AUTO STOCK RECOMMENDATION */}
          <div className="card" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <div className="card-header">
              <div className="card-title" style={{ color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PackagePlus size={18} /> Auto Stock Recommendations
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#166534', marginBottom: '12px' }}>Based on recent prescription trends, system recommends restocking:</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ padding: '10px 14px', background: '#fff', borderRadius: '8px', border: '1px solid #86efac', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontWeight: 700, color: '#15803d' }}>Paracetamol 500mg</div>
                <div className="badge badge-green">+200 units</div>
              </div>
              <div style={{ padding: '10px 14px', background: '#fff', borderRadius: '8px', border: '1px solid #86efac', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontWeight: 700, color: '#15803d' }}>ORS Sachet</div>
                <div className="badge badge-green">+100 units</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">📋 Today's Prescription Requests</div>
          <button className="btn btn-sm btn-outline" onClick={() => navigate('/pharmacy/prescription-requests')}>View All Workflow</button>
        </div>
        {mockPrescriptionRequests.map(p => (
          <div key={p.id} style={{ padding: '12px', borderRadius: '10px', background: '#f8fafc', marginBottom: '8px', border: `1px solid ${p.status === 'confirmed' ? '#bbf7d0' : '#e2e8f0'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {p.patient}
                  {p.priority === 'severe' && <span className="badge badge-red" style={{ fontSize: '10px', padding: '2px 6px' }}>URGENT</span>}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>by {p.doctor} · {p.date}</div>
              </div>
              <span className={`badge ${p.status === 'confirmed' ? 'badge-green' : p.status === 'ready' ? 'badge-blue' : 'badge-yellow'}`}>
                {p.status === 'confirmed' ? '✅ Confirmed' : p.status === 'ready' ? '📦 Ready for Pickup' : '⏳ Pending'}
              </span>
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
