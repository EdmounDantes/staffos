import React, { useState } from 'react';
import { mockLeaveRequests, mockTrainings, mockProcurement } from '../data/mockData';
import { hotelEmployees, hotelProperties } from '../data/hotelDefinitions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  GraduationCap, CalendarCheck, DollarSign, BarChart3, Send, Clock,
  CheckCircle, XCircle, AlertCircle, TrendingUp, Download, Plus,
  BookOpen, Target, Award, Sparkles, Users, Building2
} from 'lucide-react';

// ==================== PERSONNEL ====================
export const Personnel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'directory' | 'leave' | 'training' | 'performance'>('directory');

  const leaveStats = {
    pending: mockLeaveRequests.filter(l => l.status === 'pending').length,
    approved: mockLeaveRequests.filter(l => l.status === 'approved').length,
    rejected: mockLeaveRequests.filter(l => l.status === 'rejected').length,
  };
  const employeeStats = {
    total: hotelEmployees.length,
    hotels: hotelProperties.length,
    managers: hotelEmployees.filter((employee) => employee.isManager).length,
    departments: new Set(hotelEmployees.map((employee) => employee.department).filter(Boolean)).size,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Personel Yaşam Döngüsü</h1>
        <p className="text-gray-500 text-sm mt-0.5">İzin, eğitim, performans ve gelişim yönetimi</p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-full md:w-fit overflow-x-auto">
        <button onClick={() => setActiveTab('directory')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'directory' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}>
          <Users size={16} /> Personel Listesi
        </button>
        <button onClick={() => setActiveTab('leave')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'leave' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}>
          <CalendarCheck size={16} /> İzin Yönetimi
        </button>
        <button onClick={() => setActiveTab('training')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'training' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}>
          <GraduationCap size={16} /> Eğitimler
        </button>
        <button onClick={() => setActiveTab('performance')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'performance' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}>
          <Target size={16} /> Performans
        </button>
      </div>

      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <Users size={20} className="text-blue-600" />
              <p className="text-2xl font-bold text-gray-900 mt-2">{employeeStats.total}</p>
              <p className="text-xs text-gray-600 mt-0.5">Aktif Personel</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4">
              <Building2 size={20} className="text-amber-600" />
              <p className="text-2xl font-bold text-gray-900 mt-2">{employeeStats.hotels}</p>
              <p className="text-xs text-gray-600 mt-0.5">Otel</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <Award size={20} className="text-green-600" />
              <p className="text-2xl font-bold text-gray-900 mt-2">{employeeStats.managers}</p>
              <p className="text-xs text-gray-600 mt-0.5">Yönetici</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <Target size={20} className="text-purple-600" />
              <p className="text-2xl font-bold text-gray-900 mt-2">{employeeStats.departments}</p>
              <p className="text-xs text-gray-600 mt-0.5">Departman/Meslek</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Personel</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Otel</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Departman</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Meslek</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Mesai</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {hotelEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                            {employee.fullName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{employee.fullName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{employee.property}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{employee.department || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{employee.position || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {employee.shiftStart || employee.shiftEnd ? `${employee.shiftStart || '-'} - ${employee.shiftEnd || '-'}` : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${employee.isManager ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                          {employee.isManager ? 'Yönetici' : 'Personel'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leave' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-amber-600">{leaveStats.pending}</p>
              <p className="text-xs text-gray-600 mt-0.5">Bekleyen Talepler</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-green-600">{leaveStats.approved}</p>
              <p className="text-xs text-gray-600 mt-0.5">Onaylanan</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-red-600">{leaveStats.rejected}</p>
              <p className="text-xs text-gray-600 mt-0.5">Reddedilen</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Personel</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tür</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tarih</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Gün</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Neden</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Durum</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aksiyon</th>
                </tr>
              </thead>
              <tbody>
                {mockLeaveRequests.map(lr => (
                  <tr key={lr.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                          {lr.employee.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium">{lr.employee}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{lr.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{lr.startDate} — {lr.endDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{lr.days}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{lr.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        lr.status === 'pending' ? 'bg-amber-100 text-amber-700' : lr.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {lr.status === 'pending' ? 'Bekliyor' : lr.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {lr.status === 'pending' && (
                        <div className="flex gap-1">
                          <button className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200"><CheckCircle size={16} /></button>
                          <button className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200"><XCircle size={16} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'training' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTrainings.map(t => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  t.status === 'completed' ? 'bg-green-100 text-green-700' : t.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>{t.status === 'completed' ? 'Tamamlandı' : t.status === 'overdue' ? 'Gecikmiş' : 'Aktif'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t.type}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{t.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{t.department}</p>
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Tamamlanma</span>
                  <span className="font-medium">{t.completionRate}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${t.completionRate >= 80 ? 'bg-green-500' : t.completionRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${t.completionRate}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Son tarih: {t.dueDate}</span>
                <BookOpen size={14} />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Genel Performans', value: '%87', icon: <TrendingUp size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'KPI Hedefi', value: '%92', icon: <Target size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Eğitim Tamamlama', value: '%78', icon: <GraduationCap size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Prime Uygunluk', value: 'A', icon: <Award size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} rounded-xl p-4`}>
                <span className={item.color}>{item.icon}</span>
                <p className="text-2xl font-bold text-gray-900 mt-2">{item.value}</p>
                <p className="text-xs text-gray-600 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">KPI Detayları</h3>
            <div className="space-y-3">
              {[
                { name: 'İş Tamamlama Oranı', target: 95, actual: 92 },
                { name: 'SLA Uyum', target: 90, actual: 88 },
                { name: 'Misafir Memnuniyeti', target: 90, actual: 94 },
                { name: 'Ekip Yönetimi', target: 85, actual: 87 },
              ].map((kpi, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-sm text-gray-700 w-48">{kpi.name}</span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden relative">
                    <div className="h-full bg-gray-300 rounded-full" style={{ width: `${kpi.target}%` }} />
                    <div className={`absolute top-0 h-full rounded-full ${kpi.actual >= kpi.target ? 'bg-green-500' : 'bg-amber-500'}`}
                      style={{ width: `${kpi.actual}%` }} />
                  </div>
                  <span className={`text-sm font-medium w-16 text-right ${kpi.actual >= kpi.target ? 'text-green-600' : 'text-amber-600'}`}>
                    %{kpi.actual}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== PROCUREMENT ====================
export const Procurement: React.FC = () => {
  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };
  const statusLabels: Record<string, string> = { pending: 'Bekliyor', approved: 'Onaylandı', rejected: 'Reddedildi', completed: 'Tamamlandı' };

  const totalPending = mockProcurement.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Satın Alma & Masraf</h1>
          <p className="text-gray-500 text-sm mt-0.5">Talep, onay akışı ve finansal takip</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg flex items-center gap-2">
          <Plus size={16} /> Yeni Talep
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-amber-50 rounded-xl p-4">
          <DollarSign size={20} className="text-amber-600" />
          <p className="text-xl font-bold text-gray-900 mt-2">₺{totalPending.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-0.5">Bekleyen Tutar</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <Clock size={20} className="text-blue-600" />
          <p className="text-xl font-bold text-gray-900 mt-2">{mockProcurement.filter(p => p.status === 'pending').length}</p>
          <p className="text-xs text-gray-600 mt-0.5">Bekleyen Talep</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <CheckCircle size={20} className="text-green-600" />
          <p className="text-xl font-bold text-gray-900 mt-2">{mockProcurement.filter(p => p.status === 'approved' || p.status === 'completed').length}</p>
          <p className="text-xs text-gray-600 mt-0.5">Onaylanan</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4">
          <AlertCircle size={20} className="text-red-600" />
          <p className="text-xl font-bold text-gray-900 mt-2">{mockProcurement.filter(p => p.status === 'rejected').length}</p>
          <p className="text-xs text-gray-600 mt-0.5">Reddedilen</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Talep</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tür</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tutar</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Departman</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Talep Eden</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Durum</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {mockProcurement.map(pr => (
              <tr key={pr.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono text-gray-600">{pr.id}</td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">{pr.title}</p>
                  {pr.linkedWorkItem && <p className="text-[10px] text-amber-600">Bağlı İş: {pr.linkedWorkItem}</p>}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${pr.type === 'purchase' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {pr.type === 'purchase' ? 'Satın Alma' : 'Masraf'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">₺{pr.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{pr.department}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{pr.requestedBy}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[pr.status]}`}>
                    {statusLabels[pr.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {pr.status === 'pending' && (
                    <div className="flex gap-1">
                      <button className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200"><CheckCircle size={14} /></button>
                      <button className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200"><XCircle size={14} /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==================== REPORTS ====================
const reportData = [
  { name: 'Oca', revenue: 450000, expenses: 120000, occupancy: 82 },
  { name: 'Şub', revenue: 380000, expenses: 105000, occupancy: 75 },
  { name: 'Mar', revenue: 520000, expenses: 130000, occupancy: 88 },
  { name: 'Nis', revenue: 490000, expenses: 128000, occupancy: 85 },
  { name: 'May', revenue: 610000, expenses: 145000, occupancy: 92 },
  { name: 'Haz', revenue: 720000, expenses: 160000, occupancy: 96 },
];

const categoryData = [
  { name: 'İş Takibi', value: 35, color: '#3b82f6' },
  { name: 'Incident', value: 20, color: '#ef4444' },
  { name: 'Personel', value: 25, color: '#10b981' },
  { name: 'Satın Alma', value: 10, color: '#f59e0b' },
  { name: 'Vardiya', value: 10, color: '#8b5cf6' },
];

export const Reports: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Raporlama & Analitik</h1>
          <p className="text-gray-500 text-sm mt-0.5">Dashboard, KPI takibi ve rapor üretim merkezi</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download size={16} /> Export
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg flex items-center gap-2">
            <BarChart3 size={16} /> Rapor Oluştur
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Toplam İş', value: '842', change: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'SLA Uyumu', value: '%91', change: '+3%', color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Personel Devir', value: '%8', change: '-2%', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Ort. Çözüm Süresi', value: '4.2s', change: '-15%', color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((kpi, i) => (
          <div key={i} className={`${kpi.bg} rounded-xl p-4`}>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{kpi.label}</p>
            <p className={`text-xs font-medium mt-1 ${kpi.color}`}>{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Aylık Gelir & Gider Trendi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="revenue" name="Gelir" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Gider" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Rapor Dağılımı</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {categoryData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium">%{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Kayıtlı Raporlar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'Günlük Operasyon Özeti', freq: 'Günlük', lastRun: '15 Oca 2025' },
            { name: 'Haftalık SLA Raporu', freq: 'Haftalık', lastRun: '13 Oca 2025' },
            { name: 'Aylık Departman Performansı', freq: 'Aylık', lastRun: '31 Ara 2024' },
            { name: 'Personel Devam Analizi', freq: 'Haftalık', lastRun: '12 Oca 2025' },
            { name: 'Incident Trend Raporu', freq: 'Aylık', lastRun: '31 Ara 2024' },
            { name: 'Satın Alma Özeti', freq: 'Aylık', lastRun: '31 Ara 2024' },
          ].map((report, i) => (
            <div key={i} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
              <p className="text-sm font-medium text-gray-900">{report.name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-gray-500">{report.freq} • {report.lastRun}</span>
                <button className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1">
                  <Download size={12} /> Çalıştır
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== AI ASSISTANT ====================
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  timestamp: string;
}

const initialMessages: ChatMessage[] = [
  { id: '1', role: 'assistant', message: 'Merhaba! Ben Meroddi AI Asistanınız. Operasyonel verilerinizi analiz edebilir, sorularınızı yanıtlayabilir ve öneriler üretebilirim. Size nasıl yardımcı olabilirim? 🤖', timestamp: new Date().toISOString() },
];

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const suggestions = [
    '148 no\'lu odada son 30 gündeki teknik problemleri özetle',
    'Bu ay SLA aşan işleri listele',
    'Galata bölgesinde bugün kapsama riski var mı?',
    'Tekrar eden teknik sorunlar için aksiyon öner',
    'Haftalık operasyon özetini çıkar',
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now().toString(), role: 'user' as const, message: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    setTimeout(() => {
      const responses = [
        '148 no\'lu odada son 30 günde 3 teknik problem tespit edildi:\n\n🔴 **Klima Arızası** (2 kez) - Son: 15 Ocak\n🟡 **Su Kaçağı** (1 kez) - 10 Ocak\n\n**Öneri:** Klima kompresörünün değiştirilmesi gerekiyor. Bu parça için PR-0012 numaralı satın alma talebi zaten oluşturulmuş.',
        'Bu ay toplam 8 iş SLA süresini aştı. En çok etkilenen departmanlar:\n\n• Teknik Servis: 4 iş\n• Housekeeping: 2 iş\n• F&B: 2 iş\n\nDetaylı SLA raporu için Raporlama modülünü ziyaret edebilirsiniz.',
        'Analiz sonucuna göre şu an tüm departmanlarda kapsama yeterli. Ancak Housekeeping departmanında 15:00-16:00 arası risk tespit edildi (3 personel mola saatinde).',
        'Son 90 gündeki tekrar eden problemler:\n\n1. **Asansör 2 Motor Sorunu** - 3. tekrar ⚠️\n2. **Oda 148 Klima** - 2. tekrar\n\n**Aksiyon Önerileri:**\n• Asansör motoru için dış servis sözleşmesi yenilenmeli\n• Klima bakım periyodu aylıktan haftalıkaya çekilmeli',
      ];
      const aiMsg = { id: (Date.now() + 1).toString(), role: 'assistant' as const, message: responses[Math.floor(Math.random() * responses.length)], timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div className="p-6 h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles size={24} className="text-amber-500" /> AI Asistan
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Operasyonel verilerinizi analiz edin, öneriler alın</p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Çevrimiçi
        </span>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-900 rounded-bl-sm'
              }`}>
                <div className="whitespace-pre-wrap">{msg.message}</div>
                <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-400 mb-2">Örnek sorular:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => handleSend(s)}
                  className="text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-colors text-left">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Bir soru sorun..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            AI yalnızca öneri üretir. Kritik işlemleri otomatik tamamlamaz. Yetki kapsamınızdaki verileri analiz eder.
          </p>
        </div>
      </div>
    </div>
  );
};
