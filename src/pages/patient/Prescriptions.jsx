import React, { useState } from 'react';
import { mockPrescriptions, mockPharmacies } from '../../utils/mockData';
import { Download, Eye, MapPin } from 'lucide-react';

// ── Treatment tracking data (days remaining, next dose) ───────────────────────
// In production, these would be calculated from prescription date + duration
const TREATMENT_META = {
  'Paracetamol 500mg':      { startDate: '2026-03-11', totalDays: 5, daysRemaining: 3, nextDose: '8:00 PM', timesPerDay: 3, notes: 'Take with water after meals' },
  'Cetirizine 10mg':        { startDate: '2026-03-11', totalDays: 3, daysRemaining: 1, nextDose: '10:00 PM', timesPerDay: 1, notes: 'Take at bedtime — may cause drowsiness' },
  'ORS Sachet':             { startDate: '2026-03-11', totalDays: 5, daysRemaining: 3, nextDose: 'As needed', timesPerDay: null, notes: 'Mix 1 sachet in 1L clean water' },
  'Hydrocortisone Cream 1%':{ startDate: '2026-03-10', totalDays: 7, daysRemaining: 5, nextDose: '9:00 PM', timesPerDay: 2, notes: 'Apply thin layer. Avoid eyes/mouth.' },
  'Levocetirizine 5mg':     { startDate: '2026-03-10', totalDays: 5, daysRemaining: 3, nextDose: '10:00 PM', timesPerDay: 1, notes: 'Take at night. Avoid alcohol.' },
};

function getProgress(meta) {
  const done = meta.totalDays - meta.daysRemaining;
  return Math.min(100, Math.round((done / meta.totalDays) * 100));
}

function progressColor(pct) {
  if (pct >= 80) return '#22c55e';
  if (pct >= 40) return '#6366f1';
  return '#f59e0b';
}

// ── Medicine availability in pharmacies ────────────────────────────────────────
function getMedicinePharmacies(medicineName) {
  const base = medicineName.split(' ')[0]; // e.g. "Paracetamol"
  return mockPharmacies.map(ph => {
    const match = ph.medicines.some(m => m.toLowerCase().includes(base.toLowerCase()));
    const stock = match ? (ph.medicines.length > 3 ? 'available' : 'low') : 'out';
    return { ...ph, stockStatus: match ? stock : 'out' };
  });
}

// Stock badge
const STOCK_CONFIG = {
  available: { label: 'Available', color: '#22c55e', bg: '#f0fdf4' },
  low:        { label: 'Low Stock', color: '#f59e0b', bg: '#fffbeb' },
  out:        { label: 'Out of Stock', color: '#ef4444', bg: '#fff7f7' },
};

function PharmacyModal({ medicine, onClose }) {
  const pharmacies = getMedicinePharmacies(medicine);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '480px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '18px 20px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff' }}>
          <div style={{ fontWeight: 900, fontSize: '16px' }}>🏥 Find Nearby Pharmacy</div>
          <div style={{ fontSize: '13px', opacity: 0.85, marginTop: '2px' }}>💊 {medicine}</div>
        </div>
        {/* List */}
        <div style={{ padding: '16px', maxHeight: '60vh', overflowY: 'auto' }}>
          {pharmacies.map(ph => {
            const sc = STOCK_CONFIG[ph.stockStatus];
            return (
              <div key={ph.id} style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '10px', background: '#fff' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>🏥</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>{ph.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>📍 {ph.address}</div>
                  <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: 700, marginTop: '2px' }}>📏 {ph.distance} away</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap' }}>
                    <span style={{ padding: '2px 10px', background: sc.bg, color: sc.color, borderRadius: '100px', fontSize: '11px', fontWeight: 800 }}>
                      {ph.stockStatus === 'available' ? '●' : ph.stockStatus === 'low' ? '◐' : '○'} {sc.label}
                    </span>
                    {ph.open
                      ? <span style={{ padding: '2px 8px', background: '#f0fdf4', color: '#15803d', borderRadius: '100px', fontSize: '11px', fontWeight: 700 }}>🟢 Open</span>
                      : <span style={{ padding: '2px 8px', background: '#fff7f7', color: '#b91c1c', borderRadius: '100px', fontSize: '11px', fontWeight: 700 }}>🔴 Closed</span>
                    }
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
                  <a href={`tel:${ph.phone}`} style={{ padding: '6px 12px', background: '#6366f1', color: '#fff', borderRadius: '8px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>📞 Call</a>
                  <button style={{ padding: '6px 12px', background: '#f1f5f9', color: '#374151', borderRadius: '8px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                    onClick={() => alert(`Opening directions to ${ph.name}`)}>
                    🗺️ Map
                  </button>
                </div>
              </div>
            );
          })}
          <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '10px', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
            Stock data is approximate. Call pharmacy to confirm availability.
          </div>
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9' }}>
          <button onClick={onClose} className="btn btn-ghost" style={{ width: '100%' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Treatment Progress card per medicine ───────────────────────────────────────
function TreatmentCard({ medicine, index }) {
  const [showPharmacy, setShowPharmacy] = useState(false);
  const meta = TREATMENT_META[medicine.name] || {
    totalDays: 5, daysRemaining: 3, nextDose: 'As prescribed', timesPerDay: null, notes: ''
  };
  const pct = getProgress(meta);
  const color = progressColor(pct);

  return (
    <>
      {showPharmacy && <PharmacyModal medicine={medicine.name} onClose={() => setShowPharmacy(false)} />}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Number */}
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#6366f115', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '14px', flexShrink: 0 }}>{index + 1}</div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>💊 {medicine.name}</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{medicine.dosage} · {medicine.frequency}</div>
            {meta.notes && <div style={{ fontSize: '11px', color: '#a16207', marginTop: '3px', fontWeight: 600 }}>ℹ️ {meta.notes}</div>}
          </div>

          {/* Next dose + days */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ padding: '4px 10px', background: '#f0f9ff', borderRadius: '8px', fontSize: '12px', color: '#0284c7', fontWeight: 700 }}>
              ⏰ Next: {meta.nextDose}
            </div>
            <div style={{ marginTop: '6px', fontSize: '12px', fontWeight: 700, color: meta.daysRemaining <= 1 ? '#b91c1c' : '#374151' }}>
              📅 {meta.daysRemaining} day{meta.daysRemaining !== 1 ? 's' : ''} remaining
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '5px' }}>
            <span>Treatment progress</span>
            <span>{pct}% complete ({meta.totalDays - meta.daysRemaining} of {meta.totalDays} days)</span>
          </div>
          <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: '4px', transition: 'width 600ms ease' }} />
          </div>
        </div>

        {/* Find pharmacy button */}
        <button
          onClick={() => setShowPharmacy(true)}
          style={{ marginTop: '10px', padding: '7px 14px', background: '#f0f9ff', border: '1.5px solid #bfdbfe', borderRadius: '10px', color: '#1d4ed8', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit' }}
        >
          <MapPin size={13} /> Find Nearby Pharmacy
        </button>
      </div>
    </>
  );
}

// ── Main Prescriptions page ────────────────────────────────────────────────────
export default function Prescriptions() {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'tracker'

  return (
    <div>
      <div className="page-header">
        <h2>💊 My Prescriptions</h2>
        <p>View medicines, track treatment progress, and find pharmacies</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { id: 'list',    label: '📋 My Prescriptions' },
          { id: 'tracker', label: '📈 Treatment Tracker' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`btn btn-sm ${activeTab === t.id ? 'btn-primary' : 'btn-ghost'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {mockPrescriptions.map(p => (
            <div key={p.id} className="prescription-card">
              <div className="prescription-header">
                <div>
                  <div style={{ fontWeight: 800, fontSize: '16px' }}>Rx – {p.diagnosis}</div>
                  <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '2px' }}>By {p.doctor} · {p.date}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}><Eye size={14} /> View</button>
                  <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}><Download size={14} /> Download</button>
                </div>
              </div>
              <div className="prescription-body">
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', marginBottom: '10px' }}>MEDICINES ({p.medicines.length})</div>
                {p.medicines.map((m, i) => (
                  <div key={i} style={{ marginBottom: '14px' }}>
                    <div className="medicine-item" style={{ marginBottom: '8px' }}>
                      <div className="medicine-number">{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div className="medicine-name">💊 {m.name}</div>
                        <div className="medicine-dosage">{m.dosage} · {m.frequency} · {m.duration}</div>
                      </div>
                      <span className="badge badge-purple">{m.duration}</span>
                    </div>
                    {/* Per-medicine pharmacy finder */}
                    <MiniPharmacyRow medicine={m.name} />
                  </div>
                ))}
                <div style={{ marginTop: '12px', padding: '10px', background: '#f0fdf4', borderRadius: '10px', fontSize: '12px', color: '#15803d', fontWeight: 600 }}>
                  ⚠️ Complete the full course. Do not stop medicines without doctor's advice.
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tracker' && (
        <div>
          {/* Warning banner */}
          <div style={{ padding: '14px 18px', background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '12px', marginBottom: '20px', fontSize: '13px', color: '#a16207', fontWeight: 600 }}>
            ⚠️ Complete the full course. Do not stop medicines without doctor's advice — even if you feel better!
          </div>

          {mockPrescriptions.map(p => (
            <div key={p.id} style={{ marginBottom: '28px' }}>
              {/* Prescription header */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px', padding: '10px 14px', background: 'linear-gradient(135deg,#6366f115,#4f46e110)', borderRadius: '12px', border: '1px solid #c7d2fe' }}>
                <span style={{ fontSize: '22px' }}>📋</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>Treatment: {p.diagnosis}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Prescribed by {p.doctor} on {p.date}</div>
                </div>
              </div>

              {p.medicines.map((m, i) => (
                <TreatmentCard key={i} medicine={m} index={i} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Inline pharmacy availability row under each medicine ───────────────────────
function MiniPharmacyRow({ medicine }) {
  const [expanded, setExpanded] = useState(false);
  const pharmacies = getMedicinePharmacies(medicine);
  const available = pharmacies.filter(p => p.stockStatus !== 'out');

  return (
    <div style={{ marginLeft: '36px' }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{ padding: '5px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', color: '#1d4ed8', fontWeight: 700, fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'inherit' }}
      >
        <MapPin size={11} />
        {expanded ? 'Hide pharmacies' : `Find Nearby Pharmacy${available.length > 0 ? ` (${available.length} available)` : ''}`}
      </button>

      {expanded && (
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {pharmacies.map(ph => {
            const sc = STOCK_CONFIG[ph.stockStatus];
            return (
              <div key={ph.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '18px' }}>🏥</span>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{ph.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>📏 {ph.distance}</div>
                </div>
                <span style={{ padding: '2px 8px', background: sc.bg, color: sc.color, borderRadius: '100px', fontSize: '11px', fontWeight: 800 }}>
                  {ph.stockStatus === 'available' ? '● ' : ph.stockStatus === 'low' ? '◐ ' : '○ '}{sc.label}
                </span>
                <a href={`tel:${ph.phone}`} style={{ padding: '4px 10px', background: '#6366f1', color: '#fff', borderRadius: '7px', fontSize: '11px', fontWeight: 700, textDecoration: 'none' }}>📞</a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
