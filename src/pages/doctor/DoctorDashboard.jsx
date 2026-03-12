import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockConsultations } from '../../utils/mockData';
import { Clock, Activity, AlertTriangle } from 'lucide-react';

// ── Case status workflow ──────────────────────────────────────────────────────
const STATUS_OPTIONS = ['Pending', 'Under Review', 'Diagnosed', 'Follow-Up Required', 'Closed'];
const STATUS_COLOR = {
  'Pending':            { bg:'#fef9c3', color:'#a16207', border:'#fde68a' },
  'Under Review':       { bg:'#eff6ff', color:'#1d4ed8', border:'#bfdbfe' },
  'Diagnosed':          { bg:'#f0fdf4', color:'#15803d', border:'#86efac' },
  'Follow-Up Required': { bg:'#fff7ed', color:'#c2410c', border:'#fed7aa' },
  'Closed':             { bg:'#f8fafc', color:'#64748b', border:'#e2e8f0' },
};

// ── Village disease analytics mock ───────────────────────────────────────────
const DISEASE_TRENDS = [
  { label:'Fever Cases',         count:18, prevCount:6, icon:'🌡️', threshold:15, village:'Rampur' },
  { label:'Respiratory Issues',  count:7,  prevCount:6, icon:'😮',  threshold:10, village:'Bhagalpur' },
  { label:'Skin Infections',     count:4,  prevCount:5, icon:'🔴',  threshold:8,  village:'Rampur' },
  { label:'Hypertension Cases',  count:9,  prevCount:8, icon:'💓',  threshold:8,  village:'Chandpur' },
  { label:'Diabetes Follow-ups', count:5,  prevCount:5, icon:'💉',  threshold:10, village:'Kota Gaon' },
  { label:'Total Consultations', count:48, prevCount:42,icon:'📋',  threshold:999,village:'All' },
];

function getRisk(count, threshold) {
  const r = count / threshold;
  if (r >= 1)    return { color:'#ef4444', bg:'#fff7f7', label:'🔴 Alert' };
  if (r >= 0.75) return { color:'#f97316', bg:'#fff7ed', label:'🟡 High' };
  return { color:'#22c55e', bg:'#f0fdf4', label:'🟢 Normal' };
}

// Patient history mock panel
const PATIENT_HISTORY = {
  default: {
    profile: { name:'Ramesh Kumar', age:42, village:'Rampur', blood:'B+', phone:'9876543210', abha:'ABHA-123456' },
    vitals: [
      { date:'Mar 11', temp:'99.2°F', bp:'130/85', o2:'97%', pulse:'88' },
      { date:'Mar 05', temp:'100.4°F', bp:'135/88', o2:'96%', pulse:'92' },
      { date:'Feb 20', temp:'98.6°F', bp:'128/82', o2:'98%', pulse:'76' },
    ],
    consultations: [
      { date:'Mar 11, 2026', symptoms:'Fever, headache, body ache', diagnosis:'Viral Fever', doctor:'Dr. Priya Sharma', rx:['Paracetamol 500mg','ORS Sachet'] },
      { date:'Feb 20, 2026', symptoms:'Chest pain on exertion', diagnosis:'Hypertensive Episode', doctor:'Dr. Arjun Mehta', rx:['Amlodipine 5mg'] },
    ],
  },
};

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const pending   = mockConsultations.filter(c => c.status === 'pending');
  const moderate  = mockConsultations.filter(c => c.priority === 'moderate');
  const severe    = mockConsultations.filter(c => c.priority === 'severe');
  
  const [caseStatus, setCaseStatus] = useState({});
  const [historyOpen, setHistoryOpen] = useState(null);

  const sorted = [...mockConsultations].sort((a, b) => {
    const o = { severe: 0, moderate: 1, mild: 2 };
    return (o[a.priority] ?? 2) - (o[b.priority] ?? 2);
  });

  const outbreaks = DISEASE_TRENDS.filter(d => d.count >= d.threshold && d.label !== 'Total Consultations');

  return (
    <div>
      {/* Greeting */}
      <div className="greeting-banner" style={{ background:'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)' }}>
        <h2>Namaskar, Dr. {user?.name || 'Sharma'} 👨‍⚕️</h2>
        <p>District Hospital General Physician · Rural Outreach</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1.2fr', gap:'20px', marginBottom:'24px' }}>
        
        {/* DOCTOR WORKLOAD INSIGHTS */}
        <div className="card">
          <div className="card-header"><div className="card-title" style={{ display:'flex', alignItems:'center', gap:'6px' }}><Activity size={18} color="#6366f1" /> Doctor Workload Insight</div></div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
            <div style={{ padding:'12px', background:'#f8fafc', borderRadius:'10px', border:'1px solid #e2e8f0', textAlign:'center' }}>
              <div style={{ fontSize:'24px', fontWeight:900, color:'#0f172a' }}>{pending.length}</div>
              <div style={{ fontSize:'11px', fontWeight:700, color:'#64748b' }}>Pending Cases</div>
            </div>
            <div style={{ padding:'12px', background:'#fefce8', borderRadius:'10px', border:'1px solid #fef08a', textAlign:'center' }}>
              <div style={{ fontSize:'24px', fontWeight:900, color:'#a16207' }}>{moderate.length}</div>
              <div style={{ fontSize:'11px', fontWeight:700, color:'#a16207' }}>Moderate Cases</div>
            </div>
            <div style={{ padding:'12px', background:'#fef2f2', borderRadius:'10px', border:'1px solid #fecaca', textAlign:'center' }}>
              <div style={{ fontSize:'24px', fontWeight:900, color:'#b91c1c' }}>{severe.length}</div>
              <div style={{ fontSize:'11px', fontWeight:700, color:'#b91c1c' }}>Severe Cases</div>
            </div>
            <div style={{ padding:'12px', background:'#f0fdf4', borderRadius:'10px', border:'1px solid #86efac', textAlign:'center' }}>
              <div style={{ fontSize:'24px', fontWeight:900, color:'#15803d' }}>18m</div>
              <div style={{ fontSize:'11px', fontWeight:700, color:'#15803d' }}>Avg Response</div>
            </div>
          </div>
        </div>

        {/* RURAL DISEASE EARLY WARNING SYSTEM */}
        <div className="card" style={{ border:'1.5px solid #e2e8f0', background:'#f8fafc' }}>
          <div className="card-header"><div className="card-title" style={{ color:'#b91c1c', display:'flex', alignItems:'center', gap:'6px' }}><AlertTriangle size={18} /> Disease Early Warning</div></div>
          {outbreaks.length > 0 ? (
            <div>
              {outbreaks.map(d => (
                <div key={d.label} style={{ marginBottom:'12px', padding:'10px', background:'#fff', borderLeft:'3px solid #ef4444', borderRadius:'0 8px 8px 0', borderTop:'1px solid #fca5a5', borderRight:'1px solid #fca5a5', borderBottom:'1px solid #fca5a5' }}>
                  <div style={{ fontWeight:800, fontSize:'13px', color:'#991b1b', marginBottom:'4px' }}>📍 {d.village} Village</div>
                  <div style={{ fontSize:'12px', color:'#475569', marginBottom:'6px' }}>{d.label} increased from <strong>{d.prevCount}</strong> to <strong>{d.count}</strong> this week.</div>
                  <div style={{ fontWeight:700, fontSize:'12px', color:'#ef4444' }}>⚠️ Possible {d.label.replace(' Cases', '')} Outbreak Detected.</div>
                  <div style={{ marginTop:'6px', display:'flex', gap:'4px', flexWrap:'wrap' }}>
                    <span style={{ fontSize:'10px', padding:'2px 6px', background:'#f1f5f9', borderRadius:'4px', color:'#475569' }}>🔍 Increase monitoring</span>
                    <span style={{ fontSize:'10px', padding:'2px 6px', background:'#f1f5f9', borderRadius:'4px', color:'#475569' }}>🩺 Conduct screening</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize:'13px', color:'#475569', padding:'20px 0', textAlign:'center' }}>🟢 No anomalous disease patterns detected this week.</div>
          )}
        </div>
      </div>

      {/* ── Priority Cases with Status Workflow ───────────────────────────── */}
      <div className="section-title" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span>🚨 Incoming Patient Queue</span>
        
        {/* Status legend */}
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {STATUS_OPTIONS.map(s => {
            const st = STATUS_COLOR[s];
            return (
              <span key={s} style={{ fontSize:'11px', fontWeight:700, padding:'3px 9px', borderRadius:'100px', background:st.bg, color:st.color, border:`1px solid ${st.border}` }}>
                {s}
              </span>
            );
          })}
        </div>
      </div>

      <div className="consultation-list">
        {sorted.map(c => {
          const status    = caseStatus[c.id] || 'Pending';
          const st        = STATUS_COLOR[status];
          const hist      = PATIENT_HISTORY.default;
          const isHistory = historyOpen === c.id;

          return (
            <div key={c.id} className={`consultation-card priority-${c.priority}`}
              style={{ borderLeft:`4px solid ${c.priority==='severe'?'#ef4444':c.priority==='moderate'?'#eab308':'#22c55e'}` }}>
              <div className="consultation-avatar" style={{ background:c.priority==='severe'?'#ef4444':c.priority==='moderate'?'#eab308':'#22c55e', color:'#fff' }}>{c.patientName.charAt(0)}</div>

              <div className="consultation-info" style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
                  <div>
                    <div className="consultation-name">{c.patientName}, {c.age}y</div>
                    <div className="consultation-meta">🏘️ {c.village} · {c.specialty} · {c.date}</div>
                  </div>
                  <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', alignItems:'center' }}>
                    <span className={`badge ${c.priority==='severe'?'badge-red':c.priority==='moderate'?'badge-yellow':'badge-green'}`}>
                      {c.priority==='severe'?'🔴':c.priority==='moderate'?'🟡':'🟢'} {c.priority.toUpperCase()}
                    </span>
                    {/* Editable case status */}
                    <select
                      value={status}
                      onChange={e => setCaseStatus(prev => ({ ...prev, [c.id]: e.target.value }))}
                      style={{ fontSize:'11px', fontWeight:700, padding:'3px 8px', borderRadius:'8px', border:`1.5px solid ${st.border}`, background:st.bg, color:st.color, cursor:'pointer', fontFamily:'inherit', outline:'none' }}>
                      {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="consultation-symptoms" style={{ marginTop:'8px' }}>🩺 <em>{c.symptoms}</em></div>

                {/* Patient history panel */}
                {isHistory && (
                  <div style={{ marginTop:'12px', padding:'14px', background:'#f8fafc', borderRadius:'12px', border:'1px solid #e2e8f0', fontSize:'13px' }}>
                    <div style={{ fontWeight:800, fontSize:'14px', color:'#0f172a', marginBottom:'10px' }}>📋 Patient Medical History</div>
                    {/* Profile */}
                    {(() => {
                      const tags = [
                        { l:'Age',     v: hist.profile.age + 'y' },
                        { l:'Village', v: hist.profile.village },
                        { l:'Blood',   v: hist.profile.blood },
                        { l:'ABHA',    v: hist.profile.abha },
                        { l:'Phone',   v: hist.profile.phone },
                      ];
                      return (
                        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'10px' }}>
                          {tags.map(({ l, v }) => (
                            <span key={l} style={{ fontSize:'11px', padding:'3px 8px', background:'#eff6ff', borderRadius:'8px', color:'#1d4ed8', fontWeight:700 }}>{l}: {v}</span>
                          ))}
                        </div>
                      );
                    })()}
                    {/* Vitals timeline */}
                    <div style={{ fontWeight:700, color:'#374151', marginBottom:'6px' }}>📈 Vitals History</div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'6px', marginBottom:'10px' }}>
                      {hist.vitals.map(v => (
                        <div key={v.date} style={{ padding:'8px 10px', background:'#fff', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'12px' }}>
                          <div style={{ fontWeight:700, color:'#6366f1', marginBottom:'4px' }}>{v.date}</div>
                          <div>🌡️ {v.temp} · 💗 {v.bp}</div>
                          <div>O₂ {v.o2} · 💓 {v.pulse} bpm</div>
                        </div>
                      ))}
                    </div>
                    {/* Consultation timeline */}
                    <div style={{ fontWeight:700, color:'#374151', marginBottom:'6px' }}>🕐 Consultation Timeline</div>
                    {hist.consultations.map((con, ci) => (
                      <div key={ci} style={{ paddingLeft:'12px', borderLeft:'3px solid #6366f1', marginBottom:'10px' }}>
                        <div style={{ fontWeight:700, fontSize:'12px', color:'#6366f1' }}>{con.date}</div>
                        <div style={{ color:'#374151' }}>🩺 <em>{con.symptoms}</em></div>
                        <div style={{ fontWeight:700, color:'#0f172a' }}>Dx: {con.diagnosis}</div>
                        <div style={{ fontSize:'11px', color:'#64748b' }}>💊 {con.rx.join(', ')} · {con.doctor}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="consultation-actions" style={{ marginTop:'10px' }}>
                  <button className="btn btn-sm btn-primary" onClick={() => navigate('/doctor/diagnosis')}>✍️ Write Diagnosis</button>
                  <button className="btn btn-sm btn-ghost" onClick={() => setHistoryOpen(isHistory ? null : c.id)}>
                    📋 {isHistory ? 'Hide History' : 'View History'}
                  </button>
                  <button className="btn btn-sm btn-ghost" onClick={() => navigate('/doctor/incoming-consultations')}>📥 All Cases</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
