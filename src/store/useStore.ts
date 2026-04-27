import { create } from 'zustand';
import { User, Notification, ModuleKey } from '../types';
import { mockUser, mockNotifications } from '../data/mockData';

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  notifications: Notification[];
  sidebarOpen: boolean;
  activeModule: ModuleKey;
  theme: 'light' | 'dark';
  
  login: (email: string, password: string) => boolean;
  logout: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleSidebar: () => void;
  setActiveModule: (module: ModuleKey) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useStore = create<AppState>((set) => ({
  isAuthenticated: false,
  user: null,
  notifications: mockNotifications,
  sidebarOpen: true,
  activeModule: 'dashboard',
  theme: 'light',

  login: (email: string, _password: string) => {
    // Mock login - accept any credentials
    if (email) {
      set({ isAuthenticated: true, user: mockUser });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ isAuthenticated: false, user: null, activeModule: 'dashboard' });
  },

  markNotificationRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setActiveModule: (module: ModuleKey) => {
    set({ activeModule: module });
  },

  setTheme: (theme: 'light' | 'dark') => {
    set({ theme });
  },
}));
