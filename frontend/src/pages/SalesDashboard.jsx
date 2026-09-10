import React, { useState, useEffect } from 'react';
import { DollarSign, Droplet, TrendingUp, CheckCircle, Package } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { getSalesSummary, getSales } from '../services/api';
import './Dashboard.css'; // Reuse Dashboard CSS

// Using mock monthly data for the chart, but scaling it up for realism based on the 858 records
const monthlyProfitData = [
  { name: 'Jan', profit: 1200000 },
  { name: 'Feb', profit: 1500000 },
  { name: 'Mar', profit: 1400000 },
  { name: 'Apr', profit: 2100000 },
  { name: 'May', profit: 3800000 },
];

const COLORS = ['var(--accent-primary)', 'var(--accent-secondary)', 'var(--blue)'];

const SalesDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalVolume: 0,
    activeTransactions: 0,
    completedTransactions: 0,
    topProducts: []
  });
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, salesData] = await Promise.all([
          getSalesSummary(),
          getSales()
        ]);
        setStats(summaryData);
        setRecentSales(salesData.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch sales data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="dashboard"><h2 className="title-md">Loading Sales Dashboard...</h2></div>;
  }

  // Format top products for chart
  const topProductsChart = stats.topProducts.map(p => ({
    name: p._id,
    volume: p.volume
  }));

  return (
    <div className="dashboard animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="title-lg">Sales & Downstream Overview</h1>
          <p className="text-sm">Real-time tracking of refined product dispatches and profit.</p>
        </div>
        <button className="btn-primary" onClick={() => window.print()}>
          Generate Report
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon bg-blue"><DollarSign size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue (MTD)</p>
            <h3 className="stat-value">${(stats.totalRevenue / 1000000).toFixed(2)}M</h3>
            <p className="stat-trend positive">+8.2% from last month</p>
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-icon bg-accent"><TrendingUp size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Total Profit (MTD)</p>
            <h3 className="stat-value">${(stats.totalProfit / 1000000).toFixed(2)}M</h3>
            <p className="stat-trend positive">+11.4% from last month</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon bg-secondary"><Droplet size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Volume Dispatched</p>
            <h3 className="stat-value">{(stats.totalVolume / 1000000).toFixed(2)}M LTRS</h3>
            <p className="stat-trend positive">+3.1% from last month</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container glass-panel">
          <h3 className="title-md chart-title">Profit Overview (2024)</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyProfitData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-secondary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent-secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--text-tertiary)" />
                <YAxis stroke="var(--text-tertiary)" tickFormatter={(val) => `$${val/1000000}M`} />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  formatter={(value) => [`$${(value/1000000).toFixed(2)}M`, 'Profit']}
                />
                <Area type="monotone" dataKey="profit" stroke="var(--accent-secondary)" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container glass-panel">
          <h3 className="title-md chart-title">Top Products Dispatched (LTRS)</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topProductsChart} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <XAxis type="number" stroke="var(--text-tertiary)" />
                <YAxis dataKey="name" type="category" stroke="var(--text-tertiary)" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  formatter={(value) => [value.toLocaleString(), 'Volume']}
                />
                <Bar dataKey="volume" radius={[0, 4, 4, 0]}>
                  {topProductsChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="recent-transactions glass-panel">
        <div className="section-header">
          <h3 className="title-md">Recent Dispatches</h3>
          <button className="btn-secondary">View All</button>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Voucher No</th>
                <th>OMC Client</th>
                <th>Product</th>
                <th>Volume (LTRS)</th>
                <th>Profit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map(sale => (
                <tr key={sale._id}>
                  <td className="font-medium text-accent">{sale.voucherNo}</td>
                  <td>{sale.client}</td>
                  <td>{sale.product}</td>
                  <td>{sale.quantity.toLocaleString()}</td>
                  <td className="text-accent-secondary">${Math.round(sale.profit).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${sale.status.toLowerCase()}`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
