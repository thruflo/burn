import type { Event, Fact, User } from '../../db/schema'

export type EventResult = Pick<
  Event,
  'id' | 'assistant' | 'data' | 'role' | 'type' | 'inserted_at'
> & {
  user_name: User['name'] | null
}

export type FactResult = Pick<
  Fact,
  | 'id'
  | 'predicate'
  | 'object'
  | 'category'
  | 'confidence'
  | 'disputed'
  | 'inserted_at'
> & {
  subject: User['name']
}
