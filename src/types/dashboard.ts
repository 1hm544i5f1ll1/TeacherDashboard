export interface DashboardItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  metric: string;
  color: string;
  link?: string;
  status?: 'pending' | 'completed';
}

export interface Occupation {
  id: string;
  name: string;
  role: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  features: DashboardItem[];
}

export interface EditForm {
  title: string;
  description: string;
  metric: string;
  link: string;
}

export type DashboardMode = 'preview' | 'edit';