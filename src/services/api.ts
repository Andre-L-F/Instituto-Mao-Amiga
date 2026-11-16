import { Platform } from 'react-native';

// URL base da API Spring Boot centralizada
// Para emulador Android: http://10.0.2.2:8080
// Para Web/iOS/Dispositivos físicos: use o IP local do computador (ex: http://192.168.1.100:8080) ou localhost
export const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options?.headers,
      },
      ...options,
    });
  } catch (error) {
    throw new ApiError(
      0,
      'Não foi possível conectar ao servidor. Verifique se a API está em execução e acessível.'
    );
  }

  if (!response.ok) {
    let errorData: unknown = null;
    try {
      errorData = await response.json();
    } catch {
      // response might be empty or not json
    }
    throw new ApiError(
      response.status,
      `Erro HTTP ${response.status}: ${response.statusText || 'Falha na requisição'}`,
      errorData
    );
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return (await response.json()) as T;
}

export async function get<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'GET' });
}

export async function post<T>(endpoint: string, body?: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: 'POST',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export async function put<T>(endpoint: string, body?: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: 'PUT',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export async function del<T = void>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'DELETE' });
}

// Alias para compatibilidade
export const apiFetch = request;
