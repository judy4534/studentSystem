import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../App';
import BellIcon from '../icons/BellIcon';
import { useData } from '../../context/DataContext';
import type { Notification } from '../../types';

const Notifications: React.FC = () => {
    const { user } = useAuth();
    const { 
        notifications: allNotifications, 
        markNotificationAsRead, 
        markAllNotificationsAsRead 
    } = useData();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const userNotifications = user ? allNotifications.filter(n => n.userId === user.id) : [];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const unreadCount = userNotifications.filter(n => !n.read).length;

    const handleMarkAllRead = () => {
        if (user) {
            markAllNotificationsAsRead(user.id);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="relative text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={`لديك ${unreadCount} من الإشعارات الجديدة`}
            >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">
                            {unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
                    <div className="p-3 border-b flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700">الإشعارات</h3>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllRead} className="text-sm text-blue-600 hover:underline">
                                تحديد الكل كمقروء
                            </button>
                        )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {userNotifications.length > 0 ? (
                            userNotifications.map(notification => (
                                <div 
                                    key={notification.id} 
                                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-sm text-gray-800">{notification.title}</p>
                                            <p className="text-sm text-gray-600">{notification.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
                                        </div>
                                        {!notification.read && (
                                            <button 
                                                onClick={() => markNotificationAsRead(notification.id)}
                                                className="mt-1 h-3 w-3 rounded-full bg-blue-500 flex-shrink-0 ml-2"
                                                title="تحديد كمقروء"
                                                aria-label="تحديد كمقروء"
                                            ></button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-6">لا توجد إشعارات</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;