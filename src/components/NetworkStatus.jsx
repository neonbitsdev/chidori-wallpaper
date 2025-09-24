import React from 'react';
import useNetworkStatus from '../hooks/useNetworkStatus';

const NetworkStatus = () => {
  const { isOnline, wasOffline } = useNetworkStatus();

  if (!wasOffline) return null;

  return (
    <div 
      className={`network-status ${isOnline ? 'online' : 'offline'}`}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '8px 16px',
        borderRadius: '20px',
        fontFamily: 'Nippo-Medium',
        fontSize: '0.8rem',
        zIndex: 10000,
        transition: 'all 0.3s ease',
        animation: 'slideInRight 0.3s ease-out',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
    >
      <i className={`fa-solid ${isOnline ? 'fa-wifi' : 'fa-wifi-slash'}`}></i>
      <span>{isOnline ? 'Connection restored' : 'No internet connection'}</span>
    </div>
  );
};

export default NetworkStatus;
