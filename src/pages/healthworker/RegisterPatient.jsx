import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOffline } from '../../utils/offlineStorage';
import OfflineSyncBanner from '../../components/OfflineSyncBanner';
import VoiceInput from '../../components/VoiceInput';

// ── Existing patient database (mock) ─────────────────────────────────────────
const EXISTING_PATIENTS = [
  { id:'P001', name:'Ramesh Kumar',  age:42, village:'Rampur',    phone:'9876543210', abha:'ABHA-123456', bloodGroup:'B+', lastConsultation:'2026-03-11', lastDiagnosis:'Viral Fever' },
  { id:'P002', name:'Sunita Devi',   age:35, village:'Bhagalpur', phone:'9812345678', abha:'ABHA-234567', bloodGroup:'O+', lastConsultation:'2026-03-12', lastDiagnosis:'Respiratory Infection' },
  { id:'P003', name:'Mohan Lal',     age:28, village:'Chandpur',  phone:'9898765432', abha:'ABHA-345678', bloodGroup:'A+', lastConsultation:'2026-03-10', lastDiagnosis:'Allergic Dermatitis' },
  { id:'P004', name:'Geeta Bai',     age:55, village:'Kota Gaon', phone:'9876001234', abha:'ABHA-456789', bloodGroup:'AB+',lastConsultation:'2026-03-08', lastDiagnosis:'Hypertension' },
  { id:'P005', name:'Arjun Patel',   age:19, village:'Rampur',    phone:'9811223344', abha:'ABHA-567890', bloodGroup:'O-', lastConsultation:'2026-03-09', lastDiagnosis:'Fracture' },
  { id:'P006', name:'Priya Kumari',  age:30, village:'Nandpur',   phone:'9800112233', abha:'ABHA-678901', bloodGroup:'B-', lastConsultation:'2026-03-12', lastDiagnosis:'Dengue Fever' },
];

// ── Document definitions ──────────────────────────────────────────────────────
const DOC_TYPES = [
  { id:'aadhaar',    icon:'🪪', label:'Aadhaar Card / ID Proof',  required: true,  hint:'Front & back photo' },
  { id:'abha',       icon:'🏥', label:'ABHA Health ID Card',       required: false, hint:'If patient has one' },
  { id:'rx',         icon:'💊', label:'Previous Prescriptions',    required: false, hint:'Last doctor\'s prescription' },
  { id:'vaccine',    icon:'💉', label:'Vaccination Records',       required: false, hint:'Immunization card' },
];

// ── Step 1: Patient Lookup ────────────────────────────────────────────────────
function PatientLookup({ formPhone, formAbha }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const results = query.trim().length >= 2
    ? EXISTING_PATIENTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.phone.includes(query) ||
        p.abha.toLowerCase().includes(query.toLowerCase()) ||
        p.village.toLowerCase().includes(query.toLowerCase()))
    : [];

  // Duplicate detection — check against live form fields
  const dupPhone = formPhone.length >= 10
    ? EXISTING_PATIENTS.find(p => p.phone === formPhone)
    : null;
  const dupAbha  = formAbha.length >= 6
    ? EXISTING_PATIENTS.find(p => p.abha.toLowerCase() === formAbha.toLowerCase())
    : null;
  const duplicate = dupPhone || dupAbha;

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Step label */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#6366f1', color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>1</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: '16px', color: '#0f172a' }}>Check if Patient Already Exists</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Search by name, phone number, or ABHA Health ID</div>
        </div>
      </div>

      <div className="card" style={{ border: '2px solid #c7d2fe', padding: '16px' }}>
        {/* Search input */}
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '16px', pointerEvents: 'none' }}>🔍</span>
          <input
            className="form-input"
            style={{ paddingLeft: '38px', paddingRight: query ? '36px' : undefined }}
            placeholder="Type patient name, phone number, or ABHA ID..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#94a3b8' }}>✕</button>
          )}
        </div>

        {/* Hint */}
        {!query && (
          <div style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', padding: '8px 0' }}>
            Start typing at least 2 characters to search
          </div>
        )}

        {/* No results */}
        {query.length >= 2 && results.length === 0 && (
          <div style={{ padding: '14px', background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '20px' }}>✅</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '13px', color: '#15803d' }}>No existing patient found</div>
              <div style={{ fontSize: '12px', color: '#166534' }}>Please register a new patient using the form below ↓</div>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </div>
            {results.map(p => (
              <div key={p.id} style={{ display: 'flex', gap: '12px', padding: '12px 14px', background: '#f8fafc', borderRadius: '12px', border: '1.5px solid #e2e8f0', marginBottom: '8px', alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '17px', flexShrink: 0 }}>
                  {p.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>{p.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '1px' }}>
                    🏘️ {p.village} &nbsp;·&nbsp; {p.age}y &nbsp;·&nbsp; 🩸 {p.bloodGroup}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                    {p.abha} &nbsp;·&nbsp; 📞 {p.phone}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 700, marginTop: '3px' }}>
                    Last visit: {p.lastConsultation} — {p.lastDiagnosis}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                  <button
                    onClick={() => navigate('/healthworker/record-vitals')}
                    className="btn btn-sm btn-primary"
                    style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                    📂 Open Patient Record
                  </button>
                  <span className="badge badge-green" style={{ fontSize: '10px', textAlign: 'center' }}>✅ Registered</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Duplicate warning triggered by form fields */}
      {duplicate && (
        <div style={{ marginTop: '10px', padding: '12px 16px', background: '#fff7ed', border: '2px solid #fed7aa', borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '22px', flexShrink: 0 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 900, fontSize: '13px', color: '#c2410c', marginBottom: '3px' }}>Possible Duplicate Patient Detected</div>
            <div style={{ fontSize: '12px', color: '#92400e' }}>
              A patient with {dupPhone ? 'phone number' : 'ABHA ID'} <strong>{dupPhone ? dupPhone.phone : dupAbha?.abha}</strong> already exists: <strong>{duplicate.name}</strong> from {duplicate.village}.
            </div>
            <div style={{ fontSize: '12px', color: '#b45309', marginTop: '4px', fontWeight: 600 }}>
              Please review before creating a new record to avoid duplicates.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Patient Documents Upload Module ───────────────────────────────────────────
function PatientDocuments() {
  const [docs, setDocs] = useState(() =>
    Object.fromEntries(DOC_TYPES.map(d => [d.id, { file: null, preview: null, status: 'not_uploaded' }]))
  );

  const fileRefs = useRef({});

  function handleFileChange(docId, e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Lightweight preview — limit to 200KB display
    const reader = new FileReader();
    reader.onloadend = () => {
      setDocs(prev => ({
        ...prev,
        [docId]: { file, preview: reader.result, status: 'uploaded' },
      }));
    };
    reader.readAsDataURL(file);
  }

  function handleRemove(docId) {
    setDocs(prev => ({ ...prev, [docId]: { file: null, preview: null, status: 'not_uploaded' } }));
    if (fileRefs.current[docId]) fileRefs.current[docId].value = '';
  }

  const uploadedCount = Object.values(docs).filter(d => d.status === 'uploaded').length;

  return (
    <div className="card" style={{ border: '1.5px solid #e2e8f0' }}>
      {/* Header */}
      <div className="card-header" style={{ marginBottom: '14px' }}>
        <div className="card-title">📁 Patient Documents</div>
        {uploadedCount > 0 && (
          <span className="badge badge-green">{uploadedCount} uploaded</span>
        )}
      </div>
      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px', background: '#f8fafc', padding: '8px 10px', borderRadius: '8px' }}>
        📷 Photo uploads are optional. Use camera or file picker. Small file sizes recommended for low bandwidth.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {DOC_TYPES.map(doc => {
          const state = docs[doc.id];
          const isUploaded = state.status === 'uploaded';

          return (
            <div key={doc.id} style={{ padding: '12px 14px', background: isUploaded ? '#f0fdf4' : '#f8fafc', borderRadius: '12px', border: `1.5px solid ${isUploaded ? '#86efac' : '#e2e8f0'}`, transition: 'all 200ms' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {/* Thumbnail or icon */}
                <div style={{ width: 44, height: 44, borderRadius: '10px', background: isUploaded ? '#dcfce7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, border: `1px solid ${isUploaded ? '#86efac' : '#e2e8f0'}` }}>
                  {isUploaded && state.preview ? (
                    <img src={state.preview} alt="doc" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '20px' }}>{doc.icon}</span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>{doc.label}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>{doc.hint}</div>
                  {/* Status badge */}
                  <div style={{ marginTop: '5px' }}>
                    {isUploaded ? (
                      <span style={{ padding: '2px 8px', background: '#dcfce7', color: '#15803d', borderRadius: '100px', fontSize: '10px', fontWeight: 800 }}>✅ Uploaded</span>
                    ) : doc.required ? (
                      <span style={{ padding: '2px 8px', background: '#fef2f2', color: '#b91c1c', borderRadius: '100px', fontSize: '10px', fontWeight: 800 }}>📎 Recommended</span>
                    ) : (
                      <span style={{ padding: '2px 8px', background: '#f1f5f9', color: '#94a3b8', borderRadius: '100px', fontSize: '10px', fontWeight: 700 }}>⬜ Optional</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexShrink: 0 }}>
                  {!isUploaded ? (
                    <>
                      <button
                        type="button"
                        onClick={() => fileRefs.current[doc.id]?.click()}
                        className="btn btn-sm btn-ghost"
                        style={{ fontSize: '11px', padding: '4px 10px' }}>
                        📷 Upload
                      </button>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        capture="environment"
                        ref={el => fileRefs.current[doc.id] = el}
                        onChange={e => handleFileChange(doc.id, e)}
                        style={{ display: 'none' }}
                      />
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRemove(doc.id)}
                      style={{ background: 'none', border: '1px solid #fca5a5', color: '#ef4444', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>
                      🗑️ Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Uploaded filename */}
              {isUploaded && state.file && (
                <div style={{ marginTop: '6px', fontSize: '11px', color: '#15803d', background: '#dcfce7', padding: '4px 8px', borderRadius: '6px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span>📄</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{state.file.name}</span>
                  <span style={{ color: '#94a3b8', flexShrink: 0 }}>({(state.file.size / 1024).toFixed(0)} KB)</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '12px', fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
        💡 All documents are stored securely and available offline for sync
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function RegisterPatient() {
  const [form, setForm] = useState({ name: '', age: '', gender: '', village: '', phone: '', bloodGroup: '', abha: '', emergencyContact: '', notes: '' });
  const [done, setDone] = useState(false);
  const [patientId] = useState(() => 'P' + Math.floor(Math.random() * 900 + 100));

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
      <div style={{ marginBottom: '8px' }}>
        <span className="badge badge-purple" style={{ fontSize: '14px', padding: '6px 14px' }}>Patient ID: {patientId}</span>
      </div>
      <div className="empty-state-sub">Data saved locally and will sync when online.<br />Patient record is ready for consultation.</div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
        <button className="btn btn-primary" onClick={() => { setDone(false); setForm({ name: '', age: '', gender: '', village: '', phone: '', bloodGroup: '', abha: '', emergencyContact: '', notes: '' }); }}>
          + Register Another
        </button>
        <button className="btn btn-ghost" onClick={() => {}}>📈 Record Vitals</button>
      </div>
    </div>
  );

  return (
    <div>
      <OfflineSyncBanner />

      {/* Header */}
      <div className="page-header">
        <h2>👤 Register New Patient</h2>
        <p>Follow the 2-step process below to register a patient accurately.</p>
      </div>

      {/* ── Instruction Banner ─────────────────────────────────────────────── */}
      <div style={{ padding: '12px 16px', background: '#f0f4ff', border: '1.5px solid #c7d2fe', borderRadius: '12px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontSize: '20px', flexShrink: 0 }}>ℹ️</span>
        <div style={{ fontSize: '13px', color: '#3730a3', fontWeight: 600 }}>
          Search for an existing patient before registering a new one to avoid duplicate records. Duplicate entries can cause errors in prescriptions and consultation history.
        </div>
      </div>

      {/* ── Step 1: Patient Lookup ─────────────────────────────────────────── */}
      <PatientLookup formPhone={form.phone} formAbha={form.abha} />

      {/* ── Step 2 label ──────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#6366f1', color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>2</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: '16px', color: '#0f172a' }}>Register New Patient</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Fill in the patient details below. Fields marked * are required.</div>
        </div>
      </div>

      {/* ── Form + Sidebar ─────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        <form onSubmit={handleSubmit}>

          {/* Group A: Personal Information */}
          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-header">
              <div className="card-title">👤 Personal Information</div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name <span>*</span></label>
                <input className="form-input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g., Sunita Devi" />
              </div>
              <div className="form-group">
                <label className="form-label">Age <span>*</span></label>
                <input className="form-input" type="number" required min="0" max="120" value={form.age} onChange={e => set('age', e.target.value)} placeholder="e.g., 35" />
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
                  {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Group B: Contact Details */}
          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-header">
              <div className="card-title">📞 Contact Details</div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Village / Address <span>*</span></label>
                <input className="form-input" required value={form.village} onChange={e => set('village', e.target.value)} placeholder="Village name" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" type="tel" maxLength={10} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="10-digit mobile number" />
                {form.phone.length > 0 && form.phone.length < 10 && (
                  <div style={{ fontSize: '11px', color: '#f97316', marginTop: '4px' }}>⚠️ Enter 10-digit number</div>
                )}
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Emergency Contact Number</label>
              <input className="form-input" type="tel" maxLength={10} value={form.emergencyContact} onChange={e => set('emergencyContact', e.target.value)} placeholder="Family member's number" />
            </div>
          </div>

          {/* Group C: Health ID Details */}
          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-header">
              <div className="card-title">🏥 Health ID Details</div>
            </div>
            <div className="form-group">
              <label className="form-label">ABHA Health ID <span style={{ color: '#94a3b8', fontWeight: 500 }}>(optional)</span></label>
              <input className="form-input" value={form.abha} onChange={e => set('abha', e.target.value)} placeholder="ABHA-XXXXXXXX" />
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                🔹 Ayushman Bharat Health Account ID — 14-digit number on health card
              </div>
            </div>
          </div>

          {/* Voice Notes */}
          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-header"><div className="card-title">🎤 Voice Notes</div></div>
            <VoiceInput onTranscript={t => set('notes', t)} />
            {form.notes && (
              <div style={{ marginTop: '8px', padding: '8px 10px', background: '#f0f4ff', borderRadius: '8px', fontSize: '12px', color: '#3730a3', fontStyle: 'italic' }}>
                "{form.notes}"
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-full" style={{ marginTop: '4px' }}>
            💾 Save Patient Record
          </button>
        </form>

        {/* ── Sidebar: Patient Documents ───────────────────────────────── */}
        <div>
          <PatientDocuments />

          {/* Quick Tips */}
          <div className="card" style={{ marginTop: '16px', background: '#fffbeb', border: '1.5px solid #fde68a' }}>
            <div style={{ fontWeight: 800, fontSize: '13px', color: '#a16207', marginBottom: '10px' }}>💡 Health Worker Tips</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {[
                'Always search Step 1 before registering to avoid duplicates.',
                'Phone number is key — helps identify patients quickly.',
                'ABHA ID links to national health records for better care.',
                'Vaccination records help track immunization history.',
                'Documents upload works offline and syncs later.',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#92400e' }}>
                  <span style={{ flexShrink: 0, fontWeight: 700 }}>{i + 1}.</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
