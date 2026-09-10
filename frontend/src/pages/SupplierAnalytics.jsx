import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/api';

const SupplierAnalytics = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/suppliers`)
      .then(res => res.json())
      .then(data => {
        setSuppliers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page-content">Loading...</div>;

  return (
    <div className="page-content">
      <div className="section-header mb-4">
        <h1 className="title-lg">Supplier Scorecard & Risk Radar</h1>
        <p className="text-sm">Evaluate procurement supplier performance and identify operational risks.</p>
      </div>

      <div className="dashboard-grid mb-4">
        {suppliers.map(s => (
          <div key={s._id} className="glass-panel" style={{ padding: '1.5rem' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="title-md mb-0">{s.name}</h3>
              <span className={`badge ${s.riskCategory === 'EXCELLENT' ? 'badge-success' : s.riskCategory === 'ATTENTION' ? 'badge-warning' : 'badge-danger'}`}>
                {s.riskCategory}
              </span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <p className="text-xs text-tertiary font-bold mb-1">ON-TIME DELIVERY</p>
                <p className={`font-medium ${s.onTimeDeliveryPercent < 95 ? 'text-warning' : 'text-success'}`}>{s.onTimeDeliveryPercent.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-tertiary font-bold mb-1">QUALITY ACCEPTANCE</p>
                <p className={`font-medium ${s.qualityAcceptancePercent < 98 ? 'text-warning' : 'text-success'}`}>{s.qualityAcceptancePercent.toFixed(1)}%</p>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '4px' }}>
              <p className="text-xs text-secondary font-bold mb-2">RISK SCORE: {s.riskScore}/100</p>
              {s.riskFactors.length > 0 ? (
                <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {s.riskFactors.map((rf, i) => <li key={i}>{rf}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-secondary mb-0">No risk factors detected.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierAnalytics;
