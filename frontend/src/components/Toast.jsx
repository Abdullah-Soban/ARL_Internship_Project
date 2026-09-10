import React, { useState, useEffect } from 'react';
import './Toast.css';

const Toast = () => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleShowToast = (e) => {
      setMessage(e.detail);
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    };

    window.addEventListener('show-toast', handleShowToast);
    return () => window.removeEventListener('show-toast', handleShowToast);
  }, []);

  if (!visible) return null;

  return (
    <div className="toast-container animate-fade-in">
      <div className="toast-content glass-panel">
        <span className="toast-icon">ℹ️</span>
        <p className="toast-message">{message}</p>
      </div>
    </div>
  );
};

export default Toast;
