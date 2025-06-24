import uuid4 from 'uuid4'

import { useNavigate } from '@tanstack/react-router'
import { useOptimisticMutation, useLiveQuery } from '@tanstack/react-db'
// import type { Context } from '@tanstack/db'
import { makeStyles } from '@griffel/react'

import { Button, Flex, Text } from '@radix-ui/themes'
import { Plus, MessagesSquare } from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'

import { membershipCollection, threadCollection } from '../../db/collections'
import { ingestMutations } from '../../db/mutations'
// import type { Thread } from '../../db/schema'

import SidebarButton from './SidebarButton'

const useClasses = makeStyles({
  threadButton: {
    paddingLeft: '0px',
  },
  threadsContainer: {
    paddingLeft: 'var(--space-2)',
  },
  newThreadButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

type Props = {
  activeThreadId: string
}

function SidebarThreads({ activeThreadId }: Props) {
  const { currentUser } = useAuth()

  const classes = useClasses()
  const navigate = useNavigate()

  const tx = useOptimisticMutation({ mutationFn: ingestMutations })

  const { data: threads } = useLiveQuery(query => (
    query
      .from({ threadCollection })
      .orderBy({'@inserted_at': 'desc'})
    ))

  const createNewThread = () => {
    const threadId = uuid4()
    const userId = currentUser!.id
    const numThreads = threads.length

    tx.mutate(() => {
      threadCollection.insert({
        id: threadId,
        name: `Untitled thread ${numThreads + 1}`
      })

      membershipCollection.insert({
        id: uuid4(),
        thread_id: threadId,
        user_id: userId
      })
    })

    navigateToThread(threadId)
  }

  const navigateToThread = (threadid: string) => {
    navigate({ to: `/threads/${threadid}` })
  }

  return (
    <>
      <Button size="2" color="iris" variant="soft" my="2"
          onClick={createNewThread}
          className={classes.newThreadButton}>
        <Plus size={16} /> New thread
      </Button>
      <Flex align="center" py="2" pl="1">
        <Text size="2" weight="medium">
          Threads
        </Text>
      </Flex>
      <Flex direction="column" className={classes.threadsContainer}>
        {threads.map(thread => (
          <SidebarButton
              key={thread.id}
              label={thread.name}
              icon={<MessagesSquare size={14} />}
              isActive={thread.id === activeThreadId}
              onClick={() => navigateToThread(thread.id)}
              className={classes.threadButton}
          />
        ))}
      </Flex>
    </>
  )
}

export default SidebarThreads