import axios from 'axios'
import { toApiError } from './api-error'
import { env } from './env'
import { tokenStorage } from './token-storage'

type UnauthorizedHandler = () => void

let unauthorizedHandler: UnauthorizedHandler | null = null

export function setUnauthorizedHandler(
  handler: UnauthorizedHandler | null,
): void {
  unauthorizedHandler = handler
}

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = tokenStorage.get()

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error)

    if (apiError.status === 401 && tokenStorage.get()) {
      tokenStorage.clear()
      unauthorizedHandler?.()
    }

    return Promise.reject(apiError)
  },
)
