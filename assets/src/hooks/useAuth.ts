import { useLiveQuery } from '@tanstack/react-db'

import * as auth from '../db/auth'
import { authCollection } from '../db/collections'
import type { Auth, User } from '../db/schema'

type CurrentUser = Auth | undefined
type AuthResult = {
  currentUser: CurrentUser,
  currentUserId: string | undefined,
  isAuthenticated: boolean
}

export async function setCurrentUser(user: User): Promise<void> {
  auth.set(user)

  return authCollection.utils.refetch()
}

export async function clearCurrentUser(): Promise<void> {
  auth.clear()

  return authCollection.utils.refetch()
}

export function useAuth(): AuthResult {
  const { data } = useLiveQuery(
    (query) =>
      query
        .from({ authCollection })
  )

  let currentUser: CurrentUser
  let currentUserId: string | undefined
  let isAuthenticated: boolean

  if (data.length === 1) {
    currentUser = data[0]! as Auth
    currentUserId = currentUser.id
    isAuthenticated = true
  }
  else {
    currentUser = undefined
    currentUserId = undefined
    isAuthenticated = false
  }

  // console.log('useAuth return value', { currentUser, currentUserId, isAuthenticated })

  return { currentUser, currentUserId, isAuthenticated }
}
