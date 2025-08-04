const API_URL = 'http://localhost:8080/api';

export interface AuthResponse {
  id: number;
  token: string;
  type: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * @param credentials - O email e a senha do usuário.
 * @returns A resposta da API contendo o token e dados do usuário.
 */
export const login = async (credentials: LoginCredentials ): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha no login');
  }

  return response.json();
};
