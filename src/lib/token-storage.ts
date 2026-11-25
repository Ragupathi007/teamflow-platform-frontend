const TOKEN_KEY = 'teamflow.auth.token'

function getLocalStorage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function getSessionStorage(): Storage | null {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

export const tokenStorage = {
  get(): string | null {
    const local = getLocalStorage()
    const session = getSessionStorage()

    return local?.getItem(TOKEN_KEY) ?? session?.getItem(TOKEN_KEY) ?? null
  },

  set(token: string, remember = true): void {
    const local = getLocalStorage()
    const session = getSessionStorage()

    if (remember) {
      local?.setItem(TOKEN_KEY, token)
      session?.removeItem(TOKEN_KEY)
      return
    }

    session?.setItem(TOKEN_KEY, token)
    local?.removeItem(TOKEN_KEY)
  },

  clear(): void {
    getLocalStorage()?.removeItem(TOKEN_KEY)
    getSessionStorage()?.removeItem(TOKEN_KEY)
  },
}
