import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, ROLE_HOME } from '../../context/AuthContext';
import '../../styles/auth.css';

// ─── Role definitions ─────────────────────────────────────────────────────────
const ROLES = [
  { id: 'patient',      label: 'Patient',       emoji: '👤',  desc: 'Get consultations & prescriptions', color: '#6366f1' },
  { id: 'healthworker', label: 'Health Worker',  emoji: '👩‍⚕️', desc: 'ASHA / ANM / Community worker',    color: '#0ea5e9' },
  { id: 'doctor',       label: 'Doctor',         emoji: '👨‍⚕️', desc: 'Licensed medical practitioner',    color: '#10b981' },
  { id: 'pharmacy',     label: 'Pharmacy',       emoji: '🏥',  desc: 'Licensed pharmacy / drug store',    color: '#f59e0b' },
];

// ─── Geolocation hook ─────────────────────────────────────────────────────────
function useGeoLocation() {
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  const fetchLocation = useCallback(async (onResult) => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Nominatim reverse geocoding — free, no API key required
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`,
            { headers: { 'User-Agent': 'SwasthyaSetu-App/1.0' } }
          );
          const data = await res.json();
          const addr = data.address || {};
          // Prefer village → town → city → suburb → county
          const place =
            addr.village || addr.town || addr.city || addr.suburb ||
            addr.county || addr.state_district || addr.state || '';
          const district = addr.county || addr.state_district || '';
          const state = addr.state || '';
          const formatted = [place, district, state].filter(Boolean).join(', ');
          onResult(formatted || `Lat ${latitude.toFixed(4)}, Lon ${longitude.toFixed(4)}`);
        } catch {
          // Fallback to raw lat/lon if API fails
          onResult(`Lat ${latitude.toFixed(4)}, Lon ${longitude.toFixed(4)}`);
        }
        setGeoLoading(false);
      },
      (err) => {
        const msgs = {
          1: 'Location access denied. Please allow location permissions.',
          2: 'Location unavailable. Please enter manually.',
          3: 'Location request timed out. Please try again.',
        };
        setGeoError(msgs[err.code] || 'Unable to fetch location.');
        setGeoLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  return { geoLoading, geoError, fetchLocation };
}

// ─── Location field with GPS button ──────────────────────────────────────────
function LocationField({ label, placeholder, value, onChange, required, isTextarea = false }) {
  const { geoLoading, geoError, fetchLocation } = useGeoLocation();

  return (
    <div className="auth-input-group">
      <label className="auth-input-label">{label} {required && <span>*</span>}</label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span className="auth-input-icon">📍</span>
          {isTextarea ? (
            <textarea
              className="form-textarea"
              placeholder={placeholder}
              value={value}
              onChange={e => onChange(e.target.value)}
              rows={2}
              required={required}
              style={{ border: '2px solid #e5e7eb', borderRadius: '12px', padding: '11px 14px', fontSize: '15px', fontFamily: 'inherit', resize: 'vertical', width: '100%', paddingLeft: '38px', boxSizing: 'border-box' }}
            />
          ) : (
            <input
              className="auth-input"
              placeholder={placeholder}
              value={value}
              onChange={e => onChange(e.target.value)}
              required={required}
            />
          )}
        </div>
        <button
          type="button"
          onClick={() => fetchLocation(onChange)}
          disabled={geoLoading}
          title="Detect my location automatically"
          style={{
            padding: '10px 12px', borderRadius: '12px', border: '2px solid #6366f1',
            background: geoLoading ? '#e0e7ff' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: geoLoading ? '#6366f1' : '#fff',
            cursor: geoLoading ? 'not-allowed' : 'pointer',
            fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            minWidth: '46px', height: '46px', flexShrink: 0, transition: 'all 200ms',
            boxShadow: geoLoading ? 'none' : '0 3px 10px #6366f140',
          }}
        >
          {geoLoading ? (
            <span style={{ width: '16px', height: '16px', border: '2px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
          ) : '🛰️'}
        </button>
      </div>
      {geoError && (
        <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', fontWeight: 600 }}>⚠️ {geoError}</div>
      )}
      {!geoError && (
        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
          🛰️ Click the satellite button to auto-detect your location
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── File upload component ────────────────────────────────────────────────────
function FileUpload({ label, name, value, onChange, required }) {
  return (
    <div className="auth-input-group">
      <label className="auth-input-label">{label} {required && <span>*</span>}</label>
      <label style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '11px 14px', border: '2px dashed #c7d2fe',
        borderRadius: '12px', cursor: 'pointer', background: '#f5f3ff',
        fontSize: '14px', color: '#6366f1', fontWeight: 600, transition: 'all 200ms',
      }}
        onMouseEnter={e => e.currentTarget.style.background = '#ede9fe'}
        onMouseLeave={e => e.currentTarget.style.background = '#f5f3ff'}
      >
        <span style={{ fontSize: '20px' }}>📎</span>
        {value ? <span style={{ color: '#059669' }}>✅ {value}</span> : 'Choose file to upload'}
        <input type="file" style={{ display: 'none' }} name={name} accept=".jpg,.jpeg,.png,.pdf" onChange={e => onChange(e.target.files[0]?.name || '')} />
      </label>
      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Accepted: JPG, PNG, PDF (max 5MB)</div>
    </div>
  );
}

// ─── Password fields ──────────────────────────────────────────────────────────
function PasswordFields({ form, set }) {
  const [showPw, setShowPw] = useState(false);
  const match = !form.confirmPassword || form.password === form.confirmPassword;
  return (
    <>
      <div className="auth-input-group">
        <label className="auth-input-label">Password <span>*</span></label>
        <span className="auth-input-icon">🔒</span>
        <div className="auth-pw-wrap">
          <input className="auth-input" type={showPw ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} required style={{ paddingRight: '48px' }} />
          <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(s => !s)}>{showPw ? '🙈' : '👁️'}</button>
        </div>
      </div>
      <div className="auth-input-group">
        <label className="auth-input-label">Confirm Password <span>*</span></label>
        <span className="auth-input-icon">🔑</span>
        <input className="auth-input" type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} required />
        {!match && <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', fontWeight: 600 }}>⚠️ Passwords do not match</div>}
      </div>
    </>
  );
}

// ─── Patient form ─────────────────────────────────────────────────────────────
function PatientForm({ form, set }) {
  return (
    <>
      <div className="auth-input-group">
        <label className="auth-input-label">Full Name <span>*</span></label>
        <span className="auth-input-icon">📛</span>
        <input className="auth-input" placeholder="Your full name" value={form.fullName} onChange={e => set('fullName', e.target.value)} required />
      </div>
      <div className="auth-input-group">
        <label className="auth-input-label">Mobile Number <span>*</span></label>
        <span className="auth-input-icon">📱</span>
        <input className="auth-input" type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile number" value={form.mobile} onChange={e => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} required />
      </div>
      {/* Village with GPS auto-fetch */}
      <LocationField
        label="Village / City"
        placeholder="Village name or click 🛰️ to auto-detect"
        value={form.village}
        onChange={v => set('village', v)}
        required
      />
      <div className="auth-form-row">
        <div className="auth-input-group" style={{ margin: 0 }}>
          <label className="auth-input-label">Age</label>
          <span className="auth-input-icon">🎂</span>
          <input className="auth-input" type="number" min={1} max={120} placeholder="Age" value={form.age} onChange={e => set('age', e.target.value)} />
        </div>
        <div className="auth-input-group" style={{ margin: 0 }}>
          <label className="auth-input-label">Gender</label>
          <select className="auth-select" value={form.gender} onChange={e => set('gender', e.target.value)}>
            <option value="">Select gender</option>
            <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
          </select>
        </div>
      </div>
      <PasswordFields form={form} set={set} />
    </>
  );
}

// ─── Health Worker form ───────────────────────────────────────────────────────
function HealthWorkerForm({ form, set }) {
  return (
    <>
      <div className="auth-input-group">
        <label className="auth-input-label">Full Name <span>*</span></label>
        <span className="auth-input-icon">📛</span>
        <input className="auth-input" placeholder="Your full name" value={form.fullName} onChange={e => set('fullName', e.target.value)} required />
      </div>
      <div className="auth-input-group">
        <label className="auth-input-label">Mobile Number <span>*</span></label>
        <span className="auth-input-icon">📱</span>
        <input className="auth-input" type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile number" value={form.mobile} onChange={e => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} required />
      </div>
      {/* Village with GPS auto-fetch */}
      <LocationField
        label="Village / Area"
        placeholder="Village or area name or click 🛰️ to auto-detect"
        value={form.village}
        onChange={v => set('village', v)}
        required
      />
      <div className="auth-input-group">
        <label className="auth-input-label">Government ID Number (ASHA/ANM) <span>*</span></label>
        <span className="auth-input-icon">🆔</span>
        <input className="auth-input" placeholder="e.g., ASHA-UP-001" value={form.govtId} onChange={e => set('govtId', e.target.value)} required />
      </div>
      <FileUpload label="Upload Health Worker Certificate / ASHA ID" name="certificate" value={form.certificateFile} onChange={v => set('certificateFile', v)} required />
      <PasswordFields form={form} set={set} />
    </>
  );
}

// ─── Doctor form ──────────────────────────────────────────────────────────────
function DoctorForm({ form, set }) {
  return (
    <>
      <div className="auth-input-group">
        <label className="auth-input-label">Full Name <span>*</span></label>
        <span className="auth-input-icon">📛</span>
        <input className="auth-input" placeholder="Dr. Full Name" value={form.fullName} onChange={e => set('fullName', e.target.value)} required />
      </div>
      <div className="auth-input-group">
        <label className="auth-input-label">Mobile Number <span>*</span></label>
        <span className="auth-input-icon">📱</span>
        <input className="auth-input" type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile number" value={form.mobile} onChange={e => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} required />
      </div>
      <div className="auth-input-group">
        <label className="auth-input-label">Medical Council Registration Number <span>*</span></label>
        <span className="auth-input-icon">🏛️</span>
        <input className="auth-input" placeholder="e.g., MCI-12345" value={form.mcRegistration} onChange={e => set('mcRegistration', e.target.value)} required />
      </div>
      <div className="auth-input-group">
        <label className="auth-input-label">Specialization <span>*</span></label>
        <span className="auth-input-icon">🩺</span>
        <select className="auth-select" value={form.specialization} onChange={e => set('specialization', e.target.value)} required>
          <option value="">Select specialization</option>
          <option>General Physician</option><option>Pediatrics</option><option>Gynecology</option>
          <option>Orthopedics</option><option>Dermatology</option><option>Cardiology</option>
          <option>ENT</option><option>Ophthalmology</option><option>Emergency Medicine</option><option>Other</option>
        </select>
      </div>
      <div className="auth-input-group">
        <label className="auth-input-label">Hospital / Clinic Name <span>*</span></label>
        <span className="auth-input-icon">🏥</span>
        <input className="auth-input" placeholder="Hospital or clinic name" value={form.hospitalName} onChange={e => set('hospitalName', e.target.value)} required />
      </div>
      <FileUpload label="Upload Medical License Certificate" name="license" value={form.licenseFile} onChange={v => set('licenseFile', v)} required />
      <FileUpload label="Upload Government ID" name="govtId" value={form.govtIdFile} onChange={v => set('govtIdFile', v)} required />
      <PasswordFields form={form} set={set} />
    </>
  );
}

// ─── Pharmacy form ────────────────────────────────────────────────────────────
function PharmacyForm({ form, set }) {
  return (
    <>
      <div className="auth-input-group">
        <label className="auth-input-label">Pharmacy Name <span>*</span></label>
        <span className="auth-input-icon">🏥</span>
        <input className="auth-input" placeholder="e.g., Jan Aushadhi Kendra" value={form.pharmacyName} onChange={e => set('pharmacyName', e.target.value)} required />
      </div>
      <div className="auth-input-group">
        <label className="auth-input-label">Owner / Manager Name <span>*</span></label>
        <span className="auth-input-icon">👤</span>
        <input className="auth-input" placeholder="Owner full name" value={form.ownerName} onChange={e => set('ownerName', e.target.value)} required />
      </div>
      <div className="auth-input-group">
        <label className="auth-input-label">Mobile Number <span>*</span></label>
        <span className="auth-input-icon">📱</span>
        <input className="auth-input" type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile number" value={form.mobile} onChange={e => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} required />
      </div>
      <div className="auth-input-group">
        <label className="auth-input-label">Drug License Number <span>*</span></label>
        <span className="auth-input-icon">📋</span>
        <input className="auth-input" placeholder="e.g., DL-UP-2024-001" value={form.drugLicense} onChange={e => set('drugLicense', e.target.value)} required />
      </div>
      {/* Pharmacy address with GPS auto-fetch */}
      <LocationField
        label="Pharmacy Address"
        placeholder="Full pharmacy address or click 🛰️ to auto-detect"
        value={form.address}
        onChange={v => set('address', v)}
        required
        isTextarea
      />
      <FileUpload label="Upload Drug License Certificate" name="drugLicenseCert" value={form.drugLicenseFile} onChange={v => set('drugLicenseFile', v)} required />
      <FileUpload label="Upload Owner ID Proof" name="ownerIdProof" value={form.ownerIdFile} onChange={v => set('ownerIdFile', v)} required />
      <PasswordFields form={form} set={set} />
    </>
  );
}

// ─── Step 1 – Role selection ──────────────────────────────────────────────────
function StepRole({ onSelect }) {
  return (
    <div>
      <div className="auth-form-header">
        <div style={{ fontSize: '2rem', marginBottom: '4px' }}>👋</div>
        <h1>Create Account</h1>
        <p>Select your role to get started</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {ROLES.map(r => (
          <button
            key={r.id} type="button" onClick={() => onSelect(r.id)}
            style={{ padding: '20px 16px', border: '2px solid #e2e8f0', borderRadius: '14px', background: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 200ms ease', display: 'flex', flexDirection: 'column', gap: '6px' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = r.color; e.currentTarget.style.background = `${r.color}10`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}
          >
            <span style={{ fontSize: '28px' }}>{r.emoji}</span>
            <span style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{r.label}</span>
            <span style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>{r.desc}</span>
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center', padding: '12px', background: '#f0fdf4', borderRadius: '10px', fontSize: '12px', color: '#15803d', fontWeight: 600 }}>
        ℹ️ Patient accounts are instantly approved. Other roles require admin verification.
      </div>
      <div style={{ textAlign: 'center', padding: '10px 12px', background: '#fff7ed', borderRadius: '10px', fontSize: '12px', color: '#c2410c', fontWeight: 600, marginTop: '8px' }}>
        🛰️ Location is auto-detected via GPS on the next step — no need to type your address!
      </div>
      <div className="auth-switch-text" style={{ marginTop: '20px' }}>
        Already have an account? <Link to="/login" className="auth-link">Login →</Link>
      </div>
    </div>
  );
}

// ─── Main Register component ──────────────────────────────────────────────────
const ROLE_FORMS = { patient: PatientForm, healthworker: HealthWorkerForm, doctor: DoctorForm, pharmacy: PharmacyForm };
const ROLE_LABELS = { patient: 'Patient', healthworker: 'Health Worker', doctor: 'Doctor', pharmacy: 'Pharmacy' };
const ROLE_EMOJIS = { patient: '👤', healthworker: '👩‍⚕️', doctor: '👨‍⚕️', pharmacy: '🏥' };

export default function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [form, setForm] = useState({
    fullName: '', pharmacyName: '', mobile: '', village: '', age: '', gender: '',
    govtId: '', mcRegistration: '', specialization: '', hospitalName: '',
    ownerName: '', drugLicense: '', address: '',
    certificateFile: '', licenseFile: '', govtIdFile: '', drugLicenseFile: '', ownerIdFile: '',
    password: '', confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { register, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function handleRoleSelect(r) { setRole(r); setStep(2); setAuthError(''); }

  async function handleSubmit(e) {
    e.preventDefault();
    setAuthError('');
    if (form.password !== form.confirmPassword) { setAuthError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setAuthError('Password must be at least 6 characters.'); return; }
    if (form.mobile.length !== 10) { setAuthError('Please enter a valid 10-digit mobile number.'); return; }

    setLoading(true);
    const result = await register({ ...form, role });
    setLoading(false);
    if (!result) return;
    if (result.status === 'pending_verification') navigate('/pending-verification', { replace: true });
    else navigate(ROLE_HOME[role], { replace: true });
  }

  const RoleFormComponent = ROLE_FORMS[role];

  return (
    <div className="auth-root">
      {/* Hero */}
      <div className="auth-hero">
        <div className="auth-hero-logo">🏥</div>
        <h2 className="auth-hero-title">Join SwasthyaSetu</h2>
        <p className="auth-hero-sub">Create your free account and get access to quality healthcare services from the comfort of your village.</p>
        <div className="auth-hero-features">
          {[
            { emoji: '👤', text: 'Patient — Instant access, no verification needed' },
            { emoji: '👩‍⚕️', text: 'Health Worker — Register patients & record vitals' },
            { emoji: '👨‍⚕️', text: 'Doctor — Write diagnoses & digital prescriptions' },
            { emoji: '🏥', text: 'Pharmacy — Manage inventory & confirm prescriptions' },
          ].map((f, i) => (
            <div key={i} className="auth-hero-feature">
              <span className="auth-hero-feature-icon">{f.emoji}</span>
              <span className="auth-hero-feature-text">{f.text}</span>
            </div>
          ))}
        </div>
        {/* GPS feature highlight */}
        <div style={{ marginTop: '20px', padding: '14px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff', marginBottom: '6px' }}>🛰️ Auto Location Detection</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
            Just click the satellite button on the village/address field and we'll automatically detect your location using GPS — no need to type your address!
          </div>
        </div>
        <div style={{ marginTop: '12px', padding: '12px 16px', background: 'rgba(0,0,0,0.15)', borderRadius: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
          🔒 Admin accounts are not publicly created. Admin access is assigned internally only.
        </div>
      </div>

      {/* Form */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          {/* Step 2 breadcrumb */}
          {step === 2 && role && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '10px 14px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #86efac' }}>
              <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '2px' }}>←</button>
              <span style={{ fontSize: '20px' }}>{ROLE_EMOJIS[role]}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#15803d' }}>Registering as {ROLE_LABELS[role]}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Step 2 of 2 — Fill your details</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                <div style={{ width: '20px', height: '4px', borderRadius: '2px', background: '#22c55e' }} />
                <div style={{ width: '20px', height: '4px', borderRadius: '2px', background: '#22c55e' }} />
              </div>
            </div>
          )}

          {authError && <div className="auth-error">⚠️ {authError}</div>}

          {step === 1 && <StepRole onSelect={handleRoleSelect} />}

          {step === 2 && RoleFormComponent && (
            <>
              <div className="auth-form-header" style={{ marginBottom: '20px' }}>
                <h1>{ROLE_EMOJIS[role]} {ROLE_LABELS[role]} Registration</h1>
                {role !== 'patient' ? (
                  <div style={{ marginTop: '8px', padding: '8px 12px', background: '#fef9c3', borderRadius: '8px', fontSize: '12px', color: '#a16207', fontWeight: 600 }}>
                    ⏳ Your account will need admin approval before you can access the system.
                  </div>
                ) : (
                  <div style={{ marginTop: '8px', padding: '8px 12px', background: '#f0fdf4', borderRadius: '8px', fontSize: '12px', color: '#15803d', fontWeight: 600 }}>
                    ✅ Patient accounts are approved instantly — you'll get immediate access!
                  </div>
                )}
              </div>
              <form onSubmit={handleSubmit}>
                <RoleFormComponent form={form} set={set} />
                <button className="auth-submit-btn" type="submit" disabled={loading} style={{ marginTop: '16px' }}>
                  {loading
                    ? <><span className="auth-spinner" /> Creating Account...</>
                    : role === 'patient' ? '✅ Create Account — Get Instant Access' : '📤 Submit for Verification'
                  }
                </button>
              </form>
              <div className="auth-switch-text" style={{ marginTop: '16px' }}>
                Already have an account? <Link to="/login" className="auth-link">Login →</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
