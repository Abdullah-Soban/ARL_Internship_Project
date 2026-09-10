import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/api';

const Profitability = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/customers`)
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page-content">Loading...</div>;

  return (
    <div className="page-content">
      <div className="section-header mb-4">
        <h1 className="title-lg">OMC Profitability & Credit Exposure</h1>
        <p className="text-sm">Analyze margins and credit risk for downstream clients.</p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>OMC Client</th>
              <th>Total Revenue</th>
              <th>Total Profit</th>
              <th>Margin %</th>
              <th>Credit Limit</th>
              <th>Outstanding</th>
              <th>Utilization</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => {
              const util = parseFloat(c.creditUtilization);
              return (
                <tr key={c._id}>
                  <td className="font-medium">{c.name}</td>
                  <td>Rs. {c.totalRevenue.toLocaleString()}</td>
                  <td className="text-success font-medium">Rs. {c.totalProfit.toLocaleString()}</td>
                  <td>{c.marginPercent.toFixed(1)}%</td>
                  <td>Rs. {c.creditLimit.toLocaleString()}</td>
                  <td>Rs. {Math.round(c.outstandingAmount).toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '100px', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(util, 100)}%`, height: '100%', backgroundColor: util > 85 ? 'var(--danger)' : util > 70 ? 'var(--warning)' : 'var(--success)' }}></div>
                      </div>
                      <span className={util > 85 ? 'text-danger font-bold' : ''}>{util}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${c.status === 'CREDIT_HOLD' ? 'badge-danger' : 'badge-success'}`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profitability;
