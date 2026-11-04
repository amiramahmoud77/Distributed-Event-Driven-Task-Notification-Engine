export async function api(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');

  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (response.status === 401 && token) {
    localStorage.removeItem('token');
    window.location.reload();
  }

  if (!response.ok) {
    throw new Error(data?.message || `Server unreachable (status ${response.status})`);
  }

  return data;
}