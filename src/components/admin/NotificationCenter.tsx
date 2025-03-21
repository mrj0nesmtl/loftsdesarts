"use client";

import { useState, useEffect } from "react";
import { useNotificationStore } from "@/lib/store";

export default function NotificationCenter() {
  const { notifications, unreadCount, markAllAsRead, removeNotification } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isOpen && 
        !target.closest('#notification-center') && 
        !target.closest('#notification-toggle')
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  return (
    <div className="relative">
      <button
        id="notification-toggle"
        onClick={toggleNotifications}
        className="relative p-1 text-zinc-400 hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div
          id="notification-center"
          className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-zinc-800 rounded-md shadow-lg z-50"
        >
          <div className="p-3 border-b border-zinc-700 flex justify-between items-center">
            <h3 className="text-lg font-medium">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  notifications.forEach(n => removeNotification(n.id));
                }}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="divide-y divide-zinc-700">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-zinc-400">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 ${getNotificationColorClass(notification.type)}`}
                >
                  <div className="flex justify-between">
                    <p>{notification.message}</p>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="text-zinc-400 hover:text-white ml-2"
                      aria-label="Dismiss"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    {formatNotificationTime(notification.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getNotificationColorClass(type: string): string {
  switch (type) {
    case 'success':
      return 'bg-green-900/20 border-l-4 border-green-500';
    case 'error':
      return 'bg-red-900/20 border-l-4 border-red-500';
    case 'warning':
      return 'bg-yellow-900/20 border-l-4 border-yellow-500';
    case 'info':
    default:
      return 'bg-blue-900/20 border-l-4 border-blue-500';
  }
}

function formatNotificationTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 1) {
    return 'Just now';
  }
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  }
  
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }
  
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }
  
  // Default to standard date format for older notifications
  return date.toLocaleDateString();
} 