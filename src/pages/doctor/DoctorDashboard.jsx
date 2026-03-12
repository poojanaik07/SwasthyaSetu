import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockConsultations } from '../../utils/mockData';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const pending = mockConsultations.filter(c => c.status === 'pending');
  const completed = mockConsultations.filter(c => c.status === 'completed');

  return (
    <div>
      <div className="greeting-banner" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}>
        <h2>Namaskar, {user?.name || 'Doctor'} 👨‍⚕️</h2>
        <p>General Physician · District Hospital, {user?.village || 'Hospital'}</p>
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>📥 {pending.length} new cases</span>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>✅ {completed.length} completed today</span>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '24px' }}>
        {[
          { label: 'Pending Cases', value: pending.length, emoji: '📥', accent: '#ef4444' },
          { label: 'Completed Today', value: completed.length, emoji: '✅', accent: '#22c55e' },
          { label: 'Total Patients', value: 42, emoji: '👥', accent: '#6366f1' },
          { label: 'Avg Response Time', value: '18m', emoji: '⚡', accent: '#f97316' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ '--card-accent': s.accent }}>
            <div className="stat-card-icon" style={{ background: `${s.accent}20` }}>{s.emoji}</div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="section-title">🚨 Priority Cases</div>
      <div className="consultation-list">
        {mockConsultations.sort((a, b) => {
          const order = { severe: 0, moderate: 1, mild: 2 };
          return order[a.priority] - order[b.priority];
        }).map(c => (
          <div key={c.id} className={`consultation-card priority-${c.priority}`}>
            <div className="consultation-avatar">{c.patientName.charAt(0)}</div>
            <div className="consultation-info" style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div className="consultation-name">{c.patientName}, {c.age}y</div>
                  <div className="consultation-meta">🏘️ {c.village} · {c.specialty} · {c.date}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className={`badge ${c.priority === 'severe' ? 'badge-red' : c.priority === 'moderate' ? 'badge-yellow' : 'badge-green'}`}>
                    {c.priority === 'severe' ? '🔴' : c.priority === 'moderate' ? '🟡' : '🟢'} {c.priority.toUpperCase()}
                  </span>
                  <span className={`badge ${c.status === 'pending' ? 'badge-yellow' : 'badge-green'}`}>{c.status}</span>
                </div>
              </div>
              <div className="consultation-symptoms" style={{ marginTop: '8px' }}>🩺 <em>{c.symptoms}</em></div>
              <div className="consultation-actions">
                <button className="btn btn-sm btn-primary" onClick={() => navigate('/doctor/diagnosis')}>✍️ Write Diagnosis</button>
                <button className="btn btn-sm btn-ghost" onClick={() => navigate('/doctor/incoming-consultations')}>📋 Case History</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
