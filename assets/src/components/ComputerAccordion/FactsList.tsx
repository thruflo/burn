import { useLiveQuery } from '@tanstack/react-db'
import { Box } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'
import { factCollection, userCollection } from '../../db/collections'
import FactItem from './FactItem'
import type { FactResult } from './types'

function matchesFilter(fact: FactResult, text: string): boolean {
  const { subject, predicate, object } = fact

  return (
    subject.toLowerCase().includes(text) ||
    predicate.toLowerCase().includes(text) ||
    object.toLowerCase().includes(text)
  )
}

const useStyles = makeStyles({
  factsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
    paddingTop: 'var(--space-1)',
    paddingBottom: 'var(--space-1)',
  },
})

type Props = {
  threadId: string
  filter: string
}

function FactsList({ threadId, filter }: Props) {
  const classes = useStyles()
  const filterText = filter.trim().toLowerCase()

  // First filter the facts by threadId,
  // joining to users to get the subject name.

  // XXX n.b.: can refactor to skip materialization when that lands
  const { collection: factResults } = useLiveQuery(
    (query) =>
      query
        .from({ f: factCollection })
        .join({
          type: `inner`,
          from: { u: userCollection },
          on: [`@u.id`, `=`, `@f.subject_id`],
        })
        .where('@f.thread_id', '=', threadId)
        .select(
          '@f.id',
          { subject: '@u.name' },
          '@f.object',
          '@f.predicate',
          '@f.category',
          '@f.confidence',
          '@f.disputed',
          '@f.inserted_at'
        ),
    [threadId]
  )

  // Then filter by the typeahead filter text, if provided.
  // Defining this as a seperate live query minimises the
  // pipeline re-establishment cost when the text changes.

  const { data: facts } = useLiveQuery(
    (query) => {
      const baseQuery = query
        .from({ f: factResults })
        .orderBy({ '@f.inserted_at': 'asc' })

      return filterText
        ? baseQuery.where(({ f }) => matchesFilter(f, filterText))
        : baseQuery
    },
    [filterText]
  )

  return (
    <Box className={classes.factsList}>
      {facts.map((fact) => (
        <FactItem key={fact.id} fact={fact} />
      ))}
    </Box>
  )
}

export default FactsList
