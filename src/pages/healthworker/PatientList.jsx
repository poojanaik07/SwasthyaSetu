import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Shared patient data ───────────────────────────────────────────────────────
const ALL_PATIENTS = [
  { id:'P001', name:'Ramesh Kumar',  age:42, village:'Rampur',    phone:'9876543210', abha:'ABHA-123456', bloodGroup:'B+', lastConsultation:'2026-03-11', lastDiagnosis:'Viral Fever',            risk:'high',   riskReason:'Hypertension, Diabetes' },
  { id:'P002', name:'Sunita Devi',   age:35, village:'Bhagalpur', phone:'9812345678', abha:'ABHA-234567', bloodGroup:'O+', lastConsultation:'2026-03-12', lastDiagnosis:'Respiratory Infection',  risk:'high',   riskReason:'SpO₂ 93%, High BP' },
  { id:'P003', name:'Mohan Lal',     age:28, village:'Chandpur',  phone:'9898765432', abha:'ABHA-345678', bloodGroup:'A+', lastConsultation:'2026-03-10', lastDiagnosis:'Allergic Dermatitis',    risk:'low',    riskReason:'' },
  { id:'P004', name:'Geeta Bai',     age:55, village:'Kota Gaon', phone:'9876001234', abha:'ABHA-456789', bloodGroup:'AB+',lastConsultation:'2026-03-08', lastDiagnosis:'Hypertension',           risk:'high',   riskReason:'BP 148/92 recorded' },
  { id:'P005', name:'Arjun Patel',   age:19, village:'Rampur',    phone:'9811223344', abha:'ABHA-567890', bloodGroup:'O-', lastConsultation:'2026-03-09', lastDiagnosis:'Injury / Fracture',      risk:'medium', riskReason:'Follow-up required' },
  { id:'P006', name:'Priya Kumari',  age:30, village:'Nandpur',   phone:'9800112233', abha:'ABHA-678901', bloodGroup:'B-', lastConsultation:'2026-03-12', lastDiagnosis:'Dengue Fever',           risk:'high',   riskReason:'Platelet count low' },
  { id:'P007', name:'Lakshmi Bai',   age:62, village:'Rampur',    phone:'9800091234', abha:'ABHA-789012', bloodGroup:'A+', lastConsultation:'2026-03-07', lastDiagnosis:'Diabetes Management',    risk:'medium', riskReason:'Blood sugar elevated' },
  { id:'P008', name:'Suresh Verma',  age:47, village:'Rampur',    phone:'9887766554', abha:'ABHA-890123', bloodGroup:'B+', lastConsultation:'2026-03-06', lastDiagnosis:'Chest Pain evaluation', risk:'high',   riskReason:'Cardiac history' },
  { id:'P009', name:'Kavita Singh',  age:25, village:'Bhagalpur', phone:'9876543001', abha:'ABHA-901234', bloodGroup:'O+', lastConsultation:'2026-03-13', lastDiagnosis:'Prenatal Checkup',       risk:'low',    riskReason:'' },
  { id:'P010', name:'Deepak Rao',    age:33, village:'Chandpur',  phone:'9811002233', abha:'ABHA-012345', bloodGroup:'A-', lastConsultation:'2026-03-05', lastDiagnosis:'Malaria',                risk:'medium', riskReason:'Requires follow-up' },
];

const RISK_STYLE = {
  high:   { color:'#ef4444', bg:'#fff7f7', border:'#fca5a5', label:'🔴 High Risk',   badge:'badge-red' },
  medium: { color:'#f97316', bg:'#fff7ed', border:'#fed7aa', label:'🟡 Medium',       badge:'badge-yellow' },
  low:    { color:'#22c55e', bg:'#f0fdf4', border:'#86efac', label:'🟢 Low Risk',    badge:'badge-green' },
};

const FILTERS = [
  { key:'all',    label:'All Patients' },
  { key:'high',   label:'🔴 High Risk' },
  { key:'medium', label:'🟡 Medium Risk' },
  { key:'low',    label:'🟢 Low Risk' },
  { key:'recent', label:'📅 Recent (3 days)' },
];

function daysSince(dateStr) {
  const d = new Date(dateStr);
  return Math.floor((Date.now() - d) / 86400000);
}

export default function PatientList() {
  const navigate = useNavigate();
  const [query, setQuery]   = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = ALL_PATIENTS.filter(p => {
    const matchQuery = !query.trim() ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.phone.includes(query) ||
      p.abha.toLowerCase().includes(query.toLowerCase()) ||
      p.village.toLowerCase().includes(query.toLowerCase());
    
    const matchFilter =
      filter === 'all'    ? true :
      filter === 'recent' ? daysSince(p.lastConsultation) <= 3 :
      p.risk === filter;

    return matchQuery && matchFilter;
  });

  const counts = {
    all: ALL_PATIENTS.length,
    high: ALL_PATIENTS.filter(p => p.risk === 'high').length,
    medium: ALL_PATIENTS.filter(p => p.risk === 'medium').length,
    low: ALL_PATIENTS.filter(p => p.risk === 'low').length,
    recent: ALL_PATIENTS.filter(p => daysSince(p.lastConsultation) <= 3).length,
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h2>👥 Village Patient List</h2>
        <p>Rampur Village · {ALL_PATIENTS.length} registered patients</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { label:'Total', value: ALL_PATIENTS.length, color:'#6366f1', emoji:'👥' },
          { label:'High Risk', value: counts.high,   color:'#ef4444', emoji:'🔴' },
          { label:'Medium Risk',value: counts.medium, color:'#f97316', emoji:'🟡' },
          { label:'Low Risk',  value: counts.low,    color:'#22c55e', emoji:'🟢' },
          { label:'Recent Visits',value: counts.recent, color:'#0ea5e9', emoji:'📅' },
        ].map(s => (
          <div key={s.label} style={{ padding:'10px 16px', background:`${s.color}10`, border:`1.5px solid ${s.color}30`, borderRadius:'12px', display:'flex', gap:'8px', alignItems:'center', minWidth:'100px' }}>
            <span style={{ fontSize:'20px' }}>{s.emoji}</span>
            <div>
              <div style={{ fontWeight:900, fontSize:'22px', color:s.color, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:'11px', fontWeight:600, color:'#64748b' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'16px', flexWrap:'wrap' }}>
        {/* Search */}
        <div style={{ position:'relative', flex:1, minWidth:'220px' }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:'16px' }}>🔍</span>
          <input
            className="form-input"
            style={{ paddingLeft:'36px' }}
            placeholder="Search by name, village, phone, or ABHA ID..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        {/* Filter pills */}
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {FILTERS.map(f => (
            <button key={f.key}
              onClick={() => setFilter(f.key)}
              className={`btn btn-sm ${filter === f.key ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize:'12px' }}>
              {f.label} {counts[f.key] !== undefined ? `(${counts[f.key]})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Patient table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'40px', color:'#94a3b8', fontSize:'14px' }}>
          <div style={{ fontSize:'3rem', marginBottom:'10px' }}>🔍</div>
          No patients found matching your search.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          {filtered.map(p => {
            const rs = RISK_STYLE[p.risk];
            const days = daysSince(p.lastConsultation);
            const isSelected = selected === p.id;
            return (
              <div key={p.id}
                onClick={() => setSelected(isSelected ? null : p.id)}
                style={{
                  background: isSelected ? '#f0f4ff' : '#fff',
                  border: `1.5px solid ${isSelected ? '#6366f1' : '#e2e8f0'}`,
                  borderLeft: `4px solid ${rs.color}`,
                  borderRadius:'12px',
                  padding:'12px 16px',
                  cursor:'pointer',
                  transition:'all 180ms',
                }}>
                <div style={{ display:'flex', gap:'12px', alignItems:'center', flexWrap:'wrap' }}>
                  {/* Avatar */}
                  <div style={{ width:40, height:40, borderRadius:'50%', background:`linear-gradient(135deg, #6366f1, #8b5cf6)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:'17px', flexShrink:0 }}>
                    {p.name.charAt(0)}
                  </div>
                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:800, fontSize:'14px', color:'#0f172a' }}>{p.name}</div>
                    <div style={{ fontSize:'12px', color:'#64748b', marginTop:'2px' }}>
                      🏘️ {p.village} &nbsp;·&nbsp; {p.age}y &nbsp;·&nbsp; 🩸 {p.bloodGroup} &nbsp;·&nbsp; 📞 {p.phone}
                    </div>
                    <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'2px' }}>{p.abha}</div>
                  </div>
                  {/* Last consultation */}
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontSize:'12px', color:'#64748b', fontWeight:600 }}>{p.lastConsultation}</div>
                    <div style={{ fontSize:'11px', color:'#6366f1', fontWeight:700, marginTop:'2px' }}>{p.lastDiagnosis}</div>
                    <div style={{ fontSize:'10px', color:'#94a3b8' }}>{days === 0 ? 'Today' : `${days}d ago`}</div>
                  </div>
                  {/* Risk badge */}
                  <div style={{ flexShrink:0 }}>
                    <span className={`badge ${rs.badge}`} style={{ fontWeight:800, fontSize:'11px', whiteSpace:'nowrap' }}>
                      {rs.label}
                    </span>
                    {p.riskReason && <div style={{ fontSize:'10px', color:'#94a3b8', marginTop:'3px', maxWidth:'110px', textAlign:'right' }}>{p.riskReason}</div>}
                  </div>
                </div>

                {/* Expanded row */}
                {isSelected && (
                  <div style={{ marginTop:'12px', paddingTop:'12px', borderTop:'1px dashed #e2e8f0', display:'flex', gap:'10px', flexWrap:'wrap' }}>
                    <button className="btn btn-sm btn-primary" onClick={e => { e.stopPropagation(); navigate('/healthworker/record-vitals'); }}>
                      📈 Record Vitals
                    </button>
                    <button className="btn btn-sm btn-ghost" onClick={e => { e.stopPropagation(); navigate('/healthworker/consultation-requests'); }}>
                      📋 Consultation
                    </button>
                    <button className="btn btn-sm btn-ghost" onClick={e => e.stopPropagation()}>
                      📞 Call {p.phone}
                    </button>
                    <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', padding:'4px 10px', background: rs.bg, border:`1px solid ${rs.border}`, borderRadius:'8px', color: rs.color, fontWeight:700 }}>
                      ⚕️ {p.lastDiagnosis}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop:'16px', padding:'10px 14px', background:'#f0f4ff', borderRadius:'10px', fontSize:'12px', color:'#4338ca', fontWeight:600, textAlign:'center' }}>
        🔴 High risk patients are those with chronic conditions or critical vitals. Click any row to expand options.
      </div>
    </div>
  );
}
