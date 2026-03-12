import React from 'react';
import OfflineSyncBanner from '../../components/OfflineSyncBanner';
import { mockVitals, mockPatients } from '../../utils/mockData';

export default function HWDashboard() {
  return (
    <div>
      <OfflineSyncBanner />
      <div className="page-header">
        <h2>📊 Health Worker Dashboard</h2>
        <p>Welcome, Kavita ASW · Rampur Village</p>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '24px' }}>
        {[
          { label: 'Patients Registered', value: '142', emoji: '👥', accent: '#6366f1' },
          { label: 'Vitals Recorded Today', value: '8', emoji: '📈', accent: '#22c55e' },
          { label: 'Pending Consultations', value: '4', emoji: '⏳', accent: '#eab308' },
          { label: 'Sync Status', value: 'Online', emoji: '🌐', accent: '#10b981' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ '--card-accent': s.accent }}>
            <div className="stat-card-icon" style={{ background: `${s.accent}20` }}>{s.emoji}</div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <div className="card-header"><div className="card-title">📋 Recent Vitals Recorded</div></div>
          {mockVitals.map(v => (
            <div key={v.id} style={{ padding: '12px', borderRadius: '10px', background: '#f8fafc', marginBottom: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{v.patient}</div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{v.date}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-blue">🌡️ {v.temperature}</span>
                <span className={`badge ${parseInt(v.bp) > 140 ? 'badge-red' : 'badge-green'}`}>💗 {v.bp}</span>
                <span className="badge badge-purple">❤️ {v.pulse} bpm</span>
                <span className={`badge ${v.oxygen < 95 ? 'badge-red' : 'badge-green'}`}>O₂ {v.oxygen}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">👥 Recent Patients</div></div>
          {mockPatients.map(p => (
            <div key={p.id} style={{ display: 'flex', gap: '12px', padding: '10px', borderRadius: '10px', background: '#f8fafc', marginBottom: '8px', border: '1px solid #e2e8f0', alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '15px', flexShrink: 0 }}>
                {p.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{p.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>🏘️ {p.village} · {p.age}y · {p.bloodGroup}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{p.healthId}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
