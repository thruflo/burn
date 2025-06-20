import { useState, useCallback, useEffect, useRef } from 'react'
import { Flex, IconButton, Tooltip } from '@radix-ui/themes'
import { Edit, Plus, User, Bot } from 'lucide-react'
import { makeStyles, mergeClasses } from '@griffel/react'
import UserAvatar from './UserAvatar'
import { copyInviteLink } from '../utils/clipboard'

interface UserInfo {
  username: string
  imageUrl?: string
}

interface UserTopBarProps {
  users: UserInfo[]
  agents?: UserInfo[]
  threadId: string
  onEditClick: () => void
}

const useClasses = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-4) var(--space-4)',
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--color-background)',
    containerType: 'inline-size',
  },
  sectionsContainer: {
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden',
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 'var(--space-5)',
    '@container (max-width: 376px)': {
      marginRight: 'var(--space-3)',
    },
  },
  usersList: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  label: {
    marginRight: 'var(--space-2)',
    '@container (max-width: 376px)': {
      display: 'none',
    },
  },
  inviteButton: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--gray-4)',
    color: 'var(--gray-11)',
    cursor: 'pointer',
    marginLeft: '4px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  editButton: {
    flexShrink: 0,
    marginLeft: 'var(--space-3)',
  },
  clickable: {
    cursor: 'pointer',
  },
})

export default function UserTopBar({
  users,
  agents = [],
  threadId,
  onEditClick,
}: UserTopBarProps) {
  const classes = useClasses()
  const [tooltipText, setTooltipText] = useState('Copy invitation link')
  const [showTooltip, setShowTooltip] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleInviteClick = useCallback(() => {
    copyInviteLink(threadId)

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Force show tooltip
    setTooltipText('Invite link copied!')
    setShowTooltip(true)

    // Hide tooltip and reset text after 2 seconds
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(false)
      setTooltipText('Copy invitation link')
      timeoutRef.current = null
    }, 2000)
  }, [threadId])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <Flex className={classes.container}>
      <Flex className={classes.sectionsContainer}>
        <Flex className={classes.section}>
          <User size={18} color="var(--gray-12)" className={classes.label} />
          <Flex className={classes.usersList}>
            {users.map((user, index) => (
              <UserAvatar
                key={user.username}
                username={user.username}
                imageUrl={user.imageUrl}
                size="medium"
                index={index}
              />
            ))}
            <Tooltip content={tooltipText} open={showTooltip}>
              <div
                className={mergeClasses(classes.inviteButton, 'clickable')}
                onClick={handleInviteClick}
              >
                <Plus size={16} />
              </div>
            </Tooltip>
          </Flex>
        </Flex>

        {agents.length > 0 && (
          <Flex className={classes.section}>
            <Bot size={18} color="var(--gray-12)" className={classes.label} />
            <Flex className={classes.usersList}>
              {agents.map((agent, index) => (
                <UserAvatar
                  key={agent.username}
                  username={agent.username}
                  imageUrl={agent.imageUrl}
                  size="medium"
                  index={index}
                />
              ))}
            </Flex>
          </Flex>
        )}
      </Flex>

      <IconButton
        variant="ghost"
        size="1"
        className={mergeClasses('clickable', classes.editButton)}
        onClick={onEditClick}
      >
        <Edit size={16} />
      </IconButton>
    </Flex>
  )
}
