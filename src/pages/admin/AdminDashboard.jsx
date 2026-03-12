import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { mockAdminStats } from '../../utils/mockData';
import { Filter, Download, FileText, Brain, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0f172a', color: '#e2e8f0', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', border: '1px solid #334155' }}>
      <div style={{ fontWeight: 700, marginBottom: '4px' }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color }}>● {p.name}: {p.value}</div>)}
    </div>
  );
};

export default function AdminDashboard() {
  const { totalVillages, activeConsultations, registeredWorkers, registeredPharmacies, dailyPatients, weeklyTrend, diseaseData, villages } = mockAdminStats;
  
  const [filterDistrict, setFilterDistrict] = useState('All Districts');
  const [filterVillage, setFilterVillage] = useState('All Villages');
  const [filterDate, setFilterDate] = useState('Last 7 Days');
  const [reportSuccess, setReportSuccess] = useState('');

  const generateReport = (type, format) => {
    setReportSuccess(`Generating ${type} as ${format}...`);
    setTimeout(() => {
      setReportSuccess(`${type} downloaded successfully in ${format} format!`);
      setTimeout(() => setReportSuccess(''), 3000);
    }, 1500);
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <h2>📊 Admin Analytics</h2>
        <p>System-wide health metrics · SwasthyaSetu Network</p>
      </div>

      {/* FILTER BAR */}
      <div className="card" style={{ marginBottom: '24px', padding: '12px 20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: 600 }}>
          <Filter size={18} /> Filters:
        </div>
        <select className="form-select" style={{ minWidth: '150px', padding: '6px 12px' }} value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)}>
          <option>All Districts</option>
          <option>North District</option>
          <option>South District</option>
        </select>
        <select className="form-select" style={{ minWidth: '150px', padding: '6px 12px' }} value={filterVillage} onChange={e => setFilterVillage(e.target.value)}>
          <option>All Villages</option>
          <option>Ramapur</option>
          <option>Bhagalpur</option>
          <option>Chandpur</option>
        </select>
        <select className="form-select" style={{ minWidth: '150px', padding: '6px 12px' }} value={filterDate} onChange={e => setFilterDate(e.target.value)}>
          <option>Today</option>
          <option>Last 7 Days</option>
          <option>This Month</option>
        </select>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)', marginBottom: '24px' }}>
        {[
          { label: 'Villages Covered', value: totalVillages, emoji: '🏘️', accent: '#6366f1', trend: '+12 this month' },
          { label: 'Active Consultations', value: activeConsultations, emoji: '💬', accent: '#22c55e', trend: '+5 today' },
          { label: 'Health Workers', value: registeredWorkers, emoji: '👩‍⚕️', accent: '#f97316', trend: '+3 this week' },
          { label: 'Pharmacies', value: registeredPharmacies, emoji: '🏥', accent: '#10b981', trend: '+2 this week' },
          { label: 'Daily Patients', value: dailyPatients, emoji: '👥', accent: '#8b5cf6', trend: '+18 today' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ '--card-accent': s.accent }}>
            <div className="stat-card-icon" style={{ background: `${s.accent}20`, fontSize: '24px' }}>{s.emoji}</div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-trend up" style={{ marginTop: '4px' }}>↑ {s.trend}</div>
          </div>
        ))}
      </div>

      {/* NEW PANELS ROW: AI PREDICTION & GOV REPORT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* AI OUTBREAK PREDICTION */}
        <div className="card" style={{ borderLeft: '4px solid #8b5cf6', background: 'linear-gradient(to right, #fff, #f5f3ff)' }}>
          <div className="card-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6d28d9' }}>
              <Brain size={20} /> AI Outbreak Prediction
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} color="#ef4444" /> Possible Dengue outbreak in Ramapur next week.
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

        {/* GOV REPORT GENERATOR */}
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
           <div className="card-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669' }}>
              <FileText size={20} /> Government Health Report Generator
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Export official SwasthyaSetu Rural Health Surveillance Reports for designated authorities.</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="btn btn-sm btn-outline" onClick={() => generateReport('Weekly Health Report', 'PDF')}>
                <Download size={14} /> Weekly Summary (PDF)
              </button>
              <button className="btn btn-sm btn-outline" onClick={() => generateReport('District Disease Summary', 'Excel')}>
                <Download size={14} /> District Data (Excel)
              </button>
              <button className="btn btn-sm btn-primary" onClick={() => generateReport('Outbreak Response Report', 'PDF')}>
                <Download size={14} /> Outbreak Report (PDF)
              </button>
            </div>
            {reportSuccess && (
              <div style={{ marginTop: '12px', fontSize: '13px', color: '#15803d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} /> {reportSuccess}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Weekly Trend Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📈 Weekly Patient & Consultation Trend</span>
              <span className="badge badge-gray">{filterDistrict} · {filterVillage}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="patients" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} name="Patients" />
              <Line type="monotone" dataKey="consultations" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} name="Consultations" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* VILLAGE HEALTH MONITORING PANEL */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="card-header" style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="#0ea5e9" /> Village Health Monitor
            </div>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '300px' }}>
            {villages.slice(0, 4).map((v, i) => (
              <div key={i} style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: v.status === 'alert' ? '#fef2f2' : 'transparent' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {v.name} {v.status === 'alert' && <AlertTriangle size={14} color="#ef4444" />}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    {v.status === 'alert' ? <span style={{ color: '#b91c1c', fontWeight: 600 }}>Fever cases rising rapidly</span> : 'Normal baseline levels'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#334155' }}>
                    {v.status === 'alert' ? '12 consults' : '3 consults'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                    Last HW visit: Today
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
