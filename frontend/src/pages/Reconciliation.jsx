import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/api';

const Reconciliation = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/transactions`)
      .then(res => res.json())
      .then(data => {
        // Filter out those with discrepancy data
        const withMatchData = data.filter(t => t.poQuantity);
        setTransactions(withMatchData);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page-content">Loading...</div>;

  return (
    <div className="page-content">
      <div className="section-header mb-4">
        <h1 className="title-lg">Three-Way Match Reconciliation</h1>
        <p className="text-sm">Verify PO vs Goods Received (GRN) vs Supplier Invoice.</p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Ref ID</th>
              <th>Supplier</th>
              <th>PO Quantity</th>
              <th>Received</th>
              <th>Invoice</th>
              <th>Variance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(txn => {
              const variance = txn.poQuantity - txn.receivedQuantity;
              return (
                <tr key={txn._id}>
                  <td className="font-medium text-accent">{txn.txnId}</td>
                  <td>{txn.supplier}</td>
                  <td>{txn.poQuantity?.toLocaleString() || '-'}</td>
                  <td className={variance !== 0 ? 'text-danger font-medium' : ''}>{txn.receivedQuantity?.toLocaleString() || '-'}</td>
                  <td>{txn.invoiceQuantity?.toLocaleString() || '-'}</td>
                  <td className={variance !== 0 ? 'text-danger font-bold' : ''}>
                    {variance !== 0 ? `-${variance.toLocaleString()}` : '0'}
                  </td>
                  <td>
                    <span className={`badge ${txn.discrepancyStatus === 'DISCREPANCY' ? 'badge-danger' : 'badge-success'}`}>
                      {txn.discrepancyStatus}
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

export default Reconciliation;
