import axios from 'axios'
import * as auth from './db/auth'

const authHeaders = () => {
  const user = auth.get()

  if (user) {
    return {'Authorization': `Bearer ${user.name}`}
  }

  return {}
}

export async function signIn(username: string) {
  const data = { username }
  const headers = authHeaders()

  const response = await axios.post('/auth/sign-in', data, { headers })

  if (response.status !== 200) {
    const error = new Error(`HTTP Error ${response.status}`, { cause: { response }})

    throw error
  }

  return response.data
}
