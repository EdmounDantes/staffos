import React, { useState } from 'react';
import { mockWorkItems } from '../data/mockData';
import { taskLocationGroups } from '../data/taskLocations';
import { Search, Filter, Plus, MoreHorizontal, ArrowUpDown, Clock, MapPin, MessageSquare, Paperclip, ChevronRight, X } from 'lucide-react';

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-amber-100 text-amber-700',
  critical: 'bg-red-100 text-red-700',
};

const statusColors: Record<string, string> = {
  'Open': 'bg-gray-100 text-gray-700',
  'Assigned': 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-purple-100 text-purple-700',
  'Completed': 'bg-green-100 text-green-700',
  'Escalated': 'bg-red-100 text-red-700',
};

const WorkItems: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showNewForm, setShowNewForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'assigned' | 'team' | 'escalated' | 'sla'>('all');

  const filteredItems = mockWorkItems.filter(item => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (filterPriority !== 'all' && item.priority !== filterPriority) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const selectedWI = mockWorkItems.find(wi => wi.id === selectedItem);

  const tabs = [
    { key: 'all' as const, label: 'Tüm İşler', count: mockWorkItems.length },
    { key: 'assigned' as const, label: 'Bana Atanan', count: 2 },
    { key: 'team' as const, label: 'Ekibime Atanan', count: 4 },
    { key: 'escalated' as const, label: 'Eskale Edilen', count: mockWorkItems.filter(w => w.status === 'Escalated').length },
    { key: 'sla' as const, label: 'SLA Aşan', count: mockWorkItems.filter(w => w.status === 'Escalated').length },
  ];

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İş Takibi</h1>
          <p className="text-gray-500 text-sm mt-0.5">Talep, iş atama, eskalasyon ve takip modülü</p>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/25"
        >
          <Plus size={16} /> Yeni İş Oluştur
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeTab === tab.key ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="İş ara (ID, başlık)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-amber-500/30 outline-none"
        >
          <option value="all">Tüm Statüler</option>
          <option value="Open">Açık</option>
          <option value="Assigned">Atandı</option>
          <option value="In Progress">Devam Ediyor</option>
          <option value="Completed">Tamamlandı</option>
          <option value="Escalated">Eskale Edildi</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-amber-500/30 outline-none"
        >
          <option value="all">Tüm Öncelikler</option>
          <option value="low">Düşük</option>
          <option value="medium">Orta</option>
          <option value="high">Yüksek</option>
          <option value="critical">Kritik</option>
        </select>
        <button className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <Filter size={14} /> Filtrele
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <button className="flex items-center gap-1">ID <ArrowUpDown size={12} /></button>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Başlık</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tip</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Öncelik</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statü</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Atanan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">SLA</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className={`border-b border-gray-100 hover:bg-amber-50/30 cursor-pointer transition-colors ${
                    selectedItem === item.id ? 'bg-amber-50/50' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{item.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.sourceDepartment} → {item.targetDepartment}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{item.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[item.priority]}`}>
                      {item.priority === 'critical' ? 'Kritik' : item.priority === 'high' ? 'Yüksek' : item.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[item.status] || 'bg-gray-100 text-gray-600'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.assignee || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.sla}</td>
                  <td className="px-4 py-3">
                    <button className="p-1 hover:bg-gray-100 rounded" onClick={(e) => { e.stopPropagation(); }}>
                      <MoreHorizontal size={16} className="text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedWI && (
        <div className="fixed inset-y-0 right-0 w-full md:w-[560px] bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-gray-500">{selectedWI.id}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[selectedWI.status]}`}>
                {selectedWI.status}
              </span>
            </div>
            <button onClick={() => setSelectedItem(null)} className="p-1 hover:bg-gray-100 rounded">
              <X size={18} className="text-gray-400" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{selectedWI.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{selectedWI.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-400 uppercase font-medium">İş Tipi</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedWI.type}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-400 uppercase font-medium">Öncelik</p>
                <p className="text-sm font-medium mt-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[selectedWI.priority]}`}>
                    {selectedWI.priority === 'critical' ? 'Kritik' : selectedWI.priority === 'high' ? 'Yüksek' : selectedWI.priority === 'medium' ? 'Orta' : 'Düşük'}
                  </span>
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-400 uppercase font-medium flex items-center gap-1"><MapPin size={10} /> Lokasyon</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedWI.location}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-400 uppercase font-medium flex items-center gap-1"><Clock size={10} /> SLA</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedWI.sla}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-400 uppercase font-medium">Kaynak Departman</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedWI.sourceDepartment}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-400 uppercase font-medium">Hedef Departman</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedWI.targetDepartment}</p>
              </div>
            </div>

            {selectedWI.assignee && (
              <div className="p-3 bg-blue-50 rounded-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                  {selectedWI.assignee.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedWI.assignee}</p>
                  <p className="text-xs text-gray-500">{selectedWI.assigneeTeam}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MessageSquare size={14} /> {selectedWI.comments} yorum</span>
              <span className="flex items-center gap-1"><Paperclip size={14} /> {selectedWI.files} dosya</span>
              <span className="flex items-center gap-1"><ChevronRight size={14} /> {selectedWI.subtasks} alt iş</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
              {selectedWI.status === 'Open' && <button className="px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600">Ata</button>}
              {selectedWI.status === 'Assigned' && <button className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600">Kabul Et</button>}
              {selectedWI.status !== 'Completed' && <button className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600">Eskale Et</button>}
              {selectedWI.status === 'In Progress' && <button className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700">Kapat</button>}
              {selectedWI.status === 'Completed' && <button className="px-3 py-1.5 bg-amber-500 text-white text-xs font-medium rounded-lg hover:bg-amber-600">Yeniden Aç</button>}
              <button className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-300">Yorum Ekle</button>
            </div>
          </div>
        </div>
      )}

      {/* New Work Item Modal */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Yeni İş Oluştur</h2>
              <button onClick={() => setShowNewForm(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" placeholder="İş başlığını girin" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama *</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none h-24" placeholder="Detaylı açıklama yazın" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İş Tipi *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none">
                    <option value="">Seçin...</option>
                    <option>Teknik İş</option>
                    <option>Housekeeping</option>
                    <option>Bellboy Çağrısı</option>
                    <option>Restoran Görevi</option>
                    <option>Misafir İlişkileri</option>
                    <option>F&B Görevi</option>
                    <option>Diğer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Öncelik *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none">
                    <option value="">Seçin...</option>
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                    <option value="critical">Kritik</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kaynak Departman</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none">
                    <option value="">Seçin...</option>
                    <option>Front Office</option>
                    <option>Housekeeping</option>
                    <option>Teknik Servis</option>
                    <option>F&B Servis</option>
                    <option>Guest Relations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hedef Departman</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none">
                    <option value="">Seçin...</option>
                    <option>Front Office</option>
                    <option>Housekeeping</option>
                    <option>Teknik Servis</option>
                    <option>F&B Servis</option>
                    <option>Bell Desk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasyon</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none">
                    <option value="">Seçin...</option>
                    {taskLocationGroups.map((group) => (
                      <optgroup key={group.property.id} label={group.property.name}>
                        {group.options.map((location) => (
                          <option key={location.value} value={location.value}>{location.label}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Atanan Kişi</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none">
                    <option value="">Otomatik Ata</option>
                    <option>Mehmet Kaya</option>
                    <option>Ayşe Çelik</option>
                    <option>Ali Vuran</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dosya Ekle</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-amber-400 transition-colors cursor-pointer">
                  <Paperclip size={20} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">Dosyaları sürükleyin veya tıklayın</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                <button onClick={() => setShowNewForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                  İptal
                </button>
                <button onClick={() => setShowNewForm(false)} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600">
                  Oluştur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkItems;
