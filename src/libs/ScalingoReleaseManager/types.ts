import type { ScalingoApi } from '../../types'

export interface ScalingoRelease {
  readonly apiData: ScalingoApi.Release
  readonly createdAt: Date
  readonly description: string
  readonly isCurrent: boolean
  readonly isSlugLess: boolean
  readonly status: ScalingoApi.ReleaseStatus
  readonly updatedAt: Date
  readonly version: number
}
