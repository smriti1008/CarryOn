const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '')

// API helper for wiring the React UI to your Express routes.
// Update the endpoint paths to match the actual routes in your CarryOn backend.
export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path.startsWith('/') ? path : `/${path}`}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const data = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) throw new Error(data?.message || `Request failed (${response.status})`)
  return data
}

export const getProducts = () => apiRequest('/products')
export const login = (credentials) => apiRequest('/login', { method: 'POST', body: JSON.stringify(credentials) })
export const register = (details) => apiRequest('/register', { method: 'POST', body: JSON.stringify(details) })
