import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { mockAdminStats } from '../utils/mockData';
import { FileText, Ambulance, Activity } from 'lucide-react';

const STATUS_COLORS = { alert: '#ef4444', watch: '#eab308', clear: '#22c55e' };

export default function OutbreakMap({ onOpenReport, onOpenDispatch }) {
  const [tick, setTick] = useState(0);

  // Auto-refresh every 30s to simulate live tracking
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const villages = mockAdminStats.villages;

  return (
    <div className="outbreak-map-container" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ color: '#0f172a', fontWeight: 800, fontSize: '15px' }}>🌍 Live Village Health Map</h3>
        <span style={{ fontSize: '11px', color: '#64748b' }}>Auto-refreshes every 30s · Tick {tick + 1}</span>
      </div>

      <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', zIndex: 0 }}>
        <MapContainer center={[21.11, 79.05]} zoom={11} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {villages.map((v, i) => {
            // Automatic health status detection
            let status = 'clear';
            if (v.cases > 15) status = 'alert';
            else if (v.cases >= 8) status = 'watch';
            
            const color = STATUS_COLORS[status];

            return (
              <CircleMarker
                key={i}
                center={[v.lat, v.lng]}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.8 }}
                radius={status === 'alert' ? 12 : status === 'watch' ? 9 : 6}
              >
                <Popup className="village-leaflet-popup">
                  <div style={{ minWidth: '220px', fontFamily: 'Inter, sans-serif' }}>
                    <div style={{ fontWeight: 800, fontSize: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {v.name}
                      <span className={`badge badge-${status === 'alert' ? 'red' : status === 'watch' ? 'yellow' : 'green'}`} style={{ fontSize: '10px' }}>
                         {status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
                      <strong>Population:</strong> {v.population}
                    </div>
                    <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
                      <strong>Cases this week:</strong> <span style={{ color: color, fontWeight: 700 }}>{v.cases}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
                      <strong>Top Disease:</strong> {v.topDisease}
                    </div>
                    <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
                      <strong>Health Worker:</strong> {v.healthWorker}
                    </div>
                    <div style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
                      <strong>Last Visit:</strong> {v.lastVisit}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      <button className="btn btn-sm btn-outline" style={{ fontSize: '11px', padding: '6px 8px', flex: '1 1 auto' }}>
                        <Activity size={12} style={{ marginRight: '4px' }} /> View Cases
                      </button>
                      <button className="btn btn-sm btn-outline" style={{ fontSize: '11px', padding: '6px 8px', flex: '1 1 auto' }} onClick={() => {
                          const alertData = { village: v.name, disease: v.topDisease, cases: v.cases, status: status, population: v.population };
                          if (onOpenReport) onOpenReport(alertData);
                      }}>
                        <FileText size={12} style={{ marginRight: '4px' }} /> Case Report
                      </button>
                      <button className="btn btn-sm btn-primary" style={{ fontSize: '11px', padding: '6px 8px', width: '100%', flexBasis: '100%' }} onClick={() => {
                          const alertData = { village: v.name, disease: v.topDisease, cases: v.cases, status: status };
                          if (onOpenDispatch) onOpenDispatch(alertData);
                      }}>
                        <Ambulance size={12} style={{ marginRight: '4px' }} /> Dispatch Medical Team
                      </button>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      <div style={{ marginTop: '12px', display: 'flex', gap: '16px', fontSize: '13px', fontWeight: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} /> Active Outbreak (&gt;15 cases)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }} /> Watch Zone (8-15 cases)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} /> Normal Health (&lt;8 cases)</div>
      </div>
    </div>
  );
}
