import React, { useState } from 'react';
import { Plus, Trash2, Send, Clock, AlertTriangle } from 'lucide-react';

// ── Data ─────────────────────────────────────────────────────────────────────
const COMMON_MEDICINES = [
  'Paracetamol 500mg','Amoxicillin 250mg','Azithromycin 500mg','ORS Sachet',
  'Cetirizine 10mg','Omeprazole 20mg','Metformin 500mg','Amlodipine 5mg',
  'Losartan 50mg','Salbutamol Inhaler','Ibuprofen 400mg','Levocetirizine 5mg',
];
const FREQ     = ['Once a day','Twice a day','Three times a day','Four times a day','Once at night','As needed'];
const DURATION = ['1 day','3 days','5 days','7 days','10 days','14 days','1 month'];

// ── Pharmacy availability mock ────────────────────────────────────────────────
const PHARMACY_MAP = {
  'Paracetamol 500mg':   [{ name:'Jan Aushadhi Kendra', dist:'0.8 km' },{ name:'Shree Medical Store', dist:'1.2 km' }],
  'Azithromycin 500mg':  [{ name:'Jan Aushadhi Kendra', dist:'0.8 km' },{ name:'Bharat Medical', dist:'2.0 km' }],
  'Amlodipine 5mg':      [{ name:'Jan Aushadhi Kendra', dist:'0.8 km' }],
  'Salbutamol Inhaler':  [{ name:'Bharat Medical', dist:'2.0 km' },{ name:'Rampur Medical', dist:'1.5 km' }],
  'ORS Sachet':          [{ name:'Jan Aushadhi Kendra', dist:'0.8 km' },{ name:'Shree Medical Store', dist:'1.2 km' }],
  'Ibuprofen 400mg':     [{ name:'Shree Medical Store', dist:'1.2 km' }],
};

// ── AI Clinical Suggestions ───────────────────────────────────────────────────
const AI_CONDITIONS = {
  fever:       { conditions:['Viral Fever','Dengue Fever','Malaria'],              tests:['Complete Blood Count (CBC)','Dengue NS1 Antigen','Malarial Antigen Test'], medicines:['Paracetamol 500mg','ORS Sachet','Cetirizine 10mg'] },
  respiratory: { conditions:['Respiratory Infection','Asthma','Pneumonia'],        tests:['Chest X-Ray','Sputum Culture','Spirometry'],                            medicines:['Azithromycin 500mg','Salbutamol Inhaler','Amoxicillin 250mg'] },
  bp:          { conditions:['Hypertension','Hypertensive Crisis','Renal Disease'], tests:['Blood Pressure Monitoring','Renal Function Test','ECG'],               medicines:['Amlodipine 5mg','Losartan 50mg','Atenolol 50mg'] },
  cardiac:     { conditions:['Angina','Hypertensive Heart Disease','Arrhythmia'],  tests:['ECG','2D Echo','Troponin Test'],                                        medicines:['Amlodipine 5mg','Nitroglycerin Spray','Metoprolol 25mg'] },
  skin:        { conditions:['Allergic Dermatitis','Bacterial Infection','Eczema'], tests:['Skin Patch Test','Fungal Scraping','Blood Allergy Panel'],             medicines:['Cetirizine 10mg','Hydrocortisone Cream','Fluconazole 150mg'] },
  default:     { conditions:['Possible Viral Infection','Inflammatory Condition'],  tests:['Complete Blood Count','CRP Test','Urine Routine'],                     medicines:['Paracetamol 500mg','ORS Sachet'] },
};

function getAISuggestion(symptoms = '', diagnosis = '') {
  const s = (symptoms + diagnosis).toLowerCase();
  if (s.includes('breath') || s.includes('chest') || s.includes('cough') || s.includes('respir')) return AI_CONDITIONS.respiratory;
  if (s.includes('blood pressure') || s.includes('hypertens') || s.includes('bp')) return AI_CONDITIONS.bp;
  if (s.includes('cardiac') || s.includes('heart') || s.includes('angina')) return AI_CONDITIONS.cardiac;
  if (s.includes('fever') || s.includes('temperature') || s.includes('dengue')) return AI_CONDITIONS.fever;
  if (s.includes('skin') || s.includes('rash') || s.includes('itch') || s.includes('allerg')) return AI_CONDITIONS.skin;
  return AI_CONDITIONS.default;
}

const REFERRAL_OPTIONS = [
  { id:'none',   label:'No Referral',            icon:'✅', color:'#22c55e' },
  { id:'phc',    label:'Primary Health Center',  icon:'🏥', color:'#6366f1' },
  { id:'district',label:'District Hospital',     icon:'🏨', color:'#f97316' },
  { id:'ambulance',label:'Emergency Ambulance (108)', icon:'🚑', color:'#ef4444' },
];

const FOLLOWUP_OPTIONS = [
  { value:'', label:'No follow-up' },
  { value:'3d', label:'After 3 days' },
  { value:'7d', label:'After 7 days' },
  { value:'14d', label:'After 14 days' },
  { value:'custom', label:'Custom date' },
];

const LAB_TEST_OPTIONS = ['Blood Test (CBC)', 'Chest X-Ray', 'Malaria Rapid Test', 'Dengue NS1', 'COVID Rapid Test', 'Urine Routine', 'ECG'];

const HW_TASK_OPTIONS = [
  'Monitor temperature daily',
  'Check oxygen levels twice daily',
  'Record vitals again after 48 hours',
  'Ensure patient takes medicine after meals',
  'Follow up physical visit in 3 days'
];

// Patient case context (in real app, passed via route state)
const CASE = {
  patient:'Ramesh Kumar', age:42, village:'Rampur', blood:'B+', caseNo:'C001',
  priority:'severe', symptoms:'Chest pain, difficulty breathing since 2 days. No prior medication. BP 145/95.',
  vitals:{ temp:'101.2°F', bp:'145/95', o2:'93%', pulse:'104' },
  timeline: [
    { date:'10 Mar, 09:30 AM', event:'Patient reported symptoms (Patient App)' },
    { date:'11 Mar, 11:15 AM', event:'Vitals recorded by Health Worker Kavita' },
    { date:'11 Mar, 11:20 AM', event:'Consultation request sent (Severe Priority)' },
    { date:'13 Mar, 02:15 PM', event:'Doctor reviewing case' },
  ]
};

// Safety Check Logic
function checkSafety(medicinesList) {
  const names = medicinesList.map(m => m.name);
  if (names.includes('Paracetamol 500mg') && names.includes('Ibuprofen 400mg')) {
    return 'Safety Alert: Paracetamol + Ibuprofen combination may increase dosage risk. Consider spacing out doses.';
  }
  if (names.includes('Amoxicillin 250mg') && names.includes('Azithromycin 500mg')) {
    return 'Safety Alert: Duplicate strong antibiotics detected. Usually only one is required.';
  }
  return null;
}

export default function DiagnosisForm() {
  const [diagnosis,    setDiagnosis]  = useState('');
  const [notes,        setNotes]      = useState('');
  const [medicines,    setMedicines]  = useState([{ name:'', dosage:'', freq:'', duration:'' }]);
  const [followup,     setFollowup]   = useState('');
  const [customDate,   setCustomDate] = useState('');
  const [referral,     setReferral]   = useState('none');
  const [adviceMsg,    setAdviceMsg]  = useState('');
  const [adviceRecip,  setAdviceRecip]= useState('patient');
  const [sent,         setSent]       = useState(false);
  const [showAI,       setShowAI]     = useState(true);
  const [showPharmacy, setShowPharmacy] = useState({});
  const [selectedTests, setSelectedTests] = useState([]);
  const [hwTasks,       setHwTasks]   = useState([]);
  const [safetyOverride, setSafetyOverride] = useState(false);

  const ai = getAISuggestion(CASE.symptoms, diagnosis);
  const safetyWarning = checkSafety(medicines);

  function addMedicine()          { setMedicines(m => [...m, { name:'', dosage:'', freq:'', duration:'' }]); }
  function removeMedicine(i)      { setMedicines(m => m.filter((_,idx) => idx !== i)); }
  function updateMed(i, k, v)    { setMedicines(m => m.map((med, idx) => idx === i ? { ...med, [k]: v } : med)); }
  function togglePharmacy(i)     { setShowPharmacy(p => ({ ...p, [i]: !p[i] })); }
  
  function toggleTest(t) {
    setSelectedTests(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }
  function toggleTask(t) {
    setHwTasks(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  if (sent) return (
    <div className="empty-state" style={{ minHeight:'60vh' }}>
      <div style={{ fontSize:'5rem' }}>✅</div>
      <div className="empty-state-title">Prescription Sent!</div>
      <div className="empty-state-sub">
        Prescription delivered to patient and pharmacy.
        {referral !== 'none' && <div style={{ color:'#ef4444', fontWeight:700, marginTop:'6px' }}>🚑 Referral: {REFERRAL_OPTIONS.find(r => r.id === referral)?.label}</div>}
        {followup && <div style={{ color:'#a16207', fontWeight:700 }}>📅 Follow-up: {FOLLOWUP_OPTIONS.find(f => f.value === followup)?.label || ''} {customDate}</div>}
        {hwTasks.length > 0 && <div style={{ color:'#0369a1', fontWeight:700, marginTop:'6px' }}>📋 Health Worker tasked with {hwTasks.length} follow-up action(s).</div>}
      </div>
      <button className="btn btn-primary" onClick={() => setSent(false)}>Write Another</button>
    </div>
  );

  const referralOpt = REFERRAL_OPTIONS.find(r => r.id === referral);
  const canSubmit = diagnosis && (!safetyWarning || safetyOverride);

  return (
    <div>
      <div className="page-header">
        <h2>✍️ Diagnosis &amp; Prescription</h2>
        <p>{CASE.patient} · {CASE.age}y · {CASE.village} · Case #{CASE.caseNo}</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 350px', gap:'24px' }}>
        {/* ── LEFT COLUMN ── */}
        <div>
          {/* Patient Summary & Timeline */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
            {/* Patient Summary */}
            <div className="card" style={{ height:'100%' }}>
              <div className="card-header"><div className="card-title">📋 Patient Summary</div></div>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'10px' }}>
                <span className="badge badge-red">🔴 Severe Priority</span>
                <span className="badge badge-blue">🏘️ {CASE.village}</span>
                <span className="badge badge-gray">🩸 {CASE.blood}</span>
              </div>
              <div style={{ background:'#f8fafc', borderRadius:'10px', padding:'12px', fontSize:'13px', marginBottom:'10px' }}>
                <strong>Reported symptoms:</strong> {CASE.symptoms}
              </div>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                {[{l:'🌡️ Temp', v:CASE.vitals.temp, warn: parseFloat(CASE.vitals.temp)>101 },
                  {l:'💗 BP',   v:CASE.vitals.bp,   warn: parseInt(CASE.vitals.bp)>140 },
                  {l:'O₂',     v:CASE.vitals.o2,    warn: parseInt(CASE.vitals.o2)<94 },
                  {l:'💓 Pulse',v:CASE.vitals.pulse+'bpm', warn: parseInt(CASE.vitals.pulse)>100 }
                ].map(({l,v,warn}) => (
                  <span key={l} style={{ fontSize:'12px', fontWeight:700, padding:'4px 10px', borderRadius:'8px', background:warn?'#fff7f7':'#f0fdf4', color:warn?'#b91c1c':'#15803d', border:`1px solid ${warn?'#fca5a590':'#86efac90'}` }}>
                    {l} {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Case Timeline */}
            <div className="card" style={{ height:'100%', border:'1.5px solid #e2e8f0', background:'#f8fafc' }}>
              <div className="card-header"><div className="card-title" style={{ display:'flex', alignItems:'center', gap:'6px' }}><Clock size={16} /> Case Timeline</div></div>
              <div style={{ paddingLeft:'10px' }}>
                {CASE.timeline.map((item, i) => (
                  <div key={i} style={{ position:'relative', paddingLeft:'16px', paddingBottom:'12px', borderLeft: i===CASE.timeline.length-1 ? 'none' : '2px solid #cbd5e1' }}>
                    <div style={{ position:'absolute', left:'-6px', top:'2px', width:'10px', height:'10px', borderRadius:'50%', background: i===CASE.timeline.length-1 ? '#6366f1' : '#94a3b8', border:'2px solid #fff' }} />
                    <div style={{ fontSize:'10px', fontWeight:800, color:'#64748b', marginBottom:'2px' }}>{item.date}</div>
                    <div style={{ fontSize:'12px', color: i===CASE.timeline.length-1 ? '#0f172a' : '#475569', fontWeight: i===CASE.timeline.length-1 ? 700 : 500 }}>{item.event}</div>
                  </div>
                ))}
                {/* Future state item */}
                <div style={{ position:'relative', paddingLeft:'16px' }}>
                   <div style={{ position:'absolute', left:'-6px', top:'2px', width:'10px', height:'10px', borderRadius:'50%', background:'#e2e8f0', border:'2px solid #fff' }} />
                   <div style={{ fontSize:'12px', color:'#94a3b8', fontStyle:'italic' }}>Prescription issued (Pending)</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── AI Clinical Assistant ── */}
          <div className="card" style={{ marginBottom:'16px', border:'1.5px solid #c7d2fe', background:'linear-gradient(135deg,#f0f4ff,#faf5ff)' }}>
            <div className="card-header">
              <div className="card-title">🤖 AI Clinical Assistant</div>
              <button className="btn btn-sm btn-ghost" onClick={() => setShowAI(a => !a)} style={{ fontSize:'11px' }}>
                {showAI ? 'Hide' : 'Show'} Suggestions
              </button>
            </div>
            {showAI && (
              <div>
                <div style={{ marginBottom:'10px', padding:'8px 12px', background:'#ede9fe', borderRadius:'8px', fontSize:'12px', color:'#4c1d95', fontWeight:600 }}>
                  ℹ️ These are AI suggestions only. The doctor makes the final clinical decision.
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px' }}>
                  {/* Conditions */}
                  <div>
                    <div style={{ fontWeight:800, fontSize:'12px', color:'#374151', marginBottom:'6px' }}>🔬 Possible Conditions</div>
                    {ai.conditions.map(c => (
                      <div key={c} style={{ display:'flex', gap:'6px', alignItems:'center', padding:'4px 0' }}>
                        <span style={{ width:6, height:6, borderRadius:'50%', background:'#6366f1', flexShrink:0 }} />
                        <span style={{ fontSize:'12px', color:'#374151' }}>{c}</span>
                      </div>
                    ))}
                  </div>
                  {/* Tests */}
                  <div>
                    <div style={{ fontWeight:800, fontSize:'12px', color:'#374151', marginBottom:'6px' }}>🧪 Suggested Tests</div>
                    {ai.tests.map(t => (
                      <div key={t} style={{ display:'flex', gap:'6px', alignItems:'center', padding:'4px 0' }}>
                        <span style={{ width:6, height:6, borderRadius:'50%', background:'#f97316', flexShrink:0 }} />
                        <span style={{ fontSize:'12px', color:'#374151' }}>{t}</span>
                      </div>
                    ))}
                  </div>
                  {/* Medicines hint */}
                  <div>
                    <div style={{ fontWeight:800, fontSize:'12px', color:'#374151', marginBottom:'6px' }}>💊 Suggested Medicines</div>
                    {ai.medicines.map(m => (
                      <button key={m} onClick={() => {
                        setMedicines(prev => {
                          const empty = prev.findIndex(med => !med.name);
                          if (empty >= 0) return prev.map((med, i) => i === empty ? { ...med, name: m } : med);
                          return [...prev, { name:m, dosage:'', freq:'', duration:'' }];
                        });
                      }}
                        style={{ display:'block', width:'100%', textAlign:'left', padding:'4px 8px', marginBottom:'4px', borderRadius:'6px', fontSize:'11px', fontWeight:700, cursor:'pointer', background:'#f0fdf4', color:'#15803d', border:'1px solid #86efac', fontFamily:'inherit' }}>
                        + {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Diagnosis & Required Tests ── */}
          <div className="card" style={{ marginBottom:'16px' }}>
            <div className="card-header"><div className="card-title">🩺 Diagnosis &amp; Tests</div></div>
            <div className="form-group">
              <label className="form-label">Primary Diagnosis *</label>
              <input className="form-input" placeholder="e.g., Hypertensive Heart Disease" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Clinical Notes</label>
              <textarea className="form-textarea" placeholder="Detailed clinical observations..." value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
            </div>

            {/* Lab Test Recommendation */}
            <div className="form-group" style={{ marginTop:'16px', paddingTop:'16px', borderTop:'1px solid #e2e8f0' }}>
              <label className="form-label">🧪 Recommended Lab Tests</label>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'8px' }}>
                {LAB_TEST_OPTIONS.map(t => (
                  <button key={t} type="button" onClick={() => toggleTest(t)}
                    style={{ padding:'6px 12px', borderRadius:'8px', fontSize:'11px', fontWeight:700, cursor:'pointer', border:'1px solid',
                      background: selectedTests.includes(t) ? '#eff6ff' : '#f8fafc',
                      color: selectedTests.includes(t) ? '#1d4ed8' : '#64748b',
                      borderColor: selectedTests.includes(t) ? '#93c5fd' : '#e2e8f0',
                    }}>
                    {selectedTests.includes(t) ? '✓ ' : '+ '}{t}
                  </button>
                ))}
              </div>
              {selectedTests.length > 0 && (
                <div style={{ fontSize:'12px', color:'#0369a1', background:'#f0f9ff', padding:'8px 12px', borderRadius:'8px', fontWeight:600 }}>
                  ℹ️ Notification: "Patient should visit nearest PHC for {selectedTests.length} recommended test(s)."
                </div>
              )}
            </div>

            {/* Follow-up scheduling */}
            <div className="form-group" style={{ marginTop:'16px', paddingTop:'16px', borderTop:'1px solid #e2e8f0' }}>
              <label className="form-label">📅 Follow-up Schedule</label>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                {FOLLOWUP_OPTIONS.map(f => (
                  <button key={f.value} type="button"
                    onClick={() => setFollowup(f.value)}
                    style={{ padding:'6px 14px', borderRadius:'10px', fontSize:'12px', fontWeight:700, cursor:'pointer', border:'1.5px solid', transition:'all 150ms', fontFamily:'inherit',
                      background: followup === f.value ? '#6366f1' : '#f1f5f9',
                      color: followup === f.value ? '#fff' : '#64748b',
                      borderColor: followup === f.value ? '#6366f1' : '#e2e8f0',
                    }}>
                    {f.label}
                  </button>
                ))}
              </div>
              {followup === 'custom' && (
                <input className="form-input" type="date" style={{ marginTop:'8px', maxWidth:'200px' }} value={customDate} onChange={e => setCustomDate(e.target.value)} />
              )}
            </div>
          </div>

          {/* ── Medicines with Pharmacy Check & Safety ── */}
          <div className="card" style={{ marginBottom:'16px' }}>
            <div className="card-header">
              <div className="card-title">💊 Medicines</div>
              <button className="btn btn-sm btn-outline" onClick={addMedicine}><Plus size={14} /> Add Medicine</button>
            </div>

            {/* Safety Alert Box */}
            {safetyWarning && (
              <div style={{ padding:'12px 14px', background:'#fef2f2', border:'1.5px solid #fecaca', borderRadius:'10px', marginBottom:'16px', display:'flex', gap:'12px', alignItems:'flex-start' }}>
                <AlertTriangle size={20} color="#dc2626" style={{ flexShrink:0 }} />
                <div>
                  <div style={{ fontWeight:800, color:'#991b1b', fontSize:'13px', marginBottom:'4px' }}>Prescription Safety Check Alert</div>
                  <div style={{ fontSize:'12px', color:'#b91c1c', marginBottom:'8px' }}>{safetyWarning}</div>
                  <label style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', fontWeight:700, color:'#7f1d1d', cursor:'pointer' }}>
                    <input type="checkbox" checked={safetyOverride} onChange={e => setSafetyOverride(e.target.checked)} style={{ cursor:'pointer' }} />
                    Override warning and proceed with this combination
                  </label>
                </div>
              </div>
            )}

            {medicines.map((med, i) => {
              const pharmacies = PHARMACY_MAP[med.name] || [];
              return (
                <div key={i} style={{ background:'#f8fafc', borderRadius:'10px', padding:'14px', marginBottom:'10px', border:'1px solid #e2e8f0' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                    <span style={{ fontWeight:700, fontSize:'13px' }}>Medicine {i+1}</span>
                    {medicines.length > 1 && <button className="btn btn-sm" style={{ background:'#fee2e2', color:'#b91c1c' }} onClick={() => removeMedicine(i)}><Trash2 size={12} /></button>}
                  </div>
                  <div className="form-row" style={{ marginBottom:'8px' }}>
                    <div className="form-group" style={{ margin:0 }}>
                      <label className="form-label">Medicine</label>
                      <select className="form-select" value={med.name} onChange={e => updateMed(i, 'name', e.target.value)}>
                        <option value="">Select medicine</option>
                        {COMMON_MEDICINES.map(m => <option key={m}>{m}</option>)}
                        <option value="other">Other (type below)</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ margin:0 }}>
                      <label className="form-label">Dosage</label>
                      <input className="form-input" placeholder="e.g., 1 tablet / 5ml" value={med.dosage} onChange={e => updateMed(i, 'dosage', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-row" style={{ marginBottom:'8px' }}>
                    <div className="form-group" style={{ margin:0 }}>
                      <label className="form-label">Frequency</label>
                      <select className="form-select" value={med.freq} onChange={e => updateMed(i, 'freq', e.target.value)}>
                        <option value="">Select</option>
                        {FREQ.map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ margin:0 }}>
                      <label className="form-label">Duration</label>
                      <select className="form-select" value={med.duration} onChange={e => updateMed(i, 'duration', e.target.value)}>
                        <option value="">Select</option>
                        {DURATION.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Pharmacy availability */}
                  {med.name && pharmacies.length > 0 && (
                    <div>
                      <button type="button" onClick={() => togglePharmacy(i)}
                        style={{ fontSize:'11px', fontWeight:700, color:'#f59e0b', background:'#fffbeb', border:'1px solid #fde68a', borderRadius:'8px', padding:'4px 10px', cursor:'pointer', fontFamily:'inherit' }}>
                        🏪 {showPharmacy[i] ? 'Hide' : 'Check'} Pharmacy Availability
                      </button>
                      {showPharmacy[i] && (
                        <div style={{ marginTop:'8px', padding:'10px 12px', background:'#fffbeb', border:'1.5px solid #fde68a', borderRadius:'8px' }}>
                          <div style={{ fontWeight:700, fontSize:'12px', color:'#92400e', marginBottom:'6px' }}>💊 {med.name} — Available At:</div>
                          {pharmacies.map(p => (
                            <div key={p.name} style={{ fontSize:'12px', color:'#6b7280', padding:'2px 0' }}>📍 {p.name} — {p.dist}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {med.name && pharmacies.length === 0 && (
                    <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'8px' }}>ℹ️ Pharmacy data not available for this medicine</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Doctor Advice & Health Worker Tasks ── */}
          <div className="card" style={{ marginBottom:'16px' }}>
            <div className="card-header"><div className="card-title">💬 Instructions &amp; HW Tasks</div></div>
            
            <div style={{ marginBottom:'16px' }}>
              <div style={{ display:'flex', gap:'8px', marginBottom:'10px' }}>
                {['patient','healthworker'].map(r => (
                  <button key={r} type="button" onClick={() => setAdviceRecip(r)}
                    className={`btn btn-sm ${adviceRecip === r ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize:'12px' }}>
                    {r === 'patient' ? '👤 Message Patient' : '🩺 Message Health Worker'}
                  </button>
                ))}
              </div>
              <textarea className="form-textarea"
                placeholder={adviceRecip === 'patient'
                  ? 'e.g., Rest and monitor fever every 6 hours. Drink plenty of fluids...'
                  : 'e.g., Check patient vitals daily. Alert if BP exceeds 150/95...'}
                value={adviceMsg} onChange={e => setAdviceMsg(e.target.value)} rows={2} />
            </div>

            <div style={{ paddingTop:'16px', borderTop:'1px solid #e2e8f0' }}>
              <div style={{ fontWeight:700, fontSize:'13px', color:'#374151', marginBottom:'8px' }}>📋 Automated Tasks for Health Worker</div>
              {HW_TASK_OPTIONS.map(t => (
                <label key={t} style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color:'#475569', marginBottom:'6px', cursor:'pointer' }}>
                  <input type="checkbox" checked={hwTasks.includes(t)} onChange={() => toggleTask(t)} style={{ cursor:'pointer' }} />
                  {t}
                </label>
              ))}
            </div>
          </div>

          {/* ── Emergency Referral ── */}
          <div className="card" style={{ marginBottom:'16px' }}>
            <div className="card-header"><div className="card-title">🚑 Emergency Referral</div></div>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              {REFERRAL_OPTIONS.map(r => (
                <button key={r.id} type="button" onClick={() => setReferral(r.id)}
                  style={{
                    flex:1, minWidth:'120px', padding:'12px', borderRadius:'12px', fontSize:'13px', fontWeight:800, cursor:'pointer', textAlign:'center',
                    border:`2px solid ${referral === r.id ? r.color : '#e2e8f0'}`,
                    background: referral === r.id ? `${r.color}15` : '#fff',
                    color: referral === r.id ? r.color : '#64748b',
                    fontFamily:'inherit', transition:'all 150ms',
                  }}>
                  <div style={{ fontSize:'20px', marginBottom:'4px' }}>{r.icon}</div>
                  {r.label}
                </button>
              ))}
            </div>
            {referral !== 'none' && (
              <div style={{ marginTop:'10px', padding:'10px 14px', background:`${referralOpt?.color}10`, border:`1.5px solid ${referralOpt?.color}40`, borderRadius:'10px', fontSize:'13px', fontWeight:700, color:referralOpt?.color }}>
                {referralOpt?.icon} Referral to {referralOpt?.label} will be attached to the prescription.
                {referral === 'ambulance' && <div style={{ fontSize:'12px', marginTop:'4px' }}>📞 Call 108 immediately for emergency transport.</div>}
              </div>
            )}
          </div>

          {/* Submit */}
          <button className="btn btn-success btn-lg btn-full" onClick={() => setSent(true)} disabled={!canSubmit}
            style={{ opacity: canSubmit ? 1 : 0.6 }}>
            <Send size={20} /> Send Prescription to Patient &amp; Pharmacy
            {!canSubmit && safetyWarning && <div style={{ fontSize:'10px', fontWeight:'normal', marginTop:'2px' }}>(Resolve safety warning first)</div>}
          </button>
        </div>

        {/* ── RIGHT: Prescription Preview ── */}
        <div>
          <div className="prescription-card" style={{ position:'sticky', top:'20px' }}>
            <div className="prescription-header">
              <div>
                <div style={{ fontWeight:800 }}>Prescription Preview</div>
                <div style={{ fontSize:'12px', opacity:0.8 }}>Dr. Priya Sharma · 13 Mar 2026</div>
              </div>
              <span>Rx</span>
            </div>
            <div className="prescription-body">
              {/* Patient chip */}
              <div style={{ padding:'8px 10px', background:'#eff6ff', borderRadius:'8px', marginBottom:'10px', fontSize:'12px', fontWeight:700, color:'#1d4ed8' }}>
                👤 {CASE.patient} · {CASE.age}y · {CASE.blood} · {CASE.village}
              </div>

              {diagnosis && (
                <div style={{ padding:'8px', background:'#f0fdf4', borderRadius:'8px', marginBottom:'10px', fontSize:'13px', fontWeight:700 }}>
                  Diagnosis: {diagnosis}
                </div>
              )}
              
              {selectedTests.length > 0 && (
                <div style={{ padding:'8px', border:'1px dashed #d946ef', background:'#fdf4ff', borderRadius:'8px', marginBottom:'10px', fontSize:'12px', color:'#a21caf', fontWeight:600 }}>
                  🧪 Tests: {selectedTests.join(', ')}
                </div>
              )}

              {medicines.filter(m => m.name).map((m, i) => (
                <div key={i} className="medicine-item">
                  <div className="medicine-number">{i+1}</div>
                  <div>
                    <div className="medicine-name">{m.name}</div>
                    <div className="medicine-dosage">{[m.dosage,m.freq,m.duration].filter(Boolean).join(' · ')}</div>
                  </div>
                </div>
              ))}

              {medicines.filter(m => m.name).length === 0 && (
                <div style={{ color:'#94a3b8', fontSize:'13px', textAlign:'center', padding:'16px' }}>Add medicines above to see preview</div>
              )}

              {followup && (
                <div style={{ marginTop:'10px', padding:'8px', background:'#fef9c3', borderRadius:'8px', fontSize:'12px', fontWeight:600, color:'#a16207' }}>
                  📅 Follow-up: {FOLLOWUP_OPTIONS.find(f => f.value === followup)?.label} {customDate && `· ${customDate}`}
                </div>
              )}
              
              {hwTasks.length > 0 && (
                <div style={{ marginTop:'8px', padding:'8px', background:'#f1f5f9', borderRadius:'8px', fontSize:'12px', color:'#475569', fontWeight:600 }}>
                  📋 HW Tasks: {hwTasks.length} assigned
                </div>
              )}

              {adviceMsg && (
                <div style={{ marginTop:'8px', padding:'8px', background:'#f0f9ff', borderRadius:'8px', fontSize:'12px', color:'#0369a1', fontWeight:600 }}>
                  💬 Advice ({adviceRecip}): {adviceMsg}
                </div>
              )}

              {referral !== 'none' && (
                <div style={{ marginTop:'8px', padding:'8px', background:`${referralOpt?.color}10`, borderRadius:'8px', fontSize:'12px', fontWeight:700, color:referralOpt?.color }}>
                  {referralOpt?.icon} Referral: {referralOpt?.label}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
