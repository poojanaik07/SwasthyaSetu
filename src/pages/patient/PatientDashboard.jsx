import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useConsultations, buildNotifications, getStatusConfig } from '../../context/ConsultationContext';

const hour = new Date().getHours();
const greeting = hour < 12 ? 'Suprabhat' : hour < 17 ? 'Namaskar' : 'Shubh Sandhya';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { consultations } = useConsultations();
  const name = user?.name?.split(' ')[0] || 'Patient';

  const activeCount    = consultations.filter(c => c.status !== 'completed').length;
  const completedCount = consultations.filter(c => c.status === 'completed').length;
  const notifications  = buildNotifications(consultations);

  return (
    <div>
      {/* Greeting Banner */}
      <div className="greeting-banner">
        <h2>Namaste, {name} 🙏</h2>
        <p>How are you feeling today?</p>
        <div className="greeting-time">{greeting} · {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(4px)' }}>🏘️ {user?.village || 'Village'}</span>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(4px)' }}>🆔 ABHA-123456</span>
          <span className="badge" style={{ background: 'rgba(34,197,94,0.3)', color: '#bbf7d0', backdropFilter: 'blur(4px)' }}>🟢 Health: Good</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section-title">🚀 Quick Actions</div>
      <div className="action-cards" style={{ marginBottom: '32px' }}>
        <div className="action-card" onClick={() => navigate('/patient/report-symptoms')}>
          <div className="action-card-emoji">🤒</div>
          <div>
            <div className="action-card-label">Report Symptoms</div>
            <div className="action-card-sub">Describe how you feel</div>
          </div>
        </div>
        <div className="action-card" onClick={() => navigate('/patient/consultations')}>
          <div className="action-card-emoji">💬</div>
          <div>
            <div className="action-card-label">My Consultations</div>
            <div className="action-card-sub">{activeCount} active, {completedCount} completed</div>
          </div>
        </div>
        <div className="action-card" onClick={() => navigate('/patient/prescriptions')}>
          <div className="action-card-emoji">💊</div>
          <div>
            <div className="action-card-label">Prescriptions</div>
            <div className="action-card-sub">2 active prescriptions</div>
          </div>
        </div>
        <div className="action-card" onClick={() => navigate('/patient/nearby-pharmacy')}>
          <div className="action-card-emoji">🏥</div>
          <div>
            <div className="action-card-label">Nearby Pharmacy</div>
            <div className="action-card-sub">3 pharmacies found</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '24px' }}>
        {[
          { label: 'Total Consultations', value: String(consultations.length), emoji: '📋', accent: '#6366f1' },
          { label: 'Active Requests',     value: String(activeCount),          emoji: '⏳', accent: '#f59e0b' },
          { label: 'Active Prescriptions',value: '2',                          emoji: '💊', accent: '#22c55e' },
          { label: 'Days Medicine Left',  value: '3',                          emoji: '📅', accent: '#f97316' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ '--card-accent': s.accent }}>
            <div className="stat-card-icon" style={{ background: `${s.accent}20`, fontSize: '22px' }}>{s.emoji}</div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Latest Updates — Live from ConsultationContext */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">🔔 Latest Updates</div>
          <span className="badge badge-blue">{notifications.length} updates</span>
        </div>

        {notifications.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
            No updates yet. Submit a consultation to get started!
          </div>
        ) : (
          <div className="notification-list">
            {notifications.map((n, i) => {
              const cfg = getStatusConfig(n.status);
              return (
                <div
                  key={n.id}
                  className={`notification-item ${n.type === 'success' ? 'success' : n.type === 'info' ? 'info' : 'warning'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/patient/consultation-details/${n.consultationId}`)}
                >
                  <span style={{ fontSize: '20px' }}>{cfg.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div className="notification-msg">{n.text}</div>
                    <div className="notification-time">🕐 {n.time}</div>
                  </div>
                  <span style={{ padding: '2px 8px', borderRadius: '100px', background: cfg.bg, color: cfg.color, fontSize: '10px', fontWeight: 800, border: `1px solid ${cfg.border}`, whiteSpace: 'nowrap' }}>
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ padding: '10px 16px', borderTop: '1px solid #f1f5f9' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/patient/consultations')} style={{ width: '100%', fontSize: '12px' }}>
            View All Consultations →
          </button>
        </div>
      </div>
    </div>
  );
}
