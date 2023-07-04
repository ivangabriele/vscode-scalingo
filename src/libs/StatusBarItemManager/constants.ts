import { ThemeColor } from 'vscode'

import { type StatusBarItemProps } from './types'

export enum StatusBarItemState {
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NO_AUTH = 'NO_AUTH',
  NO_CLI = 'NO_CLI',
  NO_LINK = 'NO_LINK',
  NO_RELEASE = 'NO_RELEASE',
  RELEASE_FAILED = 'RELEASE_FAILED',
  RELEASE_PENDING = 'RELEASE_PENDING',
  RELEASE_SUCCEEDED = 'RELEASE_SUCCEEDED',
  SYNCING = 'SYNCING',
}

// https://code.visualstudio.com/api/references/vscode-api#StatusBarItem
export const STATUS_BAR_ITEM: Record<StatusBarItemState, StatusBarItemProps> = {
  [StatusBarItemState.INTERNAL_ERROR]: {
    backgroundColor: new ThemeColor('statusBarItem.errorBackground'),
    color: new ThemeColor('statusBarItem.errorForeground'),
    hasScalingoReleaseDescription: false,
    icon: 'alert',
    message: 'Scalingo (internal error)',
    tooltip: 'Sorry but something went wrong while checking Scalingo status.',
  },

  [StatusBarItemState.NO_AUTH]: {
    backgroundColor: new ThemeColor('statusBarItem.warningBackground'),
    color: new ThemeColor('statusBarItem.warningForeground'),
    command: 'extension.vscode-scalingo.logInToScalingoCli',
    hasScalingoReleaseDescription: false,
    icon: 'log-in',
    message: 'Scalingo (logged out)',
    tooltip: 'Log In to Scalingo CLI',
  },

  [StatusBarItemState.NO_CLI]: {
    backgroundColor: new ThemeColor('statusBarItem.errorBackground'),
    color: new ThemeColor('statusBarItem.errorForeground'),
    hasScalingoReleaseDescription: false,
    icon: 'alert',
    message: 'Scalingo (no CLI)',
    tooltip: "Scalingo CLI doesn't seem to be installed. Please install it and reload VS Code.",
  },

  [StatusBarItemState.NO_LINK]: {
    command: 'extension.vscode-scalingo.linkWorkspaceToScalingoApp',
    hasScalingoReleaseDescription: false,
    icon: 'debug-disconnect',
    message: 'Scalingo',
    tooltip: 'Link current workspace to an existing Scalingo application',
  },

  [StatusBarItemState.NO_RELEASE]: {
    hasScalingoReleaseDescription: false,
    icon: 'circle-slash',
    message: 'Scalingo',
    tooltip: 'No Scalingo deployment for this application yet.',
  },

  [StatusBarItemState.RELEASE_FAILED]: {
    backgroundColor: new ThemeColor('statusBarItem.warningBackground'),
    color: new ThemeColor('statusBarItem.warningForeground'),
    hasScalingoReleaseDescription: true,
    icon: 'error',
    message: 'Scalingo',
    tooltip: undefined,
  },

  [StatusBarItemState.RELEASE_PENDING]: {
    hasScalingoReleaseDescription: true,
    icon: 'gear-spin',
    message: 'Scalingo',
    tooltip: undefined,
  },

  [StatusBarItemState.RELEASE_SUCCEEDED]: {
    hasScalingoReleaseDescription: true,
    icon: 'pass',
    message: 'Scalingo',
    tooltip: undefined,
  },

  [StatusBarItemState.SYNCING]: {
    hasScalingoReleaseDescription: false,
    icon: 'sync-spin',
    message: 'Scalingo',
    tooltip: 'Fetching the current Scalingo deployment status...',
  },
}
