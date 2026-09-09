const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:4000/api');

export function assetUrl(path: string) {
  return `${API_URL.replace(/\/api\/?$/, '')}${path}`;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('admin_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false,
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    if (res.status === 401 && auth && typeof window !== 'undefined') {
      window.localStorage.removeItem('admin_token');
      window.localStorage.removeItem('admin_user');
      window.dispatchEvent(new Event('admin-auth-expired'));
    }

    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = Array.isArray(body.message) ? body.message.join(', ') : body.message || message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

export const api = {
  get: <T>(path: string, auth = false) => request<T>(path, { method: 'GET' }, auth),
  post: <T>(path: string, body?: unknown, auth = false) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }, auth),
  patch: <T>(path: string, body?: unknown, auth = false) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }, auth),
  upload: <T>(path: string, body: FormData, auth = false) =>
    request<T>(path, { method: 'POST', body }, auth),
  delete: <T>(path: string, auth = false) => request<T>(path, { method: 'DELETE' }, auth),
};
