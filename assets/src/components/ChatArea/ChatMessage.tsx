// import type { ReactNode } from 'react'
import { Box } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'
import { useAuth } from '../../db/auth'
import type { EventResult } from '../../types'

import SystemMessage from './SystemMessage'
import TextMessage from './TextMessage'
import ToolUseMessage from './ToolUseMessage'
import ToolResultMessage from './ToolResultMessage'

const messageComponents = {
  system: SystemMessage,
  text: TextMessage,
  tool_use: ToolUseMessage,
  tool_result: ToolResultMessage,
}

const useStyles = makeStyles({
  message: {
    display: 'flex',
    gap: 'var(--space-3)',
    marginBottom: 'var(--space-4)',
    maxWidth: '100%',
  },
  avatar: {
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  messageText: {
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    fontSize: '13px',
  },
  timestamp: {
    fontSize: '10px',
    opacity: 0.7,
  },
  userBadge: {
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    display: 'inline',
    verticalAlign: 'middle',
    paddingTop: '1.5px',
    paddingBottom: '2px',
  },
})

interface Props {
  event: EventResult
}

function ChatMessage({ event }: Props) {
  const classes = useStyles()
  const { currentUserId } = useAuth()

  const userName = event.user_id === currentUserId ? 'you' : event.user_name
  const userBadgeColor = event.user_type === 'human' ? 'blue' : 'purple'

  const MessageComponent = messageComponents[event.type]!

  return (
    <Box className={classes.message}>
      <MessageComponent
        event={event}
        userName={userName}
        userBadgeColor={userBadgeColor}
      />
    </Box>
  )
}

export default ChatMessage
