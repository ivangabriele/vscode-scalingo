import isCommand from 'is-command'
import moment from 'moment'
import { StatusBarAlignment, type StatusBarItem, window, commands } from 'vscode'

import { STATUS_BAR_ITEM, StatusBarItemState } from './constants'
import { mapScalingoApiReleaseStatusToStatusBarItemState } from './utils'
import { ACTION } from '../../constants'
import { exec } from '../../helpers/exec'
import { handleError } from '../../helpers/handleError'
import { isEmpty } from '../../helpers/isEmpty'
import { isScalingoCliAuthenticated } from '../../helpers/isScalingoCliAuthenticated'
import { shortenMomentOutput } from '../../helpers/shortenMomentOutput'
import { ScalingoReleaseManager } from '../ScalingoReleaseManager'

import type { ScalingoRelease } from '../ScalingoReleaseManager/types'

const REFRESH_DELAY: number = 2_000

class StatusBarItemManager {
  #appName: string | undefined
  #lastMessage: string | undefined
  #lastState: StatusBarItemState | undefined
  #statusBarItem: StatusBarItem

  constructor() {
    this.#statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left)
  }

  async load(isFirstLoad = false): Promise<void> {
    // -------------------------------------------------------------------------
    // Is Scalingo CLI available?

    if (!(await isCommand('scalingo'))) {
      this.#updateItem(StatusBarItemState.NO_CLI)
      this.#statusBarItem.show()

      if (isFirstLoad) {
        const action = await window.showWarningMessage(
          "Scalingo CLI doesn't seem to be installed. Please install it and reload VS Code.",
          ACTION.NO_SCALINGO_CLI.label,
        )

        if (action === ACTION.NO_SCALINGO_CLI.label) {
          commands.executeCommand('vscode.open', ACTION.NO_SCALINGO_CLI.uri)
        }
      }

      return
    }

    // -------------------------------------------------------------------------
    // Is Scalingo CLI authenticated?

    if (!(await isScalingoCliAuthenticated())) {
      this.#updateItem(StatusBarItemState.NO_AUTH)
      this.#statusBarItem.show()

      if (isFirstLoad) {
        const action = await window.showWarningMessage(
          'You are not logged in to Scalingo CLI. Do you want to log in?',
          ACTION.NO_SCALINGO_AUTH.label,
        )

        if (action === ACTION.NO_SCALINGO_AUTH.label) {
          commands.executeCommand('extension.vscode-scalingo.logInToScalingoCli')
        }
      }

      return
    }

    if (await isScalingoCliAuthenticated()) {
      await this.#updateAppName()
      if (this.#appName) {
        this.#updateItem(StatusBarItemState.SYNCING)
      } else {
        this.#updateItem(StatusBarItemState.NO_LINK)
      }
    }

    this.#statusBarItem.show()

    if (this.#appName) {
      this.#updateRelease()
    }
  }

  // @todo Handle multiple Scalingo apps case.
  async #updateAppName(): Promise<void> {
    try {
      const { stdout } = await exec('git remote -v')

      const foundScalingoRepositories = stdout.match(/(https:\/\/git\.scalingo\.com\/|git@scalingo\.com:)([^\s.]+)/gi)
      if (!foundScalingoRepositories || foundScalingoRepositories.length === 0) {
        this.#appName = undefined

        return
      }

      const firstRepositoryUrl = foundScalingoRepositories[0]
      this.#appName = foundScalingoRepositories[0].substring(firstRepositoryUrl.startsWith('https') ? 23 : 15)
    } catch (err) {
      this.#appName = undefined

      handleError(err)
    }
  }

  #updateItem(state: StatusBarItemState, scalingoRelease?: ScalingoRelease): void {
    const statusBarItem = STATUS_BAR_ITEM[state]

    let messageWithIcon = `$(${statusBarItem.icon}) ${statusBarItem.message}`
    if (scalingoRelease) {
      messageWithIcon += ` v${scalingoRelease.version}`
    }
    if (scalingoRelease) {
      messageWithIcon += ` (${shortenMomentOutput(moment(scalingoRelease?.createdAt).fromNow())})`
    }

    if (state === this.#lastState && statusBarItem.message === this.#lastMessage) {
      return
    }

    const tooltip = statusBarItem.hasScalingoReleaseDescription ? statusBarItem.tooltip : scalingoRelease?.description

    this.#lastMessage = statusBarItem.message
    this.#lastState = state
    this.#statusBarItem.backgroundColor = statusBarItem.backgroundColor
    this.#statusBarItem.command = statusBarItem.command
    this.#statusBarItem.color = statusBarItem.color
    this.#statusBarItem.text = messageWithIcon
    this.#statusBarItem.tooltip = tooltip
  }

  async #updateRelease() {
    try {
      if (!this.#appName) {
        return
      }

      const statement = `scalingo releases -a ${this.#appName} --json -n=10`
      const { stderr, stdout } = await exec(statement)
      if (!isEmpty(stderr)) {
        this.#updateItem(StatusBarItemState.INTERNAL_ERROR)
        await window.showErrorMessage(`An error happened while running \`${statement}\`: "${stderr}".`)

        return
      }

      const scalingoReleasesManager = new ScalingoReleaseManager(stdout)
      if (!scalingoReleasesManager.lastRelease) {
        this.#updateItem(StatusBarItemState.NO_RELEASE)
        setTimeout(() => this.#updateRelease(), REFRESH_DELAY)

        return
      }

      const state = mapScalingoApiReleaseStatusToStatusBarItemState(scalingoReleasesManager.lastRelease.status)

      this.#updateItem(state, scalingoReleasesManager.lastRelease)
      setTimeout(() => this.#updateRelease(), REFRESH_DELAY)
    } catch (err) {
      handleError(err)
    }
  }
}

export const statusBarItemManager = new StatusBarItemManager()
