import { useLiveQuery } from '@tanstack/react-db'
import { Box } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'
import { extractSearchableText } from '../../utils/extract'
import { eventCollection, userCollection } from '../../db/collections'
import EventItem from './EventItem'
import type { EventResult } from '../../types'

const useStyles = makeStyles({
  eventsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
    paddingTop: 'var(--space-1)',
    paddingBottom: 'var(--space-1)',
  },
})

function matchesFilter(event: EventResult, text: string): boolean {
  const { data, type, user_name } = event

  if (user_name.toLowerCase().includes(text)) {
    return true
  }

  const type_str =
    type === 'system'
      ? 'system action'
      : type === 'text'
        ? 'text message'
        : type.replace('_', ' ')

  if (type_str.includes(text)) {
    return true
  }

  return extractSearchableText(data).toLowerCase().includes(text)
}

type Props = {
  threadId: string
  filter: string
}

function EventsList({ threadId, filter }: Props) {
  const classes = useStyles()
  const filterText = filter.trim().toLowerCase()

  // First filter the events by threadId, joining to
  // users to get the user name.
  // XXX N.b.: refactor to skip materialization.
  const { collection: eventResults } = useLiveQuery(
    (query) =>
      query
        .from({ e: eventCollection })
        .join({
          type: 'inner',
          from: { u: userCollection },
          on: [`@u.id`, `=`, `@e.user_id`],
        })
        .where('@e.thread_id', '=', threadId)
        .select(
          '@e.data',
          '@e.id',
          '@e.inserted_at',
          '@e.type',
          { user_id: '@u.id' },
          { user_name: '@u.name' },
          { user_type: '@u.type' }
        ),
    [threadId]
  )

  // Then filter by the typeahead filter text, if provided.
  // Defining this as a seperate live query minimises the
  // pipeline re-establishment cost when the text changes.

  const { data: events } = useLiveQuery(
    (query) => {
      const baseQuery = query
        .from({ e: eventResults })
        .select('@*')
        .orderBy({ '@e.inserted_at': 'asc' })

      return filterText
        ? baseQuery.where(({ e }) => matchesFilter(e, filterText))
        : baseQuery
    },
    [filterText]
  )

  return (
    <Box className={classes.eventsList}>
      {events.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </Box>
  )
}

export default EventsList
