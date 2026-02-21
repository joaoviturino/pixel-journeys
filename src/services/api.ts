const API_BASE = 'https://bd-newera.gratianweb.site';

export interface Usuario {
  id?: number;
  nome_usuario: string;
  email: string;
  whatsapp: string;
  senha?: string;
}

export interface LoginResponse {
  message: string;
  user: Usuario;
}

export interface RegisterResponse {
  message: string;
  user: Usuario;
}

export interface ApiError {
  message: string;
  status: number;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let message = 'Erro desconhecido';
    try {
      const data = await res.json();
      message = data.message || data.error || message;
    } catch {}
    throw { message, status: res.status } as ApiError;
  }

  return res.json();
}

export const api = {
  register: (data: { nome_usuario: string; email: string; whatsapp: string; senha: string }) =>
    request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { nome_usuario: string; senha: string }) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getUsers: (adminKey?: string) =>
    request<Usuario[]>('/users', {
      headers: adminKey ? { 'x-admin-key': adminKey } : undefined,
    }),

  deleteUser: (id: number, adminKey?: string) =>
    request<void>(`/users/${id}`, {
      method: 'DELETE',
      headers: adminKey ? { 'x-admin-key': adminKey } : undefined,
    }),
};
