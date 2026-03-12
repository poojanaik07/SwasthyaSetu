import React, { useState } from 'react';
import { mockPrescriptionRequests } from '../../utils/mockData';
import { CheckCircle, Package } from 'lucide-react';

export default function PrescriptionRequests() {
  const [requests, setRequests] = useState(mockPrescriptionRequests);

  function confirm(id) {
    setRequests(r => r.map(req => req.id === id ? { ...req, status: 'confirmed' } : req));
  }

  return (
    <div>
      <div className="page-header">
        <h2>📋 Prescription Requests</h2>
        <p>Doctor-sent prescriptions awaiting pharmacy confirmation</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {requests.map(p => (
          <div key={p.id} className="card" style={{ borderLeft: `4px solid ${p.status === 'confirmed' ? '#22c55e' : '#eab308'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '16px' }}>👤 {p.patient}</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Prescribed by {p.doctor} · {p.date}</div>
              </div>
              <span className={`badge ${p.status === 'confirmed' ? 'badge-green' : 'badge-yellow'}`}>
                {p.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending Confirmation'}
              </span>
            </div>

            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>MEDICINES REQUESTED:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {p.medicines.map((m, i) => (
                  <div key={i} style={{ padding: '6px 10px', background: '#f1f5f9', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
                    💊 {m}
                  </div>
                ))}
              </div>
            </div>

            {p.status === 'pending' && (
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className="btn btn-sm btn-success" onClick={() => confirm(p.id)}>
                  <CheckCircle size={14} /> Confirm Availability
                </button>
                <button className="btn btn-sm btn-ghost">
                  <Package size={14} /> Mark Partial
                </button>
                <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#b91c1c' }}>
                  ✗ Not Available
                </button>
              </div>
            )}

            {p.status === 'confirmed' && (
              <div style={{ marginTop: '10px', padding: '8px 12px', background: '#dcfce7', borderRadius: '8px', fontSize: '13px', color: '#15803d', fontWeight: 600 }}>
                ✅ All medicines confirmed available. Patient notified.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
