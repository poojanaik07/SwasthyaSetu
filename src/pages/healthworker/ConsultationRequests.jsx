import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockConsultations } from '../../utils/mockData';

const PRIORITY_ORDER = { severe: 0, moderate: 1, mild: 2 };
const BORDER_COLOR    = { severe: '#ef4444', moderate: '#eab308', mild: '#22c55e' };
const BADGE_CLASS     = { severe: 'badge-red', moderate: 'badge-yellow', mild: 'badge-green' };
const BADGE_EMOJI     = { severe: '🔴', moderate: '🟡', mild: '🟢' };

const FILTER_OPTIONS = [
  { key: 'all',      label: '📋 All' },
  { key: 'severe',   label: '🔴 Severe' },
  { key: 'moderate', label: '🟡 Moderate' },
  { key: 'mild',     label: '🟢 Mild' },
];

// Pharmacy hints per symptom keyword
const PHARMACY_HINTS = [
  { keywords: ['fever','temperature','paracetamol'],          meds:['Paracetamol 500mg','ORS Sachets','Cetirizine 10mg'],         stores:[{name:'Jan Aushadhi Kendra',dist:'0.8 km'},{name:'Shree Medical',dist:'1.2 km'}] },
  { keywords: ['breathing','chest','respiratory','oxygen','spo2'],   meds:['Salbutamol Inhaler','Azithromycin 500mg','Amoxicillin'],      stores:[{name:'Jan Aushadhi Kendra',dist:'0.8 km'},{name:'Bharat Medical',dist:'2.0 km'}] },
  { keywords: ['blood pressure','hypertension','bp'],          meds:['Amlodipine 5mg','Losartan 50mg','Atenolol 50mg'],          stores:[{name:'Jan Aushadhi Kendra',dist:'0.8 km'}] },
  { keywords: ['fracture','injury','fall','pain'],             meds:['Ibuprofen 400mg','Diclofenac Gel','Betadine Solution'],     stores:[{name:'Shree Medical',dist:'1.2 km'},{name:'Rampur Medical',dist:'1.5 km'}] },
];

function getPharmacyHint(symptoms = '') {
  const s = symptoms.toLowerCase();
  return PHARMACY_HINTS.find(h => h.keywords.some(k => s.includes(k))) || null;
}

// Augment mockConsultations with estimated wait times
const ENRICHED = [
  ...mockConsultations.filter(c => c.status === 'pending'),
  {
    id: 99, patientName: 'Sunita Devi', age: 35, village: 'Bhagalpur', date: 'Today 11:00 AM',
    symptoms: 'Difficulty breathing, chest tightness', priority: 'severe',
    status: 'pending', hwNotes: 'SpO₂ 93% recorded. Escalated.', waitMins: 5,
  },
  {
    id: 98, patientName: 'Arjun Patel', age: 19, village: 'Rampur', date: 'Today 09:30 AM',
    symptoms: 'Injury — fall from tree, possible fracture', priority: 'moderate',
    status: 'pending', hwNotes: '', waitMins: 20,
  },
].sort((a, b) => (PRIORITY_ORDER[a.priority] || 2) - (PRIORITY_ORDER[b.priority] || 2));

export default function ConsultationRequests() {
  const navigate = useNavigate();
  const [filter,    setFilter]    = useState('all');
  const [sent,      setSent]      = useState({});
  const [notes,     setNotes]     = useState({});
  const [showNotes, setShowNotes] = useState({});
  const [showRx,    setShowRx]    = useState({});

  const filtered = filter === 'all' ? ENRICHED : ENRICHED.filter(c => c.priority === filter);
  const countBySeverity = (p) => ENRICHED.filter(c => c.priority === p).length;

  function handleSend(id) {
    setSent(prev => ({ ...prev, [id]: true }));
  }

  return (
    <div>
      <div className="page-header">
        <h2>📋 Consultation Requests</h2>
        <p>Pending cases sorted by severity · {ENRICHED.length} pending</p>
      </div>

      {/* Severity summary */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {['severe','moderate','mild'].map(p => (
          <div key={p} style={{ padding: '10px 16px', background: BORDER_COLOR[p] + '10', border: `1.5px solid ${BORDER_COLOR[p]}40`, borderRadius: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '18px' }}>{BADGE_EMOJI[p]}</span>
            <div>
              <div style={{ fontWeight: 900, fontSize: '20px', color: BORDER_COLOR[p] }}>{countBySeverity(p)}</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'capitalize' }}>{p}</div>
            </div>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', padding: '10px 16px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span>📋</span>
          <div>
            <div style={{ fontWeight: 900, fontSize: '20px', color: '#6366f1' }}>{ENRICHED.length}</div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Total Pending</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {FILTER_OPTIONS.map(f => (
          <button key={f.key} className={`btn btn-sm ${filter === f.key ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#94a3b8', alignSelf: 'center' }}>
          Auto-sorted: Severe → Moderate → Mild
        </span>
      </div>

      <div className="consultation-list">
        {filtered.map(c => (
          <div key={c.id}
            className="consultation-card"
            style={{ borderLeft: `4px solid ${BORDER_COLOR[c.priority] || '#94a3b8'}`, opacity: sent[c.id] ? 0.6 : 1 }}>
            {/* Avatar */}
            <div className="consultation-avatar" style={{ background: BORDER_COLOR[c.priority], color: '#fff', flexShrink: 0 }}>
              {c.patientName.charAt(0)}
            </div>

            <div className="consultation-info" style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div className="consultation-name">{c.patientName}, {c.age}y</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className={`badge ${BADGE_CLASS[c.priority]}`} style={{ fontWeight: 800, fontSize: '12px' }}>
                    {BADGE_EMOJI[c.priority]} {c.priority.charAt(0).toUpperCase() + c.priority.slice(1)}
                  </span>
                  {c.priority === 'severe' && (
                    <span className="badge badge-red" style={{ animation: 'pulse 1.5s infinite' }}>🚨 URGENT</span>
                  )}
                  {sent[c.id] && <span className="badge badge-green">✅ Sent to Doctor</span>}
                </div>
              </div>

              <div className="consultation-meta">🏘️ {c.village} · 🕐 {c.date}</div>
              <div className="consultation-symptoms" style={{ marginTop: '6px' }}>🩺 <em>{c.symptoms}</em></div>

              {/* HW notes preview */}
              {c.hwNotes && (
                <div style={{ marginTop: '6px', fontSize: '12px', color: '#6366f1', fontStyle: 'italic' }}>
                  📝 HW Note: {c.hwNotes}
                </div>
              )}

              {/* Add notes panel */}
              {showNotes[c.id] && (
                <div style={{ marginTop: '10px' }}>
                  <textarea
                    className="form-textarea"
                    placeholder="Add health worker notes for the doctor..."
                    value={notes[c.id] || ''}
                    onChange={e => setNotes(prev => ({ ...prev, [c.id]: e.target.value }))}
                    rows={2}
                    style={{ fontSize: '13px' }}
                  />
                </div>
              )}

              <div className="consultation-actions" style={{ marginTop: '10px' }}>
                {!sent[c.id] ? (
                  <>
                    <button className="btn btn-sm btn-primary" onClick={() => handleSend(c.id)}
                      style={{ background: c.priority === 'severe' ? '#ef4444' : undefined, boxShadow: c.priority === 'severe' ? '0 3px 10px #ef444440' : undefined }}>
                      📤 Send to Doctor
                    </button>
                    <button className="btn btn-sm btn-ghost" onClick={() => setShowNotes(prev => ({ ...prev, [c.id]: !prev[c.id] }))}>
                      📝 {showNotes[c.id] ? 'Hide Notes' : 'Add Notes'}
                    </button>
                    {getPharmacyHint(c.symptoms) && (
                      <button className="btn btn-sm btn-ghost" onClick={() => setShowRx(prev => ({ ...prev, [c.id]: !prev[c.id] }))} style={{ color: '#f59e0b', borderColor: '#fde68a' }}>
                        💊 {showRx[c.id] ? 'Hide Pharmacy' : 'Pharmacy Hint'}
                      </button>
                    )}
                  </>
                ) : (
                  <span style={{ fontSize: '13px', color: '#22c55e', fontWeight: 700 }}>✅ Request forwarded to doctor</span>
                )}
              </div>

              {/* Pharmacy availability panel */}
              {showRx[c.id] && (() => {
                const hint = getPharmacyHint(c.symptoms);
                return hint ? (
                  <div style={{ marginTop: '10px', padding: '12px 14px', background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '10px' }}>
                    <div style={{ fontWeight: 800, fontSize: '13px', color: '#92400e', marginBottom: '8px' }}>💊 Pharmacy Availability Hint</div>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '12px', color: '#374151', marginBottom: '4px' }}>Common Medicines</div>
                        {hint.meds.map(m => (
                          <div key={m} style={{ fontSize: '12px', color: '#6b7280', padding: '1px 0' }}>• {m}</div>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '12px', color: '#374151', marginBottom: '4px' }}>Available Nearby</div>
                        {hint.stores.map(s => (
                          <div key={s.name} style={{ fontSize: '12px', color: '#6b7280', padding: '1px 0' }}>📍 {s.name} — {s.dist}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        ))}
      </div>

      {/* Auto-sort explanation */}
      <div style={{ marginTop: '16px', padding: '10px 14px', background: '#f0f4ff', borderRadius: '10px', fontSize: '12px', color: '#4338ca', fontWeight: 600 }}>
        ℹ️ Cases are automatically sorted by severity. Severe cases appear at the top for immediate attention.
      </div>
    </div>
  );
}
