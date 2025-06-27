import * as api from '../api'

import type {
  Collection,
  MutationFn,
  PendingMutation,
  Transaction,
  UtilsRecord,
} from '@tanstack/db'

import type {
  ElectricCollectionUtils,
  QueryCollectionUtils,
} from '@tanstack/db-collections'

const ONE_HOUR = 60 * 60 * 1_000

function isElectricUtils(utils: UtilsRecord): utils is ElectricCollectionUtils {
  return 'awaitTxId' in utils && typeof (utils as any).awaitTxId === 'function'
}

function isQueryUtils(utils: UtilsRecord): utils is QueryCollectionUtils {
  return 'refetch' in utils && typeof (utils as any).refetch === 'function'
}

function buildPayload(tx: Transaction) {
  const mutations = tx.mutations.map((mutation: PendingMutation) => {
    const { collection: _, ...rest } = mutation

    return rest
  })

  return { mutations }
}

async function hasSyncedBack(
  tx: Transaction,
  txid: string,
  timeout: number = ONE_HOUR
) {
  const collections = new Set<Collection>(
    tx.mutations.map((mutation) => mutation.collection).filter(Boolean)
  )

  const promises = [...collections].map((collection) => {
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
  const payload = buildPayload(transaction)
  console.log('ingest', payload.mutations)

  const txid = await api.ingest(payload)

  if (txid === undefined) {
    return
  }

  await hasSyncedBack(transaction, txid)
}
