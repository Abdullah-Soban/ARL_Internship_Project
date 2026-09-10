import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ReceiptText, Settings, Database, LogOut, Users, 
  TrendingUp, Truck, CheckSquare, ShieldAlert, BarChart3, Factory, ClipboardCheck, History, Sun
} from 'lucide-react';
import { showToast } from '../utils/toast';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Factory className="logo-icon" size={28} />
        <span className="logo-text">ARL Oil<span className="text-accent ml-1">Sync</span></span>
      </div>
      
      <div className="sidebar-scrollable">
        <nav className="sidebar-nav">
          
          <div className="nav-section-title">Overview</div>
          <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Executive Dashboard</span>
          </NavLink>

          <div className="nav-section-title">Procurement</div>
          <NavLink to="/transactions" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <ReceiptText size={18} />
            <span>Purchases (GRN)</span>
          </NavLink>
          <NavLink to="/procurement/reconciliation" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <ClipboardCheck size={18} />
            <span>3-Way Match</span>
          </NavLink>
          <NavLink to="/procurement/suppliers" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={18} />
            <span>Supplier Scorecard</span>
          </NavLink>

          <div className="nav-section-title">Sales & Logistics</div>
          <NavLink to="/sales-dashboard" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <TrendingUp size={18} />
            <span>Sales Overview</span>
          </NavLink>
          <NavLink to="/sales" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Truck size={18} />
            <span>Dispatches</span>
          </NavLink>
          <NavLink to="/sales/dispatch-tower" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Sun size={18} />
            <span>Dispatch Tower</span>
          </NavLink>

          <div className="nav-section-title">Operations</div>
          <NavLink to="/approval-inbox" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <CheckSquare size={18} />
            <span>Approval Inbox</span>
          </NavLink>
          <NavLink to="/exceptions" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <ShieldAlert size={18} />
            <span>Exception Center</span>
          </NavLink>

          <div className="nav-section-title">Analytics</div>
          <NavLink to="/analytics/profitability" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <BarChart3 size={18} />
            <span>OMC Profitability</span>
          </NavLink>

        </nav>
      </div>

      <div className="sidebar-footer">
        <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); showToast('Settings feature coming soon.'); }}>
          <Settings size={18} />
          <span>Settings</span>
        </a>
        <a href="#" className="nav-item logout">
          <LogOut size={18} />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
