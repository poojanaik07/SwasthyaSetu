import React, { useState } from 'react';
import { saveOffline } from '../../utils/offlineStorage';
import OfflineSyncBanner from '../../components/OfflineSyncBanner';
import VoiceInput from '../../components/VoiceInput';

export default function RegisterPatient() {
  const [form, setForm] = useState({ name: '', age: '', gender: '', village: '', phone: '', bloodGroup: '', abha: '' });
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    await saveOffline('register-patient', form);
    setDone(true);
  }

  if (done) return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <div style={{ fontSize: '5rem' }}>✅</div>
      <div className="empty-state-title">Patient Registered!</div>
      <div className="empty-state-sub">Data saved locally and will sync when online.<br />Patient ID: P{Math.floor(Math.random() * 900 + 100)}</div>
      <button className="btn btn-primary" onClick={() => { setDone(false); setForm({ name: '', age: '', gender: '', village: '', phone: '', bloodGroup: '', abha: '' }); }}>Register Another</button>
    </div>
  );

  return (
    <div>
      <OfflineSyncBanner />
      <div className="page-header"><h2>👤 Register New Patient</h2><p>Enter patient details. Works offline too.</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-header"><div className="card-title">Personal Information</div></div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name <span>*</span></label>
                <input className="form-input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g., Sunita Devi" />
              </div>
              <div className="form-group">
                <label className="form-label">Age <span>*</span></label>
                <input className="form-input" type="number" required value={form.age} onChange={e => set('age', e.target.value)} placeholder="e.g., 35" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Gender <span>*</span></label>
                <select className="form-select" required value={form.gender} onChange={e => set('gender', e.target.value)}>
                  <option value="">Select gender</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select className="form-select" value={form.bloodGroup} onChange={e => set('bloodGroup', e.target.value)}>
                  <option value="">Select</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Village <span>*</span></label>
                <input className="form-input" required value={form.village} onChange={e => set('village', e.target.value)} placeholder="Village name" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="10-digit number" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">ABHA Health ID (optional)</label>
              <input className="form-input" value={form.abha} onChange={e => set('abha', e.target.value)} placeholder="ABHA-XXXXXXXX" />
            </div>
          </div>

          <div className="card" style={{ marginTop: '16px' }}>
            <div className="card-header"><div className="card-title">🎤 Voice Notes</div></div>
            <VoiceInput onTranscript={t => set('notes', t)} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-full" style={{ marginTop: '16px' }}>
            💾 Save Patient Record
          </button>
        </form>

        <div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: '12px' }}>📋 Required Documents</div>
            {['Aadhaar Card / ID Proof', 'ABHA Health ID (if any)', 'Previous prescriptions', 'Vaccination records'].map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: '13px' }}>✅ {d}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
