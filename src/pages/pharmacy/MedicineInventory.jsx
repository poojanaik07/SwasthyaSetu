import React, { useState } from 'react';
import { mockMedicines as initialMedicines } from '../../utils/mockData';
import { Search, AlertTriangle, Plus, X, Clock } from 'lucide-react';

export default function MedicineInventory() {
  const [medicines, setMedicines] = useState(initialMedicines);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', category: 'Analgesic', stock: '', expiry: '', price: '', supplier: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    const added = {
      id: Date.now(),
      name: newMed.name,
      category: newMed.category,
      stock: parseInt(newMed.stock) || 0,
      expiry: newMed.expiry,
      price: parseFloat(newMed.price) || 0,
      lowStock: (parseInt(newMed.stock) || 0) < 50
    };
    setMedicines([added, ...medicines]);
    setShowAddModal(false);
    setNewMed({ name: '', category: 'Analgesic', stock: '', expiry: '', price: '', supplier: '' });
  };

  const filtered = medicines.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'low' && m.lowStock) || (filter === 'ok' && !m.lowStock);
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div className="page-header">
        <h2>📦 Medicine Inventory</h2>
        <p>{medicines.length} medicines · {medicines.filter(m => m.lowStock).length} low stock</p>
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
        <button className="btn btn-sm btn-success" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add Medicine
        </button>
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
            {filtered.map((m, i) => {
              const isExpiringSoon = m.expiry && m.expiry.startsWith('2026-0');
              return (
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
                  <td style={{ fontWeight: 600 }}>
                    {isExpiringSoon ? (
                      <span style={{ color: '#b45309', display: 'flex', alignItems: 'center', gap: '4px', background: '#fef3c7', padding: '2px 6px', borderRadius: '4px' }}>
                        <Clock size={12} /> {m.expiry} (Soon)
                      </span>
                    ) : (
                      m.expiry
                    )}
                  </td>
                  <td style={{ fontWeight: 700 }}>₹{m.price.toFixed(2)}</td>
                  <td>
                    {m.lowStock
                      ? <span className="badge badge-red"><AlertTriangle size={10} /> Low Stock</span>
                      : <span className="badge badge-green">✅ OK</span>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon">🔍</div><div className="empty-state-title">No medicines found</div></div>}

      {/* ADD MEDICINE MODAL */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '20px', padding: '0' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <div className="card-title">Add New Medicine</div>
              <button className="btn btn-ghost" style={{ padding: '4px' }} onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Medicine Name</label>
                  <input className="form-input" required value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} placeholder="e.g. Crocin 500mg" />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-select" value={newMed.category} onChange={e => setNewMed({...newMed, category: e.target.value})}>
                    <option>Analgesic</option>
                    <option>Antibiotic</option>
                    <option>Antihistamine</option>
                    <option>Antidiabetic</option>
                    <option>Supplement</option>
                    <option>Rehydration</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Supplier Name</label>
                  <input className="form-input" required value={newMed.supplier} onChange={e => setNewMed({...newMed, supplier: e.target.value})} placeholder="Supplier or Brand" />
                </div>
                <div>
                  <label className="form-label">Stock Quantity</label>
                  <input className="form-input" type="number" required min="0" value={newMed.stock} onChange={e => setNewMed({...newMed, stock: e.target.value})} placeholder="0" />
                </div>
                <div>
                  <label className="form-label">Price (₹)</label>
                  <input className="form-input" type="number" step="0.5" required min="0" value={newMed.price} onChange={e => setNewMed({...newMed, price: e.target.value})} placeholder="0.00" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Expiry Date (YYYY-MM)</label>
                  <input className="form-input" type="month" required value={newMed.expiry} onChange={e => setNewMed({...newMed, expiry: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Medicine</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
