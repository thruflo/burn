import {
  Circle,
  CircleDashed,
  CircleGauge,
  CircleCheck,
  CircleX,
} from 'lucide-react'
import { Status, statusDisplay } from '../types'
import { Tooltip, Select, Flex, Text } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'

type StatusIconProps = {
  status: Status
  size?: number
}

export function StatusIcon({ status, size = 14 }: StatusIconProps) {
  switch (status) {
    case 'backlog':
      return <CircleDashed size={size} color="var(--gray-8)" />
    case 'todo':
      return <Circle size={size} color="var(--gray-11)" />
    case 'in-progress':
      return <CircleGauge size={size} color="var(--amber-11)" />
    case 'done':
      return <CircleCheck size={size} color="var(--green-11)" />
    case 'cancelled':
      return <CircleX size={size} color="var(--red-11)" />
    default:
      return null
  }
}

type StatusLabelProps = {
  status: Status
  size?: number
}

export function StatusLabel({ status, size = 14 }: StatusLabelProps) {
  return (
    <Tooltip content={statusDisplay[status]}>
      <StatusIcon status={status} size={size} />
    </Tooltip>
  )
}

const statusClasses = makeStyles({
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

interface StatusPickerProps {
  status: Status
  setStatus: (status: Status) => void
  mr?: string
  ml?: string
}

export function StatusPicker({ status, setStatus, mr, ml }: StatusPickerProps) {
  const classes = statusClasses()
  return (
    <>
      <Select.Root
        value={status}
        size="2"
        onValueChange={(value) => setStatus(value as Status)}
      >
        <Select.Trigger
          variant="ghost"
          mr={mr}
          ml={ml}
          className={classes.trigger}
        >
          <StatusIcon status={status} size={14} />
        </Select.Trigger>
        <Select.Content>
          {Object.entries(statusDisplay).map(([status, label]) => (
            <Select.Item key={status} value={status}>
              <Flex align="center" gap="2">
                <StatusLabel status={status as Status} size={14} />
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

interface StatusSelectProps {
  status: Status
  setStatus: (status: Status) => void
  mr?: string
  ml?: string
}

export function StatusSelect({ status, setStatus, mr, ml }: StatusSelectProps) {
  const classes = selectClasses()
  return (
    <Select.Root
      value={status}
      size="1"
      onValueChange={(value) => setStatus(value as Status)}
    >
      <Select.Trigger mr={mr} ml={ml} className={classes.selectTrigger}>
        <Flex align="center" gap="2">
          <StatusIcon status={status} size={14} />
          <Text size="1">{statusDisplay[status]}</Text>
        </Flex>
      </Select.Trigger>
      <Select.Content>
        {Object.entries(statusDisplay).map(([status, label]) => (
          <Select.Item key={status} value={status}>
            <Flex align="center" gap="2">
              <StatusIcon status={status as Status} size={14} />
              <Text size="1">{label}</Text>
            </Flex>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}
