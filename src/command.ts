import { prompt, ListQuestionOptions, InputQuestionOptions } from 'inquirer'

export enum QuestionName {
  PROJECT_NAME = 'project_name',
  TEMPLATE_TYPE = 'template_type'
}
export enum Choices {
  NODE_TS = 'node-ts',
  VUE_TS = 'vue-ts'
}
interface Answers {
  [QuestionName.PROJECT_NAME]: string
  [QuestionName.TEMPLATE_TYPE]: Choices
}
const listQuestion: ListQuestionOptions = {
  type: 'list',
  name: QuestionName.TEMPLATE_TYPE,
  message: 'what type of template you need to create?',
  choices: [Choices.NODE_TS, Choices.VUE_TS]
}
const inputQuestion: InputQuestionOptions = {
  type: 'input',
  default: 'my-project',
  name: QuestionName.PROJECT_NAME,
  message: 'what is your project name?'
}
const questions = [inputQuestion, listQuestion]
export async function createCommander() {
  try {
    const res = await prompt<Answers>(questions)
    return res
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}
