import { create } from 'zustand';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  createdAt: Date;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) => set((state) => {
    const id = Date.now().toString();
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date(),
    };
    return {
      notifications: [newNotification, ...state.notifications].slice(0, 100), // Limit to 100 notifications
      unreadCount: state.unreadCount + 1,
    };
  }),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((notification) => notification.id !== id),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),
  markAllAsRead: () => set({
    unreadCount: 0,
  }),
}));

// Admin state store for managing UI
interface AdminUIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAdminUIStore = create<AdminUIState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
})); 