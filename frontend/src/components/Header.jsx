import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { showToast } from '../utils/toast';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-search">
        <Search className="search-icon" size={20} />
        <input type="text" placeholder="Search transactions, clients..." className="input-base search-input" />
      </div>
      
      <div className="header-actions">
        <button className="icon-btn relative" onClick={() => showToast('No new notifications.')}>
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">Intern Admin</span>
            <span className="user-role">ARL Oil Dept</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
