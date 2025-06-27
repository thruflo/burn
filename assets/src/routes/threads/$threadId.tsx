import { useEffect } from 'react'
import { useLiveQuery } from '@tanstack/react-db'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { Box, Flex, IconButton } from '@radix-ui/themes'
import { Menu, Cpu } from 'lucide-react'
import { makeStyles } from '@griffel/react'

import Sidebar from '../../components/Sidebar'
import RightSidebar from '../../components/RightSidebar'
import { useSidebar } from '../../components/Providers/SidebarProvider'

import MainThread from '../../components/MainThread'
import ThreadHeading from '../../components/MainThread/ThreadHeading'

import { membershipCollection, threadCollection } from '../../db/collections'
import { useAuth } from '../../hooks/useAuth'

const useClasses = makeStyles({
  scrollArea: {
    height: `100%`,
    width: `100%`,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid var(--border-color)',
    flexShrink: 0,
    height: '56px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  leftToggle: {
    display: 'inline-flex' /* Make sure it's visible by default */,
    '@media (min-width: 970px)': {
      display: 'none',
    },
  },
  rightToggle: {
    display: 'inline-flex' /* Make sure it's visible by default */,
    '@media (min-width: 700px)': {
      display: 'none',
    },
  },
})

function ThreadPage() {
  const classes = useClasses()
  const navigate = useNavigate()

  console.log('ThreadPage')

  const { currentUserId, isAuthenticated } = useAuth()
  const { threadId } = useParams({ from: '/threads/$threadId' })
  const { toggleLeftSidebar, toggleRightSidebar } = useSidebar()

  console.log('threadCollection.syncedData', threadCollection.syncedData)
  console.log(
    'membershipCollection.syncedData',
    membershipCollection.syncedData
  )

  const { data: threads } = useLiveQuery(
    (query) =>
      query
        .from({ t: threadCollection })
        .join({
          type: `inner`,
          from: { m: membershipCollection },
          on: [`@t.id`, `=`, `@m.thread_id`],
        })
        .select('@t.id', '@t.name')
        .where('@t.id', '=', threadId)
        .where('@m.user_id', '=', currentUserId),
    [threadId, currentUserId]
  )

  const activeThread = threads.length === 1 ? threads[0] : undefined

  console.log('activeThread')

  // const { data: threads } = useLiveQuery(query =>
  //   query
  //     .from({ threadCollection })
  //     .select('@id', '@name')
  //     .where('@id', '=', threadId)
  // )

  // const { data: memberships } = useLiveQuery(query => (
  //   query
  //     .from({ membershipCollection })
  //     .where('@thread_id', '=', threadId)
  //     .where('@user_id', '=', currentUserId)
  //     .select('@id')
  // ))
  // const hasMembership = activeThread !== undefined

  // console.log(
  //   'ThreadPage',
  //   'currentUserId', currentUserId,
  //   'threads', threads,
  //   'hasMembership', hasMembership
  // )

  // // If the user isn't in the thread, redirect to the root.
  useEffect(() => {
    console.log(
      'ThreadPage.useEffect',
      'isAuthenticated',
      isAuthenticated,
      'activeThread',
      activeThread
    )

    if (isAuthenticated && !activeThread) {
      console.log('navigate.to /')

      navigate({ to: `/` })
    }
  }, [isAuthenticated, activeThread, navigate])

  if (!isAuthenticated || activeThread === undefined) {
    return null
  }

  return (
    <Flex height="100vh" width="100vw" overflow="hidden" className="app-layout">
      <Sidebar threadId={activeThread.id} />
      <Flex direction="column" className="content-area" width="100%">
        <Flex direction="column" width="100%" height="100%">
          <Box className={classes.header}>
            <Flex align="center" gap="2" width="100%">
              <IconButton
                variant="ghost"
                size="1"
                onClick={toggleLeftSidebar}
                className={classes.leftToggle}
              >
                <Menu size={18} />
              </IconButton>
              <ThreadHeading title={activeThread.name} />
              <Flex ml="auto" align="center">
                <IconButton
                  variant="ghost"
                  size="1"
                  ml="3"
                  onClick={toggleRightSidebar}
                  className={classes.rightToggle}
                >
                  <Cpu size={18} />
                </IconButton>
              </Flex>
            </Flex>
          </Box>
          <Box style={{ flex: 1, overflow: 'hidden' }}>
            <MainThread threadId={activeThread.id} />
          </Box>
        </Flex>
      </Flex>
      <RightSidebar threadId={activeThread.id} />
    </Flex>
  )
}

export const Route = createFileRoute(`/threads/$threadId`)({
  component: ThreadPage,
})
