import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import './NotificationToast.css';

const NotificationToast = () => {
    const [notifications, setNotifications] = useState([]);
    const { lastMessage } = useWebSocket();

    useEffect(() => {
        if (lastMessage) {
            const notification = createNotification(lastMessage);
            if (notification) {
                setNotifications(prev => [...prev, notification]);
                // Remove notification after 5 seconds
                setTimeout(() => {
                    setNotifications(prev => prev.filter(n => n.id !== notification.id));
                }, 5000);
            }
        }
    }, [lastMessage]);

    const createNotification = (message) => {
        const id = Date.now();
        switch (message.type) {
            case 'RATING_UPDATE':
                return {
                    id,
                    type: 'rating',
                    message: `${message.data.username} rated ${message.data.storeName} ${message.data.rating} stars`
                };
            case 'STORE_UPDATE':
                if (message.data.type === 'STORE_CREATED') {
                    return {
                        id,
                        type: 'store',
                        message: `New store added: ${message.data.data.name}`
                    };
                }
                return null;
            default:
                return null;
        }
    };

    return (
        <div className="notification-container">
            {notifications.map(notification => (
                <div 
                    key={notification.id}
                    className={`notification-toast ${notification.type}`}
                    role="alert"
                >
                    <p>{notification.message}</p>
                </div>
            ))}
        </div>
    );
};

export default NotificationToast;