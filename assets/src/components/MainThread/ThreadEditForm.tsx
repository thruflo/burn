import { useState } from 'react'
import { useLiveQuery, eq } from '@tanstack/react-db'
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
import { useAuth } from '../../db/auth'
import { copyInviteLink, getJoinUrl } from '../../utils/clipboard'
import UserAvatar from '../UserAvatar'
import ThreadRemoveUserModal from './ThreadRemoveUserModal'

import {
  membershipCollection,
  threadCollection,
  userCollection,
} from '../../db/collections'
import type { Membership, User } from '../../db/schema'

type UserResult = Pick<User, 'id' | 'name'> & {
  membership_id: Membership['id']
}

// XXX
type Agent = {
  name: string
  imageUrl: string | undefined
  isEnabled: boolean
  isProducer: boolean
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

type Props = {
  threadId: string
}

function ThreadEditForm({ threadId }: Props) {
  const classes = useClasses()
  const { currentUserId } = useAuth()

  const { data: threads } = useLiveQuery(
    (query) => (
      query
        .from({ thread: threadCollection })
        .where(({ thread }) => eq(thread.id, threadId))
    ),
    [threadId]
  )
  const thread = threads[0]!

  const [threadName, setThreadName] = useState(thread.name)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [userToRemove, setUserToRemove] = useState<UserResult | null>(null)
  const [inviteCopied, setInviteCopied] = useState(false)
  const [threadNameSaved, setThreadNameSaved] = useState(false)

  const { data: users } = useLiveQuery(
    (query) => (
      query
        .from({ user: userCollection })
        .innerJoin(
          { membership: membershipCollection },
          ({ user, membership }) => eq(user.id, membership.user_id)
        )
        .orderBy(({ user }) => user.name, 'asc')
        .select(({ user, membership }) => ({
          id: user.id,
          name: user.name,
          membership_id: membership.id
        }))
        .where(({ membership }) => eq(membership.thread_id, threadId))
    ),
    [threadId]
  )

  const currentUser = users.find((user) => user.id === currentUserId)!
  const otherUsers = users.filter((user) => user.id !== currentUserId)
  const threadUsers = [currentUser, ...otherUsers]

  // XXX
  const [allAgents, setAllAgents] = useState<Agent[]>([
    {
      name: 'sarah',
      imageUrl: 'https://i.pravatar.cc/150?u=sarah',
      isEnabled: true,
      isProducer: true,
    },
    {
      name: 'frankie',
      imageUrl: 'https://i.pravatar.cc/150?u=frankie',
      isEnabled: false,
      isProducer: false,
    },
  ])

  const handleSaveThreadName = (e: React.FormEvent) => {
    e.preventDefault()

    threadCollection.update(threadId, (draft) => {
      draft.name = threadName
    })

    setThreadNameSaved(true)
    setTimeout(() => setThreadNameSaved(false), 2000)
  }

  const handleRemoveUser = (user: UserResult) => {
    setUserToRemove(user)
    setShowRemoveModal(true)
  }

  const confirmRemoveUser = () => {
    if (userToRemove) {
      membershipCollection.delete(userToRemove.membership_id)
    }

    setShowRemoveModal(false)
    setUserToRemove(null)
  }

  const cancelRemoveUser = () => {
    setShowRemoveModal(false)
    setUserToRemove(null)
  }

  const handleAgentToggle = (agentName: string, isEnabled: boolean) => {
    setAllAgents((prev) =>
      prev.map((agent) =>
        agent.name === agentName ? { ...agent, isEnabled } : agent
      )
    )

    // XXX
    console.log('Actually toggle agent:', agentName, isEnabled)
  }

  const handleAgentRowClick = (agent: Agent) => {
    if (!agent.isProducer) {
      handleAgentToggle(agent.name, !agent.isEnabled)
    }
  }

  const handleUserRowClick = (user: UserResult) => {
    if (user.id !== currentUserId) {
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
        {/* Edit thread name */}
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
                  size="2"
                  onChange={(e) => setThreadName(e.target.value)}
                />
              </Box>
              <Button type="submit" size="2" color="iris" variant="soft">
                {threadNameSaved ? 'Saved!' : 'Save'}
              </Button>
            </Flex>
          </form>
        </Box>
        {/* Manage users */}
        <Box mb="5">
          <Box mb="2">
            <Text size="3" weight="medium">
              Users
            </Text>
          </Box>
          <Flex direction="column">
            {threadUsers.map((user, index) => (
              <Flex
                align="center"
                justify="between"
                pb="1"
                className={mergeClasses(
                  classes.listItem,
                  index !== 0 && classes.clickableRow
                )}
                key={user.name}
                onClick={() => handleUserRowClick(user)}
              >
                <Flex align="center" gap="2">
                  <UserAvatar username={user.name} size="medium" />
                  <Text size="2">{user.name}</Text>
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
          <Box mt="1">
            <Box mb="1">
              <Text as="label" size="2" weight="medium">
                Invite
              </Text>
            </Box>
            <Flex gap="3" align="end">
              <Box flexGrow="1">
                <TextField.Root
                  size="2"
                  value={getJoinUrl(threadId)}
                  readOnly
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
        {/* Manage agents */}
        <Box>
          <Box mb="2">
            <Text size="3" weight="medium">
              Agents
            </Text>
          </Box>
          <Flex direction="column">
            {allAgents.map((agent) => (
              <Flex
                align="center"
                justify="between"
                pb="1"
                key={agent.name}
                className={mergeClasses(
                  classes.listItem,
                  !agent.isProducer && classes.clickableRow
                )}
                onClick={() => handleAgentRowClick(agent)}
              >
                <Flex align="center" gap="2">
                  <UserAvatar
                    username={agent.name}
                    imageUrl={agent.imageUrl}
                    size="medium"
                  />
                  <Text size="2">{agent.name}</Text>
                  {agent.isProducer && (
                    <Text size="1" color="gray">
                      (producer)
                    </Text>
                  )}
                </Flex>
                <Checkbox
                  checked={agent.isEnabled}
                  disabled={agent.isProducer}
                  onCheckedChange={(checked) =>
                    handleAgentToggle(agent.name, checked === true)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              </Flex>
            ))}
          </Flex>
        </Box>
      </Box>
      <ThreadRemoveUserModal
        isOpen={showRemoveModal}
        userName={userToRemove?.name || ''}
        onConfirm={confirmRemoveUser}
        onCancel={cancelRemoveUser}
      />
    </>
  )
}

export default ThreadEditForm
