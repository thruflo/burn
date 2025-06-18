import { createFileRoute } from '@tanstack/react-router'
import ScreenWithHeader from '../components/ScreenWithHeader'
import { Flex } from '@radix-ui/themes'
import { IssueLine } from '../components/IssueLine'
import { useState } from 'react'
import {
  SortMenu,
  type SortField,
  type SortDirection,
} from '../components/SortMenu'
import { FilterMenu } from '../components/FilterMenu'
import type { Priority, Status } from '../types'

export const Route = createFileRoute(`/`)({
  component: Index,
})

function Index() {
  const [sortField, setSortField] = useState<SortField>('created')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [priority, setPriority] = useState<Priority[]>([])
  const [status, setStatus] = useState<Status[]>([])

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  return (
    <ScreenWithHeader
      title="My Project / All Issues"
      toolbarItems={
        <>
          <FilterMenu
            priority={priority}
            status={status}
            onPriorityChange={setPriority}
            onStatusChange={setStatus}
            iconButtonProps={{ ml: '3' }}
          />
          <SortMenu
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            iconButtonProps={{ ml: '3' }}
          />
        </>
      }
    >
      <IssueList />
    </ScreenWithHeader>
  )
}

function IssueList() {
  return (
    <Flex direction="column">
      <IssueLine />
      <IssueLine />
      <IssueLine />
    </Flex>
  )
}
