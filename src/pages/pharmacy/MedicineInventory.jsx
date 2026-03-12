import React, { useState } from 'react';
import { mockMedicines } from '../../utils/mockData';
import { Search, AlertTriangle } from 'lucide-react';

export default function MedicineInventory() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = mockMedicines.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'low' && m.lowStock) || (filter === 'ok' && !m.lowStock);
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div className="page-header">
        <h2>📦 Medicine Inventory</h2>
        <p>{mockMedicines.length} medicines · {mockMedicines.filter(m => m.lowStock).length} low stock</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input className="form-input" placeholder="Search medicine or category..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '38px' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'low', 'ok'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)}>
              {f === 'all' ? '📋 All' : f === 'low' ? '⚠️ Low Stock' : '✅ In Stock'}
            </button>
          ))}
        </div>
        <button className="btn btn-sm btn-success">+ Add Medicine</button>
      </div>

      <div className="table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Medicine Name</th>
              <th>Category</th>
              <th>Stock (Units)</th>
              <th>Expiry</th>
              <th>Price (₹)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.id} className={m.lowStock ? 'low-stock-row' : ''}>
                <td style={{ fontWeight: 700, color: '#94a3b8' }}>{i + 1}</td>
                <td style={{ fontWeight: 700 }}>
                  💊 {m.name}
                </td>
                <td><span className="badge badge-blue">{m.category}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: m.lowStock ? '#ef4444' : '#22c55e', width: `${Math.min((m.stock / 500) * 100, 100)}%`, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                    </div>
                    <span style={{ fontWeight: 700, color: m.lowStock ? '#b91c1c' : '#15803d' }}>{m.stock}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{m.expiry}</td>
                <td style={{ fontWeight: 700 }}>₹{m.price.toFixed(2)}</td>
                <td>
                  {m.lowStock
                    ? <span className="badge badge-red"><AlertTriangle size={10} /> Low Stock</span>
                    : <span className="badge badge-green">✅ OK</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon">🔍</div><div className="empty-state-title">No medicines found</div></div>}
    </div>
  );
}
