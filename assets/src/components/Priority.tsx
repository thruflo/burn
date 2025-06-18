import {
  Ellipsis,
  ShieldAlert,
  SignalLow,
  SignalMedium,
  SignalHigh,
} from 'lucide-react'
import { Priority, priorityDisplay } from '../types'
import { Tooltip, Text, Select, Flex } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'

interface PriorityIconProps {
  priority: Priority
  size?: number
}

export function PriorityIcon({ priority, size = 14 }: PriorityIconProps) {
  const color = 'var(--gray-11)'
  switch (priority) {
    case 'none':
      return <Ellipsis size={size} color={color} />
    case 'low':
      return <SignalLow size={size} color={color} />
    case 'medium':
      return <SignalMedium size={size} color={color} />
    case 'high':
      return <SignalHigh size={size} color={color} />
    case 'urgent':
      return <ShieldAlert size={size} color={color} />
    default:
      return null
  }
}

interface PriorityLabelProps {
  priority: Priority
  size?: number
}

export function PriorityLabel({ priority, size = 14 }: PriorityLabelProps) {
  return (
    <Tooltip content={priorityDisplay[priority]}>
      <PriorityIcon priority={priority} size={size} />
    </Tooltip>
  )
}

const priorityClasses = makeStyles({
  trigger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    marginLeft: '0',
    '& span': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '& > svg': {
      display: 'none',
    },
  },
})

interface PriorityPickerProps {
  priority: Priority
  setPriority: (priority: Priority) => void
  mr?: string
  ml?: string
}

export function PriorityPicker({
  priority,
  setPriority,
  mr,
  ml,
}: PriorityPickerProps) {
  const classes = priorityClasses()
  return (
    <>
      <Select.Root
        value={priority}
        size="2"
        onValueChange={(value) => setPriority(value as Priority)}
      >
        <Select.Trigger
          variant="ghost"
          mr={mr}
          ml={ml}
          className={classes.trigger}
        >
          <PriorityIcon priority={priority} size={14} />
        </Select.Trigger>
        <Select.Content>
          {Object.entries(priorityDisplay).map(([priority, label]) => (
            <Select.Item key={priority} value={priority}>
              <Flex align="center" gap="2">
                <PriorityLabel priority={priority as Priority} size={14} />
                <Text size="1">{label}</Text>
              </Flex>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </>
  )
}

const selectClasses = makeStyles({
  selectTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
})

interface PrioritySelectProps {
  priority: Priority
  setPriority: (priority: Priority) => void
  mr?: string
  ml?: string
}

export function PrioritySelect({
  priority,
  setPriority,
  mr,
  ml,
}: PrioritySelectProps) {
  const classes = selectClasses()
  return (
    <Select.Root
      value={priority}
      size="1"
      onValueChange={(value) => setPriority(value as Priority)}
    >
      <Select.Trigger mr={mr} ml={ml} className={classes.selectTrigger}>
        <Flex align="center" gap="2">
          <PriorityIcon priority={priority} size={14} />
          <Text size="1">{priorityDisplay[priority]}</Text>
        </Flex>
      </Select.Trigger>
      <Select.Content>
        {Object.entries(priorityDisplay).map(([priority, label]) => (
          <Select.Item key={priority} value={priority}>
            <Flex align="center" gap="2">
              <PriorityIcon priority={priority as Priority} size={14} />
              <Text size="1">{label}</Text>
            </Flex>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}
