import { useRef, useEffect } from 'react'
import { useLiveQuery } from '@tanstack/react-db'
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

  const { data: events } = useLiveQuery(
    (query) =>
      query
        .from({ e: eventCollection })
        .join({
          type: 'inner',
          from: { u: userCollection },
          on: [`@u.id`, `=`, `@e.user_id`],
        })
        .where('@e.thread_id', '=', threadId)
        .select(
          '@e.id',
          '@e.type',
          '@e.data',
          '@e.inserted_at',
          { user_id: '@u.id' },
          { user_name: '@u.name' },
          { user_type: '@u.type' }
        )
        .orderBy({ '@e.inserted_at': 'asc' }),
    [threadId]
  )

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
