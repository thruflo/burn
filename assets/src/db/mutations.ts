import type {
  Collection,
  MutationFn,
  PendingMutation,
  Transaction,
  UtilsRecord
} from '@tanstack/db'

import type { ElectricCollectionUtils } from '@tanstack/db-collections'
import type { QueryCollectionUtils } from './utils'

const ONE_HOUR =
  60 *
  60 *
  1_000

function isElectricUtils(utils: UtilsRecord): utils is ElectricCollectionUtils {
  return 'awaitTxId' in utils && typeof (utils as any).awaitTxId === 'function'
}

function isQueryUtils(utils: UtilsRecord): utils is QueryCollectionUtils {
  return 'refetch' in utils && typeof (utils as any).refetch === 'function'
}

function buildPayload(tx: Transaction) {
  const mutations = tx.mutations.map(
    (mutation: PendingMutation) => {
      const { collection: _, ...rest } = mutation

      return rest
    }
  )

  return { mutations }
}

async function hasSyncedBack(tx: Transaction, txid: string, timeout: number = ONE_HOUR) {
  const collections = new Set<Collection>(
    tx.mutations
      .map(mutation => mutation.collection)
      .filter(Boolean)
  )

  const promises = [...collections].map(collection => {
    const utils = collection.utils

    if (isElectricUtils(utils)) {
      return utils.awaitTxId(txid, timeout)
    }

    if (isQueryUtils(utils)) {
      return utils.refetch()
    }

    throw new Error(`Unknown collection type`, { cause: { collection } })
  })

  await Promise.all(promises)
}

export const ingestMutations: MutationFn = async ({ transaction }) => {
  console.log('mutationFn', transaction)

  const payload = buildPayload(transaction)
  const response = await fetch('/ingest/mutations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`)
  }

  const { txid } = await response.json()
  await hasSyncedBack(transaction, txid)
}
