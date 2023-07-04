import type { ScalingoRelease } from './types'
import type { ScalingoApi } from '../../types'

export function mapScalingoApiReleaseToScalingoRelease(scalingoApiRelease: ScalingoApi.Release): ScalingoRelease {
  return Object.freeze({
    apiData: Object.freeze(scalingoApiRelease),
    createdAt: new Date(scalingoApiRelease.created_at),
    description: scalingoApiRelease.description,
    isCurrent: scalingoApiRelease.current,
    // eslint-disable-next-line no-null/no-null
    isSlugLess: scalingoApiRelease.slug === null,
    status: scalingoApiRelease.status,
    updatedAt: new Date(scalingoApiRelease.updated_at),
    version: scalingoApiRelease.version,
  })
}
