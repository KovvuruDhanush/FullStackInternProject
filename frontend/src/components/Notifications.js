import React, { useState, useEffect } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Simulated notifications data
  useEffect(() => {
    const demoNotifications = [
      { id: 1, type: 'rating', message: 'New 5-star rating for Store A', time: '2 minutes ago' },
      { id: 2, type: 'store', message: 'Store B updated their information', time: '5 minutes ago' },
      { id: 3, type: 'rating', message: 'New 4-star rating for Store C', time: '10 minutes ago' }
    ];
    setNotifications(demoNotifications);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {notifications.length > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: '#ff4757',
              color: 'white',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {notifications.length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            width: '300px',
            maxHeight: '400px',
            overflowY: 'auto',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 1000
          }}
        >
          <div style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
            <h4 style={{ margin: 0 }}>Notifications</h4>
          </div>
          {notifications.map(notification => (
            <div
              key={notification.id}
              style={{
                padding: '15px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}
            >
              <div
                style={{
                  background: notification.type === 'rating' ? '#ff9f43' : '#54a0ff',
                  borderRadius: '50%',
                  width: '8px',
                  height: '8px',
                  marginTop: '6px'
                }}
              />
              <div>
                <p style={{ margin: '0 0 5px 0' }}>{notification.message}</p>
                <small style={{ color: '#666' }}>{notification.time}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;