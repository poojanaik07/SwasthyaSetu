import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';

// Role-specific navigation configs
const NAV = {
  patient: [
    { path: '/patient/dashboard', label: 'Home', emoji: '🏠' },
    { path: '/patient/report-symptoms', label: 'Report Symptoms', emoji: '🤒' },
    { path: '/patient/consultations', label: 'My Consultations', emoji: '💬' },
    { path: '/patient/prescriptions', label: 'Prescriptions', emoji: '💊' },
    { path: '/patient/nearby-pharmacy', label: 'Nearby Pharmacy', emoji: '🗺️' },
    { path: '/patient/profile', label: 'My Health Profile', emoji: '🏥' },
  ],
  healthworker: [
    { path: '/healthworker/dashboard', label: 'Dashboard', emoji: '📊' },
    { path: '/healthworker/register-patient', label: 'Register Patient', emoji: '👤' },
    { path: '/healthworker/record-vitals', label: 'Record Vitals', emoji: '📈' },
    { path: '/healthworker/consultation-requests', label: 'Consultation Requests', emoji: '📋' },
  ],
  doctor: [
    { path: '/doctor/dashboard', label: 'Dashboard', emoji: '👨‍⚕️' },
    { path: '/doctor/incoming-consultations', label: 'Incoming Cases', emoji: '📥' },
    { path: '/doctor/diagnosis', label: 'Write Diagnosis', emoji: '✍️' },
  ],
  pharmacy: [
    { path: '/pharmacy/dashboard', label: 'Dashboard', emoji: '📊' },
    { path: '/pharmacy/medicine-inventory', label: 'Medicine Inventory', emoji: '📦' },
    { path: '/pharmacy/prescription-requests', label: 'Prescription Requests', emoji: '📋' },
  ],
  admin: [
    { path: '/admin/dashboard', label: 'Analytics', emoji: '📊' },
    { path: '/admin/disease-trends', label: 'Disease Trends', emoji: '🔬' },
    { path: '/admin/outbreak-alerts', label: 'Outbreak Alerts', emoji: '🚨' },
    { path: '/admin/user-verification', label: 'User Verification', emoji: '✅' },
  ],
};

const ROLE_META = {
  patient: { label: 'Patient Portal', color: '#6366f1', bg: '#1e1b4b' },
  healthworker: { label: 'Health Worker', color: '#0ea5e9', bg: '#0c2340' },
  doctor: { label: 'Doctor Dashboard', color: '#10b981', bg: '#064e3b' },
  pharmacy: { label: 'Pharmacy Panel', color: '#f59e0b', bg: '#431407' },
  admin: { label: 'Admin Panel', color: '#ef4444', bg: '#1c0a0a' },
};

export default function RoleLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const nav = NAV[user.role] || [];
  const meta = ROLE_META[user.role] || ROLE_META.patient;

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  function isActive(path) {
    return location.pathname === path;
  }

  const sidebarStyle = {
    '--role-color': meta.color,
    background: meta.bg,
  };

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay visible"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
        style={sidebarStyle}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon" style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}aa)` }}>
            🩺
          </div>
          {!collapsed && (
            <div className="sidebar-logo-text">
              <div className="sidebar-logo-title">SwasthyaSetu</div>
              <div className="sidebar-logo-sub">{meta.label}</div>
            </div>
          )}
        </div>

        {/* User card */}
        {!collapsed && (
          <div style={{ margin: '0 12px 8px', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
              🏘️ {user.village}
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="sidebar-nav">
          {nav.map(item => (
            <button
              key={item.path}
              className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              title={collapsed ? item.label : undefined}
              style={isActive(item.path) ? { background: meta.color, boxShadow: `0 4px 12px ${meta.color}66` } : {}}
            >
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.emoji}</span>
              {!collapsed && <span className="sidebar-item-text">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            className="sidebar-toggle"
            onClick={handleLogout}
            style={{ marginBottom: '8px', color: '#fca5a5', borderColor: 'rgba(239,68,68,0.3)' }}
          >
            <LogOut size={15} />
            {!collapsed && <span>Logout</span>}
          </button>
          <button className="sidebar-toggle" onClick={() => setCollapsed(c => !c)}>
            {collapsed ? '→' : <><span style={{ fontSize: '12px' }}>←</span> <span>Collapse</span></>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Mobile top bar */}
        <div className="mobile-header">
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <span style={{ fontWeight: 800, fontSize: '15px' }}>🩺 SwasthyaSetu</span>
          <button className="mobile-menu-btn" onClick={handleLogout} title="Logout" style={{ background: 'rgba(239,68,68,0.2)' }}>
            <LogOut size={16} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
