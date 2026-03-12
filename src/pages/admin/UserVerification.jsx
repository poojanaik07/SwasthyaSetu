import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const ROLE_COLORS = {
  doctor: '#10b981', healthworker: '#0ea5e9', pharmacy: '#f59e0b',
};
const ROLE_EMOJIS = {
  doctor: '👨‍⚕️', healthworker: '👩‍⚕️', pharmacy: '🏥',
};
const ROLE_LABELS = {
  doctor: 'Doctor', healthworker: 'Health Worker', pharmacy: 'Pharmacy',
};

function DocBadge({ label }) {
  return (
    <button
      style={{
        padding: '4px 10px', background: '#eff6ff', color: '#1d4ed8',
        border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '12px',
        fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
      }}
      onClick={() => alert('📄 Document viewer — would open the uploaded document.')}
    >
      <FileText size={12} /> {label}
    </button>
  );
}

function UserCard({ userRecord, onApprove, onReject }) {
  const [expanded, setExpanded] = useState(false);
  const [processing, setProcessing] = useState(null); // 'approve' | 'reject'
  const [done, setDone] = useState(null); // 'approved' | 'rejected'
  const color = ROLE_COLORS[userRecord.role] || '#6366f1';

  async function handleAction(action) {
    setProcessing(action);
    await new Promise(r => setTimeout(r, 800));
    if (action === 'approve') onApprove(userRecord.id);
    else onReject(userRecord.id);
    setDone(action);
    setProcessing(null);
  }

  if (done) {
    return (
      <div style={{ padding: '16px 20px', borderRadius: '14px', border: '1px solid', borderColor: done === 'approved' ? '#86efac' : '#fca5a5', background: done === 'approved' ? '#f0fdf4' : '#fff7f7', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>{done === 'approved' ? '✅' : '❌'}</span>
        <div>
          <div style={{ fontWeight: 700, color: done === 'approved' ? '#15803d' : '#b91c1c' }}>{userRecord.name} — {done === 'approved' ? 'Approved' : 'Rejected'}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{ROLE_LABELS[userRecord.role]} · {userRecord.mobile}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderLeft: `4px solid ${color}`, display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
          {ROLE_EMOJIS[userRecord.role]}
        </div>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{userRecord.name}</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            {ROLE_LABELS[userRecord.role]} · 📱 {userRecord.mobile} · 📅 Submitted {userRecord.submittedAt}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ padding: '4px 10px', background: '#fef9c3', color: '#a16207', borderRadius: '100px', fontSize: '11px', fontWeight: 700, border: '1px solid #fde68a' }}>
            ⏳ Pending
          </span>
          <button
            onClick={() => setExpanded(e => !e)}
            style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{ padding: '16px 20px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginBottom: '14px' }}>
            {userRecord.mcRegistration && <InfoItem label="MCI Registration" value={userRecord.mcRegistration} />}
            {userRecord.specialization && <InfoItem label="Specialization" value={userRecord.specialization} />}
            {userRecord.hospitalName && <InfoItem label="Hospital/Clinic" value={userRecord.hospitalName} />}
            {userRecord.govtId && <InfoItem label="Govt ID / ASHA ID" value={userRecord.govtId} />}
            {userRecord.village && <InfoItem label="Village / Address" value={userRecord.village} />}
            {userRecord.ownerName && <InfoItem label="Owner Name" value={userRecord.ownerName} />}
            {userRecord.drugLicense && <InfoItem label="Drug License" value={userRecord.drugLicense} />}
            {userRecord.address && <InfoItem label="Address" value={userRecord.address} />}
          </div>
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>📎 Uploaded Documents:</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {userRecord.role === 'doctor' && <>
                <DocBadge label="Medical License" />
                <DocBadge label="Government ID" />
              </>}
              {userRecord.role === 'healthworker' && <DocBadge label="ASHA Certificate" />}
              {userRecord.role === 'pharmacy' && <>
                <DocBadge label="Drug License Certificate" />
                <DocBadge label="Owner ID Proof" />
              </>}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px', justifyContent: 'flex-end', background: '#fff' }}>
        <button
          onClick={() => handleAction('reject')}
          disabled={!!processing}
          style={{ padding: '8px 18px', background: '#fff', border: '2px solid #fca5a5', borderRadius: '10px', color: '#b91c1c', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit' }}
        >
          {processing === 'reject' ? '⏳ Rejecting...' : <><XCircle size={15} /> Reject</>}
        </button>
        <button
          onClick={() => handleAction('approve')}
          disabled={!!processing}
          style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 10px rgba(34,197,94,0.3)', fontFamily: 'inherit' }}
        >
          {processing === 'approve' ? '⏳ Approving...' : <><CheckCircle size={15} /> Approve</>}
        </button>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px' }}>
      <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{value}</div>
    </div>
  );
}

export default function UserVerification() {
  const { approveUser, rejectUser, getPendingUsers } = useAuth();
  const [pending, setPending] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setPending(getPendingUsers());
  }, [getPendingUsers]);

  function handleApprove(id) {
    approveUser(id);
    setPending(p => p.filter(u => u.id !== id));
  }
  function handleReject(id) {
    rejectUser(id);
    setPending(p => p.filter(u => u.id !== id));
  }

  const filtered = filter === 'all' ? pending : pending.filter(u => u.role === filter);
  const counts = { doctor: pending.filter(u => u.role === 'doctor').length, healthworker: pending.filter(u => u.role === 'healthworker').length, pharmacy: pending.filter(u => u.role === 'pharmacy').length };

  return (
    <div>
      <div className="page-header">
        <h2>✅ User Verification</h2>
        <p>Review and approve pending registration requests</p>
      </div>

      {/* Summary cards */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '24px' }}>
        {[
          { label: 'Total Pending', value: pending.length, emoji: '⏳', accent: '#eab308' },
          { label: 'Pending Doctors', value: counts.doctor, emoji: '👨‍⚕️', accent: '#10b981' },
          { label: 'Pending HW', value: counts.healthworker, emoji: '👩‍⚕️', accent: '#0ea5e9' },
          { label: 'Pending Pharmacies', value: counts.pharmacy, emoji: '🏥', accent: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ '--card-accent': s.accent }}>
            <div className="stat-card-icon" style={{ background: `${s.accent}20` }}>{s.emoji}</div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[['all', 'All Pending'], ['doctor', '👨‍⚕️ Doctors'], ['healthworker', '👩‍⚕️ Health Workers'], ['pharmacy', '🏥 Pharmacies']].map(([val, label]) => (
          <button key={val} className={`btn btn-sm ${filter === val ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(val)}>
            {label} {val !== 'all' && `(${counts[val] ?? pending.length})`}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '3rem' }}>🎉</div>
          <div className="empty-state-title">All caught up!</div>
          <div className="empty-state-sub">No pending registrations in this category.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map(u => (
            <UserCard key={u.id} userRecord={u} onApprove={handleApprove} onReject={handleReject} />
          ))}
        </div>
      )}
    </div>
  );
}
