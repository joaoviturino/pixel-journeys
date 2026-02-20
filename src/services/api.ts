const API_BASE = 'https://bd-newera.gratianweb.site';

export interface Usuario {
  id?: number;
  nome_usuario: string;
  email: string;
  whatsapp: string;
  senha: string;
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
  health: () => request<{ status: string }>('/health'),

  register: (data: Omit<Usuario, 'id'>) =>
    request<Usuario>('/api/usuarios', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getUsuarios: () => request<Usuario[]>('/api/usuarios'),

  getUsuario: (id: number) => request<Usuario>(`/api/usuarios/${id}`),

  updateUsuario: (id: number, data: Partial<Usuario>) =>
    request<Usuario>(`/api/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteUsuario: (id: number) =>
    request<void>(`/api/usuarios/${id}`, { method: 'DELETE' }),
};
