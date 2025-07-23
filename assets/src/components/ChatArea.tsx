import { useRef, useEffect } from 'react'
import { useLiveQuery, eq, not } from '@tanstack/react-db'
import { Box, ScrollArea } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'

import { eventCollection, userCollection } from '../db/collections'

import ChatInput from './ChatArea/ChatInput'
import ChatMessage from './ChatArea/ChatMessage'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  messagesContainer: {
    flex: 1,
    width: '100%',
  },
  messagesInner: {
    padding: 'var(--space-4)',
    width: '100%',
  },
  inputWrapper: {
    flexShrink: 0,
  },
})

type Props = {
  threadId: string
}

function ChatArea({ threadId }: Props) {
  const classes = useStyles()
  const bottomRef = useRef<HTMLDivElement>(null)

  const { collection: resultCollection } = useLiveQuery(
    (query) => (
      query
        .from({ event: eventCollection })
        .innerJoin(
          { user: userCollection },
          ({ event, user }) => eq(user.id, event.user_id)
        )
        .select(({ event, user }) => ({
          data: event.data,
          id: event.id,
          inserted_at: event.inserted_at,
          type: event.type,
          user_id: user.id,
          user_name: user.name,
          user_type: user.type
        }))
        .where(({ event }) => eq(event.thread_id, threadId))
    ),
    [threadId]
  )
  const { data: syncedEvents } = useLiveQuery((query) =>
    query
      .from({ result: resultCollection })
      .orderBy(({ result }) => result.inserted_at, 'asc')
      .where(({ result }) => not(eq(result.inserted_at, undefined)))
  )
  const { data: nonSyncedEvents } = useLiveQuery((query) =>
    query
      .from({ result: resultCollection })
      .where(({ result }) => eq(result.inserted_at, undefined))
  )
  const events = syncedEvents.concat(nonSyncedEvents)

  console.log('events.length', events.length)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [events])

  return (
    <Box className={classes.container}>
      <ScrollArea className={classes.messagesContainer}>
        <Box className={classes.messagesInner}>
          {events.map((event) =>
            <ChatMessage key={event.id} event={event} />
          )}
          <div ref={bottomRef} />
        </Box>
      </ScrollArea>
      <Box className={classes.inputWrapper}>
        <ChatInput threadId={threadId} />
      </Box>
    </Box>
  )
}

export default ChatArea
