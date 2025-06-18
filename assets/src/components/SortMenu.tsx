import { IconButton, Flex, Tooltip, DropdownMenu, Text } from '@radix-ui/themes'
import { ArrowUpWideNarrow, ArrowUp, ArrowDown } from 'lucide-react'
import { ComponentProps } from 'react'

export type SortField = 'created' | 'updated' | 'priority' | 'status'
export type SortDirection = 'asc' | 'desc'

interface SortMenuProps {
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
  iconButtonProps?: ComponentProps<typeof IconButton>
}

export function SortMenu({
  sortField,
  sortDirection,
  onSort,
  iconButtonProps,
}: SortMenuProps) {
  return (
    <DropdownMenu.Root>
      <Tooltip content="Sort">
        <DropdownMenu.Trigger>
          <IconButton variant="ghost" size="1" {...iconButtonProps}>
            <ArrowUpWideNarrow size={16} />
          </IconButton>
        </DropdownMenu.Trigger>
      </Tooltip>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={() => onSort('created')}>
          <Flex align="center" gap="2" width="100%">
            <Flex align="center" justify="center" width="14px">
              {sortField === 'created' &&
                (sortDirection === 'asc' ? (
                  <ArrowUp size={14} />
                ) : (
                  <ArrowDown size={14} />
                ))}
            </Flex>
            <Text>Created</Text>
          </Flex>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => onSort('updated')}>
          <Flex align="center" gap="2" width="100%">
            <Flex align="center" justify="center" width="14px">
              {sortField === 'updated' &&
                (sortDirection === 'asc' ? (
                  <ArrowUp size={14} />
                ) : (
                  <ArrowDown size={14} />
                ))}
            </Flex>
            <Text>Updated</Text>
          </Flex>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => onSort('priority')}>
          <Flex align="center" gap="2" width="100%">
            <Flex align="center" justify="center" width="14px">
              {sortField === 'priority' &&
                (sortDirection === 'asc' ? (
                  <ArrowUp size={14} />
                ) : (
                  <ArrowDown size={14} />
                ))}
            </Flex>
            <Text>Priority</Text>
          </Flex>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => onSort('status')}>
          <Flex align="center" gap="2" width="100%">
            <Flex align="center" justify="center" width="14px">
              {sortField === 'status' &&
                (sortDirection === 'asc' ? (
                  <ArrowUp size={14} />
                ) : (
                  <ArrowDown size={14} />
                ))}
            </Flex>
            <Text>Status</Text>
          </Flex>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
