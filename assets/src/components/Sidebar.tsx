import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Box,
  Flex,
  Text,
  IconButton,
  ScrollArea,
  Tooltip,
  Button,
} from '@radix-ui/themes'
import { LogOut, Moon, Sun, Monitor, Plus, MessagesSquare } from 'lucide-react'
import { makeStyles, mergeClasses } from '@griffel/react'
import { useTheme } from './ThemeProvider'
import { useSidebar } from './SidebarProvider'
import UserAvatar from './UserAvatar'
import { useAuth } from '../hooks/useAuth'

const useHeaderClasses = makeStyles({
  header: {
    height: `56px`,
    borderBottom: `1px solid var(--gray-5)`,
    position: `relative`,
    flexShrink: 0,
  },
  title: {
    paddingLeft: `4px`,
  },
  closeButton: {
    position: `absolute`,
    right: `12px`,
    opacity: 0.8,
    height: `28px`,
    width: `28px`,
  },
})

// Header Component
type HeaderProps = {
  handleNewChat?: () => void
  setSidebarOpen: (value: boolean) => void
}

function SidebarHeader({ setSidebarOpen }: HeaderProps) {
  const classes = useHeaderClasses()
  return (
    <Flex p="3" align="center" justify="between" className={classes.header}>
      <Text size="3" weight="bold" className={classes.title}>
        🔥 Burn
      </Text>
      <IconButton
        size="1"
        variant="ghost"
        className={mergeClasses(classes.closeButton, 'closeButton')}
        onClick={() => setSidebarOpen(false)}
      >
        ✕
      </IconButton>
    </Flex>
  )
}

const useFooterClasses = makeStyles({
  footer: {
    marginTop: `auto`,
    borderTop: `1px solid var(--gray-5)`,
  },
})

// Footer Component
type FooterProps = {
  username: string
  theme: string | undefined
  setTheme: (theme: string) => void
  handleLogout: () => void
}

function SidebarFooter({
  username,
  theme,
  setTheme,
  handleLogout,
}: FooterProps) {
  const classes = useFooterClasses()
  return (
    <Box p="2" className={classes.footer}>
      <Flex align="center" justify="between" px="2">
        <Flex align="center" gap="2">
          <UserAvatar username={username} size="small" showTooltip={false} />
          <Text size="1">{username}</Text>
        </Flex>
        <Flex gap="3">
          <Tooltip
            content={
              theme === `dark`
                ? `Light mode`
                : theme === `light`
                  ? `System mode`
                  : `Dark mode`
            }
          >
            <IconButton
              size="1"
              variant="ghost"
              onClick={() => {
                if (theme === `dark`) setTheme(`light`)
                else if (theme === `light`) setTheme(`system`)
                else setTheme(`dark`)
              }}
            >
              {theme === `dark` ? (
                <Sun size={14} />
              ) : theme === `light` ? (
                <Monitor size={14} />
              ) : (
                <Moon size={14} />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip content="Log out">
            <IconButton
              size="1"
              variant="ghost"
              color="red"
              onClick={handleLogout}
            >
              <LogOut size={14} />
            </IconButton>
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  )
}

const useSidebarClasses = makeStyles({
  sidebar: {
    backgroundColor: 'var(--sidebar-bg) !important',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    zIndex: 100,
    '--sidebar-width': '280px',
    width: 'var(--sidebar-width)',
    '@media (max-width: 969px)': {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '280px !important',
      transform: 'translateX(-100%)',
      transition: 'transform 0.3s ease-in-out',
      height: '100dvh',
    },
    '@media (min-width: 970px)': {
      position: 'relative',
      transform: 'none',
    },
  },
  sidebarOpen: {
    '@media (max-width: 969px)': {
      transform: 'translateX(0)',
    },
  },
  scrollArea: {
    flexGrow: 1,
  },
})

const useSidebarOverlayClasses = makeStyles({
  overlay: {
    '@media (max-width: 969px)': {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 90,
      opacity: 0,
      pointerEvents: 'none',
      transition: 'opacity 0.3s ease-in-out',
    },
  },
  overlayOpen: {
    '@media (max-width: 969px)': {
      opacity: 1,
      pointerEvents: 'auto',
    },
  },
})

export default function Sidebar() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { username, signOut } = useAuth()
  const {
    isLeftSidebarOpen: isSidebarOpen,
    setLeftSidebarOpen: setSidebarOpen,
  } = useSidebar()
  const classes = useSidebarClasses()
  const overlayClasses = useSidebarOverlayClasses()

  const handleNewChat = () => {
    navigate({ to: `/` })
    setSidebarOpen(false)
  }

  return (
    <>
      {/* Sidebar overlay */}
      <Box
        className={mergeClasses(
          overlayClasses.overlay,
          isSidebarOpen && overlayClasses.overlayOpen
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <Box
        className={mergeClasses(
          classes.sidebar,
          isSidebarOpen && classes.sidebarOpen,
          'sidebar',
          isSidebarOpen && 'sidebarOpen'
        )}
      >
        {/* Header */}
        <SidebarHeader
          handleNewChat={handleNewChat}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Thread List */}
        <ScrollArea className={classes.scrollArea}>
          <Flex direction="column" px="3" py="2">
            <ThreadsSection />
          </Flex>
        </ScrollArea>

        {/* Footer */}
        <SidebarFooter
          username={username!}
          theme={theme}
          setTheme={setTheme}
          handleLogout={signOut}
        />
      </Box>
    </>
  )
}

const useThreadsSectionClasses = makeStyles({
  threadButton: {
    paddingLeft: '0px',
  },
  threadsContainer: {
    paddingLeft: 'var(--space-2)',
  },
})

function ThreadsSection() {
  const classes = useThreadsSectionClasses()
  const navigate = useNavigate()

  const handleNewThread = () => {
    navigate({ to: `/` })
  }

  return (
    <>
      <Button
        size="2"
        color="iris"
        variant="soft"
        my="2"
        onClick={handleNewThread}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Plus size={16} />
        New thread
      </Button>

      <Flex align="center" py="2" pl="1">
        <Text size="2" weight="medium">
          Threads
        </Text>
      </Flex>

      <Flex direction="column" className={classes.threadsContainer}>
        <SidebarButton
          label="This is a conversation"
          isActive={false}
          onClick={() => {}}
          icon={<MessagesSquare size={14} />}
          className={classes.threadButton}
        />
        <SidebarButton
          label="This is a conversation with a very long title"
          isActive={false}
          onClick={() => {}}
          icon={<MessagesSquare size={14} />}
          className={classes.threadButton}
        />
        <SidebarButton
          label="This is a conversation"
          isActive={false}
          onClick={() => {}}
          icon={<MessagesSquare size={14} />}
          className={classes.threadButton}
        />
      </Flex>
    </>
  )
}

const useSidebarButtonClasses = makeStyles({
  button: {
    justifyContent: 'flex-start',
    height: 'auto',
    padding: 'var(--space-2) 0',
    overflow: 'hidden',
    color: 'var(--black)',
  },
  buttonActive: {
    backgroundColor: 'var(--gray-5)',
  },
  buttonText: {
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: 'var(--gray-12)',
  },
  buttonIcon: {
    marginRight: 'var(--space-1)',
  },
})

type SidebarButtonProps = {
  label?: string
  isActive: boolean
  onClick: () => void
  icon?: React.ReactNode
  className?: string
  ml?: string
  mr?: string
}

function SidebarButton({
  label,
  isActive,
  onClick,
  icon,
  className,
  ml,
  mr,
}: SidebarButtonProps) {
  const classes = useSidebarButtonClasses()
  return (
    <Button
      variant="ghost"
      color="gray"
      size="1"
      my="1"
      mx="1"
      ml={ml}
      mr={mr}
      className={mergeClasses(
        classes.button,
        isActive && classes.buttonActive,
        className
      )}
      onClick={onClick}
    >
      {icon && <span className={classes.buttonIcon}>{icon}</span>}
      {label && (
        <Text size="1" className={classes.buttonText}>
          {label}
        </Text>
      )}
    </Button>
  )
}
