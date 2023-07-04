import { $ } from 'execa'
import { window, workspace } from 'vscode'

import { type ScalingoApp } from './types'
import { exec } from '../helpers/exec'
import { handleError } from '../helpers/handleError'
import { showProgressNotification } from '../helpers/showProgressNotification'
import { statusBarItemManager } from '../libs/StatusBarItemManager'
import { UserError } from '../libs/UserError'

export async function linkWorkspaceToScalingoApp() {
  try {
    const firstWorkspaceFolder = workspace.workspaceFolders?.at(0)
    if (!firstWorkspaceFolder) {
      return
    }

    const currentWorkspaceDirectoryPath = firstWorkspaceFolder.uri.fsPath

    const scalingoAppsNames = await showProgressNotification('Listing current Scalingo apps...', async () => {
      const { stdout: scalingoAppsAsJson } = await exec(`scalingo apps -A --json`, { shouldThrowOnStderr: true })

      const scalingoAppsJson = JSON.parse(scalingoAppsAsJson.trim()) as ScalingoApp[]

      return scalingoAppsJson.map(({ name }) => name)
    })

    const scalingoAppName = await window.showQuickPick(scalingoAppsNames)
    if (scalingoAppName === undefined) {
      return
    }

    await showProgressNotification(`Linking current workspace to "${scalingoAppName}"...`, async () => {
      const { stderr } = await $({
        cwd: currentWorkspaceDirectoryPath,
      })`scalingo git:remote -a ${scalingoAppName}`
      if (stderr) {
        throw new UserError(
          `An error happened while linking your "${scalingoAppName}" Scalingo app to the current workspace.`,
          stderr,
        )
      }
    })

    statusBarItemManager.load()

    window.showInformationMessage(`Your current workspace is now linked to the  "${scalingoAppName}" Scalingo app.`)
  } catch (err) {
    handleError(err)
  }
}
