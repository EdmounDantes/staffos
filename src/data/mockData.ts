import { User, WorkItem, Incident, Shift, Department, LeaveRequest, Training, ProcurementRequest, Notification, OrgNode, FormDefinition } from '../types';

export const mockUser: User = {
  id: 'u1',
  name: 'Ahmet Yılmaz',
  email: 'ahmet.yilmaz@meroddi.com',
  role: 'Operasyon Müdürü',
  department: 'Operations',
  property: 'Meroddi Palace Istanbul',
  brand: 'Meroddi Hotels',
  region: 'Istanbul Avrupa',
  permissions: [
    'work-items:read', 'work-items:write', 'work-items:assign',
    'incidents:read', 'incidents:write',
    'shifts:read', 'shifts:write',
    'attendance:read',
    'organization:read',
    'personnel:read', 'personnel:write',
    'procurement:read', 'procurement:write',
    'reports:read',
    'config:read',
    'ai:use',
  ],
};

export const mockNotifications: Notification[] = [
  { id: 'n1', title: 'Yeni İş Atandı', message: '148 no\'lu oda teknik arıza kaydı size atandı.', type: 'warning', read: false, createdAt: '2025-01-15T10:30:00' },
  { id: 'n2', title: 'SLA Aşımı Uyarısı', message: 'WI-0042 numaralı iş SLA süresini aştı.', type: 'error', read: false, createdAt: '2025-01-15T09:15:00' },
  { id: 'n3', title: 'İzin Talebi', message: 'Fatma Demir annual leave talebinde bulundu.', type: 'info', read: false, createdAt: '2025-01-15T08:45:00' },
  { id: 'n4', title: 'Eskalasyon', message: 'WI-0038 işi 2. seviyeye eskale edildi.', type: 'error', read: true, createdAt: '2025-01-14T16:20:00' },
  { id: 'n5', title: 'Vardiya Değişikliği', message: '15 Ocak Çarşamba vardiyanız güncellendi.', type: 'info', read: true, createdAt: '2025-01-14T14:00:00' },
  { id: 'n6', title: 'Satın Alma Onayı', message: 'PR-0012 satın alma talebi onayınızı bekliyor.', type: 'warning', read: false, createdAt: '2025-01-15T11:00:00' },
  { id: 'n7', title: 'Eğitim Tamamlandı', message: 'Güvenlik Eğitimi başarıyla tamamlandı.', type: 'success', read: true, createdAt: '2025-01-14T10:30:00' },
];

export const mockWorkItems: WorkItem[] = [
  { id: 'WI-0042', title: '148 Oda Klima Arızası', description: 'Klima çalışmıyor, misafir şikayet etti.', type: 'Teknik İş', sourceDepartment: 'Front Office', targetDepartment: 'Teknik Servis', location: 'Meroddi Palace - Kat 4', priority: 'high', status: 'In Progress', sla: '2 saat', assignee: 'Mehmet Kaya', assigneeTeam: 'Teknik Servis', createdAt: '2025-01-15T10:30:00', updatedAt: '2025-01-15T11:00:00', dueDate: '2025-01-15T12:30:00', comments: 4, files: 2, subtasks: 1 },
  { id: 'WI-0041', title: 'Lobi Temizlik Talebi', description: 'Lobi alanında acil temizlik gerekli.', type: 'Housekeeping', sourceDepartment: 'Front Office', targetDepartment: 'Housekeeping', location: 'Meroddi Palace - Lobi', priority: 'medium', status: 'Assigned', sla: '30 dk', assignee: 'Ayşe Çelik', assigneeTeam: 'Housekeeping', createdAt: '2025-01-15T10:00:00', updatedAt: '2025-01-15T10:15:00', dueDate: '2025-01-15T10:30:00', comments: 1, files: 0, subtasks: 0 },
  { id: 'WI-0040', title: 'Restoran Masa Kurulumu', description: 'Akşam yemeği için özel masa hazırlığı.', type: 'Restoran Görevi', sourceDepartment: 'F&B Yönetim', targetDepartment: 'F&B Servis', location: 'Meroddi Palace - Ana Restoran', priority: 'low', status: 'Open', sla: '3 saat', createdAt: '2025-01-15T09:30:00', updatedAt: '2025-01-15T09:30:00', dueDate: '2025-01-15T18:00:00', comments: 0, files: 0, subtasks: 0 },
  { id: 'WI-0039', title: 'Bellboy - Misafir Bagaj', description: '302 no\'lu odaya bagaj taşınması.', type: 'Bellboy Çağrısı', sourceDepartment: 'Front Office', targetDepartment: 'Bell Desk', location: 'Meroddi Palace - Lobi', priority: 'medium', status: 'Completed', sla: '15 dk', assignee: 'Ali Vuran', assigneeTeam: 'Bell Desk', createdAt: '2025-01-15T08:45:00', updatedAt: '2025-01-15T08:55:00', dueDate: '2025-01-15T09:00:00', comments: 0, files: 0, subtasks: 0 },
  { id: 'WI-0038', title: 'Asansör Bakım Uyarısı', description: '2. asansör garip ses çıkarıyor.', type: 'Teknik İş', sourceDepartment: 'Housekeeping', targetDepartment: 'Teknik Servis', location: 'Meroddi Palace - Asansör 2', priority: 'critical', status: 'Escalated', sla: '1 saat', assignee: 'Can Özkan', assigneeTeam: 'Teknik Servis', createdAt: '2025-01-14T16:00:00', updatedAt: '2025-01-15T09:00:00', dueDate: '2025-01-14T17:00:00', comments: 8, files: 3, subtasks: 2 },
  { id: 'WI-0037', title: 'VIP Misafir Karşılama', description: 'VIP misafir için özel karşılama hazırlığı.', type: 'Misafir İlişkileri', sourceDepartment: 'Front Office', targetDepartment: 'Guest Relations', location: 'Meroddi Palace - Giriş', priority: 'high', status: 'Completed', sla: '1 saat', assignee: 'Selin Aydın', assigneeTeam: 'Guest Relations', createdAt: '2025-01-14T14:00:00', updatedAt: '2025-01-14T15:30:00', dueDate: '2025-01-14T15:00:00', comments: 3, files: 1, subtasks: 0 },
  { id: 'WI-0036', title: 'Havuz Alanı Kontrolü', description: 'Havuz kimyasal dengesi kontrolü gerekli.', type: 'Teknik İş', sourceDepartment: 'Housekeeping', targetDepartment: 'Teknik Servis', location: 'Meroddi Palace - Havuz', priority: 'medium', status: 'Open', sla: '4 saat', createdAt: '2025-01-15T07:00:00', updatedAt: '2025-01-15T07:00:00', dueDate: '2025-01-15T11:00:00', comments: 0, files: 0, subtasks: 0 },
  { id: 'WI-0035', title: 'Toplantı Odası Kurulum', description: 'Boardroom için 20 kişilik kurulum.', type: 'F&B Görevi', sourceDepartment: 'Sales', targetDepartment: 'F&B Servis', location: 'Meroddi Palace - Toplantı Salonu A', priority: 'high', status: 'In Progress', sla: '2 saat', assignee: 'Deniz Yıldız', assigneeTeam: 'F&B Servis', createdAt: '2025-01-15T06:00:00', updatedAt: '2025-01-15T07:30:00', dueDate: '2025-01-15T08:00:00', comments: 2, files: 1, subtasks: 0 },
];

export const mockIncidents: Incident[] = [
  { id: 'INC-0018', title: '148 Oda Su Kaçağı', type: 'incident', severity: 'high', status: 'Aktif', location: 'Meroddi Palace - Kat 4 - Oda 148', department: 'Teknik Servis', reportedBy: 'Recep Hoca', assignedTo: 'Mehmet Kaya', createdAt: '2025-01-15T10:25:00', linkedWorkItems: 1 },
  { id: 'INC-0017', title: 'Mutfak Buzdolabı Arızası', type: 'technical_problem', severity: 'critical', status: 'İnceleniyor', location: 'Meroddi Palace - Ana Mutfak', department: 'F&B Mutfak', reportedBy: 'Şef Ahmet', assignedTo: 'Teknik Servis', createdAt: '2025-01-15T08:00:00', linkedWorkItems: 2, rootCause: 'Kompresör arızası tespit edildi' },
  { id: 'INC-0016', title: 'Lobi Temizlik Uyumsuzluğu', type: 'quality_finding', severity: 'medium', status: 'Çözüldü', location: 'Meroddi Palace - Lobi', department: 'Housekeeping', reportedBy: 'Kalite Kontrol', createdAt: '2025-01-14T15:00:00', linkedWorkItems: 1 },
  { id: 'INC-0015', title: 'Güvenlik Kamerası Arızası', type: 'technical_problem', severity: 'high', status: 'Aktif', location: 'Meroddi Palace - Otopark', department: 'Güvenlik', reportedBy: 'Güvenlik Ekibi', assignedTo: 'Teknik Servis', createdAt: '2025-01-14T12:00:00', linkedWorkItems: 1 },
  { id: 'INC-0014', title: 'Yiyecek Kalite Uyumsuzluğu', type: 'quality_finding', severity: 'high', status: 'İnceleniyor', location: 'Meroddi Palace - Restoran', department: 'F&B Mutfak', reportedBy: 'F&B Müdürü', createdAt: '2025-01-13T19:00:00', linkedWorkItems: 0 },
  { id: 'INC-0013', title: 'Asansör Arızası Tekrarı', type: 'technical_problem', severity: 'critical', status: 'Aktif', location: 'Meroddi Palace - Asansör 2', department: 'Teknik Servis', reportedBy: 'Operasyon', assignedTo: 'Dış Teknik Servis', createdAt: '2025-01-14T16:00:00', linkedWorkItems: 3, rootCause: ' Motor conta yıpranması - 3. tekrar' },
];

export const mockShifts: Shift[] = [
  { id: 's1', employee: 'Ahmet Yılmaz', department: 'Operations', location: 'Meroddi Palace', date: '2025-01-15', startTime: '08:00', endTime: '16:00', status: 'in_progress', position: 'Operasyon Müdürü' },
  { id: 's2', employee: 'Mehmet Kaya', department: 'Teknik Servis', location: 'Meroddi Palace', date: '2025-01-15', startTime: '08:00', endTime: '16:00', status: 'in_progress', position: 'Teknisyen' },
  { id: 's3', employee: 'Ayşe Çelik', department: 'Housekeeping', location: 'Meroddi Palace', date: '2025-01-15', startTime: '07:00', endTime: '15:00', status: 'in_progress', position: 'Kat Görevlisi' },
  { id: 's4', employee: 'Ali Vuran', department: 'Bell Desk', location: 'Meroddi Palace', date: '2025-01-15', startTime: '06:00', endTime: '14:00', status: 'in_progress', position: 'Bellboy' },
  { id: 's5', employee: 'Selin Aydın', department: 'Guest Relations', location: 'Meroddi Palace', date: '2025-01-15', startTime: '09:00', endTime: '17:00', status: 'scheduled', position: 'Guest Relations Officer' },
  { id: 's6', employee: 'Deniz Yıldız', department: 'F&B Servis', location: 'Meroddi Palace', date: '2025-01-15', startTime: '10:00', endTime: '22:00', status: 'in_progress', position: 'Garson' },
  { id: 's7', employee: 'Fatma Demir', department: 'Front Office', location: 'Meroddi Palace', date: '2025-01-15', startTime: '14:00', endTime: '22:00', status: 'scheduled', position: 'Resepsiyonist' },
  { id: 's8', employee: 'Can Özkan', department: 'Teknik Servis', location: 'Meroddi Palace', date: '2025-01-15', startTime: '16:00', endTime: '00:00', status: 'scheduled', position: 'Kıdemli Teknisyen' },
];

export const mockDepartments: Department[] = [
  { id: 'd1', name: 'Front Office', head: 'Elif Şahin', employeeCount: 24, location: 'Meroddi Palace', status: 'active' },
  { id: 'd2', name: 'Housekeeping', head: 'Zeynep Arslan', employeeCount: 45, location: 'Meroddi Palace', status: 'active' },
  { id: 'd3', name: 'Teknik Servis', head: 'Burak Yılmaz', employeeCount: 12, location: 'Meroddi Palace', status: 'active' },
  { id: 'd4', name: 'F&B Servis', head: 'Cenk Korkmaz', employeeCount: 35, location: 'Meroddi Palace', status: 'active' },
  { id: 'd5', name: 'F&B Mutfak', head: 'Şef Ahmet Usta', employeeCount: 28, location: 'Meroddi Palace', status: 'active' },
  { id: 'd6', name: 'Guest Relations', head: 'Selin Aydın', employeeCount: 8, location: 'Meroddi Palace', status: 'active' },
  { id: 'd7', name: 'Bell Desk', head: 'Murat Kaya', employeeCount: 10, location: 'Meroddi Palace', status: 'active' },
  { id: 'd8', name: 'Güvenlik', head: 'Emre Polat', employeeCount: 18, location: 'Meroddi Palace', status: 'active' },
  { id: 'd9', name: 'SPA & Wellness', head: 'Derya Tunç', employeeCount: 15, location: 'Meroddi Palace', status: 'active' },
  { id: 'd10', name: 'Sales & Marketing', head: 'Barış Özdemir', employeeCount: 12, location: 'Meroddi Palace', status: 'active' },
];

export const mockOrgTree: OrgNode = {
  id: 'org1',
  name: 'Meroddi Hotels & Restaurants',
  type: 'company',
  children: [
    {
      id: 'brand1',
      name: 'Meroddi Hotels',
      type: 'brand',
      children: [
        {
          id: 'region1',
          name: 'Istanbul Avrupa',
          type: 'region',
          children: [
            {
              id: 'b1',
              name: 'Meroddi Palace Istanbul',
              type: 'property',
              employeeCount: 210,
              status: 'active',
              children: [
                { id: 'dept1', name: 'Front Office', type: 'department', employeeCount: 24, status: 'active' },
                { id: 'dept2', name: 'Housekeeping', type: 'department', employeeCount: 45, status: 'active' },
                { id: 'dept3', name: 'Teknik Servis', type: 'department', employeeCount: 12, status: 'active' },
                { id: 'dept4', name: 'F&B Servis', type: 'department', employeeCount: 35, status: 'active' },
                { id: 'dept5', name: 'F&B Mutfak', type: 'department', employeeCount: 28, status: 'active' },
              ],
            },
            {
              id: 'b2',
              name: 'Meroddi Galata',
              type: 'property',
              employeeCount: 120,
              status: 'active',
            },
          ],
        },
        {
          id: 'region2',
          name: 'Istanbul Anadolu',
          type: 'region',
          children: [
            {
              id: 'b3',
              name: 'Meroddi Bosphorus',
              type: 'property',
              employeeCount: 180,
              status: 'active',
            },
          ],
        },
        {
          id: 'region3',
          name: 'Antalya',
          type: 'region',
          children: [
            {
              id: 'b4',
              name: 'Meroddi Resort Belek',
              type: 'property',
              employeeCount: 350,
              status: 'active',
            },
          ],
        },
      ],
    },
    {
      id: 'brand2',
      name: 'Meroddi Restaurants',
      type: 'brand',
      children: [
        {
          id: 'region4',
          name: 'Istanbul',
          type: 'region',
          children: [
            { id: 'b5', name: 'Meroddi Steakhouse Nişantaşı', type: 'property', employeeCount: 45, status: 'active' },
            { id: 'b6', name: 'Meroddi Seafood Bebek', type: 'property', employeeCount: 35, status: 'active' },
          ],
        },
      ],
    },
  ],
};

export const mockLeaveRequests: LeaveRequest[] = [
  { id: 'lr1', employee: 'Fatma Demir', type: 'Yıllık İzin', startDate: '2025-01-20', endDate: '2025-01-22', days: 3, status: 'pending', approver: 'Ahmet Yılmaz', reason: 'Kişisel nedenler' },
  { id: 'lr2', employee: 'Ali Vuran', type: 'Hastalık İzni', startDate: '2025-01-16', endDate: '2025-01-17', days: 2, status: 'pending', approver: 'Ahmet Yılmaz', reason: 'Doktor raporu' },
  { id: 'lr3', employee: 'Mehmet Kaya', type: 'Yıllık İzin', startDate: '2025-01-25', endDate: '2025-01-26', days: 2, status: 'approved', approver: 'Ahmet Yılmaz', reason: 'Aile ziyareti' },
  { id: 'lr4', employee: 'Deniz Yıldız', type: 'Mazeret İzni', startDate: '2025-01-18', endDate: '2025-01-18', days: 1, status: 'rejected', approver: 'Ahmet Yılmaz', reason: 'Kişisel iş' },
  { id: 'lr5', employee: 'Ayşe Çelik', type: 'Yıllık İzin', startDate: '2025-02-01', endDate: '2025-02-05', days: 5, status: 'pending', approver: 'Ahmet Yılmaz', reason: 'Tatil' },
];

export const mockTrainings: Training[] = [
  { id: 't1', title: 'İş Sağlığı ve Güvenliği', type: 'Zorunlu', department: 'Tüm Departmanlar', assignedTo: ['Tüm Personel'], completionRate: 78, dueDate: '2025-01-31', status: 'active' },
  { id: 't2', title: 'Misafir İlişkileri Eğitimi', type: 'Gelişim', department: 'Front Office', assignedTo: ['Resepsiyon Ekibi'], completionRate: 45, dueDate: '2025-02-15', status: 'active' },
  { id: 't3', title: 'Hijyen ve Sanitasyon', type: 'Zorunlu', department: 'F&B', assignedTo: ['Mutfak Ekibi', 'Servis Ekibi'], completionRate: 92, dueDate: '2025-01-20', status: 'active' },
  { id: 't4', title: 'Yangın Güvenliği', type: 'Zorunlu', department: 'Tüm Departmanlar', assignedTo: ['Tüm Personel'], completionRate: 100, dueDate: '2025-01-10', status: 'completed' },
  { id: 't5', title: 'Upselling Teknikleri', type: 'Gelişim', department: 'F&B Servis', assignedTo: ['Restoran Ekibi'], completionRate: 30, dueDate: '2025-02-28', status: 'active' },
];

export const mockProcurement: ProcurementRequest[] = [
  { id: 'PR-0012', title: 'Klima Kompresör Parçası', type: 'purchase', amount: 4500, currency: 'TRY', department: 'Teknik Servis', requestedBy: 'Mehmet Kaya', status: 'pending', priority: 'high', createdAt: '2025-01-15T10:00:00', linkedWorkItem: 'WI-0042' },
  { id: 'PR-0011', title: 'Temizlik Malzemeleri', type: 'purchase', amount: 12500, currency: 'TRY', department: 'Housekeeping', requestedBy: 'Zeynep Arslan', status: 'approved', priority: 'medium', createdAt: '2025-01-14T09:00:00' },
  { id: 'PR-0010', title: 'Mutfak Ekipman Tamiri', type: 'expense', amount: 2800, currency: 'TRY', department: 'F&B Mutfak', requestedBy: 'Şef Ahmet', status: 'completed', priority: 'high', createdAt: '2025-01-13T14:00:00', linkedWorkItem: 'WI-0035' },
  { id: 'PR-0009', title: 'Ofis Sarf Malzemeleri', type: 'purchase', amount: 850, currency: 'TRY', department: 'Sales & Marketing', requestedBy: 'Barış Özdemir', status: 'pending', priority: 'low', createdAt: '2025-01-15T08:00:00' },
  { id: 'PR-0008', title: 'SPA Ürünleri Siparişi', type: 'purchase', amount: 15000, currency: 'TRY', department: 'SPA & Wellness', requestedBy: 'Derya Tunç', status: 'pending', priority: 'medium', createdAt: '2025-01-14T16:00:00' },
];

export const mockFormDefinitions: FormDefinition[] = [
  {
    id: 'form1',
    name: 'Teknik İş Formu',
    description: 'Teknik servis işleri için standart form',
    version: 3,
    status: 'published',
    fields: [
      { id: 'f1', name: 'title', label: 'Başlık', type: 'text', required: true, placeholder: 'İş başlığını girin' },
      { id: 'f2', name: 'description', label: 'Açıklama', type: 'textarea', required: true, placeholder: 'Detaylı açıklama yazın' },
      { id: 'f3', name: 'priority', label: 'Öncelik', type: 'select', required: true, options: [{ label: 'Düşük', value: 'low' }, { label: 'Orta', value: 'medium' }, { label: 'Yüksek', value: 'high' }, { label: 'Kritik', value: 'critical' }] },
      { id: 'f4', name: 'location', label: 'Lokasyon', type: 'select', required: true, options: [{ label: 'Lobi', value: 'lobi' }, { label: 'Kat 1-3', value: 'kat1-3' }, { label: 'Kat 4-6', value: 'kat4-6' }, { label: 'Restoran', value: 'restoran' }, { label: 'Mutfak', value: 'mutfak' }] },
      { id: 'f5', name: 'roomNumber', label: 'Oda No', type: 'text', required: false, placeholder: 'Oda numarası' },
      { id: 'f6', name: 'photos', label: 'Fotoğraflar', type: 'file', required: false },
    ],
  },
  {
    id: 'form2',
    name: 'İzin Talebi Formu',
    description: 'Personel izin talep formu',
    version: 2,
    status: 'published',
    fields: [
      { id: 'f7', name: 'leaveType', label: 'İzin Türü', type: 'select', required: true, options: [{ label: 'Yıllık İzin', value: 'annual' }, { label: 'Hastalık İzni', value: 'sick' }, { label: 'Mazeret İzni', value: 'personal' }, { label: 'Evlilik İzni', value: 'marriage' }] },
      { id: 'f8', name: 'startDate', label: 'Başlangıç Tarihi', type: 'date', required: true },
      { id: 'f9', name: 'endDate', label: 'Bitiş Tarihi', type: 'date', required: true },
      { id: 'f10', name: 'reason', label: 'Açıklama', type: 'textarea', required: true, placeholder: 'İzin nedeninizi belirtin' },
    ],
  },
];

export const weeklyWorkData = [
  { day: 'Pzt', open: 12, completed: 8, escalated: 2 },
  { day: 'Sal', open: 15, completed: 11, escalated: 1 },
  { day: 'Çar', open: 9, completed: 7, escalated: 3 },
  { day: 'Per', open: 14, completed: 10, escalated: 2 },
  { day: 'Cum', open: 18, completed: 13, escalated: 4 },
  { day: 'Cmt', open: 22, completed: 16, escalated: 2 },
  { day: 'Paz', open: 10, completed: 9, escalated: 1 },
];

export const departmentPerformance = [
  { name: 'Front Office', score: 92, target: 90 },
  { name: 'Housekeeping', score: 88, target: 90 },
  { name: 'Teknik', score: 75, target: 85 },
  { name: 'F&B Servis', score: 94, target: 90 },
  { name: 'F&B Mutfak', score: 86, target: 85 },
  { name: 'Guest Rel.', score: 96, target: 90 },
  { name: 'Bell Desk', score: 91, target: 90 },
  { name: 'Güvenlik', score: 89, target: 90 },
];

export const incidentTrend = [
  { month: 'Ağu', incident: 8, technical: 12, quality: 4 },
  { month: 'Eyl', incident: 6, technical: 15, quality: 3 },
  { month: 'Eki', incident: 10, technical: 9, quality: 5 },
  { month: 'Kas', incident: 7, technical: 11, quality: 6 },
  { month: 'Ara', incident: 9, technical: 14, quality: 4 },
  { month: 'Oca', incident: 5, technical: 8, quality: 3 },
];

export const coverageData = [
  { department: 'Front Office', current: 6, required: 6, status: 'ok' },
  { department: 'Housekeeping', current: 12, required: 15, status: 'risk' },
  { department: 'Teknik', current: 3, required: 4, status: 'warning' },
  { department: 'F&B Servis', current: 8, required: 8, status: 'ok' },
  { department: 'Bell Desk', current: 2, required: 3, status: 'warning' },
  { department: 'Güvenlik', current: 4, required: 4, status: 'ok' },
  { department: 'SPA', current: 3, required: 3, status: 'ok' },
];
