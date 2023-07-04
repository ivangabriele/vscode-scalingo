import { window } from 'vscode'

import { exec } from '../helpers/exec'
import { handleError } from '../helpers/handleError'
import { showProgressNotification } from '../helpers/showProgressNotification'
import { statusBarItemManager } from '../libs/StatusBarItemManager'

export async function logOutOfScalingoCli() {
  try {
    await showProgressNotification('Logging out from Scalingo...', async () => {
      await exec('scalingo logout')
    })

    statusBarItemManager.load()

    window.showInformationMessage('You are now logged out of Scalingo CLI.')
  } catch (err) {
    handleError(err)
  }
}
