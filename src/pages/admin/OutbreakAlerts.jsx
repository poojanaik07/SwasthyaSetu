import React from 'react';
import OutbreakMap from '../../components/OutbreakMap';
import { mockAdminStats } from '../../utils/mockData';

const STATUS_COLORS = { alert: '#ef4444', watch: '#eab308', clear: '#22c55e' };

export default function OutbreakAlerts() {
  return (
    <div>
      <div className="page-header">
        <h2>🚨 Outbreak Alerts</h2>
        <p>Real-time disease surveillance across all villages</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ padding: '10px 16px', background: '#fee2e2', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#b91c1c', fontSize: '14px' }}>
          🔴 {mockAdminStats.outbreakAlerts.filter(a => a.status === 'alert').length} Active Outbreaks
        </div>
        <div style={{ padding: '10px 16px', background: '#fef9c3', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#a16207', fontSize: '14px' }}>
          🟡 {mockAdminStats.outbreakAlerts.filter(a => a.status === 'watch').length} Watch Zones
        </div>
        <div style={{ padding: '10px 16px', background: '#dcfce7', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#15803d', fontSize: '14px' }}>
          🟢 {mockAdminStats.villages.filter(v => v.status === 'clear').length} Clear Villages
        </div>
      </div>

      {/* Live Map - The Standout Feature */}
      <div style={{ marginBottom: '24px' }}>
        <OutbreakMap />
      </div>

      {/* Alert Details */}
      <div className="card">
        <div className="card-header"><div className="card-title">🔔 Active Alerts</div></div>
        {mockAdminStats.outbreakAlerts.map((a, i) => (
          <div key={i} style={{
            display: 'flex', gap: '12px', alignItems: 'center', padding: '14px',
            borderRadius: '10px', marginBottom: '8px',
            background: a.status === 'alert' ? '#fff7f7' : '#fffbeb',
            border: `1px solid ${a.status === 'alert' ? '#fca5a5' : '#fde68a'}`
          }}>
            <div style={{ fontSize: '2rem' }}>{a.status === 'alert' ? '🔴' : '🟡'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '15px' }}>{a.village} – {a.disease}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                {a.cases} cases reported · Status: <strong style={{ color: STATUS_COLORS[a.status] }}>{a.status.toUpperCase()}</strong>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="btn btn-sm btn-outline">📋 Case Report</button>
              <button className="btn btn-sm btn-primary">🚑 Dispatch Team</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
