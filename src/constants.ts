import { Uri } from 'vscode'

export const ACTION = {
  NO_SCALINGO_AUTH: {
    label: 'Log into Scalingo',
  },
  NO_SCALINGO_CLI: {
    label: 'Download and install',
    uri: Uri.parse('https://devcenter.scalingo.com/articles/scalingo-cli#install-the-scalingo-cli'),
  },
}
