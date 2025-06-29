import { createTransaction as dbCreateTransaction } from '@tanstack/db'
import { ingestMutations } from './mutations'

export function createTransaction() {
  return dbCreateTransaction({ mutationFn: ingestMutations })
}
