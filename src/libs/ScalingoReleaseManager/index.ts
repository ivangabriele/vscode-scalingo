import { mapScalingoApiReleaseToScalingoRelease } from './utils'
import { InternalError } from '../InternalError'

import type { ScalingoRelease } from './types'
import type { ScalingoApi } from '../../types'

export class ScalingoReleaseManager {
  #lastRelease: ScalingoRelease | undefined
  #releases: ScalingoRelease[]

  get lastRelease(): ScalingoRelease | undefined {
    return this.#lastRelease
  }

  constructor(stdoutJson: string) {
    this.#releases = []

    this.updateReleases(stdoutJson)
  }

  updateReleases(stdoutJson: string): void {
    try {
      const scalingoApiReleases: ScalingoApi.Release[] = JSON.parse(stdoutJson.trim())

      this.#releases = scalingoApiReleases.map(mapScalingoApiReleaseToScalingoRelease)
    } catch (err) {
      throw new InternalError(`An error happened while parsing:\n\`${stdoutJson}\`.`, err)
    }

    this.#updateLastRelease()
  }

  #updateLastRelease(): void {
    this.#lastRelease = this.#releases.filter(({ isSlugLess }) => !isSlugLess).at(0)
  }
}
