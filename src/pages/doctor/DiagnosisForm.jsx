import React, { useState } from 'react';
import { Plus, Trash2, Send } from 'lucide-react';

const COMMON_MEDICINES = ['Paracetamol 500mg', 'Amoxicillin 250mg', 'Azithromycin 500mg', 'ORS Sachet', 'Cetirizine 10mg', 'Omeprazole 20mg', 'Metformin 500mg', 'Levocetirizine 5mg'];
const FREQ = ['Once a day', 'Twice a day', 'Three times a day', 'Four times a day', 'Once at night', 'As needed'];
const DURATION = ['1 day', '3 days', '5 days', '7 days', '10 days', '14 days', '1 month'];

export default function DiagnosisForm() {
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', freq: '', duration: '', customDose: '' }]);
  const [followup, setFollowup] = useState('');
  const [sent, setSent] = useState(false);

  function addMedicine() { setMedicines(m => [...m, { name: '', dosage: '', freq: '', duration: '', customDose: '' }]); }
  function removeMedicine(i) { setMedicines(m => m.filter((_, idx) => idx !== i)); }
  function updateMed(i, k, v) { setMedicines(m => m.map((med, idx) => idx === i ? { ...med, [k]: v } : med)); }

  if (sent) return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <div style={{ fontSize: '5rem' }}>✅</div>
      <div className="empty-state-title">Prescription Sent!</div>
      <div className="empty-state-sub">Prescription delivered to patient and pharmacy.</div>
      <button className="btn btn-primary" onClick={() => setSent(false)}>Write Another</button>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h2>✍️ Diagnosis & Prescription</h2>
        <p>Ramesh Kumar · 42y · Rampur · Case #C001</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        <div>
          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-header"><div className="card-title">📋 Patient Summary</div></div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <span className="badge badge-red">🔴 Severe Priority</span>
              <span className="badge badge-blue">🏘️ Rampur</span>
              <span className="badge badge-gray">B+ blood</span>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px', fontSize: '13px' }}>
              <strong>Reported symptoms:</strong> Chest pain, difficulty breathing since 2 days. No prior medication. BP 145/95.
            </div>
          </div>

          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-header"><div className="card-title">🩺 Diagnosis</div></div>
            <div className="form-group">
              <label className="form-label">Primary Diagnosis <span>*</span></label>
              <input className="form-input" placeholder="e.g., Hypertensive Heart Disease" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Clinical Notes</label>
              <textarea className="form-textarea" placeholder="Detailed clinical observations..." value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
            </div>
            <div className="form-group">
              <label className="form-label">Follow-up</label>
              <select className="form-select" value={followup} onChange={e => setFollowup(e.target.value)}>
                <option value="">No follow-up needed</option>
                <option>After 3 days</option><option>After 1 week</option><option>After 2 weeks</option><option>After 1 month</option>
              </select>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-header">
              <div className="card-title">💊 Medicines</div>
              <button className="btn btn-sm btn-outline" onClick={addMedicine}><Plus size={14} /> Add Medicine</button>
            </div>
            {medicines.map((med, i) => (
              <div key={i} style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', marginBottom: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '13px' }}>Medicine {i + 1}</span>
                  {medicines.length > 1 && <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#b91c1c' }} onClick={() => removeMedicine(i)}><Trash2 size={12} /></button>}
                </div>
                <div className="form-row" style={{ marginBottom: '8px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Medicine</label>
                    <select className="form-select" value={med.name} onChange={e => updateMed(i, 'name', e.target.value)}>
                      <option value="">Select medicine</option>
                      {COMMON_MEDICINES.map(m => <option key={m}>{m}</option>)}
                      <option value="other">Other (type below)</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Dosage</label>
                    <input className="form-input" placeholder="e.g., 1 tablet / 5ml" value={med.dosage} onChange={e => updateMed(i, 'dosage', e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Frequency</label>
                    <select className="form-select" value={med.freq} onChange={e => updateMed(i, 'freq', e.target.value)}>
                      <option value="">Select</option>
                      {FREQ.map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Duration</label>
                    <select className="form-select" value={med.duration} onChange={e => updateMed(i, 'duration', e.target.value)}>
                      <option value="">Select</option>
                      {DURATION.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-success btn-lg btn-full" onClick={() => setSent(true)}>
            <Send size={20} /> Send Prescription to Patient & Pharmacy
          </button>
        </div>

        {/* Summary Preview */}
        <div>
          <div className="prescription-card">
            <div className="prescription-header">
              <div>
                <div style={{ fontWeight: 800 }}>Prescription Preview</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Dr. Priya Sharma · 12 Mar 2026</div>
              </div>
              <span>Rx</span>
            </div>
            <div className="prescription-body">
              {diagnosis && <div style={{ padding: '8px', background: '#f0fdf4', borderRadius: '8px', marginBottom: '10px', fontSize: '13px', fontWeight: 700 }}>Diagnosis: {diagnosis}</div>}
              {medicines.filter(m => m.name).map((m, i) => (
                <div key={i} className="medicine-item">
                  <div className="medicine-number">{i + 1}</div>
                  <div>
                    <div className="medicine-name">{m.name}</div>
                    <div className="medicine-dosage">{[m.dosage, m.freq, m.duration].filter(Boolean).join(' · ')}</div>
                  </div>
                </div>
              ))}
              {medicines.filter(m => m.name).length === 0 && <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '16px' }}>Add medicines above to see preview</div>}
              {followup && <div style={{ marginTop: '10px', padding: '8px', background: '#fef9c3', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#a16207' }}>⏰ Follow-up: {followup}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
