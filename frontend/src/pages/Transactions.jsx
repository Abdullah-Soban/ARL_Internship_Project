import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Download } from 'lucide-react';
import { fetchTransactions } from '../services/api';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // We can debounce this in a real app, but for local prototyping this is fine.
  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const data = await fetchTransactions(searchTerm, statusFilter);
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Simple debounce approach
    const timeoutId = setTimeout(() => {
      loadTransactions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter]);

  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    
    const headers = ['Transaction ID', 'Date', 'Supplier', 'Grade', 'Volume', 'Unit', 'Price/Unit', 'Total Amount', 'Status', 'Location'];
    const csvRows = [headers.join(',')];
    
    transactions.forEach(txn => {
      const row = [
        txn.txnId,
        new Date(txn.date).toISOString().split('T')[0],
        `"${txn.supplier}"`,
        txn.grade,
        txn.volume,
        txn.unit,
        txn.pricePerUnit,
        txn.totalAmount,
        txn.status,
        `"${txn.location}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arl_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div>
          <h1 className="title-lg">Transactions</h1>
          <p className="text-sm">Manage and view all oil accounting transactions.</p>
        </div>
        <button className="btn-secondary" onClick={handleExportCSV} disabled={transactions.length === 0}>
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="transactions-container glass-panel">
        <div className="toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by ID or Supplier..." 
              className="input-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <Filter size={18} className="filter-icon" />
            <select 
              className="input-base"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Processing">Processing</option>
              <option value="Pending Approval">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Supplier</th>
                <th>Grade</th>
                <th>Volume (Bbls)</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="empty-state">Loading transactions...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                transactions.map(txn => (
                  <tr key={txn._id}>
                    <td className="font-medium text-accent">{txn.txnId}</td>
                    <td>{new Date(txn.date).toLocaleDateString()}</td>
                    <td>{txn.supplier}</td>
                    <td>{txn.grade}</td>
                    <td>{txn.volume.toLocaleString()}</td>
                    <td>${txn.totalAmount.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${
                        txn.status === 'Completed' ? 'badge-success' : 
                        txn.status === 'Failed' ? 'badge-danger' : 
                        'badge-warning'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/transactions/${txn._id}`} className="btn-text">View</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
