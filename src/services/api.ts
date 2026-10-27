import { Platform } from 'react-native';

// URL base da API Spring Boot
// Para emuladores Android: 10.0.2.2 redireciona para o localhost da máquina host
// Para iOS, Web ou dispositivos físicos: http://localhost:8080 (ou IP da rede)
export const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Erro ${response.status} ao acessar ${endpoint}`
    );
  }

  return (await response.json()) as T;
}
