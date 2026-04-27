export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department: string;
  property: string;
  brand: string;
  region: string;
  permissions: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
}

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  type: string;
  sourceDepartment: string;
  targetDepartment: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: string;
  sla: string;
  assignee?: string;
  assigneeTeam?: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  comments: number;
  files: number;
  subtasks: number;
}

export interface Incident {
  id: string;
  title: string;
  type: 'incident' | 'technical_problem' | 'quality_finding';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: string;
  location: string;
  department: string;
  reportedBy: string;
  assignedTo?: string;
  createdAt: string;
  linkedWorkItems: number;
  rootCause?: string;
}

export interface Shift {
  id: string;
  employee: string;
  department: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'absent';
  position: string;
}

export interface AttendanceEvent {
  id: string;
  employee: string;
  type: 'check_in' | 'check_out' | 'break_start' | 'break_end' | 'meal_start' | 'meal_end';
  timestamp: string;
  location: string;
  method: 'qr' | 'kiosk' | 'manual';
}

export interface Department {
  id: string;
  name: string;
  parent?: string;
  head?: string;
  employeeCount: number;
  location: string;
  status: 'active' | 'inactive';
}

export interface TaskLocation {
  id: string;
  propertyId: string;
  name: string;
  roomNumber?: string;
  property: string;
  isDeleted: boolean;
  isPassive: boolean;
}

export interface OrgNode {
  id: string;
  name: string;
  type: 'company' | 'brand' | 'region' | 'building' | 'property' | 'department' | 'desk' | 'area';
  children?: OrgNode[];
  employeeCount?: number;
  status?: 'active' | 'inactive';
}

export interface LeaveRequest {
  id: string;
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  approver?: string;
  reason: string;
}

export interface Training {
  id: string;
  title: string;
  type: string;
  department: string;
  assignedTo: string[];
  completionRate: number;
  dueDate: string;
  status: 'active' | 'completed' | 'overdue';
}

export interface ProcurementRequest {
  id: string;
  title: string;
  type: 'purchase' | 'expense';
  amount: number;
  currency: string;
  department: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  linkedWorkItem?: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'kpi' | 'chart' | 'list' | 'status';
  value?: string | number;
  change?: number;
  changeType?: 'up' | 'down' | 'neutral';
  data?: Record<string, unknown>;
}

export interface KPIData {
  label: string;
  value: string | number;
  change: number;
  changeType: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'select' | 'textarea' | 'date' | 'number' | 'checkbox' | 'radio' | 'file';
  required: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
}

export interface FormDefinition {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  version: number;
  status: 'draft' | 'published' | 'archived';
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'assignment' | 'condition' | 'action';
  assignee?: string;
  conditions?: Record<string, unknown>;
  nextStep?: string;
}

export interface AIConversation {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  timestamp: string;
}

export type ModuleKey = 
  | 'dashboard'
  | 'work-items'
  | 'incidents'
  | 'shifts'
  | 'attendance'
  | 'organization'
  | 'config-studio'
  | 'personnel'
  | 'procurement'
  | 'reports'
  | 'ai-assistant'
  | 'elektra'
  | 'audit';
