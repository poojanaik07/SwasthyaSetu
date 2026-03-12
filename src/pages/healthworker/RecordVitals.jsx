import React, { useState } from 'react';
import { saveOffline } from '../../utils/offlineStorage';
import OfflineSyncBanner from '../../components/OfflineSyncBanner';

const PATIENT_HISTORY = {
  'Ramesh Kumar': { lastVisit: 'March 11, 2026', diagnosis: 'Viral Fever', doctor: 'Dr. Priya Sharma', vitals: { temp: '99.2°F', bp: '130/85', pulse: '88 bpm', oxygen: '97%' }, symptoms: ['Fever','Headache','Body Ache'], prescriptions: ['Paracetamol 500mg', 'ORS Sachet'] },
  'Sunita Devi':  { lastVisit: 'March 12, 2026', diagnosis: 'Respiratory Infection', doctor: 'Dr. Arjun Mehta', vitals: { temp: '101.5°F', bp: '145/95', pulse: '102 bpm', oxygen: '94%' }, symptoms: ['Breathing Difficulty','Chest Pain'], prescriptions: ['Azithromycin 500mg'] },
  'Mohan Lal':    { lastVisit: 'March 10, 2026', diagnosis: 'Allergic Dermatitis', doctor: 'Dr. Kavitha Nair', vitals: { temp: '98.4°F', bp: '118/76', pulse: '74 bpm', oxygen: '98%' }, symptoms: ['Skin Rash'], prescriptions: ['Hydrocortisone Cream'] },
  'Geeta Bai':    { lastVisit: 'March 08, 2026', diagnosis: 'Hypertension', doctor: 'Dr. Priya Sharma', vitals: { temp: '98.6°F', bp: '148/92', pulse: '82 bpm', oxygen: '96%' }, symptoms: ['Headache','Weakness'], prescriptions: ['Amlodipine 5mg'] },
};

const SYMPTOM_OPTIONS = [
  { id:'fever',     emoji:'🌡️', label:'Fever' }, { id:'cough',      emoji:'😮‍💨', label:'Cough' },
  { id:'headache',  emoji:'🤕',  label:'Headache' }, { id:'chestpain', emoji:'💔', label:'Chest Pain' },
  { id:'weakness',  emoji:'😔',  label:'Weakness' }, { id:'breathing',  emoji:'😮', label:'Breathing Difficulty' },
  { id:'rash',      emoji:'🔴',  label:'Skin Rash' }, { id:'vomiting',  emoji:'🤢', label:'Vomiting' },
  { id:'bodyache',  emoji:'🦴',  label:'Body Ache' }, { id:'diarrhea',  emoji:'🤧', label:'Diarrhea' },
  { id:'injury',    emoji:'🩹',  label:'Injury' }, { id:'stomach',   emoji:'🫄', label:'Stomach Pain' },
];

function getVitalStatus(type, val) {
  const n = parseFloat(val);
  if (!val || isNaN(n)) return null;
  if (type === 'temp')   return n > 103 ? 'critical' : n > 101 ? 'high' : n > 99.5 ? 'warning' : 'normal';
  if (type === 'pulse')  return n > 110 || n < 50 ? 'critical' : n > 100 ? 'warning' : 'normal';
  if (type === 'oxygen') return n < 90  ? 'critical' : n < 94  ? 'high'  : n < 96   ? 'warning' : 'normal';
  return 'normal';
}
function getBPStatus(sys) {
  const s = parseInt(sys);
  if (isNaN(s)) return null;
  return s > 160 ? 'critical' : s > 140 ? 'high' : s > 130 ? 'warning' : 'normal';
}

const SC = {
  normal:   { color:'#22c55e', bg:'#f0fdf4', border:'#86efac', label:'✅ Normal' },
  warning:  { color:'#eab308', bg:'#fefce8', border:'#fde68a', label:'⚠️ Watch' },
  high:     { color:'#f97316', bg:'#fff7ed', border:'#fed7aa', label:'⚠️ High' },
  critical: { color:'#ef4444', bg:'#fff7f7', border:'#fca5a5', label:'🚨 Critical' },
};

const ALERT_MSGS = {
  temp:   { critical:'Extremely High Fever — Risk of febrile seizure.', high:'Fever Alert — Temperature above 101°F.', warning:'Mild Fever detected.' },
  oxygen: { critical:'Critical Low Oxygen — Immediate intervention needed.', high:'Low SpO₂ Alert — Below 94%.', warning:'SpO₂ slightly low. Monitor closely.' },
  pulse:  { critical:'Abnormal Heart Rate — Cardiac risk possible.', warning:'Elevated Pulse Rate — Above 100 bpm.' },
  bp:     { critical:'Hypertensive Crisis — BP dangerously high.', high:'Hypertension Risk — BP above 140/90.', warning:'Elevated Blood Pressure. Monitor.' },
};

export default function RecordVitals() {
  const [patient, setPatient] = useState('Ramesh Kumar');
  const [vitals, setVitals] = useState({ temp:'', bpSys:'', bpDia:'', pulse:'', oxygen:'', weight:'', notes:'' });
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomNotes, setSymptomNotes] = useState('');
  const [done, setDone] = useState(false);
  const set = (k, v) => setVitals(f => ({ ...f, [k]: v }));
  const toggleSymptom = id => setSelectedSymptoms(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  async function handleSubmit(e) {
    e.preventDefault();
    await saveOffline('record-vitals', { patient, ...vitals, symptoms: selectedSymptoms, symptomNotes });
    setDone(true);
  }

  const history = PATIENT_HISTORY[patient];
  const statuses = {
    temp: getVitalStatus('temp', vitals.temp),
    pulse: getVitalStatus('pulse', vitals.pulse),
    oxygen: getVitalStatus('oxygen', vitals.oxygen),
    bp: getBPStatus(vitals.bpSys),
  };
  const alerts = Object.entries(statuses)
    .filter(([, s]) => s && s !== 'normal')
    .map(([type, status]) => ({ type, status, msg: ALERT_MSGS[type]?.[status] || '' }));
  const overallRisk = alerts.some(a => a.status === 'critical') ? 'critical'
    : alerts.some(a => a.status === 'high') ? 'high'
    : alerts.length > 0 ? 'warning' : null;

  const vitalCards = [
    { id:'temp',   label:'Body Temperature', emoji:'🌡️', placeholder:'98.6', unit:'°F',  type:'temp',   hint:'Normal: 97–99°F' },
    { id:'oxygen', label:'SpO₂ Oxygen',      emoji:'💨', placeholder:'98',   unit:'%',   type:'oxygen', hint:'Normal: 95–100%' },
    { id:'pulse',  label:'Pulse Rate',        emoji:'❤️', placeholder:'72',   unit:'bpm', type:'pulse',  hint:'Normal: 60–100 bpm' },
    { id:'weight', label:'Weight',            emoji:'⚖️', placeholder:'65',   unit:'kg',  type:null,     hint:'' },
  ];

  if (done) return (
    <div className="empty-state" style={{ minHeight:'60vh' }}>
      <div style={{ fontSize:'5rem' }}>✅</div>
      <div className="empty-state-title">Vitals Recorded!</div>
      <div className="empty-state-sub">Saved for {patient}.{selectedSymptoms.length > 0 ? ` ${selectedSymptoms.length} symptoms attached.` : ''}</div>
      <button className="btn btn-primary" onClick={() => { setDone(false); setVitals({ temp:'',bpSys:'',bpDia:'',pulse:'',oxygen:'',weight:'',notes:'' }); setSelectedSymptoms([]); setSymptomNotes(''); }}>Record More</button>
    </div>
  );

  return (
    <div>
      <OfflineSyncBanner />
      <div className="page-header"><h2>📈 Record Vitals</h2><p>Enter patient vitals and symptoms. Alerts shown automatically.</p></div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 290px', gap:'20px' }}>
        <form onSubmit={handleSubmit}>
          {/* Patient selector */}
          <div className="card" style={{ marginBottom:'16px' }}>
            <div className="form-group" style={{ margin:0 }}>
              <label className="form-label">Patient Name <span>*</span></label>
              <select className="form-select" value={patient} onChange={e => setPatient(e.target.value)}>
                {['Ramesh Kumar','Sunita Devi','Mohan Lal','Geeta Bai'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Vital cards */}
          <div className="vitals-grid">
            {vitalCards.map(v => {
              const status = v.type ? statuses[v.type] : null;
              const cfg = status ? SC[status] : null;
              return (
                <div key={v.id} className={`vital-input-card ${vitals[v.id] ? 'focus' : ''}`} style={{ border: cfg ? `2px solid ${cfg.border}` : undefined }}>
                  <div className="vital-icon">{v.emoji}</div>
                  <div className="vital-label">{v.label}</div>
                  <div style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'8px' }}>
                    <input className="form-input" type="number" step="0.1" placeholder={v.placeholder} value={vitals[v.id]} onChange={e => set(v.id, e.target.value)} style={{ maxWidth:'100px', fontSize:'20px', fontWeight:800 }} />
                    <span style={{ fontWeight:700, color:'#64748b' }}>{v.unit}</span>
                  </div>
                  {cfg && <div style={{ padding:'4px 10px', background:cfg.bg, borderRadius:'8px', fontSize:'12px', fontWeight:800, color:cfg.color }}>{cfg.label}</div>}
                  <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'4px' }}>{v.hint}</div>
                </div>
              );
            })}
          </div>

          {/* BP */}
          <div className="card" style={{ marginTop:'16px', marginBottom:'16px' }}>
            <div className="card-header"><div className="card-title">💗 Blood Pressure</div></div>
            <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
              <div className="form-group" style={{ margin:0, flex:1 }}>
                <label className="form-label">Systolic (mmHg)</label>
                <input className="form-input" type="number" placeholder="120" value={vitals.bpSys} onChange={e => set('bpSys', e.target.value)} />
              </div>
              <span style={{ fontWeight:900, fontSize:'24px', marginTop:'20px' }}>/</span>
              <div className="form-group" style={{ margin:0, flex:1 }}>
                <label className="form-label">Diastolic (mmHg)</label>
                <input className="form-input" type="number" placeholder="80" value={vitals.bpDia} onChange={e => set('bpDia', e.target.value)} />
              </div>
              {statuses.bp && <div className={`vital-status ${statuses.bp === 'normal' ? 'normal':'critical'}`} style={{ marginTop:'24px' }}>{SC[statuses.bp]?.label}</div>}
            </div>
          </div>

          {/* Risk Alerts */}
          {alerts.length > 0 && overallRisk && (
            <div style={{ marginBottom:'16px', border:`2px solid ${SC[overallRisk].border}`, borderRadius:'16px', overflow:'hidden', background:SC[overallRisk].bg }}>
              <div style={{ padding:'12px 16px', background:`${SC[overallRisk].color}15`, borderBottom:`1px solid ${SC[overallRisk].border}`, display:'flex', gap:'12px', alignItems:'center' }}>
                <span style={{ fontSize:'22px' }}>{overallRisk === 'critical' ? '🚨' : '⚠️'}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:900, fontSize:'14px', color:'#0f172a' }}>⚕️ Health Alert Detected</div>
                  <div style={{ fontSize:'12px', color:'#64748b' }}>Abnormal vitals — see recommendations below</div>
                </div>
                <span style={{ padding:'4px 12px', borderRadius:'100px', background:SC[overallRisk].color, color:'#fff', fontSize:'12px', fontWeight:800 }}>
                  {overallRisk === 'critical' ? 'Critical' : overallRisk === 'high' ? 'High Risk' : 'Moderate'}
                </span>
              </div>
              <div style={{ padding:'14px 16px' }}>
                {alerts.map((a, i) => {
                  const cfg = SC[a.status];
                  const names = { temp:'Temperature', oxygen:'SpO₂ Oxygen', pulse:'Pulse Rate', bp:'Blood Pressure' };
                  return (
                    <div key={i} style={{ padding:'10px 14px', background:'#fff', borderRadius:'10px', border:`1px solid ${cfg.border}`, marginBottom: i < alerts.length-1 ? '10px' : 0 }}>
                      <div style={{ fontWeight:800, fontSize:'13px', color:cfg.color, marginBottom:'4px' }}>{cfg.label} — {names[a.type]}</div>
                      <div style={{ fontSize:'13px', color:'#374151' }}>{a.msg}</div>
                    </div>
                  );
                })}
                {overallRisk === 'critical' && (
                  <div style={{ marginTop:'10px', padding:'10px 14px', background:'#fee2e2', borderRadius:'10px', fontWeight:800, fontSize:'13px', color:'#b91c1c', textAlign:'center' }}>
                    🚨 Urgent doctor consultation recommended. Do not delay.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Symptom Entry */}
          <div className="card" style={{ marginBottom:'16px' }}>
            <div className="card-header">
              <div className="card-title">🩺 Symptoms (attach to consultation)</div>
              {selectedSymptoms.length > 0 && <span className="badge badge-purple">{selectedSymptoms.length} selected</span>}
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'12px' }}>
              {SYMPTOM_OPTIONS.map(s => (
                <button key={s.id} type="button" onClick={() => toggleSymptom(s.id)}
                  style={{ padding:'6px 12px', borderRadius:'100px', border:`2px solid ${selectedSymptoms.includes(s.id) ? '#6366f1':'#e2e8f0'}`, background:selectedSymptoms.includes(s.id) ? '#6366f1':'#fff', color:selectedSymptoms.includes(s.id) ? '#fff':'#374151', fontWeight:700, cursor:'pointer', fontSize:'12px', fontFamily:'inherit', transition:'all 200ms' }}>
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">Additional Clinical Notes</label>
              <textarea className="form-textarea" placeholder="Any additional observations..." value={symptomNotes} onChange={e => setSymptomNotes(e.target.value)} rows={2} />
            </div>
            {selectedSymptoms.length > 0 && (
              <div style={{ marginTop:'10px', padding:'8px 12px', background:'#f0f4ff', borderRadius:'10px', fontSize:'12px', color:'#4338ca', fontWeight:600 }}>
                📤 Symptoms will be attached to the doctor consultation request automatically.
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">General Notes</label>
            <textarea className="form-textarea" placeholder="Any general observations..." value={vitals.notes} onChange={e => set('notes', e.target.value)} rows={2} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-full">📤 Save Vitals & Send for Consultation</button>
        </form>

        {/* Patient History Sidebar */}
        <div>
          {history ? (
            <div className="card" style={{ marginBottom:'16px', border:'2px solid #c7d2fe' }}>
              <div className="card-header" style={{ background:'#f0f4ff' }}>
                <div className="card-title">📋 Patient History</div>
                <span className="badge badge-blue">Previous visit</span>
              </div>
              <div style={{ padding:'4px 0' }}>
                <div style={{ padding:'10px', background:'#f8fafc', borderRadius:'10px', marginBottom:'10px' }}>
                  <div style={{ fontSize:'11px', color:'#94a3b8', fontWeight:600 }}>LAST VISIT</div>
                  <div style={{ fontWeight:800, fontSize:'14px', color:'#0f172a', marginTop:'2px' }}>{history.lastVisit}</div>
                  <div style={{ fontSize:'13px', color:'#6366f1', fontWeight:700 }}>🩺 {history.diagnosis}</div>
                  <div style={{ fontSize:'12px', color:'#64748b' }}>by {history.doctor}</div>
                </div>
                <div style={{ marginBottom:'10px' }}>
                  <div style={{ fontSize:'11px', color:'#94a3b8', fontWeight:700, textTransform:'uppercase', marginBottom:'5px' }}>Last Vitals</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                    {[['🌡️',history.vitals.temp,'badge-blue'],['💗',history.vitals.bp,'badge-green'],['❤️',history.vitals.pulse,'badge-purple'],['O₂',history.vitals.oxygen,'badge-green']].map(([e,v,c],i) => (
                      <span key={i} className={`badge ${c}`}>{e} {v}</span>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom:'10px' }}>
                  <div style={{ fontSize:'11px', color:'#94a3b8', fontWeight:700, textTransform:'uppercase', marginBottom:'5px' }}>Previous Symptoms</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                    {history.symptoms.map(s => <span key={s} style={{ padding:'2px 8px', background:'#f0f4ff', color:'#4338ca', borderRadius:'100px', fontSize:'11px', fontWeight:700 }}>{s}</span>)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:'11px', color:'#94a3b8', fontWeight:700, textTransform:'uppercase', marginBottom:'5px' }}>Prescriptions</div>
                  {history.prescriptions.map((p, i) => (
                    <div key={i} style={{ fontSize:'12px', color:'#065f46', fontWeight:600, padding:'4px 8px', background:'#f0fdf4', borderRadius:'7px', marginBottom:'4px' }}>💊 {p}</div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign:'center', padding:'24px', color:'#94a3b8' }}>
              <div style={{ fontSize:'2.5rem' }}>📋</div>
              <div style={{ fontWeight:700 }}>No history found</div>
              <div style={{ fontSize:'12px' }}>First visit for this patient</div>
            </div>
          )}
          <div className="card" style={{ background:'#fff7f7', border:'1.5px solid #fca5a5' }}>
            <div style={{ fontWeight:800, fontSize:'13px', color:'#b91c1c', marginBottom:'10px' }}>🚨 Alert Thresholds</div>
            {[['Temperature','>101°F fever','>99.5°F watch'],['Oxygen','<94% critical','<96% watch'],['Pulse','>110 bpm alert','>100 bpm watch'],['Blood Pressure','>140/90 high','>130/85 watch']].map(([n,d,w],i) => (
              <div key={i} style={{ padding:'7px 10px', background:'#fff', borderRadius:'8px', fontSize:'12px', marginBottom:'6px' }}>
                <div style={{ fontWeight:700, color:'#0f172a' }}>{n}</div>
                <div style={{ color:'#b91c1c' }}>🔴 {d}</div>
                <div style={{ color:'#a16207' }}>🟡 {w}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
