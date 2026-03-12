import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockConsultations } from '../../utils/mockData';

export default function ConsultationRequests() {
  const navigate = useNavigate();
  const pending = mockConsultations.filter(c => c.status === 'pending');

  return (
    <div>
      <div className="page-header">
        <h2>📋 Consultation Requests</h2>
        <p>Pending cases to send to doctor · {pending.length} pending</p>
      </div>
      <div className="consultation-list">
        {pending.map(c => (
          <div key={c.id} className={`consultation-card priority-${c.priority}`}>
            <div className="consultation-avatar">{c.patientName.charAt(0)}</div>
            <div className="consultation-info" style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div className="consultation-name">{c.patientName}, {c.age}y</div>
                <span className={`badge ${c.priority === 'severe' ? 'badge-red' : c.priority === 'moderate' ? 'badge-yellow' : 'badge-green'}`}>
                  {c.priority === 'severe' ? '🔴' : c.priority === 'moderate' ? '🟡' : '🟢'} {c.priority}
                </span>
              </div>
              <div className="consultation-meta">🏘️ {c.village} · {c.date}</div>
              <div className="consultation-symptoms">🩺 {c.symptoms}</div>
              <div className="consultation-actions">
                <button className="btn btn-sm btn-primary">📤 Send to Doctor</button>
                <button className="btn btn-sm btn-ghost">📝 Add Notes</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
