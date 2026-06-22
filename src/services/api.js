
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const BASE_URL = '/api';

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  
  const res = await fetch(`${API_URL}${BASE_URL}${path}`, {
    headers,
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Error ${res.status}`);
  }
  return res.json();
}

export const api = {
  get:    (path)       => request(path),
  post:   (path, data) => request(path, { method: 'POST', body: JSON.stringify(data) }),
  put:    (path, data) => request(path, { method: 'PUT', body: JSON.stringify(data) }),
  patch:  (path, data) => request(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (path)       => request(path, { method: 'DELETE' }),
};