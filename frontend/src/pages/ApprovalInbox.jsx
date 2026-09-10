import React, { useState, useEffect } from 'react';
import { CheckSquare, XCircle, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../services/api';

const ApprovalInbox = () => {
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/exceptions`)
      .then(res => res.json())
      .then(data => {
        setExceptions(data.filter(e => e.status === 'IN_REVIEW' || e.status === 'OPEN'));
        setLoading(false);
      });
  }, []);

  const handleAction = async (id, action) => {
    try {
      await fetch(`${API_BASE_URL}/exceptions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action === 'Approve' ? 'RESOLVED' : 'DISMISSED', actionTaken: action })
      });
      setExceptions(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="page-content">Loading...</div>;

  return (
    <div className="page-content">
      <div className="section-header mb-4">
        <h1 className="title-lg">Approval Inbox</h1>
        <p className="text-sm">Items requiring immediate managerial attention.</p>
      </div>

      {exceptions.length === 0 ? (
        <div className="empty-state">No items requiring approval.</div>
      ) : (
        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
          {exceptions.map(exc => (
            <div key={exc._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${exc.severity === 'CRITICAL' || exc.severity === 'HIGH' ? 'badge-danger' : 'badge-warning'}`}>
                    {exc.severity}
                  </span>
                  <span className="font-bold">{exc.category}</span>
                  <span className="text-sm">Ref: {exc.referenceId}</span>
                </div>
                <p className="mb-1">{exc.message}</p>
                <p className="text-sm">Partner: {exc.partner}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleAction(exc._id, 'Approve')} className="btn-primary" style={{ backgroundColor: 'var(--success)' }}>
                  <CheckCircle size={16} /> Approve
                </button>
                <button onClick={() => handleAction(exc._id, 'Reject')} className="btn-primary" style={{ backgroundColor: 'var(--danger)' }}>
                  <XCircle size={16} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalInbox;
