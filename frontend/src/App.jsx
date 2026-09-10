import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import TransactionDetails from './pages/TransactionDetails';
import SalesDashboard from './pages/SalesDashboard';
import Sales from './pages/Sales';
import SalesDetails from './pages/SalesDetails';
import ApprovalInbox from './pages/ApprovalInbox';
import ExceptionCenter from './pages/ExceptionCenter';
import Reconciliation from './pages/Reconciliation';
import Profitability from './pages/Profitability';
import DispatchTower from './pages/DispatchTower';
import SupplierAnalytics from './pages/SupplierAnalytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="transactions/:id" element={<TransactionDetails />} />
          <Route path="sales-dashboard" element={<SalesDashboard />} />
          <Route path="sales" element={<Sales />} />
          <Route path="sales/:id" element={<SalesDetails />} />
          <Route path="approval-inbox" element={<ApprovalInbox />} />
          <Route path="exceptions" element={<ExceptionCenter />} />
          <Route path="procurement/reconciliation" element={<Reconciliation />} />
          <Route path="analytics/profitability" element={<Profitability />} />
          <Route path="sales/dispatch-tower" element={<DispatchTower />} />
          <Route path="procurement/suppliers" element={<SupplierAnalytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
