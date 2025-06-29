import axios, { AxiosError } from 'axios'
import type { PendingMutation } from '@tanstack/db'

import { authCollection } from './db/collections'
import type { User } from './db/schema'

type SignInResult = Pick<User, 'id' | 'name'>;

type IngestPayload = {
  mutations: Omit<PendingMutation, 'collection'>[]
};

const authHeaders = () => {
  const auth = authCollection.get('current')

  return auth !== undefined
    ? { Authorization: `Bearer ${auth.user_id}` }
    : {}
}

export async function signIn(username: string): Promise<string | undefined> {
  const data = { username }
  const headers = authHeaders()

  try {
    const response = await axios.post('/auth/sign-in', data, { headers })
    const { id: user_id }: SignInResult = response.data

    return user_id
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
