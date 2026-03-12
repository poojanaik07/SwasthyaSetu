import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useConsultations, CONSULTATION_STATUSES, getStatusConfig } from '../../context/ConsultationContext';
import { ArrowLeft } from 'lucide-react';

const SEVERITY_CONFIG = {
  mild:     { label: '🟢 Mild',     color: '#22c55e', bg: '#f0fdf4' },
  moderate: { label: '🟡 Moderate', color: '#eab308', bg: '#fefce8' },
  severe:   { label: '🔴 Severe',   color: '#ef4444', bg: '#fff7f7' },
};

const SYMPTOM_LABELS = {
  fever: '🌡️ Fever', cough: '😮‍💨 Cough', headache: '🤕 Headache',
  injury: '🩹 Injury', vomiting: '🤢 Vomiting', rash: '🔴 Skin Rash',
  breathing: '😮 Breathing', weakness: '😔 Weakness',
  chestpain: '💔 Chest Pain', diarrhea: '🤧 Diarrhea',
  bodyache: '🦴 Body Ache', stomach: '🫄 Stomach Pain',
};

// ── Visual pipeline tracker ──────────────────────────────────────────────────
function ProgressTracker({ status }) {
  const statusKeys = CONSULTATION_STATUSES.map(s => s.key);
  const currentIdx = statusKeys.indexOf(status);

  return (
    <div style={{ padding: '20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', marginBottom: '20px' }}>
      <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', marginBottom: '16px' }}>📍 Consultation Progress</div>
      {/* Horizontal on desktop, vertical on mobile */}
      <div style={{ display: 'flex', gap: '0', overflowX: 'auto', paddingBottom: '4px' }}>
        {CONSULTATION_STATUSES.map((s, i) => {
          const isDone    = i <= currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: i < CONSULTATION_STATUSES.length - 1 ? 1 : 'none' }}>
              {/* Step circle */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px' }}>
                <div style={{
                  width: isCurrent ? '40px' : '34px',
                  height: isCurrent ? '40px' : '34px',
                  borderRadius: '50%',
                  background: isDone ? (isCurrent ? s.color : '#22c55e') : '#f1f5f9',
                  border: `2px solid ${isDone ? (isCurrent ? s.color : '#22c55e') : '#e2e8f0'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: isCurrent ? '18px' : '14px',
                  transition: 'all 300ms',
                  boxShadow: isCurrent ? `0 0 0 4px ${s.color}30` : 'none',
                  flexShrink: 0,
                }}>
                  {isDone && !isCurrent ? '✓' : s.emoji}
                </div>
                <div style={{ fontSize: '9px', fontWeight: isCurrent ? 800 : 600, color: isDone ? (isCurrent ? s.color : '#15803d') : '#94a3b8', marginTop: '5px', textAlign: 'center', width: '60px', lineHeight: 1.2 }}>
                  {s.label}
                </div>
              </div>
              {/* Connector line */}
              {i < CONSULTATION_STATUSES.length - 1 && (
                <div style={{ flex: 1, height: '3px', background: i < currentIdx ? '#22c55e' : '#e2e8f0', minWidth: '16px', borderRadius: '2px', marginBottom: '18px', transition: 'background 400ms' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Timeline of status updates ───────────────────────────────────────────────
function UpdateTimeline({ updates }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px' }}>
      <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', marginBottom: '14px' }}>🕐 Activity Timeline</div>
      {updates.map((u, i) => {
        const cfg = getStatusConfig(u.status);
        return (
          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: i < updates.length - 1 ? '16px' : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: cfg.bg, border: `2px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                {cfg.emoji}
              </div>
              {i < updates.length - 1 && <div style={{ width: '2px', flex: 1, background: '#e2e8f0', margin: '4px 0', minHeight: '16px' }} />}
            </div>
            <div style={{ paddingTop: '6px', flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: cfg.color }}>{cfg.label}</div>
              <div style={{ fontSize: '13px', color: '#374151', marginTop: '2px', lineHeight: 1.4 }}>{u.note}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>🕐 {u.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Info card ────────────────────────────────────────────────────────────────
function InfoCard({ emoji, title, color, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' }}>
      <div style={{ padding: '10px 16px', background: `${color}10`, borderBottom: `2px solid ${color}`, display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span>{emoji}</span>
        <span style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>{title}</span>
      </div>
      <div style={{ padding: '14px 16px' }}>{children}</div>
    </div>
  );
}

export default function ConsultationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, cancelConsultation } = useConsultations();
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const c = getById(id);
  if (!c) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '4rem' }}>🔍</div>
        <div style={{ fontWeight: 800, fontSize: '18px', color: '#0f172a', marginTop: '12px' }}>Consultation not found</div>
        <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/patient/consultations')}>← Back to Consultations</button>
      </div>
    );
  }

  const statusCfg = getStatusConfig(c.status);
  const sevCfg    = SEVERITY_CONFIG[c.severity] || SEVERITY_CONFIG.mild;
  const canCancel = ['submitted', 'hw_reviewing'].includes(c.status);

  async function handleCancel() {
    if (!window.confirm('Are you sure you want to cancel this consultation request?')) return;
    setCancelling(true);
    await new Promise(r => setTimeout(r, 800));
    cancelConsultation(id);
    setCancelled(true);
    setCancelling(false);
  }

  if (cancelled) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '3rem' }}>🗑️</div>
        <div style={{ fontWeight: 800, fontSize: '18px', color: '#0f172a', marginTop: '12px' }}>Request Cancelled</div>
        <p style={{ color: '#64748b' }}>Your consultation request has been cancelled successfully.</p>
        <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/patient/consultations')}>Back to Consultations</button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/patient/consultations')} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>📋 Consultation #{c.id}</h2>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>Submitted: {c.submittedAt}</p>
        </div>
        <span style={{ padding: '6px 14px', borderRadius: '100px', background: statusCfg.bg, color: statusCfg.color, border: `1.5px solid ${statusCfg.border}`, fontWeight: 800, fontSize: '13px' }}>
          {statusCfg.emoji} {statusCfg.label}
        </span>
      </div>

      {/* Progress Tracker */}
      <ProgressTracker status={c.status} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        {/* Left column */}
        <div>
          {/* Symptoms */}
          <InfoCard emoji="🩺" title="Patient Symptoms" color="#6366f1">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {c.symptoms.map(s => (
                <span key={s} style={{ padding: '4px 12px', background: '#f0f4ff', color: '#4338ca', borderRadius: '100px', fontSize: '12px', fontWeight: 700, border: '1px solid #c7d2fe' }}>
                  {SYMPTOM_LABELS[s] || s}
                </span>
              ))}
            </div>
            {c.symptomsText && (
              <div style={{ fontSize: '13px', color: '#374151', fontStyle: 'italic', lineHeight: 1.5, padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                "{c.symptomsText}"
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 12px', background: sevCfg.bg, color: sevCfg.color, borderRadius: '100px', fontWeight: 800, fontSize: '12px' }}>
                Severity: {sevCfg.label}
              </span>
              {c.aiGuidance && (
                <span style={{ padding: '4px 12px', background: '#f0f4ff', color: '#4338ca', borderRadius: '100px', fontSize: '12px', fontWeight: 700 }}>
                  🤖 {c.aiGuidance.condition}
                </span>
              )}
            </div>
          </InfoCard>

          {/* Doctor info */}
          {c.assignedDoctor ? (
            <InfoCard emoji="👨‍⚕️" title="Assigned Doctor" color="#10b981">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>👨‍⚕️</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{c.assignedDoctor}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{c.doctorSpecialty || 'General Physician'}</div>
                  <span style={{ padding: '2px 8px', background: '#d1fae5', color: '#065f46', borderRadius: '100px', fontSize: '11px', fontWeight: 700, marginTop: '4px', display: 'inline-block' }}>🟢 Assigned</span>
                </div>
              </div>
            </InfoCard>
          ) : (
            <InfoCard emoji="⏳" title="Doctor Assignment" color="#eab308">
              <div style={{ textAlign: 'center', padding: '12px', color: '#a16207', fontSize: '14px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '6px' }}>⏳</div>
                <div style={{ fontWeight: 700 }}>Awaiting doctor assignment</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Usually within 20-30 minutes</div>
              </div>
            </InfoCard>
          )}

          {/* Doctor notes */}
          {c.doctorNotes && (
            <InfoCard emoji="📝" title="Doctor Notes" color="#0ea5e9">
              <div style={{ fontSize: '14px', color: '#0c4a6e', lineHeight: 1.6, padding: '8px 12px', background: '#f0f9ff', borderRadius: '10px', fontStyle: 'italic' }}>
                "{c.doctorNotes}"
              </div>
            </InfoCard>
          )}

          {/* Prescription */}
          {c.prescription && (
            <InfoCard emoji="💊" title="Prescription" color="#22c55e">
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#374151', marginBottom: '8px' }}>Diagnosis: {c.prescription.diagnosis}</div>
              {c.prescription.medicines.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', padding: '6px 10px', background: '#f0fdf4', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#065f46', marginBottom: '6px' }}>
                  <span>💊</span> {m}
                </div>
              ))}
              <button className="btn btn-sm btn-primary" style={{ marginTop: '8px', background: '#22c55e', boxShadow: '0 3px 10px #22c55e40' }} onClick={() => navigate('/patient/prescriptions')}>
                View Full Prescription →
              </button>
            </InfoCard>
          )}
        </div>

        {/* Right column: Timeline + cancel */}
        <div>
          <UpdateTimeline updates={c.updates} />

          {/* Cancel button for early stages */}
          {canCancel && (
            <div style={{ background: '#fff', border: '1.5px solid #fca5a5', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '10px', lineHeight: 1.5 }}>
                You can cancel this request while it is still being reviewed.
              </div>
              <button
                className="btn btn-sm"
                onClick={handleCancel}
                disabled={cancelling}
                style={{ background: '#fff', border: '2px solid #ef4444', color: '#b91c1c', fontWeight: 700, width: '100%' }}
              >
                {cancelling ? '⏳ Cancelling...' : '🗑️ Cancel Request'}
              </button>
            </div>
          )}

          {/* Help note */}
          <div style={{ marginTop: '12px', padding: '12px', background: '#f0f9ff', borderRadius: '12px', fontSize: '12px', color: '#0c4a6e', lineHeight: 1.5 }}>
            📞 Need help? Call the health helpline: <strong>1800-XXX-XXXX</strong> (toll free)
          </div>
        </div>
      </div>
    </div>
  );
}
