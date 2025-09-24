import React, { useEffect, useState } from 'react';

const AccessibilityAnnouncer = () => {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const handleAnnouncement = (event) => {
      setAnnouncement(event.detail.message);
      
      setTimeout(() => {
        setAnnouncement('');
      }, 1000);
    };

    window.addEventListener('announce', handleAnnouncement);
    return () => window.removeEventListener('announce', handleAnnouncement);
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden'
      }}
    >
      {announcement}
    </div>
  );
};

export const announceToScreenReader = (message) => {
  const event = new CustomEvent('announce', {
    detail: { message }
  });
  window.dispatchEvent(event);
};

export default AccessibilityAnnouncer;
