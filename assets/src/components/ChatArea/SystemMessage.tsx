import { Badge, Flex, Text } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'
import type { EventResult, UserBadgeColor } from '../../types'

const useStyles = makeStyles({
  messageInner: {
    marginBottom: 'var(--space-1)',
    marginLeft: 'auto',
    marginRight: 'auto',
    background: 'var(--gray-3)',
    padding: 'var(--space-1) var(--space-4)',
    borderRadius: '15px',
  },
  messageText: {
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    fontSize: '13px',
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

function SystemMessage({ event, userBadgeColor, userName }: Props) {
  const classes = useStyles()

  const { action, target } = event.data
  const messageContent = `${action} the ${target}`

  return (
    <>
      <Flex align="center" gap="1" className={classes.messageInner}>
        <Badge
          size="2"
          variant="soft"
          color={userBadgeColor}
          className={classes.userBadge}
        >
          {userName}
        </Badge>
        <Text size="2" className={classes.messageText}>
          {messageContent}
        </Text>
      </Flex>
    </>
  )
}

export default SystemMessage
