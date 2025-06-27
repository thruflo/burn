import uuid4 from 'uuid4'

import { useEffect } from 'react'
import { useLiveQuery } from '@tanstack/react-db'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'

import { membershipCollection } from '../../db/collections'
import { useAuth } from '../../hooks/useAuth'

function JoinPage() {
  const navigate = useNavigate()

  const { currentUserId, isAuthenticated } = useAuth()
  const { threadId } = useParams({ from: '/join/$threadId' })

  const { data: memberships } = useLiveQuery(
    (query) =>
      query
        .from({ membershipCollection })
        .where('@thread_id', '=', threadId)
        .where('@user_id', '=', currentUserId)
        .select('@id'),
    [threadId, currentUserId]
  )
  const hasMembership = memberships.length > 0

  // If the user isn't in the thread, join them to it.
  useEffect(() => {
    if (isAuthenticated && !hasMembership) {
      const userId = currentUserId as string

      membershipCollection.insert({
        id: uuid4(),
        thread_id: threadId,
        user_id: userId,
      })

      navigate({ to: `/threads/${threadId}` })
    }
  }, [isAuthenticated, hasMembership, threadId, currentUserId])

  return null
}

export const Route = createFileRoute(`/join/$threadId`)({
  component: JoinPage,
})
