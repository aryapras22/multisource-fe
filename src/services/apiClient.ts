
const BASE_URL = import.meta.env.VITE_MULTISOURCE_SERVICE_API_ENDPOINT || ""

export interface ApiError extends Error {
  status?: number
  payload?: unknown
}

export async function apiGet<T>(path: string, signal?: AbortSignal) {

  const res = await fetch(BASE_URL + path, {
    method: "GET",
    headers: { Accept: "application/json" },
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

export async function apiPost<T>(path: string, body: unknown, signal?: AbortSignal) {

  const res = await fetch(BASE_URL + path, {
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