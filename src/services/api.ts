const API_BASE = 'https://bd-newera.gratianweb.site';

export interface Usuario {
  id?: number;
  name: string;
  email: string;
  whatsapp?: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: Usuario;
}

export interface Character {
  id?: number;
  name?: string;
  [key: string]: any;
}

export interface ApiError {
  message: string;
  status: number;
}

function getToken(): string | null {
  const stored = localStorage.getItem('newera_token');
  return stored;
}

async function request<T>(path: string, options?: RequestInit & { auth?: boolean }): Promise<T> {
  const { auth, ...fetchOptions } = options || {};
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers,
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
  // Auth
  register: (data: { name: string; email: string; password: string; role?: string; whatsapp?: string }) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Characters
  getCharacters: () =>
    request<Character[]>('/characters', { auth: true }),

  createCharacter: (data: Record<string, any>) =>
    request<Character>('/characters', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: true,
    }),

  getCharacter: (id: number) =>
    request<Character>(`/characters/${id}`, { auth: true }),

  // Decks
  createDeck: (data: Record<string, any>) =>
    request<any>('/decks', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: true,
    }),

  getDecks: (characterId: number) =>
    request<any[]>(`/decks/${characterId}`, { auth: true }),

  addCardToDeck: (deckId: number, data: Record<string, any>) =>
    request<any>(`/decks/${deckId}/add-card`, {
      method: 'POST',
      body: JSON.stringify(data),
      auth: true,
    }),

  // Inventory
  getInventory: (characterId: number) =>
    request<any>(`/inventory/${characterId}`, { auth: true }),
};
