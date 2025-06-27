import axios, { AxiosError } from 'axios'
import type { PendingMutation } from '@tanstack/db'

import * as auth from './db/auth'
import type { Auth } from './db/schema'

type IngestPayload = {
  mutations: Omit<PendingMutation, 'collection'>[]
}

const authHeaders = () => {
  const user = auth.get()

  if (user) {
    return { Authorization: `Bearer ${user.name}` }
  }

  return {}
}

export async function signIn(username: string): Promise<Auth | undefined> {
  const data = { username }
  const headers = authHeaders()

  try {
    const response = await axios.post('/auth/sign-in', data, { headers })

    return response.data as Auth
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return
    }

    throw err
  }
}

export async function ingest(
  payload: IngestPayload
): Promise<string | undefined> {
  const headers = authHeaders()

  try {
    const response = await axios.post('/ingest/mutations', payload, { headers })

    return response.data.txid as string
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      return
    }

    throw err
  }
}
