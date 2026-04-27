import React from 'react';
import { useStore } from '../store/useStore';
import { mockIncidents, weeklyWorkData, departmentPerformance, coverageData } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Clock, AlertTriangle, CheckCircle2, Users, XCircle, ArrowRight, Zap, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, workItems } = useStore();

  const activeWorkItems = workItems.filter(wi => wi.status !== 'Completed');
  const criticalItems = workItems.filter(wi => wi.priority === 'critical');
  const activeIncidents = mockIncidents.filter(inc => inc.status === 'Aktif' || inc.status === 'İnceleniyor');
  const slaBreached = workItems.filter(wi => wi.status === 'Escalated');
  const today = new Date().toISOString().slice(0, 10);
  const completedToday = workItems.filter(wi => wi.status === 'Completed' && wi.updatedAt.startsWith(today));
  const urgentWorkItems = workItems
    .filter(wi => wi.priority === 'critical' || wi.priority === 'high')
    .slice(0, 5);

  const kpiCards = [
    { label: 'Açık İşler', value: activeWorkItems.length, change: -12, changeType: 'down' as const, icon: <Clock size={20} />, color: 'from-blue-500 to-blue-600', bgLight: 'bg-blue-50' },
    { label: 'Kritik İşler', value: criticalItems.length, change: 50, changeType: 'up' as const, icon: <AlertTriangle size={20} />, color: 'from-red-500 to-red-600', bgLight: 'bg-red-50' },
    { label: 'Aktif Incident', value: activeIncidents.length, change: -8, changeType: 'down' as const, icon: <Activity size={20} />, color: 'from-amber-500 to-orange-500', bgLight: 'bg-amber-50' },
    { label: 'Bugün Tamamlanan', value: completedToday.length, change: 0, changeType: 'neutral' as const, icon: <CheckCircle2 size={20} />, color: 'from-green-500 to-emerald-600', bgLight: 'bg-green-50' },
    { label: 'SLA Aşan', value: slaBreached.length, change: 0, changeType: 'neutral' as const, icon: <XCircle size={20} />, color: 'from-purple-500 to-purple-600', bgLight: 'bg-purple-50' },
    { label: 'Aktif Personel', value: 127, change: 3, changeType: 'up' as const, icon: <Users size={20} />, color: 'from-indigo-500 to-indigo-600', bgLight: 'bg-indigo-50' },
  ];

  const pieData = [
    { name: 'Açık', value: workItems.filter(w => w.status === 'Open').length, color: '#3b82f6' },
    { name: 'Atandı', value: workItems.filter(w => w.status === 'Assigned').length, color: '#f59e0b' },
    { name: 'Devam Ediyor', value: workItems.filter(w => w.status === 'In Progress').length, color: '#8b5cf6' },
    { name: 'Tamamlandı', value: workItems.filter(w => w.status === 'Completed').length, color: '#10b981' },
    { name: 'Eskale Edildi', value: workItems.filter(w => w.status === 'Escalated').length, color: '#ef4444' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Merhaba, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            {user?.property} • {user?.department} • Bugünün operasyon özeti
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Canlı
          </span>
          <span className="text-xs text-gray-400">
            Son güncelleme: {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${kpi.bgLight} flex items-center justify-center text-gray-600`}>
                {kpi.icon}
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-medium ${
                kpi.changeType === 'up' ? 'text-green-600' : kpi.changeType === 'down' ? 'text-red-600' : 'text-gray-400'
              }`}>
                {kpi.changeType === 'up' ? <TrendingUp size={12} /> : kpi.changeType === 'down' ? <TrendingDown size={12} /> : <Minus size={12} />}
                {kpi.change !== 0 && `${Math.abs(kpi.change)}%`}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Work Items Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Haftalık İş Dağılımı</h3>
              <p className="text-xs text-gray-500 mt-0.5">Son 7 günlük iş istatistikleri</p>
            </div>
            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600">
              <option>Bu Hafta</option>
              <option>Geçen Hafta</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyWorkData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Bar dataKey="open" name="Açılan" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Tamamlanan" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="escalated" name="Eskale" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Work Item Status Pie */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-1">İş Statü Dağılımı</h3>
          <p className="text-xs text-gray-500 mb-4">Mevcut açık işlerin durumu</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Departman Performansı</h3>
          <p className="text-xs text-gray-500 mb-4">Hedef vs Gerçekleşen</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="target" name="Hedef" fill="#e2e8f0" radius={[0, 2, 2, 0]} />
              <Bar dataKey="score" name="Gerçekleşen" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Coverage Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Canlı Kapsama Durumu</h3>
              <p className="text-xs text-gray-500 mt-0.5">Minimum kadro vs mevcut</p>
            </div>
            <Zap size={16} className="text-amber-500" />
          </div>
          <div className="space-y-3">
            {coverageData.map((dept, i) => {
              const ratio = dept.current / dept.required;
              const statusColor = ratio >= 1 ? 'text-green-600' : ratio >= 0.8 ? 'text-amber-600' : 'text-red-600';
              const barColor = ratio >= 1 ? 'bg-green-500' : ratio >= 0.8 ? 'bg-amber-500' : 'bg-red-500';
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{dept.department}</span>
                    <span className={`text-xs font-medium ${statusColor}`}>
                      {dept.current}/{dept.required}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min((dept.current / dept.required) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Critical Work Items */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Kritik İşler</h3>
              <p className="text-xs text-gray-500 mt-0.5">Acil müdahale gerektiren</p>
            </div>
            <button className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
              Tümünü gör <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {urgentWorkItems.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">Kritik iş bulunmuyor.</p>
            ) : (
              urgentWorkItems.map((wi) => (
                <div key={wi.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    wi.priority === 'critical' ? 'bg-red-500' : 'bg-amber-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{wi.title}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-400">{wi.id}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{wi.status}</span>
                      <span className="text-[10px] text-gray-400">{wi.type}</span>
                    </div>
                    {wi.assignee && (
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        👤 {wi.assignee} • SLA: {wi.sla}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
