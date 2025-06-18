import { Box, Flex, Text, IconButton, ScrollArea } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'
import { useMobile } from '../hooks/useMobile'
import { useSidebar } from './SidebarProvider'
import { Menu } from 'lucide-react'

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
  const { isMobile } = useMobile()
  const { toggleSidebar } = useSidebar()
  const classes = useClasses()
  return (
    <Flex direction="column" width="100%" height="100%">
      {/* Header with menu button */}
      <Box className={classes.header}>
        <Flex align="center" gap="2" width="100%">
          {isMobile && (
            <IconButton variant="ghost" size="1" onClick={toggleSidebar}>
              <Menu size={18} />
            </IconButton>
          )}
          <Text size="1" weight="medium">
            {title}
          </Text>
          <Flex ml="auto" align="center">
            {toolbarItems}
          </Flex>
        </Flex>
      </Box>
      <ScrollArea className={classes.scrollArea}>{children}</ScrollArea>
    </Flex>
  )
}
