import React, { useState, useEffect } from 'react';
import { ShieldAlert, TrendingUp, Package, CheckCircle, Clock } from 'lucide-react';
import { API_BASE_URL } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/analytics/morning-brief`)
      .then(res => res.json())
      .then(data => {
        setBrief(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page-content flex items-center justify-center">Loading dashboard...</div>;

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="page-content dashboard animate-fade-in">
      <div className="dashboard-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
        <div>
          <h1 className="title-lg" style={{ color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>ARL OilSync</h1>
          <p className="text-secondary" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Oil Department &middot; {dateStr}</p>
        </div>
      </div>

      <div>
        <h2 className="title-md mb-2">GOOD MORNING, OPERATIONS TEAM</h2>
        <div style={{ backgroundColor: '#e0f2fe', borderLeft: '4px solid #0284c7', padding: '1rem', borderRadius: '4px', color: '#0f172a' }}>
          <p className="font-medium mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: '#0369a1' }}>MORNING BRIEF</p>
          <p className="text-sm font-medium">{brief.message}</p>
        </div>
      </div>

      <div className="dashboard-grid mt-4">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex items-center gap-2 mb-4">
            <Package size={20} className="text-info" />
            <h3 className="title-sm mb-0">Procurement</h3>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-secondary text-sm">Pending GRNs</span>
            <span className="font-bold text-lg">{brief.pendingProcurements}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary text-sm">Suppliers Attention</span>
            <span className={`text-lg font-bold ${brief.suppliersAttention > 0 ? 'text-warning' : ''}`}>{brief.suppliersAttention}</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-success" />
            <h3 className="title-sm mb-0">Sales & Logistics</h3>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-secondary text-sm">Active Dispatches</span>
            <span className="font-bold text-lg">{brief.activeDispatches}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary text-sm">OMC Credit Holds</span>
            <span className={`text-lg font-bold ${brief.customersHold > 0 ? 'text-danger' : ''}`}>{brief.customersHold}</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert size={20} className="text-danger" />
            <h3 className="title-sm mb-0">Exceptions</h3>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-secondary text-sm">Open Exceptions</span>
            <span className={`text-lg font-bold ${brief.openExceptions > 0 ? 'text-danger' : ''}`}>{brief.openExceptions}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary text-sm">Status</span>
            <span className="badge badge-warning">Review Required</span>
          </div>
        </div>
      </div>

      <div className="glass-panel mt-2" style={{ padding: '1.5rem' }}>
        <h3 className="title-sm mb-4">What Changed Today</h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <li className="flex items-center gap-3 text-sm">
            <div style={{ backgroundColor: '#dcfce7', padding: '0.25rem', borderRadius: '4px' }}><TrendingUp size={16} className="text-success" /></div>
            <span>Dispatch volume increased <strong>8.6%</strong> compared to 7-day average.</span>
          </li>
          <li className="flex items-center gap-3 text-sm">
            <div style={{ backgroundColor: '#fef3c7', padding: '0.25rem', borderRadius: '4px' }}><Clock size={16} className="text-warning" /></div>
            <span><strong>{brief.suppliersAttention}</strong> new supplier delivery delays detected.</span>
          </li>
          <li className="flex items-center gap-3 text-sm">
            <div style={{ backgroundColor: '#e0f2fe', padding: '0.25rem', borderRadius: '4px' }}><CheckCircle size={16} className="text-info" /></div>
            <span><strong>12</strong> exception reviews completed successfully.</span>
          </li>
        </ul>
      </div>

    </div>
  );
};

export default Dashboard;
