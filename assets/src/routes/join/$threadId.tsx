import uuid4 from 'uuid4'

import { useEffect } from 'react'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useLiveQuery } from '@tanstack/react-db'
import { membershipCollection } from '../../db/collections'
import { useAuth } from '../../hooks/useAuth'

function JoinThread() {
  const navigate = useNavigate()

  const { currentUserId, isAuthenticated } = useAuth()
  const { threadId } = useParams({ from: '/join/$threadId' })

  const { data: memberships } = useLiveQuery(query => (
    query
      .from({ membershipCollection })
      .where('@thread_id', '=', threadId)
      .where('@user_id', '=', isAuthenticated ? currentUserId : null)
  ))
  const hasMembership = memberships.length > 0

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    // If the user is in the thread, redirect to it.
    if (hasMembership) {
      navigate({ to: '/threads/$threadId', params: { threadId } })

      return
    }

    // Otherwise add them to the thread.
    membershipCollection.insert({
      id: uuid4(),
      thread_id: threadId,
      user_id: currentUserId as string
    })
  }, [currentUserId, isAuthenticated, hasMembership, threadId, navigate])

  // Always return null - this page never shows content
  return null
}

export const Route = createFileRoute(`/join/$threadId`)({
  component: JoinThread,
})