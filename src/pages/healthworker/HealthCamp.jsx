import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOffline } from '../../utils/offlineStorage';

// ── Vital alert thresholds ────────────────────────────────────────────────────
function getVitalRisk(temp, bp, pulse) {
  const alerts = [];
  if (temp && parseFloat(temp) > 101)  alerts.push({ label:'🌡️ Fever', msg:`Temp ${temp}°F > 101°F`, sev:'high' });
  if (temp && parseFloat(temp) > 103)  alerts[alerts.length-1].sev = 'critical';
  if (bp   && parseInt(bp)   > 140)    alerts.push({ label:'❤️ BP High',   msg:`BP ${bp} mmHg > 140`, sev:'high' });
  if (pulse && parseInt(pulse) > 110)  alerts.push({ label:'💓 High Pulse', msg:`Pulse ${pulse} bpm > 110`, sev:'warning' });
  return alerts;
}

const PHARMACY_HINTS = {
  fever:       { meds:['Paracetamol 500mg','ORS Sachets','Cetirizine'], stores:[{ name:'Jan Aushadhi Kendra', dist:'0.8 km' },{ name:'Shree Medical Store', dist:'1.2 km' }] },
  respiratory: { meds:['Azithromycin 500mg','Salbutamol Inhaler','Amoxicillin 500mg'], stores:[{ name:'Jan Aushadhi Kendra', dist:'0.8 km' },{ name:'Bharat Medical', dist:'2.0 km' }] },
  bp:          { meds:['Amlodipine 5mg','Losartan 50mg','Atenolol 50mg'], stores:[{ name:'Jan Aushadhi Kendra', dist:'0.8 km' }] },
  injury:      { meds:['Ibuprofen 400mg','Diclofenac Gel','Betadine Solution'], stores:[{ name:'Shree Medical Store', dist:'1.2 km' }] },
};

const SYMPTOM_LIST = [
  { id:'fever',   emoji:'🌡️', label:'Fever',    pharmacy:'fever' },
  { id:'cough',   emoji:'😮‍💨', label:'Cough',    pharmacy:'respiratory' },
  { id:'bp',      emoji:'💓',  label:'High BP',  pharmacy:'bp' },
  { id:'headache',emoji:'🤕',  label:'Headache', pharmacy:'fever' },
  { id:'weak',    emoji:'😔',  label:'Weakness', pharmacy:'fever' },
  { id:'breath',  emoji:'😮',  label:'Breathing Difficulty', pharmacy:'respiratory' },
  { id:'injury',  emoji:'🩹',  label:'Injury',   pharmacy:'injury' },
  { id:'vomit',   emoji:'🤢',  label:'Vomiting', pharmacy:'fever' },
];

// Rapid vitals entry row
function CampRow({ idx, onSubmit }) {
  const [form, setForm] = useState({ name:'', age:'', temp:'', bp:'', pulse:'', symptoms:[] });
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleSym = id => setForm(f => ({ ...f, symptoms: f.symptoms.includes(id) ? f.symptoms.filter(x => x !== id) : [...f.symptoms, id] }));

  const alerts = getVitalRisk(form.temp, form.bp, form.pulse);
  const hasCritical = alerts.some(a => a.sev === 'critical' || a.sev === 'high');

  async function handleSend() {
    await saveOffline('health-camp', form);
    setSent(true);
    onSubmit(form);
  }

  if (sent) return (
    <div style={{ padding:'14px 16px', background:'#f0fdf4', border:'1.5px solid #86efac', borderRadius:'12px', display:'flex', gap:'10px', alignItems:'center' }}>
      <span style={{ fontSize:'24px' }}>✅</span>
      <div>
        <div style={{ fontWeight:800, fontSize:'14px', color:'#15803d' }}>{form.name || `Patient #${idx+1}`} — Recorded</div>
        <div style={{ fontSize:'12px', color:'#166534' }}>Vitals saved {hasCritical ? '· Flagged for doctor review' : ''}</div>
      </div>
      {hasCritical && <span className="badge badge-red" style={{ marginLeft:'auto' }}>⚠️ Flagged</span>}
    </div>
  );

  return (
    <div style={{ padding:'14px 16px', background:hasCritical ? '#fff7f7' : '#fff', border:`1.5px solid ${hasCritical ? '#fca5a5' : '#e2e8f0'}`, borderRadius:'12px', transition:'all 200ms' }}>
      <div style={{ fontWeight:800, fontSize:'13px', color:'#6366f1', marginBottom:'10px' }}>
        Patient #{idx+1} {hasCritical && <span className="badge badge-red" style={{ marginLeft:'6px' }}>⚠️ Alert</span>}
      </div>

      {/* Basic fields */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 80px 100px 100px 100px', gap:'8px', marginBottom:'10px' }}>
        <input className="form-input" placeholder="Patient name" value={form.name} onChange={e => set('name', e.target.value)} style={{ fontSize:'13px' }} />
        <input className="form-input" placeholder="Age" type="number" value={form.age} onChange={e => set('age', e.target.value)} style={{ fontSize:'13px' }} />
        <input className="form-input" placeholder="Temp °F" value={form.temp} onChange={e => set('temp', e.target.value)} style={{ fontSize:'13px', borderColor: form.temp && parseFloat(form.temp) > 101 ? '#ef4444' : undefined }} />
        <input className="form-input" placeholder="BP mmHg" value={form.bp} onChange={e => set('bp', e.target.value)} style={{ fontSize:'13px', borderColor: form.bp && parseInt(form.bp) > 140 ? '#ef4444' : undefined }} />
        <input className="form-input" placeholder="Pulse bpm" value={form.pulse} onChange={e => set('pulse', e.target.value)} style={{ fontSize:'13px' }} />
      </div>

      {/* Symptom chips */}
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:alerts.length > 0 ? '10px' : '0' }}>
        {SYMPTOM_LIST.map(s => (
          <button key={s.id} type="button" onClick={() => toggleSym(s.id)}
            style={{ padding:'4px 10px', borderRadius:'100px', fontSize:'12px', fontWeight:700, cursor:'pointer', border:'1.5px solid', transition:'all 150ms',
              background: form.symptoms.includes(s.id) ? '#6366f1' : '#f1f5f9',
              color: form.symptoms.includes(s.id) ? '#fff' : '#64748b',
              borderColor: form.symptoms.includes(s.id) ? '#6366f1' : '#e2e8f0',
            }}>
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {/* Auto alerts */}
      {alerts.length > 0 && (
        <div style={{ marginBottom:'10px', padding:'10px 12px', background:'#fff7f7', border:'1.5px solid #fca5a5', borderRadius:'10px', fontSize:'12px' }}>
          <div style={{ fontWeight:800, color:'#b91c1c', marginBottom:'4px' }}>⚠️ Abnormal vitals detected:</div>
          {alerts.map((a,i) => <div key={i} style={{ color:'#dc2626' }}>{a.label} — {a.msg}</div>)}
          <div style={{ marginTop:'6px', fontWeight:700, color:'#b91c1c' }}>Doctor consultation recommended for this patient.</div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display:'flex', gap:'8px' }}>
        <button className="btn btn-sm btn-primary" onClick={handleSend} disabled={!form.name}>
          💾 Save Record
        </button>
        {hasCritical && (
          <button className="btn btn-sm" onClick={handleSend}
            style={{ background:'#ef4444', color:'#fff', border:'none', padding:'6px 14px', borderRadius:'10px', fontSize:'12px', fontWeight:800, cursor:'pointer' }}>
            🚨 Send to Doctor
          </button>
        )}
      </div>
    </div>
  );
}

export default function HealthCamp() {
  const navigate = useNavigate();
  const [rows, setRows]         = useState([0]);
  const [submitted, setSubmitted] = useState([]);
  const [campName, setCampName]  = useState('Rampur Village Health Camp');
  const [campDate]               = useState('March 13, 2026');

  function addRow() { setRows(r => [...r, r.length]); }

  function handleSubmit(row) {
    setSubmitted(p => [...p, row]);
  }

  const flaggedCount = submitted.filter(r => {
    const a = getVitalRisk(r.temp, r.bp, r.pulse);
    return a.some(x => x.sev === 'critical' || x.sev === 'high');
  }).length;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h2>⛺ Health Camp Mode</h2>
        <p>Rapid multi-patient vitals entry for screening drives</p>
      </div>

      {/* Camp Info */}
      <div className="card" style={{ marginBottom:'20px', background:'linear-gradient(135deg,#f0f4ff,#ede9fe)', border:'2px solid #c7d2fe' }}>
        <div style={{ display:'flex', gap:'16px', alignItems:'center', flexWrap:'wrap' }}>
          <div style={{ fontSize:'40px' }}>⛺</div>
          <div style={{ flex:1 }}>
            <input
              value={campName}
              onChange={e => setCampName(e.target.value)}
              style={{ fontSize:'18px', fontWeight:900, color:'#1e1b4b', background:'transparent', border:'none', outline:'none', width:'100%', fontFamily:'inherit' }}
            />
            <div style={{ fontSize:'13px', color:'#6366f1', fontWeight:600 }}>📅 {campDate} · Health Worker: Kavita Devi ASW</div>
          </div>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
            <div style={{ textAlign:'center', padding:'8px 16px', background:'#fff', borderRadius:'10px', border:'1px solid #e2e8f0' }}>
              <div style={{ fontWeight:900, fontSize:'22px', color:'#6366f1' }}>{rows.length}</div>
              <div style={{ fontSize:'11px', color:'#64748b', fontWeight:600 }}>Patients</div>
            </div>
            <div style={{ textAlign:'center', padding:'8px 16px', background:'#fff', borderRadius:'10px', border:'1px solid #e2e8f0' }}>
              <div style={{ fontWeight:900, fontSize:'22px', color:'#22c55e' }}>{submitted.length}</div>
              <div style={{ fontSize:'11px', color:'#64748b', fontWeight:600 }}>Saved</div>
            </div>
            {flaggedCount > 0 && (
              <div style={{ textAlign:'center', padding:'8px 16px', background:'#fff7f7', borderRadius:'10px', border:'1.5px solid #fca5a5' }}>
                <div style={{ fontWeight:900, fontSize:'22px', color:'#ef4444' }}>{flaggedCount}</div>
                <div style={{ fontSize:'11px', color:'#b91c1c', fontWeight:600 }}>⚠️ Flagged</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div style={{ padding:'10px 14px', background:'#f0f4ff', border:'1px solid #c7d2fe', borderRadius:'10px', marginBottom:'16px', fontSize:'12px', color:'#3730a3', fontWeight:600 }}>
        ℹ️ Enter name, age, vitals and symptoms for each patient. Fields with red borders indicate abnormal values. Flagged patients are automatically recommended for doctor consultation.
      </div>

      {/* Camp entries */}
      <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'16px' }}>
        {rows.map((_, i) => <CampRow key={i} idx={i} onSubmit={handleSubmit} />)}
      </div>

      {/* Add more + End camp */}
      <div style={{ display:'flex', gap:'10px' }}>
        <button className="btn btn-primary" onClick={addRow}>
          + Add Patient
        </button>
        <button className="btn btn-ghost" onClick={() => navigate('/healthworker/dashboard')}>
          ✅ End Camp & Return to Dashboard
        </button>
        {submitted.length > 0 && (
          <div style={{ marginLeft:'auto', padding:'8px 14px', background:'#f0fdf4', border:'1px solid #86efac', borderRadius:'10px', fontSize:'12px', color:'#15803d', fontWeight:700 }}>
            ✅ {submitted.length} records saved offline · Will sync automatically
          </div>
        )}
      </div>

      {/* Pharmacy hint */}
      {submitted.length > 0 && (
        <div className="card" style={{ marginTop:'20px', border:'1.5px solid #fde68a', background:'#fffbeb' }}>
          <div className="card-header"><div className="card-title">💊 Nearby Pharmacy Availability</div></div>
          <div style={{ fontSize:'13px', color:'#92400e', marginBottom:'10px', fontWeight:600 }}>
            Common medicines for fever & general symptoms — available at nearby stores:
          </div>
          <div style={{ display:'flex', gap:'16px', flexWrap:'wrap' }}>
            <div>
              <div style={{ fontWeight:700, fontSize:'12px', color:'#374151', marginBottom:'4px' }}>💊 Medicines</div>
              {['Paracetamol 500mg', 'ORS Sachets', 'Cetirizine 10mg', 'Azithromycin 500mg'].map(m => (
                <div key={m} style={{ fontSize:'12px', color:'#6b7280', padding:'2px 0', display:'flex', gap:'6px' }}><span>•</span>{m}</div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:'12px', color:'#374151', marginBottom:'4px' }}>🏪 Available At</div>
              {[{name:'Jan Aushadhi Kendra', dist:'0.8 km'},{name:'Shree Medical Store', dist:'1.2 km'}].map(s => (
                <div key={s.name} style={{ fontSize:'12px', color:'#6b7280', padding:'2px 0', display:'flex', gap:'6px' }}><span>📍</span>{s.name} — {s.dist}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
