import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
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

const monthlyData = [
  { month: 'Oct', fever: 280, respiratory: 150, diarrhea: 120 },
  { month: 'Nov', fever: 310, respiratory: 180, diarrhea: 100 },
  { month: 'Dec', fever: 380, respiratory: 220, diarrhea: 140 },
  { month: 'Jan', fever: 290, respiratory: 170, diarrhea: 130 },
  { month: 'Feb', fever: 320, respiratory: 200, diarrhea: 115 },
  { month: 'Mar', fever: 342, respiratory: 218, diarrhea: 156 },
];

export default function DiseaseTrends() {
  return (
    <div>
      <div className="page-header">
        <h2>🔬 Disease Trends</h2>
        <p>Monthly disease patterns across all villages</p>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header"><div className="card-title">📈 6-Month Disease Trend</div></div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="feverGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="respGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="diaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="fever" stroke="#ef4444" fill="url(#feverGrad)" strokeWidth={2} name="Fever" />
            <Area type="monotone" dataKey="respiratory" stroke="#f97316" fill="url(#respGrad)" strokeWidth={2} name="Respiratory" />
            <Area type="monotone" dataKey="diarrhea" stroke="#eab308" fill="url(#diaGrad)" strokeWidth={2} name="Diarrhea" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">📊 Disease Burden by Category</div></div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={mockAdminStats.diseaseData} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} name="Cases">
              {mockAdminStats.diseaseData.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
