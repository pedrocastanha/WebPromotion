// Tipos para entidade Client
export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tipo para criação de cliente (sem campos auto-gerados)
export interface CreateClientData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  active?: boolean;
}

// Tipo para atualização de cliente (campos opcionais)
export interface UpdateClientData {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  active?: boolean;
}

// Tipo para filtros de busca
export interface ClientFilters {
  search?: string;
  active?: boolean;
  city?: string;
  state?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Tipo para paginação
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: keyof Client;
  sortOrder?: 'asc' | 'desc';
}

// Tipo para resposta paginada
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipo para estatísticas de clientes
export interface ClientStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  averageAge: number;
  topCities: Array<{
    city: string;
    count: number;
  }>;
  topStates: Array<{
    state: string;
    count: number;
  }>;
}

// Tipo para importação CSV
export interface ImportResult {
  success: number;
  errors: number;
  duplicates: number;
  details: Array<{
    row: number;
    error?: string;
    data?: Partial<Client>;
  }>;
}

