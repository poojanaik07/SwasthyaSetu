import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { mockAdminStats } from '../../utils/mockData';

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
  const { totalVillages, activeConsultations, registeredWorkers, registeredPharmacies, dailyPatients, weeklyTrend, diseaseData } = mockAdminStats;

  return (
    <div>
      <div className="page-header">
        <h2>📊 Admin Analytics</h2>
        <p>System-wide health metrics · SwasthyaSetu Network</p>
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

      {/* Weekly Trend Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="card">
          <div className="card-header"><div className="card-title">📈 Weekly Patient & Consultation Trend</div></div>
          <ResponsiveContainer width="100%" height={220}>
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

        {/* Disease Pie */}
        <div className="card">
          <div className="card-header"><div className="card-title">🦠 Disease Distribution</div></div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={diseaseData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                {diseaseData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card">
        <div className="card-header"><div className="card-title">🏥 Consultations by Day of Week</div></div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="consultations" fill="#6366f1" radius={[6, 6, 0, 0]} name="Consultations" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
