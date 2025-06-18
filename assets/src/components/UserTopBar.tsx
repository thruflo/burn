import { Flex, IconButton, Tooltip } from '@radix-ui/themes'
import { Edit, Plus } from 'lucide-react'
import { makeStyles, mergeClasses } from '@griffel/react'
import UserAvatar from './UserAvatar'

interface UserTopBarProps {
  users: string[]
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
  usersList: {
    display: 'flex',
    alignItems: 'center',
  },
  inviteButton: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--gray-4)',
    color: 'var(--gray-11)',
    cursor: 'pointer',
    marginLeft: '4px',
  },
  clickable: {
    cursor: 'pointer',
  },
})

export default function UserTopBar({ users }: UserTopBarProps) {
  const classes = useClasses()

  return (
    <Flex className={classes.container}>
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
      <IconButton variant="ghost" size="1" className="clickable">
        <Edit size={16} />
      </IconButton>
    </Flex>
  )
}
