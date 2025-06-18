import { Flex, IconButton, Tooltip, Text } from '@radix-ui/themes'
import { Edit, Plus } from 'lucide-react'
import { makeStyles, mergeClasses } from '@griffel/react'
import UserAvatar from './UserAvatar'

interface UserTopBarProps {
  users: string[]
  agents?: string[]
}

const useClasses = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-4) var(--space-4)',
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--color-background)',
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 'var(--space-5)',
  },
  usersList: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    marginRight: 'var(--space-2)',
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
  },
  clickable: {
    cursor: 'pointer',
  },
})

export default function UserTopBar({ users, agents = [] }: UserTopBarProps) {
  const classes = useClasses()

  return (
    <Flex className={classes.container}>
      <Flex>
        <Flex className={classes.section}>
          <Text size="2" weight="medium" className={classes.label}>
            Users
          </Text>
          <Flex className={classes.usersList}>
            {users.map((username, index) => (
              <UserAvatar
                key={username}
                username={username}
                size="medium"
                index={index}
              />
            ))}
            <Tooltip content="Invite user">
              <div className={mergeClasses(classes.inviteButton, 'clickable')}>
                <Plus size={16} />
              </div>
            </Tooltip>
          </Flex>
        </Flex>

        {agents.length > 0 && (
          <Flex className={classes.section}>
            <Text size="2" weight="medium" className={classes.label}>
              Agents
            </Text>
            <Flex className={classes.usersList}>
              {agents.map((agentName, index) => (
                <UserAvatar
                  key={agentName}
                  username={agentName}
                  size="medium"
                  index={index}
                />
              ))}
            </Flex>
          </Flex>
        )}
      </Flex>

      <IconButton variant="ghost" size="1" className="clickable">
        <Edit size={16} />
      </IconButton>
    </Flex>
  )
}
