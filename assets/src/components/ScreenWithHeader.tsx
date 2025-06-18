import { Box, Flex, Text, IconButton, ScrollArea } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'
import { useSidebar } from './SidebarProvider'
import { Menu, Cpu } from 'lucide-react'
import UserTopBar from './UserTopBar'

const useClasses = makeStyles({
  scrollArea: {
    height: `100%`,
    width: `100%`,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid var(--border-color)',
    flexShrink: 0,
    height: '56px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  leftSidebarToggle: {
    display: 'inline-flex' /* Make sure it's visible by default */,
    '@media (min-width: 970px)': {
      display: 'none',
    },
  },
  rightSidebarToggle: {
    display: 'inline-flex' /* Make sure it's visible by default */,
    '@media (min-width: 700px)': {
      display: 'none',
    },
  },
})

export default function ScreenWithHeader({
  title,
  children,
  toolbarItems,
}: {
  title: string | React.ReactNode
  children: React.ReactNode
  toolbarItems?: React.ReactNode
}) {
  const { toggleLeftSidebar, toggleRightSidebar } = useSidebar()
  const classes = useClasses()
  return (
    <Flex direction="column" width="100%" height="100%">
      {/* Header with menu button */}
      <Box className={classes.header}>
        <Flex align="center" gap="2" width="100%">
          <IconButton
            variant="ghost"
            size="1"
            onClick={toggleLeftSidebar}
            className={classes.leftSidebarToggle}
          >
            <Menu size={18} />
          </IconButton>
          {typeof title === 'string' ? (
            <Text size="1" weight="medium">
              {title}
            </Text>
          ) : (
            title
          )}
          <Flex ml="auto" align="center">
            {toolbarItems}
            <IconButton
              variant="ghost"
              size="1"
              onClick={toggleRightSidebar}
              ml="3"
              className={classes.rightSidebarToggle}
            >
              <Cpu size={18} />
            </IconButton>
          </Flex>
        </Flex>
      </Box>
      <ScrollArea className={classes.scrollArea}>{children}</ScrollArea>
    </Flex>
  )
}
