const BASE_URL = 'http://localhost:8080/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const body = await res.json();
      msg = body.message || body.error || JSON.stringify(body);
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path: string) =>
    fetch(`${BASE_URL}${path}`, { method: 'DELETE' }).then(res => {
      if (!res.ok) throw new Error(`Error ${res.status}`);
    }),
};
