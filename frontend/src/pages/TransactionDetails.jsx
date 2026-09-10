import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Hash, FileText, CheckCircle, Clock, XCircle, AlertCircle, Sparkles } from 'lucide-react';
import { fetchTransactionById, runAIAnalysis } from '../services/api';
import './TransactionDetails.css';

const TransactionDetails = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');

  useEffect(() => {
    const loadTransaction = async () => {
      try {
        const data = await fetchTransactionById(id);
        setTransaction(data);
      } catch (err) {
        setError('Failed to load transaction details.');
      } finally {
        setLoading(false);
      }
    };

    loadTransaction();
  }, [id]);

  const handleRunAI = async () => {
    setAiLoading(true);
    setAiResult('');
    try {
      const data = await runAIAnalysis(transaction);
      // Simulate typing effect
      let i = 0;
      const text = data.analysis;
      setAiResult('');
      const interval = setInterval(() => {
        setAiResult(prev => prev + text.charAt(i));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 15); // typing speed
    } catch (err) {
      setAiResult('Error generating AI insights. Please try again later.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!transaction) return;
    const text = `
    ======================================
    ARL OIL ACCOUNTING - OFFICIAL INVOICE
    ======================================
    Transaction ID: ${transaction.txnId}
    Date: ${new Date(transaction.date).toLocaleString()}
    Supplier: ${transaction.supplier}
    Location: ${transaction.location}
    --------------------------------------
    Oil Grade: ${transaction.grade}
    Volume: ${transaction.volume.toLocaleString()} ${transaction.unit}
    Price Per Unit: $${transaction.pricePerUnit.toFixed(2)}
    --------------------------------------
    TOTAL AMOUNT: $${transaction.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}
    STATUS: ${transaction.status}
    ======================================
    Generated on: ${new Date().toLocaleString()}
    `;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${transaction.txnId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="details-page"><h2 className="title-md">Loading Details...</h2></div>;
  }

  if (error || !transaction) {
    return (
      <div className="details-page error-state">
        <AlertCircle size={48} className="text-danger mb-4" />
        <h2 className="title-md">{error || 'Transaction not found'}</h2>
        <Link to="/transactions" className="btn-secondary mt-4">Back to Transactions</Link>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <CheckCircle size={20} className="text-success" />;
      case 'Processing': return <Clock size={20} className="text-warning" />;
      case 'Pending Approval': return <Clock size={20} className="text-warning" />;
      case 'Failed': return <XCircle size={20} className="text-danger" />;
      default: return <Clock size={20} className="text-tertiary" />;
    }
  };

  return (
    <div className="details-page animate-fade-in">
      <div className="page-header">
        <Link to="/transactions" className="back-link">
          <ArrowLeft size={18} />
          Back to Transactions
        </Link>
      </div>

      <div className="details-container glass-panel">
        <div className="details-header">
          <div className="details-title-row">
            <h1 className="title-lg mb-0">{transaction.txnId}</h1>
            <span className={`badge badge-lg ${
              transaction.status === 'Completed' ? 'badge-success' : 
              transaction.status === 'Failed' ? 'badge-danger' : 
              'badge-warning'
            }`}>
              {getStatusIcon(transaction.status)}
              {transaction.status}
            </span>
          </div>
          <p className="text-sm client-name">{transaction.supplier}</p>
        </div>

        <div className="details-grid">
          <div className="info-group">
            <div className="info-icon"><Calendar size={20} /></div>
            <div className="info-content">
              <label>Transaction Date</label>
              <p>{new Date(transaction.date).toLocaleString()}</p>
            </div>
          </div>

          <div className="info-group">
            <div className="info-icon"><MapPin size={20} /></div>
            <div className="info-content">
              <label>Location</label>
              <p>{transaction.location}</p>
            </div>
          </div>

          <div className="info-group">
            <div className="info-icon"><FileText size={20} /></div>
            <div className="info-content">
              <label>Oil Grade</label>
              <p>{transaction.grade}</p>
            </div>
          </div>

          <div className="info-group">
            <div className="info-icon"><Hash size={20} /></div>
            <div className="info-content">
              <label>Volume</label>
              <p>{transaction.volume.toLocaleString()} {transaction.unit}</p>
            </div>
          </div>
        </div>

        <div className="financial-summary">
          <h3 className="title-md mb-4">Financial Summary</h3>
          <div className="financial-row">
            <span>Price Per Unit</span>
            <span>${transaction.pricePerUnit.toFixed(2)}</span>
          </div>
          <div className="financial-row">
            <span>Volume Processed</span>
            <span>{transaction.volume.toLocaleString()} Bbls</span>
          </div>
          <div className="financial-divider"></div>
          <div className="financial-row total-row">
            <span>Total Amount</span>
            <span className="text-gradient">${transaction.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
        </div>

        <div className="ai-section mb-4">
          <button 
            className="btn-primary ai-btn" 
            onClick={handleRunAI} 
            disabled={aiLoading || aiResult.length > 0}
          >
            <Sparkles size={18} />
            {aiLoading ? 'Analyzing...' : 'Run AI Exception Analysis'}
          </button>

          {(aiResult || aiLoading) && (
            <div className={`ai-insights-panel ${aiLoading && !aiResult ? 'pulse' : ''}`}>
              <div className="ai-header">
                <Sparkles size={18} className="text-accent" />
                <h4 className="title-md mb-0">AI Insights</h4>
              </div>
              <div className="ai-content">
                {aiResult.split('\n').map((line, idx) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <strong key={idx}>{line.replace(/\*\*/g, '')}<br/></strong>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={idx} style={{marginLeft: '1.5rem', marginBottom: '0.5rem'}}>{line.replace('- ', '')}</li>;
                  }
                  return <React.Fragment key={idx}>{line.replace(/\*\*/g, '')}<br/></React.Fragment>;
                })}
              </div>
            </div>
          )}
        </div>

        <div className="details-actions">
          <button className="btn-secondary" onClick={() => window.print()}>Print Receipt</button>
          <button className="btn-primary" onClick={handleDownloadInvoice}>Download Invoice</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
