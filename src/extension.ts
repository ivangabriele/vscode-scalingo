import { commands, type ExtensionContext, workspace } from 'vscode'

import { linkWorkspaceToScalingoApp } from './commands/linkWorkspaceToScalingoApp'
import { logInToScalingoCli } from './commands/logInToScalingoCli'
import { logOutOfScalingoCli } from './commands/logOutOfScalingoCli'
import { handleError } from './helpers/handleError'
import { statusBarItemManager } from './libs/StatusBarItemManager'

export async function activate(context: ExtensionContext) {
  try {
    // -------------------------------------------------------------------------
    // Are we in a workspace?

    if (!workspace.workspaceFolders || workspace.workspaceFolders.length === 0) {
      return
    }

    // -------------------------------------------------------------------------
    // Register Scalingo commands

    const linkWorkspaceToScalingoAppDisposable = commands.registerCommand(
      'extension.vscode-scalingo.linkWorkspaceToScalingoApp',
      linkWorkspaceToScalingoApp,
    )
    const logInToScalingoCliDisposable = commands.registerCommand(
      'extension.vscode-scalingo.logInToScalingoCli',
      logInToScalingoCli,
    )
    const logOutOfScalingoCliDisposable = commands.registerCommand(
      'extension.vscode-scalingo.logOutOfScalingoCli',
      logOutOfScalingoCli,
    )

    context.subscriptions.push(linkWorkspaceToScalingoAppDisposable)
    context.subscriptions.push(logInToScalingoCliDisposable)
    context.subscriptions.push(logOutOfScalingoCliDisposable)

    // -------------------------------------------------------------------------
    // Launch Scalingo Status Bar Item

    statusBarItemManager.load(true)
  } catch (err) {
    handleError(err)
  }
}

export function deactivate() {}
