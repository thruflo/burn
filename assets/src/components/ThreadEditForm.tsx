import { useState } from 'react'
import {
  Box,
  Flex,
  Text,
  TextField,
  Button,
  IconButton,
  Checkbox,
} from '@radix-ui/themes'
import { X as CloseIcon } from 'lucide-react'
import { makeStyles, mergeClasses } from '@griffel/react'
import UserAvatar from './UserAvatar'
import UserRemoveModal from './UserRemoveModal'
import { copyInviteLink, getJoinUrl } from '../utils/clipboard'

interface User {
  username: string
  imageUrl?: string
}

interface Agent {
  username: string
  imageUrl?: string
  isProducer?: boolean
  enabled: boolean
}

const useClasses = makeStyles({
  listItem: {
    borderRadius: 'var(--radius-2)',
    padding: 'var(--space-2)',
    marginLeft: 'calc(-1 * var(--space-2))',
    marginRight: 'calc(-1 * var(--space-2))',
    transition: 'background-color 0.15s ease',
  },
  clickableRow: {
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'var(--gray-3)',
    },
  },
})

interface ThreadEditFormProps {
  threadId: string
}

export default function ThreadEditForm({ threadId }: ThreadEditFormProps) {
  const classes = useClasses()
  const [threadName, setThreadName] = useState('This is a conversation')
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [userToRemove, setUserToRemove] = useState<User | null>(null)
  const [inviteCopied, setInviteCopied] = useState(false)
  const [threadNameSaved, setThreadNameSaved] = useState(false)

  // Sample data - will be replaced with real data
  const currentUser: User = {
    username: 'alice',
    imageUrl: 'https://i.pravatar.cc/150?u=alice',
  }

  const threadUsers: User[] = [
    currentUser,
    { username: 'bob' },
    { username: 'carol', imageUrl: 'https://i.pravatar.cc/150?u=carol' },
    { username: 'dave' },
  ]

  const [allAgents, setAllAgents] = useState<Agent[]>([
    {
      username: 'sarah',
      isProducer: true,
      enabled: true,
    },
    {
      username: 'claude',
      imageUrl: 'https://i.pravatar.cc/150?u=claude',
      enabled: false,
    },
    {
      username: 'gpt4',
      enabled: true,
    },
  ])

  const handleSaveThreadName = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Wire up actual save logic
    console.log('Saving thread name:', threadName)
    setThreadNameSaved(true)
    setTimeout(() => setThreadNameSaved(false), 2000)
  }

  const handleRemoveUser = (user: User) => {
    setUserToRemove(user)
    setShowRemoveModal(true)
  }

  const confirmRemoveUser = () => {
    if (userToRemove) {
      // TODO: Wire up actual remove logic
      console.log('Removing user:', userToRemove.username)
    }
    setShowRemoveModal(false)
    setUserToRemove(null)
  }

  const cancelRemoveUser = () => {
    setShowRemoveModal(false)
    setUserToRemove(null)
  }

  const handleAgentToggle = (agentUsername: string, enabled: boolean) => {
    setAllAgents((prev) =>
      prev.map((agent) =>
        agent.username === agentUsername ? { ...agent, enabled } : agent
      )
    )
    // TODO: Wire up actual agent toggle logic
    console.log('Toggle agent:', agentUsername, enabled)
  }

  const handleAgentRowClick = (agent: Agent) => {
    if (!agent.isProducer) {
      handleAgentToggle(agent.username, !agent.enabled)
    }
  }

  const handleUserRowClick = (user: User, index: number) => {
    if (index !== 0) {
      // Don't allow removing current user
      handleRemoveUser(user)
    }
  }

  const handleCopyInvite = () => {
    copyInviteLink(threadId)
    setInviteCopied(true)
    setTimeout(() => setInviteCopied(false), 2000)
  }

  return (
    <>
      <Box p="4" pt="0" height="100%" style={{ overflowY: 'auto' }}>
        {/* Thread Name Section */}
        <Box mb="6">
          <form onSubmit={handleSaveThreadName}>
            <Box mb="1">
              <Text as="label" size="2" weight="medium">
                Thread name
              </Text>
            </Box>
            <Flex gap="3" align="end">
              <Box flexGrow="1">
                <TextField.Root
                  value={threadName}
                  onChange={(e) => setThreadName(e.target.value)}
                  size="2"
                />
              </Box>
              <Button type="submit" size="2" color="iris" variant="soft">
                {threadNameSaved ? 'Saved!' : 'Save'}
              </Button>
            </Flex>
          </form>
        </Box>

        {/* Users Section */}
        <Box mb="5">
          <Box mb="2">
            <Text size="3" weight="medium">
              Users
            </Text>
          </Box>
          <Flex direction="column">
            {threadUsers.map((user, index) => (
              <Flex
                key={user.username}
                align="center"
                justify="between"
                pb="1"
                className={mergeClasses(
                  classes.listItem,
                  index !== 0 && classes.clickableRow
                )}
                onClick={() => handleUserRowClick(user, index)}
              >
                <Flex align="center" gap="2">
                  <UserAvatar
                    username={user.username}
                    imageUrl={user.imageUrl}
                    size="medium"
                  />
                  <Text size="2">{user.username}</Text>
                  {index === 0 && (
                    <Text size="1" color="gray">
                      (you)
                    </Text>
                  )}
                </Flex>
                {index !== 0 && (
                  <IconButton
                    variant="ghost"
                    size="1"
                    color="red"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveUser(user)
                    }}
                  >
                    <CloseIcon size={14} />
                  </IconButton>
                )}
              </Flex>
            ))}
          </Flex>

          {/* Invite Users Section */}
          <Box mt="1">
            <Box mb="1">
              <Text as="label" size="2" weight="medium">
                Invite
              </Text>
            </Box>
            <Flex gap="3" align="end">
              <Box flexGrow="1">
                <TextField.Root
                  value={getJoinUrl(threadId)}
                  readOnly
                  size="2"
                />
              </Box>
              <Button
                size="2"
                color="iris"
                variant="soft"
                onClick={handleCopyInvite}
              >
                {inviteCopied ? 'Copied!' : 'Copy'}
              </Button>
            </Flex>
          </Box>
        </Box>

        {/* Agents Section */}
        <Box>
          <Box mb="2">
            <Text size="3" weight="medium">
              Agents
            </Text>
          </Box>
          <Flex direction="column">
            {allAgents.map((agent) => (
              <Flex
                key={agent.username}
                align="center"
                justify="between"
                pb="1"
                className={mergeClasses(
                  classes.listItem,
                  !agent.isProducer && classes.clickableRow
                )}
                onClick={() => handleAgentRowClick(agent)}
              >
                <Flex align="center" gap="2">
                  <UserAvatar
                    username={agent.username}
                    imageUrl={agent.imageUrl}
                    size="medium"
                  />
                  <Text size="2">{agent.username}</Text>
                  {agent.isProducer && (
                    <Text size="1" color="gray">
                      (producer)
                    </Text>
                  )}
                </Flex>
                <Checkbox
                  checked={agent.enabled}
                  disabled={agent.isProducer}
                  onCheckedChange={(checked) =>
                    handleAgentToggle(agent.username, checked === true)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              </Flex>
            ))}
          </Flex>
        </Box>
      </Box>

      <UserRemoveModal
        isOpen={showRemoveModal}
        userName={userToRemove?.username || ''}
        onConfirm={confirmRemoveUser}
        onCancel={cancelRemoveUser}
      />
    </>
  )
}
