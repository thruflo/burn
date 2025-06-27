import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useLiveQuery } from '@tanstack/react-db'
import { useAuth } from '../hooks/useAuth'
import { membershipCollection, threadCollection } from '../db/collections'

// The index page always redirects to the user's latest thread.
function Index() {
  const navigate = useNavigate()
  const { currentUserId, isAuthenticated } = useAuth()

  console.log('IndexPage', 'isAuthenticated', isAuthenticated)

  const { data: threads } = useLiveQuery(
    (query) =>
      query
        .from({ t: threadCollection })
        .join({
          type: `inner`,
          from: { m: membershipCollection },
          on: [`@t.id`, `=`, `@m.thread_id`],
        })
        .select('@t.id')
        .where('@m.user_id', '=', currentUserId)
        .orderBy({ '@inserted_at': 'desc' })
        .limit(1),
    [currentUserId]
  )

  console.log('threads', threads)

  const latestThreadId = threads.length > 0 ? threads[0].id : undefined

  useEffect(() => {
    console.log(
      'IndexPage.useEffect',
      'isAuthenticated',
      isAuthenticated,
      'latestThreadId',
      latestThreadId
    )

    if (!isAuthenticated || latestThreadId === undefined) {
      return
    }

    navigate({ to: '/threads/$threadId', params: { threadId: latestThreadId } })
  }, [isAuthenticated, latestThreadId, navigate])

  return null
}

export const Route = createFileRoute(`/`)({ component: Index })
