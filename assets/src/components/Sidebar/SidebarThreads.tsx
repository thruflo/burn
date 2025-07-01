import uuid4 from 'uuid4'

import { useNavigate } from '@tanstack/react-router'
import { useLiveQuery } from '@tanstack/react-db'
import { makeStyles } from '@griffel/react'

import { Button, Flex, Text } from '@radix-ui/themes'
import { Plus, MessagesSquare } from 'lucide-react'

import { useAuth } from '../../db/auth'
import { membershipCollection, threadCollection } from '../../db/collections'
import { createTransaction } from '../../db/transaction'

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
  threadId: string
}

function SidebarThreads({ threadId }: Props) {
  const { currentUserId } = useAuth()

  const classes = useClasses()
  const navigate = useNavigate()

  const { collection: baseQuery } = useLiveQuery(
    (query) =>
      query
        .from({ t: threadCollection })
        .join({
          type: `inner`,
          from: { m: membershipCollection },
          on: [`@t.id`, `=`, `@m.thread_id`],
        })
        .select('@t.id', '@t.name', '@t.inserted_at')
        .where('@m.user_id', '=', currentUserId),
    [currentUserId]
  )
  const { data: nonSyncedThreads } = useLiveQuery((query) =>
    query
      .from({ t: baseQuery })
      .where(({ t }) => t.inserted_at === undefined)
      .select('@t.id', '@t.name')
      .orderBy({ '@t.name': 'desc' })
  )
  const { data: syncedThreads } = useLiveQuery((query) =>
    query
      .from({ t: baseQuery })
      .where(({ t }) => t.inserted_at !== undefined)
      .select('@t.id', '@t.name')
      .orderBy({ '@t.inserted_at': 'desc' })
  )
  const threads = nonSyncedThreads.concat(syncedThreads)

  const createNewThread = () => {
    const newThreadId = uuid4()
    const userId = currentUserId as string
    const numThreads = threads.length

    const tx = createTransaction()
    tx.mutate(() => {
      threadCollection.insert({
        id: newThreadId,
        name: `Untitled thread ${numThreads + 1}`,
        status: 'started',
      })
      membershipCollection.insert({
        id: uuid4(),
        role: 'owner',
        thread_id: newThreadId,
        user_id: userId,
      })
    })

    navigateToThread(newThreadId)
  }

  const navigateToThread = (id: string) => {
    navigate({ to: `/threads/${id}` })
  }

  return (
    <>
      <Button
        size="2"
        color="iris"
        variant="soft"
        my="2"
        onClick={createNewThread}
        className={classes.newThreadButton}
      >
        <Plus size={16} /> New thread
      </Button>
      <Flex align="center" py="2" pl="1">
        <Text size="2" weight="medium">
          Threads
        </Text>
      </Flex>
      <Flex direction="column" className={classes.threadsContainer}>
        {threads.map((thread) => (
          <SidebarButton
            key={thread.id}
            label={thread.name}
            icon={<MessagesSquare size={14} />}
            isActive={thread.id === threadId}
            onClick={() => navigateToThread(thread.id)}
            className={classes.threadButton}
          />
        ))}
      </Flex>
    </>
  )
}

export default SidebarThreads
