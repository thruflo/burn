import type { EventResult } from '../../../types'

import { useLiveQuery, eq } from '@tanstack/react-db'
import { userCollection } from '../../../db/collections'

interface Props {
  event: EventResult
}

function AskUserAboutThemselves({ event }: Props) {
  const { question, subject } = event.data.input

  const formattedQuestion =
    question.length > 0
    ? question.charAt(0).toLowerCase() + question.slice(1)
    : question

  const { data: users } = useLiveQuery((query) => (
      query
        .from({ user: userCollection })
        .where(({ user }) => eq(user.id, subject))
        .select(({ user }) => ({ name: user.name }))
    ),
    [subject]
  )
  const subjectUser = users.length > 0 ? users[0] : undefined

  if (!subjectUser || !formattedQuestion) {
    return null
  }

  return (
    <>
      Hi{' '}
      <span style={{'color': 'rgb(125, 184, 255)'}}>
        @{subjectUser.name}</span>,
      {' '}
      {formattedQuestion}
    </>
  )
}

export default AskUserAboutThemselves
