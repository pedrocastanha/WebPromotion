import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  id: number;
  token: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (data: AuthResponse) => {
    const userData = { id: data.id, name: data.name, email: data.email };
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(data.token);
    setUser(userData);
    navigate('/dashboard');
  };

  const login = async (credentials: any) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    handleAuthSuccess(response.data);
  };

  const register = async (userData: any) => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    handleAuthSuccess(response.data);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};