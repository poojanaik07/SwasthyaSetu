import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OfflineSyncBanner from '../../components/OfflineSyncBanner';
import { mockVitals, mockPatients } from '../../utils/mockData';

// ── Augmented patient data with last consultation ─────────────────────────────
const PATIENTS_EXTENDED = [
  { id: 'P001', name: 'Ramesh Kumar',  age: 42, village: 'Rampur',    phone: '9876543210', abha: 'ABHA-123456', bloodGroup: 'B+', lastConsultation: '2026-03-11', lastDiagnosis: 'Viral Fever',         lastDoctor: 'Dr. Priya Sharma' },
  { id: 'P002', name: 'Sunita Devi',   age: 35, village: 'Bhagalpur', phone: '9812345678', abha: 'ABHA-234567', bloodGroup: 'O+', lastConsultation: '2026-03-12', lastDiagnosis: 'Respiratory Infection', lastDoctor: 'Dr. Arjun Mehta' },
  { id: 'P003', name: 'Mohan Lal',     age: 28, village: 'Chandpur',  phone: '9898765432', abha: 'ABHA-345678', bloodGroup: 'A+', lastConsultation: '2026-03-10', lastDiagnosis: 'Allergic Dermatitis',   lastDoctor: 'Dr. Kavitha Nair' },
  { id: 'P004', name: 'Geeta Bai',     age: 55, village: 'Kota Gaon', phone: '9876001234', abha: 'ABHA-456789', bloodGroup: 'AB+',lastConsultation: '2026-03-08', lastDiagnosis: 'Hypertension',          lastDoctor: 'Dr. Priya Sharma' },
  { id: 'P005', name: 'Arjun Patel',   age: 19, village: 'Rampur',    phone: '9811223344', abha: 'ABHA-567890', bloodGroup: 'O-', lastConsultation: '2026-03-09', lastDiagnosis: 'Injury / Fracture',     lastDoctor: 'Dr. Arjun Mehta' },
  { id: 'P006', name: 'Priya Kumari',  age: 30, village: 'Nandpur',   phone: '9800112233', abha: 'ABHA-678901', bloodGroup: 'B-', lastConsultation: '2026-03-12', lastDiagnosis: 'Dengue Fever',          lastDoctor: 'Dr. Priya Sharma' },
];

// ── Village Health Surveillance ───────────────────────────────────────────────
const VILLAGE_STATS = [
  { label: 'Fever Cases',        count: 12, icon: '🌡️', threshold: 10, category: 'fever' },
  { label: 'Respiratory Issues', count: 7,  icon: '😮',  threshold: 8,  category: 'respiratory' },
  { label: 'Skin Infections',    count: 3,  icon: '🔴',  threshold: 6,  category: 'skin' },
  { label: 'Injury Cases',       count: 3,  icon: '🩹',  threshold: 5,  category: 'injury' },
  { label: 'Weakness / Fatigue', count: 5,  icon: '😔',  threshold: 7,  category: 'weakness' },
  { label: 'Total Consultations',count: 38, icon: '📋',  threshold: 999, category: 'total' },
];

function getRiskLevel(count, threshold) {
  const ratio = count / threshold;
  if (ratio >= 1)    return { level: 'outbreak', color: '#ef4444', bg: '#fff7f7', label: '🔴 Alert' };
  if (ratio >= 0.75) return { level: 'elevated', color: '#f97316', bg: '#fff7ed', label: '🟡 High' };
  if (ratio >= 0.5)  return { level: 'moderate', color: '#eab308', bg: '#fefce8', label: '🟡 Watch' };
  return { level: 'normal', color: '#22c55e', bg: '#f0fdf4', label: '🟢 Normal' };
}

// ── Offline record queue mock ────────────────────────────────────────────────
const OFFLINE_QUEUE = [
  { type: 'Patient Registrations', count: 2, icon: '👤', color: '#6366f1' },
  { type: 'Vitals Entries',        count: 3, icon: '📈', color: '#22c55e' },
  { type: 'Consultation Requests', count: 1, icon: '📋', color: '#eab308' },
];
let OFFLINE_RECORDS = OFFLINE_QUEUE.reduce((s, q) => s + q.count, 0); // 6 total

export default function HWDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  useEffect(() => {
    const on  = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online',  on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  function handleSearch(q) {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    const lower = q.toLowerCase();
    const results = PATIENTS_EXTENDED.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      p.phone.includes(q) ||
      p.abha.toLowerCase().includes(lower) ||
      p.village.toLowerCase().includes(lower)
    );
    setSearchResults(results);
  }

  async function handleSync() {
    setSyncing(true);
    await new Promise(r => setTimeout(r, 1800));
    OFFLINE_RECORDS = 0;
    setSyncing(false);
    setSyncDone(true);
    setTimeout(() => setSyncDone(false), 3000);
  }

  const outbreakStats = VILLAGE_STATS.filter(s => getRiskLevel(s.count, s.threshold).level === 'outbreak');

  return (
    <div>
      <OfflineSyncBanner />

      {/* Header */}
      <div className="page-header">
        <h2>📊 Health Worker Dashboard</h2>
        <p>Welcome, Kavita ASW · Rampur Village</p>
      </div>

      {/* ── Offline Sync Banner ──────────────────────────────────────────── */}
      {!isOnline && (
        <div style={{ padding: '12px 16px', background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: '12px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '22px' }}>📡</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '14px', color: '#a35c07' }}>Offline Mode Active</div>
            <div style={{ fontSize: '12px', color: '#a16207' }}>
              {OFFLINE_RECORDS} patient record{OFFLINE_RECORDS !== 1 ? 's' : ''} pending sync · Will upload automatically when connected
            </div>
          </div>
        </div>
      )}
      {isOnline && OFFLINE_RECORDS > 0 && !syncDone && (
        <div style={{ marginBottom: '16px', background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '14px', overflow: 'hidden' }}>
          {/* Banner row */}
          <div style={{ padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '22px' }}>🔄</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#0369a1' }}>Back Online — Pending Sync</div>
              <div style={{ fontSize: '12px', color: '#0284c7' }}>{OFFLINE_RECORDS} records stored offline · Ready to upload</div>
            </div>
            <button onClick={handleSync} className="btn btn-sm btn-primary" style={{ background: '#0284c7' }} disabled={syncing}>
              {syncing ? '⏳ Syncing...' : '☁️ Sync All Records'}
            </button>
          </div>
          {/* Queue breakdown */}
          <div style={{ borderTop: '1px solid #bae6fd', padding: '10px 16px', display: 'flex', gap: '10px', flexWrap: 'wrap', background: '#e0f2fe20' }}>
            {OFFLINE_QUEUE.map(q => (
              <div key={q.type} style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '4px 10px', background: '#fff', borderRadius: '8px', border: `1px solid ${q.color}30` }}>
                <span>{q.icon}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0369a1' }}>{q.count}</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{q.type} pending</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {syncDone && (
        <div style={{ padding: '12px 16px', background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', marginBottom: '16px', fontWeight: 700, fontSize: '13px', color: '#15803d' }}>
          ✅ All records synced successfully!
        </div>
      )}

      {/* ── Health Camp Launch Banner ─────────────────────────────────────── */}
      <div style={{ marginBottom: '20px', padding: '14px 18px', background: 'linear-gradient(135deg, #1e1b4b, #312e81)', borderRadius: '14px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '28px' }}>⛺</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 900, fontSize: '15px', color: '#fff' }}>Village Health Camp Mode</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>Rapid multi-patient vitals entry for screening drives & camps</div>
        </div>
        <button onClick={() => navigate('/healthworker/health-camp')}
          style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px #6366f150' }}>
          ⛺ Start Health Camp
        </button>
        <button onClick={() => navigate('/healthworker/patients')}
          style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 16px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
          👥 Patient List
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 14px', background: '#fff', border: '2px solid #e2e8f0', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>🔍</span>
          <input
            type="text"
            placeholder="Search patient by name, phone number, or ABHA ID..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', fontFamily: 'inherit', background: 'transparent' }}
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#94a3b8' }}>✕</button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div style={{ position: 'absolute', zIndex: 100, top: '100%', left: 0, right: 0, marginTop: '4px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
            {searchResults.map(p => (
              <div key={p.id} onClick={() => { navigate('/healthworker/record-vitals'); setSearchQuery(''); setSearchResults([]); }}
                style={{ display: 'flex', gap: '12px', padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', transition: 'background 200ms' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '16px', flexShrink: 0 }}>
                  {p.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>{p.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>📍 {p.village} · {p.age}y · {p.bloodGroup}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{p.abha} · 📞 {p.phone}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b' }}>
                  <div style={{ fontWeight: 600 }}>Last visit</div>
                  <div>{p.lastConsultation}</div>
                  <div style={{ color: '#6366f1', fontWeight: 700 }}>{p.lastDiagnosis}</div>
                </div>
              </div>
            ))}
            <div style={{ padding: '8px 16px', fontSize: '11px', color: '#94a3b8', textAlign: 'center', background: '#f8fafc' }}>
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found · Click to view vitals
            </div>
          </div>
        )}
        {searchQuery && searchResults.length === 0 && (
          <div style={{ position: 'absolute', zIndex: 100, top: '100%', left: 0, right: 0, marginTop: '4px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
            No patients found for "{searchQuery}"
          </div>
        )}
      </div>

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '24px' }}>
        {[
          { label: 'Patients Registered', value: '142',    emoji: '👥', accent: '#6366f1' },
          { label: 'Vitals Recorded Today',value: '8',     emoji: '📈', accent: '#22c55e' },
          { label: 'Pending Consultations',value: '4',     emoji: '⏳', accent: '#eab308' },
          { label: 'Sync Status',          value: isOnline ? 'Online' : 'Offline', emoji: isOnline ? '🌐' : '📡', accent: isOnline ? '#10b981' : '#f97316' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ '--card-accent': s.accent }}>
            <div className="stat-card-icon" style={{ background: `${s.accent}20` }}>{s.emoji}</div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Village Health Surveillance ──────────────────────────────────── */}
      <div className="card" style={{ marginBottom: '20px', border: '2px solid #e2e8f0' }}>
        <div className="card-header" style={{ background: 'linear-gradient(135deg, #1e1b4b08, #6366f108)' }}>
          <div className="card-title">🏘️ Village Health Surveillance — Rampur</div>
          <span className="badge badge-blue">Week of Mar 10–16</span>
        </div>

        {/* Outbreak alerts */}
        {outbreakStats.length > 0 && (
          <div style={{ margin: '0 0 14px', padding: '12px 16px', background: '#fff7f7', border: '1.5px solid #fca5a5', borderRadius: '10px' }}>
            <div style={{ fontWeight: 800, fontSize: '14px', color: '#b91c1c', marginBottom: '4px' }}>🚨 Outbreak Alert Detected!</div>
            {outbreakStats.map(s => (
              <div key={s.category} style={{ fontSize: '13px', color: '#dc2626', fontWeight: 600 }}>
                ⚠️ Possible {s.label.toLowerCase()} outbreak in Rampur Village ({s.count} cases). Please notify health authorities.
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
          {VILLAGE_STATS.map(stat => {
            const risk = getRiskLevel(stat.count, stat.threshold);
            const pct  = Math.min(100, Math.round((stat.count / stat.threshold) * 100));
            return (
              <div key={stat.category} style={{ padding: '12px', background: risk.bg, border: `1.5px solid ${risk.color}30`, borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{stat.icon}</span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: risk.color, background: `${risk.color}15`, padding: '2px 6px', borderRadius: '100px' }}>{risk.label}</span>
                </div>
                <div style={{ fontWeight: 900, fontSize: '22px', color: '#0f172a', marginBottom: '2px' }}>{stat.count}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#374151' }}>{stat.label}</div>
                {/* Mini progress */}
                {stat.category !== 'total' && (
                  <div style={{ marginTop: '8px', height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, background: risk.color, borderRadius: '2px', transition: 'width 600ms' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '12px', fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
          🔄 Auto-updates as vitals and symptoms are recorded · Threshold alerts trigger at elevated levels
        </div>
      </div>

      {/* ── Recent Vitals + Patients ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <div className="card-header"><div className="card-title">📋 Recent Vitals Recorded</div></div>
          {mockVitals.map(v => (
            <div key={v.id} style={{ padding: '12px', borderRadius: '10px', background: '#f8fafc', marginBottom: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{v.patient}</div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{v.date}</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="badge badge-blue">🌡️ {v.temperature}</span>
                <span className={`badge ${parseInt(v.bp) > 140 ? 'badge-red' : 'badge-green'}`}>💗 {v.bp}</span>
                <span className="badge badge-purple">❤️ {v.pulse} bpm</span>
                <span className={`badge ${v.oxygen < 95 ? 'badge-red' : 'badge-green'}`}>O₂ {v.oxygen}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">👥 Recent Patients</div></div>
          {PATIENTS_EXTENDED.slice(0, 4).map(p => (
            <div key={p.id} onClick={() => navigate('/healthworker/record-vitals')}
              style={{ display: 'flex', gap: '12px', padding: '10px', borderRadius: '10px', background: '#f8fafc', marginBottom: '8px', border: '1px solid #e2e8f0', alignItems: 'center', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
              onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '15px', flexShrink: 0 }}>
                {p.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{p.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>🏘️ {p.village} · {p.age}y</div>
                <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 600 }}>Last: {p.lastDiagnosis}</div>
              </div>
              <button className="btn btn-sm btn-ghost" style={{ fontSize: '11px' }}>View →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
