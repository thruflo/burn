import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useLiveQuery } from '@tanstack/react-db'
import { useAuth } from '../hooks/useAuth'
import { threadCollection } from '../db/collections'

// The index page always redirects to the latest thread.
function Index() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const { data: threads } = useLiveQuery(query => (
    query
      .from({ threadCollection })
      .orderBy({'@inserted_at': 'desc'})
      .limit(1)
  ))

  const latestThreadId =
    threads.length > 0
    ? threads[0].id
    : undefined

  useEffect(() => {
    if (!isAuthenticated || latestThreadId === undefined) {
      return
    }

    navigate({to: '/threads/$threadId', params: { threadId: latestThreadId! }})
  }, [isAuthenticated, latestThreadId, navigate])

  // Always return null - this page never shows content
  return null
}

export const Route = createFileRoute(`/`)({component: Index})