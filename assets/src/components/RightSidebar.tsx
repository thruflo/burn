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
import { useResponsive } from '../hooks/useResponsive'

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
  isMobile: boolean
  setRightSidebarOpen: (value: boolean) => void
}

function RightSidebarHeader({ isMobile, setRightSidebarOpen }: HeaderProps) {
  const classes = useHeaderClasses()
  return (
    <Flex p="3" align="center" justify="between" className={classes.header}>
      {isMobile && (
        <IconButton
          size="1"
          variant="ghost"
          className={classes.closeButton}
          onClick={() => setRightSidebarOpen(false)}
        >
          ✕
        </IconButton>
      )}
      <Text size="3" weight="bold" className={classes.title}>
        Computer
      </Text>
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
    '@media (max-width: 1024px)': {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '280px !important',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out',
      height: '100dvh',
    },
    '@media (min-width: 1025px)': {
      position: 'relative',
      transform: 'none',
    },
  },
  sidebarOpen: {
    '@media (max-width: 1024px)': {
      transform: 'translateX(0)',
    },
  },
  scrollArea: {
    flexGrow: 1,
  },
})

const useRightSidebarOverlayClasses = makeStyles({
  overlay: {
    '@media (max-width: 768px)': {
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
    '@media (max-width: 768px)': {
      opacity: 1,
      pointerEvents: 'auto',
    },
  },
})

export default function RightSidebar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const { isRightSidebarOpen, setRightSidebarOpen } = useSidebar()
  const classes = useRightSidebarClasses()
  const overlayClasses = useRightSidebarOverlayClasses()

  // Set up window resize handler
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setRightSidebarOpen(false)
      }
    }

    handleResize() // Call immediately
    window.addEventListener(`resize`, handleResize)
    return () => window.removeEventListener(`resize`, handleResize)
  }, [setRightSidebarOpen])

  return (
    <>
      {/* Sidebar overlay (mobile only) */}
      {isMobile && (
        <Box
          className={mergeClasses(
            overlayClasses.overlay,
            isRightSidebarOpen && overlayClasses.overlayOpen
          )}
          onClick={() => setRightSidebarOpen(false)}
        />
      )}

      {/* Right Sidebar */}
      <Box
        className={mergeClasses(
          classes.sidebar,
          isRightSidebarOpen && classes.sidebarOpen
        )}
      >
        {/* Header */}
        <RightSidebarHeader
          isMobile={isMobile}
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
