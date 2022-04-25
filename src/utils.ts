import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { execaCommand } from 'execa'

export function warn(str: string) {
  console.log(chalk.yellow.bold(str))
}
export function error(str: unknown) {
  console.log(chalk.red.bold(str))
}
export function success(str: string) {
  console.log(chalk.green.bold(str))
}

export function copy(src: string, dest: string, includePkg = true) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true })
    const files = fs.readdirSync(src)
    files.forEach(file => {
      copy(path.join(src, file), path.join(dest, file), includePkg)
    })
  } else {
    if (!src.includes('package.json') || includePkg) {
      fs.copyFileSync(src, dest)
    }
  }
}

export const pkgManager = ['pnpm', 'yarn', 'npm']
const defaultManager = 'npm'
export async function getAgent(manager: Array<string>, cwd: string) {
  async function execManager(index: number): Promise<string> {
    if (!manager[index]) {
      return defaultManager
    }
    try {
      const type = manager[index]
      await execaCommand(`${type} --help`, { cwd })
      return type
    } catch (error) {
      return execManager(index++)
    }
  }
  return execManager(0)
}
