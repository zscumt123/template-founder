import path from 'path'
import fs from 'fs'
import { execaCommand } from 'execa'
import { Choices } from './command'
import { getAgent, pkgManager, copy, success, error } from './utils'

const commandInfo = {
  npm: 'npm init vite@latest <name> --template',
  yarn: 'yarn create vite <name>  --template',
  pnpm: 'pnpm create vite <name>  -- --template'
}

export async function createVueTs(projectName: string) {
  const templateRootDir = path.join(__dirname, '../templates')
  const cwd = process.cwd()
  const root = path.join(cwd, projectName)
  const templateDir = path.join(templateRootDir, Choices.VUE_TS)
  //exec create vite vue-ts project

  const manager = (await getAgent(pkgManager, root)) as keyof typeof commandInfo
  try {
    await execaCommand(
      `${commandInfo[manager].replace('<name>', projectName)} vue-ts`,
      {
        cwd: cwd
      }
    )
    const pkgPath = path.join(root, 'package.json')
    const pkg = require(pkgPath)
    //modify package.json name and dependencies
    pkg.name = projectName
    pkg.devDependencies = pkg.devDependencies || {}
    pkg.devDependencies['@efficient/eslint-config-vue'] = '^0.0.1'
    pkg.devDependencies['eslint'] = '^8.14.0'
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
    //copy
    copy(templateDir, root, false)
    success(`\nDone. Now run:\n`)
    if (root !== cwd) {
      success(`  cd ${path.relative(cwd, root)}`)
    }
    success(`  ${manager} install\n`)
    success('to start your project!')
  } catch (err) {
    error(err)
  }

  //modify package.json name
  //   const pkg = require(path.join(templateDir, 'package.json'))
  //   const packJson = pkg.default || pkg
  //   packJson.name = projectName
  //   fs.writeFileSync(
  //     path.join(root, 'package.json'),
  //     JSON.stringify(packJson, null, 2)
  //   )
  //   success(`\nDone. Now run:\n`)
  //   const manager = await getAgent(pkgManager, root)
  //   if (root !== cwd) {
  //     success(`  cd ${path.relative(cwd, root)}`)
  //   }
  //   success(`  ${manager} install\n`)
  //   success('to start your project!')
}
