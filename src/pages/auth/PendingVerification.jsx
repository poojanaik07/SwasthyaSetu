import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PendingVerification() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const ROLE_LABELS = {
    healthworker: 'Health Worker',
    doctor: 'Doctor',
    pharmacy: 'Pharmacy',
  };
  const ROLE_DOCS = {
    healthworker: 'Your ASHA/ANM certificate and government ID are under review.',
    doctor: 'Your medical license and MCI registration are under review.',
    pharmacy: 'Your drug license and owner ID proof are under review.',
  };

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '520px', width: '100%',
        background: '#fff',
        borderRadius: '24px',
        padding: '48px 40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
        textAlign: 'center',
      }}>
        {/* Animated clock */}
        <div style={{ fontSize: '5rem', marginBottom: '8px', animation: 'pulse 2s ease-in-out infinite' }}>⏳</div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.03em' }}>
          Account Under Verification
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '24px', lineHeight: 1.6 }}>
          Your account is being reviewed by our admin team. You will be notified once approved.
        </p>

        {/* Status badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 20px',
          background: '#fef9c3', borderRadius: '100px',
          color: '#a16207', fontWeight: 700, fontSize: '14px', marginBottom: '24px',
          border: '1px solid #fde68a',
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308', display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }} />
          Status: Pending Verification
        </div>

        {/* User info card */}
        {user && (
          <div style={{
            background: '#f8fafc', borderRadius: '14px', padding: '20px',
            marginBottom: '24px', textAlign: 'left', border: '1px solid #e2e8f0',
          }}>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', marginBottom: '12px' }}>📋 Registration Summary</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Name', value: user.name, emoji: '👤' },
                { label: 'Role', value: ROLE_LABELS[user.role] || user.role, emoji: '🏷️' },
                { label: 'Mobile', value: user.mobile, emoji: '📱' },
                { label: 'Submitted', value: user.submittedAt || 'Just now', emoji: '📅' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                  <span>{item.emoji}</span>
                  <span style={{ color: '#64748b', minWidth: '70px' }}>{item.label}:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.value}</span>
                </div>
              ))}
            </div>
            {ROLE_DOCS[user.role] && (
              <div style={{ marginTop: '12px', padding: '8px 10px', background: '#eff6ff', borderRadius: '8px', fontSize: '12px', color: '#1d4ed8', fontWeight: 600 }}>
                📄 {ROLE_DOCS[user.role]}
              </div>
            )}
          </div>
        )}

        {/* What happens next */}
        <div style={{ textAlign: 'left', marginBottom: '28px' }}>
          <div style={{ fontWeight: 700, fontSize: '13px', color: '#374151', marginBottom: '10px' }}>📌 What happens next?</div>
          {[
            { emoji: '🔍', text: 'Admin verifies your uploaded documents', done: true },
            { emoji: '✅', text: 'Account approved and access granted', done: false },
            { emoji: '📲', text: 'You receive a notification to log in', done: false },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', alignItems: 'flex-start', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none' }}>
              <span style={{ fontSize: '18px' }}>{step.emoji}</span>
              <span style={{ fontSize: '13px', color: step.done ? '#059669' : '#64748b', fontWeight: step.done ? 700 : 400 }}>{step.text}</span>
              {step.done && <span style={{ marginLeft: 'auto', fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '100px', fontWeight: 700, whiteSpace: 'nowrap' }}>In Progress</span>}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
          <button
            onClick={handleLogout}
            style={{
              padding: '13px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: '#fff', fontWeight: 700, fontSize: '15px',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
            }}
          >
            🔙 Back to Login
          </button>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            Need help? Call: <strong>1800-XXX-XXXX</strong> (Toll Free)
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
      `}</style>
    </div>
  );
}
