import { useRef, useEffect } from 'react'
import { useLiveQuery } from '@tanstack/react-db'
import { Box, ScrollArea } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'

import { eventCollection, userCollection } from '../db/collections'
import type { Event, User } from '../db/schema'

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
    flexShrink: 0
  }
})

// XXX can filter events we don't want to display here.
function whitelistMessageEvents(_event: Event, _user: User): boolean {
  return true
}

type Props = {
  threadId: string
}

function ChatArea({ threadId }: Props) {
  const classes = useStyles()
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data: events } = useLiveQuery(query => (
    query
      .from({ e: eventCollection })
      .join({
        type: 'left', // a left outer join because `user_id` can be null
        from: { u: userCollection },
        on: [`@u.id`, `=`, `@e.user_id`],
      })
      .where('@e.thread_id', '=', threadId)
      .where(({ e, u }) => whitelistMessageEvents(e, u))
      .select(
        '@e.assistant',
        '@e.data',
        '@e.id',
        '@e.inserted_at',
        '@e.role',
        '@e.type',
        { user_id: '@u.id' },
        { user_name: '@u.name' },
      )
      .orderBy({ '@e.inserted_at': 'asc' })
  ), [threadId, whitelistMessageEvents])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [events])

  return (
    <Box className={classes.container}>
      <ScrollArea className={classes.messagesContainer}>
        <Box className={classes.messagesInner}>
          {events.map(event => (
            <ChatMessage key={event.id} event={event} />
          ))}
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
