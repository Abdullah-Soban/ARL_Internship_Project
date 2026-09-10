import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/api';

const ExceptionCenter = () => {
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/exceptions`)
      .then(res => res.json())
      .then(data => {
        setExceptions(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page-content">Loading...</div>;

  return (
    <div className="page-content">
      <div className="section-header mb-4">
        <h1 className="title-lg">Exception Center</h1>
        <p className="text-sm">Comprehensive log of all system exceptions.</p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Reference</th>
              <th>Category</th>
              <th>Severity</th>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {exceptions.map(exc => (
              <tr key={exc._id}>
                <td>{new Date(exc.createdAt).toLocaleDateString()}</td>
                <td className="font-medium text-accent">{exc.referenceId}</td>
                <td>{exc.category}</td>
                <td>
                  <span className={`badge ${exc.severity === 'CRITICAL' ? 'badge-danger' : exc.severity === 'HIGH' ? 'badge-danger' : 'badge-warning'}`}>
                    {exc.severity}
                  </span>
                </td>
                <td>{exc.message}</td>
                <td>
                  <span className={`badge ${exc.status === 'RESOLVED' ? 'badge-success' : 'badge-neutral'}`}>
                    {exc.status}
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

export default ExceptionCenter;
