import type { Auth, User } from './schema'

const KEY = 'burn:auth:user'

export function get(): Auth | null {
  const value = localStorage.getItem(KEY)

  return value ? JSON.parse(value) : null
}

export function all(): Auth[] {
  const value = get()

  return value ? [value] : []
}

export function set({ id, name }: User): void {
  const auth: Auth = { id, name }

  return localStorage.setItem(KEY, JSON.stringify(auth))
}

export function clear(): void {
  return localStorage.removeItem(KEY)
}
