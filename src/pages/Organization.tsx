import React, { useState } from 'react';
import { mockOrgTree, mockDepartments } from '../data/mockData';
import { ChevronRight, ChevronDown, Building2, Users, Globe, MapPin, Layers, Plus } from 'lucide-react';
import { OrgNode } from '../types';

const typeIcons: Record<string, React.ReactNode> = {
  company: <Globe size={16} className="text-indigo-500" />,
  brand: <Building2 size={16} className="text-amber-500" />,
  region: <MapPin size={16} className="text-green-500" />,
  property: <Building2 size={16} className="text-blue-500" />,
  department: <Users size={16} className="text-purple-500" />,
  building: <Layers size={16} className="text-gray-500" />,
  desk: <Layers size={16} className="text-gray-400" />,
  area: <MapPin size={16} className="text-teal-500" />,
};

const OrgTreeNode: React.FC<{ node: OrgNode; depth: number }> = ({ node, depth }) => {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          expanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />
        ) : (
          <span className="w-3.5" />
        )}
        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
          {typeIcons[node.type] || <Layers size={14} className="text-gray-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{node.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{node.type}</span>
          </div>
          {node.employeeCount && (
            <span className="text-[10px] text-gray-400">{node.employeeCount} personel</span>
          )}
        </div>
        {node.status && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${node.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
            {node.status === 'active' ? 'Aktif' : 'Pasif'}
          </span>
        )}
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children!.map(child => (
            <OrgTreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const Organization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tree' | 'departments'>('tree');

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizasyon & Operasyon</h1>
          <p className="text-gray-500 text-sm mt-0.5">Şirket yapısı, departmanlar, lokasyonlar ve operasyon profilleri</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 flex items-center gap-2 shadow-lg shadow-amber-500/25">
          <Plus size={16} /> Yeni Birim Ekle
        </button>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button onClick={() => setActiveTab('tree')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'tree' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}>
          Organizasyon Ağacı
        </button>
        <button onClick={() => setActiveTab('departments')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'departments' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}>
          Departman Listesi
        </button>
      </div>

      {activeTab === 'tree' ? (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Organizasyon Hiyerarşisi</h3>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Globe size={12} /> Şirket</span>
              <span className="flex items-center gap-1"><Building2 size={12} /> Marka/Tesis</span>
              <span className="flex items-center gap-1"><Users size={12} /> Departman</span>
            </div>
          </div>
          <OrgTreeNode node={mockOrgTree} depth={0} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockDepartments.map(dept => (
            <div key={dept.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">{dept.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">{dept.status}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Yönetici</span>
                  <span className="text-gray-900 font-medium">{dept.head}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Personel</span>
                  <span className="text-gray-900 font-medium">{dept.employeeCount}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Lokasyon</span>
                  <span className="text-gray-900 font-medium">{dept.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Organization;
