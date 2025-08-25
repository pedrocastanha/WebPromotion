// Tipos comuns da aplicação

// Tipo para resposta padrão da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

// Tipo para erro da API
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Tipo para opções de select
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

// Tipo para configurações de tabela
export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
}

// Tipo para ações de tabela
export interface TableAction<T = any> {
  label: string;
  icon?: React.ComponentType;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
}

// Tipo para configurações de modal
export interface ModalConfig {
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  maskClosable?: boolean;
}

// Tipo para notificação/toast
export interface ToastConfig {
  title?: string;
  description: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Tipo para breadcrumb
export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

// Tipo para menu/navegação
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ComponentType;
  href?: string;
  children?: MenuItem[];
  disabled?: boolean;
  badge?: string | number;
}

// Tipo para tema
export interface Theme {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  borderRadius: number;
}

// Tipo para configurações da aplicação
export interface AppConfig {
  name: string;
  version: string;
  apiUrl: string;
  features: {
    darkMode: boolean;
    notifications: boolean;
    analytics: boolean;
  };
  pagination: {
    defaultPageSize: number;
    pageSizeOptions: number[];
  };
}

// Tipo para estado de loading
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// Tipo para formulário genérico
export interface FormState<T = any> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

// Tipo para upload de arquivo
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
}

