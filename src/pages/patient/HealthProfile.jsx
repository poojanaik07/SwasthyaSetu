import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

// Mock health profile data (in production, fetched from API)
const DEFAULT_PROFILE = {
  fullName: 'Ramesh Kumar',
  age: '42',
  gender: 'Male',
  bloodGroup: 'B+',
  allergies: ['Penicillin', 'Dust'],
  chronicDiseases: ['Hypertension'],
  currentMedications: ['Amlodipine 5mg (morning)', 'Aspirin 75mg (morning)'],
  emergencyContact: '9812345678',
  emergencyName: 'Kavita Kumar (Wife)',
  village: 'Rampur, Uttar Pradesh',
  healthId: 'ABHA-123456',
  weight: '68 kg',
  height: '170 cm',
  lastCheckup: '2026-03-11',
};

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const COMMON_ALLERGIES = ['Penicillin', 'Sulfa drugs', 'Aspirin', 'Dust', 'Pollen', 'Dairy', 'Nuts', 'None'];
const COMMON_DISEASES = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Thyroid', 'Kidney Disease', 'Arthritis', 'None'];

function ProfileCard({ emoji, title, children, color = '#6366f1' }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ padding: '12px 16px', background: `${color}10`, borderBottom: `3px solid ${color}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>{emoji}</span>
        <span style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>{title}</span>
      </div>
      <div style={{ padding: '16px' }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 700, color: highlight || '#0f172a', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}

function TagList({ tags, color = '#6366f1' }) {
  if (!tags?.length) return <span style={{ fontSize: '13px', color: '#94a3b8' }}>None listed</span>;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {tags.map((t, i) => (
        <span key={i} style={{ padding: '3px 10px', background: `${color}15`, color, borderRadius: '100px', fontSize: '12px', fontWeight: 700, border: `1px solid ${color}30` }}>
          {t}
        </span>
      ))}
    </div>
  );
}

export default function HealthProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [draft, setDraft] = useState(profile);
  const [saveMsg, setSaveMsg] = useState('');

  function set(k, v) { setDraft(d => ({ ...d, [k]: v })); }

  function handleSave() {
    setProfile(draft);
    setEditing(false);
    setSaveMsg('✅ Health profile saved!');
    setTimeout(() => setSaveMsg(''), 3000);
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>🏥 My Health Profile</h2>
          <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '14px' }}>Your personal health record — shared with doctors during consultation</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saveMsg && <span style={{ fontSize: '13px', fontWeight: 700, color: '#059669' }}>{saveMsg}</span>}
          <button
            className={`btn ${editing ? 'btn-ghost' : 'btn-primary'}`}
            onClick={() => { setEditing(e => !e); if (editing) setDraft(profile); }}
          >
            {editing ? '✖️ Cancel' : '✏️ Edit Profile'}
          </button>
          {editing && <button className="btn btn-primary" onClick={handleSave} style={{ background: '#22c55e', boxShadow: '0 4px 12px #22c55e40' }}>💾 Save Changes</button>}
        </div>
      </div>

      {/* ABHA / Health ID banner */}
      <div style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: '16px', padding: '20px 24px', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '3rem' }}>🩺</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 900, fontSize: '1.3rem' }}>{profile.fullName}</div>
          <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '2px' }}>ABHA ID: {profile.healthId} · {profile.bloodGroup} · {profile.age}y · {profile.gender}</div>
          <div style={{ fontSize: '12px', opacity: 0.65, marginTop: '4px' }}>📍 {profile.village}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.15)', borderRadius: '100px', fontSize: '12px', fontWeight: 700 }}>
            🩺 Last Checkup: {profile.lastCheckup}
          </div>
        </div>
      </div>

      {!editing ? (
        /* ── View mode ──────────────────────────────────────────────── */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          <ProfileCard emoji="👤" title="Basic Information" color="#6366f1">
            <InfoRow label="Full Name" value={profile.fullName} />
            <InfoRow label="Age" value={profile.age + ' years'} />
            <InfoRow label="Gender" value={profile.gender} />
            <InfoRow label="Weight / Height" value={`${profile.weight} / ${profile.height}`} />
            <InfoRow label="Village / Address" value={profile.village} />
          </ProfileCard>

          <ProfileCard emoji="🩸" title="Medical Details" color="#ef4444">
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>BLOOD GROUP</div>
              <div style={{ display: 'inline-flex', padding: '4px 16px', background: '#fee2e2', borderRadius: '100px', fontWeight: 900, fontSize: '18px', color: '#b91c1c' }}>
                🩸 {profile.bloodGroup}
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Allergies</div>
              <TagList tags={profile.allergies} color="#ef4444" />
            </div>
          </ProfileCard>

          <ProfileCard emoji="🏥" title="Chronic Diseases" color="#f59e0b">
            <div style={{ marginBottom: '10px' }}>
              <TagList tags={profile.chronicDiseases} color="#f59e0b" />
            </div>
            {profile.chronicDiseases?.length > 0 && (
              <div style={{ marginTop: '10px', padding: '8px 10px', background: '#fffbeb', borderRadius: '8px', fontSize: '12px', color: '#a16207', fontWeight: 600 }}>
                ⚠️ Doctor is notified of these conditions during consultation.
              </div>
            )}
          </ProfileCard>

          <ProfileCard emoji="💊" title="Current Medications" color="#10b981">
            {profile.currentMedications?.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {profile.currentMedications.map((m, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', padding: '6px 10px', background: '#f0fdf4', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#065f46' }}>
                    <span>💊</span> {m}
                  </div>
                ))}
              </div>
            ) : <span style={{ fontSize: '13px', color: '#94a3b8' }}>No current medications</span>}
          </ProfileCard>

          <ProfileCard emoji="🆘" title="Emergency Contact" color="#ef4444">
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '6px' }}>📞</div>
              <div style={{ fontWeight: 800, fontSize: '18px', color: '#0f172a' }}>{profile.emergencyContact}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{profile.emergencyName}</div>
              <a href={`tel:${profile.emergencyContact}`} style={{ marginTop: '12px', display: 'inline-flex', padding: '8px 20px', background: '#fee2e2', color: '#b91c1c', borderRadius: '10px', fontWeight: 700, fontSize: '13px', textDecoration: 'none', border: '1px solid #fca5a5' }}>
                📞 Call Now
              </a>
            </div>
          </ProfileCard>

          <ProfileCard emoji="ℹ️" title="Doctor Notes" color="#0ea5e9">
            <div style={{ padding: '10px', background: '#f0f9ff', borderRadius: '10px', fontSize: '13px', color: '#0c4a6e', lineHeight: 1.6 }}>
              This health profile is automatically shared with your assigned doctor before each consultation. Keep it updated for better care.
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: '#64748b' }}>
              📋 This profile was last updated today.
            </div>
          </ProfileCard>
        </div>

      ) : (
        /* ── Edit mode ──────────────────────────────────────────────── */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {/* Basic info */}
          <ProfileCard emoji="👤" title="Basic Information" color="#6366f1">
            {[
              { label: 'Full Name', key: 'fullName', type: 'text', placeholder: 'Your full name' },
              { label: 'Age', key: 'age', type: 'number', placeholder: 'Age in years' },
              { label: 'Weight (kg)', key: 'weight', type: 'text', placeholder: '68 kg' },
              { label: 'Height (cm)', key: 'height', type: 'text', placeholder: '170 cm' },
              { label: 'Village / Address', key: 'village', type: 'text', placeholder: 'Village, District, State' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>{f.label}</label>
                <input type={f.type} value={draft[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Gender</label>
              <select value={draft.gender} onChange={e => set('gender', e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit' }}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
          </ProfileCard>

          {/* Medical */}
          <ProfileCard emoji="🩸" title="Medical Details" color="#ef4444">
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Blood Group</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {BLOOD_GROUPS.map(bg => (
                  <button key={bg} type="button" onClick={() => set('bloodGroup', bg)}
                    style={{ padding: '5px 12px', borderRadius: '8px', border: `2px solid ${draft.bloodGroup === bg ? '#ef4444' : '#e2e8f0'}`, background: draft.bloodGroup === bg ? '#fee2e2' : '#fff', color: draft.bloodGroup === bg ? '#b91c1c' : '#374151', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
                    {bg}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Allergies</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {COMMON_ALLERGIES.map(a => (
                  <button key={a} type="button"
                    onClick={() => set('allergies', draft.allergies?.includes(a) ? draft.allergies.filter(x => x !== a) : [...(draft.allergies || []), a])}
                    style={{ padding: '4px 10px', borderRadius: '8px', border: `2px solid ${draft.allergies?.includes(a) ? '#ef4444' : '#e2e8f0'}`, background: draft.allergies?.includes(a) ? '#fee2e2' : '#fff', color: draft.allergies?.includes(a) ? '#b91c1c' : '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </ProfileCard>

          {/* Chronic conditions */}
          <ProfileCard emoji="🏥" title="Chronic Diseases" color="#f59e0b">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {COMMON_DISEASES.map(d => (
                <button key={d} type="button"
                  onClick={() => set('chronicDiseases', draft.chronicDiseases?.includes(d) ? draft.chronicDiseases.filter(x => x !== d) : [...(draft.chronicDiseases || []), d])}
                  style={{ padding: '5px 12px', borderRadius: '8px', border: `2px solid ${draft.chronicDiseases?.includes(d) ? '#f59e0b' : '#e2e8f0'}`, background: draft.chronicDiseases?.includes(d) ? '#fffbeb' : '#fff', color: draft.chronicDiseases?.includes(d) ? '#a16207' : '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                  {d}
                </button>
              ))}
            </div>
          </ProfileCard>

          {/* Emergency */}
          <ProfileCard emoji="🆘" title="Emergency Contact" color="#ef4444">
            {[
              { label: 'Contact Name (Relation)', key: 'emergencyName', placeholder: 'e.g., Kavita Kumar (Wife)' },
              { label: 'Contact Mobile Number', key: 'emergencyContact', placeholder: '10-digit mobile number' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>{f.label}</label>
                <input value={draft[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
            ))}
          </ProfileCard>
        </div>
      )}
    </div>
  );
}
