import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, Download, FileText, CheckCircle, Calendar, Hash } from 'lucide-react';
import { API_BASE_URL, runAIAnalysis } from '../services/api';
import './TransactionDetails.css'; // Reusing details CSS

const SalesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [aiFlags, setAiFlags] = useState(0);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sales/${id}`);
        const data = await response.json();
        setSale(data);
      } catch (error) {
        console.error("Failed to fetch sale details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSale();
  }, [id]);

  const handleRunAI = async () => {
    setAiLoading(true);
    setAiResult('');
    try {
      const data = await runAIAnalysis(sale);
      setAiFlags(data.flagCount || 0);
      
      // Simulate typing effect
      let i = 0;
      const text = data.analysis;
      setAiResult('');
      const interval = setInterval(() => {
        setAiResult(prev => prev + text.charAt(i));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 15);
    } catch (err) {
      setAiResult('Error generating AI insights. Please try again later.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!sale) return;
    const text = `
    ======================================
    ARL OIL ACCOUNTING - SALES DISPATCH INVOICE
    ======================================
    Voucher ID: ${sale.voucherNo}
    Date: ${new Date(sale.date).toLocaleString()}
    OMC Client: ${sale.client}
    Transport: ${sale.transportType}
    Tank No: ${sale.tankNo}
    Bowser No: ${sale.bowserNo}
    --------------------------------------
    Product: ${sale.product}
    Volume: ${sale.quantity.toLocaleString()} ${sale.unit}
    Price Per Unit: $${sale.pricePerUnit.toFixed(2)}
    --------------------------------------
    REVENUE: $${sale.revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}
    COST: $${sale.cost.toLocaleString(undefined, {minimumFractionDigits: 2})}
    PROFIT: $${Math.round(sale.profit).toLocaleString()}
    STATUS: ${sale.status}
    ======================================
    Generated on: ${new Date().toLocaleString()}
    `;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dispatch_${sale.voucherNo}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="details-page"><h2 className="title-md">Loading Details...</h2></div>;
  }

  if (!sale) {
    return <div className="details-page"><h2 className="title-md">Sale not found</h2></div>;
  }

  return (
    <div className="details-page animate-fade-in">
      <div className="page-header">
        <button className="back-link" onClick={() => navigate('/sales')} style={{background: 'none', border: 'none', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem'}}>
          <ArrowLeft size={18} /> Back to Sales
        </button>
      </div>

      <div className="details-container glass-panel">
        <div className="details-header">
          <div className="details-title-row">
            <h1 className="title-lg mb-0">{sale.voucherNo}</h1>
            <span className={`badge badge-lg ${
              sale.status === 'Completed' ? 'badge-success' : 
              sale.status === 'Failed' ? 'badge-danger' : 
              'badge-warning'
            }`}>
              <CheckCircle size={20} className="text-success" />
              {sale.status}
            </span>
          </div>
          <p className="text-sm client-name">{sale.client}</p>
        </div>

        <div className="details-grid">
          <div className="info-group">
            <div className="info-icon"><Calendar size={20} /></div>
            <div className="info-content">
              <label>Dispatch Date</label>
              <p>{new Date(sale.date).toLocaleString()}</p>
            </div>
          </div>

          <div className="info-group">
            <div className="info-icon"><FileText size={20} /></div>
            <div className="info-content">
              <label>Product</label>
              <p>{sale.product}</p>
            </div>
          </div>

          <div className="info-group">
            <div className="info-icon"><Hash size={20} /></div>
            <div className="info-content">
              <label>Volume</label>
              <p>{sale.quantity.toLocaleString()} {sale.unit}</p>
            </div>
          </div>

          <div className="info-group">
            <div className="info-icon"><FileText size={20} /></div>
            <div className="info-content">
              <label>Transport & Bowser</label>
              <p>{sale.transportType.replace('_', ' ').toUpperCase()} - {sale.bowserNo}</p>
            </div>
          </div>
        </div>

        <div className="financial-summary">
          <h3 className="title-md mb-4">Financial Summary</h3>
          <div className="financial-row">
            <span>Price Per {sale.unit}</span>
            <span>${sale.pricePerUnit.toFixed(2)}</span>
          </div>
          <div className="financial-row">
            <span>Total Revenue</span>
            <span>${sale.revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div className="financial-row">
            <span>Estimated Cost</span>
            <span>${sale.cost.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div className="financial-divider"></div>
          <div className="financial-row total-row">
            <span>Gross Profit</span>
            <span className="text-gradient">${Math.round(sale.profit).toLocaleString()}</span>
          </div>
        </div>

        <div className="ai-section mb-4">
          <button 
            className="btn-primary ai-btn" 
            onClick={handleRunAI} 
            disabled={aiLoading || aiResult.length > 0}
          >
            <BrainCircuit size={18} />
            {aiLoading ? 'Analyzing...' : 'Run Sales AI Analysis'}
          </button>

          {(aiResult || aiLoading) && (
            <div className={`ai-insights-panel ${aiLoading && !aiResult ? 'pulse' : ''}`}>
              <div className="ai-header">
                <BrainCircuit size={18} className="text-accent" />
                <h4 className="title-md mb-0">AI Insights</h4>
              </div>
              <div className="ai-content" dangerouslySetInnerHTML={{ __html: aiResult.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
          )}
        </div>

        <div className="details-actions">
          <button className="btn-secondary" onClick={() => window.print()}>Print Record</button>
          <button className="btn-primary" onClick={handleDownloadInvoice}>Download Invoice</button>
        </div>
      </div>
    </div>
  );
};

export default SalesDetails;
