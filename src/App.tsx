import React from 'react';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WorkItems from './pages/WorkItems';
import Incidents from './pages/Incidents';
import Shifts from './pages/Shifts';
import Organization from './pages/Organization';
import ConfigStudio from './pages/ConfigStudio';
import { Personnel, Procurement, Reports, AIAssistant } from './pages/ModulePages';
import { ModuleKey } from './types';
import { Database, Shield, Clock } from 'lucide-react';

// Simple placeholder pages for Elektra and Audit
const PlaceholderPage: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
  <div className="p-6">
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
        {icon}
      </div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-500 mt-2 max-w-md">{description}</p>
      <div className="mt-6 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
        Bu modül ikinci fazda aktif edilecektir.
      </div>
    </div>
  </div>
);

const ElektraHub: React.FC = () => (
  <PlaceholderPage
    title="Elektra Data Hub"
    description="Elektra ERP entegrasyonu, veri senkronizasyonu, mapping yönetimi ve veri kalitesi kontrolleri bu modülden yönetilecektir."
    icon={<Database size={32} />}
  />
);

const AuditLogs: React.FC = () => (
  <PlaceholderPage
    title="Audit & Loglar"
    description="Tüm kritik işlemlerin audit logları, güvenlik logları ve AI kullanım kayıtları bu modülden görüntülenecektir."
    icon={<Shield size={32} />}
  />
);

const Attendance: React.FC = () => (
  <PlaceholderPage
    title="Attendance & Canlı Operasyon"
    description="Bu modül Vardiya modülü ile entegre çalışmaktadır. Detaylı attendance ekranı için Vardiya modülündeki Canlı Operasyon sekmesini kullanabilirsiniz."
    icon={<Clock size={32} />}
  />
);

const moduleComponents: Record<ModuleKey, React.FC> = {
  dashboard: Dashboard,
  'work-items': WorkItems,
  incidents: Incidents,
  shifts: Shifts,
  attendance: Attendance,
  organization: Organization,
  'config-studio': ConfigStudio,
  personnel: Personnel,
  procurement: Procurement,
  reports: Reports,
  'ai-assistant': AIAssistant,
  elektra: ElektraHub,
  audit: AuditLogs,
};

const App: React.FC = () => {
  const { isAuthenticated, activeModule } = useStore();

  if (!isAuthenticated) {
    return <Login />;
  }

  const ActivePage = moduleComponents[activeModule] || Dashboard;

  return (
    <Layout>
      <ActivePage />
    </Layout>
  );
};

export default App;
