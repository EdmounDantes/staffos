import React, { useRef, useState } from 'react';
import { taskLocationGroups } from '../data/taskLocations';
import {
  getHotelDepartments,
  getHotelEmployees,
  getHotelSourceTypes,
  getHotelSubDepartments,
  getHotelTaskDefinitions,
  hotelProperties,
} from '../data/hotelDefinitions';
import { useStore } from '../store/useStore';
import type { WorkItem, WorkItemFileAttachment } from '../types';
import { Search, Filter, Plus, MoreHorizontal, ArrowUpDown, Clock, MapPin, MessageSquare, Paperclip, ChevronRight, X } from 'lucide-react';

type WorkItemPriority = WorkItem['priority'];

interface NewWorkItemForm {
  propertyId: string;
  title: string;
  description: string;
  taskDefinitionId: string;
  sourceType: string;
  priority: WorkItemPriority | '';
  sourceDepartment: string;
  targetDepartment: string;
  subDepartment: string;
  location: string;
  assignee: string;
  attachments: WorkItemFileAttachment[];
}

const emptyNewWorkItemForm: NewWorkItemForm = {
  propertyId: hotelProperties[0]?.id ?? '',
  title: '',
  description: '',
  taskDefinitionId: '',
  sourceType: '',
  priority: '',
  sourceDepartment: '',
  targetDepartment: '',
  subDepartment: '',
  location: '',
  assignee: '',
  attachments: [],
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-amber-100 text-amber-700',
  critical: 'bg-red-100 text-red-700',
};

const priorityLabels: Record<WorkItemPriority, string> = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
  critical: 'Kritik',
};

const prioritySla: Record<WorkItemPriority, { label: string; hours: number }> = {
  low: { label: '8 saat', hours: 8 },
  medium: { label: '4 saat', hours: 4 },
  high: { label: '2 saat', hours: 2 },
  critical: { label: '1 saat', hours: 1 },
};

const statusColors: Record<string, string> = {
  Open: 'bg-gray-100 text-gray-700',
  Assigned: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-purple-100 text-purple-700',
  Completed: 'bg-green-100 text-green-700',
  Escalated: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  Open: 'Açık',
  Assigned: 'Atandı',
  'In Progress': 'Devam Ediyor',
  Completed: 'Tamamlandı',
  Escalated: 'Eskale Edildi',
};

const getNextWorkItemId = (workItems: WorkItem[]) => {
  const maxId = workItems.reduce((max, item) => {
    const match = item.id.match(/^WI-(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);

  return `WI-${String(maxId + 1).padStart(4, '0')}`;
};

const getTaskLocationLabel = (value: string) => {
  for (const group of taskLocationGroups) {
    const option = group.options.find((location) => location.value === value);
    if (option) return `${group.property.name} - ${option.label}`;
  }

  return '';
};

const getTaskLocationProperty = (value: string) => {
  const group = taskLocationGroups.find((locationGroup) => (
    locationGroup.options.some((location) => location.value === value)
  ));

  return group?.property.name ?? '';
};

const formatCommentDate = (value: string) => (
  new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
);

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const WorkItems: React.FC = () => {
  const { user, workItems, addWorkItem, updateWorkItem } = useStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newWorkItemForm, setNewWorkItemForm] = useState<NewWorkItemForm>(emptyNewWorkItemForm);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'assigned' | 'team' | 'escalated' | 'sla'>('all');
  const selectedLocationGroup = taskLocationGroups.find((group) => group.property.id === newWorkItemForm.propertyId);
  const hotelDepartments = getHotelDepartments(newWorkItemForm.propertyId);
  const hotelSubDepartments = getHotelSubDepartments(newWorkItemForm.propertyId, newWorkItemForm.targetDepartment);
  const hotelTaskDefinitions = getHotelTaskDefinitions(newWorkItemForm.propertyId);
  const hotelSourceTypes = getHotelSourceTypes(newWorkItemForm.propertyId);
  const hotelEmployees = getHotelEmployees(newWorkItemForm.propertyId);

  const filteredItems = workItems.filter((item) => {
    if (activeTab === 'assigned' && !item.assignee) return false;
    if (activeTab === 'team' && !item.assigneeTeam) return false;
    if (activeTab === 'escalated' && item.status !== 'Escalated') return false;
    if (activeTab === 'sla' && item.status !== 'Escalated') return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (filterPriority !== 'all' && item.priority !== filterPriority) return false;

    const normalizedSearch = searchQuery.trim().toLowerCase();
    if (normalizedSearch) {
      const searchableText = `${item.id} ${item.title} ${item.location} ${item.type}`.toLowerCase();
      if (!searchableText.includes(normalizedSearch)) return false;
    }

    return true;
  });

  const selectedWI = workItems.find((wi) => wi.id === selectedItem);

  const tabs = [
    { key: 'all' as const, label: 'Tüm İşler', count: workItems.length },
    { key: 'assigned' as const, label: 'Bana Atanan', count: workItems.filter((w) => Boolean(w.assignee)).length },
    { key: 'team' as const, label: 'Ekibime Atanan', count: workItems.filter((w) => Boolean(w.assigneeTeam)).length },
    { key: 'escalated' as const, label: 'Eskale Edilen', count: workItems.filter((w) => w.status === 'Escalated').length },
    { key: 'sla' as const, label: 'SLA Aşan', count: workItems.filter((w) => w.status === 'Escalated').length },
  ];

  const canCreateWorkItem = Boolean(
    newWorkItemForm.title.trim() &&
    newWorkItemForm.description.trim() &&
    newWorkItemForm.propertyId &&
    newWorkItemForm.taskDefinitionId &&
    newWorkItemForm.priority &&
    newWorkItemForm.location
  );

  const closeNewWorkItemForm = () => {
    setShowNewForm(false);
    setNewWorkItemForm(emptyNewWorkItemForm);
    setIsDraggingFiles(false);
  };

  const updateNewWorkItemForm = (updates: Partial<NewWorkItemForm>) => {
    setNewWorkItemForm((current) => ({ ...current, ...updates }));
  };

  const addAttachments = (files: FileList | File[]) => {
    const selectedFiles = Array.from(files);
    if (selectedFiles.length === 0) return;

    const addedAt = new Date().toISOString();
    setNewWorkItemForm((current) => {
      const existingKeys = new Set(
        current.attachments.map((attachment) => `${attachment.name}:${attachment.size}:${attachment.lastModified}`)
      );
      const nextAttachments = selectedFiles
        .filter((file) => !existingKeys.has(`${file.name}:${file.size}:${file.lastModified}`))
        .map((file, index) => ({
          id: `attachment-${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          type: file.type || 'Bilinmeyen',
          lastModified: file.lastModified,
          addedAt,
          addedBy: user?.name,
        }));

      return {
        ...current,
        attachments: [...current.attachments, ...nextAttachments],
      };
    });
  };

  const removeAttachment = (attachmentId: string) => {
    setNewWorkItemForm((current) => ({
      ...current,
      attachments: current.attachments.filter((attachment) => attachment.id !== attachmentId),
    }));
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      addAttachments(event.target.files);
    }
    event.target.value = '';
  };

  const handleFileDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDraggingFiles(false);
    addAttachments(event.dataTransfer.files);
  };

  const handlePropertyChange = (propertyId: string) => {
    setNewWorkItemForm((current) => ({
      ...current,
      propertyId,
      taskDefinitionId: '',
      sourceType: '',
      sourceDepartment: '',
      targetDepartment: '',
      subDepartment: '',
      location: '',
      assignee: '',
    }));
  };

  const handleTaskDefinitionChange = (taskDefinitionId: string) => {
    const taskDefinition = hotelTaskDefinitions.find((task) => task.id === taskDefinitionId);
    setNewWorkItemForm((current) => ({
      ...current,
      taskDefinitionId,
      targetDepartment: taskDefinition?.department || current.targetDepartment,
      subDepartment: taskDefinition?.subDepartment || current.subDepartment,
    }));
  };

  const handleCreateWorkItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCreateWorkItem || !newWorkItemForm.priority) return;

    const now = new Date();
    const taskDefinition = hotelTaskDefinitions.find((task) => task.id === newWorkItemForm.taskDefinitionId);
    const defaultSla = prioritySla[newWorkItemForm.priority];
    const maxDurationMinutes = taskDefinition?.maxDurationMinutes && taskDefinition.maxDurationMinutes > 0
      ? taskDefinition.maxDurationMinutes
      : defaultSla.hours * 60;
    const slaLabel = maxDurationMinutes % 60 === 0
      ? `${maxDurationMinutes / 60} saat`
      : `${maxDurationMinutes} dk`;
    const dueDate = new Date(now.getTime() + maxDurationMinutes * 60 * 1000);
    const sourceDepartment = newWorkItemForm.sourceDepartment || 'Belirtilmedi';
    const targetDepartment = newWorkItemForm.targetDepartment || taskDefinition?.department || 'Belirtilmedi';
    const location = getTaskLocationLabel(newWorkItemForm.location);
    const workItem: WorkItem = {
      id: getNextWorkItemId(workItems),
      title: newWorkItemForm.title.trim(),
      description: newWorkItemForm.description.trim(),
      type: taskDefinition?.name || 'Görev',
      property: getTaskLocationProperty(newWorkItemForm.location),
      sourceType: newWorkItemForm.sourceType || undefined,
      sourceDepartment,
      targetDepartment,
      subDepartment: newWorkItemForm.subDepartment || taskDefinition?.subDepartment || undefined,
      location,
      priority: newWorkItemForm.priority,
      status: newWorkItemForm.assignee ? 'Assigned' : 'Open',
      sla: slaLabel,
      taskDefinitionId: taskDefinition?.id,
      idealDurationMinutes: taskDefinition?.idealDurationMinutes ?? null,
      maxDurationMinutes: taskDefinition?.maxDurationMinutes ?? null,
      notesRequired: taskDefinition?.notesRequired ?? false,
      assignee: newWorkItemForm.assignee || undefined,
      assigneeTeam: newWorkItemForm.assignee && targetDepartment !== 'Belirtilmedi' ? targetDepartment : undefined,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      dueDate: dueDate.toISOString(),
      comments: 0,
      files: newWorkItemForm.attachments.length,
      fileAttachments: newWorkItemForm.attachments,
      subtasks: 0,
    };

    addWorkItem(workItem);
    setActiveTab('all');
    setFilterStatus('all');
    setFilterPriority('all');
    setSearchQuery('');
    setSelectedItem(workItem.id);
    closeNewWorkItemForm();
  };

  const handleAcceptWorkItem = () => {
    if (!selectedWI || selectedWI.status !== 'Assigned') return;
    updateWorkItem(selectedWI.id, { status: 'In Progress' });
  };

  const handleEscalateWorkItem = () => {
    if (!selectedWI || selectedWI.status === 'Completed' || selectedWI.status === 'Escalated') return;
    updateWorkItem(selectedWI.id, { status: 'Escalated' });
  };

  const handleCompleteWorkItem = () => {
    if (!selectedWI || selectedWI.status !== 'In Progress') return;
    updateWorkItem(selectedWI.id, { status: 'Completed' });
  };

  const handleReopenWorkItem = () => {
    if (!selectedWI || selectedWI.status !== 'Completed') return;
    updateWorkItem(selectedWI.id, { status: 'In Progress' });
  };

  const handleAddComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedWI) return;

    const message = commentDraft.trim();
    if (!message) return;

    const now = new Date().toISOString();
    const commentHistory = selectedWI.commentHistory ?? [];
    updateWorkItem(selectedWI.id, {
      comments: selectedWI.comments + 1,
      commentHistory: [
        ...commentHistory,
        {
          id: `${selectedWI.id}-comment-${Date.now()}`,
          author: user?.name || 'StaffOS Kullanıcısı',
          message,
          createdAt: now,
        },
      ],
    });
    setCommentDraft('');
    setShowCommentForm(false);
  };

  return (
    <div className="p-6 space-y-4">
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

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {tabs.map((tab) => (
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

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="İş ara (ID, başlık, lokasyon)..."
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
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center">
                    <p className="text-sm font-medium text-gray-600">
                      {workItems.length === 0 ? 'Henüz iş oluşturulmadı.' : 'Filtrelere uyan iş bulunamadı.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item.id);
                      setShowCommentForm(false);
                      setCommentDraft('');
                    }}
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
                        {priorityLabels[item.priority]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[item.status] || 'bg-gray-100 text-gray-600'}`}>
                        {statusLabels[item.status] || item.status}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedWI && (
        <div className="fixed inset-y-0 right-0 w-full md:w-[560px] bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-gray-500">{selectedWI.id}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[selectedWI.status] || 'bg-gray-100 text-gray-600'}`}>
                {statusLabels[selectedWI.status] || selectedWI.status}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedItem(null);
                setShowCommentForm(false);
                setCommentDraft('');
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={18} className="text-gray-400" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{selectedWI.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{selectedWI.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {selectedWI.property && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-400 uppercase font-medium">Otel</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedWI.property}</p>
                </div>
              )}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-400 uppercase font-medium">Görev Tanımı</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedWI.type}</p>
              </div>
              {selectedWI.sourceType && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-400 uppercase font-medium">Kaynak Tipi</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedWI.sourceType}</p>
                </div>
              )}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-400 uppercase font-medium">Öncelik</p>
                <p className="text-sm font-medium mt-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[selectedWI.priority]}`}>
                    {priorityLabels[selectedWI.priority]}
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
              {selectedWI.subDepartment && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-400 uppercase font-medium">Alt Departman</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedWI.subDepartment}</p>
                </div>
              )}
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

            {selectedWI.fileAttachments && selectedWI.fileAttachments.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">Ekli Dosyalar</h3>
                <div className="space-y-2">
                  {selectedWI.fileAttachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 min-w-0">
                        <Paperclip size={14} className="text-gray-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{attachment.name}</p>
                          <p className="text-[10px] text-gray-400">
                            {formatFileSize(attachment.size)} • {formatCommentDate(attachment.addedAt)}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 shrink-0">{attachment.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedWI.commentHistory && selectedWI.commentHistory.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">Yorumlar</h3>
                {[...selectedWI.commentHistory].reverse().map((comment) => (
                  <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-gray-700">{comment.author}</p>
                      <span className="text-[10px] text-gray-400">{formatCommentDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{comment.message}</p>
                  </div>
                ))}
              </div>
            )}

            {showCommentForm && (
              <form onSubmit={handleAddComment} className="p-3 border border-amber-200 bg-amber-50/40 rounded-lg space-y-3">
                <textarea
                  value={commentDraft}
                  onChange={(event) => setCommentDraft(event.target.value)}
                  className="w-full min-h-24 px-3 py-2 border border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none bg-white"
                  placeholder="Yorumunuzu yazın"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCommentForm(false);
                      setCommentDraft('');
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-white rounded-lg"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={!commentDraft.trim()}
                    className={`px-3 py-1.5 text-xs font-medium text-white rounded-lg ${
                      commentDraft.trim()
                        ? 'bg-amber-500 hover:bg-amber-600'
                        : 'bg-amber-300 cursor-not-allowed'
                    }`}
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            )}

            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
              {selectedWI.status === 'Open' && <button className="px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600">Ata</button>}
              {selectedWI.status === 'Assigned' && (
                <button
                  onClick={handleAcceptWorkItem}
                  className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600"
                >
                  Kabul Et
                </button>
              )}
              {selectedWI.status !== 'Completed' && selectedWI.status !== 'Escalated' && (
                <button
                  onClick={handleEscalateWorkItem}
                  className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600"
                >
                  Eskale Et
                </button>
              )}
              {selectedWI.status === 'In Progress' && (
                <button
                  onClick={handleCompleteWorkItem}
                  className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700"
                >
                  Bitir
                </button>
              )}
              {selectedWI.status === 'Completed' && (
                <button
                  onClick={handleReopenWorkItem}
                  className="px-3 py-1.5 bg-amber-500 text-white text-xs font-medium rounded-lg hover:bg-amber-600"
                >
                  Yeniden Aç
                </button>
              )}
              <button
                onClick={() => setShowCommentForm((current) => !current)}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-300"
              >
                Yorum Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateWorkItem} className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Yeni İş Oluştur</h2>
              <button type="button" onClick={closeNewWorkItemForm} className="p-1 hover:bg-gray-100 rounded">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
                <input
                  type="text"
                  value={newWorkItemForm.title}
                  onChange={(e) => updateNewWorkItemForm({ title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                  placeholder="İş başlığını girin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama *</label>
                <textarea
                  value={newWorkItemForm.description}
                  onChange={(e) => updateNewWorkItemForm({ description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none h-24"
                  placeholder="Detaylı açıklama yazın"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Otel *</label>
                  <select
                    value={newWorkItemForm.propertyId}
                    onChange={(e) => handlePropertyChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                  >
                    <option value="">Seçin...</option>
                    {hotelProperties.map((property) => (
                      <option key={property.id} value={property.id}>{property.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kaynak Tipi</label>
                  <select
                    value={newWorkItemForm.sourceType}
                    onChange={(e) => updateNewWorkItemForm({ sourceType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                  >
                    <option value="">Seçin...</option>
                    {hotelSourceTypes.map((sourceType) => (
                      <option key={sourceType}>{sourceType}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Görev Tanımı *</label>
                  <select
                    value={newWorkItemForm.taskDefinitionId}
                    onChange={(e) => handleTaskDefinitionChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                  >
                    <option value="">Seçin...</option>
                    {hotelTaskDefinitions.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.name}{task.department ? ` - ${task.department}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Öncelik *</label>
                  <select
                    value={newWorkItemForm.priority}
                    onChange={(e) => updateNewWorkItemForm({ priority: e.target.value as NewWorkItemForm['priority'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                  >
                    <option value="">Seçin...</option>
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                    <option value="critical">Kritik</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kaynak Departman</label>
                  <select
                    value={newWorkItemForm.sourceDepartment}
                    onChange={(e) => updateNewWorkItemForm({ sourceDepartment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                  >
                    <option value="">Seçin...</option>
                    {hotelDepartments.map((department) => (
                      <option key={department.id} value={department.name}>{department.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hedef Departman</label>
                  <select
                    value={newWorkItemForm.targetDepartment}
                    onChange={(e) => updateNewWorkItemForm({ targetDepartment: e.target.value, subDepartment: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                  >
                    <option value="">Seçin...</option>
                    {hotelDepartments.map((department) => (
                      <option key={department.id} value={department.name}>{department.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alt Departman</label>
                  <select
                    value={newWorkItemForm.subDepartment}
                    onChange={(e) => updateNewWorkItemForm({ subDepartment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                  >
                    <option value="">Seçin...</option>
                    {hotelSubDepartments.map((subDepartment) => (
                      <option key={subDepartment.id} value={subDepartment.name}>{subDepartment.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasyon *</label>
                  <select
                    value={newWorkItemForm.location}
                    onChange={(e) => updateNewWorkItemForm({ location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                  >
                    <option value="">Seçin...</option>
                    {selectedLocationGroup?.options.map((location) => (
                      <option key={location.value} value={location.value}>{location.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Atanan Kişi</label>
                  <select
                    value={newWorkItemForm.assignee}
                    onChange={(e) => updateNewWorkItemForm({ assignee: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                  >
                    <option value="">Otomatik Ata</option>
                    {hotelEmployees.map((assignee) => (
                      <option key={assignee.id} value={assignee.fullName}>{assignee.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dosya Ekle</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setIsDraggingFiles(true);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDraggingFiles(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    setIsDraggingFiles(false);
                  }}
                  onDrop={handleFileDrop}
                  className={`w-full border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                    isDraggingFiles
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-300 hover:border-amber-400'
                  }`}
                >
                  <Paperclip size={20} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">Dosyaları sürükleyin veya tıklayın</p>
                </button>
                {newWorkItemForm.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {newWorkItemForm.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between gap-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2 min-w-0">
                          <Paperclip size={14} className="text-gray-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{attachment.name}</p>
                            <p className="text-[10px] text-gray-400">{formatFileSize(attachment.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(attachment.id)}
                          className="p-1 rounded hover:bg-gray-200 shrink-0"
                          aria-label={`${attachment.name} dosyasını kaldır`}
                        >
                          <X size={14} className="text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                <button type="button" onClick={closeNewWorkItemForm} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={!canCreateWorkItem}
                  className={`px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 ${
                    canCreateWorkItem ? '' : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  Oluştur
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default WorkItems;
