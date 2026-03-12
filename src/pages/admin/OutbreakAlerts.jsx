import React, { useState } from 'react';
import OutbreakMap from '../../components/OutbreakMap';
import { mockAdminStats } from '../../utils/mockData';
import { X, FileText, Ambulance, Bell, ShieldAlert, CheckCircle } from 'lucide-react';

const STATUS_COLORS = { alert: '#ef4444', watch: '#eab308', clear: '#22c55e' };

export default function OutbreakAlerts() {
  const [reportModal, setReportModal] = useState(null);
  const [dispatchModal, setDispatchModal] = useState(null);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);
  
  const [dispatchOptions, setDispatchOptions] = useState({
    mmu: false, ambulance: false, doctors: false, workers: false, advisory: false
  });

  const handleDispatch = (e) => {
    e.preventDefault();
    setDispatchSuccess(true);
    setTimeout(() => {
      setDispatchSuccess(false);
      setDispatchModal(null);
      setDispatchOptions({ mmu: false, ambulance: false, doctors: false, workers: false, advisory: false });
    }, 2500);
  };

  return (
    <div>
      <div className="page-header">
        <h2>🚨 Outbreak Alerts</h2>
        <p>Real-time disease surveillance across all villages</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ padding: '10px 16px', background: '#fee2e2', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#b91c1c', fontSize: '14px' }}>
          🔴 {mockAdminStats.outbreakAlerts.filter(a => a.status === 'alert').length} Active Outbreaks
        </div>
        <div style={{ padding: '10px 16px', background: '#fef9c3', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#a16207', fontSize: '14px' }}>
          🟡 {mockAdminStats.outbreakAlerts.filter(a => a.status === 'watch').length} Watch Zones
        </div>
        <div style={{ padding: '10px 16px', background: '#dcfce7', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#15803d', fontSize: '14px' }}>
          🟢 {mockAdminStats.villages.filter(v => v.status === 'clear').length} Clear Villages
        </div>
      </div>

      {/* AI OUTBREAK ALERT CARD */}
      <div className="card" style={{ marginBottom: '24px', borderLeft: '4px solid #8b5cf6', background: 'linear-gradient(to right, #fff, #f5f3ff)' }}>
        <div className="card-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6d28d9' }}>
             AI Outbreak Prediction
          </div>
        </div>
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
             Possible Dengue outbreak in Ramapur next week.
          </div>
          <div style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
            <strong>Basis:</strong> Anomalous spike in high fever and body ache symptoms (↑45%) over the last 96 hours.
          </div>
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-red">Risk Level: HIGH</span>
            <span className="badge badge-blue">Confidence: 87%</span>
          </div>
        </div>
      </div>

      {/* Live Map */}
      <div style={{ marginBottom: '24px' }}>
        <OutbreakMap onOpenReport={setReportModal} onOpenDispatch={setDispatchModal} />
      </div>

      {/* Alert Details */}
      <div className="card">
        <div className="card-header"><div className="card-title">🔔 Active Alerts</div></div>
        {mockAdminStats.outbreakAlerts.map((a, i) => (
          <div key={i} style={{
            display: 'flex', gap: '12px', alignItems: 'center', padding: '14px',
            borderRadius: '10px', marginBottom: '8px',
            background: a.status === 'alert' ? '#fff7f7' : '#fffbeb',
            border: `1px solid ${a.status === 'alert' ? '#fca5a5' : '#fde68a'}`
          }}>
            <div style={{ fontSize: '2rem' }}>{a.status === 'alert' ? '🔴' : '🟡'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '15px' }}>{a.village} – {a.disease}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                {a.cases} cases reported · Status: <strong style={{ color: STATUS_COLORS[a.status] }}>{a.status.toUpperCase()}</strong>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="btn btn-sm btn-outline" onClick={() => setReportModal(a)}>
                <FileText size={16} style={{ marginRight: '6px' }} /> Case Report
              </button>
              <button className="btn btn-sm btn-primary" onClick={() => setDispatchModal(a)}>
                <Ambulance size={16} style={{ marginRight: '6px' }} /> Dispatch Team
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CASE REPORT MODAL */}
      {reportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', margin: '20px', padding: '0', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, background: '#fff', zIndex: 2 }}>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="#475569" /> Outbreak Case Report: {reportModal.village}
              </div>
              <button className="btn btn-ghost" style={{ padding: '4px' }} onClick={() => setReportModal(null)}><X size={20} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>DISEASE TYPE</div>
                  <div style={{ fontSize: '16px', fontWeight: 800 }}>{reportModal.disease}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>TOTAL CASES</div>
                  <div style={{ fontSize: '16px', fontWeight: 800 }}>{reportModal.cases} Recorded</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>SEVERITY LEVEL</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: STATUS_COLORS[reportModal.status] }}>{reportModal.status.toUpperCase()}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>TIMELINE</div>
                  <div style={{ fontSize: '16px', fontWeight: 800 }}>Last 48 Hours</div>
                </div>
              </div>

              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>AFFECTED PATIENTS (SAMPLE)</h4>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '24px', fontSize: '13px', color: '#334155' }}>
                <li style={{ padding: '8px 0', borderBottom: '1px dashed #e2e8f0' }}>Ramesh Kumar (M/42) - High Fever, Chills</li>
                <li style={{ padding: '8px 0', borderBottom: '1px dashed #e2e8f0' }}>Sunita Devi (F/35) - Severe Body Ache</li>
                <li style={{ padding: '8px 0', borderBottom: '1px dashed #e2e8f0' }}>Aakash Singh (M/12) - Fever, Vomiting</li>
                <li style={{ padding: '8px 0', color: '#64748b', fontStyle: 'italic' }}>...and {reportModal.cases - 3} others.</li>
              </ul>

              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>RECOMMENDED MEDICAL RESPONSE</h4>
              <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
                Immediate dispatch of paracetamol, ORS, and IV fluids to the local PHC. Initiate vector control measures (fogging) immediately in residential clusters. Isolate extreme cases and monitor hydration levels hourly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DISPATCH TEAM MODAL */}
      {dispatchModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '20px', padding: '0' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c' }}>
                <ShieldAlert size={20} /> Rapid Response Control Panel
              </div>
              <button className="btn btn-ghost" style={{ padding: '4px' }} onClick={() => setDispatchModal(null)}><X size={20} /></button>
            </div>
            
            {dispatchSuccess ? (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <CheckCircle size={48} color="#22c55e" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#15803d', marginBottom: '8px' }}>Emergency Response Initiated!</h3>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Teams have been dispatched successfully to {dispatchModal.village}. Alerts are sending now.</p>
              </div>
            ) : (
              <form onSubmit={handleDispatch} style={{ padding: '20px' }}>
                <p style={{ fontSize: '14px', color: '#334155', marginBottom: '20px', fontWeight: 600 }}>
                  Initiate immediate response actions for the {dispatchModal.disease} outbreak in {dispatchModal.village}:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', background: dispatchOptions.mmu ? '#f0f9ff' : '#fff' }}>
                    <input type="checkbox" style={{ width: '18px', height: '18px' }} checked={dispatchOptions.mmu} onChange={e => setDispatchOptions({...dispatchOptions, mmu: e.target.checked})} />
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>🚐 Dispatch Mobile Medical Unit (MMU)</span>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', background: dispatchOptions.ambulance ? '#f0f9ff' : '#fff' }}>
                    <input type="checkbox" style={{ width: '18px', height: '18px' }} checked={dispatchOptions.ambulance} onChange={e => setDispatchOptions({...dispatchOptions, ambulance: e.target.checked})} />
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>🚑 Send Emergency Ambulance</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', background: dispatchOptions.doctors ? '#f0f9ff' : '#fff' }}>
                    <input type="checkbox" style={{ width: '18px', height: '18px' }} checked={dispatchOptions.doctors} onChange={e => setDispatchOptions({...dispatchOptions, doctors: e.target.checked})} />
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>👨‍⚕️ Notify District/Nearby Doctors</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', background: dispatchOptions.workers ? '#f0f9ff' : '#fff' }}>
                    <input type="checkbox" style={{ width: '18px', height: '18px' }} checked={dispatchOptions.workers} onChange={e => setDispatchOptions({...dispatchOptions, workers: e.target.checked})} />
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>📱 Alert Local Health Workers (ASHA/ANM)</span>
                  </label>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ width: '16px', height: '16px' }} checked={dispatchOptions.advisory} onChange={e => setDispatchOptions({...dispatchOptions, advisory: e.target.checked})} />
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#b91c1c' }}>Broadcast Village Health Advisory (SMS)</span>
                  </label>
                  <textarea 
                    disabled={!dispatchOptions.advisory}
                    className="form-input" 
                    style={{ height: '80px', fontSize: '13px', background: !dispatchOptions.advisory ? '#f1f5f9' : '#fff' }}
                    defaultValue={`"${dispatchModal.disease} alert in ${dispatchModal.village}. Prevent mosquito breeding and seek medical help if fever persists."`}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setDispatchModal(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ background: '#b91c1c', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={16} /> Execute Response Plan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
