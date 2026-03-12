import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, ROLE_HOME } from '../../context/AuthContext';
import '../../styles/auth.css';

// Role-specific config — hero changes when a role is picked
const ROLE_CONFIG = {
  patient: {
    label: 'Patient Portal', emoji: '👤', color: '#6366f1',
    gradient: 'linear-gradient(160deg, #6366f1 0%, #4f46e5 60%, #7c3aed 100%)',
    welcome: 'Namaste 🙏',
    subtitle: 'Access your health records, report symptoms, and consult doctors.',
    features: [
      { emoji: '🤒', text: 'Report symptoms with voice input (Hindi/English)' },
      { emoji: '💊', text: 'View prescriptions sent by your doctor' },
      { emoji: '🏥', text: 'Find nearby pharmacies and medicines' },
      { emoji: '📴', text: 'Works offline — syncs when internet returns' },
    ],
    placeholder: 'Enter patient mobile number',
  },
  healthworker: {
    label: 'Health Worker Portal', emoji: '👩‍⚕️', color: '#0ea5e9',
    gradient: 'linear-gradient(160deg, #0ea5e9 0%, #0284c7 60%, #0369a1 100%)',
    welcome: 'Welcome, ASHA / ANM Worker 🏘️',
    subtitle: 'Register patients, record vitals, and send consultation requests.',
    features: [
      { emoji: '👥', text: 'Register new patients in your village' },
      { emoji: '📈', text: 'Record vitals: temperature, BP, SpO2, pulse' },
      { emoji: '📋', text: 'Send consultation requests to doctors' },
      { emoji: '📴', text: 'Offline-first — works on 2G networks' },
    ],
    placeholder: 'Enter registered mobile number',
  },
  doctor: {
    label: 'Doctor Dashboard', emoji: '👨‍⚕️', color: '#10b981',
    gradient: 'linear-gradient(160deg, #10b981 0%, #059669 60%, #047857 100%)',
    welcome: 'Namaskar, Doctor 🩺',
    subtitle: 'Review patient cases, write diagnoses, and send prescriptions.',
    features: [
      { emoji: '📥', text: 'Priority-sorted consultation queue' },
      { emoji: '✍️', text: 'Write diagnosis and digital prescriptions' },
      { emoji: '💊', text: 'Prescription delivered directly to pharmacy' },
      { emoji: '🗺️', text: 'Live village outbreak heatmap' },
    ],
    placeholder: 'Enter registered mobile number',
  },
  pharmacy: {
    label: 'Pharmacy Dashboard', emoji: '🏥', color: '#f59e0b',
    gradient: 'linear-gradient(160deg, #f59e0b 0%, #d97706 60%, #b45309 100%)',
    welcome: 'Welcome, Pharmacy Partner 💊',
    subtitle: 'Manage inventory, confirm prescriptions, and track stock levels.',
    features: [
      { emoji: '📦', text: 'Real-time medicine inventory management' },
      { emoji: '📋', text: 'Confirm or reject doctor prescriptions' },
      { emoji: '⚠️', text: 'Low-stock alerts and expiry tracking' },
      { emoji: '🔄', text: 'Sync orders with doctors in real-time' },
    ],
    placeholder: 'Enter pharmacy mobile number',
  },
  admin: {
    label: 'Admin Panel', emoji: '⚙️', color: '#ef4444',
    gradient: 'linear-gradient(160deg, #ef4444 0%, #dc2626 60%, #b91c1c 100%)',
    welcome: 'System Admin Access 🔐',
    subtitle: 'Manage users, approve registrations, and monitor health analytics.',
    features: [
      { emoji: '✅', text: 'Approve / reject doctor & pharmacy registrations' },
      { emoji: '📊', text: 'District-wide health analytics & charts' },
      { emoji: '🚨', text: 'Live outbreak heatmap and alerts' },
      { emoji: '🔬', text: 'Disease trend monitoring' },
    ],
    placeholder: 'Enter admin mobile number',
  },
};

const ROLES_LIST = [
  { id: 'patient', label: 'Patient', emoji: '👤' },
  { id: 'healthworker', label: 'Health Worker', emoji: '👩‍⚕️' },
  { id: 'doctor', label: 'Doctor', emoji: '👨‍⚕️' },
  { id: 'pharmacy', label: 'Pharmacy', emoji: '🏥' },
  { id: 'admin', label: 'Admin', emoji: '⚙️' },
];

const DEMO_CREDS = {
  patient:      { mobile: '9876543210', pw: 'ramesh123' },
  healthworker: { mobile: '9812345678', pw: 'kavita123' },
  doctor:       { mobile: '9898765432', pw: 'doctor123' },
  pharmacy:     { mobile: '9811111111', pw: 'pharma123' },
  admin:        { mobile: '9800000000', pw: 'admin123' },
};

export default function Login() {
  const [step, setStep] = useState(1); // 1=role selection, 2=credentials
  const [selectedRole, setSelectedRole] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const cfg = ROLE_CONFIG[selectedRole] || null;

  function selectRole(roleId) {
    setSelectedRole(roleId);
    // Auto-fill demo creds for convenience
    if (DEMO_CREDS[roleId]) {
      setMobile(DEMO_CREDS[roleId].mobile);
      setPassword(DEMO_CREDS[roleId].pw);
    }
    setAuthError('');
    setStep(2);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    const result = await login(mobile, password);
    setLoading(false);
    if (!result.ok) return;

    // Verify the role matches the selected portal
    if (result.role !== selectedRole) {
      setAuthError(`These credentials belong to a ${result.role} account. Please go back and select the correct role.`);
      return;
    }
    if (result.status === 'pending_verification') {
      navigate('/pending-verification', { replace: true });
    } else {
      navigate(ROLE_HOME[result.role], { replace: true });
    }
  }

  // ── Step 1: Role selection ─────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="auth-root">
        {/* Static hero for step 1 */}
        <div className="auth-hero">
          <div className="auth-hero-logo">🩺</div>
          <h2 className="auth-hero-title">SwasthyaSetu</h2>
          <p className="auth-hero-sub">Bridging the gap between rural communities and quality healthcare across India.</p>
          <div className="auth-hero-features">
            <div className="auth-hero-feature"><span className="auth-hero-feature-icon">🎤</span><span className="auth-hero-feature-text">Voice-first symptom reporting in Hindi & English</span></div>
            <div className="auth-hero-feature"><span className="auth-hero-feature-icon">📴</span><span className="auth-hero-feature-text">Works offline — syncs when internet returns</span></div>
            <div className="auth-hero-feature"><span className="auth-hero-feature-icon">🗺️</span><span className="auth-hero-feature-text">Live disease outbreak heatmap for villages</span></div>
            <div className="auth-hero-feature"><span className="auth-hero-feature-icon">💊</span><span className="auth-hero-feature-text">Doctor prescriptions sent directly to pharmacy</span></div>
          </div>
          <div className="auth-hero-stats">
            <div className="auth-hero-stat"><div className="auth-hero-stat-val">247</div><div className="auth-hero-stat-label">Villages Covered</div></div>
            <div className="auth-hero-stat"><div className="auth-hero-stat-val">124</div><div className="auth-hero-stat-label">Health Workers</div></div>
            <div className="auth-hero-stat"><div className="auth-hero-stat-val">89</div><div className="auth-hero-stat-label">Pharmacies</div></div>
            <div className="auth-hero-stat"><div className="auth-hero-stat-val">15k+</div><div className="auth-hero-stat-label">Patients Served</div></div>
          </div>
        </div>

        {/* Role picker */}
        <div className="auth-form-panel">
          <div className="auth-form-inner">
            <div className="auth-form-header">
              <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>👋</div>
              <h1>Who are you?</h1>
              <p>Select your role to access your portal</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {ROLES_LIST.map(r => {
                const rc = ROLE_CONFIG[r.id];
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => selectRole(r.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      padding: '16px 20px',
                      border: '2px solid #e2e8f0', borderRadius: '14px',
                      background: '#fff', cursor: 'pointer', textAlign: 'left',
                      transition: 'all 220ms ease', width: '100%',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = rc.color;
                      e.currentTarget.style.background = `${rc.color}0d`;
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${rc.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                      {r.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{rc.label}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', lineHeight: 1.4 }}>{rc.subtitle.slice(0, 55)}…</div>
                    </div>
                    <div style={{ color: rc.color, fontSize: '20px', flexShrink: 0 }}>→</div>
                  </button>
                );
              })}
            </div>

            <div className="auth-switch-text">
              New here? <Link to="/register" className="auth-link">Create Account →</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2: Role-specific login form ───────────────────────────────────────
  return (
    <div className="auth-root">
      {/* Dynamic hero based on selected role */}
      <div className="auth-hero" style={{ background: cfg.gradient }}>
        <div className="auth-hero-logo">{cfg.emoji}</div>
        <h2 className="auth-hero-title">{cfg.label}</h2>
        <p className="auth-hero-sub">{cfg.subtitle}</p>
        <div className="auth-hero-features">
          {cfg.features.map((f, i) => (
            <div key={i} className="auth-hero-feature">
              <span className="auth-hero-feature-icon">{f.emoji}</span>
              <span className="auth-hero-feature-text">{f.text}</span>
            </div>
          ))}
        </div>
        {/* Demo Creds on hero for the selected role */}
        <div style={{ marginTop: '28px', padding: '14px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', width: '100%', maxWidth: '320px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>🔑 Demo credentials (auto-filled)</div>
          <div style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>📱 {DEMO_CREDS[selectedRole]?.mobile}</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>🔒 {DEMO_CREDS[selectedRole]?.pw}</div>
        </div>
      </div>

      {/* Credentials form */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          {/* Back + role indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', padding: '10px 14px', background: `${cfg.color}10`, borderRadius: '12px', border: `1px solid ${cfg.color}30` }}>
            <button type="button" onClick={() => { setStep(1); setAuthError(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '0', lineHeight: 1 }}>←</button>
            <span style={{ fontSize: '22px' }}>{cfg.emoji}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{cfg.label}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Select a different role</div>
            </div>
          </div>

          <div className="auth-form-header" style={{ marginBottom: '20px' }}>
            <h1>{cfg.welcome}</h1>
            <p>Login to access <strong>{cfg.label}</strong></p>
          </div>

          {authError && <div className="auth-error">⚠️ {authError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-input-label">Mobile Number <span>*</span></label>
              <span className="auth-input-icon">📱</span>
              <input
                className="auth-input"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder={cfg.placeholder}
                value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                required
              />
            </div>

            <div className="auth-input-group">
              <label className="auth-input-label">Password <span>*</span></label>
              <span className="auth-input-icon">🔒</span>
              <div className="auth-pw-wrap">
                <input
                  className="auth-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '48px' }}
                />
                <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(s => !s)}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              className="auth-submit-btn"
              type="submit"
              disabled={loading}
              style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`, boxShadow: `0 4px 14px ${cfg.color}44` }}
            >
              {loading
                ? <><span className="auth-spinner" /> Logging in...</>
                : `${cfg.emoji} Login to ${cfg.label}`
              }
            </button>
          </form>

          <div className="auth-switch-text" style={{ marginTop: '20px' }}>
            New to SwasthyaSetu? <Link to="/register" className="auth-link">Create Account →</Link>
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#9ca3af' }}>
            🔒 Your data is secure. We never share personal health information.
          </div>
        </div>
      </div>
    </div>
  );
}
