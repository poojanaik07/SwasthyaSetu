import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsultations, getStatusConfig } from '../../context/ConsultationContext';

const PRIORITY_COLOR = {
  severe:   { badge: 'badge-red',    label: '🔴 Severe' },
  moderate: { badge: 'badge-yellow', label: '🟡 Moderate' },
  mild:     { badge: 'badge-green',  label: '🟢 Mild' },
};

const FILTER_OPTIONS = [
  { key: 'all',             label: '📋 All' },
  { key: 'submitted',       label: '📤 Submitted' },
  { key: 'hw_reviewing',    label: '⏳ Reviewing' },
  { key: 'doctor_assigned', label: '👨‍⚕️ Assigned' },
  { key: 'in_progress',     label: '🩺 In Progress' },
  { key: 'completed',       label: '✅ Completed' },
];

export default function MyConsultations() {
  const navigate = useNavigate();
  const { consultations } = useConsultations();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? consultations
    : consultations.filter(c => c.status === filter);

  return (
    <div>
      <div className="page-header">
        <h2>💬 My Consultations</h2>
        <p>Track all your doctor consultations and requests</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {FILTER_OPTIONS.map(f => (
          <button key={f.key} className={`btn btn-sm ${filter === f.key ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
        <span className="badge badge-blue" style={{ marginLeft: 'auto', alignSelf: 'center' }}>
          {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="empty-state">
          <div style={{ fontSize: '3rem' }}>📭</div>
          <div className="empty-state-title">No consultations found</div>
          <div className="empty-state-sub">No consultations match this filter.</div>
          <button className="btn btn-primary" onClick={() => navigate('/patient/report-symptoms')}>+ Report Symptoms</button>
        </div>
      )}

      {/* Consultation cards */}
      <div className="consultation-list">
        {filtered.map(c => {
          const statusCfg  = getStatusConfig(c.status);
          const priCfg     = PRIORITY_COLOR[c.severity] || PRIORITY_COLOR.mild;
          const isEarly    = ['submitted', 'hw_reviewing'].includes(c.status);

          return (
            <div key={c.id} className={`consultation-card priority-${c.severity}`} style={{ position: 'relative' }}>
              {/* Status pill */}
              <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                <span style={{ padding: '4px 10px', borderRadius: '100px', background: statusCfg.bg, color: statusCfg.color, border: `1.5px solid ${statusCfg.border}`, fontWeight: 800, fontSize: '11px', whiteSpace: 'nowrap' }}>
                  {statusCfg.emoji} {statusCfg.label}
                </span>
              </div>

              {/* Left avatar */}
              <div className="consultation-avatar" style={{ background: statusCfg.color, color: '#fff', flexShrink: 0 }}>
                {c.assignedDoctor ? c.assignedDoctor.charAt(4) : '?'}
              </div>

              {/* Main info */}
              <div className="consultation-info" style={{ flex: 1, paddingRight: '110px' }}>
                <div className="consultation-name">
                  {c.assignedDoctor || 'Awaiting assignment'}
                </div>
                <div className="consultation-meta" style={{ marginTop: '2px' }}>
                  {c.assignedDoctor ? 'General Physician' : 'Doctor not yet assigned'} · {c.submittedAt}
                </div>
                <div className="consultation-symptoms" style={{ marginTop: '6px' }}>
                  🩺 <em>{c.symptomsText}</em>
                </div>

                {/* Badges row */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <span className={`badge ${priCfg.badge}`}>{priCfg.label}</span>
                  <span className="badge badge-gray">🆔 #{c.id}</span>
                  {isEarly && <span className="badge badge-blue">🔄 Cancellable</span>}
                </div>

                {/* Mini progress pipeline */}
                <div style={{ marginTop: '12px', display: 'flex', gap: '3px', alignItems: 'center' }}>
                  {['submitted', 'hw_reviewing', 'doctor_assigned', 'in_progress', 'prescription', 'completed'].map((step, i) => {
                    const statusKeys = ['submitted', 'hw_reviewing', 'doctor_assigned', 'in_progress', 'prescription', 'completed'];
                    const currentIdx = statusKeys.indexOf(c.status);
                    const done = i <= currentIdx;
                    const cfg  = getStatusConfig(step);
                    return (
                      <React.Fragment key={step}>
                        <div title={cfg.label} style={{ width: done ? '20px' : '16px', height: done ? '20px' : '16px', borderRadius: '50%', background: done ? cfg.color : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', transition: 'all 300ms', flexShrink: 0 }}>
                          {done ? (i === currentIdx ? cfg.emoji : '✓') : ''}
                        </div>
                        {i < 5 && <div style={{ flex: 1, height: '2px', background: done && i < currentIdx ? cfg.color : '#e2e8f0', maxWidth: '20px' }} />}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Action buttons */}
                <div className="consultation-actions" style={{ marginTop: '12px' }}>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => navigate(`/patient/consultation-details/${c.id}`)}
                  >
                    📍 Track Request
                  </button>
                  {c.status === 'completed' && (
                    <button className="btn btn-sm btn-outline" onClick={() => navigate('/patient/prescriptions')}>💊 View Prescription</button>
                  )}
                  {isEarly && (
                    <button
                      className="btn btn-sm"
                      onClick={() => navigate(`/patient/consultation-details/${c.id}`)}
                      style={{ background: '#fff', border: '1.5px solid #ef4444', color: '#b91c1c', fontWeight: 700 }}
                    >
                      🗑️ Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
