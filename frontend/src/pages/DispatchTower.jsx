import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/api';

const DispatchTower = () => {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/sales`)
      .then(res => res.json())
      .then(data => {
        // Just take the first 30 for the live tower view
        setDispatches(data.slice(0, 30));
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page-content">Loading Tower...</div>;

  const activeCount = dispatches.filter(d => d.status === 'Processing' || d.status === 'Pending').length;
  const exceptionCount = dispatches.filter(d => d.quantity > 55000).length;

  return (
    <div className="page-content">
      <div className="section-header mb-4">
        <h1 className="title-lg">Dispatch Control Tower</h1>
        <p className="text-sm">Live operational monitoring of downstream tank lorry dispatches.</p>
      </div>

      <div className="dashboard-grid mb-4">
        <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
          <p className="text-sm text-secondary font-bold mb-1">LOADING</p>
          <p className="title-lg text-info mb-0">{Math.floor(activeCount / 2)}</p>
        </div>
        <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
          <p className="text-sm text-secondary font-bold mb-1">WAITING</p>
          <p className="title-lg text-warning mb-0">{Math.ceil(activeCount / 2)}</p>
        </div>
        <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
          <p className="text-sm text-secondary font-bold mb-1">DISPATCHED</p>
          <p className="title-lg text-success mb-0">{dispatches.length - activeCount}</p>
        </div>
        <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
          <p className="text-sm text-secondary font-bold mb-1">EXCEPTIONS</p>
          <p className="title-lg text-danger mb-0">{exceptionCount}</p>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Bowser / Tank No</th>
              <th>OMC Client</th>
              <th>Product</th>
              <th>Volume (L)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dispatches.map(d => (
              <tr key={d._id}>
                <td>{new Date(d.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                <td className="font-medium">{d.bowserNo || 'N/A'} <span className="text-xs text-tertiary">({d.tankNo || 'N/A'})</span></td>
                <td>{d.client}</td>
                <td>{d.product}</td>
                <td className={d.quantity > 55000 ? 'text-danger font-bold' : ''}>{d.quantity.toLocaleString()}</td>
                <td>
                  <span className={`badge ${d.status === 'Completed' || d.status === 'Posted' ? 'badge-success' : 'badge-info'}`}>
                    {d.status === 'Posted' ? 'Dispatched' : d.status === 'Processing' ? 'Loading' : d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DispatchTower;
