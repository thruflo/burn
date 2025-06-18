import { useState, useEffect } from 'react'
import {
  Box,
  Flex,
  Text,
  IconButton,
  ScrollArea,
  Tooltip,
} from '@radix-ui/themes'
import { makeStyles, mergeClasses } from '@griffel/react'
import { useSidebar } from './SidebarProvider'
import { Cpu } from 'lucide-react'

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
  icon: {
    marginRight: 'var(--space-2)',
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
  setRightSidebarOpen: (value: boolean) => void
}

function RightSidebarHeader({ setRightSidebarOpen }: HeaderProps) {
  const classes = useHeaderClasses()
  return (
    <Flex p="3" align="center" justify="between" className={classes.header}>
      <IconButton
        size="1"
        variant="ghost"
        className={mergeClasses(classes.closeButton, 'closeButton')}
        onClick={() => setRightSidebarOpen(false)}
      >
        ✕
      </IconButton>
      <Flex align="center" className={classes.title}>
        <span className={classes.icon}>
          <Cpu size={14} />
        </span>
        <Text size="2" weight="medium">
          Computer
        </Text>
      </Flex>
    </Flex>
  )
}

const useRightSidebarClasses = makeStyles({
  sidebar: {
    backgroundColor: 'var(--sidebar-bg) !important',
    borderLeft: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    zIndex: 100,
    '--sidebar-width': '280px',
    width: 'var(--sidebar-width)',
    '@media (max-width: 699px)': {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '280px !important',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out',
      height: '100dvh',
    },
    '@media (min-width: 700px)': {
      position: 'relative',
      transform: 'none',
    },
  },
  sidebarOpen: {
    '@media (max-width: 699px)': {
      transform: 'translateX(0)',
    },
  },
  scrollArea: {
    flexGrow: 1,
  },
})

const useRightSidebarOverlayClasses = makeStyles({
  overlay: {
    '@media (max-width: 699px)': {
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
    '@media (max-width: 699px)': {
      opacity: 1,
      pointerEvents: 'auto',
    },
  },
})

export default function RightSidebar() {
  const { isRightSidebarOpen, setRightSidebarOpen } = useSidebar()
  const classes = useRightSidebarClasses()
  const overlayClasses = useRightSidebarOverlayClasses()

  return (
    <>
      {/* Sidebar overlay */}
      <Box
        className={mergeClasses(
          overlayClasses.overlay,
          isRightSidebarOpen && overlayClasses.overlayOpen
        )}
        onClick={() => setRightSidebarOpen(false)}
      />

      {/* Right Sidebar */}
      <Box
        className={mergeClasses(
          classes.sidebar,
          isRightSidebarOpen && classes.sidebarOpen,
          'right-sidebar',
          isRightSidebarOpen && 'sidebarOpen'
        )}
      >
        {/* Header */}
        <RightSidebarHeader
          setRightSidebarOpen={setRightSidebarOpen}
        />

        {/* Content Area */}
        <ScrollArea className={classes.scrollArea}>
          <Flex direction="column" px="3" py="2">
            {/* Content will go here */}
          </Flex>
        </ScrollArea>
      </Box>
    </>
  )
}
