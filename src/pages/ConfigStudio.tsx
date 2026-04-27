import React, { useState } from 'react';
import { mockFormDefinitions } from '../data/mockData';
import { FileText, GitBranch, Shield, ToggleLeft, Save, RotateCcw, Plus, GripVertical } from 'lucide-react';

const ConfigStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'forms' | 'workflows' | 'roles' | 'features'>('forms');

  const tabs = [
    { key: 'forms' as const, label: 'Form Builder', icon: <FileText size={16} /> },
    { key: 'workflows' as const, label: 'Workflow Builder', icon: <GitBranch size={16} /> },
    { key: 'roles' as const, label: 'Rol & Yetki', icon: <Shield size={16} /> },
    { key: 'features' as const, label: 'Feature Flags', icon: <ToggleLeft size={16} /> },
  ];

  const roles = [
    { name: 'Sistem Yöneticisi', users: 2, permissions: 45, color: 'bg-red-100 text-red-700' },
    { name: 'Operasyon Müdürü', users: 5, permissions: 32, color: 'bg-amber-100 text-amber-700' },
    { name: 'Departman Müdürü', users: 12, permissions: 24, color: 'bg-blue-100 text-blue-700' },
    { name: 'Takım Lideri', users: 28, permissions: 16, color: 'bg-green-100 text-green-700' },
    { name: 'Personel', users: 210, permissions: 8, color: 'bg-gray-100 text-gray-700' },
    { name: 'Stajyer', users: 15, permissions: 4, color: 'bg-purple-100 text-purple-700' },
  ];

  const features = [
    { name: 'AI Asistan', enabled: true, description: 'AI destekli öneri ve analiz', module: 'AI' },
    { name: 'Elektra Sync', enabled: true, description: 'Elektra ERP veri senkronizasyonu', module: 'Integration' },
    { name: 'QR Check-in', enabled: true, description: 'QR kod ile giriş/çıkış', module: 'Attendance' },
    { name: 'Otomatik Eskalasyon', enabled: true, description: 'SLA aşımında otomatik eskalasyon', module: 'Work Items' },
    { name: 'Masraf Otomasyonu', enabled: false, description: 'İşten masraf talebi otomasyonu', module: 'Procurement' },
    { name: 'Performans AI', enabled: false, description: 'AI destekli performans analizi', module: 'Performance' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Config & Governance Studio</h1>
          <p className="text-gray-500 text-sm mt-0.5">Formlar, workflow, roller ve feature flag yönetimi</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-1">
            <RotateCcw size={14} /> Rollback
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg flex items-center gap-2">
            <Save size={16} /> Yayınla
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'forms' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Plus size={14} /> Yeni Form
            </button>
          </div>
          {mockFormDefinitions.map(form => (
            <div key={form.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{form.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      form.status === 'published' ? 'bg-green-100 text-green-700' : form.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {form.status === 'published' ? 'Yayında' : form.status === 'draft' ? 'Taslak' : 'Arşiv'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{form.description} • v{form.version}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Düzenle</button>
                  <button className="px-3 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Önizleme</button>
                </div>
              </div>
              <div className="space-y-2">
                {form.fields.map((field, i) => (
                  <div key={field.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                    <GripVertical size={14} className="text-gray-300 cursor-grab" />
                    <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                    <span className="text-sm font-medium text-gray-900 flex-1">{field.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-600">{field.type}</span>
                    {field.required && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-600">Zorunlu</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'workflows' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Aktif Workflow Tanımları</h3>
          <div className="space-y-3">
            {[
              { name: 'İş Oluşturma ve Atama', steps: 5, status: 'Aktif' },
              { name: 'İzin Talebi Onayı', steps: 3, status: 'Aktif' },
              { name: 'Satın Alma Onayı', steps: 4, status: 'Aktif' },
              { name: 'Incident Eskalasyon', steps: 3, status: 'Aktif' },
              { name: 'Masraf Talebi', steps: 4, status: 'Taslak' },
            ].map((wf, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map(step => (
                    <React.Fragment key={step}>
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">{step}</div>
                      {step < 3 && <div className="w-6 h-0.5 bg-amber-300" />}
                    </React.Fragment>
                  ))}
                  {wf.steps > 3 && <><div className="w-6 h-0.5 bg-gray-300" /><div className="text-[10px] text-gray-400">+{wf.steps - 3}</div></>}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{wf.name}</p>
                  <p className="text-xs text-gray-500">{wf.steps} adım</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${wf.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{wf.status}</span>
                <button className="px-3 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Düzenle</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${role.color}`}>{role.name}</span>
                <button className="text-xs text-amber-600 hover:text-amber-700">Düzenle</button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Kullanıcılar</span>
                  <span className="font-medium text-gray-900">{role.users}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Yetki Sayısı</span>
                  <span className="font-medium text-gray-900">{role.permissions}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'features' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="space-y-3">
            {features.map((feat, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <button className={`w-10 h-5 rounded-full transition-colors relative ${feat.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${feat.enabled ? 'left-5' : 'left-0.5'}`} />
                  </button>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{feat.name}</p>
                    <p className="text-xs text-gray-500">{feat.description}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{feat.module}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigStudio;
