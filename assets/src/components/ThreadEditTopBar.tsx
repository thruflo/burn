import { Flex, IconButton, Text } from '@radix-ui/themes'
import { X } from 'lucide-react'
import { makeStyles, mergeClasses } from '@griffel/react'

interface ThreadEditTopBarProps {
  onClose: () => void
}

const useClasses = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding:
      'calc((var(--space-4) + var(--space-5)) / 2) var(--space-4) var(--space-4) var(--space-4)',
    backgroundColor: 'var(--color-background)',
    // Note: No bottom border unlike UserTopBar
  },
  title: {
    fontWeight: '500',
  },
  closeButton: {
    flexShrink: 0,
  },
  clickable: {
    cursor: 'pointer',
  },
})

export default function ThreadEditTopBar({ onClose }: ThreadEditTopBarProps) {
  const classes = useClasses()

  return (
    <Flex className={classes.container}>
      <Text size="3" className={classes.title}>
        Editing
      </Text>

      <IconButton
        variant="ghost"
        size="1"
        className={mergeClasses('clickable', classes.closeButton)}
        onClick={onClose}
      >
        <X size={16} />
      </IconButton>
    </Flex>
  )
}
