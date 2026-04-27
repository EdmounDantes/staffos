import { create } from 'zustand';
import type { User, Notification, ModuleKey, WorkItem } from '../types';
import { mockUser, mockNotifications, mockWorkItems } from '../data/mockData';

const workItemsStorageKey = 'staffos-work-items';

const loadStoredWorkItems = (): WorkItem[] => {
  if (typeof window === 'undefined') return mockWorkItems;

  try {
    const stored = window.localStorage.getItem(workItemsStorageKey);
    if (!stored) return mockWorkItems;

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed as WorkItem[] : mockWorkItems;
  } catch {
    return mockWorkItems;
  }
};

const saveStoredWorkItems = (workItems: WorkItem[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(workItemsStorageKey, JSON.stringify(workItems));
};

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  notifications: Notification[];
  workItems: WorkItem[];
  sidebarOpen: boolean;
  activeModule: ModuleKey;
  theme: 'light' | 'dark';
  
  addWorkItem: (workItem: WorkItem) => void;
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
  workItems: loadStoredWorkItems(),
  sidebarOpen: true,
  activeModule: 'dashboard',
  theme: 'light',

  addWorkItem: (workItem: WorkItem) => {
    set((state) => {
      const workItems = [workItem, ...state.workItems];
      saveStoredWorkItems(workItems);
      return { workItems };
    });
  },

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
