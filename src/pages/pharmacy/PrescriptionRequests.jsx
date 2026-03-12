import React, { useState } from 'react';
import { mockPrescriptionRequests, mockPharmacies } from '../../utils/mockData';
import { CheckCircle, Package, AlertTriangle, RefreshCw, MapPin, UserCheck, CheckSquare, XCircle, Send } from 'lucide-react';

export default function PrescriptionRequests() {
  const [requests, setRequests] = useState(mockPrescriptionRequests);
  const [substituteModal, setSubstituteModal] = useState(null);
  const [nearbyModal, setNearbyModal] = useState(null);
  const [subData, setSubData] = useState({ unavailable: '', alternative: '' });

  const updateStatus = (id, newStatus) => {
    setRequests(r => r.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  const handleSubstitute = (e) => {
    e.preventDefault();
    setRequests(r => r.map(req => req.id === substituteModal ? {
      ...req,
      suggestion: `Suggested ${subData.alternative} instead of ${subData.unavailable}`,
      status: 'pending_patient_approval' // mock a status
    } : req));
    setSubstituteModal(null);
    setSubData({ unavailable: '', alternative: '' });
  };

  const handleRedirect = (reqId, pharmaName) => {
    setRequests(r => r.map(req => req.id === reqId ? {
      ...req,
      status: 'redirected',
      suggestion: `Redirected to ${pharmaName}`
    } : req));
    setNearbyModal(null);
  };

  return (
    <div>
      <div className="page-header">
        <h2>📋 Prescription Requests</h2>
        <p>Doctor-sent prescriptions awaiting pharmacy processing</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {requests.map(p => {
          const isEmergency = p.priority === 'severe';
          
          return (
            <div key={p.id} className="card" style={{ 
              borderLeft: `4px solid ${isEmergency ? '#ef4444' : p.status === 'confirmed' ? '#3b82f6' : p.status === 'ready' ? '#22c55e' : p.status === 'picked_up' ? '#94a3b8' : '#eab308'}`,
              background: isEmergency && p.status === 'pending' ? '#fff5f5' : '#fff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    👤 {p.patient}
                    {isEmergency && <span className="badge badge-red" style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={12} /> URGENT MEDICINE REQUEST - Severe Case</span>}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Prescribed by {p.doctor} · {p.date}</div>
                </div>
                
                <span className={`badge ${p.status === 'picked_up' ? 'badge-gray' : p.status === 'ready' ? 'badge-green' : p.status === 'confirmed' ? 'badge-blue' : p.status === 'redirected' ? 'badge-gray' : 'badge-yellow'}`} style={{ padding: '6px 12px', fontSize: '13px' }}>
                  {p.status === 'picked_up' ? '📦 Picked Up' :
                   p.status === 'ready' ? '✅ Ready for Pickup' : 
                   p.status === 'confirmed' ? '⚙️ Packing in Progress' : 
                   p.status === 'redirected' ? '↪️ Redirected' :
                   p.status === 'pending_patient_approval' ? '⏳ Waiting for Approval' :
                   '⏳ Pending Confirmation'}
                </span>
              </div>

              {p.suggestion && (
                <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fefce8', border: '1px solid #fef08a', borderRadius: '8px', fontSize: '13px', color: '#a16207', fontWeight: 600 }}>
                  💡 Note: {p.suggestion}
                </div>
              )}

              {p.status === 'pending' && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>MEDICINES REQUESTED:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {p.medicines.map((m, i) => (
                      <div key={i} style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
                        💊 {m}
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px dashed #e2e8f0' }}>
                    <button className="btn btn-sm btn-primary" onClick={() => updateStatus(p.id, 'confirmed')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={16} /> Confirm Availability
                    </button>
                    <button className="btn btn-sm btn-ghost" onClick={() => setSubstituteModal(p.id)} style={{ color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <RefreshCw size={16} /> Suggest Substitute
                    </button>
                    <button className="btn btn-sm" onClick={() => setNearbyModal(p.id)} style={{ background: '#fef2f2', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #fecaca' }}>
                      <MapPin size={16} /> Find Nearby Pharmacy
                    </button>
                  </div>
                </div>
              )}

              {p.status === 'confirmed' && (
                <div style={{ marginTop: '16px', background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontWeight: 700, marginBottom: '12px' }}>
                    <Package size={18} /> SMART PRESCRIPTION PACKING
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Gather the following items to prepare the medicine pack for {p.patient}:</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {p.medicines.map((m, i) => (
                      <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#fff', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}>
                        <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{m}</span>
                      </label>
                    ))}
                  </div>

                  <button className="btn btn-sm btn-success" onClick={() => updateStatus(p.id, 'ready')} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    <CheckSquare size={16} /> Prescription Pack Ready
                  </button>
                </div>
              )}

              {p.status === 'ready' && (
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4', padding: '12px 16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#15803d', fontSize: '14px' }}>Medicines ready for pickup!</div>
                    <div style={{ fontSize: '12px', color: '#166534', marginTop: '2px' }}>Patient has been notified via SMS to visit Jan Aushadhi Kendra.</div>
                  </div>
                  <button className="btn btn-sm" onClick={() => updateStatus(p.id, 'picked_up')} style={{ background: '#15803d', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserCheck size={16} /> Mark Picked Up
                  </button>
                </div>
              )}

              {p.status === 'picked_up' && (
                <div style={{ marginTop: '12px', fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} color="#94a3b8" /> Prescription successfully fulfilled and handed over to patient.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {requests.length === 0 && <div className="empty-state"><div className="empty-state-icon">✅</div><div className="empty-state-title">No pending requests</div></div>}

      {/* SUBSTITUTE MODAL */}
      {substituteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', margin: '20px', padding: '0' }}>
            <div className="card-header" style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RefreshCw size={18} color="#0ea5e9" /> Medicine Substitution</div>
              <button className="btn btn-ghost" style={{ padding: '4px' }} onClick={() => setSubstituteModal(null)}><XCircle size={20} /></button>
            </div>
            <form onSubmit={handleSubstitute} style={{ padding: '16px' }}>
              <label className="form-label">Unavailable Medicine</label>
              <input className="form-input" required placeholder="e.g. Paracetamol 500mg" value={subData.unavailable} onChange={e => setSubData({...subData, unavailable: e.target.value})} style={{ marginBottom: '12px' }} />
              
              <label className="form-label">Suggested Generic Alternative</label>
              <input className="form-input" required placeholder="e.g. Crocin 500mg or Calpol 500mg" value={subData.alternative} onChange={e => setSubData({...subData, alternative: e.target.value})} style={{ marginBottom: '16px' }} />
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <Send size={16} /> Send Suggestion to Patient & HW
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NEARBY PHARMACY MODAL */}
      {nearbyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', margin: '20px', padding: '0' }}>
            <div className="card-header" style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c' }}><MapPin size={18} /> Nearby Pharmacy Network</div>
              <button className="btn btn-ghost" style={{ padding: '4px' }} onClick={() => setNearbyModal(null)}><XCircle size={20} /></button>
            </div>
            <div style={{ padding: '16px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Select a nearby pharmacy with available stock to redirect the patient:</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mockPharmacies.filter(p => p.name !== 'Jan Aushadhi Kendra').map(pharma => (
                  <div key={pharma.id} style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>{pharma.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{pharma.address} · <span style={{ color: '#0ea5e9', fontWeight: 600 }}>{pharma.distance} away</span></div>
                    </div>
                    <button className="btn btn-sm btn-outline" onClick={() => handleRedirect(nearbyModal, pharma.name)}>Redirect</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
