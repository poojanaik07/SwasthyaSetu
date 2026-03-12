import React, { useState } from 'react';
import { saveOffline } from '../../utils/offlineStorage';
import OfflineSyncBanner from '../../components/OfflineSyncBanner';

function getVitalStatus(type, val) {
  const n = parseFloat(val);
  if (!val || isNaN(n)) return null;
  if (type === 'temp') return n > 103 ? 'critical' : n > 99.5 ? 'warning' : 'normal';
  if (type === 'pulse') return n > 110 || n < 50 ? 'critical' : n > 100 ? 'warning' : 'normal';
  if (type === 'oxygen') return n < 90 ? 'critical' : n < 95 ? 'warning' : 'normal';
  return 'normal';
}

export default function RecordVitals() {
  const [patient, setPatient] = useState('Ramesh Kumar');
  const [vitals, setVitals] = useState({ temp: '', bpSys: '', bpDia: '', pulse: '', oxygen: '', weight: '', notes: '' });
  const [done, setDone] = useState(false);
  const set = (k, v) => setVitals(f => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    await saveOffline('record-vitals', { patient, ...vitals });
    setDone(true);
  }

  const vitalCards = [
    { id: 'temp', label: 'Body Temperature', emoji: '🌡️', placeholder: '98.6', unit: '°F', type: 'temp', hint: 'Normal: 97–99°F' },
    { id: 'oxygen', label: 'SpO₂ Oxygen', emoji: '💨', placeholder: '98', unit: '%', type: 'oxygen', hint: 'Normal: 95–100%' },
    { id: 'pulse', label: 'Pulse Rate', emoji: '❤️', placeholder: '72', unit: 'bpm', type: 'pulse', hint: 'Normal: 60–100 bpm' },
    { id: 'weight', label: 'Weight', emoji: '⚖️', placeholder: '65', unit: 'kg', type: null, hint: '' },
  ];

  if (done) return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <div style={{ fontSize: '5rem' }}>✅</div>
      <div className="empty-state-title">Vitals Recorded!</div>
      <div className="empty-state-sub">Saved for {patient}. Will sync when online.</div>
      <button className="btn btn-primary" onClick={() => setDone(false)}>Record More</button>
    </div>
  );

  return (
    <div>
      <OfflineSyncBanner />
      <div className="page-header"><h2>📈 Record Vitals</h2><p>Enter patient vitals. Status shown automatically.</p></div>
      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label">Patient Name <span>*</span></label>
            <select className="form-select" value={patient} onChange={e => setPatient(e.target.value)}>
              {['Ramesh Kumar', 'Sunita Devi', 'Mohan Lal', 'Geeta Bai'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="vitals-grid">
          {vitalCards.map(v => {
            const status = v.type ? getVitalStatus(v.type, vitals[v.id]) : null;
            return (
              <div key={v.id} className={`vital-input-card ${vitals[v.id] ? 'focus' : ''}`}>
                <div className="vital-icon">{v.emoji}</div>
                <div className="vital-label">{v.label}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    className="form-input"
                    type="number"
                    step="0.1"
                    placeholder={v.placeholder}
                    value={vitals[v.id]}
                    onChange={e => set(v.id, e.target.value)}
                    style={{ maxWidth: '100px', fontSize: '20px', fontWeight: 800 }}
                  />
                  <span style={{ fontWeight: 700, color: '#64748b' }}>{v.unit}</span>
                </div>
                {status && <div className={`vital-status ${status}`}>{status === 'normal' ? '✅ Normal' : status === 'warning' ? '⚠️ Watch' : '🚨 Critical'}</div>}
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{v.hint}</div>
              </div>
            );
          })}
        </div>

        {/* Blood Pressure */}
        <div className="card" style={{ marginTop: '16px', marginBottom: '16px' }}>
          <div className="card-header"><div className="card-title">💗 Blood Pressure</div></div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="form-group" style={{ margin: 0, flex: 1 }}>
              <label className="form-label">Systolic (mmHg)</label>
              <input className="form-input" type="number" placeholder="120" value={vitals.bpSys} onChange={e => set('bpSys', e.target.value)} />
            </div>
            <span style={{ fontWeight: 900, fontSize: '24px', marginTop: '20px' }}>/</span>
            <div className="form-group" style={{ margin: 0, flex: 1 }}>
              <label className="form-label">Diastolic (mmHg)</label>
              <input className="form-input" type="number" placeholder="80" value={vitals.bpDia} onChange={e => set('bpDia', e.target.value)} />
            </div>
            {vitals.bpSys && (
              <div className={`vital-status ${parseInt(vitals.bpSys) > 140 ? 'critical' : parseInt(vitals.bpSys) > 130 ? 'warning' : 'normal'}`} style={{ marginTop: '24px', fontWeight: 800 }}>
                {parseInt(vitals.bpSys) > 140 ? '🚨 High' : parseInt(vitals.bpSys) > 130 ? '⚠️ Watch' : '✅ Normal'}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Additional Notes</label>
          <textarea className="form-textarea" placeholder="Any additional observations..." value={vitals.notes} onChange={e => set('notes', e.target.value)} rows={3} />
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-full">📤 Save & Send for Consultation</button>
      </form>
    </div>
  );
}
