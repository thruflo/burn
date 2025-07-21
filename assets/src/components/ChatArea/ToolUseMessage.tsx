import { Badge, Box, Flex, Text } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'
import type { EventResult, UserBadgeColor } from '../../types'
import UserAvatar from '../UserAvatar'

const useStyles = makeStyles({
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
  userBadgeColor: UserBadgeColor
  userName: string
}

function ToolUseMessage({ event }: Props) {
  const classes = useStyles()
  const data = event.data
  // const userId = data.input.subject
  const question = data.input.question
  const messageContent = `Hi thruflo, ${question}`

  if (!question) {
    return null
  }

  return (
    <>
      <Box className={classes.avatar}>
        <UserAvatar
          username={event.user_name}
          imageUrl={undefined}
          size="medium"
          showTooltip={false}
        />
      </Box>
      <Box className={classes.content}>
        <Flex align="center" gap="2" mb="1">
          <Badge
            size="2"
            variant="soft"
            color={'purple'}
            className={classes.userBadge}
          >
            {event.user_name}
          </Badge>
          <Badge
            size="1"
            variant="soft"
            color={'yellow'}
            className={classes.timestamp}>
            {event.data.name}
          </Badge>
        </Flex>
        <Text size="2" className={classes.messageText}>
          {messageContent}
        </Text>
      </Box>
    </>
  )
}

export default ToolUseMessage
