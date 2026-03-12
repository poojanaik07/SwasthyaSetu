import React, { useState, useCallback } from 'react';
import {
  Home, FileText, MessageSquare, Pill, MapPin, PlusCircle,
  Activity, ClipboardList, LayoutDashboard, Users, ShoppingBag,
  Bell, Settings, ChevronLeft, ChevronRight, Menu, X, Package,
  AlertTriangle, BarChart2, Stethoscope, UserPlus, FlaskConical
} from 'lucide-react';

const navConfig = {
  patient: [
    { id: 'dashboard', label: 'Home', icon: Home, emoji: '🏠' },
    { id: 'report-symptoms', label: 'Report Symptoms', icon: FileText, emoji: '🤒' },
    { id: 'consultations', label: 'My Consultations', icon: MessageSquare, emoji: '💬' },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill, emoji: '💊' },
    { id: 'nearby-pharmacy', label: 'Nearby Pharmacy', icon: MapPin, emoji: '🏥' },
  ],
  healthworker: [
    { id: 'hw-dashboard', label: 'Dashboard', icon: LayoutDashboard, emoji: '📊' },
    { id: 'register-patient', label: 'Register Patient', icon: UserPlus, emoji: '👤' },
    { id: 'record-vitals', label: 'Record Vitals', icon: Activity, emoji: '📈' },
    { id: 'consultation-requests', label: 'Consultation Requests', icon: ClipboardList, emoji: '📋' },
  ],
  doctor: [
    { id: 'doctor-dashboard', label: 'Dashboard', icon: Stethoscope, emoji: '👨‍⚕️' },
    { id: 'incoming-consultations', label: 'Incoming Cases', icon: MessageSquare, emoji: '📥' },
    { id: 'diagnosis-form', label: 'Write Diagnosis', icon: FileText, emoji: '✍️' },
  ],
  pharmacy: [
    { id: 'pharmacy-dashboard', label: 'Dashboard', icon: LayoutDashboard, emoji: '📊' },
    { id: 'medicine-inventory', label: 'Medicine Inventory', icon: Package, emoji: '📦' },
    { id: 'prescription-requests', label: 'Prescription Requests', icon: ClipboardList, emoji: '📋' },
  ],
  admin: [
    { id: 'admin-dashboard', label: 'Analytics', icon: BarChart2, emoji: '📊' },
    { id: 'disease-trends', label: 'Disease Trends', icon: FlaskConical, emoji: '🔬' },
    { id: 'outbreak-alerts', label: 'Outbreak Alerts', icon: AlertTriangle, emoji: '🚨' },
  ],
};

const roleLabels = {
  patient: { label: 'Patient', sub: 'Ramesh Kumar', emoji: '👤' },
  healthworker: { label: 'Health Worker', sub: 'Kavita ASW', emoji: '👩‍⚕️' },
  doctor: { label: 'Doctor', sub: 'Dr. Priya Sharma', emoji: '👨‍⚕️' },
  pharmacy: { label: 'Pharmacy', sub: 'Jan Aushadhi Kendra', emoji: '🏥' },
  admin: { label: 'Admin', sub: 'System Admin', emoji: '⚙️' },
};

export default function Sidebar({ role, activePage, onNavigate, collapsed, onToggle, mobileOpen, onMobileClose }) {
  const nav = navConfig[role] || [];
  const roleInfo = roleLabels[role] || roleLabels.patient;

  return (
    <>
      <div className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`} onClick={onMobileClose} />
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🩺</div>
          {!collapsed && (
            <div className="sidebar-logo-text">
              <div className="sidebar-logo-title">SwasthyaSetu</div>
              <div className="sidebar-logo-sub">Rural Healthcare</div>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {!collapsed && <div className="sidebar-section-label">{roleInfo.emoji} {roleInfo.label}</div>}
          {nav.map(item => (
            <button
              key={item.id}
              className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => { onNavigate(item.id); onMobileClose?.(); }}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="sidebar-item-icon" size={18} />
              {!collapsed && <span className="sidebar-item-text">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-toggle" onClick={onToggle}>
            {collapsed
              ? <ChevronRight size={16} />
              : <><ChevronLeft size={16} /><span>Collapse</span></>
            }
          </button>
        </div>
      </aside>
    </>
  );
}
