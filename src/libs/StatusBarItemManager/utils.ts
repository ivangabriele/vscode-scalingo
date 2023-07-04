import { StatusBarItemState } from './constants'
import { ScalingoApi } from '../../types'
import { InternalError } from '../InternalError'

export function mapScalingoApiReleaseStatusToStatusBarItemState(status: ScalingoApi.ReleaseStatus): StatusBarItemState {
  switch (status) {
    case ScalingoApi.ReleaseStatus.FAILED:
      return StatusBarItemState.RELEASE_FAILED

    case ScalingoApi.ReleaseStatus.PENDING:
      return StatusBarItemState.RELEASE_PENDING

    case ScalingoApi.ReleaseStatus.SUCCEEDED:
      return StatusBarItemState.RELEASE_SUCCEEDED

    default:
      throw new InternalError(`Unknown \`status\`: "${status}".`)
  }
}
