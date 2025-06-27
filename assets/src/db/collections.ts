import { createCollection } from '@tanstack/db'
import {
  electricCollectionOptions,
  queryCollectionOptions,
} from '@tanstack/db-collections'
import { QueryClient } from '@tanstack/query-core'

import type { Value } from '@electric-sql/client'
import type {
  InsertMutationFn,
  UpdateMutationFn,
  DeleteMutationFn,
} from '@tanstack/db'
import type {
  ElectricCollectionUtils,
  QueryCollectionUtils,
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

import type { Auth, Event, Fact, Membership, Thread, User } from './schema'

import * as auth from './auth'

type CollectionKey = string | number

const relativeUrl = (path: string) => `${window.location.origin}${path}`

const headers = {
  Authorization: async () => {
    const user = auth.get()
    const username = user ? user.name : null

    return `Bearer ${username}`
  },
}

const parser = {
  timestamp: (date: string) => new Date(date) as unknown as Value,
}

const localQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: false,
    },
  },
})

// const config: QueryCollectionConfig<TestItem> = {
//       id: `test`,
//       queryClient,
//       queryKey,
//       queryFn,
//       getKey,
//     }

//     const options = queryCollectionOptions(config)
//     const collection = createCollection(options)

export const authCollection = createCollection<
  Auth,
  CollectionKey,
  QueryCollectionUtils
>(
  queryCollectionOptions({
    queryClient: localQueryClient,
    queryKey: ['auth'],
    queryFn: async () => auth.all(),
    getKey: (item: Auth) => item.id,
    schema: authSchema,
  })
)

function operationHandlers<Type extends object>() {
  return {
    onInsert: ingestMutations as InsertMutationFn<Type>,
    onUpdate: ingestMutations as UpdateMutationFn<Type>,
    onDelete: ingestMutations as DeleteMutationFn<Type>,
  }
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
