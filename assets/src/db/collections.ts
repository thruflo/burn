import { createCollection } from '@tanstack/db'
import {
  electricCollectionOptions,
  localStorageCollectionOptions,
} from '@tanstack/db-collections'

import { ingestMutations } from './mutations'
import {
  authSchema,
  eventSchema,
  factSchema,
  membershipSchema,
  threadSchema,
  userSchema,
} from './schema'

import type {
  InsertMutationFn,
  UpdateMutationFn,
  DeleteMutationFn,
} from '@tanstack/db'
import type { ElectricCollectionUtils } from '@tanstack/db-collections'
import type { Value } from '@electric-sql/client'
import type { Auth, Event, Fact, Membership, Thread, User } from './schema'

type CollectionKey = string | number

export const authCollection = createCollection<Auth>(
  localStorageCollectionOptions({
    storageKey: 'auth',
    getKey: (item: Auth) => item.key,
    onInsert: async () => true,
    onUpdate: async () => true,
    onDelete: async () => true,
    schema: authSchema,
  })
)

const headers = {
  Authorization: async () => {
    const auth = authCollection.get('current')

    return auth ? `Bearer ${auth.user_id}` : 'Unauthenticated'
  },
}

const parser = {
  timestamp: (dateStr: string) => {
    // Timestamps sync in as naive datetime strings with no
    // timezone info because they're all implicitly UTC.
    const utcDateStr = dateStr.endsWith('Z') ? dateStr : `${dateStr}Z`
    const date: Date = new Date(utcDateStr)

    // Cast to `Value`` because we haven't fixed the typing yet
    // https://github.com/TanStack/db/pull/201
    return date as unknown as Value
  },
}

function operationHandlers<Type extends object>() {
  return {
    onInsert: ingestMutations as InsertMutationFn<Type>,
    onUpdate: ingestMutations as UpdateMutationFn<Type>,
    onDelete: ingestMutations as DeleteMutationFn<Type>,
  }
}

function relativeUrl(path: string) {
  return `${window.location.origin}${path}`
}

export const eventCollection = createCollection<
  Event,
  CollectionKey,
  ElectricCollectionUtils
>(
  electricCollectionOptions({
    id: `events`,
    shapeOptions: {
      url: relativeUrl('/sync/events'),
      headers,
      parser,
    },
    getKey: (item: Event) => item.id as string,
    schema: eventSchema,
    ...operationHandlers<Event>(),
  })
)

export const factCollection = createCollection<
  Fact,
  CollectionKey,
  ElectricCollectionUtils
>(
  electricCollectionOptions({
    id: `facts`,
    shapeOptions: {
      url: relativeUrl('/sync/facts'),
      headers,
      parser,
    },
    getKey: (item: Fact) => item.id as string,
    schema: factSchema,
    ...operationHandlers<Fact>(),
  })
)

export const membershipCollection = createCollection<
  Membership,
  CollectionKey,
  ElectricCollectionUtils
>(
  electricCollectionOptions({
    id: `memberships`,
    shapeOptions: {
      url: relativeUrl('/sync/memberships'),
      headers,
      parser,
    },
    getKey: (item: Membership) => item.id as string,
    schema: membershipSchema,
    ...operationHandlers<Membership>(),
  })
)

export const threadCollection = createCollection<
  Thread,
  CollectionKey,
  ElectricCollectionUtils
>(
  electricCollectionOptions({
    id: `threads`,
    shapeOptions: {
      url: relativeUrl('/sync/threads'),
      headers,
      parser,
    },
    getKey: (item: Thread) => item.id as string,
    schema: threadSchema,
    ...operationHandlers<Thread>(),
  })
)

export const userCollection = createCollection<
  User,
  CollectionKey,
  ElectricCollectionUtils
>(
  electricCollectionOptions({
    id: `users`,
    shapeOptions: {
      url: relativeUrl('/sync/users'),
      headers,
      parser,
    },
    getKey: (item: User) => item.id as string,
    schema: userSchema,
    ...operationHandlers<User>(),
  })
)

// @ts-ignore
window.authCollection = authCollection
// @ts-ignore
window.eventCollection = eventCollection
// @ts-ignore
window.factCollection = factCollection
// @ts-ignore
window.membershipCollection = membershipCollection
// @ts-ignore
window.threadCollection = threadCollection
// @ts-ignore
window.userCollection = userCollection
