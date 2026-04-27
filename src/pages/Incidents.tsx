import React, { useState } from 'react';
import { mockIncidents, incidentTrend } from '../data/mockData';
import { Search, Plus, AlertTriangle, Wrench, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const severityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-amber-100 text-amber-700',
  critical: 'bg-red-100 text-red-700',
};

const typeIcons: Record<string, React.ReactNode> = {
  incident: <AlertTriangle size={16} className="text-red-500" />,
  technical_problem: <Wrench size={16} className="text-amber-500" />,
  quality_finding: <ShieldCheck size={16} className="text-blue-500" />,
};

const typeLabels: Record<string, string> = {
  incident: 'Incident',
  technical_problem: 'Teknik Problem',
  quality_finding: 'Kalite Bulgusu',
};

const Incidents: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockIncidents.filter(inc => {
    if (filterType !== 'all' && inc.type !== filterType) return false;
    if (filterSeverity !== 'all' && inc.severity !== filterSeverity) return false;
    if (searchQuery && !inc.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    active: mockIncidents.filter(i => i.status === 'Aktif').length,
    investigating: mockIncidents.filter(i => i.status === 'İnceleniyor').length,
    resolved: mockIncidents.filter(i => i.status === 'Çözüldü').length,
    recurring: mockIncidents.filter(i => i.rootCause?.includes('tekrar')).length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incident & Problem</h1>
          <p className="text-gray-500 text-sm mt-0.5">Olay kayıtları, teknik problemler ve kalite bulguları</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/25">
          <Plus size={16} /> Yeni Kayıt
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Aktif Incidentlar', value: stats.active, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'İnceleniyor', value: stats.investigating, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Çözülen', value: stats.resolved, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Tekrar Eden', value: stats.recurring, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} rounded-xl p-4`}>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-1">6 Aylık Incident Trendi</h3>
        <p className="text-xs text-gray-500 mb-4">Türlere göre dağılım</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={incidentTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
            <Bar dataKey="incident" name="Incident" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="technical" name="Teknik" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="quality" name="Kalite" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Kayıt ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none">
          <option value="all">Tüm Tipler</option>
          <option value="incident">Incident</option>
          <option value="technical_problem">Teknik Problem</option>
          <option value="quality_finding">Kalite Bulgusu</option>
        </select>
        <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none">
          <option value="all">Tüm Severity</option>
          <option value="low">Düşük</option>
          <option value="medium">Orta</option>
          <option value="high">Yüksek</option>
          <option value="critical">Kritik</option>
        </select>
      </div>

      {/* Incident Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(inc => (
          <div key={inc.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                {typeIcons[inc.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{inc.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${severityColors[inc.severity]}`}>
                    {inc.severity === 'critical' ? 'Kritik' : inc.severity === 'high' ? 'Yüksek' : inc.severity === 'medium' ? 'Orta' : 'Düşük'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{inc.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{typeLabels[inc.type]}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${inc.status === 'Aktif' ? 'bg-red-100 text-red-700' : inc.status === 'İnceleniyor' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {inc.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">{inc.location}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <span className="text-[10px] text-gray-400">{inc.department} • {inc.reportedBy}</span>
                  <span className="text-[10px] text-gray-400">{inc.linkedWorkItems} bağlı iş</span>
                </div>
                {inc.rootCause && (
                  <div className="mt-2 p-2 bg-amber-50 rounded-lg">
                    <p className="text-[10px] font-medium text-amber-700">Kök Neden:</p>
                    <p className="text-xs text-amber-600 mt-0.5">{inc.rootCause}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Incidents;
