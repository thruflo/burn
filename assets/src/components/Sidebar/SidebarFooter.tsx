import { makeStyles } from '@griffel/react'
import {
  Box,
  Flex,
  Text,
  IconButton,
  Tooltip,
} from '@radix-ui/themes'
import { LogOut, Moon, Sun, Monitor } from 'lucide-react'
import { clearCurrentUser, useAuth } from '../../hooks/useAuth'
import { useTheme } from '../ThemeProvider'
import UserAvatar from '../UserAvatar'

const useClasses = makeStyles({
  footer: {
    marginTop: `auto`,
    borderTop: `1px solid var(--gray-5)`,
  },
})

function SidebarFooter() {
  const classes = useClasses()
  const { theme, setTheme } = useTheme()
  const { currentUser, isAuthenticated } = useAuth()
  const username = isAuthenticated ? currentUser!.name : ''

  const themeLabel =
    theme === `dark`
    ? `Light mode`
    : theme === `light`
      ? `System mode`
      : `Dark mode`

  const themeComponent =
    theme === `dark` ? (
      <Sun size={14} />
    ) : theme === `light` ? (
      <Monitor size={14} />
    ) : (
      <Moon size={14} />
    )

  const toggleTheme = () => {
    if (theme === `dark`) {
      return setTheme(`light`)
    }

    if (theme === `light`) {
      return setTheme(`system`)
    }

    return setTheme(`dark`)
  }

  return (
    <Box p="2" className={classes.footer}>
      <Flex align="center" justify="between" px="2">
        <Flex align="center" gap="2">
          <UserAvatar
              username={username}
              size="small"
              showTooltip={false}
          />
          <Text size="1">{username}</Text>
        </Flex>
        <Flex gap="3">
          <Tooltip content={themeLabel}>
            <IconButton size="1" variant="ghost" onClick={toggleTheme}>
              {themeComponent}
            </IconButton>
          </Tooltip>
          <Tooltip content="Log out">
            <IconButton size="1" variant="ghost" color="red" onClick={clearCurrentUser}>
              <LogOut size={14} />
            </IconButton>
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  )
}

export default SidebarFooter
