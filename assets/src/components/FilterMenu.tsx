import { IconButton, Flex, Tooltip, DropdownMenu, Text } from '@radix-ui/themes'
import { ComponentProps } from 'react'
import { Filter } from 'lucide-react'
import { Priority, priorityDisplay, Status, statusDisplay } from '../types'
import { PriorityIcon } from './Priority'
import { StatusIcon } from './Status'

interface FilterMenuProps {
  priority: Priority[]
  status: Status[]
  onPriorityChange: (keys: Priority[]) => void
  onStatusChange: (keys: Status[]) => void
  iconButtonProps?: ComponentProps<typeof IconButton>
}

export function FilterMenu({
  priority,
  status,
  onPriorityChange,
  onStatusChange,
  iconButtonProps,
}: FilterMenuProps) {
  const togglePriority = (key: Priority) => {
    if (priority.includes(key)) {
      onPriorityChange(priority.filter((k) => k !== key))
    } else {
      onPriorityChange([...priority, key])
    }
  }
  const toggleStatus = (key: Status) => {
    if (status.includes(key)) {
      onStatusChange(status.filter((k) => k !== key))
    } else {
      onStatusChange([...status, key])
    }
  }
  return (
    <DropdownMenu.Root>
      <Tooltip content="Filter">
        <DropdownMenu.Trigger>
          <IconButton variant="ghost" size="1" {...iconButtonProps}>
            <Filter size={16} />
          </IconButton>
        </DropdownMenu.Trigger>
      </Tooltip>
      <DropdownMenu.Content style={{ minWidth: 220 }}>
        <DropdownMenu.Label>
          <Text size="1" color="gray">
            Priority
          </Text>
        </DropdownMenu.Label>
        {Object.entries(priorityDisplay).map(([key, label]) => (
          <DropdownMenu.Item
            key={key}
            onClick={() => togglePriority(key as Priority)}
          >
            <Flex align="center" gap="2" width="100%">
              <PriorityIcon priority={key as Priority} size={14} />
              <Text>{label}</Text>
              <Flex ml="auto" align="center">
                {priority.includes(key as Priority) && (
                  <Text color="blue">
                    <b>✓</b>
                  </Text>
                )}
              </Flex>
            </Flex>
          </DropdownMenu.Item>
        ))}
        <DropdownMenu.Separator />
        <DropdownMenu.Label>
          <Text size="1" color="gray">
            Status
          </Text>
        </DropdownMenu.Label>
        {Object.entries(statusDisplay).map(([key, label]) => (
          <DropdownMenu.Item
            key={key}
            onClick={() => toggleStatus(key as Status)}
          >
            <Flex align="center" gap="2" width="100%">
              <StatusIcon status={key as Status} size={14} />
              <Text>{label}</Text>
              <Flex ml="auto" align="center">
                {status.includes(key as Status) && (
                  <Text color="blue">
                    <b>✓</b>
                  </Text>
                )}
              </Flex>
            </Flex>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
