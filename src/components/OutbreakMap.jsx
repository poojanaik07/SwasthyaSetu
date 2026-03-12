import React, { useState, useEffect, useRef } from 'react';
import { mockAdminStats } from '../utils/mockData';

const STATUS_COLORS = { alert: '#ef4444', watch: '#eab308', clear: '#22c55e' };
const STATUS_PULSE = { alert: 'rgba(239,68,68,0.3)', watch: 'rgba(234,179,8,0.3)', clear: 'rgba(34,197,94,0.3)' };

export default function OutbreakMap() {
  const [activeVillage, setActiveVillage] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [tick, setTick] = useState(0);
  const svgRef = useRef(null);

  // Simulate live refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const villages = mockAdminStats.villages;
  const alerts = mockAdminStats.outbreakAlerts;

  function handleVillageHover(v, e) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    setActiveVillage(v);
    setPopupPos({ x: (v.x / 100) * rect.width, y: (v.y / 100) * rect.height });
  }

  return (
    <div className="outbreak-map-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ color: '#e2e8f0', fontWeight: 800, fontSize: '15px' }}>🗺️ Live Village Health Map</h3>
        <span style={{ fontSize: '11px', color: '#64748b' }}>Auto-refreshes every 30s · Tick {tick + 1}</span>
      </div>

      <div style={{ position: 'relative', background: '#1a2744', borderRadius: '12px', overflow: 'hidden' }}>
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          style={{ width: '100%', height: '260px', display: 'block' }}
        >
          {/* Background grid */}
          {[20, 40, 60, 80].map(v => (
            <React.Fragment key={v}>
              <line x1={v} y1={0} x2={v} y2={100} stroke="#1e3a5f" strokeWidth="0.3" />
              <line x1={0} y1={v} x2={100} y2={v} stroke="#1e3a5f" strokeWidth="0.3" />
            </React.Fragment>
          ))}

          {/* Connections between villages */}
          {villages.map((v, i) => villages.slice(i + 1).map((w, j) => {
            const dist = Math.sqrt((v.x - w.x) ** 2 + (v.y - w.y) ** 2);
            if (dist < 35) return (
              <line key={`${i}-${j}`} x1={v.x} y1={v.y} x2={w.x} y2={w.y}
                stroke="#1e4080" strokeWidth="0.4" strokeDasharray="1,1" opacity="0.6" />
            );
            return null;
          }))}

          {/* Village nodes */}
          {villages.map((v, i) => {
            const color = STATUS_COLORS[v.status];
            const pulse = STATUS_PULSE[v.status];
            return (
              <g key={i} style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => handleVillageHover(v, e)}
                onMouseLeave={() => setActiveVillage(null)}>
                {/* Pulse ring */}
                {v.status !== 'clear' && (
                  <circle cx={v.x} cy={v.y} r="6" fill="none" stroke={color} strokeWidth="0.5" opacity="0.4">
                    <animate attributeName="r" from="5" to="10" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Main dot */}
                <circle cx={v.x} cy={v.y} r={v.cases > 0 ? 4 : 3} fill={color} />
                <circle cx={v.x} cy={v.y} r="1.5" fill="white" />
                {/* Label */}
                <text x={v.x} y={v.y + 7} textAnchor="middle" fill="#94a3b8"
                  fontSize="2.8" fontFamily="Inter, sans-serif" fontWeight="600">
                  {v.name}
                </text>
                {v.cases > 0 && (
                  <text x={v.x + 5} y={v.y - 3} fill={color} fontSize="2.5" fontWeight="800">
                    {v.cases}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Popup */}
        {activeVillage && (
          <div className="village-popup" style={{ left: `${(activeVillage.x / 100) * 100}%`, top: `${(activeVillage.y / 100) * 100}%` }}>
            <div style={{ fontWeight: 800, fontSize: '13px' }}>{activeVillage.name}</div>
            <div style={{ color: STATUS_COLORS[activeVillage.status], fontWeight: 700, textTransform: 'uppercase', fontSize: '10px' }}>
              {activeVillage.status === 'alert' ? '🔴' : activeVillage.status === 'watch' ? '🟡' : '🟢'} {activeVillage.status}
            </div>
            {activeVillage.cases > 0 && <div style={{ fontSize: '11px', marginTop: '2px' }}>{activeVillage.cases} cases reported</div>}
          </div>
        )}
      </div>

      <div className="map-legend">
        <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#ef4444' }} />Active Outbreak</div>
        <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#eab308' }} />Watch Zone</div>
        <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#22c55e' }} />Clear</div>
      </div>

      {/* Alert list */}
      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {alerts.map((a, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '12px' }}>
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{a.village} – {a.disease}</span>
            <span style={{ color: STATUS_COLORS[a.status], fontWeight: 800 }}>{a.cases} cases</span>
          </div>
        ))}
      </div>
    </div>
  );
}
