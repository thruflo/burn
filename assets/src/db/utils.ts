import type { UtilsRecord } from '@tanstack/db'

/**
 * Type for the refetch utility function
 */
export type RefetchFn = () => Promise<void>

/**
 * Query collection utilities type
 */
export interface QueryCollectionUtils extends UtilsRecord {
  refetch: RefetchFn
}
