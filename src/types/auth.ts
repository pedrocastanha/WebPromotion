// Tipos para autenticação
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tipo para dados de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Tipo para dados de registro
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Tipo para resposta de autenticação
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Tipo para contexto de autenticação
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// Tipo para dados do perfil do usuário
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role: 'admin' | 'user';
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: boolean;
  };
}

// Tipo para atualização de perfil
export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  preferences?: Partial<UserProfile['preferences']>;
}

// Tipo para alteração de senha
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

