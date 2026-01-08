
const BASE_URL = import.meta.env.VITE_MULTISOURCE_SERVICE_API_ENDPOINT || ""
const API_KEY = import.meta.env.VITE_API_KEY || "";

export interface ApiError extends Error {
  status?: number
  payload?: unknown
}

export async function apiGet<T>(path: string, signal?: AbortSignal) {
  const separator = path.includes('?') ? '&' : '?'
  const url = `${BASE_URL}${path}${separator}key=${encodeURIComponent(API_KEY)}`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json"
    },
    signal
  })

  if (!res.ok) {
    const err: ApiError = new Error(`GET ${path} faild (${res.status})`)
    err.status = res.status
    try {
      err.payload = await res.json()
    } catch { /* empty */ }
    throw err
  }

  return res.json() as Promise<T>
}

export async function apiPost<T>(path: string, body?: unknown, signal?: AbortSignal) {
  const separator = path.includes('?') ? '&' : '?'
  const url = `${BASE_URL}${path}${separator}key=${encodeURIComponent(API_KEY)}`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    signal
  })

  if (!res.ok) {
    const err: ApiError = new Error(`POST ${path} failed (${res.status})`)
    err.status = res.status
    try {
      err.payload = await res.json()
    } catch { /* empty */ }
    throw err
  }

  return res.json() as Promise<T>
}

export async function apiPatch<T>(endpoint: string, body?: unknown): Promise<T> {
  const separator = endpoint.includes('?') ? '&' : '?'
  const url = `${BASE_URL}${endpoint}${separator}key=${encodeURIComponent(API_KEY)}`

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : null,
  })
  return response.json() as Promise<T>
}

export async function apiDelete<T = void>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(BASE_URL + path, {
    method: "DELETE",
    headers: { Accept: "application/json" },
    signal
  })

  if (!res.ok) {
    const err: ApiError = new Error(`DELETE ${path} failed (${res.status})`)
    err.status = res.status
    try {
      err.payload = await res.json()
    } catch { /* empty */ }
    throw err
  }

  // Handle 204 No Content or empty response
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}