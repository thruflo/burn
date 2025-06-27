import { useLiveQuery } from '@tanstack/react-db'

import * as auth from '../db/auth'
import { authCollection } from '../db/collections'
import type { Auth } from '../db/schema'

type CurrentUser = Auth | null
type AuthResult = {
  currentUser: CurrentUser
  currentUserId: string | null
  isAuthenticated: boolean
}

export async function setCurrentUser(user: Auth): Promise<void> {
  auth.set(user)

  return authCollection.utils.refetch()
}

export async function clearCurrentUser(): Promise<void> {
  auth.clear()

  return authCollection.utils.refetch()
}

export function useAuth(): AuthResult {
  const { data } = useLiveQuery((query) => query.from({ authCollection }))

  let currentUser: CurrentUser
  let currentUserId: string | null
  let isAuthenticated: boolean

  if (data.length === 1) {
    currentUser = data[0]
    currentUserId = currentUser!.id
    isAuthenticated = true
  } else {
    currentUser = null
    currentUserId = null
    isAuthenticated = false
  }

  return { currentUser, currentUserId, isAuthenticated }
}
