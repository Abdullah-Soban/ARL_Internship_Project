import React, { useState, useEffect } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSales } from '../services/api';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await getSales();
        setSales(data);
      } catch (error) {
        console.error("Failed to fetch sales", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const filteredSales = sales.filter(s => 
    s.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    if (sales.length === 0) return;
    
    const headers = ['Voucher No', 'Date', 'OMC Client', 'Product', 'Volume (LTRS)', 'Transport', 'Tank No', 'Bowser No', 'Revenue', 'Profit', 'Status'];
    const csvRows = [headers.join(',')];
    
    sales.forEach(s => {
      const row = [
        s.voucherNo,
        new Date(s.date).toISOString().split('T')[0],
        `"${s.client}"`,
        s.product,
        s.quantity,
        s.transportType,
        s.tankNo,
        s.bowserNo,
        s.revenue,
        s.profit,
        s.status
      ];
      csvRows.push(row.join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arl_sales_dispatches_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="transactions-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="title-lg">Sales Dispatches</h1>
          <p className="text-sm">Manage and view all downstream product dispatches.</p>
        </div>
        <button className="btn-secondary" onClick={handleExportCSV} disabled={sales.length === 0}>
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="table-container glass-panel">
        <div className="table-controls">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by Voucher, Client, or Product..." 
              className="input-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-secondary">
            <Filter size={18} /> Filter
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading sales data...</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Voucher No</th>
                  <th>Date</th>
                  <th>OMC Client</th>
                  <th>Product</th>
                  <th>Volume (LTRS)</th>
                  <th>Tank No</th>
                  <th>Bowser No</th>
                  <th>Profit</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map(sale => (
                  <tr key={sale._id}>
                    <td className="font-medium text-accent">{sale.voucherNo}</td>
                    <td>{new Date(sale.date).toLocaleDateString()}</td>
                    <td>{sale.client}</td>
                    <td>{sale.product}</td>
                    <td>{sale.quantity.toLocaleString()}</td>
                    <td>{sale.tankNo}</td>
                    <td>{sale.bowserNo}</td>
                    <td className="text-accent-secondary">${Math.round(sale.profit).toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${sale.status.toLowerCase()}`}>
                        {sale.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-secondary" style={{padding: '6px 12px', fontSize: '0.75rem'}} onClick={() => navigate(`/sales/${sale._id}`)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
