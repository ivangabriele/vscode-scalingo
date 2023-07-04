import { exec } from './exec'

export async function isScalingoCliAuthenticated(): Promise<boolean | void> {
  const { stdout } = await exec('scalingo whoami')

  return stdout.includes('@')
}
