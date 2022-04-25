import path from 'path'
import fs from 'fs'
import { createCommander, QuestionName, Choices } from './command'
import { error, success, copy, getAgent, pkgManager } from './utils'
import { createNodeTs } from './node-ts'
import { createVueTs } from './vue-ts'
const templateRootDir = path.join(__filename, '../../templates')
const cwd = process.cwd()
export async function createTemplate() {
  const commandParams = await createCommander()
  const root = path.join(cwd, commandParams[QuestionName.PROJECT_NAME])
  //folder already exists
  if (fs.existsSync(root)) {
    error(`\nError:${root} already exists!`)
    return
  } else {
    fs.mkdirSync(root)
  }
  //start copy template
  success(`\nScaffolding project in ${root}...`)

  const choices = commandParams[QuestionName.TEMPLATE_TYPE]
  const name = commandParams[QuestionName.PROJECT_NAME]
  switch (choices) {
    case Choices.NODE_TS:
      createNodeTs(name)
      break
    case Choices.VUE_TS:
      createVueTs(name)
      break
    default:
      error(`\nError:${choices} is not supported!`)
  }
}
