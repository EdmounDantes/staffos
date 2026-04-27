import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ModuleKey } from '../types';
import {
  LayoutDashboard, ClipboardList, AlertTriangle, CalendarClock, Clock, Building2,
  Settings, Users, ShoppingCart, BarChart3, Bot, Database, Shield, Bell, Search,
  Menu, X, LogOut, ChevronDown, User, CheckCheck
} from 'lucide-react';

interface NavItem {
  key: ModuleKey;
  label: string;
  icon: React.ReactNode;
  group: string;
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, group: 'Ana Menü' },
  { key: 'work-items', label: 'İş Takibi', icon: <ClipboardList size={20} />, group: 'Ana Menü' },
  { key: 'incidents', label: 'Incident & Problem', icon: <AlertTriangle size={20} />, group: 'Ana Menü' },
  { key: 'shifts', label: 'Vardiya Planlama', icon: <CalendarClock size={20} />, group: 'Operasyon' },
  { key: 'attendance', label: 'Attendance & Canlı', icon: <Clock size={20} />, group: 'Operasyon' },
  { key: 'organization', label: 'Organizasyon', icon: <Building2 size={20} />, group: 'Operasyon' },
  { key: 'personnel', label: 'Personel Yaşam Döngüsü', icon: <Users size={20} />, group: 'İK & Gelişim' },
  { key: 'procurement', label: 'Satın Alma & Masraf', icon: <ShoppingCart size={20} />, group: 'İK & Gelişim' },
  { key: 'reports', label: 'Raporlama & Analitik', icon: <BarChart3 size={20} />, group: 'Analiz' },
  { key: 'ai-assistant', label: 'AI Asistan', icon: <Bot size={20} />, group: 'Analiz' },
  { key: 'config-studio', label: 'Config & Governance', icon: <Settings size={20} />, group: 'Yönetim' },
  { key: 'elektra', label: 'Elektra Data Hub', icon: <Database size={20} />, group: 'Entegrasyon' },
  { key: 'audit', label: 'Audit & Loglar', icon: <Shield size={20} />, group: 'Yönetim' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, notifications, sidebarOpen, activeModule, toggleSidebar, setActiveModule, logout, markNotificationRead, markAllNotificationsRead } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const groupedNav = navItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out flex-shrink-0`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-sm text-slate-900">
                M
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-wide">Meroddi</h1>
                <p className="text-[10px] text-slate-400 -mt-0.5">StaffOS</p>
              </div>
            </div>
          )}
          {!sidebarOpen && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-sm text-slate-900 mx-auto">
              M
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
          {Object.entries(groupedNav).map(([group, items]) => (
            <div key={group} className="mb-2">
              {sidebarOpen && (
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 mb-1">
                  {group}
                </p>
              )}
              {items.map((item) => {
                const isActive = activeModule === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveModule(item.key)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-400 border-r-2 border-amber-400'
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                    } ${!sidebarOpen ? 'justify-center px-2' : ''}`}
                    title={item.label}
                  >
                    <span className={isActive ? 'text-amber-400' : ''}>{item.icon}</span>
                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className="p-3 border-t border-slate-700/50">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-700/30">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.role}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            
            <div className="relative">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${searchFocused ? 'bg-white ring-2 ring-amber-500/30 border-amber-300' : 'bg-gray-100 border-transparent'} border`}>
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Global arama..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="bg-transparent text-sm outline-none w-48 lg:w-64 placeholder-gray-400"
                />
                <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-200 rounded">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                  <div className="flex items-center justify-between p-3 border-b border-gray-100">
                    <h3 className="font-semibold text-sm">Bildirimler</h3>
                    <button onClick={markAllNotificationsRead} className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1">
                      <CheckCheck size={12} /> Tümünü okundu işaretle
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`px-3 py-2.5 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-amber-50/50' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            n.type === 'error' ? 'bg-red-500' : n.type === 'warning' ? 'bg-amber-500' : n.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                          </div>
                          {!n.read && <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm text-gray-700 hidden md:block">{user?.name}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              
              {showProfile && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <p className="font-medium text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-amber-600 mt-1">{user?.role}</p>
                  </div>
                  <div className="p-1">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                      <User size={16} /> Profil
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                      <Settings size={16} /> Ayarlar
                    </button>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut size={16} /> Çıkış
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
