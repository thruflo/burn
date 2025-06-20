import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

export const Route = createFileRoute(`/join/$threadId`)({
  component: JoinThread,
})

// Stub function for inserting membership
function insertMembership(threadId: string) {
  // TODO: Implement actual membership insertion logic
  console.log(`Inserting membership for thread: ${threadId}`)
}

function JoinThread() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const { threadId } = useParams({ from: '/join/$threadId' })

  // Don't render anything if not authenticated (redirect will handle this)
  if (!isLoggedIn) {
    return null
  }

  // Check membership (stubbed)
  const hasMembership = false // TODO: Replace with actual membership check

  useEffect(() => {
    if (hasMembership) {
      // Redirect to thread if already a member
      navigate({ to: '/threads/$threadId', params: { threadId } })
    } else {
      // Insert membership (stub) - no redirect after
      insertMembership(threadId)
    }
  }, [threadId, hasMembership, navigate])

  // Always return null - this page never shows content
  return null
}
