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
  const { assistant, data, type, user_name } = event

  if (assistant ? assistant.toLowerCase().includes(text) : false) {
    return true
  }

  if (type.toLowerCase().includes(text)) {
    return true
  }

  if (user_name ? user_name.toLowerCase().includes(text) : false) {
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

  // First filter the events by threadId,
  // joining to users to get the user name.

  // XXX n.b.: can refactor to skip materialization when that lands
  const { collection: eventResults } = useLiveQuery(
    (query) =>
      query
        .from({ e: eventCollection })
        .join({
          type: 'left', // a left outer join because `user_id` can be null
          from: { u: userCollection },
          on: [`@u.id`, `=`, `@e.user_id`],
        })
        .where('@e.thread_id', '=', threadId)
        .select(
          '@e.assistant',
          '@e.data',
          '@e.id',
          '@e.inserted_at',
          '@e.role',
          '@e.type',
          { user_name: '@u.name' }
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
