import React, { useState } from 'react';
import { mockShifts, coverageData } from '../data/mockData';
import { Clock, CheckCircle, XCircle, Coffee, UtensilsCrossed, Zap, Users, Calendar } from 'lucide-react';

const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  scheduled: { color: 'bg-gray-100 text-gray-600', label: 'Planlandı', icon: <Clock size={14} /> },
  in_progress: { color: 'bg-green-100 text-green-700', label: 'Görevde', icon: <CheckCircle size={14} /> },
  completed: { color: 'bg-blue-100 text-blue-700', label: 'Tamamlandı', icon: <CheckCircle size={14} /> },
  absent: { color: 'bg-red-100 text-red-700', label: 'Devamsız', icon: <XCircle size={14} /> },
};

const Shifts: React.FC = () => {
  const [view, setView] = useState<'shifts' | 'live'>('live');

  const liveStats = {
    onDuty: 47,
    onBreak: 8,
    onMeal: 5,
    total: 127,
    coverageOk: 5,
    coverageRisk: 2,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vardiya & Canlı Operasyon</h1>
          <p className="text-gray-500 text-sm mt-0.5">Vardiya planlama, attendance ve canlı operasyon panosu</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Canlı
          </span>
          <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 flex items-center gap-2">
            <Calendar size={16} /> Vardiya Planla
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setView('live')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'live' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
        >
          Canlı Operasyon
        </button>
        <button
          onClick={() => setView('shifts')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'shifts' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
        >
          Vardiya Listesi
        </button>
      </div>

      {view === 'live' ? (
        <>
          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Görevde', value: liveStats.onDuty, icon: <CheckCircle size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Molada', value: liveStats.onBreak, icon: <Coffee size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Yemekte', value: liveStats.onMeal, icon: <UtensilsCrossed size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Toplam Aktif', value: liveStats.total, icon: <Users size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            ].map((stat, i) => (
              <div key={i} className={`${stat.bg} rounded-xl p-4`}>
                <div className="flex items-center justify-between">
                  <span className={stat.color}>{stat.icon}</span>
                  <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Coverage Grid */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Zap size={16} className="text-amber-500" /> Canlı Kapsama Durumu
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Minimum kadro gereksinimleri vs mevcut durum</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Yeterli ({liveStats.coverageOk})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Risk ({liveStats.coverageRisk})</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {coverageData.map((dept, i) => {
                const ratio = dept.current / dept.required;
                const isOk = ratio >= 1;
                const isWarning = ratio >= 0.8 && ratio < 1;
                return (
                  <div key={i} className={`p-3 rounded-lg border-2 transition-colors ${
                    isOk ? 'border-green-200 bg-green-50/50' : isWarning ? 'border-amber-200 bg-amber-50/50' : 'border-red-200 bg-red-50/50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">{dept.department}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${isOk ? 'bg-green-100 text-green-700' : isWarning ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {isOk ? '✓' : isWarning ? '⚠' : '✗'}
                      </span>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-xl font-bold text-gray-900">{dept.current}</span>
                      <span className="text-sm text-gray-500 mb-0.5">/ {dept.required}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <div className={`h-full rounded-full ${isOk ? 'bg-green-500' : isWarning ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(ratio * 100, 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Personnel */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Şu Anda Görevde Olanlar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {mockShifts.filter(s => s.status === 'in_progress').map((shift) => (
                <div key={shift.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                    {shift.employee.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{shift.employee}</p>
                    <p className="text-xs text-gray-500">{shift.position} • {shift.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">{shift.startTime} - {shift.endTime}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">Görevde</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Shift List */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Personel</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Pozisyon</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Departman</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tarih</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Saat</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Durum</th>
              </tr>
            </thead>
            <tbody>
              {mockShifts.map((shift) => {
                const config = statusConfig[shift.status];
                return (
                  <tr key={shift.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                          {shift.employee.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{shift.employee}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{shift.position}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{shift.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{shift.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{shift.startTime} - {shift.endTime}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${config.color}`}>
                        {config.icon} {config.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Shifts;
