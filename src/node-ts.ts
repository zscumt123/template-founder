import path from 'path'
import fs from 'fs'
import { copy, success, getAgent, pkgManager } from './utils'
import { Choices } from './command'

export async function createNodeTs(projectName: string) {
  const templateRootDir = path.join(__dirname, '../templates')
  const cwd = process.cwd()
  const root = path.join(cwd, projectName)
  const templateDir = path.join(templateRootDir, Choices.NODE_TS)
  copy(templateDir, root, false)

  //modify package.json name
  const pkg = require(path.join(templateDir, 'package.json'))
  const packJson = pkg.default || pkg
  packJson.name = projectName
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packJson, null, 2)
  )
  success(`\nDone. Now run:\n`)
  const manager = await getAgent(pkgManager, root)
  if (root !== cwd) {
    success(`  cd ${path.relative(cwd, root)}`)
  }
  success(`  ${manager} install\n`)
  success('to start your project!')
}
