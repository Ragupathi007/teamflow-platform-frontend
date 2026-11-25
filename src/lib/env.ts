const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

if (!apiBaseUrl) {
  throw new Error(
    'VITE_API_BASE_URL is not defined. Copy .env.example to .env and set the API base URL.',
  )
}

export const env = {
  apiBaseUrl,
} as const
