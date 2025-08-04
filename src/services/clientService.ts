import api from './api';

export interface CreateClientDTO {
  name: string;
  email?: string;
  phoneNumber: string;
  product?: string;
  amount: number;
  active: boolean;
  lastPurchase?: string;
  user_id: number;
}

export interface Client {
  id: number;
  name: string;
  email?: string;
  phoneNumber: string;
  product?: string;
  amount: number;
  active: boolean;
  lastPurchase?: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const clientService = {
  async createClient(clientData: CreateClientDTO): Promise<Client> {
    const response = await api.post<Client>('/client/create', clientData);
    return response.data;
  },

  async importClients(file: File, userId: number): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());

    const response = await api.post<string>('/client/import-clients', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  async getClients(userId: number): Promise<Client[]> {
    const response = await api.get<Client[]>(`/client/user/${userId}`);
    return response.data;
  },

  async updateClient(clientId: number, clientData: Partial<CreateClientDTO>): Promise<Client> {
    const response = await api.put<Client>(`/client/${clientId}`, clientData);
    return response.data;
  },

  async deleteClient(clientId: number): Promise<void> {
    await api.delete(`/client/${clientId}`);
  },
};

export default clientService;
