import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockConsultations } from '../../utils/mockData';

export default function IncomingConsultations() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="page-header">
        <h2>📥 Incoming Cases</h2>
        <p>All consultation requests sorted by priority</p>
      </div>
      <div className="consultation-list">
        {mockConsultations.map(c => (
          <div key={c.id} className={`consultation-card priority-${c.priority}`}>
            <div className="consultation-avatar">{c.patientName.charAt(0)}</div>
            <div className="consultation-info" style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div className="consultation-name">{c.patientName}, {c.age}y</div>
                  <div className="consultation-meta">🏘️ {c.village} · {c.date}</div>
                </div>
                <span className={`badge ${c.priority === 'severe' ? 'badge-red' : c.priority === 'moderate' ? 'badge-yellow' : 'badge-green'}`}>
                  {c.priority === 'severe' ? '🔴' : c.priority === 'moderate' ? '🟡' : '🟢'} {c.priority}
                </span>
              </div>
              <div className="consultation-symptoms" style={{ marginTop: '6px' }}>🩺 {c.symptoms}</div>
              <div className="consultation-actions">
                <button className="btn btn-sm btn-primary" onClick={() => navigate('/doctor/diagnosis')}>✍️ Diagnose</button>
                <button className="btn btn-sm btn-ghost">📄 View History</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
